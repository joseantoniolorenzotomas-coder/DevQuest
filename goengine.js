// DevQuest Go — Mini intérprete de Go para los ejercicios
//
// Tampoco hay Go en el navegador, así que escribimos un intérprete del
// subconjunto que se enseña en el curso. Mismo criterio que con SQL, Java, C++
// y PHP: puro, determinista y sin dependencias, para que las soluciones de los
// ejercicios se puedan ejecutar también en los tests de Node.
//
// Cubre:
//   programa    package main, import, func main(), package e import de prueba
//   variables   var, := , const, múltiples, intercambio a, b = b, a
//   tipos       int, float64, string, bool, rune, byte y nil
//   operadores  + - * / % y && || ! == != < > <= >= , += -= *= /= ++ --
//   control     if / else if / else, switch (sin fallthrough), for clásico,
//               for con condición y for range
//   funciones   parámetros, varios valores de retorno, defer
//   errores     error como interfaz, nil, fmt.Errorf
//   compuestos  slices (append, len, indexación, sub-slices), mapas,
//               structs con métodos y receivers de valor o puntero
//   salida      fmt.Println, fmt.Print, fmt.Printf, fmt.Sprintf, len, cap,
//               errors.New
//
// Lo que NO cubre, y por tanto el temario no usa: goroutines reales, canales,
// select, generics, interfaces con métodos múltiples, reflect, sincronización
// ni la biblioteca de la web.
//
// Go es de tipado estático: los tipos se declaran y no se deducen al asignar.
// `x := 5` crea un int, y asignarle luego un string es un error de compilación,
// no una conversión. El motor lo comprueba y avisa.

window.GO_ENGINE = (function () {

  // ════════════════════════════════════════════════
  // ERRORES
  // ════════════════════════════════════════════════

  class ErrorGo extends Error {
    constructor(mensaje, linea) {
      super(linea ? `Línea ${linea}: ${mensaje}` : mensaje);
      this.name = 'ErrorGo';
      this.linea = linea || 0;
    }
  }

  // ════════════════════════════════════════════════
  // PALABRAS RESERVADAS
  // ════════════════════════════════════════════════

  /**
   * Los nombres de TIPO de Go, y solo eso.
   *
   * La lista sirve para dos cosas: saber si algo es una conversión
   * (float64(x)) y decidir si un identificador de una lista de parámetros es
   * un nombre o un tipo. Por eso aquí no caben make, new ni las demás palabras
   * clave: `make([]int, 3)` es una llamada a la función make, no una
   * conversión, y si make estuviera aquí se parsearía como si lo fuera.
   */
  const PALABRAS = new Set([
    'string', 'int', 'int8', 'int16', 'int32', 'int64',
    'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uintptr',
    'float32', 'float64', 'byte', 'rune', 'bool', 'error', 'any'
  ]);

  /** Cuál es el tipo de un literal numérico, según cómo esté escrito. */
  function tipoDeLiteral(texto) {
    if (/^0[xX]/.test(texto)) return 'int';
    if (/[.eE]/.test(texto) && !/^0[xX]/.test(texto)) return 'float';
    return 'int';
  }

  // ════════════════════════════════════════════════
  // VALORES
  //
  // Go tiene tipado estático, así que cada valor lleva su tipo. No hay "valor
  // sin tipo": por eso un int y un float64 son valores distintos y mezclarlos
  // es un error, igual que en Go.
  // ════════════════════════════════════════════════

  function V(tipo, dato) {
    return { tipo, dato };
  }

  /** Bytes UTF-8 de un texto, sin depender de `Buffer` (no existe en el navegador). */
  function bytesUtf8(texto) {
    return Array.from(new TextEncoder().encode(String(texto)));
  }

  const Tipos = {
    int: (n) => V('int', Number(n)),
    float: (n) => V('float64', Number(n)),
    cadena: (s) => V('string', String(s)),
    bool: (b) => V('bool', !!b),
    rune: (n) => V('rune', Number(n)),
    nil: () => V('nil', null)
  };

  /**
   * El valor cero de cada tipo: es lo que hay antes de asignar nada.
   *
   * Un puntero vale nil, que es lo que explica que `var p *int; *p` avise de
   * que se está usando un puntero que no apunta a nada.
   */
  function valorCero(tipo) {
    if (typeof tipo === 'string' && tipo.startsWith('*')) return V('pointer', null);
    if (typeof tipo === 'string' && tipo.startsWith('map[')) {
      const m = V('map', new Map());
      m._tipoValor = tipo.slice(tipo.indexOf(']') + 1);
      return m;
    }
    if (typeof tipo === 'string' && tipo.startsWith('[]')) {
      return V('slice', []);
    }
    switch (tipo) {
      case 'int': return V('int', 0);
      case 'int8': case 'int16': case 'int32': case 'int64':
      case 'uint': case 'uint8': case 'uint16': case 'uint32': case 'uint64':
      case 'uintptr': case 'byte': case 'rune':
        return V(tipo, 0);
      case 'float32': case 'float64': return V(tipo, 0);
      case 'string': return V('string', '');
      case 'bool': return V('bool', false);
      case 'error': return V('error', null);
      default: return V(tipo, null);   // slice, map, chan, ptr, struct
    }
  }

  /** Cómo escribe Go un valor con %v: el formato por defecto de cada tipo. */
  function formatear(valor, opciones) {
    const o = opciones || {};
    if (!valor) return '%!v(nil)';

    switch (valor.tipo) {
      case 'int': case 'int8': case 'int16': case 'int32': case 'int64':
      case 'uint': case 'uint8': case 'uint16': case 'uint32': case 'uint64':
      case 'uintptr':
        return String(Math.trunc(valor.dato));

      case 'byte':
        return String.fromCharCode(valor.dato);

      case 'rune':
        return "'" + String.fromCharCode(valor.dato) + "'";

      case 'float32': case 'float64':
        return formatearFloat(valor.dato, o);

      case 'string':
        return valor.dato;

      case 'bool':
        return valor.dato ? 'true' : 'false';

      case 'nil':
        return '<nil>';

      case 'error':
        return valor.dato === null ? '<nil>' : String(valor.dato);

      case 'slice': {
        if (o.recursivo) return '[' + valor.dato.join(' ') + ']';
        return '[' + valor.dato.map(v => formatear(v)).join(' ') + ']';
      }

      case 'map': {
        if (o.recursivo) {
          const partes = [...valor.dato.keys()].sort().map(k =>
            formatear(k) + ':' + formatear(valor.dato.get(k)));
          return 'map[' + partes.join(' ') + ']';
        }
        const partes = [...valor.dato.keys()].map(k =>
          formatear(k) + ':' + formatear(valor.dato.get(k)));
        return 'map[' + partes.join(' ') + ']';
      }

      case 'struct': {
        const partes = Object.keys(valor.dato).map(campo => {
          const v = valor.dato[campo];
          const etiqueta = v && v.tipo ? ' ' + campo + ':' : '';
          return (etiqueta || campo) + ':' + formatear(v);
        });
        return '{' + partes.join(' ') + '}';
      }

      case 'pointer':
        return valor.dato === null ? '<nil>' : '&' + formatear(valor.dato, o);

      case 'func':
        return '<func>';

      default:
        return String(valor.dato);
    }
  }

  /**
   * Go escribe los float de la manera más corta que los representa de nuevo,
   * así que 5.0 sale 5, 0.1+0.2 sale 0.30000000000000004 y 3.0 sale 3.
   * No es un capricho: sale del Float64 del lenguaje.
   */
  function formatearFloat(n, opciones) {
    const o = opciones || {};
    if (Number.isNaN(n)) return 'NaN';
    if (n === Infinity) return '+Inf';
    if (n === -Infinity) return '-Inf';

    if (o.precision !== undefined) return n.toFixed(o.precision);

    if (Number.isInteger(n) && Math.abs(n) < 1e21) {
      // 5.0 sale 5 y no 5.0: Go usa la representación más corta
      return String(n);
    }
    return String(n);
  }

  /**
   * Escribe un valor como lo haría fmt.Println / Print.
   *
   * Dos detalles que Lua pasan por alto y en Go importan mucho:
   *   · Println mete un espacio entre cada argumento
   *   · Println añade el salto de línea, Print no
   */
  function unirPrintln(valores, saltoFinal) {
    return valores.map(v => formatear(v)).join(' ') + (saltoFinal ? '\n' : '');
  }

  /** El tipo que se le da a un literal numérico según su contexto. */
  function tipoDeExpresion(v) {
    return v ? v.tipo : 'nil';
  }

  // ════════════════════════════════════════════════
  // LÉXICO
  // ════════════════════════════════════════════════

  function tokenizar(src) {
    let s = String(src == null ? '' : src);

    // package main y los import sobran para ejecutar: se leen y se guardan,
    // pero no afectan al comportamiento del programa.
    s = s.replace(/^\s*package\s+\w+\s*$/gm, '');
    s = s.replace(/^\s*import\s+\([^)]*\)/gm, '');
    s = s.replace(/^\s*import\s+("[^"]*"|\w+)\s*$/gm, '');

    const tokens = [];
    let i = 0;
    let linea = 1;

    while (i < s.length) {
      const c = s[i];

      if (c === '\n') { linea++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }

      if (c === '/' && s[i + 1] === '/') {
        while (i < s.length && s[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && s[i + 1] === '*') {
        i += 2;
        while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) {
          if (s[i] === '\n') linea++;
          i++;
        }
        i += 2;
        continue;
      }

      // Cadena interpretada: admite \n, \t, \" y \\
      if (c === '"') {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === '\n') { linea++; valor += '\n'; i++; continue; }
          if (s[i] === '\\') {
            const esc = s[i + 1];
            valor += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === 'r' ? '\r'
              : esc === '\\' ? '\\' : esc === '"' ? '"' : esc === "'" ? "'"
              : esc === '0' ? '\0' : esc;
            i += 2;
            continue;
          }
          valor += s[i];
          i++;
        }
        i++;
        tokens.push({ t: 'Cadena', v: valor, linea });
        continue;
      }

      // Cadena cruda: entre acentos graves, sin interpretar escapes
      if (c === '`') {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== '`') {
          if (s[i] === '\n') linea++;
          valor += s[i];
          i++;
        }
        i++;
        tokens.push({ t: 'Cadena', v: valor, cruda: true, linea });
        continue;
      }

      // Carácter: 'a', '\n', '\''
      if (c === "'") {
        i++;
        let valor = '';
        if (s[i] === '\\') {
          const esc = s[i + 1];
          valor = esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === 'r' ? '\r'
            : esc === '\\' ? '\\' : esc === "'" ? "'" : esc;
          i += 2;
        } else {
          valor = s[i];
          i++;
        }
        if (s[i] === "'") i++;
        tokens.push({ t: 'Rune', v: valor, linea });
        continue;
      }

      // Números: 42, 3.14, 1e9, 0xFF, 1_000
      if (/[0-9]/.test(c)) {
        let n = '';
        while (i < s.length && /[0-9a-fA-FxX._]/.test(s[i])) { n += s[i]; i++; }
        const limpio = n.replace(/_/g, '');
        tokens.push({ t: 'Num', v: Number(limpio), texto: limpio, linea });
        continue;
      }

      if (/[A-Za-z_À-ÿ]/.test(c)) {
        let id = '';
        while (i < s.length && /[A-Za-z0-9_À-ÿ]/.test(s[i])) { id += s[i]; i++; }
        tokens.push({ t: 'Id', v: id, linea });
        continue;
      }

      const ops3 = ['<<=', '>>=', '...'];
      const ops2 = [':=', '==', '!=', '<=', '>=', '&&', '||', '<<', '>>',
        '+=', '-=', '*=', '/=', '%=', '&^', '++', '--'];
      if (ops3.includes(s.slice(i, i + 3))) { tokens.push({ t: 'Op', v: s.slice(i, i + 3), linea }); i += 3; continue; }
      if (ops2.includes(s.slice(i, i + 2))) { tokens.push({ t: 'Op', v: s.slice(i, i + 2), linea }); i += 2; continue; }

      if ('+-*/%<>=!&|^,;:.()[]{}'.includes(c)) { tokens.push({ t: 'Op', v: c, linea }); i++; continue; }

      throw new ErrorGo(`carácter inesperado "${c}"`, linea);
    }

    tokens.push({ t: 'EOF', v: null, linea });
    return tokens;
  }

  // ════════════════════════════════════════════════
  // ANALIZADOR
  // ════════════════════════════════════════════════

  /** ¿Es este token el nombre de un tipo, como int o string? */
  function tEsTipoSimple(t) {
    if (!t || t.t !== 'Id') return false;
    return PALABRAS.has(t.v) || t.v === 'error';
  }

  function Analizador(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  Analizador.prototype = {
    peek(n = 0) { return this.tokens[this.pos + n]; },
    actual() { return this.tokens[this.pos]; },
    linea() { return this.actual().linea; },
    come() { return this.tokens[this.pos++]; },

    es(valor) {
      const t = this.actual();
      return (t.t === 'Op' || t.t === 'Id') && t.v === valor;
    },
    esPalabra(p) { return this.actual().t === 'Id' && this.actual().v === p; },

    espera(valor) {
      if (!this.es(valor)) {
        const encontrado = this.actual().v === null ? 'fin del programa' : `"${this.actual().v}"`;
        throw new ErrorGo(`se esperaba "${valor}" pero se encontró ${encontrado}`, this.linea());
      }
      return this.come();
    },

    /** En Go el punto y coma es automático: se puede escribir de más y no pasa nada. */
    puntoYComa() { while (this.es(';')) this.come(); },

    // ── Expresiones ──

    expresion() { return this.expresionAsignacion(); },

    /**
     * La asignación es una expresión en Go, no una sentencia: por eso puede
     * aparecer dentro de un for o de un return.
     */
    expresionAsignacion() {
      const izq = this.expresionSimple();

      if (this.es(':=')) {
        this.come();
        return { t: 'declCorta', izq, der: this.expresionAsignacion(), linea: this.linea() };
      }
      if (this.es('=')) {
        this.come();
        return { t: 'asigna', izq, der: this.expresionAsignacion(), linea: this.linea() };
      }
      const op = this.actual().v;
      if (['+=', '-=', '*=', '/=', '%='].includes(op) && this.actual().t === 'Op') {
        this.come();
        return { t: 'asignaCompuesta', op, izq, der: this.expresion(), linea: this.linea() };
      }
      return izq;
    },

    expresionSimple() { return this.ternario(); },

    ternario() {
      const cond = this.oLogico();
      return cond;
    },

    oLogico() {
      let izq = this.yLogico();
      while (this.es('||')) {
        this.come();
        izq = { t: 'or', izq, der: this.yLogico() };
      }
      return izq;
    },

    yLogico() {
      let izq = this.igualdad();
      while (this.es('&&')) {
        this.come();
        izq = { t: 'and', izq, der: this.igualdad() };
      }
      return izq;
    },

    igualdad() {
      let izq = this.relacional();
      while (this.es('==') || this.es('!=')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: this.relacional() };
      }
      return izq;
    },

    relacional() {
      let izq = this.adicion();
      while (this.es('<') || this.es('>') || this.es('<=') || this.es('>=')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: this.adicion() };
      }
      return izq;
    },

    adicion() {
      let izq = this.multiplicacion();
      while (this.es('+') || this.es('-')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: this.multiplicacion() };
      }
      return izq;
    },

    multiplicacion() {
      let izq = this.unario();
      while (this.es('*') || this.es('/') || this.es('%')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: this.unario() };
      }
      return izq;
    },

    unario() {
      if (this.es('!')) { this.come(); return { t: 'no', exp: this.unario() }; }
      if (this.es('-')) { this.come(); return { t: 'menos', exp: this.unario() }; }
      if (this.es('+')) { this.come(); return this.unario(); }
      if (this.es('&')) { this.come(); return { t: 'direccion', exp: this.unario() }; }
      if (this.es('*')) { this.come(); return { t: 'desref', exp: this.unario() }; }
      return this.postfijo();
    },

    postfijo() {
      let exp = this.primario();
      while (this.es('++') || this.es('--')) {
        const op = this.come().v;
        exp = { t: 'postinc', op, exp };
      }
      return exp;
    },

    primario() {
      const t = this.actual();

      if (t.t === 'Num') {
        this.come();
        const esFloat = tipoDeLiteral(t.texto) === 'float';
        const v = esFloat ? V('float64', t.v) : V('int', t.v);
        // En Go un literal es una constante sin tipo, y por eso `var x float64 = 5`
        // es legal: la constante se adapta al tipo que le pidan
        v.sinTipo = true;
        return { t: 'lit', v, linea: t.linea };
      }

      if (t.t === 'Cadena') { this.come(); return { t: 'lit', v: V('string', t.v), linea: t.linea }; }
      if (t.t === 'Rune') { this.come(); return { t: 'lit', v: V('rune', t.v.codePointAt(0)), linea: t.linea }; }

      if (this.es('(')) {
        this.come();
        const exp = this.expresion();
        this.espera(')');
        return { t: 'paren', exp };
      }

      if (this.es('&')) { this.come(); return { t: 'direccion', exp: this.unario() }; }

      // Slice literal: []int{1, 2, 3}
      if (this.es('[')) return this.sliceLiteral();

      // Conversión de tipo: int(x), float64(x), string(x)
      if (t.t === 'Id' && this.peek(1).t === 'Op' && this.peek(1).v === '('
        && PALABRAS.has(t.v)) {
        this.come();
        this.come();
        const arg = this.expresion();
        this.espera(')');
        return { t: 'conversion', tipo: t.v, exp: arg, linea: t.linea };
      }

      if (t.t === 'Id') {
        if (t.v === 'true') { this.come(); return { t: 'lit', v: V('bool', true), linea: t.linea }; }
        if (t.v === 'false') { this.come(); return { t: 'lit', v: V('bool', false), linea: t.linea }; }
        if (t.v === 'nil') { this.come(); return { t: 'lit', v: V('nil', null), linea: t.linea }; }

        if (t.v === 'make') return this.make();
        if (t.v === 'new') return this.newTipo();

        // Literal de mapa: map[string]int{"a": 1, "b": 2}
        if (t.v === 'map' && this.peek(1).v === '[') return this.mapLiteral();

        this.come();
        // Un nombre solo es una variable. Solo si detrás viene un paréntesis
        // es una llamada: fmt.Println entra por aquí y es un caso aparte
        // porque detrás del punto hay otra cosa.
        if (this.es('(')) {
          return this.cadenaMiembros({ t: 'llamada', nombre: t.v, args: this.argumentos(), linea: t.linea });
        }

        // Punto{x: 3, y: 4}: un tipo con llaves detrás es siempre un struct.
        // Go pone en mayúscula los nombres de tipo, así que se comprueba eso.
        if (this.es('{') && /^[A-Z]/.test(t.v)) return this.structLiteral(t.v, t.linea);

        return this.cadenaMiembros({ t: 'id', v: t.v, linea: t.linea });
      }

      throw new ErrorGo(
        `no se esperaba ${t.v === null ? 'el fin del programa' : `"${t.v}"`}`, t.linea);
    },

    /** []int{...} y también []int(len), []int{...} */
    sliceLiteral() {
      const linea = this.linea();
      this.espera('[');

      // Slice vacío: []T{}
      if (this.es(']')) {
        this.come();
        const elem = this.tipo();
        if (this.es('{')) {
          this.come();
          const elems = [];
          if (!this.es('}')) {
            do { elems.push(this.expresion()); } while (this.es(',') && (this.come(), true));
          }
          this.espera('}');
          return { t: 'sliceLit', elem, elems, linea };
        }
        if (this.es('(')) {
          this.come();
          const largo = this.expresion();
          this.espera(')');
          return { t: 'makeSlice', elem, largo, linea };
        }
        return { t: 'makeSlice', elem, largo: null, linea };
      }

      // Array de tamaño fijo: [5]int — no entra en el temario pero se acepta
      if (this.actual().t === 'Num' && this.peek(1).v === ']') {
        this.come();
        this.come();
        const elem = this.tipo();
        return { t: 'sliceLit', elem, elems: [], linea };
      }

      // Slicing: a[1:3], a[:2], a[2:]
      const desde = this.expresion();
      let hasta = null;
      if (this.es(':')) {
        this.come();
        if (!this.es(']')) hasta = this.expresion();
        this.espera(']');
        return { t: 'rebanada', exp: desde, desde: null, hasta, linea };
      }
      this.espera(']');

      // Puede ser un índice normal o el inicio de un slice: a[i:j]
      if (this.es(':')) {
        this.come();
        hasta = this.es(']') ? null : this.expresion();
        this.espera(']');
        return { t: 'rebanada', exp: desde, desde: null, hasta, linea };
      }
      return { t: 'indice', exp: desde, indice: hasta, linea };
    },

    /** Punto{x: 3, y: 4} */
    structLiteral(nombreTipo, linea) {
      const campos = [];
      this.espera('{');
      if (!this.es('}')) {
        do {
          const nombre = this.actual().v;
          this.come();
          this.espera(':');
          campos.push({ nombre, valor: this.expresion() });
        } while (this.es(',') && (this.come(), true));
      }
      this.espera('}');
      return { t: 'structLit', tipo: nombreTipo, campos, linea };
    },

    /** map[string]int{"a": 1, "b": 2} */
    mapLiteral() {
      const linea = this.linea();
      this.come();                                  // map
      this.espera('[');
      const clave = this.tipo();
      this.espera(']');
      const valor = this.tipo();

      const pares = [];
      if (this.es('{')) {
        this.come();
        if (!this.es('}')) {
          do {
            const k = this.expresion();
            this.espera(':');
            pares.push({ clave: k, valor: this.expresion() });
          } while (this.es(',') && (this.come(), true));
        }
        this.espera('}');
      }
      return { t: 'mapLit', clave, valor, pares, linea };
    },

    /** make([]int, 3), make([]int, 3, 10), make(map[string]int) */
    make() {
      const linea = this.linea();
      this.come();
      this.espera('(');

      if (this.es('map')) {
        this.come();
        this.espera('[');
        const clave = this.tipo();
        this.espera(']');
        const valor = this.tipo();
        this.espera(')');
        return { t: 'makeMap', clave, valor, linea };
      }

      if (this.es('chan')) {
        this.come();
        this.tipo(); // se valida el tipo, pero el canal no guarda el elemento
        this.espera(')');
        return { t: 'lit', v: V('chan', null), linea };
      }

      // make([]int, 3, 10): aquí solo se lee el tipo del elemento, no el del
      // slice entero. Si se usara tipo() vendría "[]int" y el slice se
      // llenaría de slices vacíos en vez de ceros.
      if (this.es('[')) {
        this.come();
        this.espera(']');
        const elem = this.tipo();
        const largo = this.es(',') ? (this.come(), this.expresion()) : null;
        const capacidad = this.es(',') ? (this.come(), this.expresion()) : null;
        this.espera(')');
        return { t: 'makeSlice', elem, largo, cap: capacidad, linea };
      }

      const tipo = this.tipo();
      this.espera(')');
      return { t: 'lit', v: valorCero(tipo), linea };
    },

    /** new(int) devuelve un *int con el valor cero */
    newTipo() {
      const linea = this.linea();
      this.come();
      this.espera('(');
      const tipo = this.tipo();
      this.espera(')');
      return { t: 'new', tipo, linea };
    },

    /** Un tipo: int, []int, map[string]int, *Persona */
    tipo() {
      const t = this.actual();

      if (this.es('*')) { this.come(); return '*' + this.tipo(); }

      if (this.es('[')) {
        this.come();
        if (this.es(']')) {
          this.come();
          return '[]' + this.tipo();
        }
        // [5]int: array de tamaño fijo, aquí se guarda como slice
        this.come();
        this.espera(']');
        return '[]' + this.tipo();
      }

      if (this.es('map')) {
        this.come();
        this.espera('[');
        const clave = this.tipo();
        this.espera(']');
        const valor = this.tipo();
        return 'map[' + clave + ']' + valor;
      }

      if (t.t === 'Id') { this.come(); return t.v; }

      throw new ErrorGo('esperaba un tipo', this.linea());
    },

    argumentos() {
      this.espera('(');
      const args = [];
      if (!this.es(')')) {
        do { args.push(this.expresion()); } while (this.es(',') && (this.come(), true));
      }
      this.espera(')');
      return args;
    },

    /**
     * Después de un nombre: .campo, (args), [índice].
     *
     * Aquí está el caso de los paquetes: `fmt.Println` no es leer un campo,
     * es llamar a una función del paquete fmt. Y `p.Area()` sí es un método
     * sobre una variable. Los dos llegan por el mismo `.`, así que hay que
     * distinguirlos por lo que haya detrás del punto.
     */
    cadenaMiembros(base) {
      let expr = base;
      while (true) {
        if (this.es('(')) {
          if (expr.t === 'llamada') {
            expr = { t: 'llamada', nombre: expr.nombre, args: this.argumentos(), linea: expr.linea };
          } else {
            throw new ErrorGo('no se puede llamar así', this.linea());
          }
          continue;
        }
        if (this.es('.')) {
          this.come();
          const nombre = this.actual();
          this.come();

          if (this.es('(')) {
            // Método sobre un valor: p.Area(), rec.Valor(), s.Campo()
            this.come();
            const args = [];
            if (!this.es(')')) {
              do { args.push(this.expresion()); } while (this.es(',') && (this.come(), true));
            }
            this.espera(')');
            expr = { t: 'metodo', obj: expr, nombre: nombre.v, args, linea: expr.linea };
            continue;
          }

          expr = { t: 'miembro', obj: expr, nombre: nombre.v, linea: expr.linea };
          continue;
        }
        if (this.es('[')) {
          const guardado = this.pos;
          this.come();
          const desde = this.es(':') ? null : this.expresion();
          if (this.es(':')) {
            // Es un rebanado, no un índice: a[i:j]
            this.pos = guardado;
            this.come();
            const d = this.es(':') ? null : this.expresion();
            this.come();
            const h = this.es(']') ? null : this.expresion();
            this.espera(']');
            expr = { t: 'rebanada', exp: expr, desde: d, hasta: h, linea: expr.linea };
            continue;
          }
          this.espera(']');
          expr = { t: 'indice', exp: expr, indice: desde, linea: expr.linea };
          continue;
        }
        break;
      }
      return expr;
    },

    // ── Tipos declarados ──

    declaracionTipo() {
      // type Nombre struct { ... }
      this.come();                          // type
      const nombre = this.actual().v;
      this.come();

      if (!this.es('struct')) {
        // type Alias int — no entra en el temario pero no debe romper
        const base = this.tipo();
        return { nombre, tipo: base, struct: false, campos: [] };
      }

      this.come();                          // struct
      this.espera('{');
      const campos = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') throw new ErrorGo('falta cerrar el struct', this.linea());
        const nombres = [this.actual().v];
        this.come();
        while (this.es(',')) { this.come(); nombres.push(this.actual().v); this.come(); }
        const tipo = this.tipo();
        this.puntoYComa();
        campos.push({ nombres, tipo });
      }
      this.espera('}');
      return { nombre, tipo: 'struct', struct: true, campos };
    },

    /**
     * Una declaración de la lista de parámetros de Go:
     *
     *   [IdentifierList ","] Type
     *
     * Es decir, lo que va entre dos comas es siempre lo mismo: o una lista de
     * nombres con un único tipo, o un tipo solo. Por eso:
     *
     *   a, b int    → los nombres a y b, y su tipo int
     *   a int       → el nombre a y su tipo int
     *   int, string → dos tipos, sin nombre
     *
     * Cómo se decide si un identificador es un nombre o un tipo: por si está
     * en la lista de palabras clave. `int` es un tipo, así que en (int, string)
     * no hay ningún nombre; en (a int) el `a` no es palabra clave, así que es
     * un nombre. Y se siguen recogiendo nombres mientras el token siguiente sea
     * una coma, que es lo que comparten los nombres de un mismo grupo.
     */
    declaracionTipoNombre() {
      const nombres = [];

      while (this.actual().t === 'Id' && !tEsTipoSimple(this.actual())) {
        const siguiente = this.peek(1);
        nombres.push(this.actual().v);
        this.come();
        if (siguiente.t === 'Op' && siguiente.v === ',') { this.come(); continue; }
        break;
      }

      if (nombres.length && this.es(',')) this.come();

      const tipo = this.tipo();
      return { nombres, tipo };
    },

    /** Los parámetros de una función: (a, b int, c string) */
    listaParametros() {
      const params = [];
      this.espera('(');

      if (this.es('...')) {
        this.come();
        const elem = this.tipo();
        this.espera(')');
        return [{ nombre: null, tipo: '[]' + elem, variadico: true }];
      }

      if (this.es(')')) { this.come(); return []; }

      while (true) {
        const { nombres, tipo } = this.declaracionTipoNombre();
        if (nombres.length) nombres.forEach(n => params.push({ nombre: n, tipo }));
        else params.push({ nombre: null, tipo });

        if (this.es(',')) { this.come(); continue; }
        break;
      }

      this.espera(')');
      return params;
    },
    listaResultados() {
      const res = [];
      if (this.es('{')) return res;
      if (this.es(';')) return res;
      if (this.es(')')) return res;
      if (this.es('[') || this.es('*') || this.es('map')) {
        // []int, *Persona o map[string]int como único retorno
        return [{ nombre: null, tipo: this.tipo() }];
      }
      // func f() int — un tipo simple sin paréntesis
      if (tEsTipoSimple(this.actual()) && tEsTipoSimple(this.peek(1))) {
        return [{ nombre: null, tipo: this.tipo() }];
      }
      if (this.es('(')) {
        this.come();
        if (!this.es(')')) {
          while (true) {
            // (int, error) y también (total int, err error)
            const { nombres, tipo } = this.declaracionTipoNombre();
            if (nombres.length) nombres.forEach(n => res.push({ nombre: n, tipo }));
            else res.push({ nombre: null, tipo });
            if (this.es(',')) { this.come(); continue; }
            break;
          }
        }
        this.espera(')');
        return res;
      }

      // Un solo resultado sin paréntesis: func f() int
      if (!tEsTipoSimple(this.actual())) {
        const nombre = this.actual().v;
        this.come();
        res.push({ nombre, tipo: this.tipo() });
        return res;
      }
      res.push({ nombre: null, tipo: this.tipo() });
      return res;
    },

    declaracionFunc(metodo) {
      // func [receiver] nombre(params) (resultados) { cuerpo }
      const linea = this.linea();
      this.come();                          // func

      let receptor = null;
      if (this.es('(')) {
        this.come();
        // (p *Persona) o (p Persona)
        // (r Rect) o (c *Contador): primero el nombre, luego el tipo
        const nombre = this.actual().v;
        this.come();

        if (this.es('*')) {
          this.come();
          receptor = { nombre, tipo: this.tipo(), puntero: true };
        } else {
          receptor = { nombre, tipo: this.tipo(), puntero: false };
        }
        this.espera(')');
      }

      const nombre = this.actual().v;
      this.come();
      const params = this.listaParametros();
      const resultados = this.listaResultados();
      const cuerpo = this.bloque();

      return { nombre, params, resultados, cuerpo, receptor, linea, metodo: !!metodo };
    },

    // ── Sentencias ──

    bloque() {
      this.espera('{');
      const sent = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') throw new ErrorGo('falta cerrar una llave {', this.linea());
        sent.push(this.sentencia());
      }
      this.espera('}');
      return { t: 'bloque', sent };
    },

    cuerpoDeBucle() {
      if (this.es('{')) return this.bloque();
      return { t: 'bloque', sent: [this.sentencia()] };
    },

    /**
     * Lee algo como `i, ok := m["x"]` o `i := 0` o `n < 10`.
     *
     * Go permite varios nombres a la izquierda, así que no basta con una
     * expresión suelta: hay que mirar si detrás hay := o = y, si lo hay,
     * agrupar los nombres que haya antes.
     */
    declaracionOExpresion() {
      const linea = this.linea();
      const guardado = this.pos;

      // id, id, ... := expr   |   id, id, ... = expr
      if (this.actual().t === 'Id') {
        const nombres = [this.actual().v];
        this.come();
        let sigue = true;
        while (sigue && this.es(',')) {
          this.come();
          // Detrás de la coma tiene que haber un nombre, no un operador
          if (this.actual().t !== 'Id') { sigue = false; break; }
          nombres.push(this.actual().v);
          this.come();
        }

        if (this.es(':=')) {
          this.come();
          return { t: 'declCorta', izq: { t: 'nombres', nombres }, der: this.derechaConComas(), linea };
        }
        if (this.es('=')) {
          this.come();
          return { t: 'asigna', izq: { t: 'nombres', nombres }, der: this.derechaConComas(), linea };
        }
        this.pos = guardado;
      }

      return this.expresion();
    },

    /**
     * El lado derecho de una asignación, que puede tener comas: a, b := 1, 2
     *
     * Con un solo valor se devuelve la expresión normal, para no complicar el
     * resto del camino. Con varios se envuelve en una lista.
     */
    derechaConComas() {
      const primera = this.expresion();
      if (!this.es(',')) return primera;

      const exps = [primera];
      while (this.es(',')) { this.come(); exps.push(this.expresion()); }
      return { t: 'multi', exps };
    },

    /** ¿Empieza aquí una sentencia? Sirve para el cuerpo de un if sin llaves. */
    empiezaSentencia() {
      const t = this.actual();
      if (t.t === 'Op') return ['{', '}', ';'].includes(t.v) === false;
      if (t.t === 'Id') return true;
      return false;
    },

    sentencia() {
      const t = this.actual();
      const linea = t.linea;

      if (this.es('{')) return this.bloque();
      if (this.es(';')) { this.come(); return { t: 'vacia', linea }; }

      if (this.esPalabra('var')) return this.declaracionVar();
      if (this.esPalabra('const')) return this.declaracionVar(true);
      if (this.esPalabra('type')) return { t: 'declTipo', decl: this.declaracionTipo(), linea };
      if (this.esPalabra('func')) return { t: 'declFunc', decl: this.declaracionFunc(), linea };

      if (this.esPalabra('if')) return this.declaracionIf();
      if (this.esPalabra('for')) return this.declaracionFor();
      if (this.esPalabra('switch')) return this.declaracionSwitch();
      if (this.esPalabra('return')) {
        this.come();
        const exps = [];
        if (!this.es('}')) {
          do { exps.push(this.expresion()); } while (this.es(',') && (this.come(), true));
        }
        this.puntoYComa();
        return { t: 'return', exps, linea };
      }
      if (this.esPalabra('break')) { this.come(); this.puntoYComa(); return { t: 'break', linea }; }
      if (this.esPalabra('continue')) { this.come(); this.puntoYComa(); return { t: 'continue', linea }; }
      if (this.esPalabra('defer')) {
        this.come();
        const llamada = this.expresion();
        this.puntoYComa();
        return { t: 'defer', llamada, linea };
      }
      if (this.esPalabra('go')) {
        this.come();
        const llamada = this.expresion();
        this.puntoYComa();
        return { t: 'go', llamada, linea };
      }
      if (this.esPalabra('go')) { this.come(); const l = this.expresion(); this.puntoYComa(); return { t: 'go', llamada: l, linea }; }

      // Una sentencia suelta puede ser `a, b := f()`, con varios nombres
      const exp = this.declaracionOExpresion();
      this.puntoYComa();
      return { t: 'expr', exp, linea };
    },

    /** var x int, var x = 5, var a, b int, const PI = 3.14 */
    declaracionVar(esConst) {
      const linea = this.linea();
      this.come();   // var / const

      const grupo = [];
      do {
        const nombres = [this.actual().v];
        this.come();
        while (this.es(',')) { this.come(); nombres.push(this.actual().v); this.come(); }

        let tipo = null;
        let valor = null;

        // var x = 5      (sin tipo)
        // var x int      (con tipo, sin valor)
        // var x int = 5  (con los dos)
        if (this.es('=')) {
          this.come();
          valor = this.expresion();
        } else if (!this.es(';') && !this.es('}') && !this.es(',') && !this.es(')')) {
          tipo = this.tipo();
          if (this.es('=')) {
            this.come();
            valor = this.expresion();
          }
        }

        grupo.push({ nombres, tipo, valor });
      } while (this.es(',') && (this.come(), true));

      this.puntoYComa();
      return { t: 'declVar', grupo, const: !!esConst, linea };
    },

    /**
     * if [init;] cond { }
     *
     * El if con inicialización es muy de Go:
     *   if v, ok := m["k"]; ok { ... }
     * y es donde se lee el valor de un mapa sin comprobarlo antes.
     */
    declaracionIf() {
      const linea = this.linea();
      this.come();   // if

      let init = null;
      if (this.es(';')) {
        this.come();
      } else {
        // Puede haber un init antes del ;
        const guardado = this.pos;
        try {
          const posible = this.sentenciaDeIf();
          if (this.es(';')) { this.come(); init = posible; }
          else this.pos = guardado;
        } catch (e) {
          this.pos = guardado;
        }
      }

      const cond = this.expresion();
      const entonces = this.sentenciaIf();

      let siNo = null;
      if (this.esPalabra('else')) {
        this.come();
        if (this.esPalabra('if')) {
          siNo = this.declaracionIf();
        } else {
          siNo = this.sentenciaIf();
        }
      }
      return { t: 'if', init, cond, entonces, siNo, linea };
    },

    /** El if de Go es especial: solo admite un bloque, no una sentencia suelta. */
    sentenciaIf() {
      if (this.es('{')) return this.bloque();
      return { t: 'bloque', sent: [this.sentencia()] };
    },

    /** El `i := 0` o el `v, ok := m["k"]` que va antes del ; de un if */
    sentenciaDeIf() {
      const linea = this.linea();
      return { t: 'expr', exp: this.declaracionOExpresion(), linea };
    },

    /**
     * Los tres formatos de for en Go:
     *
     *   for i := 0; i < n; i++ { }   las tres partes
     *   for i < n { }                solo la condición
     *   for i, v := range x { }      recorrer
     *
     * El truco está en que `i, v := range x` lleva el := ANTES de la palabra
     * range, así que no se puede buscar "range" primero y ya.
     */
    declaracionFor() {
      const linea = this.linea();
      this.come();   // for

      // for { } — bucle infinito
      if (this.es('{')) {
        return { t: 'for', init: null, cond: null, post: null, cuerpo: this.bloque(), linea };
      }

      // for range x { } — sin nombre, raro pero legal
      if (this.esPalabra('range')) {
        this.come();
        const coleccion = this.expresion();
        const cuerpo = this.bloque();
        return { t: 'forRange', coleccion, cuerpo, linea };
      }

      // for i, v := range x  — la palabra range va DESPUÉS del :=, así que
      // hay que mirar la lista de nombres antes de parsear nada
      const guardado = this.pos;
      if (this.actual().t === 'Id') {
        const nombres = [this.actual().v];
        this.come();
        let sigue = true;
        while (sigue && this.es(',')) {
          this.come();
          if (this.actual().t !== 'Id') { sigue = false; break; }
          nombres.push(this.actual().v);
          this.come();
        }
        if (this.es(':=') && this.peek(1).t === 'Id' && this.peek(1).v === 'range') {
          this.come();          // :=
          this.come();          // range
          const coleccion = this.expresion();
          const cuerpo = this.bloque();
          return { t: 'forRange', coleccion, cuerpo, linea, nombres };
        }
        this.pos = guardado;
      }

      const primero = this.declaracionOExpresion();

      // Las tres partes
      if (this.es(';')) {
        this.come();
        const cond = this.es(';') ? null : this.expresion();
        this.puntoYComa();
        const post = this.es('{') ? null : this.declaracionOExpresion();
        const cuerpo = this.cuerpoDeBucle();
        return { t: 'for', init: { t: 'expr', exp: primero, linea }, cond, post, cuerpo, linea };
      }

      // Solo condición
      const cuerpo = this.cuerpoDeBucle();
      return { t: 'for', init: null, cond: primero, post: null, cuerpo, linea };
    },

    /** Lee sentencias hasta cerrar }, sin consumir la llave. */
    cuerpoHastaCierre() {
      const sent = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') throw new ErrorGo('falta cerrar una llave {', this.linea());
        sent.push(this.sentencia());
      }
      this.espera('}');
      return { t: 'bloque', sent };
    },

    /**
     * switch x {
     * case 1: ...
     * default: ...
     * }
     *
     * Go NO tiene fallthrough: cada case termina solo. Es la diferencia que más
     * sorprende a quien viene de C o Java.
     */
    declaracionSwitch() {
      const linea = this.linea();
      this.come();   // switch

      // switch sin expresión: switch { case x > 3: }
      // La llave hay que CONSUMIRLA: es() solo mira, no avanza, y si se
      // deja puesta leerCasos se encontraría un { donde esperaba un case.
      if (this.es('{')) {
        this.come();
        const casos = this.leerCasos();
        return { t: 'switch', disc: null, casos, linea };
      }

      const init = null;
      const disc = this.expresion();
      this.espera('{');
      const casos = this.leerCasos();
      return { t: 'switch', init, disc, casos, linea };
    },

    leerCasos() {
      const casos = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') throw new ErrorGo('falta cerrar el switch', this.linea());

        if (this.esPalabra('case')) {
          this.come();
          const valores = [this.expresion()];
          while (this.es(',')) { this.come(); valores.push(this.expresion()); }
          // En Go los case se separan con dos puntos: case 3:
          if (this.es(':')) this.come();
          this.puntoYComa();
          const cuerpo = this.cuerpoHastaCierreDeCaso();
          casos.push({ valores, cuerpo });
          continue;
        }

        if (this.esPalabra('default')) {
          this.come();
          if (this.es(':')) this.come();
          this.puntoYComa();
          const cuerpo = this.cuerpoHastaCierreDeCaso();
          casos.push({ valores: null, cuerpo });
          continue;
        }

        throw new ErrorGo('dentro de switch solo caben case y default', this.linea());
      }
      this.espera('}');
      return casos;
    },

    cuerpoHastaCierreDeCaso() {
      const sent = [];
      while (!this.es('}') && !this.esPalabra('case') && !this.esPalabra('default')) {
        if (this.actual().t === 'EOF') break;
        sent.push(this.sentencia());
      }
      return { t: 'bloque', sent };
    }
  };

  // ════════════════════════════════════════════════
  // CONSTRUCCIÓN DEL ÁRBOL
  // ════════════════════════════════════════════════

  /**
   * Recorre el programa y separa lo que se ejecuta (main) de lo que se declara
   * (funciones, tipos, constantes). El cuerpo de main se ejecuta después.
   */
  function construirPrograma(src) {
    const tokens = tokenizar(src);
    const a = new Analizador(tokens);

    const programa = {
      funciones: {},
      tipos: {},
      constantes: {},
      cuerpoPrincipal: null
    };

    while (a.actual().t !== 'EOF') {
      // El main es lo único que se ejecuta al arrancar
      if (a.esPalabra('func') && a.peek(1).t === 'Id' && a.peek(1).v === 'main') {
        a.come(); a.come();                // func main
        a.listaParametros();
        a.listaResultados();
        programa.cuerpoPrincipal = a.bloque();
        continue;
      }

      if (a.esPalabra('func')) {
        const decl = a.declaracionFunc();
        const clave = decl.receptor
          ? decl.receptor.tipo + '.' + decl.nombre
          : decl.nombre;
        programa.funciones[clave] = decl;
        // Con el mismo nombre se puede tener el método y la función: se
        // guarda la función con clave simple si no choca
        if (!programa.funciones[decl.nombre]) programa.funciones[decl.nombre] = decl;
        continue;
      }

      if (a.esPalabra('type')) {
        const decl = a.declaracionTipo();
        programa.tipos[decl.nombre] = decl;
        continue;
      }

      // Las constantes son como las variables pero inmutables. En el temario
      // siempre son valores literales, así que se guardan ya resueltas para
      // que cualquier función las pueda usar por su nombre.
      if (a.esPalabra('const')) {
        const decl = a.declaracionVar(true);
        decl.grupo.forEach(g => {
          if (!g.valor) return;
          const lit = literalDeExpresion(g.valor);
          if (lit === null) return;
          g.nombres.forEach(n => { programa.constantes[n] = lit; });
        });
        continue;
      }

      // Cualquier otra cosa es código suelto: se ejecuta tal cual
      const sent = a.sentencia();
      if (!programa.suelto) programa.suelto = [];
      programa.suelto.push(sent);
    }

    return programa;
  }

  /**
   * El valor de una expresión cuando es un literal simple.
   * Las constantes del temario siempre lo son, así que no hace falta más.
   */
  function literalDeExpresion(exp) {
    if (!exp) return null;
    if (exp.t === 'lit') return exp.v;
    if (exp.t === 'paren') return literalDeExpresion(exp.exp);
    if (exp.t === 'bin' && (exp.op === '+' || exp.op === '-' || exp.op === '*')) {
      const a = literalDeExpresion(exp.izq);
      const b = literalDeExpresion(exp.der);
      if (a === null || b === null) return null;
      const r = exp.op === '+' ? a.dato + b.dato
        : exp.op === '-' ? a.dato - b.dato
        : a.dato * b.dato;
      return V(exp.op === '+' && (a.tipo === 'string' || b.tipo === 'string') ? 'string' : 'int', r);
    }
    return null;
  }

  // ════════════════════════════════════════════════
  // BIBLIOTECA
  //
  // Solo lo que el temario usa: fmt, len, cap, append, errors y la
  // conversión de tipos.
  // ════════════════════════════════════════════════

  /**
   * Aplica un verbo de Printf a un valor.
   *
   * El verbo decide el formato: %d entero, %s texto, %v cualquiera, %T el tipo,
   * %t booleano, %q entre comillas y %f decimal (con .2 para dos decimales).
   */
  function aplicarVerbo(verbo, valor) {
    if (verbo === 'T') return valor ? valor.tipo : 'nil';
    if (verbo === 'v') return formatear(valor);
    if (verbo === 'd') {
      if (!valor) return '%!d(<nil>)';
      if (valor.tipo === 'string') return valor.dato;
      return String(Math.trunc(Number(valor.dato)));
    }
    if (verbo === 's') {
      if (!valor) return '%!s(<nil>)';
      return formatear(valor);
    }
    if (verbo === 'q') {
      if (!valor) return '%!q(<nil>)';
      if (valor.tipo === 'string') return '"' + valor.dato + '"';
      if (valor.tipo === 'rune') return "'" + String.fromCharCode(valor.dato) + "'";
      return '"' + formatear(valor) + '"';
    }
    if (verbo === 't') {
      return valor && valor.tipo === 'bool' ? (valor.dato ? 'true' : 'false') : '%!t(' + formatear(valor) + ')';
    }
    if (verbo === 'f' || verbo === 'e' || verbo === 'g') {
      if (!valor) return '%!' + verbo + '(<nil>)';
      const n = Number(valor.dato);
      if (verbo === 'e') return n.toExponential(6);
      if (verbo === 'g') return String(n);
      return formatearFloat(n, {});
    }
    if (verbo === 'c') {
      return valor && valor.tipo === 'rune' ? String.fromCharCode(valor.dato) : '�';
    }
    if (verbo === 'x') {
      return valor ? Math.trunc(Number(valor.dato)).toString(16) : '%!x(<nil>)';
    }
    if (verbo === 'b') {
      return valor ? Math.trunc(Number(valor.dato)).toString(2) : '%!b(<nil>)';
    }
    return '%!' + verbo + '(' + formatear(valor) + ')';
  }

  /** Interpreta una cadena de formato con %v y sus verbos. */
  function formatearPrintf(plantilla, valores) {
    let salida = '';
    let i = 0;
    let siguiente = 0;

    while (i < plantilla.length) {
      const c = plantilla[i];

      if (c !== '%') { salida += c; i++; continue; }

      // %% es un % literal
      if (plantilla[i + 1] === '%') { salida += '%'; i += 2; continue; }

      // Anchura y precisión: %6.2f, %.2f, %-8s
      const m = /^%([-+ 0]*)(\d*)(?:\.(\d+))?([a-zA-Z])/.exec(plantilla.slice(i));
      if (!m) { salida += c; i++; continue; }

      const banderas = m[1] || '';
      const ancho = m[2] ? parseInt(m[2], 10) : 0;
      const decimales = m[3] !== undefined ? parseInt(m[3], 10) : undefined;
      const verbo = m[4];
      i += m[0].length;

      const valor = valores[siguiente];
      siguiente++;

      let texto;
      if (decimales !== undefined && /[feEgG]/.test(verbo)) {
        texto = formatearFloat(Number(valor && valor.dato), { precision: decimales });
      } else {
        texto = aplicarVerbo(verbo, valor);
      }

      // Alineación a la derecha por defecto, a la izquierda con -
      if (ancho > texto.length) {
        const relleno = ' '.repeat(ancho - texto.length);
        texto = banderas.includes('-') ? texto + relleno : relleno + texto;
      }

      salida += texto;
    }

    return salida;
  }

  // ════════════════════════════════════════════════
  // EJECUCIÓN
  // ════════════════════════════════════════════════

  /**
   * Una copia de un valor.
   *
   * Los structs se copian de verdad cuando se pasan por valor, porque Go
   * entrega una copia al receptor. Copiar solo el envoltorio no serviría: los
   * campos seguirían siendo los mismos y el método podría tocar el struct
   * original, que es justo lo que un receptor de valor no puede hacer.
   */
  function copiarValor(v) {
    if (!v) return v;
    if (v.tipo !== 'struct' || !v.dato) return v;
    const copia = V('struct', Object.assign({}, v.dato));
    copia._tipo = v._tipo;
    return copia;
  }

  class Ejecutor {
    constructor(programa, opciones) {
      this.programa = programa;
      this.funciones = programa.funciones || {};
      this.tipos = programa.tipos || {};
      this.constantes = Object.assign({}, programa.constantes || {});

      this.salida = '';
      this.impresiones = 0;

      this.ambitos = [];
      this.baseAmbito = 0;
      this.pasos = 0;
      this.limitePasos = (opciones && opciones.limitePasos) || 2_000_000;

      // Valor cero global, para lo que aún no tiene memoria asignada
      this.ninguno = 0;
      this.siguienteDir = 1;
      this.memoria = new Map();
    }

    error(msg, linea) { throw new ErrorGo(msg, linea); }

    // ── Memoria ──
    //
    // Go tiene punteros y los slices comparten su array de respaldo, así que
    // hace falta una memoria de verdad: si no, `p := &x; *p = 5` y
    // `append` queAmplía el slice no se podrían ejecutar.

    nuevaDireccion() { return this.siguienteDir++; }

    /** Guarda un valor en una dirección de memoria. */
    escribirEnMemoria(dir, valor) {
      this.memoria.set(dir, valor);
      return dir;
    }

    leerDe(dir) {
      const v = this.memoria.get(dir);
      return v === undefined ? null : v;
    }

    // ── Ámbitos ──

    entra() { this.ambitos.push(new Map()); }
    sale() { this.ambitos.pop(); }

    caja(nombre) {
      for (let i = this.ambitos.length - 1; i >= this.baseAmbito; i--) {
        const m = this.ambitos[i];
        if (m && m.has(nombre)) return m.get(nombre);
      }
      // Funciones globales y constantes se ven desde cualquier ámbito
      if (Object.prototype.hasOwnProperty.call(this.constantes, nombre)) {
        return { valor: this.constantes[nombre], global: true };
      }
      return null;
    }

    existe(nombre) { return this.caja(nombre) !== null; }

    /**
     * El valor de una variable.
     *
     * Se lee de la memoria y no de la caja porque un puntero puede haber
     * escrito en esa dirección sin pasar por la caja: si solo se mirara la
     * caja, `p := &x; *p = 10` cambiaría la memoria pero x seguiría valiendo lo
     * que tenía, y eso en Go no pasa.
     */
    buscar(nombre, linea) {
      const c = this.caja(nombre);
      if (c === null) {
        this.error(
          `la variable "${nombre}" no está declarada. `
          + `En Go hay que declararla antes de usarla, con var o con :=`,
          linea
        );
      }
      if (c.dir !== undefined && this.memoria.has(c.dir)) {
        c.valor = this.memoria.get(c.dir);
      }
      return c.valor;
    }

    /** Declara en el ámbito actual. Si ya existe ahí, la reescribe. */
    definir(nombre, valor) {
      const guardado = valor;
      if (guardado) delete guardado.sinTipo;   // ya no es una constante
      const dir = this.nuevaDireccion();
      this.escribirEnMemoria(dir, guardado);
      this.ambitos[this.ambitos.length - 1].set(nombre, { dir, valor: guardado });
    }

    asignar(nombre, valor, linea) {
      const c = this.caja(nombre);
      if (c === null) {
        this.error(`no se puede asignar a "${nombre}": no está declarada`, linea);
      }
      if (valor) delete valor.sinTipo;
      c.valor = valor;
      if (c.dir !== undefined) this.escribirEnMemoria(c.dir, valor);
    }

    // ── Comprobación de tipos ──

    /**
     * Go no convierte nada solo. Asignar un string a un int es un error de
     * compilación, y el mensaje tiene que decirlo: si no, el alumno busca un
     * fallo que no existe.
     */
    comprobarTipos(destino, valor, linea, contexto) {
      if (!valor) return valor;

      // nil se puede asignar a cualquier tipo que admita nil
      if (valor.tipo === 'nil') return valor;

      if (destino === 'any' || !destino) return valor;

      // rune y byte son alias de int32 y uint8: se tratan como enteros
      const norm = (t) => {
        if (t === 'rune' || t === 'byte' || t === 'uint8') return 'int';
        if (t === 'float32') return 'float64';
        return t;
      };

      const d = norm(destino);
      const o = norm(valor.tipo);

      if (d === o) return valor;

      // En Go un literal es una CONSTANTE sin tipo, y las constantes sí se
      // adaptan: var x float64 = 5 es legal. En cuanto el valor está en una
      // variable, ya tiene su tipo y no se puede mezclar.
      if (d === 'float64' && o === 'int' && valor.sinTipo) return valor;

      // int y float64 ya no se mezclan solos: hay que convertirlos a propósito
      if ((d === 'int' && o === 'float64') || (d === 'float64' && o === 'int')) {
        this.error(
          `no se puede usar un valor de tipo ${valor.tipo} donde se espera ${destino}. `
          + `En Go los tipos no se cambian solos: conviértelo con ${destino}(...)`,
          linea
        );
      }

      if (d === 'slice' && o === 'nil') return valor;

      this.error(
        `no se puede asignar un valor de tipo ${valor.tipo} a algo de tipo ${destino}`
        + (contexto ? ` (${contexto})` : '') + '. Go es de tipado estático: los tipos no cambian solos.',
        linea
      );
      return valor;
    }

    /** Devuelve true si ambos valores se pueden comparar entre sí. */
    comparables(a, b) {
      if (!a || !b) return false;
      const fam = (v) => {
        if (['int', 'int8', 'int16', 'int32', 'int64', 'rune',
          'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'byte', 'uintptr'].includes(v.tipo)) return 'num';
        if (['float32', 'float64'].includes(v.tipo)) return 'flot';
        if (v.tipo === 'string') return 'txt';
        return v.tipo;
      };
      const fa = fam(a);
      const fb = fam(b);
      // int y float64 sí se pueden comparar entre sí: eso Go lo permite
      if ((fa === 'num' && fb === 'flot') || (fa === 'flot' && fb === 'num')) return true;
      return fa === fb;
    }

    // ── Expresiones ──

    ev(e) {
      this.pasos++;
      if (this.pasos > this.limitePasos) {
        throw new ErrorGo('el programa no termina (¿bucle infinito?). Revisa las condiciones.');
      }

      switch (e.t) {
        case 'lit': return e.v;
        case 'paren': return this.ev(e.exp);

        case 'no': return V('bool', !this.cierto(this.ev(e.exp)));
        case 'menos': {
          const v = this.ev(e.exp);
          if (v.tipo === 'float64') return V('float64', -v.dato);
          return V('int', -Math.trunc(v.dato));
        }

        case 'and': return V('bool', this.cierto(this.ev(e.izq)) && this.cierto(this.ev(e.der)));
        case 'or': return V('bool', this.cierto(this.ev(e.izq)) || this.cierto(this.ev(e.der)));

        case 'direccion': {
          // &x: la dirección de una variable que ya existe
          if (e.exp.t === 'id') {
            const c = this.caja(e.exp.v);
            if (c) return V('pointer', c.dir);
          }

          // &Contador{}: se construye el valor y se mete en memoria para que
          // el puntero apunte a algo real, que es justo lo que hace Go
          const v = this.ev(e.exp);
          if (!v) return null;
          const dir = this.nuevaDireccion();
          this.escribirEnMemoria(dir, v);
          return V('pointer', dir);
        }

        case 'desref': {
          const v = this.ev(e.exp);
          if (v.tipo !== 'pointer') {
            this.error('el * solo se usa sobre un puntero, y esto es un ' + v.tipo, e.linea);
          }
          if (v.dato === null) {
            this.error('se ha desreferenciado un puntero nil', e.linea);
          }
          return this.leerDe(v.dato) || V('nil', null);
        }

        case 'conversion': return this.conversion(e);

        case 'postinc': {
          const actual = this.ev(e.exp);
          const nuevo = this.sumar(actual, e.op === '++' ? 1 : -1);
          this.escribirEn(e.exp, nuevo);
          return actual;
        }

        case 'sliceLit': {
          const arr = e.elems.map(el => this.ev(el));
          return V('slice', arr);
        }

        case 'makeSlice': {
          const largo = e.largo ? Math.trunc(this.ev(e.largo).dato) : 0;
          const relleno = valorCero(e.elem);
          const arr = [];
          for (let i = 0; i < Math.max(0, largo); i++) arr.push(relleno);
          return V('slice', arr);
        }

        case 'mapLit': {
          const m = new Map();
          // Aunque esté vacío, el tipo del valor ya se sabe: map[string]int{}
          let tipoValor = e.valor;
          for (const par of e.pares) {
            const v = this.ev(par.valor);
            if (!tipoValor) tipoValor = v.tipo;
            const clave = this.claveDeMapa(this.ev(par.clave), e.linea);
            m.set(clave, v);
          }
          const mapa = V('map', m);
          mapa._tipoValor = tipoValor;
          return mapa;
        }

        case 'makeMap': {
          const m = V('map', new Map());
          m._tipoValor = e.valor;
          return m;
        }

        case 'structLit': {
          const v = this.nuevoStruct(e.tipo);
          if (!v) this.error(`el tipo ${e.tipo} no está declarado`, e.linea);
          for (const c of e.campos) {
            if (!Object.prototype.hasOwnProperty.call(v.dato, c.nombre)) {
              this.error(`el tipo ${e.tipo} no tiene ningún campo "${c.nombre}"`, e.linea);
            }
            v.dato[c.nombre] = this.ev(c.valor);
          }
          return v;
        }

        case 'new': {
          const dir = this.nuevaDireccion();
          this.escribirEn(dir, valorCero(e.tipo));
          return V('pointer', dir);
        }

        case 'indice': return this.indice(e);

        case 'rebanada': return this.rebanada(e);

        case 'miembro': return this.miembro(e);

        case 'id': {
          if (Object.prototype.hasOwnProperty.call(this.constantes, e.v)) return this.constantes[e.v];
          return this.buscar(e.v, e.linea);
        }

        case 'llamada': return this.llamar(e);

        case 'metodo': return this.llamarMetodo(e);

        case 'asigna': {
          // "a, b = b, a": primero se calculan los dos lados y despues se
          // asignan. Sin esto el intercambio seria imposible.
          if (e.der.t === 'multi') {
            const destino = e.izq.t === 'nombres'
              ? e.izq.nombres
              : (e.izq.t === 'id' ? [e.izq.v] : null);
            if (!destino) this.error('no se puede asignar a esta expresion', e.linea);
            if (destino.length !== e.der.exps.length) {
              this.error(
                `se asignan ${destino.length} variables pero hay ${e.der.exps.length} valores`,
                e.linea
              );
            }
            const calculados = e.der.exps.map(x => this.ev(x));
            destino.forEach((n, k) => { this.escribirEn({ t: 'id', v: n }, calculados[k]); });
            return calculados.length === 1 ? calculados[0] : calculados;
          }

          const valor = this.ev(e.der);

          // "a, b = b, a": primero se calculan los dos lados y luego se
          // asignan, que es lo que permite el intercambio
          if (e.izq.t === 'nombres') {
            const cuantos = e.izq.nombres.length;

            if (cuantos === 1) {
              this.escribirEn({ t: 'id', v: e.izq.nombres[0] }, valor);
              return valor;
            }

            if (Array.isArray(valor)) {
              if (valor.length !== cuantos) {
                this.error(
                  `se asignan ${cuantos} variables pero el lado derecho devuelve ${valor.length}`,
                  e.linea
                );
              }
              e.izq.nombres.forEach((n, k) => {
                this.escribirEn({ t: 'id', v: n }, valor[k]);
              });
              return Array.isArray(valor) && valor.length === 1 ? valor[0] : valor;
            }
            this.error(
              `se asignan ${cuantos} variables pero el lado derecho devuelve un solo valor`,
              e.linea
            );
          }

          if (e.izq.t === 'id') {
            const c = this.caja(e.izq.v);
            if (c) {
              this.comprobarTipos(c.valor ? c.valor.tipo : null, valor, e.linea, 'en ' + e.izq.v);
            }
            this.escribirEn(e.izq, valor);
          } else {
            this.escribirEn(e.izq, valor);
          }
          return valor;
        }

        case 'declCorta': {
          // x := valor, o x, y := f()
          const valores = this.evLadoDerecha(e);
          const nombres = e.izq.t === 'id'
            ? [{ t: 'id', v: e.izq.v }]
            : e.izq.nombres.map(n => ({ t: 'id', v: n }));

          if (valores.length !== nombres.length) {
            this.error(
              `"${nombres.length}" variables a la izquierda pero ${valores.length} valor(es) a la derecha`,
              e.linea
            );
          }

          nombres.forEach((nombre, k) => {
            // := redeclara si ya existe en el MISMO ámbito; := con := da error
            if (this.existeEnEsteAmbito(nombre.v)) {
              this.error(
                `"${nombre.v}" ya está declarado en esta línea. `
                + `Para reasignar usa = y no :=`,
                e.linea
              );
            }
            this.definir(nombre.v, valores[k]);
          });
          return valores.length === 1 ? valores[0] : V('multiple', valores);
        }

        case 'asignaCompuesta': {
          const base = this.ev(e.izq);
          const otro = this.ev(e.der);
          const op = e.op[0];
          const nuevo = this.aplicarBinario(op, base, otro, e.linea);
          this.escribirEn(e.izq, nuevo);
          return nuevo;
        }

        case 'bin': {
          const izq = this.ev(e.izq);
          const der = this.ev(e.der);
          return this.aplicarBinario(e.op, izq, der, e.linea);
        }

        default:
          this.error('expresión no soportada: ' + e.t, e.linea);
          return null;
      }
    }

    existeEnEsteAmbito(nombre) {
      const actual = this.ambitos[this.ambitos.length - 1];
      return !!actual && actual.has(nombre);
    }

    /**
     * El lado derecho de un := o de un =, como lista de valores.
     *
     * Hay cuatro formas y todas acaban aquí: una lista con comas, una llamada
     * que devuelve varios valores, el acceso a un mapa que da valor y ok, y el
     * caso normal de una sola expresión.
     */
    evLadoDerecha(e) {
      const der = e.der;

      // a, b := 1, 2
      if (der.t === 'multi') return der.exps.map(x => this.ev(x));

      // (expresión) entre paréntesis
      if (der.t === 'paren') return [this.ev(der.exp)];

      // v, ok := m["clave"]
      if (der.t === 'indice') {
        const contenedor = this.ev(der.exp);
        if (contenedor && contenedor.tipo === 'map') return this.indiceDoble(der);
      }

      // Una llamada puede devolver varios valores: q, r := divide(10, 3)
      const r = this.ev(der);
      return Array.isArray(r) ? r : [r];
    }

    esMapa(v) { return !!v && v.tipo === 'map'; }

    conversion(e) {
      const v = this.ev(e.exp);
      const destino = e.tipo;

      if (v.tipo === 'nil') return valorCero(destino);

      switch (destino) {
        case 'string':
          if (v.tipo === 'string') return v;
          // string(65) da "A", porque convierte el número como carácter
          if (v.tipo === 'rune') return V('string', String.fromCharCode(v.dato));
          if (['int', 'int64', 'int32', 'byte', 'uint8'].includes(v.tipo)) {
            return V('string', String.fromCharCode(Number(v.dato)));
          }
          return V('string', formatear(v, {}));

        case 'int': case 'int64': case 'int32': case 'rune': case 'byte':
          if (v.tipo === 'float64') return V(destino, Math.trunc(v.dato));
          if (v.tipo === 'rune') return V(destino, v.dato);
          if (v.tipo === 'bool') return this.error('no se puede convertir un bool a int', e.linea);
          return V(destino, Math.trunc(v.dato));

        case 'float64': case 'float32':
          if (v.tipo === 'int') return V(destino, v.dato);
          return V(destino, Number(v.dato));

        case 'bool':
          return this.error('no se puede convertir a bool', e.linea);

        default:
          return v;
      }
    }

    /** a[i] con un solo valor; los mapas devuelven el valor o el cero. */
    indice(e) {
      const contenedor = this.ev(e.exp);
      const idx = this.ev(e.indice);

      if (!contenedor) {
        this.error('se está indexando un valor nil', e.linea);
      }

      if (contenedor.tipo === 'slice') {
        const arr = contenedor.dato;
        const i = Math.trunc(Number(idx.dato));
        if (i < 0 || i >= arr.length) {
          this.error(
            `índice ${i} fuera de rango: el slice tiene ${arr.length} elemento(s), `
            + `así que van del 0 al ${arr.length - 1}`,
            e.linea
          );
        }
        return arr[i];
      }

      if (contenedor.tipo === 'map') {
        const clave = this.claveDeMapa(idx, e.linea);
        if (!contenedor.dato.has(clave)) return valorCero(this.tipoValorDeMapa(contenedor));
        return contenedor.dato.get(clave);
      }

      if (contenedor.tipo === 'string') {
        const i = Math.trunc(Number(idx.dato));
        const bytes = bytesUtf8(contenedor.dato);
        if (i < 0 || i >= bytes.length) {
          this.error(`índice ${i} fuera de rango: el texto tiene ${bytes.length} byte(s)`, e.linea);
        }
        return V('byte', bytes[i]);
      }

      this.error('no se puede indexar un valor de tipo ' + contenedor.tipo, e.linea);
      return null;
    }

    /** v, ok := m[k]: el ok dice si la clave estaba */
    indiceDoble(e) {
      const contenedor = this.ev(e.exp);
      const idx = this.ev(e.indice);
      const clave = this.claveDeMapa(idx, e.linea);
      if (!contenedor || contenedor.tipo !== 'map') return [V('nil', null), V('bool', false)];
      const existe = contenedor.dato.has(clave);
      return [
        existe ? contenedor.dato.get(clave) : valorCero(this.tipoValorDeMapa(contenedor)),
        V('bool', existe)
      ];
    }

    /** Las claves de un mapa pueden ser int o string; se normalizan a texto. */
    claveDeMapa(v, linea) {
      if (!v) this.error('falta la clave del mapa', linea);
      if (v.tipo === 'string') return v.dato;
      if (['int', 'int64', 'int32', 'rune', 'byte', 'uint'].includes(v.tipo)) return String(v.dato);
      this.error('una clave de mapa solo puede ser string o entero, no ' + v.tipo, linea);
      return null;
    }

    /** Para saber el valor cero de una clave que no existe hace falta el tipo. */
    tipoValorDeMapa(mapa) {
      if (!mapa._tipoValor) {
        // Se deduce del primer valor que entre; si no, int
        mapa._tipoValor = 'any';
      }
      return mapa._tipoValor;
    }

    rebanada(e) {
      const base = this.ev(e.exp);
      if (!base || base.tipo !== 'slice') {
        this.error('los slices solo se pueden recortar sobre un slice', e.linea);
      }
      const arr = base.dato;
      const desde = e.desde ? Math.trunc(this.ev(e.desde).dato) : 0;
      const hasta = e.hasta ? Math.trunc(this.ev(e.hasta).dato) : arr.length;

      if (desde < 0 || desde > arr.length) {
        this.error(`el inicio ${desde} está fuera de rango`, e.linea);
      }
      if (hasta > arr.length || desde > hasta) {
        this.error(`el final ${hasta} está fuera de rango (el slice tiene ${arr.length})`, e.linea);
      }
      return V('slice', arr.slice(desde, hasta));
    }

    /** p.Campo, sea p un struct o un puntero a struct */
    miembro(e) {
      const obj = this.ev(e.obj);
      const v = (obj.tipo === 'pointer') ? this.leerDe(obj.dato) : obj;

      if (!v || (v.tipo !== 'struct' && v.tipo !== 'pointer')) {
        this.error(
          'no se puede leer un campo de un valor de tipo ' + (v ? v.tipo : 'nil'),
          e.linea
        );
      }

      if (!v.dato || !Object.prototype.hasOwnProperty.call(v.dato, e.nombre)) {
        // _tipo lleva el nombre con el que se declaro; sin el el mensaje
        // diria "struct" y no serviria de nada
        const tipo = v._tipo || v.tipo;
        const tiene = this.tipos[tipo];
        this.error(
          `el tipo ${tipo} no tiene ningún campo "${e.nombre}"`
          + (tiene ? ` (tiene: ${tiene.campos.reduce((a, c) => a.concat(c.nombres), []).join(', ')})` : ''),
          e.linea
        );
      }
      return v.dato[e.nombre];
    }

    /** Escribe en p.Campo, y solo deja entrar ahí si p es puntero. */
    escribirMiembro(e, valor) {
      let obj = this.ev(e.obj);
      let v = obj;
      if (obj.tipo === 'pointer') {
        if (obj.dato === null) this.error('puntero nil', e.linea);
        v = this.leerDe(obj.dato);
        if (!v) this.error('puntero nil', e.linea);
      }
      if (!v || !v.dato || !Object.prototype.hasOwnProperty.call(v.dato, e.nombre)) {
        this.error('no se puede escribir en "' + e.nombre + '"', e.linea);
      }
      v.dato[e.nombre] = valor;
      return valor;
    }

    escribirEn(exp, valor) {
      if (exp.t === 'id') {
        const c = this.caja(exp.v);
        if (c === null) {
          this.error(`"${exp.v}" no está declarado`, exp.linea);
        }
        c.valor = valor;
        this.escribirEnMemoria(c.dir, valor);
        return valor;
      }
      if (exp.t === 'indice') {
        const contenedor = this.ev(exp.exp);
        const idx = this.ev(exp.indice);

        if (contenedor.tipo === 'slice') {
          const arr = contenedor.dato;
          const i = Math.trunc(Number(idx.dato));
          if (i < 0 || i >= arr.length) {
            this.error(
              `índice ${i} fuera de rango: el slice tiene ${arr.length} elemento(s), ` +
              `así que van del 0 al ${arr.length - 1}`,
              exp.linea
            );
          }
          arr[i] = valor;
          return valor;
        }

        if (contenedor.tipo === 'map') {
          const clave = this.claveDeMapa(idx, exp.linea);
          if (contenedor._tipoValor === undefined || contenedor._tipoValor === 'any') {
            contenedor._tipoValor = valor.tipo;
          }
          contenedor.dato.set(clave, valor);
          return valor;
        }

        this.error('no se puede asignar dentro de un valor de tipo ' + contenedor.tipo, exp.linea);
      }
      if (exp.t === 'miembro') {
        return this.escribirMiembro(exp, valor);
      }
      if (exp.t === 'desref') {
        const p = this.ev(exp.exp);
        if (p.tipo !== 'pointer' || p.dato === null) {
          this.error('no se puede escribir sobre un puntero nil', exp.linea);
        }
        this.escribirEnMemoria(p.dato, valor);
        return valor;
      }
      this.error('esa expresión no se puede usar a la izquierda del =', exp.linea);
      return null;
    }

    sumar(v, cantidad) {
      if (v.tipo === 'float64') return V('float64', v.dato + cantidad);
      if (v.tipo === 'string') return V('string', v.dato);
      return V(v.tipo === 'rune' ? 'rune' : 'int', Math.trunc(v.dato) + cantidad);
    }

    aplicarBinario(op, izq, der, linea) {
      switch (op) {
        case '+': {
          if (izq.tipo === 'string' || der.tipo === 'string') {
            if (izq.tipo !== 'string' || der.tipo !== 'string') {
              this.error(
                `no se puede usar + entre ${izq.tipo} y ${der.tipo}. `
                + `El + solo pega dos textos; para sumar números que no sean texto`,
                linea
              );
            }
            return V('string', izq.dato + der.dato);
          }
          if (izq.tipo === 'slice' && der.tipo === 'slice') {
            return V('slice', izq.dato.concat(der.dato));
          }
          if (izq.tipo === 'float64' || der.tipo === 'float64') {
            const a = Number(izq.dato);
            const b = Number(der.dato);
            return V('float64', a + b);
          }
          return V('int', Math.trunc(izq.dato) + Math.trunc(der.dato));
        }

        case '-': case '*': {
          if (izq.tipo === 'float64' || der.tipo === 'float64') {
            const a = Number(izq.dato);
            const b = Number(der.dato);
            return V('float64', op === '-' ? a - b : a * b);
          }
          const a = Math.trunc(izq.dato);
          const b = Math.trunc(der.dato);
          return V('int', op === '-' ? a - b : a * b);
        }

        case '/': {
          // La división entre enteros TRUNCA: es de las cosas que más
          // sorprenden al venir de Python o JavaScript
          const b = Number(der.dato);
          if (b === 0) {
            this.error('división por cero', linea);
          }
          if (izq.tipo === 'float64' || der.tipo === 'float64') {
            return V('float64', Number(izq.dato) / b);
          }
          // Go trunca hacia cero, no hacia -infinito
          return V('int', Math.trunc(Math.trunc(Number(izq.dato)) / b));
        }

        case '%': {
          const b = Math.trunc(Number(der.dato));
          if (b === 0) this.error('módulo por cero', linea);
          return V('int', Math.trunc(Math.trunc(Number(izq.dato)) % b));
        }

        case '==': return V('bool', this.iguales(izq, der));
        case '!=': return V('bool', !this.iguales(izq, der));

        case '<': case '>': case '<=': case '>=': {
          if (!this.comparables(izq, der)) {
            this.error(
              `no se puede comparar ${izq.tipo} con ${der.tipo}`, linea
            );
          }
          const a = izq.tipo === 'string' ? izq.dato : Number(izq.dato);
          const b = der.tipo === 'string' ? der.dato : Number(der.dato);
          const r = op === '<' ? a < b : op === '>' ? a > b : op === '<=' ? a <= b : a >= b;
          return V('bool', r);
        }

        default:
          this.error('operador no soportado: ' + op, linea);
          return null;
      }
    }

    iguales(a, b) {
      if (!a || !b) return a === b;
      if (a.tipo === 'nil' || b.tipo === 'nil') return a.tipo === b.tipo;
      // Un slice nunca es igual a otro, igual que en Go
      if (a.tipo === 'slice' || b.tipo === 'slice') return a === b;
      if (a.tipo === 'map') return a.dato === b.dato;
      if (a.tipo === 'pointer' && b.tipo === 'pointer') return a.dato === b.dato;
      return a.dato === b.dato;
    }

    cierto(v) {
      if (!v) return false;
      switch (v.tipo) {
        case 'bool': return v.dato === true;
        case 'nil': return false;
        case 'int': case 'int64': case 'rune': case 'byte': case 'uint':
          return v.dato !== 0;
        case 'float64': return v.dato !== 0;
        case 'string': return v.dato !== '';
        default: return true;
      }
    }

    // ── Llamadas ──

    llamar(e) {
      const nombre = e.nombre;
      const yaEvaluados = null;
      return this.llamarPorNombre(nombre, e, null, yaEvaluados);
    }

    /** Todo lo que se llama con nombre: funciones del curso y de la biblioteca. */
    llamarPorNombre(nombre, e, argsPrevias, ignorar) {
      void ignorar;

      const args = argsPrevias || e.args.map(a => this.ev(a));

      // fmt.*
      if (nombre === 'fmt.Println' || nombre === 'fmt.Print' ||
        nombre === 'fmt.Printf' || nombre === 'fmt.Sprintf') {
        return this.fmt(nombre, args, e);
      }

      if (nombre === 'errors.New') {
        return V('error', args.length ? args[0].dato : '');
      }

      if (nombre === 'len') return this.lenDe(args, e);
      if (nombre === 'cap') return this.capDe(args, e);

      if (nombre === 'append') {
        const base = args[0];
        if (!base || base.tipo !== 'slice') {
          this.error('append solo funciona sobre slices, no sobre ' + (base ? base.tipo : 'nil'), e.linea);
        }
        return V('slice', base.dato.concat(args.slice(1)));
      }

      if (nombre === 'delete') {
        if (!args[0] || args[0].tipo !== 'map') {
          this.error('delete solo funciona sobre mapas', e.linea);
        }
        args[0].dato.delete(this.claveDeMapa(args[1], e.linea));
        return V('nil', null);
      }

      if (nombre === 'panic') {
        this.error('panic: ' + formatear(args[0] || V('nil', null)), e.linea);
      }

      if (nombre === 'recover') return V('any', null);

      // Una función declarada por el alumno
      const fn = this.buscarFuncion(nombre);
      if (fn) {
        return this.invocar(fn, args, e.linea);
      }

      this.error(
        `"${nombre}" no está declarado. En un programa de Go hay que escribir `
        + `func ${nombre}(...) antes de llamarla`,
        e.linea
      );
      return null;
    }

    /**
     * Resuelve `a.b(...)`.
     *
     * En Go esto son dos cosas distintas y el compilador las separa por cómo
     * se ha declarado `a`:
     *   · si a es un struct o un puntero a struct, b es un método suyo
     *   · si a es un paquete (fmt, errors), b es una función del paquete
     *
     * El parser no puede saberlo, así que se decide aquí mirando si el
     * nombre existe como variable. Es la misma pregunta que hace Go.
     */
    llamarMetodo(e) {
      // fmt.Println(...): el nombre de la izquierda es un paquete, no una
      // variable. Se comprueba ANTES de evaluarlo, porque buscar 'fmt' como
      // variable daría un error que no le pasa a nadie.
      if (e.obj.t === 'id' && !this.existe(e.obj.v)) {
        const completo = e.obj.v + '.' + e.nombre;
        if (completo.startsWith('fmt.') || completo.startsWith('errors.')) {
          return this.llamarPorNombre(completo, e, e.args.map(a => this.ev(a)));
        }
      }

      const obj = this.ev(e.obj);
      const args = e.args.map(a => this.ev(a));

      // struct o puntero a struct: es un método
      const destino = (obj.tipo === 'pointer') ? this.leerDe(obj.dato) : obj;
      if (destino && (destino.tipo === 'struct' || obj.tipo === 'pointer')) {
        const nombreTipo = destino._tipo || this.tipoDeStruct(destino);
        const clave = nombreTipo + '.' + e.nombre;
        const fn = this.funciones[clave];
        if (fn) {
          // Si el método quiere un puntero y lo que tenemos es una variable,
          // se le pasa su dirección: es lo que hace Go al compilar, y por eso
          // un método de puntero SÍ puede modificar lo que hay fuera.
          let receptor = obj;
          if (fn.receptor && fn.receptor.puntero && obj.tipo !== 'pointer'
            && e.obj.t === 'id') {
            const c = this.caja(e.obj.v);
            if (c && c.dir !== undefined) receptor = V('pointer', c.dir);
          }
          return this.invocar(fn, [receptor].concat(args), e.linea);
        }
        this.error(
          `el tipo ${nombreTipo} no tiene ningún método "${e.nombre}". `
          + `Un método se declara con func (${nombreTipo} receptor) ${e.nombre}(...)`,
          e.linea
        );
      }

      // No es un struct: puede ser un paquete (fmt, errors)
      if (e.obj.t === 'id' && !this.existe(e.obj.v)) {
        return this.llamarPorNombre(e.obj.v + '.' + e.nombre, e, args);
      }

      this.error(
        'no se puede llamar a ' + (e.obj.t === 'id' ? `"${e.obj.v}"` : 'esto')
        + `.${e.nombre}: no es un struct ni un paquete conocido`,
        e.linea
      );
      return null;
    }

    /** El tipo con el que se declaró un struct, para buscar sus métodos. */
    tipoDeStruct(v) {
      for (const nombre in this.tipos) {
        const decl = this.tipos[nombre];
        if (!decl.struct) continue;
        const claves = Object.keys(v.dato || {});
        const delTipo = decl.campos.reduce((a, c) => a.concat(c.nombres), []);
        if (delTipo.length === claves.length && delTipo.every(k => claves.includes(k))) {
          return nombre;
        }
      }
      return 'struct';
    }

    buscarFuncion(nombre) {
      if (this.funciones[nombre]) return this.funciones[nombre];
      // Método: t.Nombre, para el valor o para el puntero
      for (const clave in this.funciones) {
        const [tipo, nom] = clave.split('.');
        if (nom !== nombre) continue;
        const fn = this.funciones[clave];
        if (!fn.receptor) continue;
        // Se elige según el tipo del primer argumento, que aún no está evaluado
        return { ...fn, _tipoReceptor: tipo };
      }
      return null;
    }

    fmt(nombre, valores, e) {
      if (nombre === 'fmt.Printf') {
        const plantilla = valores.length ? formatear(valores[0], {}) : '';
        const resto = valores.slice(1);
        // Si sobran verbos, Go añade %!(EXTRA tipo=valor, ...)
        const texto = formatearPrintf(plantilla, resto);
        const sobra = resto.slice(this.contarVerbos(plantilla));
        let extra = '';
        if (sobra.length) {
          extra = '%!(EXTRA ' + sobra
            .map(v => formatear(v) === '<nil>' ? 'type=<nil>' : 'type=' + v.tipo + ', value=' + formatear(v))
            .join(', ') + ')';
        }
        this.escribir(texto + extra, nombre !== 'fmt.Sprintf');
        return V('int', valores.length - 1);
      }

      if (nombre === 'fmt.Sprintf') {
        const plantilla = valores.length ? formatear(valores[0], {}) : '';
        const resto = valores.slice(1);
        return V('string', formatearPrintf(plantilla, resto));
      }

      // Println mete un espacio entre cada valor y salta de línea;
      // Print no mete espacios ni salta
      const texto = unirPrintln(valores, nombre === 'fmt.Println');
      this.escribir(texto, nombre !== 'fmt.Sprintf');
      return V('int', valores.length);
    }

    lenDe(args, e) {
      const v = args[0];
      if (!v) return V('int', 0);
      if (v.tipo === 'string') {
        return V('int', bytesUtf8(v.dato).length);
      }
      if (v.tipo === 'slice' || v.tipo === 'map') {
        return V('int', v.dato.size !== undefined ? v.dato.size : v.dato.length);
      }
      if (v.tipo === 'chan') return V('int', 0);
      this.error('len no funciona con un valor de tipo ' + v.tipo, e.linea);
      return null;
    }

    capDe(args, e) {
      const v = args[0];
      if (v && v.tipo === 'slice') return V('int', v.dato.length);
      if (v && v.tipo === 'map') return V('int', 0);
      this.error('cap no funciona con un valor de tipo ' + (v ? v.tipo : 'nil'), e.linea);
      return null;
    }

    /** Cuenta cuántos verbos de formato tiene la plantilla. */
    contarVerbos(plantilla) {
      let n = 0;
      let i = 0;
      while (i < plantilla.length) {
        if (plantilla[i] === '%' && plantilla[i + 1] === '%') { i += 2; continue; }
        if (plantilla[i] === '%') { n++; i += 2; continue; }
        i++;
      }
      return n;
    }

    escribir(texto, imprimir) {
      if (!imprimir) return;
      this.salida += texto;
      this.impresiones++;
    }

    /**
     * Invoca una función.
     *
     * Devuelve un array cuando hay varios valores de retorno, porque es lo que
     * permite `a, b := divide(10, 3)`. Con uno solo devuelve el valor.
     */
    invocar(fn, args, linea, opciones) {
      const o = opciones || {};
      const previoBase = this.baseAmbito;
      this.baseAmbito = this.ambitos.length;
      this.entra();

      // El receptor se declara como el primer parámetro.
      //
      // Go deja llamar a un método de puntero sobre una variable normal
      // (toma la dirección por su cuenta) y a un método de valor sobre un
      // puntero (copia lo que apunta). Aquí se hacen las dos conversiones, y
      // solo se avisa cuando no hay ninguna de las dos: un resultado
      // temporal, como una función que devuelve un struct.
      if (fn.receptor) {
        const r = fn.receptor;
        const recibido = args[0];

        if (r.puntero) {
          if (recibido && recibido.tipo === 'pointer') {
            this.definir(r.nombre, recibido);
          } else {
            // Go no deja tomar la dirección de un valor temporal: si el
            // receptor es *T, el argumento tiene que ser ya un puntero o una
            // variable direccionable (esto último lo resuelve llamarMetodo).
            this.error(
              `el método ${fn.nombre} tiene receptor puntero (*${r.tipo}) y `
              + `aquí no hay una variable a la que tomarle la dirección`,
              linea
            );
          }
        } else {
          // Un receptor de valor recibe una COPIA, y la copia tiene que ser
          // real: si solo se pasa el mismo objeto, el método modificaría el
          // struct de fuera y `cont.n++` sí se vería, cuando en Go no.
          if (recibido && recibido.tipo === 'pointer') {
            this.definir(r.nombre, this.leerDe(recibido.dato) || V('nil', null));
          } else {
            this.definir(r.nombre, copiarValor(recibido));
          }
        }
      }

      const esperados = fn.receptor ? 1 : 0;
      fn.params.forEach((p, k) => {
        const valor = args[esperados + k];
        this.definir(p.nombre, valor === undefined ? valorCero(p.tipo) : valor);
      });

      // defer: se ejecuta al salir de la función, aunque sea con return
      const pendientes = [];

      let retorno = null;
      try {
        this.ejecutarLista(fn.cuerpo.sent, pendientes);
      } catch (err) {
        if (err && err.__return) {
          retorno = err.valor;
        } else {
          this.sale();
          this.baseAmbito = previoBase;
          throw err;
        }
      }

      this.sale();
      this.baseAmbito = previoBase;

      // Los defer se ejecutan en orden inverso, como en Go. Guardan la
      // expresión de la llamada, así que se evalúan con ev() y no como
      // sentencias sueltas.
      for (let i = pendientes.length - 1; i >= 0; i--) {
        try { this.ev(pendientes[i]); }
        catch (e) { if (!(e && e.__return)) throw e; }
      }

      void o;

      if (retorno === null) return V('nil', null);
      return retorno;
    }

    // ── Sentencias ──

    /**
     * Ejecuta un nodo que puede ser un bloque.
     *
     * Un bloque es un ámbito propio: sin esto, un `x := 1` dentro de un bucle
     * se quedaría declarado para la segunda vuelta y daría error, cuando en Go
     * cada vuelta tiene su propio x.
     */
    ejecutar(nodo) {
      if (!nodo) return null;
      return this.ejecutarUna(nodo);
    }

    ejecutarLista(lista, pendientes) {
      for (const s of lista) {
        const r = this.ejecutarUna(s, pendientes);
        if (r) return r;
      }
      return null;
    }

    ejecutarUna(s, pendientes) {
      switch (s.t) {
        case 'vacia': return null;

        case 'declTipo': {
          this.tipos[s.decl.nombre] = s.decl;
          return null;
        }

        case 'declFunc': {
          this.funciones[s.decl.nombre] = s.decl;
          if (s.decl.receptor) {
            this.funciones[s.decl.receptor.tipo + '.' + s.decl.nombre] = s.decl;
          }
          return null;
        }

        case 'declVar': {
          s.grupo.forEach(g => {
            if (!g.valor) {
              g.nombres.forEach(n => this.definir(n, this.valorInicial(g.tipo)));
              return;
            }
            const valores = this.valoresDeDecl(g.valor);
            g.nombres.forEach((n, k) => {
              let v = valores[k];
              if (v === undefined) v = valorCero(g.tipo || 'any');
              if (g.tipo) this.comprobarTipos(g.tipo, v, s.linea, 'en ' + n);
              if (s.const) {
                this.constantes[n] = v;
              } else {
                this.definir(n, v);
              }
            });
          });
          return null;
        }

        case 'expr': {
          this.ev(s.exp);
          return null;
        }

        case 'if': {
          // El if con inicializacion abre su propio ambito: `v` existe dentro
          // del if y fuera no. Es lo que hace que
          // if v, ok := m[k]; ok { } sea seguro aunque no exista la clave.
          if (s.init) {
            this.entra();
            const r = this.ejecutarUna(s.init, pendientes);
            if (r) { this.sale(); return r; }
            if (this.cierto(this.ev(s.cond))) {
              const res = this.ejecutar(s.entonces);
              this.sale();
              return res;
            }
            if (s.siNo) {
              const res = this.ejecutar(s.siNo);
              this.sale();
              return res;
            }
            this.sale();
            return null;
          }

          if (this.cierto(this.ev(s.cond))) return this.ejecutar(s.entonces);
          if (s.siNo) return this.ejecutar(s.siNo);
          return null;
        }

        case 'for': {
          if (s.init) {
            const r = this.ejecutarUna(s.init, pendientes);
            if (r) return r;
          }
          let vueltas = 0;
          while (!s.cond || this.cierto(this.ev(s.cond))) {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') break;
              if (r.t === 'return') return r;
            }
            if (s.post) this.ev(s.post);
            if (++vueltas > 200000) {
              throw new ErrorGo('el bucle for no termina (revisa la condición)', s.linea);
            }
          }
          return null;
        }

        case 'forRange': {
          const col = this.ev(s.coleccion);

          // Los nombres los pone el alumno: for i, v := range x, pero
          // también for ciudad, gente := range mapa. Con uno solo se recibe
          // el índice, y con el _ se descarta.
          const nombres = s.nombres && s.nombres.length ? s.nombres : ['i', 'v'];
          // Con un solo nombre, ese nombre es el índice: for i := range x
          // Con dos, el primero es el índice y el segundo el valor.
          const clave = () => {
            if (nombres.length === 1) return nombres[0] === '_' ? null : nombres[0];
            return nombres[0] === '_' ? null : nombres[0];
          };
          const valor = () => {
            if (nombres.length === 1) return null;
            return nombres[1];
          };

          if (col.tipo === 'slice') {
            const arr = col.dato;
            for (let i = 0; i < arr.length; i++) {
              this.entra();
              const ck = clave(i);
              if (ck) this.definir(ck, V('int', i));
              const vl = valor(arr[i]);
              if (vl && vl !== '_') this.definir(vl, arr[i]);
              const r = this.ejecutar(s.cuerpo);
              this.sale();
              if (r) {
                if (r.t === 'break') break;
                if (r.t === 'return') return r;
              }
            }
            return null;
          }

          if (col.tipo === 'map') {
            // Go recorre los mapas en orden aleatorio, pero aquí se ordenan
            // las claves para que los ejercicios salgan siempre igual
            const claves = [...col.dato.keys()].sort();
            for (const k of claves) {
              this.entra();
              const ck = clave(k);
              if (ck) this.definir(ck, V('string', k));
              const vl = valor(col.dato.get(k));
              if (vl && vl !== '_') this.definir(vl, col.dato.get(k));
              const r = this.ejecutar(s.cuerpo);
              this.sale();
              if (r) {
                if (r.t === 'break') break;
                if (r.t === 'return') return r;
              }
            }
            return null;
          }

          if (col.tipo === 'string') {
            const runes = Array.from(col.dato);
            const bytes = bytesUtf8(col.dato);
            let posicion = 0;
            for (const ch of runes) {
              this.entra();
              const ck = clave(posicion);
              if (ck && ck !== '_') this.definir(ck, V('int', posicion));
              const vl = valor(V('rune', ch.codePointAt(0)));
              if (vl && vl !== '_') this.definir(vl, V('rune', ch.codePointAt(0)));
              const r = this.ejecutar(s.cuerpo);
              this.sale();
              posicion += bytesUtf8(ch).length;
              if (r) {
                if (r.t === 'break') break;
                if (r.t === 'return') return r;
              }
            }
            void bytes;
            return null;
          }

          if (col.tipo === 'int') {
            for (let i = 0; i < col.dato; i++) {
              this.entra();
              const ck = clave(i);
              if (ck && ck !== '_') this.definir(ck, V('int', i));
              const r = this.ejecutar(s.cuerpo);
              this.sale();
              if (r) {
                if (r.t === 'break') break;
                if (r.t === 'return') return r;
              }
            }
            return null;
          }

          this.error(
            'range solo funciona sobre slices, mapas, textos o enteros, no sobre ' + col.tipo,
            s.linea
          );
          return null;
        }

        case 'switch': {
          const d = s.disc ? this.ev(s.disc) : null;
          let elegido = null;
          let porDefecto = null;

          for (const c of s.casos) {
            if (c.valores === null) { porDefecto = c; continue; }
            for (const exp of c.valores) {
              const v = this.ev(exp);
              // switch { case n > 10: } no compara con nada: lo que hay en el
              // case es la propia condicion, y se ejecuta el primero que sea
              // cierto. Con discriminante si se compara y no hay fallthrough.
              const coincide = d === null ? this.cierto(v) : this.iguales(d, v);
              if (coincide) { elegido = c; break; }
            }
            if (elegido) break;
          }
          if (!elegido) elegido = porDefecto;
          if (elegido) return this.ejecutar(elegido.cuerpo);
          return null;
        }

        case 'return': {
          // return a, b devuelve dos valores, y return nada devuelve ninguno
          let valor;
          if (!s.exps || s.exps.length === 0) {
            valor = [];
          } else if (s.exps.length === 1) {
            const v = this.ev(s.exps[0]);
            // Una llamada con varios valores ya devuelve una lista
            valor = Array.isArray(v) ? v : [v];
          } else {
            valor = s.exps.map(e => this.ev(e));
          }
          const err = new ErrorGo('return');
          err.__return = true;
          err.valor = valor.length === 1 ? valor[0] : valor;
          err.varios = valor;
          throw err;
        }

        case 'break': return { t: 'break' };
        case 'continue': return { t: 'continue' };

        case 'defer': {
          // El defer se guarda y se ejecuta al salir de la función
          if (pendientes) pendientes.push(s.llamada);
          else this.ejecutarUna({ t: 'expr', exp: s.llamada });
          return null;
        }

        case 'go': {
          // Las goroutines no se ejecutan de verdad: se explica en el temario
          // como concepto, sin pedir código que dependa de ellas
          this.error(
            'las goroutines no se ejecutan en este motor. Se explican como '
            + 'concepto en el temario, sin pedir código que dependa de ellas',
            s.linea
          );
          return null;
        }

        case 'bloque': {
          this.entra();
          const r = this.ejecutarLista(s.sent || [], pendientes);
          this.sale();
          return r;
        }

        default:
          this.error('sentencia no soportada: ' + s.t, s.linea);
          return null;
      }
    }

    /** Los valores de una declaración: puede haber varios a la derecha. */
    valoresDeDecl(exp) {
      if (exp.t === 'multi') return exp.exps.map(x => this.ev(x));
      if (exp.t === 'paren') return [this.ev(exp.exp)];
      if (exp.t === 'llamada' && exp.args.length === 0) {
        const r = this.llamar(exp);
        return Array.isArray(r) ? r : [r];
      }
      if (exp.t === 'indice') {
        const c = this.ev(exp.exp);
        if (c && c.tipo === 'map') return this.indiceDoble(exp);
      }
      return [this.ev(exp)];
    }

    /**
     * El valor inicial de una variable según su tipo declarado.
     *
     * Para un struct hay que crear el struct de verdad con sus campos, no un
     * valor suelto: si no, `var p Punto; p.x` daría error al leer un campo de
     * algo que no tiene ninguno.
     */
    valorInicial(tipo) {
      if (tipo && this.tipos[tipo] && this.tipos[tipo].struct) {
        return this.nuevoStruct(tipo);
      }
      // Un puntero declarado con var vale nil: no apunta a nada todavia.
      // Si se creara una direccion con ceros, `var p *int; *p` daria 0 en vez
      // de fallar, y en Go eso es un error en tiempo de ejecucion.
      if (tipo && tipo.startsWith('*')) return V('pointer', null);
      if (tipo && tipo.startsWith('map[')) {
        const m = V('map', new Map());
        m._tipoValor = tipo.slice(tipo.indexOf(']') + 1);
        return m;
      }
      return valorCero(tipo);
    }

    /** Crea un struct con sus campos a valor cero. */
    nuevoStruct(nombreTipo) {
      const decl = this.tipos[nombreTipo];
      if (!decl) return null;
      const datos = {};
      decl.campos.forEach(c => {
        c.nombres.forEach(n => { datos[n] = valorCero(c.tipo); });
      });
      const v = V('struct', datos);
      v._tipo = nombreTipo;
      return v;
    }
  }

  // ════════════════════════════════════════════════
  // API PÚBLICA
  // ════════════════════════════════════════════════

  /**
   * Ejecuta un programa Go.
   * @returns {{output: string, error: boolean}}
   */
  function ejecutar(src, opciones) {
    try {
      const programa = construirPrograma(src);
      const ejec = new Ejecutor(programa, opciones);

      // Las constantes están en el programa, se copian al ejecutor
      ejec.constantes = Object.assign({}, programa.constantes || {});

      // Los tipos declarados también
      ejec.tipos = Object.assign({}, programa.tipos);

      ejec.entra();

      // main es lo único que se ejecuta
      if (programa.cuerpoPrincipal) {
        ejec.ejecutarLista(programa.cuerpoPrincipal.sent);
      }
      if (programa.suelto) {
        ejec.ejecutarLista(programa.suelto);
      }

      const salida = ejec.impresiones === 0
        ? '(el programa no imprime nada)\n'
        : (ejec.salida.endsWith('\n') ? ejec.salida : ejec.salida + '\n');

      return { output: salida, error: false };
    } catch (err) {
      let mensaje = err instanceof ErrorGo
        ? err.message
        : (err && err.message ? err.message : String(err));
      return { output: 'Error de Go: ' + mensaje + '\n', error: true };
    }
  }

  return {
    ejecutar,
    tokenizar,
    Analizador,
    construirPrograma,
    literalDeExpresion,
    V,
    Tipos,
    PALABRAS,
    valorCero,
    formatear,
    formatearFloat,
    unirPrintln,
    formatearPrintf,
    aplicarVerbo,
    tipoDeLiteral,
    tipoDeExpresion,
    ErrorGo,
    Ejecutor
  };
})();
