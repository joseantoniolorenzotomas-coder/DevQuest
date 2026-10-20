// DevQuest C++ — Mini intérprete de C++ para los ejercicios
//
// No hay compilador en el navegador, así que escribimos un intérprete del
// subconjunto que se enseña en el curso. Mismo criterio que con SQL y Java:
// puro, determinista y sin dependencias, para que las soluciones de los
// ejercicios se puedan ejecutar también en los tests de Node.
//
// Cubre:
//   tipos     int, double, float, char, bool, long, short, string, void
//   variables declaración, asignación, shadowing, const
//   operadores aritméticos, comparación, lógicos, ++/--, +=, ternario
//   control   if / else if / else, switch, while, do-while, for, range-for,
//             break, continue
//   funciones return, parámetros por valor y por referencia
//   arrays    int arr[5], arr[] = {1,2,3}, arr[i], arr[i] =
//   string    length(), size(), substr, find, ==, +, +=, [], push_back
//   vector    push_back, size, at, [], empty, clear
//   structs   struct, class, constructores, métodos, . y ->
//   PUNTEROS  & dirección de, * desreferencia, p[i], p+n, ++p, nullptr,
//             new, new[], delete, delete[]
//   salida    cout << ... << endl
//
// Lo que NO cubre, y por tanto el temario no usa: plantillas, herencia,
// polimorfismo, lambdas, operator overloading y la biblioteca estándar más
// allá de string y vector. Se explican como concepto en los módulos finales.
//
// La gestión de memoria NO es real: es un mapa de direcciones para que el
// alumno vea qué hace un puntero. No hay recolector de basura, igual que en
// C++ real, así que usar tras un delete y liberar dos veces dan error con un
// mensaje que explica el fallo.

window.CPP_ENGINE = (function () {

  // ════════════════════════════════════════
  // ERRORES
  // ════════════════════════════════════════

  class ErrorCpp extends Error {
    constructor(mensaje, linea) {
      super(linea ? `Línea ${linea}: ${mensaje}` : mensaje);
      this.name = 'ErrorCpp';
      this.linea = linea || 0;
    }
  }

  // ════════════════════════════════════════
  // FORMATO DE SALIDA (como hace cout)
  // ════════════════════════════════════════

  /**
   * cout escribe los double como %g con 6 dígitos significativos y sin ceros
   * de más. Por eso 5.0 sale "5" y 0.1 + 0.2 sale "0.3". Es la diferencia más
   * llamativa con Java, que sí escribiría 5.0.
   */
  function formatoCout(n) {
    if (typeof n !== 'number') return String(n);
    if (Number.isNaN(n)) return 'nan';
    if (!isFinite(n)) return n > 0 ? 'inf' : '-inf';
    if (Number.isInteger(n) && Math.abs(n) < 1e6) return String(n);

    let mant;
    let e;
    if (Math.abs(n) < 1e-5 || Math.abs(n) >= 1e6) {
      const partes = n.toExponential(5).split('e');
      mant = partes[0];
      e = parseInt(partes[1], 10);
      if (e < -4 || e >= 6) {
        mant = mant.replace(/0+$/, '').replace(/\.$/, '');
        return mant + 'e' + (e >= 0 ? '+' : '-') + String(Math.abs(e)).padStart(2, '0');
      }
    } else {
      e = Math.floor(Math.log10(Math.abs(n)));
    }

    let out = n.toFixed(Math.max(0, 5 - e));
    if (out.includes('.')) out = out.replace(/0+$/, '').replace(/\.$/, '');
    return out;
  }

  function aTextoCpp(v) {
    if (v === null || v === undefined) return '';
    if (typeof v !== 'object' || !('valor' in v)) return String(v);
    const x = v.valor;
    if (x === null || x === undefined) return '';
    switch (v.tipo) {
      case 'double':
      case 'float':
        return formatoCout(Number(x));
      case 'Puntero':
        return x === null ? '0x0' : '0x' + ((x.direccion >>> 0).toString(16));
      case 'bool':
        return x ? '1' : '0';
      default:
        return String(x);
    }
  }

  // ════════════════════════════════════════
  // LÉXICO
  // ════════════════════════════════════════

  const ESCAPES = {
    n: '\n', t: '\t', r: '\r', 0: '\0', '\\': '\\', '"': '"', "'": "'",
    a: '\x07', b: '\b', f: '\f', v: '\v'
  };

  function tokenizar(src) {
    const tokens = [];
    let i = 0;
    let linea = 1;
    const s = String(src == null ? '' : src);

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

      if (c === '"') {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === '\\') { valor += ESCAPES[s[i + 1]] !== undefined ? ESCAPES[s[i + 1]] : s[i + 1]; i += 2; }
          else { if (s[i] === '\n') linea++; valor += s[i]; i++; }
        }
        i++;
        tokens.push({ t: 'Texto', v: valor, linea });
        continue;
      }

      if (c === "'") {
        let valor = '';
        i++;
        if (s[i] === '\\') { valor = ESCAPES[s[i + 1]] !== undefined ? ESCAPES[s[i + 1]] : s[i + 1]; i += 2; }
        else { valor = s[i]; i++; }
        i++;
        tokens.push({ t: 'Char', v: valor, linea });
        continue;
      }

      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
        let n = '';
        let decimal = false;
        while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        if (s[i] === '.' && /[0-9]/.test(s[i + 1] || '')) {
          decimal = true;
          n += s[i]; i++;
          while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        }
        if (/[uUlLfF]/.test(s[i] || '')) {
          if (/[fF]/.test(s[i])) decimal = true;
          i++;
        }
        tokens.push({ t: 'Num', v: decimal ? parseFloat(n) : parseInt(n, 10), decimal, linea });
        continue;
      }

      if (/[A-Za-z_]/.test(c)) {
        let id = '';
        while (i < s.length && /[A-Za-z0-9_]/.test(s[i])) { id += s[i]; i++; }
        tokens.push({ t: 'Id', v: id, linea });
        continue;
      }

      const ops3 = ['<<=', '>>=', '...'];
      const ops2 = ['<<', '>>', '==', '!=', '<=', '>=', '&&', '||', '++', '--',
        '+=', '-=', '*=', '/=', '%=', '->', '::'];
      if (ops3.includes(s.slice(i, i + 3))) { tokens.push({ t: 'Op', v: s.slice(i, i + 3), linea }); i += 3; continue; }
      if (ops2.includes(s.slice(i, i + 2))) { tokens.push({ t: 'Op', v: s.slice(i, i + 2), linea }); i += 2; continue; }

      if ('+-*/%=<>!&|^~?:;,.()[]{}#'.includes(c)) { tokens.push({ t: 'Op', v: c, linea }); i++; continue; }

      throw new ErrorCpp(`carácter inesperado "${c}"`, linea);
    }

    tokens.push({ t: 'EOF', v: null, linea });
    return tokens;
  }

  // ════════════════════════════════════════
  // TIPOS
  // ════════════════════════════════════════

  const PRIMITIVOS = ['void', 'int', 'double', 'float', 'char', 'bool', 'long', 'short', 'unsigned', 'string', 'vector'];
  const ENTEROS = ['int', 'long', 'short', 'unsigned', 'char'];

  function V(valor, tipo) {
    return { valor, tipo: tipo || inferirTipo(valor) };
  }

  function inferirTipo(v) {
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double';
    if (typeof v === 'string') return 'String';
    if (typeof v === 'boolean') return 'bool';
    return 'Object';
  }

  /** El valor que tiene una variable recién declarada, como en C++ real. */
  function valorPorDefecto(tipo) {
    if (!tipo) return V(0, 'int');
    if (tipo === 'bool') return V(false, 'bool');
    if (tipo === 'char') return V('\0', 'char');
    if (tipo === 'string' || tipo === 'String') return V('', 'String');
    if (tipo === 'double' || tipo === 'float') return V(0, 'double');
    if (tipo.endsWith('[]')) return V([], tipo);
    if (tipo.endsWith('&')) return V(null, 'Referencia');
    if (tipo.endsWith('*')) return NULO();
    return V(0, 'int');
  }

  const NULO = () => V(null, 'Puntero');
  const esPuntero = (v) => !!v && v.tipo === 'Puntero';
  const esReferencia = (v) => !!v && v.tipo === 'Referencia';

  // ════════════════════════════════════════
  // MEMORIA
  // ════════════════════════════════════════

  /**
   * Espacio de direcciones para que los punteros signifiquen algo.
   *
   * Cada variable ocupa una dirección. Un puntero guarda esa dirección, y
   * escribir por el puntero escribe en la variable original: eso es
   * justamente lo que hay que entender de C++.
   *
   * Los elementos de un array se reservan uno detrás de otro, con pasos de 8
   * como en memoria real, para que la aritmética de punteros funcione: p + 1
   * avanza justo al elemento siguiente.
   */
  class Memoria {
    constructor() {
      this.celdas = new Map();      // dir -> { valor, tipo, liberado }
      this.siguiente = 0x1000;
      this.fugas = [];
      this.paso = 8;
    }

    nueva(valor, tipo) {
      const dir = this.siguiente;
      this.siguiente += this.paso;
      this.celdas.set(dir, { valor, tipo: tipo || inferirTipo(valor), liberado: false });
      return dir;
    }

    /** new: memoria que hay que liberar con delete. */
    reservar(valor, tipo) {
      const dir = this.nueva(valor, tipo);
      this.fugas.push(dir);
      return dir;
    }

    /** Reserva n celdas seguidas y devuelve la dirección de la primera. */
    reservarBloque(n, tipo) {
      const base = this.siguiente;
      for (let k = 0; k < n; k++) {
        this.celdas.set(base + k * this.paso, { valor: valorPorDefecto(tipo), tipo, liberado: false });
        this.siguiente += this.paso;
        this.fugas.push(base + k * this.paso);
      }
      return base;
    }

    celda(dir, linea) {
      const c = this.celdas.get(dir);
      if (!c) {
        throw new ErrorCpp(
          `se apunta a la dirección ${hex(dir)}, que no pertenece a este programa. `
          + 'Suele ser un puntero sin inicializar.', linea
        );
      }
      return c;
    }

    leer(dir, linea, que) {
      const c = this.celda(dir, linea);
      if (c.liberado) {
        throw new ErrorCpp(
          `${que || 'este puntero'} apunta a memoria que ya habías liberado con delete. `
          + 'Es un "use after free": el programa está usando una dirección que ya no le pertenece.',
          linea
        );
      }
      return c.valor;
    }

    escribir(dir, valor, linea) {
      const c = this.celda(dir, linea);
      if (c.liberado) {
        throw new ErrorCpp(
          'se está escribiendo en memoria ya liberada con delete. Es un "use after free".', linea
        );
      }
      c.valor = valor;
    }

    liberar(dir, linea) {
      const c = this.celda(dir, linea);
      if (c.liberado) {
        throw new ErrorCpp(
          'esta memoria ya estaba liberada con delete. Liberar dos veces la misma dirección '
          + 'es un error grave: en un programa real corrompe los datos de otro objeto.',
          linea
        );
      }
      c.liberado = true;
      c.valor = null;
      const i = this.fugas.indexOf(dir);
      if (i >= 0) this.fugas.splice(i, 1);
    }

    liberarBloque(base, largo, linea) {
      for (let k = 0; k < largo; k++) this.liberar(base + k * this.paso, linea);
    }

    get fugasPendientes() { return this.fugas.length; }
  }

  function hex(n) { return '0x' + ((n >>> 0).toString(16)); }

  // ════════════════════════════════════════
  // MÉTODOS DE string Y vector
  // ════════════════════════════════════════

  const METODOS_STRING = {
    length: (s) => s.length,
    size: (s) => s.length,
    empty: (s) => s.length === 0,
    substr: (s, a, b) => {
      const ini = a < 0 ? 0 : a;
      const fin = b === undefined ? s.length : b;
      if (ini > s.length || fin > s.length || ini > fin) {
        throw new ErrorCpp(`substr fuera de rango: el texto tiene ${s.length} caracteres`);
      }
      return s.slice(ini, fin);
    },
    find: (s, a) => s.indexOf(String(a && typeof a === 'object' && 'valor' in a ? a.valor : a)),
    rfind: (s, a) => s.lastIndexOf(String(a && typeof a === 'object' && 'valor' in a ? a.valor : a)),
    at: (s, a) => (a < 0 || a >= s.length ? '' : s[a]),
    erase: (s, a) => s.slice(0, a)
  };

  const MANIPULADORES = ['endl', 'std', 'end', '\n'];

  // ════════════════════════════════════════
  // ANALIZADOR
  // ════════════════════════════════════════

  function Analizador(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.clasesConocidas = new Set();
  }

  Analizador.prototype = {
    peek(n = 0) { return this.tokens[this.pos + n]; },
    actual() { return this.tokens[this.pos]; },
    linea() { return this.actual().linea; },

    es(valor) {
      const t = this.actual();
      return (t.t === 'Op' || t.t === 'Id') && t.v === valor;
    },

    come() { return this.tokens[this.pos++]; },

    espera(valor) {
      if (!this.es(valor)) {
        throw new ErrorCpp(`se esperaba "${valor}" pero se encontró "${this.actual().v}"`, this.linea());
      }
      return this.come();
    },

    // ── Tipos ──

    /**
     * Lee un tipo si lo hay delante: int, double, string, vector<int>, int*,
     * int&, int[] o el nombre de un struct declarado en el fichero.
     */
    leerTipo() {
      let base = null;

      // std::string, std::vector, std::cout...
      if (this.actual().t === 'Id' && this.actual().v === 'std' && this.peek(1).v === '::') {
        this.come();
        this.come();
        base = this.actual().v;
        this.come();
      } else if (this.actual().t === 'Id'
        && (PRIMITIVOS.includes(this.actual().v) || this.clasesConocidas.has(this.actual().v))) {
        base = this.actual().v;
        this.come();
      } else {
        return null;
      }

      // Los argumentos de vector<...> se saltan enteros
      if (base === 'vector' && this.es('<')) {
        let nivel = 0;
        let t;
        do {
          t = this.come();
          if (t.v === '<') nivel++;
          if (t.v === '>') nivel--;
        } while (nivel > 0 && t.t !== 'EOF');
      }

      let sufijo = '';
      while (true) {
        if (this.es('*')) { this.come(); sufijo = '*'; continue; }
        if (this.es('&')) { this.come(); sufijo = '&'; continue; }
        if (this.es('[') && this.peek(1).v === ']') { this.come(); this.come(); sufijo = '[]'; continue; }
        break;
      }

      return base + sufijo;
    },

    /** ¿Lo que viene es un tipo seguido de un nombre? */
    empiezaDeclaracion() {
      const guardado = this.pos;
      const tipo = this.leerTipo();
      let ok = false;
      if (tipo) ok = this.actual().t === 'Id' || this.es('*') || this.es('&');
      this.pos = guardado;
      return ok;
    },

    // ── Expresiones ──

    expresion() { return this.ternario(); },

    ternario() {
      const cond = this.oLogico();
      if (this.es('?')) {
        this.come();
        const entonces = this.ternario();
        this.espera(':');
        const siNo = this.ternario();
        return { t: 'ternario', cond, entonces, siNo };
      }
      return cond;
    },

    oLogico() {
      let izq = this.yLogico();
      while (this.es('||')) { this.come(); izq = { t: 'or', izq, der: this.yLogico() }; }
      return izq;
    },

    yLogico() {
      let izq = this.igualdad();
      while (this.es('&&')) { this.come(); izq = { t: 'and', izq, der: this.igualdad() }; }
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
      // Dentro de un cout el << separa trozos: no puede desplazar nada
      const operando = () => (this.sinDesplazar ? this.adicion() : this.desplazamiento());
      let izq = operando();
      while (this.es('<') || this.es('>') || this.es('<=') || this.es('>=')) {
        const op = this.come().v;
        izq = { t: 'bin', op, izq, der: operando() };
      }
      return izq;
    },

    desplazamiento() {
      let izq = this.adicion();
      while (this.es('<<') || this.es('>>')) {
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
      if (this.es('++')) { this.come(); return { t: 'preinc', exp: this.unario() }; }
      if (this.es('--')) { this.come(); return { t: 'preinc', exp: this.unario(), resta: true }; }
      // El * delante de un puntero es desreferencia, no multiplicación
      if (this.es('*')) { this.come(); return { t: 'desref', exp: this.unario() }; }
      // & delante es la dirección de la variable
      if (this.es('&')) { this.come(); return { t: 'direccion', exp: this.unario() }; }
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
        // 1.0 es un double aunque valga 1: si no, 7 / 2.0 daría 3
        return { t: 'lit', v: t.v, tipo: (t.decimal || !Number.isInteger(t.v)) ? 'double' : 'int' };
      }
      if (t.t === 'Texto') { this.come(); return { t: 'lit', v: t.v, tipo: 'String' }; }
      if (t.t === 'Char') { this.come(); return { t: 'lit', v: t.v, tipo: 'char' }; }

      if (this.es('(')) {
        const sig = this.peek(1);
        const esCast = sig.t === 'Id' && ['int', 'double', 'float', 'char', 'long', 'short'].includes(sig.v);
        if (esCast) {
          this.come();
          const tipoCast = this.come().v;
          this.espera(')');
          return { t: 'cast', tipo: tipoCast, exp: this.unario() };
        }
        this.come();
        const exp = this.expresion();
        this.espera(')');
        return { t: 'paren', exp };
      }

      if (t.t === 'Id') {
        if (t.v === 'true') { this.come(); return { t: 'lit', v: true, tipo: 'bool' }; }
        if (t.v === 'false') { this.come(); return { t: 'lit', v: false, tipo: 'bool' }; }
        if (t.v === 'nullptr' || t.v === 'NULL') { this.come(); return { t: 'lit', v: null, tipo: 'Puntero' }; }

        // new Tipo(...) / new Tipo[n]
        if (t.v === 'new') {
          this.come();
          const tipo = this.leerTipo();
          if (!tipo) throw new ErrorCpp('después de new tiene que ir un tipo', t.linea);
          if (this.es('[')) {
            this.come();
            const tam = this.es(']') ? null : this.expresion();
            this.espera(']');
            return { t: 'newArray', tipo, tam };
          }
          if (this.es('{')) {
            this.come();
            const items = [];
            if (!this.es('}')) {
              do { items.push(this.expresion()); } while (this.es(',') && (this.come(), true));
            }
            this.espera('}');
            return { t: 'newInicializado', tipo, items };
          }
          const args = this.es('(') ? this.argumentos() : [];
          return { t: 'new', tipo, args };
        }

        // delete p / delete[] p
        if (t.v === 'delete') {
          this.come();
          const esVector = this.es('[');
          if (esVector) { this.come(); this.espera(']'); }
          return { t: 'delete', exp: this.unario(), esVector };
        }

        this.come();

        if (t.v === 'this') return this.cadenaMiembros({ t: 'esto' });

        if (this.es('(')) return this.cadenaMiembros({ t: 'llamada', nombre: t.v, args: this.argumentos() });

        return this.cadenaMiembros({ t: 'nombre', v: t.v });
      }

      throw new ErrorCpp(`no se esperaba "${t.v === null ? 'fin de código' : t.v}"`, t.linea);
    },

    /** Lee .miembro, ->miembro, [i] y llamadas encadenadas. */
    cadenaMiembros(base) {
      let expr = base;
      while (true) {
        if (this.es('.')) {
          this.come();
          const prop = this.actual();
          if (prop.t !== 'Id') break;
          this.come();
          if (this.es('(')) {
            expr = { t: 'llamadaMiembro', obj: expr, nombre: prop.v, args: this.argumentos(), linea: prop.linea };
          } else {
            expr = { t: 'miembro', obj: expr, nombre: prop.v, linea: prop.linea };
          }
          continue;
        }
        if (this.es('->')) {
          this.come();
          const prop = this.actual();
          if (prop.t !== 'Id') break;
          this.come();
          if (this.es('(')) {
            expr = { t: 'llamadaFlecha', obj: expr, nombre: prop.v, args: this.argumentos(), linea: prop.linea };
          } else {
            expr = { t: 'miembroFlecha', obj: expr, nombre: prop.v, linea: prop.linea };
          }
          continue;
        }
        if (this.es('[')) {
          this.come();
          const idx = this.expresion();
          this.espera(']');
          expr = { t: 'indice', obj: expr, idx };
          continue;
        }
        if (this.es('(') && expr.t === 'nombre') {
          const args = this.argumentos();
          expr = { t: 'llamada', nombre: expr.v, args };
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
          throw new ErrorCpp('falta cerrar una llave {', this.linea());
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

    /** Lee sentencias hasta el final, cuando no hay ninguna función. */
    sentenciasSueltas() {
      const lista = [];
      while (this.actual().t !== 'EOF') {
        if (this.es('}')) { this.come(); continue; }
        lista.push(this.sentencia());
      }
      return lista;
    },

    sentencia() {
      const t = this.actual();
      const linea = t.linea;

      if (this.es(';')) { this.come(); return { t: 'vacia' }; }
      if (this.es('{')) return this.bloque();

      // using namespace std;  → se acepta y se ignora
      if (t.t === 'Id' && t.v === 'using') {
        while (this.actual().t !== 'EOF' && !this.es(';')) this.come();
        this.espera(';');
        return { t: 'vacia' };
      }

      // include <iostream> / #include <...>
      if (this.es('#') || t.v === 'include') {
        while (this.actual().t !== 'EOF' && !this.es(';')) this.come();
        if (this.es(';')) this.come();
        return { t: 'vacia' };
      }

      if (t.t === 'Id' && (t.v === 'cout' || (t.v === 'std' && this.peek(1).v === '::' && this.peek(2).v === 'cout'))) {
        return this.sentenciaCout();
      }

      // cin >> x;  se acepta y se ignora: no hay entrada en el navegador
      if (t.t === 'Id' && (t.v === 'cin' || (t.v === 'std' && this.peek(1).v === '::' && this.peek(2).v === 'cin'))) {
        while (this.actual().t !== 'EOF' && !this.es(';')) this.come();
        this.espera(';');
        return { t: 'vacia' };
      }

      if (this.esPalabra('if')) {
        this.come();
        this.espera('(');
        const cond = this.expresion();
        this.espera(')');
        const entonces = this.sentencia();
        let siNo = null;
        if (this.esPalabra('else')) { this.come(); siNo = this.sentencia(); }
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
        if (!this.esPalabra('while')) throw new ErrorCpp('do necesita while', linea);
        this.come();
        this.espera('(');
        const cond = this.expresion();
        this.espera(')');
        this.espera(';');
        return { t: 'doWhile', cond, cuerpo, linea };
      }

      if (this.esPalabra('for')) {
        this.come();
        this.espera('(');

        // El range-for se detecta antes que una declaración
        const guardado = this.pos;
        const tipo = this.leerTipo();
        if (tipo && this.actual().t === 'Id' && this.peek(1).v === ':') {
          const nombre = this.come().v;
          this.come();   // ':'
          const coleccion = this.expresion();
          this.espera(')');
          return { t: 'rangeFor', tipo, nombre, coleccion, cuerpo: this.cuerpoDeBucle(), linea };
        }
        this.pos = guardado;

        let init = null;
        let cond = null;
        let paso = null;

        if (!this.es(';')) {
          if (this.empiezaDeclaracion()) {
            init = this.declaracion(true);
            this.espera(';');
          } else {
            init = { t: 'expr', exp: this.expresion() };
            this.espera(';');
          }
        } else {
          this.come();
        }

        if (!this.es(';')) cond = this.expresion();
        this.espera(';');
        if (!this.es(')')) paso = this.expresion();
        this.espera(')');

        return { t: 'for', init, cond, paso, cuerpo: this.cuerpoDeBucle(), linea };
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
            this.espera(':');
            const cuerpo = this.cuerpoDeCaso();
            casos.push({ valor: val, cuerpo });
          } else if (this.esPalabra('default')) {
            this.come();
            this.espera(':');
            casos.push({ valor: null, cuerpo: this.cuerpoDeCaso() });
          } else {
            throw new ErrorCpp('dentro de switch solo caben case y default', this.linea());
          }
        }
        this.espera('}');
        return { t: 'switch', disc, casos, linea };
      }

      if (this.esPalabra('return')) {
        this.come();
        if (this.es(';')) { this.come(); return { t: 'return', exp: null, linea }; }
        const exp = this.expresion();
        this.espera(';');
        return { t: 'return', exp, linea };
      }

      if (this.esPalabra('break')) { this.come(); this.espera(';'); return { t: 'break', linea }; }
      if (this.esPalabra('continue')) { this.come(); this.espera(';'); return { t: 'continue', linea }; }

      // Declaración: int x = 5, double d, string s, Punto p, int a, b;
      if (this.empiezaDeclaracion()) {
        const decl = this.declaracion(false);
        this.espera(';');
        return decl;
      }

      const exp = this.expresion();

      // Asignación: x = 5, x += 2, *p = 7, p[i] = 3
      if (this.es('=')) {
        this.come();
        const der = this.expresion();
        this.espera(';');
        return { t: 'asigna', izq: exp, der, linea };
      }
      if (this.actual().t === 'Op' && ['+=', '-=', '*=', '/=', '%='].includes(this.actual().v)) {
        const op = this.come().v;
        const der = this.expresion();
        this.espera(';');
        return { t: 'asigCompuesta', op, izq: exp, der, linea };
      }

      this.espera(';');
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

    esPalabra(p) {
      const t = this.actual();
      return t.t === 'Id' && t.v === p;
    },

    /**
     * Lee una declaración. La primera variable puede llevar el tamaño del
     * array; el resto son separadores por comas.
     */
    declaracion(enFor) {
      const tipo = this.leerTipo();
      if (!tipo) throw new ErrorCpp('falta el tipo de la declaración', this.linea());

      const nombres = [];
      do {
        if (this.es('*')) this.come();
        else if (this.es('&')) this.come();

        const id = this.actual();
        if (id.t !== 'Id') throw new ErrorCpp('falta el nombre de la variable', id.linea);
        this.come();

        // int arr[5]
        let tamArray = null;
        if (this.es('[')) {
          this.come();
          tamArray = this.es(']') ? null : this.expresion();
          this.espera(']');
        }

        // Inicialización directa: Punto p(3, 4);  →  llama al constructor
        let ctorArgs = null;
        if (this.es('(')) ctorArgs = this.argumentos();

        // int arr[] = {1, 2, 3}
        let items = null;
        let ini = null;
        if (this.es('=')) {
          this.come();
          if (this.es('{')) {
            this.come();
            items = [];
            if (!this.es('}')) {
              do { items.push(this.expresion()); } while (this.es(',') && (this.come(), true));
            }
            this.espera('}');
          } else {
            ini = this.expresion();
          }
        }

        nombres.push({ nombre: id.v, tamArray, items, ini, ctorArgs, linea: id.linea });
      } while (this.es(',') && (this.come(), true));

      return { t: 'decl', tipo, nombres, enFor: !!enFor, linea: this.linea() };
    },

    /**
     * cout << a << " " << b << endl;
     * Los manipuladores (endl) no son expresiones: se separan aquí.
     */
    sentenciaCout() {
      const linea = this.linea();
      if (this.esPalabra('std')) { this.come(); this.espera('::'); }
      this.come();   // cout

      const partes = [];
      while (this.es('<<')) {
        this.come();

        // Manipuladores como endl o std::endl
        if (this.actual().t === 'Id' && this.actual().v === 'std' && this.peek(1).v === '::') {
          this.come(); this.come();
          partes.push({ manipulador: this.come().v });
          continue;
        }
        if (this.actual().t === 'Id' && MANIPULADORES.includes(this.actual().v)) {
          partes.push({ manipulador: this.come().v });
          continue;
        }

        this.sinDesplazar = true;
        try {
          partes.push({ exp: this.expresion() });
        } finally {
          this.sinDesplazar = false;
        }
      }

      this.espera(';');
      return { t: 'cout', partes, linea };
    }
  };

  // ════════════════════════════════════════
  // CONSTRUCCIÓN DEL ÁRBOL
  // ════════════════════════════════════════

  function construirArbol(src) {
    const tokens = tokenizar(src);

    // Prescan de nombres: el analizador necesita saber qué tipos existen
    const clasesConocidas = new Set();
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].t === 'Id' && (tokens[i].v === 'struct' || tokens[i].v === 'class')
        && tokens[i + 1].t === 'Id') {
        clasesConocidas.add(tokens[i + 1].v);
      }
    }

    const a = new Analizador(tokens);
    a.clasesConocidas = clasesConocidas;

    const structs = [];
    const funciones = [];

    while (a.actual().t !== 'EOF') {
      // ---- struct / class ----
      if (a.esPalabra('struct') || a.esPalabra('class')) {
        a.come();
        const nombre = a.actual().v;
        a.come();
        while (!a.es('{') && a.actual().t !== 'EOF' && !a.es(';')) a.come();
        if (a.es(';')) { a.come(); continue; }   // struct adelantada
        a.espera('{');

        const campos = [];
        const metodos = [];
        let constructor = null;

        while (!a.es('}') && a.actual().t !== 'EOF') {
          let esEstatico = false;
          while (a.actual().t === 'Id'
            && ['public', 'private', 'protected', 'static', 'const', 'virtual', 'explicit'].includes(a.actual().v)) {
            if (a.actual().v === 'static') esEstatico = true;
            a.come();
          }

          // Constructor: el nombre del struct seguido de (
          if (a.actual().t === 'Id' && a.actual().v === nombre && a.peek(1).v === '(') {
            a.come();
            const params = leerParams(a);
            constructor = { params, cuerpo: a.bloque() };
            continue;
          }

          // Destructor ~Nombre()  → se ignora
          if (a.es('~')) { a.come(); a.come(); leerParams(a); a.bloque(); continue; }

          const tipo = a.leerTipo();
          if (!tipo) { a.come(); continue; }

          const nombreTok = a.actual();
          if (nombreTok.t !== 'Id') { a.come(); continue; }
          a.come();

          if (a.es('(')) {
            const params = leerParams(a);
            metodos.push({ nombre: nombreTok.v, tipo, estatico: esEstatico, params, cuerpo: a.bloque() });
          } else {
            let tam = null;
            if (a.es('[')) { a.come(); tam = a.es(']') ? null : a.expresion(); a.espera(']'); }
            let valor = null;
            if (a.es('=')) { a.come(); valor = a.es('{') ? null : a.expresion(); }
            campos.push({ tipo, nombre: nombreTok.v, tam, valor, esEstatico });
            while (a.es(',')) { a.come(); a.come(); }
            a.espera(';');
          }
        }
        a.espera('}');
        // El ; detrás de la llave solo hace falta si después se declaran
        // variables del tipo ("struct P {};" o "struct P {} p1, p2;")
        if (a.es(';')) a.come();
        structs.push({ nombre, campos, metodos, constructor });
        continue;
      }

      // ---- Función libre ----
      const guardado = a.pos;
      let tipo = a.leerTipo();
      if (!tipo) { a.come(); continue; }

      const nombreTok = a.actual();
      if (nombreTok.t !== 'Id') { a.pos = guardado; a.come(); continue; }
      a.come();

      if (a.es('(')) {
        const params = leerParams(a);
        funciones.push({ nombre: nombreTok.v, tipo, params, cuerpo: a.bloque() });
      } else {
        // Una variable global suelta: se ignora
        while (a.actual().t !== 'EOF' && !a.es(';')) a.come();
        if (a.es(';')) a.come();
      }
    }

    // Sin ninguna función, el código entero se toma como el cuerpo de main.
    // Así el alumno puede escribir solo los cout y verlos, sin el armazón.
    if (!funciones.length) {
      const b = new Analizador(tokens);
      b.clasesConocidas = clasesConocidas;
      funciones.push({
        nombre: 'main',
        tipo: 'int',
        params: [],
        cuerpo: { t: 'bloque', sent: b.sentenciasSueltas() }
      });
    }

    return { structs, funciones, clasesConocidas };
  }

  function leerParams(a) {
    const params = [];
    a.espera('(');
    if (!a.es(')')) {
      do {
        if (a.es('const')) a.come();
        const tipo = a.leerTipo();
        if (!tipo) { a.come(); continue; }
        // leerTipo ya se ha comido el &, así que la referencia se deduce del
        // propio tipo: int& r es por referencia, int r es por valor
        const nombreTok = a.actual();
        const nombre = nombreTok.t === 'Id' ? nombreTok.v : '_' + params.length;
        if (nombreTok.t === 'Id') a.come();
        params.push({ tipo, nombre, referencia: tipo.endsWith('&') });
      } while (a.es(',') && (a.come(), true));
    }
    a.espera(')');
    return params;
  }

  // ════════════════════════════════════════
  // EJECUCIÓN
  // ════════════════════════════════════════

  class Ejecutor {
    constructor(arbol, opciones) {
      this.arbol = arbol;
      this.memoria = new Memoria();
      this.salida = '';
      this.paso = this.memoria.paso;
      this.ambitos = [];              // Pila de Mapas nombre -> caja
      this.baseAmbito = 0;
      this.metodoActual = null;
      this.objetoActual = null;
      this.limitePasos = (opciones && opciones.limitePasos) || 2_000_000;
      this.pasos = 0;
    }

    error(msg, linea) { throw new ErrorCpp(msg, linea); }

    // ── Ámbitos ──

    entra() { this.ambitos.push(new Map()); }
    sale() { this.ambitos.pop(); }

    /** Guarda una variable nueva en el ámbito actual y devuelve su dirección. */
    declarar(nombre, valor, tipo) {
      const dir = this.memoria.nueva(valor, tipo);
      this.ambitos[this.ambitos.length - 1].set(nombre, { dir });
      return dir;
    }

    cajaDe(nombre, linea) {
      for (let i = this.ambitos.length - 1; i >= this.baseAmbito; i--) {
        const m = this.ambitos[i];
        if (m && m.has(nombre)) return m.get(nombre);
      }
      return null;
    }

    /**
     * Lee una variable.
     *
     * Una referencia es un ALIAS, así que se lee como la variable a la que
     * apunta: int& r = x; devuelve lo mismo que x. Un puntero, en cambio,
     * devuelve la dirección, y para ver el valor hay que desreferenciarlo.
     * Esa diferencia es el corazón de C++ y por eso son dos tipos distintos.
     */
    buscar(nombre, linea) {
      const caja = this.cajaDe(nombre, linea);
      if (!caja) return undefined;
      const v = this.memoria.leer(caja.dir, linea, `"${nombre}"`);
      if (esReferencia(v)) {
        return this.memoria.leer(v.valor.direccion, linea, `"${nombre}"`);
      }
      return v;
    }

    escribirEn(nombre, valor, linea) {
      const caja = this.cajaDe(nombre, linea);
      if (!caja) this.error(`la variable "${nombre}" no existe`, linea);
      const actual = this.memoria.leer(caja.dir, linea, `"${nombre}"`);
      // Escribir en una referencia escribe en su variable original
      if (esReferencia(actual)) {
        this.memoria.escribir(actual.valor.direccion, valor, linea);
        return;
      }
      // Un puntero solo puede guardar direcciones
      if (esPuntero(actual) && !esPuntero(valor)) {
        this.error(
          `"${nombre}" es un puntero, así que solo puede guardar direcciones. `
          + `Le has dado ${valor && valor.tipo ? valor.tipo : 'otro tipo'}.`,
          linea
        );
      }
      // Y al revés: en un int no cabe una dirección
      if (esPuntero(valor) && !esPuntero(actual) && !esReferencia(actual)) {
        this.error(
          `no se puede guardar un puntero en "${nombre}", que es de tipo `
          + `${actual && actual.tipo ? actual.tipo : 'otro'}. Si lo que quieres es guardar una `
          + 'dirección, declara el tipo con un asterisco: ' + `int* ${nombre};`,
          linea
        );
      }
      this.memoria.escribir(caja.dir, valor, linea);
    }

    /**
     * Convierte un valor al tipo que declara quien lo recibe. C++ lo hace solo
     * y sin avisar; aquí también, porque es parte de lo que hay que aprender.
     *
     * Lo importante: un array al guardarlo en un puntero "cae" y se convierte
     * en la dirección de su primer elemento. Por eso int* p = nums; funciona
     * y p[0] es lo mismo que nums[0].
     */
    ajustar(v, tipo) {
      if (!tipo || !v) return v;

      // La caída de array a puntero
      if ((tipo.endsWith('*') || tipo.endsWith('&')) && v.tipo === 'Array') {
        return V({ direccion: v.valor.direccion, largo: v.valor.largo }, 'Puntero');
      }

      // Una referencia no se convierte: es un alias de algo concreto
      if (tipo.endsWith('&')) return v;

      if (tipo.endsWith('*')) {
        if (esReferencia(v)) return V({ direccion: v.valor.direccion }, 'Puntero');
        return v;
      }

      if (tipo === 'double' || tipo === 'float') {
        if (typeof v.valor === 'number') return V(Number(v.valor), 'double');
        return v;
      }
      if (tipo === 'int' || tipo === 'long' || tipo === 'short') {
        if (typeof v.valor === 'number') return V(Math.trunc(v.valor), 'int');
        return v;
      }
      if (tipo === 'bool') return V(v.valor === true, 'bool');
      if (tipo === 'char') return V(String(aTextoCpp(v)).charAt(0), 'char');
      if (tipo === 'string') return V(aTextoCpp(v), 'String');
      return v;
    }

    /** Busca la función libre o el método de un struct con ese nombre. */
    metodoLibre(nombre) {
      return (this.arbol.funciones || []).find(f => f.nombre === nombre) || null;
    }

    // ── Expresiones ──

    ev(e) {
      this.pasos++;
      if (this.pasos > this.limitePasos) {
        throw new ErrorCpp('el programa no termina (¿bucle infinito?). Revisa las condiciones.');
      }

      switch (e.t) {
        case 'lit': return V(e.v, e.tipo);
        case 'paren': return this.ev(e.exp);
        case 'esto': {
          if (!this.objetoActual) {
            this.error('"this" solo tiene sentido dentro de un método', e.linea);
          }
          return this.objetoActual;
        }

        case 'cast': {
          const v = this.ev(e.exp);
          if (e.tipo === 'char') return V(String(aTextoCpp(v)).charAt(0), 'char');
          const n = Number(v.valor);
          return V(e.tipo === 'double' || e.tipo === 'float' ? n : Math.trunc(n), e.tipo);
        }

        case 'no': return V(!this.cierto(this.ev(e.exp)), 'bool');
        case 'menos': {
          const v = this.ev(e.exp);
          const r = -Number(v.valor);
          return V(r, esEntero(v.tipo) ? 'int' : v.tipo);
        }

        case 'ternario':
          return this.cierto(this.ev(e.cond)) ? this.ev(e.entonces) : this.ev(e.siNo);

        case 'and': return V(this.cierto(this.ev(e.izq)) && this.cierto(this.ev(e.der)), 'bool');
        case 'or': return V(this.cierto(this.ev(e.izq)) || this.cierto(this.ev(e.der)), 'bool');

        // ── PUNTEROS ──

        // &x  →  la dirección de x
        case 'direccion': {
          const obj = e.exp;
          if (obj.t === 'nombre') {
            const caja = this.cajaDe(obj.v, e.linea);
            if (!caja) this.error(`la variable "${obj.v}" no existe`, e.linea);
            // &r es lo mismo que &x cuando r es una referencia a x
            const v = this.memoria.leer(caja.dir, e.linea, `"${obj.v}"`);
            if (esReferencia(v)) return V({ direccion: v.valor.direccion }, 'Puntero');
            return V({ direccion: caja.dir }, 'Puntero');
          }
          if (obj.t === 'indice' && obj.obj.t === 'nombre') {
            return V({ direccion: this.direccionDeIndice(obj, e.linea) }, 'Puntero');
          }
          if (obj.t === 'miembro' && obj.obj.t === 'nombre') {
            return V({ direccion: this.direccionDeMiembro(obj, e.linea) }, 'Puntero');
          }
          this.error('solo se puede sacar la dirección (&) de una variable', e.linea);
          return null;
        }

        // *p  →  el valor que hay en la dirección guardada
        case 'desref': {
          const p = this.ev(e.exp);
          if (!esPuntero(p)) this.error('el * solo se usa delante de un puntero', e.linea);
          if (p.valor === null) {
            this.error('se ha desreferenciado un puntero nulo (nullptr). No apunta a nada.', e.linea);
          }
          return this.memoria.leer(p.valor.direccion, e.linea, 'ese puntero');
        }

        case 'new': {
          const clase = (this.arbol.structs || []).find(s => s.nombre === e.tipo);
          if (clase) {
            const objeto = this.crearObjeto(clase, e.linea);
            if (clase.constructor) this.ejecutarConstructor(clase, objeto, e.args, e.linea);
            // new devuelve un puntero al objeto, no el objeto
            const dir = this.memoria.reservar(objeto, e.tipo);
            return V({ direccion: dir }, 'Puntero');
          }
          const inicial = e.args.length === 1 ? this.ev(e.args[0]) : valorPorDefecto(e.tipo);
          const dir = this.memoria.reservar(inicial, e.tipo);
          return V({ direccion: dir }, 'Puntero');
        }

        case 'newArray': {
          const n = e.tam ? Math.trunc(Number(this.ev(e.tam).valor)) : 0;
          if (n < 0) this.error('el tamaño del array no puede ser negativo', e.linea);
          const dir = this.memoria.reservarBloque(n, e.tipo.replace('[]', '').replace('*', ''));
          return V({ direccion: dir, largo: n }, 'Puntero');
        }

        case 'newInicializado': {
          const clase = (this.arbol.structs || []).find(s => s.nombre === e.tipo);
          if (clase) {
            const objeto = this.crearObjeto(clase, e.linea);
            if (clase.constructor) this.ejecutarConstructor(clase, objeto, e.args, e.linea);
            return objeto;
          }
          const dir = this.memoria.reservar(e.items.map(i => this.ev(i)), e.tipo);
          return V({ direccion: dir }, 'Puntero');
        }

        case 'delete': {
          const p = this.ev(e.exp);
          if (!esPuntero(p)) this.error('delete solo se usa con punteros', e.linea);
          if (p.valor === null) {
            this.error('delete sobre nullptr: no hay nada que liberar. En C++ real esto está permitido.', e.linea);
          }
          if (e.esVector) {
            const largo = p.valor.largo || 1;
            this.memoria.liberarBloque(p.valor.direccion, largo, e.linea);
          } else {
            this.memoria.liberar(p.valor.direccion, e.linea);
          }
          return NULO();
        }

        case 'preinc': return this.incrementar(e.exp, e.resta ? -1 : 1, false);
        case 'postinc': return this.incrementar(e.exp, e.op === '++' ? 1 : -1, true);

        case 'indice': return this.indices(e);
        case 'miembro': return this.miembro(e.obj, e.nombre, e.linea, false);
        case 'miembroFlecha': return this.miembro(e.obj, e.nombre, e.linea, true);
        case 'llamada': return this.llamar(e);
        case 'llamadaMiembro': return this.llamarMiembro(e, false);
        case 'llamadaFlecha': return this.llamarMiembro(e, true);
        case 'bin': return this.binario(e);

        case 'nombre': {
          const v = this.buscar(e.v, e.linea);
          if (v === undefined) {
            // std::vector, std::string y similares
            if (e.v === 'vector' || e.v === 'string' || e.v === 'cout') {
              return V({ clase: e.v }, 'Clase');
            }
            const struct = (this.arbol.structs || []).find(s => s.nombre === e.v);
            if (struct) return V({ clase: e.v }, 'Clase');
            this.error(
              `"${e.v}" no existe en este ámbito. Puede que la hayas declarado dentro de unas `
              + 'llaves { } de un if o de un bucle: esas llaves crean un ámbito propio y al cerrarse '
              + 'la variable desaparece.',
              e.linea
            );
          }
          return v;
        }

        default:
          this.error('expresión no soportada: ' + e.t, e.linea);
          return null;
      }
    }

    /**
     * ++ y --. Si el operando es un puntero, lo que avanza es la dirección,
     * que es justo lo que hace p++ en C++.
     */
    incrementar(exp, delta, esPostfijo) {
      const v = this.ev(exp);

      if (esPuntero(v)) {
        if (!v.valor) this.error('se ha incrementado un puntero nulo', exp.linea);
        const movido = V(
          { direccion: v.valor.direccion + delta * this.paso, largo: v.valor.largo },
          'Puntero'
        );
        this.escribirLvalue(exp, movido);
        return esPostfijo ? v : movido;
      }

      const anterior = this.desreferenciarSiPuntero(v);
      const nuevo = V(Number(anterior.valor) + delta, anterior.tipo);
      this.escribirLvalue(exp, nuevo);
      return esPostfijo ? anterior : nuevo;
    }

    /** Lee el valor "directo" de un operando, sin seguir punteros. */
    leerLvalue(exp) {
      if (exp.t === 'nombre') {
        const caja = this.cajaDe(exp.v, exp.linea);
        if (!caja) this.error(`la variable "${exp.v}" no existe`, exp.linea);
        return V({ direccion: caja.dir }, 'Puntero');
      }
      return this.ev(exp);
    }

    desreferenciarSiPuntero(v) {
      if (esPuntero(v) && v.valor) {
        return this.memoria.leer(v.valor.direccion, 0, 'ese puntero');
      }
      return v;
    }

    escribirLvalue(exp, valor) {
      if (exp.t === 'nombre') { this.escribirEn(exp.v, valor, exp.linea); return; }
      if (exp.t === 'indice') {
        this.escribirIndice(exp, valor, exp.linea);
        return;
      }
      if (exp.t === 'miembro' || exp.t === 'miembroFlecha') {
        const obj = this.ev(exp.t === 'miembroFlecha'
          ? { t: 'desref', exp: exp.obj, linea: exp.linea }
          : exp.obj);
        this.escribirMiembro(obj, exp.nombre, valor, exp.linea);
        return;
      }
      if (exp.t === 'desref') {
        const p = this.ev(exp.exp);
        if (!esPuntero(p) || !p.valor) {
          const nombre = exp.exp.t === 'nombre' ? exp.exp.v : 'ese puntero';
          this.error(
            `no se puede escribir en el puntero "${nombre}": no tiene dirección. `
            + 'Un puntero declarado sin inicializar no guarda nada hasta que le asignas una.',
            exp.linea
          );
        }
        this.memoria.escribir(p.valor.direccion, valor, exp.linea);
        return;
      }
      this.error('esa expresión no se puede usar a la izquierda del =', exp.linea);
    }

    // ── Índices: arrays, strings y vectores ──

    /** Devuelve la dirección del elemento i, sea array, string o vector. */
    direccionDeIndice(e, linea) {
      const base = e.obj;
      const i = Math.trunc(Number(this.ev(e.idx).valor));

      const donde = base.t === 'nombre'
        ? (() => {
            const caja = this.cajaDe(base.v, linea);
            if (!caja) this.error(`la variable "${base.v}" no existe`, linea);
            return { cont: this.memoria.leer(caja.dir, linea, `"${base.v}"`), nombre: base.v };
          })()
        : { cont: this.ev(base), nombre: 'este valor' };

      const cont = donde.cont;
      if (cont && cont.tipo === 'Vector') {
        const items = cont.valor;
        if (i < 0 || i >= items.length) {
          this.error(`índice ${i} fuera de rango: el vector tiene ${items.length} elementos`, linea);
        }
        return null;   // los vectores no viven en celdas: los trata indices()
      }

      if (esPuntero(cont)) {
        if (!cont.valor) this.error(`"${donde.nombre}" es nullptr y no se puede indexar`, linea);
        if (cont.valor.largo !== undefined && (i < 0 || i >= cont.valor.largo)) {
          this.error(`índice ${i} fuera de rango: el array tiene ${cont.valor.largo} elementos`, linea);
        }
        return cont.valor.direccion + i * this.paso;
      }

      if (cont && cont.tipo === 'Array') {
        const { direccion, largo } = cont.valor;
        if (i < 0 || i >= largo) {
          this.error(`índice ${i} fuera de rango: "${donde.nombre}" tiene ${largo} elementos`, linea);
        }
        return direccion + i * this.paso;
      }

      this.error(`"${donde.nombre}" no es un array ni un vector, así que no se puede indexar`, linea);
      return 0;
    }

    indices(e) {
      const base = e.obj;
      const i = Math.trunc(Number(this.ev(e.idx).valor));

      // Un texto se indexa como un array de caracteres
      if (base.t === 'nombre') {
        const caja = this.cajaDe(base.v, e.linea);
        if (caja) {
          const cont = this.memoria.leer(caja.dir, e.linea, `"${base.v}"`);
          if (esTextoCpp(cont)) {
            const s = String(cont.valor);
            if (i < 0 || i >= s.length) {
              this.error(`índice ${i} fuera de rango: "${base.v}" tiene ${s.length} caracteres`, e.linea);
            }
            return V(s[i], 'char');
          }
        }
      }

      // Un vector guarda sus elementos en una lista propia, no en celdas
      const cont = base.t === 'nombre' ? this.buscar(base.v, e.linea) : this.ev(base);
      if (cont && cont.tipo === 'Vector') {
        const items = cont.valor;
        if (i < 0 || i >= items.length) {
          this.error(`índice ${i} fuera de rango: el vector tiene ${items.length} elementos`, e.linea);
        }
        return items[i];
      }

      const dir = this.direccionDeIndice(e, e.linea);
      if (dir === null) {
        this.error('no se puede leer de aquí', e.linea);
      }
      const tipoCelda = this.memoria.celda(dir, e.linea).tipo;
      const valor = this.memoria.leer(dir, e.linea, 'ese elemento');
      // Un array de punteros, como argv, sigue siendo un puntero
      if (tipoCelda && tipoCelda.endsWith('*') && esPuntero(valor)) return valor;
      return valor;
    }

    /** Escribe en v[i] = x, sea vector, array o puntero. */
    escribirIndice(e, valor, linea) {
      const i = Math.trunc(Number(this.ev(e.idx).valor));
      const cont = e.obj.t === 'nombre' ? this.buscar(e.obj.v, linea) : this.ev(e.obj);

      if (cont && cont.tipo === 'Vector') {
        const items = cont.valor;
        if (i < 0 || i >= items.length) {
          this.error(`índice ${i} fuera de rango: el vector tiene ${items.length} elementos`, linea);
        }
        items[i] = valor;
        return;
      }

      const pseudo = { t: 'indice', obj: e.obj, idx: e.idx, linea };
      this.memoria.escribir(this.direccionDeIndice(pseudo, linea), valor, linea);
    }

    // ── Structs ──

    crearObjeto(clase, linea) {
      const campos = new Map();
      for (const c of clase.campos) {
        if (c.tam) {
          // Un array dentro del struct ocupa celdas seguidas
          const n = Math.trunc(Number(this.ev(c.tam).valor));
          const dir = this.memoria.reservarBloque(n, c.tipo);
          campos.set(c.nombre, V({ direccion: dir, largo: n }, 'Puntero'));
        } else {
          const v = c.valor ? this.ev(c.valor) : valorPorDefecto(c.tipo);
          campos.set(c.nombre, v);
        }
      }
      return V({ __obj: true, clase, campos }, clase.nombre);
    }

    ejecutarConstructor(clase, objeto, argsNodo, linea) {
      const args = (argsNodo || []).map(a => this.ev(a));
      if (args.length !== clase.constructor.params.length) {
        this.error(
          `el constructor de ${clase.nombre} espera ${clase.constructor.params.length} `
          + `argumento(s) y le has dado ${args.length}`, linea
        );
      }
      const dirsRef = clase.constructor.params.map((p, i) => (
        p.referencia ? this.direccionDeValor(args[i], (argsNodo || [])[i], linea) : null
      ));

      const previo = this.objetoActual;
      const previoBase = this.baseAmbito;
      this.objetoActual = objeto;
      this.baseAmbito = this.ambitos.length;
      this.entra();
      clase.constructor.params.forEach((p, i) => {
        if (p.referencia) {
          this.declarar(p.nombre, V({ direccion: dirsRef[i] }, 'Referencia'), 'Referencia');
        } else {
          this.declarar(p.nombre, this.ajustar(args[i], p.tipo), p.tipo);
        }
      });
      try {
        this.ejecutar(clase.constructor.cuerpo);
      } catch (err) {
        if (!err || !err.__return) throw err;
      } finally {
        this.sale();
        this.baseAmbito = previoBase;
        this.objetoActual = previo;
      }
    }

    /**
     * Dirección a la que puede escribir una referencia.
     * Si es una variable, se usa SU dirección: por eso int& r = x hace que
     * cambiar r cambie x. Si es un valor suelta, se reserva una celda nueva.
     */
    direccionDeValor(v, nodo, linea) {
      if (nodo) {
        if (nodo.t === 'nombre') {
          const caja = this.cajaDe(nodo.v, linea);
          if (caja) return caja.dir;
        }
        if (nodo.t === 'indice') {
          const dir = this.direccionDeIndice(nodo, linea);
          if (dir !== null) return dir;
        }
        if (nodo.t === 'desref') {
          const p = this.ev(nodo.exp);
          if (esPuntero(p) && p.valor) return p.valor.direccion;
        }
      }
      if (v && v.direccion !== undefined) return v.direccion;
      return this.memoria.nueva(v, v && v.tipo);
    }

    receiver(e, linea) {
      if (e.t === 'nombre') {
        const v = this.buscar(e.v, linea);
        if (v === undefined) this.error(`la variable "${e.v}" no existe`, linea);
        return v;
      }
      if (e.t === 'desref' || e.t === 'miembro' || e.t === 'indice'
        || e.t === 'llamada' || e.t === 'nuevo') {
        return this.ev(e);
      }
      return this.ev(e);
    }

    miembro(objExp, nombre, linea, porFlecha) {
      const obj = porFlecha
        ? this.desreferenciar(this.ev(objExp), linea)
        : this.ev(objExp);

      if (esTextoCpp(obj)) {
        this.error(`"${nombre}" no es un miembro de un texto`, linea);
      }
      if (!obj || !obj.valor || obj.valor.__obj !== true) {
        const tipo = obj && obj.tipo ? obj.tipo : 'este valor';
        this.error(`"${nombre}" no es un miembro de ${tipo}`, linea);
      }

      const campos = obj.valor.campos;
      if (!campos.has(nombre)) {
        const nombres = [...campos.keys()];
        this.error(
          `${obj.valor.clase.nombre} no tiene el miembro "${nombre}". `
          + (nombres.length ? `Sus miembros son: ${nombres.join(', ')}.` : 'No tiene miembros declarados.'),
          linea
        );
      }
      return campos.get(nombre);
    }

    escribirMiembro(obj, nombre, valor, linea) {
      if (!obj || !obj.valor || obj.valor.__obj !== true) {
        this.error(`no se puede asignar a "${nombre}" de este valor`, linea);
      }
      const campos = obj.valor.campos;
      if (!campos.has(nombre)) {
        this.error(`${obj.valor.clase.nombre} no tiene el miembro "${nombre}"`, linea);
      }
      campos.set(nombre, valor);
    }

    desreferenciar(v, linea) {
      if (esReferencia(v)) {
        return this.memoria.leer(v.valor.direccion, linea, 'esa referencia');
      }
      if (!esPuntero(v)) {
        this.error('el operador -> necesita un puntero delante', linea);
      }
      if (!v.valor) this.error('este puntero es nullptr: no apunta a ningún objeto', linea);
      return this.memoria.leer(v.valor.direccion, linea, 'ese puntero');
    }

    // ── Llamadas ──

    llamar(e) {
      const nombre = e.nombre;

      const libre = this.metodoLibre(nombre);
      if (libre) return this.invocar(libre, e.args, e.linea);

      this.error(`la función "${nombre}" no existe`, e.linea);
      return null;
    }

    llamarMiembro(e, porFlecha) {
      const obj = porFlecha
        ? this.desreferenciar(this.ev(e.obj), e.linea)
        : this.ev(e.obj);

      // Métodos de string y de vector
      if (esTextoCpp(obj)) return this.metodoDeTexto(obj, e);
      if (obj && obj.tipo === 'Vector') return this.metodoDeVector(obj, e);
      if (obj && obj.valor && obj.valor.__obj === true) {
        const metodo = obj.valor.clase.metodos.find(m => m.nombre === e.nombre);
        if (metodo) return this.invocarMetodo(metodo, obj, e.args, e.linea);
        const nombres = obj.valor.clase.metodos.map(m => m.nombre);
        this.error(
          `${obj.valor.clase.nombre} no tiene el método "${e.nombre}". `
          + (nombres.length ? `Sus métodos son: ${nombres.join(', ')}.` : 'No tiene métodos declarados.'),
          e.linea
        );
      }

      // str.length() sin usar punto, o Integer.parseInt
      if (e.obj.t === 'nombre') {
        const metodoClase = { Math: 'Math', string: 'string', vector: 'vector' }[e.nombre];
        if (metodoClase) return this.metodoDeClase(e);
      }

      this.error(`el método "${e.nombre}" no existe aquí`, e.linea);
      return null;
    }

    metodoDeClase(e) {
      this.error(`el método "${e.nombre}" no está disponible en este intérprete`, e.linea);
      return null;
    }

    metodoDeTexto(texto, e) {
      const metodo = METODOS_STRING[e.nombre];
      if (metodo) {
        const args = e.args.map(a => this.ev(a).valor);
        const r = metodo(String(texto.valor), ...args);
        if (['length', 'size'].includes(e.nombre)) return V(r, 'int');
        if (['find', 'rfind'].includes(e.nombre)) return V(r, 'int');
        if (['empty'].includes(e.nombre)) return V(r, 'bool');
        return V(r, 'String');
      }
      if (e.nombre === 'push_back') {
        const extra = aTextoCpp(this.ev(e.args[0]));
        return V(String(texto.valor) + extra, 'String');
      }
      if (e.nombre === 'at') {
        const i = Math.trunc(Number(this.ev(e.args[0]).valor));
        const s = String(texto.valor);
        return V(i < 0 || i >= s.length ? '' : s[i], 'char');
      }
      this.error(`un texto no tiene el método "${e.nombre}"`, e.linea);
      return null;
    }

    metodoDeVector(vec, e) {
      const items = vec.valor;

      if (e.nombre === 'push_back' || e.nombre === 'emplace_back') {
        items.push(this.ev(e.args[0]));
        return NULO();
      }
      if (e.nombre === 'size' || e.nombre === 'length') return V(items.length, 'int');
      if (e.nombre === 'empty') return V(items.length === 0, 'bool');
      if (e.nombre === 'clear') { items.length = 0; return NULO(); }
      if (e.nombre === 'at') {
        const i = Math.trunc(Number(this.ev(e.args[0]).valor));
        if (i < 0 || i >= items.length) {
          this.error(`índice ${i} fuera de rango: el vector tiene ${items.length} elementos`, e.linea);
        }
        return items[i];
      }
      if (e.nombre === 'front') return items[0];
      if (e.nombre === 'back') return items[items.length - 1];
      if (e.nombre === 'pop_back') { items.pop(); return NULO(); }

      const nombres = ['push_back', 'size', 'empty', 'clear', 'at', 'front', 'back', 'pop_back'];
      this.error(
        `el vector no tiene el método "${e.nombre}". Sus métodos son: ${nombres.join(', ')}.`,
        e.linea
      );
      return null;
    }

    invocar(fn, argsNodo, linea) {
      const args = argsNodo.map(a => this.ev(a));
      if (args.length !== fn.params.length) {
        this.error(
          `"${fn.nombre}" espera ${fn.params.length} argumento(s) y le has dado ${args.length}`,
          linea || 0
        );
      }

      // Las direcciones se resuelven ANTES de cambiar de ámbito. Si se hiciera
      // después, un int& no vería la variable de quien llama, que es justo lo
      // que un argumento por referencia tiene que hacer.
      const dirsRef = fn.params.map((p, i) => (
        p.referencia ? this.direccionDeValor(args[i], argsNodo[i], linea) : null
      ));

      const previoMetodo = this.metodoActual;
      const previoObjeto = this.objetoActual;
      const previoBase = this.baseAmbito;
      this.metodoActual = fn;
      this.objetoActual = null;
      this.baseAmbito = this.ambitos.length;
      this.entra();
      fn.params.forEach((p, i) => {
        if (p.referencia) {
          this.declarar(p.nombre, V({ direccion: dirsRef[i] }, 'Referencia'), 'Referencia');
        } else {
          this.declarar(p.nombre, this.ajustar(args[i], p.tipo), p.tipo);
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
        this.metodoActual = previoMetodo;
        this.objetoActual = previoObjeto;
      }

      return this.convertirRetorno(fn.tipo, retorno);
    }

    invocarMetodo(metodo, objeto, argsNodo, linea) {
      const args = argsNodo.map(a => this.ev(a));
      if (args.length !== metodo.params.length) {
        this.error(
          `"${metodo.nombre}" espera ${metodo.params.length} argumento(s) y le has dado ${args.length}`,
          linea || 0
        );
      }

      const dirsRef = metodo.params.map((p, i) => (
        p.referencia ? this.direccionDeValor(args[i], argsNodo[i], linea) : null
      ));

      const previoMetodo = this.metodoActual;
      const previoObjeto = this.objetoActual;
      const previoBase = this.baseAmbito;
      this.metodoActual = metodo;
      this.objetoActual = objeto;
      this.baseAmbito = this.ambitos.length;
      this.entra();
      metodo.params.forEach((p, i) => {
        if (p.referencia) {
          this.declarar(p.nombre, V({ direccion: dirsRef[i] }, 'Referencia'), 'Referencia');
        } else {
          this.declarar(p.nombre, this.ajustar(args[i], p.tipo), p.tipo);
        }
      });

      let retorno = null;
      try {
        this.ejecutar(metodo.cuerpo);
      } catch (err) {
        if (err && err.__return) retorno = err.valor;
        else throw err;
      } finally {
        this.sale();
        this.baseAmbito = previoBase;
        this.metodoActual = previoMetodo;
        this.objetoActual = previoObjeto;
      }

      return this.convertirRetorno(metodo.tipo, retorno);
    }

    convertirRetorno(tipo, retorno) {
      if (retorno === null || retorno === undefined) {
        if (tipo === 'void') return V(null, 'void');
        return valorPorDefecto(tipo);
      }
      if (tipo === 'int' || tipo === 'long' || tipo === 'short') return V(Math.trunc(Number(retorno.valor)), 'int');
      if (tipo === 'double' || tipo === 'float') return V(Number(retorno.valor), 'double');
      if (tipo === 'bool') return V(retorno.valor === true, 'bool');
      if (tipo === 'char') return V(String(aTextoCpp(retorno)).charAt(0), 'char');
      if (tipo === 'string') return V(aTextoCpp(retorno), 'String');
      return retorno;
    }

    // ── Operadores ──

    binario(e) {
      const op = e.op;

      const izq = this.ev(e.izq);
      const der = this.ev(e.der);

      // p + 2 y p - 2 mueven el puntero, no el valor al que apunta
      if (esPuntero(izq) && (op === '+' || op === '-')) {
        if (!izq.valor) this.error('se ha hecho aritmética con un puntero nulo', e.linea);
        const salto = Math.trunc(Number(der.valor)) * this.paso * (op === '+' ? 1 : -1);
        return V({ direccion: izq.valor.direccion + salto, largo: izq.valor.largo }, 'Puntero');
      }
      if (esPuntero(izq) && (op === '<' || op === '>' || op ==='==')) {
        if (!izq.valor) {
          // Comparar con nullptr es lo único válido sobre un puntero nulo
          if (op === '==') return V(der.valor === null, 'bool');
          if (op === '>') return V(false, 'bool');
          if (op === '<') return V(false, 'bool');
        }
      }

      // char con int: el carácter es su código ASCII
      const a = izq.tipo === 'char' && esEntero(der.tipo) ? izq.valor.charCodeAt(0) : izq.valor;
      const b = der.tipo === 'char' && esEntero(izq.tipo) ? der.valor.charCodeAt(0) : der.valor;

      // + con texto concatena, como en Java
      if (op === '+' && (esTextoCpp(izq) || esTextoCpp(der))) {
        return V(aTextoCpp(izq) + aTextoCpp(der), 'String');
      }

      switch (op) {
        case '+': return this.aritmetica(a + b, izq, der);
        case '-': return this.aritmetica(a - b, izq, der);
        case '*': return this.aritmetica(a * b, izq, der);
        case '/':
          if (b === 0) this.error('división por cero');
          // Entre enteros la división es entera, como en C++
          return this.aritmetica(
            esEntero(izq.tipo) && esEntero(der.tipo) ? Math.trunc(a / b) : a / b, izq, der
          );
        case '%':
          if (b === 0) this.error('módulo por cero');
          return V(Math.trunc(a % b), 'int');
        case '<<': return V(a << b, 'int');
        case '>>': return V(a >> b, 'int');
        case '==': return V(this.comparar(izq, der) === 0, 'bool');
        case '!=': return V(this.comparar(izq, der) !== 0, 'bool');
        case '<': return V(this.comparar(izq, der) < 0, 'bool');
        case '<=': return V(this.comparar(izq, der) <= 0, 'bool');
        case '>': return V(this.comparar(izq, der) > 0, 'bool');
        case '>=': return V(this.comparar(izq, der) >= 0, 'bool');
        default:
          this.error('operador no soportado: ' + op);
          return null;
      }
    }

    aritmetica(r, izq, der) {
      if (esEntero(izq.tipo) && esEntero(der.tipo)) return V(r, 'int');
      return V(r, 'double');
    }

    comparar(a, b) {
      if (esTextoCpp(a) || esTextoCpp(b)) {
        const x = aTextoCpp(a);
        const y = aTextoCpp(b);
        return x === y ? 0 : (x < y ? -1 : 1);
      }
      const x = Number(a.valor);
      const y = Number(b.valor);
      return x === y ? 0 : (x < y ? -1 : 1);
    }

    cierto(v) {
      if (typeof v === 'object' && v && 'valor' in v) return v.valor === true || v.valor === 1;
      return !!v;
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

        case 'cout': {
          for (const p of s.partes) {
            if (p.manipulador !== undefined) {
              // endl y std::endl saltan de línea
              if (p.manipulador === 'endl' || p.manipulador === 'end') this.salida += '\n';
              continue;
            }
            this.salida += aTextoCpp(this.ev(p.exp));
          }
          return null;
        }

        case 'decl': return this.ejecutarDecl(s);

        case 'asigna': {
          this.escribirLvalue(s.izq, this.ev(s.der));
          return null;
        }

        case 'asigCompuesta': {
          // Se comprueba que el destino existe antes de escribir; el valor
          // anterior no hace falta porque `binario` vuelve a leerlo.
          this.desreferenciarSiPuntero(this.leerLvalue(s.izq));
          const nuevo = this.binario({ t: 'bin', op: s.op[0], izq: s.izq, der: s.der });
          this.escribirLvalue(s.izq, nuevo);
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
              throw new ErrorCpp('el bucle while no termina (revisa la condición)', s.linea);
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
            if (++vueltas > 100000) {
              throw new ErrorCpp('el bucle do-while no termina', s.linea);
            }
          } while (this.cierto(this.ev(s.cond)));
          return null;
        }

        case 'for': {
          this.entra();
          if (s.init) {
            if (s.init.t === 'decl') this.ejecutarDecl(s.init);
            else this.ev(s.init.exp);
          }
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
              throw new ErrorCpp('el bucle for no termina (revisa la condición)', s.linea);
            }
          }
          this.sale();
          return null;
        }

        case 'rangeFor': {
          const col = this.ev(s.coleccion);
          let items;
          if (col && col.tipo === 'Vector') {
            items = col.valor;
          } else if ((esPuntero(col) || col.tipo === 'Array') && col.valor && col.valor.largo !== undefined) {
            items = this.leerBloque(col);
          } else {
            this.error('el range-for solo funciona con un array o un vector', s.linea);
          }
          this.entra();
          for (const item of items) {
            this.declarar(s.nombre, item, s.tipo);
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
              else if (this.comparar(d, this.ev(c.valor)) === 0) ejecutado = true;
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
          const v = s.exp ? this.ev(s.exp) : V(null, 'void');
          const err = new ErrorCpp('return');
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

    ejecutarDecl(s) {
      for (const d of s.nombres) {
        const base = s.tipo.replace('[]', '').replace('*', '');

        // Referencia: int& r = x;  →  r es un alias de x
        if (s.tipo.endsWith('&')) {
          const origen = d.ini ? this.ev(d.ini) : valorPorDefecto(base);
          this.declarar(
            d.nombre,
            V({ direccion: this.direccionDeValor(origen, d.ini, d.linea) }, 'Referencia'),
            'Referencia'
          );
          continue;
        }

        // Puntero
        if (s.tipo.endsWith('*')) {
          const dir = this.memoria.nueva(NULO(), 'Puntero');
          this.ambitos[this.ambitos.length - 1].set(d.nombre, { dir });
          if (d.ini) {
            this.memoria.escribir(dir, this.ajustar(this.ev(d.ini), s.tipo), d.linea);
          }
          continue;
        }

        // Array
        if (s.tipo.endsWith('[]') || d.tamArray) {
          const items = d.items ? d.items.map(i => this.ev(i)) : null;
          const n = d.tamArray ? Math.trunc(Number(this.ev(d.tamArray).valor)) : (items ? items.length : 0);
          if (n < 0) this.error('el tamaño del array no puede ser negativo', d.linea);
          const dir = this.memoria.reservarBloque(n, base);
          if (items) items.forEach((v, k) => this.memoria.escribir(dir + k * this.paso, v, d.linea));
          const dirCelda = this.memoria.nueva(V({ direccion: dir, largo: n }, 'Array'), 'Array');
          this.ambitos[this.ambitos.length - 1].set(d.nombre, { dir: dirCelda });
          continue;
        }

        // vector<T> v;
        if (base === 'vector') {
          const dir = this.memoria.nueva(V([], 'Vector'), 'Vector');
          this.ambitos[this.ambitos.length - 1].set(d.nombre, { dir });
          if (d.ini) {
            const v = this.ev(d.ini);
            this.memoria.escribir(dir, v, d.linea);
          }
          continue;
        }

        // Struct
        const struct = (this.arbol.structs || []).find(x => x.nombre === base);
        if (struct) {
          const objeto = this.crearObjeto(struct, d.linea);

          if (d.ini && d.ini.t === 'new') {
            // Punto p = new Punto(args);  →  copia lo que trae el puntero
            const p = this.ev(d.ini);
            const fuente = p.valor ? this.desreferenciar(p, d.linea) : objeto;
            for (const k of fuente.valor.campos.keys()) {
              objeto.valor.campos.set(k, fuente.valor.campos.get(k));
            }
            if (struct.constructor) this.ejecutarConstructor(struct, objeto, d.ini.args, d.linea);
          } else if (d.ctorArgs) {
            // Punto p(3, 4);  →  inicialización directa: llama al constructor
            if (!struct.constructor) {
              this.error(`${struct.nombre} no tiene constructor, así que no se puede llamar`, d.linea);
            }
            this.ejecutarConstructor(struct, objeto, d.ctorArgs, d.linea);
          }

          this.declarar(d.nombre, objeto, base);
          continue;
        }

        // Variable normal
        let v = d.ini ? this.ev(d.ini) : valorPorDefecto(base);
        // Ajustes de tipo como hace C++
        if (base === 'double' || base === 'float') {
          if (typeof v.valor === 'number') v = V(Number(v.valor), 'double');
        } else if (base === 'int' || base === 'long' || base === 'short') {
          if (typeof v.valor === 'number') v = V(Math.trunc(v.valor), 'int');
        } else if (base === 'bool') {
          v = V(v.valor === true, 'bool');
        } else if (base === 'char') {
          v = V(String(aTextoCpp(v)).charAt(0), 'char');
        } else if (base === 'string') {
          v = V(aTextoCpp(v), 'String');
        }
        this.declarar(d.nombre, v, base);
      }
      return null;
    }

    leerBloque(puntero) {
      const n = puntero.valor.largo;
      const out = [];
      for (let k = 0; k < n; k++) {
        out.push(this.memoria.leer(puntero.valor.direccion + k * this.paso, 0, 'ese bloque'));
      }
      return out;
    }
  }

  function esTextoCpp(v) {
    return !!v && typeof v === 'object' && (v.tipo === 'String' || v.tipo === 'string');
  }

  function esEntero(tipo) {
    return ENTEROS.includes(tipo);
  }

  // ════════════════════════════════════════
  // API PÚBLICA
  // ════════════════════════════════════════

  function ejecutar(src, opciones) {
    try {
      const arbol = construirArbol(src);

      const main = (arbol.funciones || []).find(f => f.nombre === 'main');
      if (!main) {
        return {
          output: 'No se ha encontrado la función main. ¿Has escrito "int main() { ... }"?\n',
          error: true
        };
      }

      const ejec = new Ejecutor(arbol, opciones);
      ejec.entra();

      try {
        ejec.invocar(main, [], 0);
      } catch (err) {
        if (!err || !err.__return) throw err;
      }

      let salida = ejec.salida;
      if (salida === '') {
        salida = '(el programa no imprime nada)\n';
      } else if (!salida.endsWith('\n')) {
        // cout no añade el salto final: se pone para que se lea bien
        salida += '\n';
      }

      return { output: salida, error: false, fugas: ejec.memoria.fugasPendientes };
    } catch (err) {
      if (err instanceof ErrorCpp) {
        return { output: 'Error de C++: ' + err.message + '\n', error: true };
      }
      return { output: 'Error de C++: ' + (err && err.message ? err.message : String(err)) + '\n', error: true };
    }
  }

  return {
    ejecutar,
    tokenizar,
    construirArbol,
    Memoria,
    ErrorCpp,
    _internas: { V, aTextoCpp, formatoCout, valorPorDefecto, NULO, esPuntero, esReferencia, esTextoCpp, esEntero }
  };
})();