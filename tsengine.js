// DevQuest TypeScript — Verificador de tipos y recorte de anotaciones
//
// TypeScript no necesita un intérprete: es JavaScript con anotaciones de tipo.
// Así que este motor hace las DOS mitades de un compilador, y ninguna es un
// intérprete:
//
//   1. VERIFICAR. Recorre el código y comprueba que los tipos encajan. Aquí es
//      donde está el valor del lenguaje y lo que enseña el curso.
//   2. RECORTAR. Quita las anotaciones y deja JavaScript válido, que se
//      ejecuta en el motor del navegador.
//
// Las dos mitades se hacen en UNA sola pasada sobre los tokens. Es importante:
// si fueran dos Analyses distintos, el recorte y la verificación podrían
// discrepar y el alumno vería un error de tipo en código que sí funciona.
//
// Lo que cubre: number, string, boolean, void, any, unknown, null, undefined,
// never, tipos literales, arrays, objetos, uniones, intersecciones, tuplas,
// funciones, interfaces, alias de tipo, parámetros genéricos, clases con
// propiedades tipadas, literales enum, as, readonly y los modificadores
// private/public/protected.
//
// Lo que NO cubre, y por tanto el temario no usa: espacios de nombres,
// sobrecarga, Intersection types advanced, mapped types, conditional types,
// módulos y declaraciones .d.ts.

window.TS_ENGINE = (function () {

  // ════════════════════════════════════════════════
  // ERRORES
  // ════════════════════════════════════════════════

  class ErrorTs extends Error {
    constructor(mensaje, linea) {
      super(linea ? `Línea ${linea}: ${mensaje}` : mensaje);
      this.name = 'ErrorTs';
      this.linea = linea || 0;
    }
  }

  // ════════════════════════════════════════════════
  // LÉXICO
  //
  // Los tokens llevan su posición en el texto original porque el recorte se
  // hace sobre el FUENTE, no sobre los tokens: si se unieran tokens sin más,
  // dos palabras pegadas formarían una distinta ("letx").
  // ════════════════════════════════════════════════

  const PALABRAS_TS = new Set([
    'number', 'string', 'boolean', 'void', 'any', 'unknown', 'never',
    'object', 'symbol', 'bigint', 'undefined', 'null', 'true', 'false',
    'interface', 'type', 'enum', 'declare', 'implements', 'readonly',
    'public', 'private', 'protected', 'abstract', 'as', 'satisfies',
    'keyof', 'typeof', 'infer', 'is', 'asserts', 'namespace', 'module'
  ]);

  function tokenizar(src) {
    const s = String(src == null ? '' : src);
    const tokens = [];
    let i = 0;
    let linea = 1;
    // Guarda el último token que no es espacio: sirve para saber si una / es
    // división o el principio de una expresión regular, y si un { abre un
    // objeto o un bloque
    let previo = null;

    const anota = (t, ini) => {
      t.linea = linea;
      t.ini = ini;
      t.fin = i;
      tokens.push(t);
      if (t.t !== 'Espacio') previo = t;
      return t;
    };

    while (i < s.length) {
      const c = s[i];

      if (c === '\n') { linea++; i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }

      // Comentarios
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

      // Plantillas: `texto ${expresión} texto`
      if (c === '`') {
        const ini = i;
        i++;
        while (i < s.length && s[i] !== '`') {
          if (s[i] === '\\') { i += 2; continue; }
          if (s[i] === '\n') linea++;
          i++;
        }
        i++;
        anota({ t: 'Plantilla', v: s.slice(ini + 1, i - 1) }, ini);
        continue;
      }

      // Textos
      if (c === '"' || c === "'") {
        const ini = i;
        const comilla = c;
        i++;
        let valor = '';
        while (i < s.length && s[i] !== comilla) {
          if (s[i] === '\\') {
            const esc = s[i + 1];
            valor += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === 'r' ? '\r'
              : esc === '\\' ? '\\' : esc === '"' ? '"' : esc === "'" ? "'"
              : esc === '`' ? '`' : esc === '0' ? '\0' : esc;
            i += 2;
            continue;
          }
          if (s[i] === '\n') linea++;
          valor += s[i];
          i++;
        }
        i++;
        anota({ t: 'Texto', v: valor }, ini);
        continue;
      }

      // Expresión regular: se distingue de la división por lo que había antes
      if (c === '/' && previoPuedeSerOperador(previo)) {
        const ini = i;
        i++;
        let enClase = false;
        while (i < s.length && (s[i] !== '/' || enClase)) {
          if (s[i] === '\\') { i += 2; continue; }
          if (s[i] === '[') enClase = true;
          else if (s[i] === ']') enClase = false;
          else if (s[i] === '\n') linea++;
          i++;
        }
        i++;
        while (i < s.length && /[gimsuyvd]/.test(s[i])) i++;
        anota({ t: 'Regex', v: s.slice(ini, i) }, ini);
        continue;
      }

      // Números: 42, 3.14, 1e9, 0xFF, 1_000
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1]))) {
        const ini = i;
        let n = '';
        while (i < s.length && /[0-9a-fA-FxX._eE+-]/.test(s[i])) {
          // El + o - solo cuentan si van tras e o E
          if ((s[i] === '+' || s[i] === '-') && !/[eE]/.test(n[n.length - 1])) break;
          n += s[i];
          i++;
        }
        const limpio = n.replace(/_/g, '').replace(/[+-]$/, '');
        anota({ t: 'Num', v: Number(limpio), texto: limpio }, ini);
        continue;
      }

      // Identificadores
      if (/[A-Za-z_$À-ÿ]/.test(c)) {
        const ini = i;
        let id = '';
        while (i < s.length && /[A-Za-z0-9_$À-ÿ]/.test(s[i])) { id += s[i]; i++; }
        anota({ t: 'Id', v: id }, ini);
        continue;
      }

      // Operadores de tres y dos caracteres primero, para no partir >=
      const ops3 = ['...', '**=', '>>>'];
      const ops2 = ['=>', '==', '!=', '<=', '>=', '&&', '||', '??', '?.',
        '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '**', '>>', '<<'];

      if (ops3.includes(s.slice(i, i + 3))) {
        anota({ t: 'Op', v: s.slice(i, i + 3) }, i);
        i += 3;
        continue;
      }
      if (ops2.includes(s.slice(i, i + 2))) {
        anota({ t: 'Op', v: s.slice(i, i + 2) }, i);
        i += 2;
        continue;
      }
      if ('+-*/%<>=!&|^?:;,.()[]{}'.includes(c)) {
        // OJO: se avanza ANTES de anotar. Si se anotara antes, el token
        // guardaría como fin su propia posición de inicio, y cualquier recorte
        // que terminara en ese token se quedaría corto y dejaría el carácter
        // colgando en el JavaScript final.
        i++;
        anota({ t: 'Op', v: c }, i - 1);
        continue;
      }

      throw new ErrorTs(`carácter inesperado "${c}"`, linea);
    }

    tokens.push({ t: 'EOF', v: null, linea, ini: i, fin: i });
    return tokens;
  }

  /** ¿El token anterior permite que una / sea el inicio de una expresión regular? */
  function previoPuedeSerOperador(t) {
    if (!t) return true;                 // al principio del archivo
    if (t.t === 'Num' || t.t === 'Texto' || t.t === 'Plantilla') return false;
    if (t.t === 'Id') return !['return', 'typeof', 'case', 'in', 'of', 'new', 'delete'].includes(t.v);
    return !([')', ']', '}'].includes(t.v));
  }

  // ════════════════════════════════════════════════
  // TIPOS
  //
  // Un tipo es un objeto simple con una clase (k) y sus partes. Las primitivas
  // se nombran tal cual para que los mensajes de error se lean como los de un
  // compilador de verdad.
  // ════════════════════════════════════════════════

  const T = {
    prim: (n) => ({ k: 'prim', n }),
    lit: (valor, nombre) => ({ k: 'lit', v: valor, n: nombre }),
    arr: (de) => ({ k: 'arr', de }),
    obj: (campos) => ({ k: 'obj', c: campos }),
    union: (tipos) => ({ k: 'union', ts: tipos }),
    inter: (tipos) => ({ k: 'inter', ts: tipos }),
    tup: (tipos) => ({ k: 'tup', ts: tipos }),
    func: (params, devuelve) => ({ k: 'func', ps: params, d: devuelve }),
    ref: (nombre) => ({ k: 'ref', n: nombre }),
    inferido: () => ({ k: 'prim', n: 'any' })
  };

  /**
   * El tipo de un campo marcado con interrogación.
   *
   * El `?` no crea un tipo nuevo: significa que el campo puede no estar, y
   * cuando no está vale undefined. Por eso el tipo pasa a ser "este o
   * undefined". Representarlo así, y no con una marca aparte, hace que toda
   * la comprobación de asignabilidad funcione sin casos especiales.
   */
  function opcionalComo(tipo) {
    return T.union([tipo, T.prim('undefined')]);
  }

  /** ¿El tipo admite que el campo no esté? */
  function admisibleAusente(tipo) {
    if (!tipo) return true;
    if (tipo.k === 'prim' && tipo.n === 'any') return true;
    if (tipo.k === 'union') return tipo.ts.some(t => admisibleAusente(t));
    return tipo.k === 'prim' && tipo.n === 'undefined';
  }

  const PRIMITIVOS = new Set([
    'number', 'string', 'boolean', 'void', 'any', 'unknown', 'never',
    'object', 'symbol', 'bigint', 'null', 'undefined'
  ]);

  /** Cómo escribe un compilador un tipo, para los mensajes de error. */
  function nombreTipo(t) {
    if (!t) return 'any';
    switch (t.k) {
      case 'prim': return t.n;
      case 'lit': return t.n === 'string' ? JSON.stringify(t.v) : String(t.v);
      case 'arr': return nombreTipo(t.de) + '[]';
      case 'obj': {
        const dentro = Object.keys(t.c)
          .map(k => k + ': ' + nombreTipo(t.c[k]))
          .join('; ');
        return '{ ' + dentro + ' }';
      }
      case 'union': return t.ts.map(nombreTipo).join(' | ');
      case 'inter': return t.ts.map(nombreTipo).join(' & ');
      case 'tup': return '[' + t.ts.map(nombreTipo).join(', ') + ']';
      case 'func': return '(' + t.ps.map(nombreTipo).join(', ') + ') => ' + nombreTipo(t.d);
      case 'ref': return t.n;
      default: return 'any';
    }
  }

  /**
   * ¿Se puede meter un valor de tipo `valor` en un sitio de tipo `destino`?
   *
   * Es la pregunta central de la verificación. Solo da falso cuando está
   * claramente mal: si algo no se sabe, se asume que vale. Un error falso en
   * un compilador pedagogyco es peor que no detectar uno, porque el alumno
   * deja de fiarse de todo.
   */
  function asignable(destino, valor) {
    if (!destino || !valor) return true;
    if (destino.k === 'prim' && (destino.n === 'any' || destino.n === 'unknown')) return true;
    if (valor.k === 'prim' && valor.n === 'any') return true;
    if (valor.k === 'prim' && valor.n === 'never') return true;
    if (destino.k === 'prim' && destino.n === 'never') return false;

    // null y undefined solo caben si el destino los admite
    if (valor.k === 'prim' && (valor.n === 'null' || valor.n === 'undefined')) {
      if (destino.k === 'union') return destino.ts.some(d => asignable(d, valor));
      if (destino.k === 'prim') return destino.n === valor.n;
      return false;
    }

    // Una unión se cumple si el valor encaja en alguno de sus miembros
    if (destino.k === 'union') {
      if (valor.k === 'union') return valor.ts.every(v => destino.ts.some(d => asignable(d, v)));
      return destino.ts.some(d => asignable(d, valor));
    }

    // Un valor unión solo vale si TODAS sus partes valen
    if (valor.k === 'union') return valor.ts.every(v => asignable(destino, v));

    // Un tipo sin resolver no se comprueba: se asume correcto
    if (destino.k === 'ref' || valor.k === 'ref') return true;

    if (valor.k === 'lit') {
      if (destino.k === 'prim') return valor.n === destino.n;
      if (destino.k === 'lit') return destino.v === valor.v && destino.n === valor.n;
      return false;
    }

    if (destino.k === 'prim' && valor.k === 'prim') return destino.n === valor.n;

    if (destino.k === 'arr' && valor.k === 'arr') return asignable(destino.de, valor.de);
    if (destino.k === 'arr' && valor.k === 'tupla') return valor.ts.every(v => asignable(destino.de, v));
    if (destino.k === 'tup' && valor.k === 'tup') {
      if (destino.ts.length !== valor.ts.length) return false;
      return destino.ts.every((d, k) => asignable(d, valor.ts[k]));
    }

    if (destino.k === 'obj' && valor.k === 'obj') {
      // Cada campo que pide el destino tiene que estar y ser del tipo bueno.
      // Salvo los opcionales: como su tipo ya es "T | undefined", se
      // comprueba si lo admite y, si lo admite, no hace falta que esté.
      for (const campo in destino.c) {
        if (!Object.prototype.hasOwnProperty.call(valor.c, campo)) {
          if (!admisibleAusente(destino.c[campo])) return false;
          continue;
        }
        if (!asignable(destino.c[campo], valor.c[campo])) return false;
      }
      return true;
    }

    if (destino.k === 'func' && valor.k === 'func') {
      if (!asignable(destino.d, valor.d)) return false;
      return destino.ps.length === valor.ps.length
        && destino.ps.every((p, k) => asignable(valor.ps[k], p));
    }

    if (destino.k === 'inter') return destino.ts.every(d => asignable(d, valor));

    return false;
  }

  // ════════════════════════════════════════════════
  // EL ANALIZADOR
  //
  // Una sola pasada hace las dos mitades. Cada anotación que encuentra se
  // anota en dos sitios a la vez:
  //
  //   · en `recortes`, con las posiciones en el texto, para quitarla al final
  //     y dejar JavaScript válido
  //   · en la declaración donde vive, para poder comprobar los tipos
  //
  // Si fueran dos recorridos distintos, el recorte y la comprobación podrían
  // mirar cosas diferentes y el alumno vería errores inventados.
  // ════════════════════════════════════════════════

  class Analizador {
    constructor(tokens) {
      this.tokens = tokens;
      this.pos = 0;

      this.recortes = [];      // [inicio, fin] en el texto original
      this.errores = [];

      // Tipos declarados por el propio programa
      this.interfaces = {};    // Nombre -> { campos,metodos }
      this.alias = {};         // Nombre -> tipo
      this.clases = {};        // Nombre -> { campos, metodos }
      this.funciones = {};     // Nombre -> { ps: [{n, t}], d }

      this.ambito = this.nuevoAmbito();
      this.pilaTipos = [T.prim('any')];
    }

    nuevoAmbito() {
      return { vars: new Map(), funciones: new Map(), clases: new Map() };
    }

    // ── Acceso a tokens ──

    t(n = 0) { return this.tokens[this.pos + n]; }
    linea() { return this.t().linea; }
    avanzar() { return this.tokens[this.pos++]; }
    esOp(v, n = 0) { const t = this.t(n); return t.t === 'Op' && t.v === v; }
    esId(v, n = 0) { const t = this.t(n); return t.t === 'Id' && t.v === v; }

    /** ¿Delante hay un identificador (no una palabra clave de tipo)? */
    esNombre(n = 0) {
      const t = this.t(n);
      return t.t === 'Id' && !PRIMITIVOS.has(t.v);
    }

    error(msg, linea) {
      this.errores.push(new ErrorTs(msg, linea || this.linea()));
    }

    /** Apunta un trozo del texto para borrar: así desaparece del JS final. */
    recortar(desde, hasta) {
      if (desde === null || hasta === null || hasta <= desde) return;
      this.recortes.push([desde, hasta]);
    }

    /** Borra lo que va desde el token actual hasta uno pasado (sin incluir). */
    borrarTokens(desde, hasta) {
      if (desde >= hasta) return;
      this.recortar(this.tokens[desde].ini, this.tokens[hasta - 1].fin);
    }

    // ── Programa ──

    analizar() {
      while (this.t().t !== 'EOF') this.declaracion();
      return this;
    }

    /**
     * Una sentencia o declaración. Lo que hay aquí es lo que separa a
     * TypeScript de JavaScript, así que casi todo el trabajo está en detectar
     * cuándo empieza algo que solo existe en TypeScript.
     */
    declaracion() {
      const t = this.t();

      if (t.t !== 'Id') { this.avanzar(); return; }

      switch (t.v) {
        // ── interface: se borra entera, pero sus campos se guardan ──
        case 'interface': return this.declaracionInterface();
        case 'type': return this.declaracionAlias();
        case 'enum': return this.declaracionEnum();
        case 'declare': return this.declaracionDeclare();
        case 'namespace':
        case 'module':
          return this.declaracionNamespace();

        // ── Clases y funciones ──
        case 'class': return this.declaracionClase();
        case 'function': return this.declaracionFuncion();
        case 'async': {
          this.avanzar();
          if (this.esId('function')) return this.declaracionFuncion();
          return this.declaracion();
        }

        // ── import/export: se dejan pasar y se limpian al final ──
        case 'import': return this.saltarHasta(';');
        case 'export': return this.saltarHasta(';');

        // ── let / const / var: aquí es donde más se usa el tipado ──
        case 'let':
        case 'const':
        case 'var': return this.declaracionVariable();

        case 'readonly': {
          // readonly va delante de un campo: se borra y sigue la declaración
          this.avanzar();
          return this.declaracion();
        }

        default: break;
      }

      // Una sentencia suelta puede ser una expresión: una llamada, una
      // asignación, un console.log(p.apellido). Antes esto solo saltaba los
      // tokens uno a uno, así que NADA dentro de ellas se comprobaba: por eso
      // un campo inexistente o un argumento del tipo que no es pasaban
      // desapercibidos.
      if (this.puedeEmpezarExpresion()) return this.sentenciaExpresion();

      this.avanzar();
    }

    /** ¿Este token puede empezar una expresión? */
    puedeEmpezarExpresion() {
      const t = this.t();
      if (t.t === 'Num' || t.t === 'Texto' || t.t === 'Plantilla') return true;
      if (t.t === 'Op') return ['(', '[', '{', '!', '-', '+'].includes(t.v);
      if (t.t !== 'Id') return false;
      // Las palabras clave ya se han resuelto antes en el switch
      return !['case', 'default'].includes(t.v);
    }

    /** Una sentencia que es una expresión, acabada en punto y coma. */
    sentenciaExpresion() {
      const linea = this.linea();
      this.expresion();
      if (this.esOp(';')) this.avanzar();
      void linea;
    }

    saltarHasta(op) {
      while (this.t().t !== 'EOF' && !this.esOp(op)) this.avanzar();
      if (this.esOp(op)) this.avanzar();
    }

    /** declare ... : solo dice que ya existe en otro sitio; no ejecuta nada. */
    declaracionDeclare() {
      const desde = this.pos;
      this.avanzar();
      this.saltarHasta(';');
      this.borrarTokens(desde, this.pos);
    }

    /** namespace / module: no entra en el temario, se borra entero. */
    declaracionNamespace() {
      const desde = this.pos;
      this.avanzar();
      let nivel = 0;
      while (this.t().t !== 'EOF') {
        if (this.esOp('{')) nivel++;
        else if (this.esOp('}')) {
          nivel--;
          if (nivel === 0) { this.avanzar(); break; }
        }
        this.avanzar();
      }
      this.borrarTokens(desde, this.pos);
    }

    /**
     * interface Persona { nombre: string; edad: number }
     *
     * Se guarda la forma para poder comprobar los objetos que la usan, y se
     * borra entera porque en JavaScript no significa nada.
     */
    declaracionInterface() {
      const desde = this.pos;
      this.avanzar();                       // interface
      const nombre = this.avanzar().v;      // Persona

      // interface Persona<T> — los genéricos no entran en el temario
      if (this.esOp('<')) this.saltarHasta('>');

      const campos = {};
      const metodos = {};
      if (this.esOp('{')) {
        this.avanzar();
        while (this.t().t !== 'EOF' && !this.esOp('}')) {
          const m = this.campoOCampo();
          if (m) {
            if (m.metodo) metodos[m.nombre] = m;
            else campos[m.nombre] = m.opcional ? opcionalComo(m.tipo) : m.tipo;
          }
        }
        if (this.esOp('}')) this.avanzar();
      }
      if (this.esOp(';')) this.avanzar();

      this.interfaces[nombre] = { campos, metodos };
      this.borrarTokens(desde, this.pos);
    }

    /**
     * Lee un miembro de una interfaz o de una clase.
     *
     * Distingue un campo (nombre: Tipo) de un método (nombre(params): Tipo),
     * que es la diferencia que hay que tener clara al declarar una interfaz.
     */
    campoOCampo() {
      let opcional = false;
      let soloLectura = false;

      while (this.esId('readonly') || this.esId('public') || this.esId('private')
        || this.esId('protected') || this.esOp('?')) {
        if (this.esId('readonly')) soloLectura = true;
        if (this.esOp('?')) opcional = true;
        this.avanzar();
      }

      const tk = this.t();
      if (tk.t !== 'Id' && tk.t !== 'Texto') { this.avanzar(); return null; }

      const nombre = this.avanzar().v;
      const linea = tk.linea;

      // Método: hay un paréntesis justo detrás
      if (this.esOp('(')) {
        const { ps, d } = this.firmaDeParametros();
        // En una interfaz no hay cuerpo, solo la firma. Si aun así aparece
        // uno, se recorre entero para no dejar el analizador dentro del cuerpo.
        this.saltarCuerpo();
        const tipo = d || T.prim('void');
        void opcional; void soloLectura;
        return { metodo: true, nombre, ps, tipo, linea, soloLectura };
      }

      // Campo: el : Tipo se borra
      let tipo = T.inferido();
      if (this.esOp('?')) { opcional = true; this.avanzar(); }
      if (this.esOp(':')) {
        const desdeDosPuntos = this.pos;
        this.avanzar();
        const r = this.leerTipo();
        tipo = r.tipo;
        this.recortar(this.tokens[desdeDosPuntos].ini, this.tokens[r.fin - 1].fin);
      }

      if (this.esOp('=')) {
        // Campo inicializado: se comprueba el valor
        this.avanzar();
        const r = this.expresion();
        if (!asignable(tipo, r.tipo)) {
          this.error(
            `El tipo '${nombreTipo(r.tipo)}' no es asignable al tipo '${nombreTipo(tipo)}'.`,
            linea
          );
        }
      }

      if (this.esOp(';')) this.avanzar();

      return { metodo: false, nombre, tipo, linea, opcional };
    }

    /** type Estado = "pendiente" | "listo" */
    declaracionAlias() {
      const desde = this.pos;
      this.avanzar();                       // type
      const nombre = this.avanzar().v;

      if (this.esOp('<')) this.saltarHasta('>');
      if (this.esOp('=')) this.avanzar();

      const r = this.leerTipo();
      this.alias[nombre] = r.tipo;

      if (this.esOp(';')) this.avanzar();
      this.borrarTokens(desde, this.pos);
    }

    /**
     * enum Estado { Pendiente, Listo }
     *
     * En JavaScript un enum se compila en un objeto, así que aquí se sustituye
     * por el equivalente a mano en vez de borrarse.
     */
    declaracionEnum() {
      const desde = this.pos;
      this.avanzar();
      const nombre = this.avanzar().v;

      const miembros = [];
      const tipos = {};
      if (this.esOp('{')) {
        this.avanzar();
        while (this.t().t !== 'EOF' && !this.esOp('}')) {
          const clave = this.avanzar().v;
          let valor = miembros.length;
          if (this.esOp('=')) {
            this.avanzar();
            const r = this.expresion();
            if (r.tipo && r.tipo.k === 'lit' && typeof r.tipo.v === 'number') valor = r.tipo.v;
          }
          miembros.push([clave, valor]);
          tipos[clave] = T.lit(valor, 'number');
          if (this.esOp(',')) this.avanzar();
        }
        if (this.esOp('}')) this.avanzar();
      }
      if (this.esOp(';')) this.avanzar();

      // Esta es exactamente la forma en que el compilador de TypeScript
      // convierte un enum. Cada línea hace las dos cosas a la vez: pone el
      // número y guarda el nombre en la vuelta atrás, que es lo que hace que
      // Color.Rojo y Color[0] den lo mismo.
      const cuerpo = miembros
        .map(([k, v]) =>
          `  ${nombre}[${nombre}[${JSON.stringify(k)}] = ${v}] = ${JSON.stringify(k)};`)
        .join('\n');
      const js = 'var ' + nombre + ';\n'
        + '(function (' + nombre + ') {\n'
        + (cuerpo ? cuerpo + '\n' : '')
        + '  return ' + nombre + ';\n'
        + '})(' + nombre + ' || (' + nombre + ' = {}));\n';

      this.registrarReserva(desde, this.pos, js);

      this.tiposEnum = this.tiposEnum || {};
      this.tiposEnum[nombre] = { miembros, tipos };
    }

    /** Coloca un texto en vez de un trozo del original. */
    registrarReserva(desde, hasta, texto) {
      this.reservas = this.reservas || [];
      this.reservas.push({
        ini: this.tokens[desde].ini,
        fin: this.tokens[hasta - 1].fin,
        texto
      });
    }

    /**
     * let x: number = 5  /  var s: string  /  const p: Persona = {...}
     */
    declaracionVariable() {
      this.avanzar();                       // let / const / var
      const esConst = this.tokens[this.pos - 1].v === 'const';

      while (true) {
        const desdeNombre = this.pos;
        const tk = this.t();
        if (tk.t !== 'Id') break;
        const nombre = this.avanzar().v;
        const linea = tk.linea;

        let tipo = null;

        if (this.esOp(':')) {
          this.avanzar();
          const r = this.leerTipo();
          tipo = r.tipo;
          // El ": Tipo" desaparece del JavaScript final
          this.recortar(this.tokens[desdeNombre + 1].ini, this.tokens[r.fin - 1].fin);
        }

        if (this.esOp('=')) {
          this.avanzar();
          // const f = (n: number): number => ... : el tipo de retorno de la
          // flecha también desaparece, igual que en una función normal
          const r = this.expresionFlecha();
          if (r.tipo && !this.esNunca(r.tipo)) {
            const destino = tipo || r.tipo;
            if (!asignable(this.resolver(destino), this.resolver(r.tipo))) {
              if (tipo) {
                this.error(
                  `El tipo '${nombreTipo(r.tipo)}' no es asignable al tipo '${nombreTipo(tipo)}'.`,
                  linea
                );
              } else {
                this.declarar(nombre, r.tipo, linea, esConst);
              }
            } else if (!tipo) {
              this.declarar(nombre, r.tipo, linea, esConst);
            } else {
              this.declarar(nombre, tipo, linea, esConst);
            }
          } else if (tipo) {
            this.declarar(nombre, tipo, linea, esConst);
          }
        } else if (tipo) {
          this.declarar(nombre, tipo, linea, esConst);
        }

        if (this.esOp(',')) { this.avanzar(); continue; }
        break;
      }

      if (this.esOp(';')) this.avanzar();
    }

    declarar(nombre, tipo, linea, esConst) {
      this.ambito.vars.set(nombre, { tipo, linea, esConst });
    }

    esNunca(tipo) {
      return !!(tipo && tipo.k === 'prim' && tipo.n === 'never');
    }

    // ── Funciones ──

    /**
     * function suma(a: number, b: number): number { }
     *
     * El cuerpo no se toca: se comprueba por dentro, pero sigue siendo
     * JavaScript que se ejecuta tal cual.
     */
    declaracionFuncion() {
      const desde = this.pos;
      this.avanzar();                       // function
      const esGenerica = this.esOp('<');    // function f<T>(...)
      if (esGenerica) this.saltarHasta('>');

      const nombre = this.avanzar().v;
      const { ps, d } = this.firmaDeParametros();
      const finFirma = this.pos;

      // Si no hay anotación de retorno, no se comprueba nada: el código es
      // JavaScript normal y no hay con qué compararlo
      const tipoDevuelve = d || null;
      this.funciones[nombre] = { ps, d: tipoDevuelve || T.inferido() };

      // No se borra nada más: los tipos de los parámetros y el de retorno ya se
      // han quitado uno a uno dentro de firmaDeParametros(). Lo que queda es
      // function suma(a, b) { ... }, que es JavaScript válido.
      //
      // Solo desaparecen los parámetros genéricos: function f<T>(x) pasa a
      // ser function f(x), porque los <T> de una declaración no existen en JS.
      if (esGenerica) {
        const desdeGen = desde + 2;
        this.recortar(this.tokens[desdeGen].ini, this.tokens[finFirma - 1].fin);
      }

      if (this.esOp('{')) this.comprobarCuerpo(ps, tipoDevuelve);
      else if (this.esOp(';')) this.avanzar();
    }

    /**
     * Lee (a: number, b: number): Tipo y devuelve los parámetros con su tipo.
     *
     * Los parámetros se anotan al entrar al cuerpo y se quitan al salir, para
     * que no se confundan con variables de otro sitio.
     */
    firmaDeParametros() {
      const ps = [];
      if (!this.esOp('(')) return { ps, d: null };

      const inicioParams = this.pos;
      this.avanzar();                       // (

      while (this.t().t !== 'EOF' && !this.esOp(')')) {
        const tk = this.t();

        let opcional = false;
        while (this.esId('public') || this.esId('private') || this.esId('protected')
          || this.esId('readonly') || this.esOp('...')) {
          this.avanzar();
        }
        if (this.esOp('?')) { opcional = true; this.avanzar(); }

        if (this.t().t !== 'Id') { this.avanzar(); continue; }
        const desdeNombre = this.pos;
        const nombre = this.avanzar().v;

        let tipo = null;
        if (this.esOp(':')) {
          this.avanzar();
          const r = this.leerTipo();
          tipo = r.tipo;
          this.recortar(this.tokens[desdeNombre + 1].ini, this.tokens[r.fin - 1].fin);
        }

        if (tipo) ps.push({ nombre, tipo, linea: tk.linea, opcional });
        if (this.esOp('=')) {
          // Valor por defecto: se comprueba contra el tipo declarado
          this.avanzar();
          const r = this.expresion();
          if (tipo && !asignable(this.resolver(tipo), this.resolver(r.tipo))) {
            this.error(
              `El tipo '${nombreTipo(r.tipo)}' no es asignable al tipo '${nombreTipo(tipo)}'.`,
              tk.linea
            );
          }
        }

        if (this.esOp(',')) { this.avanzar(); continue; }
      }

      if (this.esOp(')')) this.avanzar();
      void inicioParams;

      // El tipo de retorno, si lo hay, también se borra
      let d = null;
      if (this.esOp(':')) {
        const desde = this.pos;
        this.avanzar();
        const r = this.leerTipo();
        d = r.tipo;
        this.recortar(this.tokens[desde].ini, this.tokens[r.fin - 1].fin);
      }

      return { ps, d };
    }

    /**
     * Comprueba el interior de una función: cada return tiene que encajar con
     * lo que declara devolver.
     */
    comprobarCuerpo(parametros, devuelve) {
      this.entra();
      parametros.forEach(p => this.declarar(p.nombre, p.tipo, p.linea, false));

      this.ambito.devuelve = devuelve;
      this.comprobarHastaCierre();
      this.sale();
    }

    /**
     * Recorre un cuerpo hasta su llave de cierre.
     *
     * El nivel empieza en CERO porque el analizador está parado SOBRE la llave
     * de apertura, no después. Si seSerialized empezara en uno, la primera
     * llave subiría el nivel a dos y el recorrido se comería el cierre de la
     * clase entera.
     */
    comprobarHastaCierre() {
      let nivel = 0;
      let huboReturn = false;
      const prometido = this.ambito.devuelve;

      // Solo cuentan los return del cuerpo de la función, no los de una función
      // anidada: un return dentro de un callback no devuelve el resultado de
      // esta función.
      const avisarSiFaltaReturn = () => {
        if (huboReturn || !prometido || prometido.k !== 'prim') return;
        if (prometido.n === 'void' || prometido.n === 'any') return;
        this.error(
          `Una función cuyo tipo de retorno declarado es '${nombreTipo(prometido)}' `
          + `debe devolver un valor.`,
          this.linea()
        );
      };

      while (this.t().t !== 'EOF') {
        if (this.esOp('{')) { nivel++; this.avanzar(); continue; }

        if (this.esOp('}')) {
          nivel--;
          this.avanzar();
          if (nivel === 0) {
            // Aquí es donde se sabe que el cuerpo se acabó, así que el aviso
            // va aquí: si se pusiera después del bucle, nunca se llegaría
            avisarSiFaltaReturn();
            return;
          }
          continue;
        }

        if (this.esId('return') && nivel === 1) {
          huboReturn = true;
          this.comprobarReturn();
          continue;
        }

        if (this.esId('return')) { this.comprobarReturn(); continue; }

        this.avanzar();
      }

      avisarSiFaltaReturn();
    }

    comprobarReturn() {
      this.avanzar();                       // return
      const devuelve = this.ambito.devuelve || null;
      const linea = this.linea();

      if (this.esOp(';') || this.esOp('}')) {
        // return sin nada solo es un error si se había prometido un valor
        if (devuelve && devuelve.k === 'prim' && devuelve.n !== 'void' && devuelve.n !== 'any') {
          this.error(
            `Una función cuyo tipo de retorno declarado es '${nombreTipo(devuelve)}' `
            + `debe devolver un valor.`,
            linea
          );
        }
        if (this.esOp(';')) this.avanzar();
        return;
      }

      const r = this.expresion();
      if (!devuelve) {
        if (this.esOp(';')) this.avanzar();
        return;
      }
      if (devuelve.k === 'prim' && devuelve.n === 'void') {
        this.error('Una función declarada como void no puede devolver un valor.', linea);
      } else if (r.tipo && !asignable(this.resolver(devuelve), this.resolver(r.tipo))) {
        this.error(
          `El tipo '${nombreTipo(r.tipo)}' no es asignable al tipo '${nombreTipo(devuelve)}'.`,
          linea
        );
      }

      if (this.esOp(';')) this.avanzar();
    }

    // ── Clases ──

    /**
     * class Punto { x: number; y: number; constructor(x, y) { } }
     *
     * Los atributos se borran del JavaScript final, que es lo que hace el
     * compilador: las declaraciones de campo sin valor desaparecen.
     */
    declaracionClase() {
      const desde = this.pos;
      this.avanzar();                       // class
      if (this.esOp('<')) this.saltarHasta('>');
      const nombre = this.avanzar().v;

      const heredada = this.t().t === 'Id' && this.tokens[this.pos + 1] &&
        (this.tokens[this.pos + 1].t === 'Op' && this.tokens[this.pos + 1].v === '{');
      let padre = null;
      if (heredada) { padre = this.avanzar().v; }
      if (this.esId('implements')) {
        while (this.t().t !== 'EOF' && !this.esOp('{')) this.avanzar();
      }

      const campos = {};
      const metodos = {};
      const constructores = [];

      if (this.esOp('{')) {
        this.avanzar();
        while (this.t().t !== 'EOF' && !this.esOp('}')) {
          const antes = this.pos;
          const m = this.miembroDeClase(constructores);
          if (m) {
            if (m.metodo) metodos[m.nombre] = m;
            else campos[m.nombre] = m.opcional ? opcionalComo(m.tipo) : m.tipo;
          }
          // Si no se ha avanzado, se fuerza para no quedarse infinito
          if (this.pos === antes) this.avanzar();
        }
        if (this.esOp('}')) this.avanzar();
      }

      this.clases[nombre] = { campos, metodos, padre, constructores };
      void desde;
    }

    /**
     * Un miembro de clase: un campo con tipo, un método o un constructor.
     *
     * Para el constructor hay un detalle importante: los campos declarados sin
     * valor se asignan dentro. El compilador real genera ese código, y sin él
     * `new Punto()` no tendría `x` ni `y`.
     */
    miembroDeClase(constructores) {
      let esEstatico = false;
      const desdeModificadores = this.pos;
      while (this.esId('static') || this.esId('readonly') || this.esId('public')
        || this.esId('private') || this.esId('protected') || this.esId('abstract')) {
        if (this.esId('static')) esEstatico = true;
        this.avanzar();
      }
      // private, public y readonly no existen en JavaScript: si se dejan, el
      // resultado sería "private n = 0" y el navegador daría error
      if (this.pos > desdeModificadores) {
        this.borrarTokens(desdeModificadores, this.pos);
      }

      let esConstructor = false;
      let esOpcional = false;
      let nombre;
      if (this.esId('constructor') && !this.esOp('.')) {
        esConstructor = true;
        this.avanzar();
        nombre = 'constructor';
      } else if (this.esOp('[')) {
        // Los índices calculados y los getters no entran en el temario
        this.saltarHasta(']');
        nombre = null;
      } else if (this.t().t === 'Id' || this.t().t === 'Texto') {
        nombre = this.avanzar().v;
        if (this.esOp('?')) { esOpcional = true; this.avanzar(); }
        else if (this.esOp('!')) this.avanzar();
      } else {
        return null;
      }

      // ¿Es un método?
      if (this.esOp('(') || this.esOp('<')) {
        if (this.esOp('<')) {
          const desdeGen = this.pos;
          this.saltarHasta('>');
          this.borrarTokens(desdeGen, this.pos);
        }
        // Los tipos de los parámetros y el de retorno se quitan uno a uno
        // dentro de firmaDeParametros(), así que aquí no hay que recortar
        // nada más: los paréntesis se conservan y quedan como JavaScript
        const { ps, d } = this.firmaDeParametros();

        if (esConstructor) {
          constructores.push({ ps });
          // Los this.x = x del constructor se comprueban contra el campo
          this.comprobarCuerpo(ps, T.prim('void'));
          return { metodo: true, nombre: 'constructor', ps, tipo: T.prim('void'), esConstructor: true };
        }

        const tipo = d || T.prim('void');
        this.comprobarCuerpo(ps, tipo);
        return { metodo: true, nombre, ps, tipo };
      }

      // Es un campo: la declaración entera desaparece del JS
      let tipo = T.inferido();
      if (this.esOp(':')) {
        const desdeDosPuntos = this.pos;
        this.avanzar();
        const r = this.leerTipo();
        tipo = r.tipo;
        this.recortar(this.tokens[desdeDosPuntos].ini, this.tokens[r.fin - 1].fin);
      }

      if (this.esOp('=')) {
        this.avanzar();
        const r = this.expresion();
        if (r.tipo && !asignable(this.resolver(tipo), this.resolver(r.tipo))) {
          this.error(
            `El tipo '${nombreTipo(r.tipo)}' no es asignable al tipo '${nombreTipo(tipo)}'.`,
            this.linea()
          );
        }
        if (!this.esOp(';')) {
          // Con valor inicial, la declaración se queda en el JS: sin esto el
          // atributo no existiría en el objeto
          return { metodo: false, nombre, tipo: esOpcional ? opcionalComo(tipo) : tipo, esCampo: false, esEstatico };
        }
        this.avanzar();
        return { metodo: false, nombre, tipo: esOpcional ? opcionalComo(tipo) : tipo, esCampo: false, esEstatico };
      }

      if (this.esOp(';')) this.avanzar();
      return { metodo: false, nombre, tipo: esOpcional ? opcionalComo(tipo) : tipo, esCampo: true, esEstatico };
    }

    // ── Ámbitos ──

    entra() {
      const nuevo = Object.create(this.ambito);
      nuevo.vars = new Map(this.ambito.vars);
      this.pilaAmbitos = this.pilaAmbitos || [];
      this.pilaAmbitos.push(this.ambito);
      this.ambito = nuevo;
    }

    sale() {
      // Con la guarda, un salir de más no deja el analizador en el prototype
      // vacío, donde buscarVariable explotaría al no tener vars
      if (!this.pilaAmbitos || !this.pilaAmbitos.length) return;
      this.ambito = this.pilaAmbitos.pop();
    }

    /** Se salta un cuerpo { ... } entero, contando llaves. */
    saltarCuerpo() {
      if (!this.esOp('{')) return;
      let nivel = 0;
      do {
        if (this.esOp('{')) nivel++;
        else if (this.esOp('}')) nivel--;
        this.avanzar();
      } while (nivel > 0 && this.t().t !== 'EOF');
    }

    // ════════════════════════════════════════════════
    // TIPOS
    // ════════════════════════════════════════════════

    /**
     * Lee un tipo y devuelve dónde termina.
     *
     * Los rangos de prioridad, de más débil a más fuerte:
     *   unión e intersección (| y &)  →  tipo con sufijo []  →  tipo base
     * Como en el compilador de verdad, lo que se escribe más a la derecha
     * binds más fuerte: number[][] es un array de arrays.
     */
    leerTipo() {
      const inicio = this.pos;
      const piezas = [];
      let intersecciones = false;

      while (true) {
        const p = this.tipoAtomico();
        if (!p) break;
        piezas.push(p.tipo);

        if (this.esOp('|') || this.esOp('&')) {
          if (this.esOp('&')) intersecciones = true;
          this.avanzar();
          continue;
        }
        break;
      }

      let tipo;
      if (piezas.length === 0) tipo = T.inferido();
      else if (piezas.length === 1) tipo = piezas[0];
      else tipo = intersecciones ? T.inter(piezas) : T.union(piezas);

      // Los sufijos [] se aplican al resultado, con la misma precedencia
      while (this.esOp('[')) {
        const desde = this.pos;
        this.avanzar();
        if (this.esOp(']')) {
          this.avanzar();
          tipo = T.arr(tipo);
          this.recortar(this.tokens[desde].ini, this.tokens[this.pos - 1].fin);
        } else {
          // Es una tupla: [number, string]
          const partes = [tipo];
          this.avanzar();
          while (this.t().t !== 'EOF' && !this.esOp(']')) {
            if (this.esOp(',')) { this.avanzar(); continue; }
            const r = this.leerTipo();
            partes.push(r.tipo);
          }
          if (this.esOp(']')) this.avanzar();
          tipo = T.tup(partes);
          this.recortar(this.tokens[desde].ini, this.tokens[this.pos - 1].fin);
        }
      }

      void inicio;
      return { tipo, fin: this.pos };
    }

    /** Un tipo que ya no lleva ni | ni [] detrás. */
    tipoAtomico() {
      const t = this.t();

      if (t.t === 'Texto') {
        this.avanzar();
        return { tipo: T.lit(t.v, 'string'), fin: this.pos };
      }
      if (t.t === 'Num') {
        this.avanzar();
        return { tipo: T.lit(t.v, 'number'), fin: this.pos };
      }

      // Paréntesis: (number) o tipo de función (x: number) => string
      if (this.esOp('(')) {
        this.avanzar();
        const params = [];
        while (this.t().t !== 'EOF' && !this.esOp(')')) {
          if (this.esOp('?')) this.avanzar();
          if (this.t().t === 'Id') {
            this.avanzar();
            if (this.esOp('?')) this.avanzar();
            if (this.esOp(':')) {
              this.avanzar();
              const r = this.leerTipo();
              params.push(r.tipo);
            } else {
              params.push(T.inferido());
            }
          } else {
            this.avanzar();
          }
          if (this.esOp(',')) this.avanzar();
        }
        if (this.esOp(')')) this.avanzar();
        if (this.esOp('=>')) {
          this.avanzar();
          const r = this.leerTipo();
          return { tipo: T.func(params, r.tipo), fin: this.pos };
        }
        return { tipo: params.length === 1 ? params[0] : T.tup(params), fin: this.pos };
      }

      // Literal de objeto: { nombre: string; edad: number }
      if (this.esOp('{')) {
        this.avanzar();
        const campos = {};
        while (this.t().t !== 'EOF' && !this.esOp('}')) {
          if (this.esOp('?') || this.esId('readonly')) this.avanzar();
          if (this.t().t !== 'Id' && this.t().t !== 'Texto') { this.avanzar(); continue; }
          const clave = this.avanzar().v;
          if (this.esOp('?')) this.avanzar();
          let tipo = T.inferido();
          if (this.esOp(':')) {
            this.avanzar();
            const r = this.leerTipo();
            tipo = r.tipo;
          }
          campos[clave] = tipo;
          if (this.esOp(',') || this.esOp(';')) this.avanzar();
        }
        if (this.esOp('}')) this.avanzar();
        return { tipo: T.obj(campos), fin: this.pos };
      }

      // Literal de array en posición de tipo: no se usa en el temario
      if (this.esOp('[')) {
        this.avanzar();
        if (this.esOp(']')) { this.avanzar(); return { tipo: T.arr(T.inferido()), fin: this.pos }; }
        this.avanzar();
        return { tipo: T.arr(T.inferido()), fin: this.pos };
      }

      if (t.t !== 'Id') return null;

      if (t.v === 'true' || t.v === 'false') {
        this.avanzar();
        return { tipo: T.lit(t.v === 'true', 'boolean'), fin: this.pos };
      }

      if (PRIMITIVOS.has(t.v)) {
        this.avanzar();
        if (t.v === 'null') return { tipo: T.prim('null'), fin: this.pos };
        return { tipo: T.prim(t.v), fin: this.pos };
      }

      // typeof x → el tipo de x
      if (t.v === 'typeof') {
        this.avanzar();
        if (this.t().t === 'Id') {
          const nombre = this.avanzar().v;
          const encontrado = this.buscarVariable(nombre);
          return {
            tipo: encontrado ? encontrado.tipo : T.prim('any'),
            fin: this.pos
          };
        }
        return { tipo: T.prim('any'), fin: this.pos };
      }

      // Nombre de una interface, un alias o una clase
      this.avanzar();
      if (this.esOp('.')) {
        // Persona.Algo → no entra en el temario
        this.avanzar();
        this.avanzar();
      }
      if (this.esOp('<')) {
        // Los parámetros genéricos de un tipo no entran en el temario
        this.saltarHasta('>');
      }
      return { tipo: T.ref(t.v), fin: this.pos };
    }

    /** El tipo declarado de una variable, resolviendo referencias. */
    buscarVariable(nombre) {
      let ambito = this.ambito;
      while (ambito && ambito.vars) {
        if (ambito.vars.has(nombre)) return ambito.vars.get(nombre);
        ambito = Object.getPrototypeOf(ambito);
      }
      return null;
    }

    // ════════════════════════════════════════════════
    // EXPRESIONES
    //
    // No se evalúa el código: se calcula el TIPO de cada expresión. Solo
    // importan las construcciones que el temario usa.
    // ════════════════════════════════════════════════

    expresion() {
      return this.unaYR();
    }

    /**
     * Expresión que puede ser una función flecha CON tipos.
     *
     * En `const f = (n: number): number => n * 2` hay tres cosas que
     * desaparecen: el `: number` del parámetro, el `: number` del retorno y
     * la flecha se queda sola. Como la firma ya sabe quitar anotaciones, lo
     * que hace falta es distinguir una flecha de una llamada normal y pasar
     * por firmaDeParametros().
     */
    expresionFlecha() {
      const desde = this.pos;
      const cierre = this.cierreDeParametros(desde);

      if (cierre !== null) {
        const tieneTiposEnParams = this.hayAnotaciones(this.pos + 1, cierre);
        const despues = this.tokens[cierre + 1];
        const tieneTipoDeRetorno = despues && despues.t === 'Op' && despues.v === ':';

        if (tieneTiposEnParams || tieneTipoDeRetorno) {
          this.pos = desde;
          // firmaDeParametros ya borra lo de los parámetros y el tipo de
          // retorno, así que solo queda comerse la flecha
          this.firmaDeParametros();
          if (this.esOp(':')) {
            const desdeTipo = this.pos;
            this.avanzar();
            const rt = this.leerTipo();
            this.recortar(this.tokens[desdeTipo].ini, this.tokens[rt.fin - 1].fin);
          }
          if (this.esOp('=>')) this.avanzar();
          return this.unaYR();
        }
      }

      this.pos = desde;
      return this.unaYR();
    }

    /**
     * La posición del paréntesis que cierra una lista de parámetros, si lo que
     * empieza en `desde` es una lista. null si no.
     */
    cierreDeParametros(desde) {
      if (!this.esOp('(')) return null;
      let nivel = 0;
      for (let i = desde; i < this.tokens.length && this.tokens[i].t !== 'EOF'; i++) {
        const t = this.tokens[i];
        if (t.t === 'Op' && '([{'.includes(t.v)) nivel++;
        else if (t.t === 'Op' && ')]}'.includes(t.v)) {
          nivel--;
          if (nivel === 0) return i;
        } else if (t.t === 'Op' && t.v === '=>' && nivel === 0) return null;
      }
      return null;
    }

    /** ¿Entre dos posiciones hay un identificador seguido de dos puntos? */
    hayAnotaciones(desde, hasta) {
      for (let i = desde; i < hasta - 1; i++) {
        const a = this.tokens[i];
        const b = this.tokens[i + 1];
        if (a.t === 'Id' && b.t === 'Op' && b.v === ':') return true;
      }
      return false;
    }

    unaYR() {
      let izq = this.comparacion();

      while (this.esOp('&&') || this.esOp('||') || this.esOp('??')) {
        const op = this.avanzar().v;
        const der = this.comparacion();
        izq = { tipo: op === '&&' || op === '||' ? T.prim('boolean') : (izq.tipo || der.tipo), valor: null };
      }
      return izq;
    }

    comparacion() {
      let izq = this.adicion();
      while (this.esOp('<') || this.esOp('>') || this.esOp('<=') || this.esOp('>=')
        || this.esOp('===') || this.esOp('!==') || this.esOp('==') || this.esOp('!=')) {
        const op = this.avanzar().v;
        const der = this.adicion();

        // En JavaScript `1 < "a"` es legal y devuelve false. En TypeScript es
        // un error, porque un número y un texto no se pueden ordenar. Solo se
        // comprueba lo obvio: si los dos lados son del mismo tipo o son
        // números, no se dice nada.
        if (izq.tipo && der.tipo && op !== '===' && op !== '!==' && op !== '==' && op !== '!=') {
          const a = this.resolver(izq.tipo);
          const b = this.resolver(der.tipo);
          const aNum = a && a.k === 'prim' && a.n === 'number';
          const bNum = b && b.k === 'prim' && b.n === 'number';
          const aTxt = a && a.k === 'prim' && a.n === 'string';
          const bTxt = b && b.k === 'prim' && b.n === 'string';

          const mezclaIncomparable = (aNum && bTxt) || (aTxt && bNum)
            || (a && a.k === 'prim' && b && b.k === 'prim' && a.n !== b.n
              && a.n !== 'any' && b.n !== 'any' && a.n !== 'unknown' && b.n !== 'unknown');

          if (mezclaIncomparable) {
            this.error(
              `No se pueden comparar los tipos '${nombreTipo(izq.tipo)}' `
              + `y '${nombreTipo(der.tipo)}' con '${op}'.`,
              this.linea()
            );
          }
        }

        izq = { tipo: T.prim('boolean'), valor: null };
      }
      return izq;
    }

    adicion() {
      let izq = this.multiplicacion();
      while (this.esOp('+') || this.esOp('-')) {
        const op = this.avanzar().v;
        const der = this.multiplicacion();
        izq = { tipo: this.tipoAritmetico(op, izq, der), valor: null };
      }
      return izq;
    }

    multiplicacion() {
      let izq = this.unaria();
      while (this.esOp('*') || this.esOp('/') || this.esOp('%') || this.esOp('**')) {
        const op = this.avanzar().v;
        const der = this.unaria();
        izq = { tipo: this.tipoAritmetico(op, izq, der), valor: null };
      }
      return izq;
    }

    tipoAritmetico(op, izq, der) {
      const a = izq.tipo;
      const b = der.tipo;
      if (op === '+' && a && a.k === 'prim' && a.n === 'string') return T.prim('string');
      if (op === '+' && b && b.k === 'prim' && b.n === 'string') return T.prim('string');
      if (a && b && (esNumerico(a) || esNumerico(b))) return T.prim('number');
      if (op === '**') return T.prim('number');
      return a || b || T.inferido();
    }

    unaria() {
      if (this.esOp('!')) { this.avanzar(); this.unaria(); return { tipo: T.prim('boolean'), valor: null }; }
      if (this.esOp('-') || this.esOp('+') || this.esOp('~')) {
        this.avanzar();
        const r = this.unaria();
        return { tipo: r.tipo && r.tipo.k === 'prim' && r.tipo.n === 'number' ? T.prim('number') : T.inferido(), valor: null };
      }
      if (this.esId('typeof')) {
        this.avanzar();
        this.unaria();
        return { tipo: T.prim('string'), valor: null };
      }
      return this.postfijo();
    }

    postfijo() {
      let e = this.primaria();

      while (true) {
        if (this.esOp('.')) {
          this.avanzar();
          const nombre = this.avanzar().v;
          if (this.esOp('<')) this.saltarHasta('>');

          if (this.esOp('(')) {
            const llamada = this.argumentosLlamada();
            e = { tipo: this.tipoDeLlamada(nombre, e.tipo, llamada), valor: null };
          } else {
            e = { tipo: this.tipoDeCampo(nombre, e.tipo), valor: null };
          }
          continue;
        }

        if (this.esOp('[')) {
          this.avanzar();
          this.expresion();
          if (this.esOp(']')) this.avanzar();
          const base = e.tipo;
          e = {
            tipo: base && base.k === 'arr' ? base.de
              : (base && base.k === 'prim' && base.n === 'string' ? T.prim('string') : T.inferido()),
            valor: null
          };
          continue;
        }

        // as: "algo as Tipo" es el tipo que uno le dice a TypeScript
        if (this.esId('as')) {
          this.avanzar();
          const desde = this.pos;
          const r = this.leerTipo();
          this.recortar(this.tokens[desde - 1].ini, this.tokens[r.fin - 1].fin);
          e = { tipo: r.tipo, valor: null };
          continue;
        }

        break;
      }

      return e;
    }

    /** El tipo de un campo, comprobando que exista en el objeto. */
    tipoDeCampo(nombre, base) {
      if (!base) return T.inferido();
      const resuelto = this.resolverTipo(base);

      if (resuelto.k === 'obj') {
        if (Object.prototype.hasOwnProperty.call(resuelto.c, nombre)) return resuelto.c[nombre];
        const error = new ErrorTs(
          `La propiedad '${nombre}' no existe en el tipo '${nombreTipo(base)}'.`
          + ` Hay: ${Object.keys(resuelto.c).join(', ') || '(ninguno)'}.`
        );
        this.errores.push(error);
        return T.inferido();
      }

      if (resuelto.k === 'ref' && this.interfaces[resuelto.n]) {
        const iface = this.interfaces[resuelto.n];
        if (Object.prototype.hasOwnProperty.call(iface.campos, nombre)) return iface.campos[nombre];
        this.errores.push(new ErrorTs(
          `La propiedad '${nombre}' no existe en el tipo '${nombreTipo(base)}'.`
          + ` Hay: ${Object.keys(iface.campos).join(', ') || '(ninguno)'}.`
        ));
        return T.inferido();
      }

      if (resuelto.k === 'arr') {
        if (nombre === 'length') return T.prim('number');
        if (['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(nombre)) {
          return T.inferido();
        }
        if (['map', 'filter'].includes(nombre)) return T.arr(resuelto.de);
        if (['join', 'includes', 'indexOf', 'toString'].includes(nombre)) return T.prim('string');
        if (['reduce', 'some', 'every'].includes(nombre)) return T.inferido();
        if (['slice', 'concat', 'flat'].includes(nombre)) return resuelto;
        if (nombre === 'forEach') return T.prim('void');
      }

      if (resuelto.k === 'prim' && resuelto.n === 'string') {
        if (nombre === 'length') return T.prim('number');
        return T.prim('string');
      }

      if (resuelto.k === 'prim' && resuelto.n === 'number'
        && ['toFixed', 'toString'].includes(nombre)) {
        return nombre === 'toFixed' ? T.prim('string') : T.prim('string');
      }

      return T.inferido();
    }

    /** El tipo que devuelve un método, si se puede saber. */
    tipoDeLlamada(nombre, base, argumentos) {
      if (!base) return T.inferido();
      const resuelto = this.resolverTipo(base);

      if (resuelto.k === 'ref') {
        const iface = this.interfaces[resuelto.n];
        if (iface && iface.metodos[nombre]) {
          this.comprobarArgumentos(
            `${nombre} de ${resuelto.n}`,
            iface.metodos[nombre].ps,
            argumentos,
            iface.metodos[nombre].linea
          );
          return iface.metodos[nombre].tipo;
        }
      }

      if (resuelto.k === 'arr') {
        const tipoElem = resuelto.de;
        const nombreTipoElem = tipoElem && tipoElem.k === 'prim' ? tipoElem.n : null;
        const firma = {
          join: ['string', []],
          includes: ['boolean', [tipoElem]],
          indexOf: ['number', [tipoElem]],
          push: ['number', [tipoElem]],
          pop: [tipoElem ? nombreTipoElem : null, []],
          shift: [tipoElem ? nombreTipoElem : null, []],
          slice: ['array', []],
          concat: ['array', []],
          map: ['array', []],
          filter: ['array', []],
          find: [tipoElem ? nombreTipoElem : null, []],
          forEach: ['void', []],
          reduce: [tipoElem ? nombreTipoElem : null, []],
          sort: ['array', []],
          reverse: ['array', []],
          some: ['boolean', []],
          every: ['boolean', []],
          length: ['number', []]
        };
        if (firma[nombre]) {
          if (firma[nombre][0] === 'array') return T.arr(tipoElem || T.inferido());
          if (firma[nombre][0] === 'void') return T.prim('void');
          if (!firma[nombre][0]) return T.inferido();
          return T.prim(firma[nombre][0]);
        }
        return T.inferido();
      }

      if (resuelto.k === 'prim' && resuelto.n === 'string') {
        if (['toUpperCase', 'toLowerCase', 'trim', 'slice', 'substring', 'replace', 'repeat'].includes(nombre)) {
          return T.prim('string');
        }
        if (['split', 'charAt'].includes(nombre)) return T.arr(T.prim('string'));
        if (['includes', 'startsWith', 'endsWith'].includes(nombre)) return T.prim('boolean');
        if (['indexOf'].includes(nombre)) return T.prim('number');
        if (['toString'].includes(nombre)) return T.prim('string');
      }

      if (resuelto.k === 'prim' && resuelto.n === 'number') {
        if (['toFixed', 'toString'].includes(nombre)) return T.prim('string');
        if (['toPrecision'].includes(nombre)) return T.prim('string');
      }

      if (resuelto.k === 'prim' && resuelto.n === 'boolean') {
        if (nombre === 'toString') return T.prim('string');
      }

      return T.inferido();
    }

    comprobarArgumentos(nombre, ps, argumentos, linea) {
      if (!ps || !argumentos) return;
      ps.forEach((p, k) => {
        const dado = argumentos[k];
        if (!dado) return;
        if (dado.tipo && !asignable(this.resolver(p.tipo), this.resolver(dado.tipo))) {
          this.errores.push(new ErrorTs(
            `El argumento '${p.nombre}' de tipo '${nombreTipo(dado.tipo)}' `
            + `no es asignable al parámetro '${nombreTipo(p.tipo)}'.`,
            linea
          ));
        }
      });
    }

    /**
     * Resuelve un tipo contra lo que declara el programa, sin standstilllo.
     *
     * Hace falta porque asignable() es una función pura que no sabe qué
     * aliases hay escritos: sin resolver, `const e: Estado = "cancelado"`
     * pasaría siempre, porque una referencia se perdona sin mirar.
     */
    resolver(tipo) {
      return this.resolverTipo(tipo);
    }

    /** Resuelve una referencia a su definición. */
    resolverTipo(tipo) {
      let actual = tipo;
      // Las referencias pueden apuntar a otras referencias
      for (let i = 0; i < 10 && actual && actual.k === 'ref'; i++) {
        if (this.alias[actual.n]) { actual = this.alias[actual.n]; continue; }
        if (this.interfaces[actual.n]) {
          const iface = this.interfaces[actual.n];
          return T.obj(Object.assign({}, iface.campos));
        }
        if (this.clases[actual.n]) {
          const clase = this.clases[actual.n];
          return T.obj(Object.assign({}, clase.campos));
        }
        return T.prim('any');
      }
      return actual || T.inferido();
    }

    argumentosLlamada() {
      const args = [];
      this.avanzar();                       // (
      while (this.t().t !== 'EOF' && !this.esOp(')')) {
        const r = this.expresion();
        args.push(r);
        if (this.esOp(',')) { this.avanzar(); continue; }
      }
      if (this.esOp(')')) this.avanzar();
      return args;
    }

    primaria() {
      const t = this.t();

      if (t.t === 'Num') {
        this.avanzar();
        return { tipo: T.lit(t.v, 'number'), valor: t.v };
      }
      if (t.t === 'Texto') {
        this.avanzar();
        return { tipo: T.lit(t.v, 'string'), valor: t.v };
      }
      if (t.t === 'Plantilla') {
        this.avanzar();
        return { tipo: T.prim('string'), valor: null };
      }

      if (t.t === 'Id') {
        if (t.v === 'true' || t.v === 'false') {
          this.avanzar();
          return { tipo: T.lit(t.v === 'true', 'boolean'), valor: t.v === 'true' };
        }
        if (t.v === 'null') { this.avanzar(); return { tipo: T.prim('null'), valor: null }; }
        if (t.v === 'undefined') { this.avanzar(); return { tipo: T.prim('undefined'), valor: undefined }; }
        if (t.v === 'new') {
          this.avanzar();
          const nombre = this.avanzar().v;
          if (this.esOp('(')) this.argumentosLlamada();
          const clase = this.clases[nombre];
          if (clase) return { tipo: T.ref(nombre), valor: null };
          return { tipo: T.inferido(), valor: null };
        }

        const nombre = this.avanzar().v;

        // this.prop dentro de una clase
        if (nombre === 'this') {
          if (this.esOp('.')) {
            this.avanzar();
            const campo = this.avanzar().v;
            const claseActual = this.ambito.claseActual;
            if (claseActual && this.clases[claseActual]) {
              const c = this.clases[claseActual].campos[campo];
              if (c) return { tipo: c, valor: null };
            }
            return { tipo: T.inferido(), valor: null };
          }
          return { tipo: T.inferido(), valor: null };
        }

        if (this.esOp('(')) {
          const argumentos = this.argumentosLlamada();
          const fn = this.funciones[nombre];
          if (fn) {
            this.comprobarArgumentos(nombre, fn.ps, argumentos, t.linea);
            return { tipo: fn.d, valor: null };
          }
          const v = this.buscarVariable(nombre);
          if (v && v.tipo && v.tipo.k === 'func') return { tipo: v.tipo.d, valor: null };
          return { tipo: T.inferido(), valor: null };
        }

        // Flecha: (a: number) => a * 2
        if (this.esOp('=>')) {
          this.avanzar();
          return { tipo: T.inferido(), valor: null };
        }

        const v = this.buscarVariable(nombre);
        return { tipo: v ? v.tipo : T.inferido(), valor: null };
      }

      if (this.esOp('(')) {
        this.avanzar();
        const r = this.expresion();
        if (this.esOp(')')) this.avanzar();
        return r;
      }

      if (this.esOp('[')) {
        this.avanzar();
        const tipos = [];
        while (this.t().t !== 'EOF' && !this.esOp(']')) {
          const r = this.expresion();
          if (r.tipo) tipos.push(r.tipo);
          if (this.esOp(',')) { this.avanzar(); continue; }
        }
        if (this.esOp(']')) this.avanzar();
        return { tipo: tipos.length === 1 ? T.arr(tipos[0]) : T.arr(tipos[0] || T.inferido()), valor: null };
      }

      if (this.esOp('{')) {
        this.avanzar();
        const campos = {};
        while (this.t().t !== 'EOF' && !this.esOp('}')) {
          if (this.esOp('...')) {
            this.avanzar();
            this.expresion();
            if (this.esOp(',')) this.avanzar();
            continue;
          }
          let clave;
          if (this.t().t === 'Id' || this.t().t === 'Texto') clave = this.avanzar().v;
          else { this.avanzar(); continue; }

          if (this.esOp(':')) {
            this.avanzar();
            const r = this.expresion();
            if (r.tipo) campos[clave] = r.tipo;
          } else {
            // Atajo: { edad } usa la variable edad
            const v = this.buscarVariable(clave);
            campos[clave] = v ? v.tipo : T.inferido();
          }
          if (this.esOp(',')) this.avanzar();
        }
        if (this.esOp('}')) this.avanzar();
        return { tipo: T.obj(campos), valor: null };
      }

      // Cualquier otra cosa: se salta para no quedarse atascado
      this.avanzar();
      return { tipo: T.inferido(), valor: null };
    }
  }

  function esNumerico(t) {
    if (!t) return false;
    if (t.k === 'prim') return t.n === 'number';
    if (t.k === 'lit') return t.n === 'number';
    return false;
  }

  // ════════════════════════════════════════════════
  // RECORTE
  //
  // Se parte del TEXTO ORIGINAL y se le quitan los trozos marcados. No se
  // reconstruye uniendo tokens: si se hiciera, "let" y "x" quedarían pegados
  // y formarían otra palabra.
  // ════════════════════════════════════════════════

  /**
   * Aplica los recortes y las reservas al código original.
   * Un enum no se borra sino que se sustituye por su equivalente en JavaScript.
   */
  function recortar(src, analizador) {
    const reservas = analizador.reservas || [];
    const todos = analizador.recortes.map(([ini, fin]) => ({ ini, fin, texto: '' }))
      .concat(reservas);

    if (!todos.length) return src;

    todos.sort((a, b) => a.ini - b.ini);

    let salida = '';
    let cursor = 0;

    for (const trozo of todos) {
      if (trozo.ini < cursor) continue;          // ya cubierto por otro
      salida += src.slice(cursor, trozo.ini);
      salida += trozo.texto;
      cursor = Math.max(cursor, trozo.fin);
    }

    salida += src.slice(cursor);
    return salida;
  }

  // ════════════════════════════════════════════════
  // EJECUCIÓN
  // ════════════════════════════════════════════════

  /**
   * Ejecuta un programa TypeScript.
   *
   * Primero se verifican los tipos y solo si todo encaja se ejecuta. Así el
   * alumno ve el error de tipos antes de que nada corra, que es justo lo que
   * aporta TypeScript frente a JavaScript.
   *
   * @returns {{output: string, error: boolean}}
   */
  function ejecutar(src, opciones) {
    const o = opciones || {};
    let js = '';

    try {
      const tokens = tokenizar(src);
      const analizador = new Analizador(tokens).analizar();

      if (analizador.errores.length) {
        const mensajes = analizador.errores.map(e => e.message).join('\n');
        const cuantos = analizador.errores.length;
        const encabezado = cuantos === 1
          ? 'Error de tipos:\n'
          : `Errores de tipos (${cuantos}):\n`;
        return {
          output: encabezado + mensajes + '\n',
          error: true
        };
      }

      js = recortar(src, analizador);
    } catch (err) {
      const mensaje = err instanceof ErrorTs
        ? err.message
        : (err && err.message ? err.message : String(err));
      return { output: 'Error de TypeScript: ' + mensaje + '\n', error: true };
    }

    // A partir de aquí ya es JavaScript y lo ejecuta el motor del navegador
    return ejecutarJs(js, o);
  }

  /** Corre el JavaScript que ha quedado y recoge lo que imprima. */
  function ejecutarJs(js, opciones) {
    const o = opciones || {};
    const registros = [];
    const registro = (...args) => {
      registros.push(args.map(a => {
        if (typeof a === 'string') return a;
        if (a === null) return 'null';
        if (a === undefined) return 'undefined';
        if (typeof a === 'object') {
          try { return JSON.stringify(a); } catch (e) { return String(a); }
        }
        return String(a);
      }).join(' '));
    };

    try {
      const fn = new Function('console', '"use strict";\n' + js);
      fn({ log: registro, info: registro, warn: registro, error: registro });
    } catch (err) {
      return {
        output: 'Error al ejecutar: ' + (err && err.message ? err.message : String(err)) + '\n',
        error: true
      };
    }

    if (o.soloVerificar) {
      return { output: 'ok\n', error: false };
    }

    const salida = registros.length
      ? (registros.join('\n') + '\n')
      : '(el programa no imprime nada)\n';

    return { output: salida, error: false };
  }

  return {
    ejecutar,
    tokenizar,
    ErrorTs,
    T,
    PRIMITIVOS,
    nombreTipo,
    asignable,
    opcionalComo,
    admisibleAusente,
    recortar,
    ejecutarJs,
    Analizador,
    PALABRAS_TS
  };
})();