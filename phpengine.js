// DevQuest PHP — Mini intérprete de PHP para los ejercicios
//
// Tampoco hay PHP en el navegador, así que escribimos un intérprete del
// subconjunto que se enseña en el curso. Mismo criterio que con SQL, Java y
// C++: puro, determinista y sin dependencias, para que las soluciones de los
// ejercicios se puedan ejecutar también en los tests de Node.
//
// Cubre:
//   sintaxis   <?php ... ?>, comentarios con //, # y /* */, ; opcional
//   variables  $nombre, asignación, referencia de arrays
//   tipos      int, float, string, bool, null y array (dinámico, como en PHP)
//   operadores + - * / % ** ., comparación == != === !==, < > <= >= <=>,
//             && || !, and or xor, ?:, ++ --, += .= etc.
//   arrays     [1, 2, 3], ["clave" => valor], array(1, 2), anidadas
//   control    if / elseif / else, switch, while, do-while, for, foreach
//   funciones  function, parámetros por valor y por referencia (&$x),
//             valores por defecto, return
//   salida     echo, print, var_dump
//   builtin    count, strlen, strtoupper, strtolower, trim, ucfirst,
//              str_replace, strpos, substr, str_repeat, number_format,
//              array_sum, array_keys, array_values, in_array, implode,
//              explode, array_push, array_pop, array_merge, array_reverse,
//              isset, empty, is_array, is_string, is_numeric, is_null
//
// Lo que NO cubre, y por tanto el temario no usa: require/include, sesiones,
// clases y objetos, namespaces, closures, SQLite y la biblioteca estándar más
// allá de las funciones de texto y array de arriba.
//
// PHP es de tipado dinámico: no se declaran los tipos. El intérprete calcula
// el tipo de cada valor mientras se ejecuta, igual que hace PHP de verdad.

window.PHP_ENGINE = (function () {

  // ════════════════════════════════════════════════
  // ERRORES
  // ════════════════════════════════════════════════

  class ErrorPhp extends Error {
    constructor(mensaje, linea) {
      super(linea ? `Línea ${linea}: ${mensaje}` : mensaje);
      this.name = 'ErrorPhp';
      this.linea = linea || 0;
    }
  }

  // ════════════════════════════════════════════════
  // CONVERSIÓN A TEXTO (lo que hace echo)
  // ════════════════════════════════════════════════

  /** PHP convierte los float con 14 cifras y quita los ceros sobrantes. */
  function formatoFloat(n) {
    if (Number.isNaN(n)) return 'NAN';
    if (n === Infinity) return 'INF';
    if (n === -Infinity) return '-INF';
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
    let s = n.toPrecision(14);
    if (s.includes('e')) {
      // 1.2345000000000e+20 → 1.2345E+20, como lo escribe PHP
      return s.replace(/(\.\d*?)0+e/, '$1E').replace(/\.E/, 'E');
    }
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }

  /**
   * Cómo escribe echo un valor.
   * Lo importante: echo false NO imprime nada (vacío), y un array se
   * convierte a la palabra "Array". Son dos cosas que sorprenden mucho.
   */
  function aTextoPhp(v) {
    if (v === null || v === undefined) return '';
    if (typeof v !== 'object' || !('valor' in v)) return String(v);

    switch (v.tipo) {
      case 'null': return '';
      case 'bool': return v.valor ? '1' : '';
      case 'int': return String(v.valor);
      case 'float': return formatoFloat(Number(v.valor));
      case 'string': return String(v.valor);
      case 'array': return 'Array';
      default: return String(v.valor);
    }
  }

  /** Cómo muestra var_dump el valor: ahí sí se ve el tipo. */
  function volcarPhp(v, sangria) {
    const tab = sangria || '';
    if (v === null || v === undefined || v.tipo === 'null') return tab + 'NULL';

    switch (v.tipo) {
      case 'bool':
        return tab + 'bool(' + (v.valor ? 'true' : 'false') + ')';
      case 'int':
        return tab + 'int(' + v.valor + ')';
      case 'float':
        return tab + 'float(' + formatoFloat(Number(v.valor)) + ')';
      case 'string':
        return tab + 'string(' + String(v.valor).length + ') "' + v.valor + '"';
      case 'array': {
        const arr = v.valor;
        const claves = [...arr.keys()];
        let out = tab + 'array(' + claves.length + ') {\n';
        claves.forEach(k => {
          const etiqueta = /^\d+$/.test(k) ? '[' + k + ']' : '["' + k + '"]';
          out += tab + '  ' + etiqueta + '=>\n' + volcarPhp(arr.get(k), tab + '  ') + '\n';
        });
        return out + tab + '}';
      }
      default:
        return tab + String(v.valor);
    }
  }

  // ════════════════════════════════════════════════
  // LÉXICO
  // ════════════════════════════════════════════════

  function tokenizar(src) {
    let s = String(src == null ? '' : src);

    // El envoltorio <?php ... ?> es opcional: el curso lo enseña, pero el
    // alumno a veces escribe solo el cuerpo y también tiene que funcionar.
    // Si en cambio hay HTML mezclado, el texto que va fuera de las etiquetas
    // no es código: es lo que el servidor envía tal cual. El motor lo
    // reproduce para que el alumno vea el HTML que acabaría llegando al
    // navegador, con el PHP ya sustituido por su resultado.
    const hayEtiquetas = s.includes('<?');

    const tokens = [];
    let i = 0;
    let linea = 1;

    // Fuera de <?php ?> el texto se copia literal; dentro, se interpreta
    let fuera = hayEtiquetas;

    const interpolar = (texto, lineaTexto) => {
      // PHP permite "Hola $nombre" dentro de comillas dobles
      const partes = texto.split(/\$(\w+)/);
      partes.forEach((parte, k) => {
        if (k === 0) {
          if (parte !== '') tokens.push({ t: 'Texto', v: parte, linea: lineaTexto });
        } else if (k % 2 === 1) {
          tokens.push({ t: 'Id', v: parte, interpolado: true, linea: lineaTexto });
        } else {
          tokens.push({ t: 'Texto', v: parte, linea: lineaTexto });
        }
      });
    };

    while (i < s.length) {
      // ── Fuera de las etiquetas: todo esto es texto de la página ──
      if (fuera) {
        const abre = s.indexOf('<?', i);
        if (abre === -1) {
          if (s.length > i) tokens.push({ t: 'Fuera', v: s.slice(i), linea });
          break;
        }
        if (abre > i) tokens.push({ t: 'Fuera', v: s.slice(i, abre), linea });
        i = abre;

        if (s.startsWith('<?=', i)) {
          tokens.push({ t: 'Corto', v: '<?=', linea });
          i += 3;
        } else if (s.startsWith('<?php', i)) {
          i += 5;
        } else {
          tokens.push({ t: 'Corto', v: '<?', linea });
          i += 2;
        }
        fuera = false;
        continue;
      }

      // ── Cierre ?> y vuelta al texto plano ──
      if (s.startsWith('?>', i)) {
        i += 2;
        fuera = true;
        // PHP se come el salto de línea que va justo después de ?>.
        // Por eso una plantilla suele dejar ?> pegado a la etiqueta.
        if (s[i] === '\n') { i++; linea++; }
        else if (s[i] === '\r' && s[i + 1] === '\n') { i += 2; linea++; }
        continue;
      }

      const c = s[i];

      if (c === '\n') { linea++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }

      if (c === '/' && s[i + 1] === '/') {
        while (i < s.length && s[i] !== '\n') i++;
        continue;
      }
      if (c === '#') {
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

      if (c === '"') {
        let valor = '';
        const lineaTexto = linea;
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === '\\') {
            const esc = s[i + 1];
            valor += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === 'r' ? '\r'
              : esc === '\\' ? '\\' : esc === '"' ? '"' : esc === '$' ? '$' : esc;
            i += 2;
          } else {
            if (s[i] === '\n') linea++;
            valor += s[i];
            i++;
          }
        }
        i++;
        // Una cadena vacía es un token como cualquier otro: sin esto,
        // empty("") se quedaba sin nada que leer
        if (valor === '') {
          tokens.push({ t: 'Texto', v: '', simple: true, linea: lineaTexto });
        } else {
          interpolar(valor, lineaTexto);
        }
        continue;
      }

      if (c === "'") {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== "'") {
          if (s[i] === '\\' && (s[i + 1] === "'" || s[i + 1] === '\\')) { valor += s[i + 1]; i += 2; }
          else { if (s[i] === '\n') linea++; valor += s[i]; i++; }
        }
        i++;
        tokens.push({ t: 'Texto', v: valor, simple: true, linea });
        continue;
      }

      if (/[0-9]/.test(c)) {
        let n = '';
        let decimal = false;
        while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        if (s[i] === '.' && /[0-9]/.test(s[i + 1] || '')) {
          decimal = true;
          n += s[i]; i++;
          while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        }
        tokens.push({ t: 'Num', v: decimal ? parseFloat(n) : parseInt(n, 10), linea });
        continue;
      }

      if (c === '$') {
        i++;
        let id = '';
        while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) { id += s[i]; i++; }
        tokens.push({ t: 'Var', v: id, linea });
        continue;
      }

      if (/[A-Za-z_]/.test(c)) {
        let id = '';
        while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) { id += s[i]; i++; }
        tokens.push({ t: 'Id', v: id, linea });
        continue;
      }

      const ops3 = ['===', '!==', '<=>', '**='];
      const ops2 = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '.=', '%=', '=>', '<>', '**'];
      if (ops3.includes(s.slice(i, i + 3))) { tokens.push({ t: 'Op', v: s.slice(i, i + 3), linea }); i += 3; continue; }
      if (ops2.includes(s.slice(i, i + 2))) { tokens.push({ t: 'Op', v: s.slice(i, i + 2), linea }); i += 2; continue; }

      if ('+-*/%=<>!?:;,.()[]{}&|'.includes(c)) { tokens.push({ t: 'Op', v: c, linea }); i++; continue; }

      throw new ErrorPhp(`carácter inesperado "${c}"`, linea);
    }

    tokens.push({ t: 'EOF', v: null, linea });
    return tokens;
  }

  // ════════════════════════════════════════════════
  // VALORES
  // ════════════════════════════════════════════════

  function V(valor, tipo) {
    return { valor, tipo: tipo || inferirTipo(valor) };
  }

  function inferirTipo(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
    if (typeof v === 'string') return 'string';
    if (typeof v === 'boolean') return 'bool';
    if (v instanceof Map) return 'array';
    return 'Object';
  }

  /** El array vacío de PHP. */
  const arrayV = (mapa) => V(mapa || new Map(), 'array');

  function esArray(v) { return !!v && v.tipo === 'array'; }

  /** Un array con pares [clave, valor], respetando el orden de inserción. */
  function construirArray(pares) {
    const m = new Map();
    pares.forEach(([k, val]) => m.set(String(k), val));
    return arrayV(m);
  }

  // ════════════════════════════════════════════════
  // ANALIZADOR
  // ════════════════════════════════════════════════

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
    esVar() { return this.actual().t === 'Var'; },
    esPalabra(p) { return this.actual().t === 'Id' && this.actual().v === p; },

    espera(valor) {
      if (!this.es(valor)) {
        throw new ErrorPhp(`se esperaba "${valor}" pero se encontró "${this.actual().v || 'fin de código'}"`, this.linea());
      }
      return this.come();
    },

    /** El punto y coma de PHP es opcional, pero si está hay que consumarlo. */
    puntoYComa() { if (this.es(';')) this.come(); },

    // ── Expresiones ──

    expresion() { return this.ternario(); },

    ternario() {
      const cond = this.oLogico();
      if (this.es('?')) {
        this.come();
        const entonces = this.ternario();
        this.espera(':');
        return { t: 'ternario', cond, entonces, siNo: this.ternario() };
      }
      return cond;
    },

    oLogico() {
      let izq = this.yLogico();
      while (this.es('||') || this.esPalabra('or')) {
        this.come();
        izq = { t: 'or', izq, der: this.yLogico() };
      }
      return izq;
    },

    yLogico() {
      let izq = this.igualdad();
      while (this.es('&&') || this.esPalabra('and')) {
        this.come();
        izq = { t: 'and', izq, der: this.igualdad() };
      }
      return izq;
    },

    igualdad() {
      let izq = this.relacional();
      while (this.es('==') || this.es('!=') || this.es('===') || this.es('!==') || this.es('<>')) {
        const op = this.come().v;
        izq = { t: 'bin', op: op === '<>' ? '!=' : op, izq, der: this.relacional(), estricto: op === '===' || op === '!==' };
      }
      return izq;
    },

    relacional() {
      let izq = this.concatenacion();
      while (this.es('<') || this.es('>') || this.es('<=') || this.es('>=')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: this.concatenacion() };
      }
      return izq;
    },

    /**
     * El punto concatena y va MÁS FLOJO que sumar y restar (así es desde PHP 8).
     * Por eso \"Total: \" . 1 + 2 vale "Total: 3" y no un NaN: primero se
     * calcula 1 + 2, y luego se concatena el texto con el 3.
     */
    concatenacion() {
      let izq = this.adicion();
      while (this.es('.')) {
        this.come();
        izq = { t: 'bin', op: '.', izq, der: this.adicion() };
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
      while (this.es('*') || this.es('/') || this.es('%') || this.es('**') || this.esPalabra('instanceof')) {
        const op = this.come().v;
        izq = { t: 'bin', op: op === 'instanceof' ? 'instanceof' : op, izq, der: this.unario() };
      }
      return izq;
    },

    unario() {
      if (this.es('!')) { this.come(); return { t: 'no', exp: this.unario() }; }
      if (this.es('-')) { this.come(); return { t: 'menos', exp: this.unario() }; }
      if (this.es('+')) { this.come(); return this.unario(); }
      if (this.es('++')) { this.come(); return { t: 'preinc', exp: this.unario() }; }
      if (this.es('--')) { this.come(); return { t: 'preinc', exp: this.unario(), resta: true }; }
      if (this.es('@')) { this.come(); return this.unario(); }   // silenciar errores
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

      if (t.t === 'Num') { this.come(); return { t: 'lit', v: t.v, tipo: Number.isInteger(t.v) ? 'int' : 'float' }; }

      // Texto: si venía de una cadena con comillas dobles puede traer
      // variables incrustadas, que llegan como tokens separados
      if (t.t === 'Texto') {
        this.come();
        if (t.simple) return { t: 'lit', v: t.v, tipo: 'string' };
        const trozos = [];
        let actual = t.v;
        while (this.actual().t === 'Id' && this.actual().interpolado) {
          const nombre = this.come().v;
          trozos.push({ t: 'lit', v: actual, tipo: 'string' });
          trozos.push({ t: 'interp', v: nombre });
          actual = '';
        }
        // El texto que va detrás de la última variable se emite como token
        // propio, así que hay que recogerlo: "Hola $n!" perdería la "!"
        if (this.actual().t === 'Texto') {
          const cola = this.come();
          actual += cola.v;
        }
        if (actual !== '') trozos.push({ t: 'lit', v: actual, tipo: 'string' });
        if (trozos.length === 1) return trozos[0];
        if (trozos.length === 0) return { t: 'lit', v: '', tipo: 'string' };
        return { t: 'concat', partes: trozos };
      }

      if (this.es('(')) {
        this.come();
        const exp = this.expresion();
        this.espera(')');
        return { t: 'paren', exp };
      }

      if (this.es('[')) {
        this.come();
        const pares = [];
        if (!this.es(']')) {
          do {
            pares.push(this.elementoArray());
          } while (this.es(',') && (this.come(), true));
        }
        this.espera(']');
        return { t: 'arrayLit', pares };
      }

      if (t.t === 'Var') { this.come(); return this.cadenaMiembros({ t: 'var', v: t.v }); }

      if (t.t === 'Id') {
        if (t.v === 'true') { this.come(); return { t: 'lit', v: true, tipo: 'bool' }; }
        if (t.v === 'false') { this.come(); return { t: 'lit', v: false, tipo: 'bool' }; }
        if (t.v === 'null') { this.come(); return { t: 'lit', v: null, tipo: 'null' }; }

        // array(1, 2, 3) es la forma antigua pero sigue usándose
        if (t.v === 'array') { this.come(); return this.arrayViejo(); }

        // isset($a, $b) y empty($a) son construcciones del lenguaje
        if (t.v === 'isset') {
          this.come();
          this.espera('(');
          const args = [];
          if (!this.es(')')) {
            do { args.push(this.expresion()); } while (this.es(',') && (this.come(), true));
          }
          this.espera(')');
          return { t: 'isset', args };
        }
        if (t.v === 'empty') {
          this.come();
          this.espera('(');
          const exp = this.expresion();
          this.espera(')');
          return { t: 'empty', exp };
        }

        this.come();
        return this.cadenaMiembros({ t: 'llamada', nombre: t.v, args: this.es('(') ? this.argumentos() : [] });
      }

      throw new ErrorPhp(`no se esperaba "${t.v === null ? 'fin de código' : t.v}"`, t.linea);
    },

    arrayViejo() {
      this.espera('(');
      const pares = [];
      if (!this.es(')')) {
        do {
          if (this.es(')')) break;
          pares.push(this.elementoArray());
        } while (this.es(',') && (this.come(), true));
      }
      this.espera(')');
      return { t: 'arrayLit', pares };
    },

    /** Un elemento de array: "clave" => valor o solo valor. */
    elementoArray() {
      const primero = this.expresion();
      if (this.es('=>')) {
        this.come();
        return { clave: primero, valor: this.expresion() };
      }
      return { valor: primero };
    },

    cadenaMiembros(base) {
      let expr = base;
      while (true) {
        if (this.es('[')) {
          this.come();
          // Un [] vacío significa "añade al final"
          const idx = this.es(']') ? null : this.expresion();
          this.espera(']');
          expr = { t: 'indice', obj: expr, idx, anade: idx === null };
          continue;
        }
        if (this.es('->')) {
          this.come();
          const prop = this.actual();
          this.come();
          expr = this.es('(')
            ? { t: 'llamadaMiembro', obj: expr, nombre: prop.v, args: this.argumentos() }
            : { t: 'miembro', obj: expr, nombre: prop.v };
          continue;
        }
        break;
      }
      return expr;
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

    // ── Sentencias ──

    bloque() {
      this.espera('{');
      const sent = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') {
          throw new ErrorPhp('falta cerrar una llave {', this.linea());
        }
        sent.push(this.sentencia());
      }
      this.espera('}');
      return { t: 'bloque', sent };
    },

    cuerpoDeBucle() {
      if (this.es('{')) return this.bloque();
      return { t: 'bloque', sent: [this.sentencia()] };
    },

    sentencia() {
      const t = this.actual();
      const linea = t.linea;

      if (this.es('{')) return this.bloque();
      if (this.es(';')) { this.come(); return { t: 'vacia' }; }

      // HTML que va fuera de <?php ?> no es código, se copia tal cual
      if (t.t === 'Fuera') { this.come(); return { t: 'fuera', v: t.v, linea }; }

      // <?= $nombre ?> es una abreviatura de <?php echo $nombre; ?>
      if (t.t === 'Corto') {
        this.come();
        const partes = [this.expresion()];
        while (this.es(',')) { this.come(); partes.push(this.expresion()); }
        this.puntoYComa();
        return { t: 'echo', partes, linea };
      }

      // unset($variable) borra la variable; unset($a["clave"]) borra el elemento
      if (this.esPalabra('unset')) {
        this.come();
        this.espera('(');
        const args = [];
        if (!this.es(')')) {
          do { args.push(this.expresion()); } while (this.es(',') && (this.come(), true));
        }
        this.espera(')');
        this.puntoYComa();
        return { t: 'unset', args, linea };
      }

      if (this.esPalabra('echo') || this.esPalabra('print')) {
        const cual = this.come().v;
        const partes = [this.expresion()];
        while (this.es(',')) { this.come(); partes.push(this.expresion()); }
        this.puntoYComa();
        return { t: 'echo', partes, esPrint: cual === 'print', linea };
      }

      if (this.esPalabra('var_dump')) {
        this.come();
        const args = this.es('(') ? this.argumentos() : [];
        this.puntoYComa();
        return { t: 'vardump', args, linea };
      }

      if (this.esPalabra('if')) {
        this.come();
        this.espera('(');
        const cond = this.expresion();
        this.espera(')');
        const entonces = this.sentencia();
        let siNo = null;
        if (this.esPalabra('elseif')) {
          // elseif es un if encadenado, no una palabra nueva
          this.come();
          this.espera('(');
          const cond2 = this.expresion();
          this.espera(')');
          const entonces2 = this.sentencia();
          let siNo2 = null;
          if (this.esPalabra('elseif')) {
            this.pos--;   // se resuelve como otro if en la siguiente vuelta
          } else if (this.esPalabra('else')) {
            this.come();
            siNo2 = this.sentencia();
          }
          siNo = { t: 'if', cond: cond2, entonces: entonces2, siNo: siNo2, linea };
        } else if (this.esPalabra('else')) {
          this.come();
          siNo = this.sentencia();
        }
        return { t: 'if', cond, entonces, siNo, linea };
      }

      if (this.esPalabra('while')) {
        this.come();
        this.espera('(');
        const cond = this.expresion();
        this.espera(')');
        return { t: 'while', cond, cuerpo: this.cuerpoDeBucle(), linea };
      }

      if (this.esPalabra('do')) {
        this.come();
        const cuerpo = this.cuerpoDeBucle();
        if (!this.esPalabra('while')) throw new ErrorPhp('do necesita while', linea);
        this.come();
        this.espera('(');
        const cond = this.expresion();
        this.espera(')');
        this.puntoYComa();
        return { t: 'doWhile', cond, cuerpo, linea };
      }

      if (this.esPalabra('for')) {
        this.come();
        this.espera('(');
        const init = this.es(';') ? null : this.forInit();
        this.puntoYComa();
        const cond = this.es(';') ? null : this.expresion();
        this.puntoYComa();
        const paso = this.es(')') ? null : this.expresion();
        this.espera(')');
        return { t: 'for', init, cond, paso, cuerpo: this.cuerpoDeBucle(), linea };
      }

      if (this.esPalabra('foreach')) {
        this.come();
        this.espera('(');
        const coleccion = this.expresion();
        if (!this.esPalabra('as')) throw new ErrorPhp('foreach necesita as', linea);
        this.come();
        const ref = this.es('&');
        if (ref) this.come();
        if (!this.esVar()) throw new ErrorPhp('después de as hace falta una variable', linea);
        let valor = this.come().v;
        let clave = null;
        if (this.es('=>')) {
          // foreach ($a as $clave => $valor): la primera es la clave
          this.come();
          if (!this.esVar()) throw new ErrorPhp('falta la variable del valor', linea);
          clave = valor;
          valor = this.come().v;
        }
        this.espera(')');
        return { t: 'foreach', coleccion, clave, valor, ref, cuerpo: this.cuerpoDeBucle(), linea };
      }

      if (this.esPalabra('switch')) {
        this.come();
        this.espera('(');
        const disc = this.expresion();
        this.espera(')');
        this.espera('{');
        const casos = [];
        while (!this.es('}')) {
          if (this.esPalabra('case')) {
            this.come();
            const val = this.expresion();
            // PHP admite "case 1:" y también "case 1;"
            if (this.es(':')) this.come();
            this.puntoYComa();
            casos.push({ valor: val, cuerpo: this.cuerpoDeCaso() });
          } else if (this.esPalabra('default')) {
            this.come();
            if (this.es(':')) this.come();
            this.puntoYComa();
            casos.push({ valor: null, cuerpo: this.cuerpoDeCaso() });
          } else {
            throw new ErrorPhp('dentro de switch solo caben case y default', this.linea());
          }
        }
        this.espera('}');
        return { t: 'switch', disc, casos, linea };
      }

      if (this.esPalabra('return')) {
        this.come();
        const exp = this.es(';') ? null : this.expresion();
        this.puntoYComa();
        return { t: 'return', exp, linea };
      }
      if (this.esPalabra('break')) { this.come(); this.puntoYComa(); return { t: 'break', linea }; }
      if (this.esPalabra('continue')) { this.come(); this.puntoYComa(); return { t: 'continue', linea }; }

      // Expresión suelta (normalmente una asignación)
      const exp = this.expresion();

      if (this.es('=')) {
        this.come();
        const der = this.expresion();
        this.puntoYComa();
        return { t: 'asigna', izq: exp, der, linea };
      }
      if (this.actual().t === 'Op' && ['+=', '-=', '*=', '/=', '%=', '.=', '**='].includes(this.actual().v)) {
        const op = this.come().v;
        const der = this.expresion();
        this.puntoYComa();
        return { t: 'asigCompuesta', op, izq: exp, der, linea };
      }

      this.puntoYComa();
      return { t: 'expr', exp, linea };
    },

    cuerpoDeCaso() {
      const cuerpo = [];
      while (!this.es('}') && !this.esPalabra('case') && !this.esPalabra('default')) {
        if (this.actual().t === 'EOF') break;
        cuerpo.push(this.sentencia());
      }
      return cuerpo;
    },

    /**
     * El inicio de un for admite expresiones sueltas ($i = 0) y también
     * varias separadas por comas.
     */
    forInit() {
      const partes = [];
      do {
        const exp = this.expresion();
        if (this.es('=')) {
          this.come();
          partes.push({ t: 'asigna', izq: exp, der: this.expresion() });
        } else if (['+=', '-=', '*=', '/=', '%=', '.='].includes(this.actual().v)) {
          const op = this.come().v;
          partes.push({ t: 'asigCompuesta', op, izq: exp, der: this.expresion() });
        } else {
          partes.push({ t: 'expr', exp });
        }
      } while (this.es(',') && (this.come(), true));
      return { t: 'forInit', partes };
    }
  };

  // ════════════════════════════════════════════════
  // FUNCIONES
  // ════════════════════════════════════════════════

  function construirArbol(src) {
    const tokens = tokenizar(src);
    const a = new Analizador(tokens);
    const funciones = [];

    while (a.actual().t !== 'EOF') {
      if (a.esPalabra('function')) {
        a.come();
        // &getEdad() también es una función, que devuelve por referencia
        if (a.es('&')) a.come();
        const nombre = a.actual().v;
        a.come();
        const params = leerParams(a);
        const cuerpo = a.bloque();
        funciones.push({ nombre, params, cuerpo });
        continue;
      }
      a.come();
    }

    return { funciones };
  }

  function leerParams(a) {
    const params = [];
    a.espera('(');
    if (!a.es(')')) {
      do {
        const ref = a.es('&');
        if (ref) a.come();
        if (!a.esVar()) { a.come(); continue; }
        const nombre = a.come().v;
        let defecto = null;
        if (a.es('=')) {
          a.come();
          defecto = a.expresion();
        }
        params.push({ nombre, referencia: ref, defecto });
      } while (a.es(',') && (a.come(), true));
    }
    a.espera(')');
    return params;
  }

  // ════════════════════════════════════════════════
  // FUNCIONES DE LA BIBLIOTECA
  // ════════════════════════════════════════════════

  /** Cada función devuelve un valor ya envuelto en su tipo. */
  const BUILTIN = {
    // ── Texto ──
    strlen: (a) => aTextoPhp(a[0]).length,
    strtoupper: (a) => aTextoPhp(a[0]).toUpperCase(),
    strtolower: (a) => aTextoPhp(a[0]).toLowerCase(),
    ucfirst: (a) => { const t = aTextoPhp(a[0]); return t.charAt(0).toUpperCase() + t.slice(1); },
    lcfirst: (a) => { const t = aTextoPhp(a[0]); return t.charAt(0).toLowerCase() + t.slice(1); },
    trim: (a) => aTextoPhp(a[0]).trim(),
    strrev: (a) => aTextoPhp(a[0]).split('').reverse().join(''),
    str_repeat: (a) => aTextoPhp(a[0]).repeat(Math.max(0, Math.trunc(num(a[1])))),
    str_split: (a) => construirArray(aTextoPhp(a[0]).split('').map((ch, k) => [k, V(ch, 'string')])),
    strpos: (a) => aTextoPhp(a[0]).indexOf(aTextoPhp(a[1])),
    // str_replace(buscar, reemplazo, texto): sustituye todas las apariciones
    str_replace: (a) => {
      const buscar = aTextoPhp(a[0]);
      const por = aTextoPhp(a[1]);
      const donde = aTextoPhp(a[2]);
      return donde.split(buscar).join(por);
    },
    substr: (a) => {
      const s = aTextoPhp(a[0]);
      let ini = Math.trunc(num(a[1]));
      if (ini < 0) ini = Math.max(0, s.length + ini);
      if (a.length === 2) return s.slice(ini);
      let largo = Math.trunc(num(a[2]));
      if (largo < 0) return s.slice(ini, s.length + largo);
      return s.slice(ini, ini + largo);
    },
    number_format: (a) => {
      const n = num(a[0]);
      const dec = a.length > 1 ? Math.trunc(num(a[1])) : 0;
      return n.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // ── Arrays ──
    count: (a) => (esArray(a[0]) ? a[0].valor.size : 1),
    array_sum: (a) => {
      let t = 0;
      if (esArray(a[0])) a[0].valor.forEach(v => { t += num(v); });
      return t;
    },
    array_keys: (a) => construirArray((esArray(a[0]) ? [...a[0].valor.keys()] : [])
      .map(k => [k, V(k, 'int')])),
    array_values: (a) => construirArray((esArray(a[0]) ? [...a[0].valor.entries()] : [])
      .map(([, v], k) => [k, v])),
    array_reverse: (a) => construirArray((esArray(a[0]) ? [...a[0].valor.entries()] : [])
      .map(([, v]) => [null, v]).reverse()
      .map(([, v], k) => [k, v])),
    array_merge: (a) => {
      const m = new Map();
      a.forEach(arr => { if (esArray(arr)) arr.valor.forEach((v, k) => m.set(String(k), v)); });
      return arrayV(m);
    },
    in_array: (a) => {
      if (!esArray(a[1])) return false;
      for (const v of a[1].valor.values()) {
        if (texto(v) === texto(a[0])) return true;
      }
      return false;
    },
    array_key_exists: (a) => !!(esArray(a[1]) && a[1].valor.has(aTextoPhp(a[0]))),
    array_push: (a, ctx) => {
      const arr = a[0];
      if (!esArray(arr)) return null;
      let k = arr.valor.size;
      a.slice(1).forEach(v => arr.valor.set(String(k++), v));
      return arr.valor.size;
    },
    array_pop: (a) => {
      const arr = a[0];
      if (!esArray(arr) || arr.valor.size === 0) return V(null, 'null');
      const claves = [...arr.valor.keys()];
      const ultimo = claves[claves.length - 1];
      const v = arr.valor.get(ultimo);
      arr.valor.delete(ultimo);
      return v;
    },
    implode: (a) => {
      // PHP acepta implode(", ", $a) y implode($a, ", ") por igual
      const arr = a.find(x => esArray(x));
      const glue = a.find(x => !esArray(x));
      if (!arr) return '';
      return [...arr.valor.values()].map(texto).join(glue ? texto(glue) : '');
    },
    explode: (a) => {
      const sep = aTextoPhp(a[0]);
      const s = aTextoPhp(a[1]);
      if (sep === '') return construirArray([[0, V(s, 'string')]]);
      return construirArray(s.split(sep).map((p, k) => [k, V(p, 'string')]));
    },

    // ── Comprobaciones ──
    is_array: (a) => esArray(a[0]),
    is_string: (a) => !!a[0] && a[0].tipo === 'string',
    is_int: (a) => !!a[0] && a[0].tipo === 'int',
    is_float: (a) => !!a[0] && a[0].tipo === 'float',
    is_bool: (a) => !!a[0] && a[0].tipo === 'bool',
    is_null: (a) => !a[0] || a[0].tipo === 'null',
    is_numeric: (a) => {
      if (!a[0]) return false;
      if (a[0].tipo === 'int' || a[0].tipo === 'float') return true;
      return /^\s*-?\d+(\.\d+)?\s*$/.test(aTextoPhp(a[0]));
    },
    var_export: (a) => V(volcarPhp(a[0]).replace(/\n\s*/g, ' '), 'string')
  };

  const NOMBRES_BUILTIN = Object.keys(BUILTIN).sort().join(', ');

  function texto(v) { return aTextoPhp(v); }
  function num(v) { return Number(aTextoPhp(v)); }

  // ════════════════════════════════════════════════
  // EJECUCIÓN
  // ════════════════════════════════════════════════

  class Ejecutor {
    constructor(arbol, opciones) {
      this.arbol = arbol;
      this.funciones = arbol.funciones || [];
      this.salida = '';
      this.impresiones = 0;   // echo false escribe nada, pero sí escribe
      this.ambitos = [];
      this.baseAmbito = 0;
      this.limitePasos = (opciones && opciones.limitePasos) || 2_000_000;
      this.pasos = 0;
    }

    error(msg, linea) { throw new ErrorPhp(msg, linea); }

    // ── Ámbitos ──

    entra() { this.ambitos.push(new Map()); }
    sale() { this.ambitos.pop(); }

    caja(nombre) {
      for (let i = this.ambitos.length - 1; i >= this.baseAmbito; i--) {
        const m = this.ambitos[i];
        if (m && m.has(nombre)) return m.get(nombre);
      }
      return null;
    }

    /** En PHP una variable sin valor no es null: simplemente no existe. */
    existe(nombre) { return this.caja(nombre) !== null; }

    buscar(nombre, linea) {
      const c = this.caja(nombre);
      return c === null ? V(null, 'null') : c.valor;
    }

    definir(nombre, valor) {
      this.ambitos[this.ambitos.length - 1].set(nombre, { valor });
    }

    asignar(nombre, valor, linea) {
      const c = this.caja(nombre);
      if (c === null) {
        // PHP crea la variable si no existe, sin dar error
        this.definir(nombre, valor);
        return;
      }
      c.valor = valor;
    }

    // ── Expresiones ──

    ev(e) {
      this.pasos++;
      if (this.pasos > this.limitePasos) {
        throw new ErrorPhp('el programa no termina (¿bucle infinito?). Revisa las condiciones.');
      }

      switch (e.t) {
        case 'lit': return V(e.v, e.tipo);
        case 'paren': return this.ev(e.exp);

        // "Hola $nombre" se resuelve concatenando los trozos
        case 'concat': {
          let salida = '';
          e.partes.forEach(p => { salida += (p.t === 'lit' ? p.v : aTextoPhp(this.ev({ t: 'var', v: p.v }))); });
          return V(salida, 'string');
        }

        case 'interp': return this.ev({ t: 'var', v: e.v });

        case 'no': return V(!this.cierto(this.ev(e.exp)), 'bool');
        case 'menos': {
          const v = this.ev(e.exp);
          return V(-num(v), Number.isInteger(num(v)) ? 'int' : 'float');
        }

        case 'ternario':
          return this.cierto(this.ev(e.cond)) ? this.ev(e.entonces) : this.ev(e.siNo);

        case 'and': return V(this.cierto(this.ev(e.izq)) && this.cierto(this.ev(e.der)), 'bool');
        case 'or': return V(this.cierto(this.ev(e.izq)) || this.cierto(this.ev(e.der)), 'bool');

        case 'isset': {
          for (const a of e.args) {
            if (!this.definido(a)) return V(false, 'bool');
          }
          return V(true, 'bool');
        }

        case 'empty': return V(!this.cierto(this.ev(e.exp)), 'bool');

        case 'preinc': {
          const actual = this.ev(e.exp);
          const nuevo = V(num(actual) + (e.resta ? -1 : 1), actual.tipo === 'string' ? 'int' : actual.tipo);
          this.escribirEn(e.exp, nuevo);
          return nuevo;
        }

        case 'postinc': {
          const actual = this.ev(e.exp);
          const nuevo = V(num(actual) + (e.op === '++' ? 1 : -1), actual.tipo === 'string' ? 'int' : actual.tipo);
          this.escribirEn(e.exp, nuevo);
          return actual;
        }

        case 'arrayLit': {
          const m = new Map();
          let siguiente = 0;
          for (const p of e.pares) {
            const clave = p.clave ? texto(this.ev(p.clave)) : String(siguiente++);
            m.set(clave, this.ev(p.valor));
          }
          return arrayV(m);
        }

        case 'indice': return this.indice(e);
        case 'var': {
          const v = this.buscar(e.v, e.linea);
          return v;
        }

        case 'llamada': return this.llamar(e);
        case 'llamadaMiembro':
        case 'miembro':
          this.error(
            'las clases y los objetos no entran en este curso. '
            + `Si has escrito "${e.nombre}", quizá querías una variable $${e.nombre}.`,
            e.linea
          );
          return null;

        case 'bin': return this.binario(e);

        default:
          this.error('expresión no soportada: ' + e.t, e.linea);
          return null;
      }
    }

    /**
     * ¿Está definido? Es lo que comprueba isset.
     * Una variable que existe pero vale null cuenta como no definida:
     * en PHP, isset($a) es false si $a es null.
     */
    definido(e) {
      if (e.t === 'var') {
        const c = this.caja(e.v);
        if (c === null) return false;
        return !(c.valor && c.valor.tipo === 'null');
      }
      if (e.t === 'indice') {
        const obj = e.obj;
        if (obj.t === 'var') {
          if (!this.existe(obj.v)) return false;
          const arr = this.buscar(obj.v, e.linea);
          if (!esArray(arr)) return false;
          return arr.valor.has(this.claveDeIndice(e.idx));
        }
        const cont = this.ev(obj);
        return esArray(cont) && cont.valor.has(this.claveDeIndice(e.idx));
      }
      // isset nunca falla: si no se puede comprobar, se dice que sí está
      try {
        const v = this.ev(e);
        return !(v && v.tipo === 'null');
      } catch (err) {
        return false;
      }
    }

    claveDeIndice(idxExp) {
      const v = this.ev(idxExp);
      if (v && v.tipo === 'string') return v.valor;
      return String(Math.trunc(num(v)));
    }

    indice(e) {
      const obj = this.ev(e.obj);
      // Leer $a[] no tiene sentido: hay que asignar
      const clave = e.anade ? String(esArray(obj) ? obj.valor.size : 0) : this.claveDeIndice(e.idx);

      if (obj && obj.tipo === 'string') {
        const i = Math.trunc(num(this.ev(e.idx)));
        return V(i >= 0 && i < obj.valor.length ? obj.valor[i] : '', 'string');
      }
      if (esArray(obj)) {
        // Leer una clave que no existe da null, con un aviso por consola
        if (!obj.valor.has(clave)) {
          this.salida += `Warning: Undefined array key ${clave} in script on line 1\n`;
          this.impresiones++;
          return V(null, 'null');
        }
        return obj.valor.get(clave);
      }
      this.error('no se puede usar [] sobre ' + (obj && obj.tipo ? obj.tipo : 'este valor'), e.linea);
      return null;
    }

    escribirEn(exp, valor) {
      if (exp.t === 'var') {
        const c = this.caja(exp.v);
        // Con foreach as &$v la caja guarda la posición del array: se
        // sustituye la entrada entera por el valor nuevo
        if (c && c.posicion) {
          c.posicion.mapa.set(c.posicion.clave, valor);
          c.valor = valor;
          return;
        }
        this.asignar(exp.v, valor, exp.linea);
        return;
      }
      if (exp.t === 'indice') {
        const arr = exp.obj.t === 'var' ? this.buscar(exp.obj.v, exp.linea) : this.ev(exp.obj);
        if (!esArray(arr)) {
          this.error('no se puede asignar dentro de ' + (arr && arr.tipo ? arr.tipo : 'este valor'), exp.linea);
        }
        // Con [] vacío se añade al final del array
        const clave = exp.anade ? String(arr.valor.size) : this.claveDeIndice(exp.idx);
        arr.valor.set(clave, valor);
        return;
      }
      this.error('esa expresión no se puede usar a la izquierda del =', exp.linea);
    }

    // ── Operadores ──

    binario(e) {
      const op = e.op;
      const izq = this.ev(e.izq);
      const der = this.ev(e.der);

      switch (op) {
        // El punto concatena textos. Con números también: "5" . "3" da "53"
        case '.':
          return V(texto(izq) + texto(der), 'string');

        // El más convierte a número: "5" + 3 da 8, no "53"
        case '+': {
          if (esArray(izq) && esArray(der)) {
            const m = new Map();
            der.valor.forEach((v, k) => m.set(String(k), v));
            izq.valor.forEach((v, k) => m.set(String(k), v));
            return arrayV(m);
          }
          const r = num(izq) + num(der);
          return V(Number.isInteger(r) ? r : r, Number.isInteger(r) ? 'int' : 'float');
        }
        case '-': {
          const r = num(izq) - num(der);
          return V(Number.isInteger(r) ? r : r, Number.isInteger(r) ? 'int' : 'float');
        }
        case '*': {
          const r = num(izq) * num(der);
          return V(Number.isInteger(r) ? r : r, Number.isInteger(r) ? 'int' : 'float');
        }
        case '/': {
          if (num(der) === 0) {
            this.error('división por cero');
          }
          const a = num(izq);
          const b = num(der);
          const r = a / b;
          // PHP devuelve int solo si el resultado es exacto
          return V(Number.isInteger(r) ? r : r, Number.isInteger(r) ? 'int' : 'float');
        }
        case '%': {
          const b = num(der);
          if (b === 0) this.error('módulo por cero');
          const r = num(izq) % b;
          return V(r, Number.isInteger(r) ? 'int' : 'float');
        }
        case '**': return V(Math.pow(num(izq), num(der)), 'float');

        case '==': return V(this.igual(izq, der), 'bool');
        case '===': return V(this.igualEstricto(izq, der), 'bool');
        case '!=': return V(!this.igual(izq, der), 'bool');
        case '!==': return V(!this.igualEstricto(izq, der), 'bool');
        case '<': return V(num(izq) < num(der), 'bool');
        case '>': return V(num(izq) > num(der), 'bool');
        case '<=': return V(num(izq) <= num(der), 'bool');
        case '>=': return V(num(izq) >= num(der), 'bool');

        case 'instanceof':
          this.error('las clases no entran en este curso, así que instanceof no se puede usar', e.linea);
          return null;

        default:
          this.error('operador no soportado: ' + op, e.linea);
          return null;
      }
    }

    /** == convierte tipos: "5" == 5 es true. */
    igual(a, b) {
      if (esArray(a) || esArray(b)) return esArray(a) && esArray(b) && a.valor === b.valor;
      return texto(a) === texto(b);
    }

    /** === además exige el mismo tipo. */
    igualEstricto(a, b) {
      if (esArray(a) || esArray(b)) return esArray(a) && esArray(b) && a.valor === b.valor;
      return a.tipo === b.tipo && texto(a) === texto(b);
    }

    cierto(v) {
      if (!v) return false;
      if (v.tipo === 'bool') return v.valor === true;
      if (v.tipo === 'null') return false;
      if (v.tipo === 'string') return v.valor !== '' && v.valor !== '0';
      if (v.tipo === 'array') return v.valor.size > 0;
      if (v.tipo === 'int' || v.tipo === 'float') return Number(v.valor) !== 0;
      return true;
    }

    // ── Llamadas ──

    llamar(e) {
      // Los argumentos por referencia necesitan el nodo, no solo el valor:
      // hay que saber a qué variable apuntar
      const args = (e.args || []).map(a => this.ev(a));

      const fn = this.funciones.find(f => f.nombre === e.nombre);
      if (fn) return this.invocar(fn, args, e.linea, e.args);

      if (Object.prototype.hasOwnProperty.call(BUILTIN, e.nombre)) {
        // Se devuelve tal cual, salvo que la función devuelva un booleano o
        // un número pelado: eso hay que envolverlo con su tipo de PHP
        const r = BUILTIN[e.nombre](args, this);
        if (typeof r === 'boolean' || typeof r === 'number') return V(r);
        return r;
      }

      this.error(
        `la función "${e.nombre}" no existe${Object.keys(BUILTIN).length ? `. Hay de la biblioteca: ${NOMBRES_BUILTIN}` : ''}`,
        e.linea
      );
      return null;
    }

    invocar(fn, args, linea, argNodos) {
      // Las cajas de los parámetros por referencia se buscan ANTES de cambiar
      // de ámbito. Si se buscaran después, el ámbito nuevo no vería las
      // variables de quien llama, que es justo lo que hay que enlazar.
      const cajasRef = fn.params.map((p, i) => {
        if (!p.referencia) return null;
        const nodo = (argNodos || [])[i];
        return nodo && nodo.t === 'var' ? this.caja(nodo.v) : null;
      });

      const previoBase = this.baseAmbito;
      this.baseAmbito = this.ambitos.length;
      this.entra();

      fn.params.forEach((p, i) => {
        let v = i < args.length ? args[i] : V(null, 'null');
        if (p.defecto && (!v || v.tipo === 'null')) v = this.ev(p.defecto);

        // La clave de PHP: la función y quien llama comparten la MISMA
        // variable, así que al asignar dentro se ve fuera.
        if (p.referencia && cajasRef[i]) {
          this.ambitos[this.ambitos.length - 1].set(p.nombre, cajasRef[i]);
        } else {
          this.definir(p.nombre, v);
        }
      });

      let retorno = null;
      try {
        this.ejecutar(fn.cuerpo);
      } catch (err) {
        if (err && err.__return) retorno = err.valor;
        else throw err;
      } finally {
        this.sale();
        this.baseAmbito = previoBase;
      }

      return retorno || V(null, 'null');
    }

    // ── Sentencias ──

    ejecutar(nodo) {
      if (!nodo) return null;
      if (nodo.t === 'bloque') return this.ejecutarUna(nodo);
      return this.ejecutarLista(nodo.sent ? nodo.sent : [nodo]);
    }

    ejecutarLista(lista) {
      for (const s of lista) {
        const r = this.ejecutarUna(s);
        if (r) return r;
      }
      return null;
    }

    ejecutarUna(s) {
      switch (s.t) {
        case 'vacia': return null;

        case 'fuera': {
          // El HTML de la plantilla se envía tal cual, igual que en PHP
          const texto = s.v;
          this.salida += texto;
          this.impresiones++;
          return null;
        }

        case 'unset': {
          s.args.forEach(a => {
            if (a.t === 'var') {
              // Se borra en el ámbito donde la variable vive, no en otro
              for (let i = this.ambitos.length - 1; i >= this.baseAmbito; i--) {
                const m = this.ambitos[i];
                if (m && m.has(a.v)) { m.delete(a.v); break; }
              }
            } else if (a.t === 'indice') {
              const arr = a.obj.t === 'var' ? this.buscar(a.obj.v, a.linea) : this.ev(a.obj);
              if (esArray(arr)) arr.valor.delete(this.claveDeIndice(a.idx));
            }
          });
          return null;
        }

        case 'echo': {
          // También aquí el texto va primero: una expresión puede escribir
          // un aviso en this.salida y no queremos perderlo
          const texto = s.partes.map(p => aTextoPhp(this.ev(p))).join('');
          this.salida += texto;
          this.impresiones++;
          return null;
        }

        case 'vardump': {
          // Ojo: el texto se calcula ANTES de tocar this.salida. Con
          // "this.salida += volcarPhp(this.ev(a))" el motor leería el valor
          // viejo de salida antes de evaluar this.ev(a), y el aviso que puede
          // escribir esa expresión (una clave inexistente) se perdería.
          s.args.forEach(a => {
            const texto = volcarPhp(this.ev(a));
            this.salida += texto + '\n';
            this.impresiones++;
          });
          return null;
        }

        case 'asigna': {
          if (s.izq.t === 'var') {
            this.escribirEn(s.izq, this.ev(s.der));
          } else {
            this.escribirEn(s.izq, this.ev(s.der));
          }
          return null;
        }

        case 'asigCompuesta': {
          const opReal = s.op === '.=' ? '.' : s.op[0];
          this.ev(s.izq); // valida el destino; `binario` vuelve a leerlo
          const nuevo = this.binario({ t: 'bin', op: opReal, izq: s.izq, der: s.der });
          this.escribirEn(s.izq, nuevo);
          return null;
        }

        case 'expr': this.ev(s.exp); return null;

        case 'if': {
          if (this.cierto(this.ev(s.cond))) return this.ejecutar(s.entonces);
          if (s.siNo) return this.ejecutar(s.siNo);
          return null;
        }

        case 'while': {
          let vueltas = 0;
          while (this.cierto(this.ev(s.cond))) {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') break;
              if (r.t === 'return') return r;
            }
            if (++vueltas > 100000) {
              throw new ErrorPhp('el bucle while no termina (revisa la condición)', s.linea);
            }
          }
          return null;
        }

        case 'doWhile': {
          let vueltas = 0;
          do {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') return null;
              if (r.t === 'return') return r;
            }
            if (++vueltas > 100000) throw new ErrorPhp('el bucle do-while no termina', s.linea);
          } while (this.cierto(this.ev(s.cond)));
          return null;
        }

        case 'for': {
          this.entra();
          if (s.init) s.init.partes.forEach(p => this.ejecutarUna(p));
          let vueltas = 0;
          while (!s.cond || this.cierto(this.ev(s.cond))) {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') { this.sale(); return null; }
              if (r.t === 'return') { this.sale(); return r; }
            }
            if (s.paso) this.ev(s.paso);
            if (++vueltas > 100000) {
              this.sale();
              throw new ErrorPhp('el bucle for no termina (revisa la condición)', s.linea);
            }
          }
          this.sale();
          return null;
        }

        case 'foreach': {
          const col = this.ev(s.coleccion);
          if (!esArray(col)) {
            this.error('foreach solo funciona sobre arrays y aquí hay ' + (col && col.tipo ? col.tipo : 'nada'), s.linea);
          }
          this.entra();
          for (const [k, v] of col.valor) {
            if (s.clave) this.definir(s.clave, V(k, 'int'));
            // foreach ($a as &$v) enlaza $v con la posición del array, así
            // que lo que se le asigne va a tocar el array original.
            // Guarda el mapa y la clave: hay que REEMPLAZAR la entrada, no
            // meterse dentro del valor, que acabaría siendo un V dentro de
            // otro V y al imprimir saldría [object Object].
            if (s.ref) {
              this.ambitos[this.ambitos.length - 1].set(s.valor, {
                valor: v,
                posicion: { mapa: col.valor, clave: k }
              });
            }
            else this.definir(s.valor, v);
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') { this.sale(); return null; }
              if (r.t === 'return') { this.sale(); return r; }
            }
          }
          this.sale();
          return null;
        }

        case 'switch': {
          const d = this.ev(s.disc);
          let ejecutado = false;
          for (const c of s.casos) {
            if (!ejecutado) {
              if (c.valor === null) ejecutado = true;
              else if (this.igual(d, this.ev(c.valor))) ejecutado = true;
              if (!ejecutado) continue;
            }
            for (const sent of c.cuerpo) {
              const r = this.ejecutarUna(sent);
              if (r) {
                if (r.t === 'break') return null;
                if (r.t === 'return') return r;
              }
            }
          }
          return null;
        }

        case 'return': {
          const v = s.exp ? this.ev(s.exp) : V(null, 'null');
          const err = new ErrorPhp('return');
          err.__return = true;
          err.valor = v;
          throw err;
        }

        case 'break': return { t: 'break' };
        case 'continue': return { t: 'continue' };

        case 'bloque': {
          this.entra();
          const r = this.ejecutarLista(s.sent || []);
          this.sale();
          return r;
        }

        default:
          this.error('sentencia no soportada: ' + s.t, s.linea);
          return null;
      }
    }
  }

  // ════════════════════════════════════════════════
  // API PÚBLICA
  // ════════════════════════════════════════════════

  /**
   * Ejecuta un programa PHP.
   * @returns {{output: string, error: boolean}}
   */
  function ejecutar(src, opciones) {
    try {
      const arbol = construirArbol(src);
      const ejec = new Ejecutor(arbol, opciones);

      // El cuerpo del programa son las sentencias que no son funciones
      const cuerpo = construirCuerpo(src);
      ejec.entra();
      ejec.ejecutarLista(cuerpo);

      // echo false escribe una cadena vacía: es printing, no silencio
      const salida = ejec.impresiones === 0
        ? '(el programa no imprime nada)\n'
        : (ejec.salida.endsWith('\n') ? ejec.salida : ejec.salida + '\n');

      return { output: salida, error: false };
    } catch (err) {
      let mensaje = err instanceof ErrorPhp
        ? err.message
        : (err && err.message ? err.message : String(err));

      // Error típico de quien pega una página HTML sin abrir el bloque PHP:
      // el mensaje solo, si se parece a una etiqueta, no sirve de nada.
      const fuente = String(src == null ? '' : src);
      if (!fuente.includes('<?') && /no se esperaba "<[^?]/.test(mensaje)) {
        mensaje = 'el código PHP va dentro de <?php ... ?> y fuera de esas etiquetas '
          + 'el navegador recibe HTML, no código';
      }

      return { output: 'Error de PHP: ' + mensaje + '\n', error: true };
    }
  }

  /**
   * El cuerpo del programa son las sentencias de nivel superior.
   *
   * No se puede leer el árbol entero: construirArbol ya se comió las
   * declaraciones de función. Se vuelve a analizar el código con un
   * analizador que solo lee sentencias, y se salta las funciones.
   */
  function construirCuerpo(src) {
    const tokens = tokenizar(src);
    const a = new Analizador(tokens);
    const sent = [];

    while (a.actual().t !== 'EOF') {
      // Una declaración de función no se ejecuta, se guarda aparte
      if (a.esPalabra('function')) {
        a.come();
        if (a.es('&')) a.come();
        a.come();                       // nombre
        leerParams(a);                  // parámetros
        a.bloque();                     // cuerpo
        continue;
      }
      sent.push(a.sentencia());
    }

    return sent;
  }

  return {
    ejecutar,
    tokenizar,
    construirArbol,
    ErrorPhp,
    aTextoPhp,
    volcarPhp,
    formatoFloat,
    _internas: { V, inferirTipo, arrayV, esArray, construirArray, BUILTIN }
  };
})();