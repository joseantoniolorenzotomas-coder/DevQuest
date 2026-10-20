// DevQuest Java — Mini intérprete de Java para los ejercicios
//
// No hay JVM en el navegador, así que escribimos un intérprete del
// subconjunto que se enseña en el curso. Mismo criterio que con SQL: puro,
// determinista y sin dependencias, para que las soluciones de los ejercicios
// se puedan ejecutar también en los tests de Node.
//
// Cubre:
//   tipos     int, double, char, boolean, String
//   variables declaración, asignación, shadowing
//   operadores aritméticos, de comparación, lógicos, ++/--, +=, ternario
//   control   if / else if / else, switch, while, do-while, for, break, continue
//   métodos   void y con retorno, parámetros, return
//   arrays    declaración, acceso, length
//   Strings   length(), charAt, substring, indexOf, toUpperCase, toLowerCase,
//             replace, equals, contains, trim, toString, valueOf
//   clase    public class, static void main, campos estáticos
//
// Lo que NO cubre, y por eso el temario no lo usa: herencia, interfaces,
// generics, excepciones, hilos y Streams. Se explican como concepto en los
// últimos módulos, sin ejecutarlos.
//
// Lo que NO cubre (y por tanto el temario no usa): herencia, interfaces,
// generics, excepciones, hilos, Streams y librerías estándar. Seexplain
// en los módulos finales como concepto teórico.
// 'use strict';

window.JAVA_ENGINE = (function () {

  // ════════════════════════════════════════
  // ERRORES
  // ════════════════════════════════════════

  class ErrorJava extends Error {
    constructor(mensaje, linea) {
      super(linea ? `Línea ${linea}: ${mensaje}` : mensaje);
      this.name = 'ErrorJava';
      this.linea = linea || 0;
    }
  }

  // ════════════════════════════════════════
  // LÉXICO
  // ════════════════════════════════════════

  /**
   * Convierte el código en una lista de tokens.
   * @returns {Array<{t: string, v: any, linea: number}>}
   */
  function tokenizar(src) {
    const tokens = [];
    let i = 0;
    let linea = 1;
    const s = String(src == null ? '' : src);

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

      // String
      if (c === '"') {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === '\\') {
            const esc = s[i + 1];
            valor += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === '\\' ? '\\' : esc === '"' ? '"' : esc;
            i += 2;
          } else {
            if (s[i] === '\n') linea++;
            valor += s[i];
            i++;
          }
        }
        i++;
        tokens.push({ t: 'String', v: valor, linea });
        continue;
      }

      // Char
      if (c === "'") {
        let valor = '';
        i++;
        while (i < s.length && s[i] !== "'") {
          if (s[i] === '\\') {
            const esc = s[i + 1];
            valor += esc === 'n' ? '\n' : esc === 't' ? '\t' : esc === '\\' ? '\\' : esc === "'" ? "'" : esc;
            i += 2;
          } else {
            valor += s[i];
            i++;
          }
        }
        i++;
        tokens.push({ t: 'Char', v: valor, linea });
        continue;
      }

      // Número
      if (/[0-9]/.test(c)) {
        let n = '';
        let esDouble = false;
        while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        if (s[i] === '.' && /[0-9]/.test(s[i + 1] || '')) {
          esDouble = true;
          n += s[i]; i++;
          while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
        }
        if (s[i] === 'f' || s[i] === 'F' || s[i] === 'd' || s[i] === 'D' || s[i] === 'L') {
          esDouble = esDouble || s[i] === 'f' || s[i] === 'F' || s[i] === 'd' || s[i] === 'D';
          i++;
        }
        tokens.push({ t: esDouble ? 'Double' : 'Int', v: esDouble ? parseFloat(n) : parseInt(n, 10), linea });
        continue;
      }

      // Identificador / palabra clave
      if (/[A-Za-z_$]/.test(c)) {
        let id = '';
        while (i < s.length && /[A-Za-z0-9_$]/.test(s[i])) { id += s[i]; i++; }
        tokens.push({ t: 'Id', v: id, linea });
        continue;
      }

      // Operadores (de más largo a más corto)
      const ops3 = ['>>>=', '<<=', '>>=', '...'];
      const ops2 = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '->', '::', '<<', '>>'];
      const dos = s.slice(i, i + 2);
      if (ops3.includes(s.slice(i, i + 3))) { tokens.push({ t: 'Op', v: s.slice(i, i + 3), linea }); i += 3; continue; }
      if (ops2.includes(dos)) { tokens.push({ t: 'Op', v: dos, linea }); i += 2; continue; }

      if ('+-*/%=<>!&|^~?:;,.()[]{}'.includes(c)) {
        tokens.push({ t: 'Op', v: c, linea });
        i++;
        continue;
      }

      throw new ErrorJava(`carácter inesperado "${c}"`, linea);
    }

    tokens.push({ t: 'EOF', v: null, linea });
    return tokens;
  }

  // ════════════════════════════════════════
  // ANALIZADOR
  // ════════════════════════════════════════

  function Analizador(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  Analizador.prototype = {
    peek(n = 0) { return this.tokens[this.pos + n]; },
    actual() { return this.tokens[this.pos]; },
    linea() { return this.actual().linea; },

    es(valor) {
      const t = this.actual();
      return (t.t === 'Op' || t.t === 'Id') && t.v === valor;
    },

    esPalabra(p) {
      const t = this.actual();
      return t.t === 'Id' && t.v === p;
    },

    come() { return this.tokens[this.pos++]; },

    espera(valor) {
      if (!this.es(valor)) {
        throw new ErrorJava(`se esperaba "${valor}" pero se encontró "${this.actual().v}"`, this.linea());
      }
      return this.come();
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
      while (this.es('||')) {
        this.come();
        const der = this.yLogico();
        izq = { t: 'or', izq, der };
      }
      return izq;
    },

    yLogico() {
      let izq = this.igualdad();
      while (this.es('&&')) {
        this.come();
        const der = this.igualdad();
        izq = { t: 'and', izq, der };
      }
      return izq;
    },

    igualdad() {
      let izq = this.relacional();
      while (this.es('==') || this.es('!=')) {
        const op = this.come().v;
        const der = this.relacional();
        izq = { t: 'bin', op, izq, der };
      }
      return izq;
    },

    relacional() {
      let izq = this.adicion();
      while (this.es('<') || this.es('>') || this.es('<=') || this.es('>=')) {
        const op = this.come().v;
        const der = this.adicion();
        izq = { t: 'bin', op, izq, der };
      }
      return izq;
    },

    adicion() {
      let izq = this.multiplicacion();
      while (this.es('+') || this.es('-')) {
        const op = this.come().v;
        const der = this.multiplicacion();
        izq = { t: 'bin', op, izq, der };
      }
      return izq;
    },

    multiplicacion() {
      let izq = this.unario();
      while (this.es('*') || this.es('/') || this.es('%')) {
        const op = this.come().v;
        const der = this.unario();
        izq = { t: 'bin', op, izq, der };
      }
      return izq;
    },

    unario() {
      if (this.es('!')) { this.come(); return { t: 'not', exp: this.unario() }; }
      if (this.es('-')) { this.come(); return { t: 'unario', op: '-', exp: this.unario() }; }
      if (this.es('+')) { this.come(); return this.unario(); }
      if (this.es('++')) { this.come(); return { t: 'preinc', exp: this.unario() }; }
      if (this.es('--')) { this.come(); return { t: 'preinc', exp: this.unario(), resta: true }; }
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

      if (t.t === 'Int') { this.come(); return { t: 'lit', v: t.v, tipo: 'int' }; }
      if (t.t === 'Double') { this.come(); return { t: 'lit', v: t.v, tipo: 'double' }; }
      if (t.t === 'String') { this.come(); return { t: 'lit', v: t.v, tipo: 'String' }; }
      if (t.t === 'Char') { this.come(); return { t: 'lit', v: t.v, tipo: 'char' }; }

      if (this.es('(')) {
        // Casting: (double) a, (int) b
        const sig = this.peek(1);
        const esCast = sig.t === 'Id'
          && ['int', 'double', 'float', 'long', 'short', 'byte', 'char'].includes(sig.v);
        if (esCast) {
          this.come();                  // (
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
        // true / false / null
        if (t.v === 'true') { this.come(); return { t: 'lit', v: true, tipo: 'boolean' }; }
        if (t.v === 'false') { this.come(); return { t: 'lit', v: false, tipo: 'boolean' }; }
        if (t.v === 'null') { this.come(); return { t: 'lit', v: null, tipo: 'null' }; }

        // new String[] / new int[]
        if (t.v === 'new') {
          this.come();
          const tipo = this.come().v;
          if (this.es('[')) {
            this.come();
            let tam = null;
            if (!this.es(']')) tam = this.expresion();
            this.espera(']');
            return { t: 'newArray', tipo, tam };
          }
          // new Libro("Dune", 1965)
          // argumentos() ya consume los paréntesis, así que no se emiten antes
          const args = this.argumentos();
          return { t: 'new', tipo, args };
        }

        this.come();
        // this
        if (t.v === 'this') return this.cadenaMiembros({ t: 'this' });

        // nombre[expr]
        if (this.es('[')) {
          this.come();
          const idx = this.expresion();
          this.espera(']');
          return { t: 'accesoArray', nombre: t.v, idx };
        }

        // llamada: nombre(...)
        if (this.es('(')) {
          const args = this.argumentos();
          return { t: 'llamada', nombre: t.v, args };
        }

        // Encadenado de miembros: Math.max(...), s.length(), s.substring(0,4)
        return this.cadenaMiembros({ t: 'nombre', v: t.v });
      }

      throw new ErrorJava(`no se esperaba "${t.v === null ? 'fin de código' : t.v}"`, t.linea);
    },

    /**
     * Lee la cadena de puntos que sigue a una expresión:
     * .length, .substring(0, 4), Math.max(...). Se puede encadenar cuanto
     * se quiera, y funciona igual partiendo de this o de un nombre.
     */
    cadenaMiembros(expr) {
      while (this.es('.')) {
        this.come();
        const prop = this.actual();
        if (prop.t !== 'Id') break;
        this.come();
        if (this.es('(')) {
          const args = this.argumentos();
          expr = { t: 'llamadaMiembro', obj: expr, nombre: prop.v, args, linea: prop.linea };
        } else {
          expr = { t: 'miembro', obj: expr, nombre: prop.v, linea: prop.linea };
        }
      }
      return expr;
    },

    argumentos() {
      this.espera('(');
      const args = [];
      if (!this.es(')')) {
        args.push(this.expresion());
        while (this.es(',')) { this.come(); args.push(this.expresion()); }
      }
      this.espera(')');
      return args;
    },

    // ── Sentencias ──

    /** Lee sentencias sueltas hasta el final (cuando no hay clase). */
    sentenciasSueltas() {
      const lista = [];
      while (this.actual().t !== 'EOF') {
        if (this.es('}')) { this.come(); continue; }
        lista.push(this.sentencia());
      }
      return lista;
    },

    bloque() {
      this.espera('{');
      const sent = [];
      while (!this.es('}')) {
        if (this.actual().t === 'EOF') throw new ErrorJava('falta cerrar una llave {', this.linea());
        sent.push(this.sentencia());
      }
      this.espera('}');
      return { t: 'bloque', sent };
    },

    sentencia() {
      const t = this.actual();
      const linea = t.linea;

      // Sentencias terminadas en ;
      if (this.es(';')) { this.come(); return { t: 'vacia' }; }

      if (this.es('{')) return this.bloque();

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
        const cuerpo = this.sentencia();
        return { t: 'while', cond, cuerpo, linea };
      }

      if (this.esPalabra('do')) {
        this.come();
        const cuerpo = this.sentencia();
        if (!this.esPalabra('while')) throw new ErrorJava('do necesita while', linea);
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
        // for (int i = 0; i < n; i++)  |  for (;;)  |  for (x : arr)
        let init = null;
        let cond = null;
        let paso = null;

        if (!this.es(';')) {
          // El for-each se detecta ANTES que una declaración normal, porque
          // "for (String f : frutas)" también empieza por un tipo
          const guardado = this.pos;
          const tipo = this.tipoSimple();
          if (tipo && this.actual().t === 'Id' && this.peek(1).v === ':') {
            const nombre = this.come().v;
            this.come(); // :
            const arr = this.expresion();
            this.espera(')');
            return { t: 'forEach', tipo, nombre, arr, cuerpo: this.bucleCuerpo(), linea };
          }
          this.pos = guardado;

          if (this.esPalabra('int') || this.esPalabra('double') || this.esPalabra('var')
            || this.esPalabra('String') || this.esPalabra('char') || this.esPalabra('boolean')
            || this.esPalabra('long') || this.esPalabra('float')) {
            init = this.declaracionLocal();
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

        const cuerpo = this.bucleCuerpo();
        return { t: 'for', init, cond, paso, cuerpo, linea };
      }

      if (this.esPalabra('return')) {
        this.come();
        if (this.es(';')) { this.come(); return { t: 'return', exp: null, linea }; }
        const exp = this.expresion();
        this.espera(';');
        return { t: 'return', exp, linea };
      }

      if (this.esPalabra('break')) {
        this.come();
        this.espera(';');
        return { t: 'break', linea };
      }

      if (this.esPalabra('continue')) {
        this.come();
        this.espera(';');
        return { t: 'continue', linea };
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
            const cuerpo = [];
            while (!this.es('}') && !this.esPalabra('case') && !this.esPalabra('default')) {
              cuerpo.push(this.sentencia());
            }
            casos.push({ valor: val, cuerpo });
          } else if (this.esPalabra('default')) {
            this.come();
            this.espera(':');
            const cuerpo = [];
            while (!this.es('}') && !this.esPalabra('case') && !this.esPalabra('default')) {
              cuerpo.push(this.sentencia());
            }
            casos.push({ valor: null, cuerpo });
          } else {
            throw new ErrorJava('dentro de switch solo caben case y default', this.linea());
          }
        }
        this.espera('}');
        return { t: 'switch', disc, casos, linea };
      }

      // System.out.println(...) y System.out.print(...)
      if (t.t === 'Id' && t.v === 'System') {
        const guardado = this.pos;
        this.come();
        if (this.es('.') && this.peek(1).v === 'out') {
          this.come();
          this.come();
          if (this.es('.') && (this.peek(1).v === 'println' || this.peek(1).v === 'print')) {
            this.come();                          // el punto
            const salto = this.come().v === 'println';
            const args = this.argumentos();
            this.espera(';');
            return { t: 'println', args, saltoLinea: salto, linea };
          }
        }
        this.pos = guardado;
      }

      // Declaración de variable o sentencia de expresión
      const tipo = this.tipoSimple();
      if (tipo && this.actual().t === 'Id') {
        const decl = this.declaracionLocal(tipo);
        this.espera(';');
        return decl;
      }

      const exp = this.expresion();
      // Asignación compuesta: x += 1, x -= 2, x *= 3, x /= 4, x %= 5
      if (['+=', '-=', '*=', '/=', '%='].includes(this.actual().v)
        && this.actual().t === 'Op') {
        const op = this.come().v;
        const der = this.expresion();
        this.espera(';');
        return { t: 'asigCompuesta', op, izq: exp, der, linea };
      }

      // "Perro p = new Perro();" sin declarar la clase: el fallo más normal al
      // empezar con objetos. Se avisa de la clase, no de un carácteranquísimo.
      if (exp.t === 'nombre' && /^[A-Z]/.test(exp.v) && this.actual().t === 'Id') {
        throw new ErrorJava(
          `no se encuentra la clase "${exp.v}". ¿La has declarado antes con "class ${exp.v} { ... }"?`,
          linea
        );
      }

      // Asignación simple: x = 5, nums[0] = 7, libro.titulo = "Dune"
      if (this.es('=')) {
        this.come();
        const der = this.expresion();
        this.espera(';');
        return { t: 'asigna', izq: exp, der, linea };
      }

      this.espera(';');
      return { t: 'expr', exp, linea };
    },

    // El cuerpo de un bucle puede ser un bloque o una sola sentencia
    bucleCuerpo() {
      if (this.es('{')) return this.bloque();
      return { t: 'bloque', sent: [this.sentencia()] };
    },

    tipoSimple() {
      const t = this.actual();
      // 'void' hace falta aquí: es el tipo de retorno de los métodos
      const tipos = ['void', 'int', 'double', 'float', 'long', 'short', 'byte', 'char', 'boolean', 'String', 'var'];
      // Un tipo puede ser también una clase escrita en el mismo fichero:
      // Libro l = new Libro();  →  "Libro" debe leerse como tipo
      const esClasePropia = t.t === 'Id'
        && this.clasesConocidas && this.clasesConocidas.has(t.v);
      if (t.t === 'Id' && (tipos.includes(t.v) || esClasePropia)) {
        this.come();
        // arrays: int[] nombre
        if (this.es('[') && this.peek(1).v === ']') {
          this.come(); this.come();
          return t.v + '[]';
        }
        return t.v;
      }
      return null;
    },

    declaracionLocal(tipoForzado) {
      const tipo = tipoForzado || this.tipoSimple();
      const nombres = [];
      let primera = null;

      do {
        const id = this.actual();
        if (id.t !== 'Id') throw new ErrorJava('falta el nombre de la variable', id.linea);
        this.come();

        let ini = null;
        let valores = null;

        if (this.es('=')) {
          this.come();
          // int[] nums = {4, 8, 15}
          if (this.es('{')) {
            this.come();
            valores = [];
            if (!this.es('}')) {
              do { valores.push(this.expresion()); } while (this.es(',') && (this.come(), true));
            }
            this.espera('}');
          } else {
            ini = this.expresion();
          }
        } else if (this.es('{')) {
          // String[] nombres = {"a", "b"} sin tipo de array explícito
          this.come();
          valores = [];
          if (!this.es('}')) {
            do { valores.push(this.expresion()); } while (this.es(',') && (this.come(), true));
          }
          this.espera('}');
        }

        nombres.push({ nombre: id.v, valor: ini, valores });
        if (!primera) primera = { nombre: id.v, valor: ini, valores, tipo, linea: id.linea };
      } while (this.es(',') && (this.come(), true));

      return { t: 'decl', tipo, nombres, primera, linea: this.linea() };
    }
  };

  // ════════════════════════════════════════
  // CONSTRUCCIÓN DEL ÁRBOL
  // ════════════════════════════════════════

  /**
   * Quita las clases/métodos que el temario aún no usa y deja solo main
   * (o el primer método estático si no hay main), con el cuerpo plano.
   * Así el intérprete no tiene que resolver anidamiento de clases.
   */
  /**
   * Lee el código y devuelve TODAS las clases del fichero.
   * Antes solo se quedaba con la primera, así que las clases auxiliares
   * (Libro, Producto, Temperatura) no existían para el intérprete.
   */
  function construirArbol(src) {
    const tokens = tokenizar(src);

    // Prescan: qué nombres de clase hay en el fichero. El analizador lo
    // necesita para leer "Libro l = new Libro();" como una declaración.
    const clasesConocidas = new Set();
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i].t === 'Id' && tokens[i].v === 'class' && tokens[i + 1].t === 'Id') {
        clasesConocidas.add(tokens[i + 1].v);
      }
    }

    const a = new Analizador(tokens);
    a.clasesConocidas = clasesConocidas;

    const clases = [];

    while (a.actual().t !== 'EOF') {
      if (!a.esPalabra('class')) { a.come(); continue; }

      a.come();
      const nombreClase = a.actual().v;
      a.come();
      // extends / implements / lo que venga: se ignora, no se enseña aún
      while (!a.es('{') && a.actual().t !== 'EOF') a.come();
      a.espera('{');

      const metodos = [];
      const campos = [];
      let constructor = null;

      while (!a.es('}') && a.actual().t !== 'EOF') {
        // public / private / protected / static / final / abstract
        let esEstatico = false;
        while (a.actual().t === 'Id'
          && ['public', 'private', 'protected', 'static', 'final', 'abstract', 'default'].includes(a.actual().v)) {
          if (a.actual().v === 'static') esEstatico = true;
          a.come();
        }

        // Constructor: el nombre de la clase seguido de ( y sin tipo antes
        if (a.actual().t === 'Id' && a.actual().v === nombreClase && a.peek(1).v === '(') {
          a.come();                          // el nombre de la clase
          const params = leerParams(a);
          const cuerpo = a.bloque();
          constructor = { params, cuerpo, linea: a.linea() };
          continue;
        }

        const tipo = a.tipoSimple();
        if (!tipo) { a.come(); continue; }

        // nombre del método o del campo
        const nombreTok = a.actual();
        if (nombreTok.t !== 'Id') { a.come(); continue; }
        a.come();

        if (a.es('(')) {
          const params = leerParams(a);
          const cuerpo = a.bloque();
          metodos.push({
            nombre: nombreTok.v, tipo, estatico: esEstatico, params, cuerpo, linea: nombreTok.linea
          });
        } else {
          // Campo: pueden declararse varios separados por comas.
          // El primero ya está leído (nombreTok); los siguientes, aquí.
          const anadirCampo = (n) => {
            let valor = null;
            if (a.es('=')) { a.come(); valor = a.expresion(); }
            campos.push({ tipo, nombre: n, valor, estatico: esEstatico });
          };
          anadirCampo(nombreTok.v);
          while (a.es(',')) {
            a.come();
            anadirCampo(a.actual().v);
            a.come();
          }
          a.espera(';');
        }
      }
      a.espera('}');

      clases.push({ nombre: nombreClase, metodos, campos, constructor });
    }

    // Sin ninguna "class", todo el código es el cuerpo de main. Así el alumno
    // puede escribir solo las sentencias, sin el armazón de la clase.
    if (!clases.length) {
      const b = new Analizador(tokens);
      b.clasesConocidas = clasesConocidas;
      clases.push({
        nombre: 'Main',
        campos: [],
        constructor: null,
        metodos: [{
          nombre: 'main', tipo: 'void', estatico: true, params: [],
          cuerpo: { t: 'bloque', sent: b.sentenciasSueltas() }, linea: 1
        }]
      });
    }

    return { clases };
  }

  /** Lee la lista de parámetros de un método o constructor. */
  function leerParams(a) {
    const params = [];
    a.espera('(');
    if (!a.es(')')) {
      do {
        const pTipo = a.tipoSimple();
        const pNombre = a.actual().v;
        a.come();
        params.push({ tipo: pTipo, nombre: pNombre });
      } while (a.es(',') && (a.come(), true));
    }
    a.espera(')');
    return params;
  }

  // ════════════════════════════════════════
  // VALORES EN TIEMPO DE EJECUCIÓN
  // ════════════════════════════════════════

  /** Un valor recuerda su tipo de Java, que es lo que cambia los operadores. */
  function V(valor, tipo) {
    return { valor, tipo: tipo || inferirTipo(valor) };
  }

  function inferirTipo(v) {
    if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double';
    if (typeof v === 'string') return 'String';
    if (typeof v === 'boolean') return 'boolean';
    return 'Object';
  }

  /** El valor que tiene un campo recién creado, según su tipo declarado. */
  function valorPorDefecto(tipo) {
    if (!tipo) return V(0, 'int');
    if (tipo.endsWith('[]')) return V([], tipo);
    if (tipo === 'boolean') return V(false, 'boolean');
    if (tipo === 'double' || tipo === 'float') return V(0, 'double');
    if (tipo === 'char') return V('\u0000', 'char');
    if (tipo === 'String') return V('', 'String');
    return V(0, tipo);
  }

  /** ¿Es un valor de tipo objeto creado con new? */
  const esObjeto = (v) => !!(v && v.valor && v.valor.__obj === true);

  const esTexto = (v) => v && v.tipo === 'String';

  function esIgual(a, b) {
    // == entre String compara el contenido, como hace Java
    if (a.tipo === 'String' || b.tipo === 'String') {
      return String(a.valor) === String(b.valor);
    }
    if (a.valor === null || b.valor === null) return a.valor === b.valor;
    return a.valor === b.valor;
  }

  // ════════════════════════════════════════
  // STRING.valueOf — el pegamento más importante
  // ════════════════════════════════════════
  function aTexto(v) {
    // Acepta un valor pelado o un V de ejecución { valor, tipo }
    const esV = v && typeof v === 'object' && 'valor' in v;
    const x = esV ? v.valor : v;
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'boolean') return x ? 'true' : 'false';
    if (typeof x === 'string') return x;
    if (typeof x === 'number') {
      // En Java un double siempre lleva decimales: 5.0, no 5
      if (Number.isInteger(x) && esV && v.tipo === 'double') return x.toFixed(1);
      return String(x);
    }
    return String(x);
  }

  // ════════════════════════════════════════
  // MÉTODOS DE STRING (subconjunto que se enseña)
  // ════════════════════════════════════════
  const METODOS_STRING = {
    length: (s) => s.length,
    charAt: (s, a) => (a < 0 || a >= s.length ? '\u0000' : s[a]),
    substring: (s, a, b) => {
      const ini = a;
      const fin = b === undefined ? s.length : b;
      if (ini < 0 || fin > s.length || ini > fin) throw new ErrorJava('String.substring fuera de rango');
      return s.slice(ini, fin);
    },
    indexOf: (s, a) => s.indexOf(aTexto(a)),
    lastIndexOf: (s, a) => s.lastIndexOf(aTexto(a)),
    toUpperCase: (s) => s.toUpperCase(),
    toLowerCase: (s) => s.toLowerCase(),
    trim: (s) => s.trim(),
    replace: (s, a, b) => s.split(aTexto(a)).join(aTexto(b)),
    contains: (s, a) => (s.includes(aTexto(a)) ? 'true' : 'false'),
    equals: (s, a) => (s === aTexto(a) ? 'true' : 'false'),
    equalsIgnoreCase: (s, a) => (s.toLowerCase() === aTexto(a).toLowerCase() ? 'true' : 'false'),
    isEmpty: (s) => (s.length === 0 ? 'true' : 'false'),
    startsWith: (s, a) => (s.startsWith(aTexto(a)) ? 'true' : 'false'),
    endsWith: (s, a) => (s.endsWith(aTexto(a)) ? 'true' : 'false'),
    concat: (s, a) => s + aTexto(a),
    charAtInt: null,
    split: null,
    repeat: (s, a) => s.repeat(Math.max(0, Number(a))),
    toString: (s) => s
  };

  // ════════════════════════════════════════
  // EJECUCIÓN
  // ════════════════════════════════════════

  class Ejecutor {
    constructor(arbol, opciones) {
      this.arbol = arbol;
      this.clases = arbol.clases || [];
      // La clase que contiene main: sus campos y métodos estáticos son los
      // que se pueden usar sin crear objetos
      this.principal = this.clases.find(c => c.metodos.some(m => m.nombre === 'main')) || this.clases[0];
      this.salida = [];
      this.pendiente = '';          // texto impreso con print sin cerrar línea
      this.ambito = new Map();
      this.metodoActual = null;
      this.objetoActual = null;
      this.limitePasos = (opciones && opciones.limitePasos) || 2_000_000;
      this.pasos = 0;
      // Indice a partir del cual se pueden ver variables. Sube al entrar en un
      // metodo: sus locales no se ven desde fuera.
      this.baseAmbito = 0;
      this.estaticos = new Map();
    }

    error(msg, linea) { throw new ErrorJava(msg, linea); }

    // ── Clases y objetos ──

    buscarClase(nombre) {
      return this.clases.find(c => c.nombre === nombre) || null;
    }

    /** Crea un objeto con sus campos puestos a los valores por defecto de Java. */
    crearObjeto(clase, linea) {
      const campos = new Map();
      for (const c of clase.campos) {
        campos.set(c.nombre, valorPorDefecto(c.tipo));
      }
      return V({ __obj: true, clase, campos }, clase.nombre);
    }

    // ── Ámbitos ──

    entra() { this.ambito.set(this.ambito.size, new Map()); }
    sale() { this.ambito.delete(this.ambito.size - 1); }

    /**
     * Busca un nombre, empezando por el ámbito más interno.
     *
     * base = 0 marca el ámbito global (los campos estáticos). Los métodos se
     * ejecutan con base = 1 porque sus variables locales no son visibles desde
     * main ni desde otros métodos: en Java no hay globales, y eso se nota.
     */
    buscar(nombre) {
      for (let i = this.ambito.size - 1; i >= this.baseAmbito; i--) {
        const m = this.ambito.get(i);
        if (m && m.has(nombre)) return m.get(nombre);
      }

      // Los campos estaticos si son globales: los ve cualquier metodo
      if (this.estaticos.has(nombre)) return this.estaticos.get(nombre);

      // Metodos estaticos, para poder comprobarlos al invocarlos
      const metodo = ((this.principal && this.principal.metodos) || []).find(m => m.nombre === nombre);
      if (metodo) return V({ __metodo: metodo }, 'Metodo');
      return undefined;
    }

    definir(nombre, valor) {
      this.ambito.get(this.ambito.size - 1).set(nombre, valor);
    }

    asignar(nombre, valor) {
      for (let i = this.ambito.size - 1; i >= this.baseAmbito; i--) {
        const m = this.ambito.get(i);
        if (m && m.has(nombre)) { m.set(nombre, valor); return; }
      }
      if (this.estaticos.has(nombre)) { this.estaticos.set(nombre, valor); return; }
      this.error(this._motivoSinVariable(nombre));
    }

    /**
     * El fallo más común al empezar es declarar una variable dentro de unas
     * llaves y usarla fuera. No basta con decir "no existe": lo que hay que
     * explicar es que en Java las llaves crean un ámbito propio.
     */
    _motivoSinVariable(nombre) {
      if (this._declaradaEnBloqueCerrado(nombre)) {
        return `la variable "${nombre}" no existe aquí. La declaraste dentro de unas llaves `
          + '(la de un if o de un bucle) y esas llaves son un ámbito propio: al cerrarse, '
          + `la variable desaparece. Declárala antes, para que dure todo el programa.`;
      }
      return `la variable "${nombre}" no existe o no está declarada`;
    }

    /**
     * Busca una declaración del mismo nombre en el método. Si está en un
     * bloque anidado, casi siempre es el error de ámbito.
     */
    _declaradaEnBloqueCerrado(nombre) {
      const raiz = this.metodoActual && this.metodoActual.cuerpo;
      if (!raiz) return false;
      let vista = false;

      const recorre = (sent) => {
        for (const s of sent || []) {
          if (vista) return;
          if (s.t === 'decl' && (s.nombres || []).some(n => n.nombre === nombre)) {
            vista = true;
            return;
          }
          if (s.t === 'forEach') {
            // Su variable sí se declara dentro del bucle, a propósito
            if (s.nombre !== nombre) recorre([{ t: 'bloque', sent: (s.cuerpo && s.cuerpo.sent) || [] }]);
            return;
          }
          if (s.t === 'for' && s.init && s.init.t === 'decl') {
            if ((s.init.nombres || []).some(n => n.nombre === nombre)) { vista = true; return; }
          }
          if (s.t === 'for' && s.init && s.init.t !== 'decl') {
            // el cuerpo es un ámbito propio
            if (s.init.exp && s.init.exp.t === 'llamada') return;
            recorre((s.cuerpo && s.cuerpo.sent) || []);
            return;
          }
          if (s.entonces) recorre(s.entonces.sent);
          if (s.siNo) recorre(s.siNo.sent);
          if (s.cuerpo) recorre(s.cuerpo.sent);
          if (Array.isArray(s.casos)) {
            for (const c of s.casos) {
              // El cuerpo de un case también es un ámbito propio
              if (c.cuerpo.some(x => x.t === 'decl' && (x.nombres || []).some(n => n.nombre === nombre))) {
                vista = true;
                return;
              }
            }
          }
        }
      };

      recorre(raiz.sent);
      return vista;
    }

    // ── Expresiones ──

    ev(e) {
      this.pasos++;
      if (this.pasos > this.limitePasos) {
        throw new ErrorJava('el programa no termina (¿bucle infinito?). Revisa las condiciones.');
      }

      switch (e.t) {
        case 'lit': return V(e.v, e.tipo);

        case 'paren': return this.ev(e.exp);

        case 'cast': {
          const v = this.ev(e.exp);
          if (e.tipo === 'String') return V(aTexto(v.valor), 'String');
          if (e.tipo === 'char') return V(aTexto(v.valor).charAt(0), 'char');
          const n = Number(v.valor);
          // double no trunca: por eso (double) 7/2 da 3.5
          return V(e.tipo === 'double' ? n : Math.trunc(n), e.tipo === 'double' ? 'double' : 'int');
        }

        // this es el objeto cuyo método se está ejecutando ahora mismo
        case 'this': {
          if (!this.objetoActual) {
            this.error('"this" solo tiene sentido dentro de un método de un objeto', e.linea);
          }
          return this.objetoActual;
        }

        // new Libro("Dune", 1965): crea el objeto y ejecuta su constructor
        case 'new': {
          const clase = this.buscarClase(e.tipo);
          if (!clase) {
            this.error(`la clase "${e.tipo}" no está definida en este fichero`, e.linea);
          }
          const objeto = this.crearObjeto(clase, e.linea);

          if (clase.constructor) {
            const args = e.args.map(a => this.ev(a));
            const ctor = clase.constructor;
            if (args.length !== ctor.params.length) {
              this.error(
                `el constructor de "${clase.nombre}" espera ${ctor.params.length} argumento(s) y le has dado ${args.length}`,
                e.linea
              );
            }
            const previo = this.objetoActual;
            this.objetoActual = objeto;
            const previoBase = this.baseAmbito;
            this.baseAmbito = this.ambito.size;
            this.entra();
            ctor.params.forEach((p, i) => this.definir(p.nombre, args[i]));
            try {
              this.ejecutar(ctor.cuerpo);
            } catch (err) {
              if (!err || !err.__return) throw err;
            } finally {
              this.sale();
              this.baseAmbito = previoBase;
              this.objetoActual = previo;
            }
          }
          return objeto;
        }

        case 'nombre': {
          const v = this.buscar(e.v);
          if (v === undefined) {
            // Constantes y clases del propio lenguaje
            const consts = { 'Integer.MAX_VALUE': 2147483647, 'Integer.MIN_VALUE': -2147483648 };
            if (e.v in consts) return V(consts[e.v], 'int');
            if (e.v === 'Math' || e.v === 'System' || e.v === 'String') {
              return V({ clase: e.v }, 'Clase');
            }
            // Una clase escrita en el mismo fichero
            if (this.buscarClase(e.v)) return V({ clase: e.v }, 'Clase');
            // Reading a name that was declared inside braces also goes through
            // here, so it explains scope instead of just "not declared"
            this.error(this._motivoSinVariable(e.v), e.linea);
          }
          return v;
        }

        case 'ternario':
          return this.truthy(this.ev(e.cond)) ? this.ev(e.entonces) : this.ev(e.siNo);

        case 'not':
          return V(!this.truthy(this.ev(e.exp)), 'boolean');

        case 'unario': {
          // El menos unario: -7
          const v = this.ev(e.exp);
          const r = -Number(v.valor);
          return V(Number.isInteger(r) ? r : r, v.tipo === 'double' ? 'double' : 'int');
        }

        case 'and': return V(this.truthy(this.ev(e.izq)) && this.truthy(this.ev(e.der)), 'boolean');
        case 'or': return V(this.truthy(this.ev(e.izq)) || this.truthy(this.ev(e.der)), 'boolean');

        case 'preinc': {
          const actual = this.ev(e.exp);
          const nuevo = V(actual.valor + (e.resta ? -1 : 1), actual.tipo);
          this.escribirEn(e.exp, nuevo);
          return nuevo;
        }

        case 'postinc': {
          const anterior = this.ev(e.exp);
          const nuevo = V(anterior.valor + (e.op === '++' ? 1 : -1), anterior.tipo);
          this.escribirEn(e.exp, nuevo);
          return anterior;   // postfijo devuelve el valor viejo
        }

        case 'accesoArray': {
          const arr = this.ev({ t: 'nombre', v: e.nombre });
          const i = Math.trunc(Number(this.ev(e.idx).valor));
          if (!arr || !Array.isArray(arr.valor)) this.error(`"${e.nombre}" no es un array`, e.linea);
          if (i < 0 || i >= arr.valor.length) {
            this.error(`índice ${i} fuera de rango (el array tiene ${arr.valor.length} elementos)`, e.linea);
          }
          // El elemento hereda el tipo declarado del array (nums[] → int)
          const tipoElem = arr.tipo && arr.tipo.endsWith('[]')
            ? arr.tipo.slice(0, -2)
            : 'Object';
          return V(arr.valor[i], tipoElem);
        }

        case 'newArray': {
          const n = e.tam ? Math.trunc(Number(this.ev(e.tam).valor)) : 0;
          if (n < 0) this.error('el tamaño del array no puede ser negativo', e.linea);
          const tipoElem = e.tipo.replace('[]', '');
          // Relleno por defecto de Java: 0 en los números, "" en los textos
          const relleno = tipoElem === 'String' ? '' : (tipoElem === 'boolean' ? false : 0);
          const vals = new Array(n).fill(relleno);
          return V(vals, e.tipo);
        }

        case 'miembro': {
          // arr.length
          if (e.obj.t === 'nombre' && e.nombre === 'length') {
            const arr = this.buscar(e.obj.v);
            if (arr && Array.isArray(arr.valor)) return V(arr.valor.length, 'int');
          }
          const obj = this.ev(e.obj);
          if (esObjeto(obj)) {
            const campos = obj.valor.campos;
            if (!campos.has(e.nombre)) {
              const nombres = [...campos.keys()];
              this.error(
                `la clase ${obj.valor.clase.nombre} no tiene el campo "${e.nombre}". `
                + (nombres.length ? `Sus campos son: ${nombres.join(', ')}.` : 'No tiene campos declarados.'),
                e.linea
              );
            }
            return campos.get(e.nombre);
          }
          if (obj && obj.tipo === 'Clase') {
            this.error('no se puede leer "' + e.nombre + '" de la clase ' + obj.valor.clase, e.linea);
          }
          this.error(
            `el campo "${e.nombre}" no existe en ${obj && obj.tipo ? obj.tipo : 'este valor'}`, e.linea
          );
        }
        // falls through
        case 'llamadaMiembro': return this.llamarMiembro(e);

        case 'llamada': return this.llamar(e);

        case 'bin': return this.binario(e);

        default:
          this.error('expresión no soportada: ' + e.t, e.linea);
      }
    }

    escribirEn(exp, valor) {
      if (exp.t === 'nombre') { this.asignar(exp.v, valor); return; }

      // nums[0] = 7
      if (exp.t === 'accesoArray') {
        const arr = this.ev({ t: 'nombre', v: exp.nombre });
        const i = Math.trunc(Number(this.ev(exp.idx).valor));
        if (!arr || !Array.isArray(arr.valor)) this.error(`"${exp.nombre}" no es un array`, exp.linea);
        if (i < 0 || i >= arr.valor.length) {
          this.error(`índice ${i} fuera de rango (el array tiene ${arr.valor.length} elementos)`, exp.linea);
        }
        // El array guarda valores pelados y el tipo se recupera al leer, igual
        // que hace new int[n]. Guardar aquí el envoltorio V los mezclaría.
        arr.valor[i] = valor.valor;
        return;
      }

      // libro.titulo = "Dune"
      if (exp.t === 'miembro') {
        const obj = this.ev(exp.obj);
        if (esObjeto(obj)) {
          if (!obj.valor.campos.has(exp.nombre)) {
            this.error(
              `la clase ${obj.valor.clase.nombre} no tiene el campo "${exp.nombre}"`, exp.linea
            );
          }
          obj.valor.campos.set(exp.nombre, valor);
          return;
        }
        this.error(`no se puede asignar a "${exp.nombre}" porque no es un objeto`, exp.linea);
      }
    }

    binario(e) {
      const izq = this.ev(e.izq);
      const der = this.ev(e.der);
      const op = e.op;

      // + con String concatena
      if (op === '+' && (esTexto(izq) || esTexto(der))) {
        return V(aTexto(izq) + aTexto(der), 'String');
      }

      const a = izq.valor;
      const b = der.valor;

      switch (op) {
        case '+': return V(a + b, ambosEnteros(izq, der) ? 'int' : 'double');
        case '-': return V(a - b, ambosEnteros(izq, der) ? 'int' : 'double');
        case '*': return V(a * b, ambosEnteros(izq, der) ? 'int' : 'double');
        case '/':
          if (b === 0) this.error('división por cero');
          // división entera en Java
          return ambosEnteros(izq, der)
            ? V(Math.trunc(a / b), 'int')
            : V(a / b, 'double');
        case '%':
          if (b === 0) this.error('módulo por cero');
          return V(a % b, 'int');
        case '==': return V(esIgual(izq, der), 'boolean');
        case '!=': return V(!esIgual(izq, der), 'boolean');
        case '<': return V(comparar(izq, der) < 0, 'boolean');
        case '<=': return V(comparar(izq, der) <= 0, 'boolean');
        case '>': return V(comparar(izq, der) > 0, 'boolean');
        case '>=': return V(comparar(izq, der) >= 0, 'boolean');
        default: this.error('operador no soportado: ' + op);
      }
    }

    /** Math.max(...), Integer.parseInt(...), String.valueOf(...) */
    llamarMiembro(e) {
      const clase = e.obj.t === 'nombre' ? e.obj.v : null;

      if (clase === 'Math') return this.staticMath(e);
      if (clase === 'Integer' || clase === 'Double') return this.metodoDeClaseNumerica(clase, e);
      if (clase === 'String') return this.metodoDeClaseString(e);

      // Método sobre un valor: un objeto con sus propios métodos, o un String
      const receptor = this.ev(e.obj);

      // Método de instancia: libro.getTitulo()
      if (esObjeto(receptor)) {
        const metodoObj = receptor.valor.clase.metodos.find(m => m.nombre === e.nombre);
        if (metodoObj) return this.invocar(metodoObj, e.args, e.linea, receptor);
        const nombres = receptor.valor.clase.metodos.map(m => m.nombre);
        this.error(
          `la clase ${receptor.valor.clase.nombre} no tiene el método "${e.nombre}". `
          + (nombres.length ? `Sus métodos son: ${nombres.join(', ')}.` : 'No tiene métodos declarados.'),
          e.linea
        );
      }

      const texto = aTexto(receptor.valor);

      if (e.nombre === 'length' && receptor.tipo === 'String') {
        return V(texto.length, 'int');
      }

      const metodo = METODOS_STRING[e.nombre];
      if (metodo && (receptor.tipo === 'String' || typeof texto === 'string')) {
        // length() sin paréntesis ya se ha resuelto arriba
        const args = e.args.map(a => this.ev(a).valor);
        const r = metodo(texto, ...args);
        if (['equals', 'equalsIgnoreCase', 'contains', 'isEmpty', 'startsWith', 'endsWith'].includes(e.nombre)) {
          return V(r === 'true' || r === true, 'boolean');
        }
        if (['length', 'indexOf', 'lastIndexOf'].includes(e.nombre)) return V(r, 'int');
        if (e.nombre === 'charAt') return V(r, 'char');
        return V(r, 'String');
      }

      this.error('el método "' + e.nombre + '" no existe en este tipo', e.linea);
    }

    metodoDeClaseNumerica(clase, e) {
      const args = e.args.map(a => this.ev(a));
      if (e.nombre === 'parseInt') return V(parseInt(aTexto(args[0].valor), 10), 'int');
      if (e.nombre === 'parseDouble') return V(parseFloat(aTexto(args[0].valor)), 'double');
      if (e.nombre === 'MAX_VALUE') return V(2147483647, 'int');
      if (e.nombre === 'MIN_VALUE') return V(-2147483648, 'int');
      this.error(clase + '.' + e.nombre + ' no está disponible en este intérprete');
    }

    metodoDeClaseString(e) {
      if (e.nombre === 'valueOf') return V(aTexto(this.ev(e.args[0]).valor), 'String');
      if (e.nombre === 'format') {
        const plantilla = aTexto(this.ev(e.args[0]).valor);
        const vals = e.args.slice(1).map(a => this.ev(a).valor);
        let i = 0;
        return V(plantilla.replace(/%[sdbf]/g, (m, tipo) => {
          const v = vals[i++];
          if (tipo === 'd') return String(Math.trunc(Number(v)));
          if (tipo === 'f') return Number(v).toFixed(2);
          if (tipo === 'b') return v ? 'true' : 'false';
          return aTexto(v);
        }), 'String');
      }
      this.error('String.' + e.nombre + ' no está disponible en este intérprete');
    }

    /** Math.abs / Math.max… sin implementarlos uno a uno */
    staticMath(exp) {
      const args = (exp.args || []).map(a => this.ev(a));
      const nums = args.map(a => Number(a.valor));
      const nombre = exp.nombre;

      switch (nombre) {
        case 'abs': return V(Math.abs(nums[0]), inferirTipo(nums[0]));
        case 'max': return V(Math.max(...nums), todosEnteros(args) ? 'int' : 'double');
        case 'min': return V(Math.min(...nums), todosEnteros(args) ? 'int' : 'double');
        case 'pow': return V(Math.pow(nums[0], nums[1]), 'double');
        case 'sqrt': return V(Math.sqrt(nums[0]), 'double');
        case 'floor': return V(Math.floor(nums[0]), 'int');
        case 'ceil': return V(Math.ceil(nums[0]), 'double');
        case 'round': return V(Math.round(nums[0]), 'long');
        default:
          this.error('Math.' + nombre + ' no está disponible en este intérprete');
      }
    }

    truthy(v) { return v.valor === true; }

    // ── Llamadas ──

    /**
     * Llamada a un método propio de la clase: saludar("Ana"), sumar(3, 4).
     * Las llamadas con parte (Math.max, s.length) pasan por llamarMiembro.
     */
    llamar(e) {
      const nombre = e.nombre;
      const metodos = (this.principal && this.principal.metodos) || [];
      const metodo = metodos.find(m => m.nombre === nombre);
      if (metodo) return this.invocar(metodo, e.args, e.linea, null);

      // Métodos estáticos de las demás clases del fichero
      for (const c of this.clases) {
        const m = c.metodos.find(x => x.nombre === nombre && x.estatico);
        if (m) return this.invocar(m, e.args, e.linea, null);
      }

      const nombres = metodos.map(m => m.nombre);
      this.error(
        `el método "${nombre}" no existe`
        + (nombres.length
          ? `. Los métodos de ${this.principal.nombre} son: ${nombres.join(', ')}.`
          : '.'),
        e.linea
      );
    }

    invocar(metodo, argsNodo, linea, objeto) {
      const args = argsNodo.map(a => this.ev(a));
      if (args.length !== metodo.params.length) {
        this.error(`"${metodo.nombre}" espera ${metodo.params.length} argumento(s) y le has dado ${args.length}`, linea || metodo.linea);
      }

      const previoMetodo = this.metodoActual;
      const previoObjeto = this.objetoActual;
      this.metodoActual = metodo;
      // Un método de instancia necesita su this: sin él, this.campo fallaría
      this.objetoActual = objeto || null;
      // Mientras se ejecuta un método, sus variables no son visibles desde
      // fuera: es lo que impide usar una local de main dentro de otro método.
      const previoBase = this.baseAmbito;
      this.baseAmbito = this.ambito.size;
      this.entra();
      metodo.params.forEach((p, i) => this.definir(p.nombre, args[i]));

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

      if (retorno === null || retorno === undefined) {
        return V(null, 'void');
      }
      if (metodo.tipo === 'int') return V(Math.trunc(Number(retorno.valor)), 'int');
      if (metodo.tipo === 'double') return V(Number(retorno.valor), 'double');
      if (metodo.tipo === 'boolean') return V(retorno.valor === true, 'boolean');
      if (metodo.tipo === 'char') return V(aTexto(retorno), 'char');
      if (metodo.tipo === 'String') return V(aTexto(retorno), 'String');
      return retorno;
    }

    // ── Sentencias ──

    /**
     * Ejecuta un nodo. Si es un bloque de llaves, se ejecuta como bloque (con
     * su propio ámbito): es lo que hace que "int y = 2;" dentro de un if no
     * exista fuera de él.
     */
    ejecutar(nodo) {
      if (!nodo) return null;
      if (nodo.t === 'bloque') return this.ejecutarUna(nodo);
      return this.ejecutarLista(nodo.sent ? nodo.sent : [nodo]);
    }

    ejecutarLista(lista) {
      for (const s of lista) {
        const r = this.ejecutarUna(s);
        if (r) return r;   // return / break / continue
      }
      return null;
    }

    ejecutarUna(s) {
      switch (s.t) {
        case 'vacia': return null;

        case 'println': {
          // print deja el cursor a media línea y println lo cierra. Se modela
          // con un búfer pendiente: print suma, println suma y confirma la línea.
          const texto = s.args.map(a => {
            // Se pasa el V entero, no solo el valor: aTexto necesita el tipo
            // para escribir 5.0 y no 5
            return aTexto(this.ev(a));
          }).join('');

          this.pendiente += texto;
          if (s.saltoLinea !== false) {
            this.salida.push(this.pendiente);
            this.pendiente = '';
          }
          return null;
        }

        case 'asigCompuesta': {
          const real = s.op[0];
          const nuevo = this.binario({ t: 'bin', op: real, izq: s.izq, der: s.der });
          this.escribirEn(s.izq, nuevo);
          return null;
        }

        case 'decl': {
          for (const d of s.nombres) {
            let v;
            if (d.valores) {
              // Array con valores iniciales
              v = V(d.valores.map(e => this.ev(e).valor), (s.tipo || 'int[]').endsWith('String[]') ? s.tipo : (s.tipo || 'int[]'));
            } else if (d.valor) {
              v = this.ev(d.valor);
              // Narrowing: double = 5 → 5.0
              if (s.tipo === 'double' && typeof v.valor === 'number' && Number.isInteger(v.valor)) {
                v = V(v.valor, 'double');
              }
              if (s.tipo === 'int' && typeof v.valor === 'number') {
                v = V(Math.trunc(v.valor), 'int');
              }
            } else if (s.tipo && s.tipo.endsWith('[]')) {
              v = V([], s.tipo);
            } else {
              v = V(0, s.tipo === 'String' ? 'String' : (s.tipo || 'int'));
              if (s.tipo === 'boolean') v = V(false, 'boolean');
              if (s.tipo === 'char') v = V('\u0000', 'char');
            }
            this.definir(d.nombre, v);
          }
          return null;
        }

        case 'asigna': {
          // x = 5, nums[0] = 7, libro.titulo = "Dune"
          // El tipo se ajusta al ya declarado: double d = 1; d = 5;  →  5.0
          const valor = this.ev(s.der);
          let final = valor;
          if (s.izq.t === 'nombre') {
            const actual = this.buscar(s.izq.v);
            if (actual && actual.tipo === 'double' && typeof valor.valor === 'number') {
              final = V(valor.valor, 'double');
            }
          }
          this.escribirEn(s.izq, final);
          return null;
        }

        case 'expr': {
          // Asignaciones con operador compuesto y ++/--
          const e = s.exp;
          if (e.t === 'bin' && ['+=', '-=', '*=', '/=', '%='].includes(e.op)) {
            const real = e.op[0];
            this.ev(e.izq); // valida el destino; `binario` vuelve a leerlo
            const nuevo = this.binario({ ...e, op: real });
            this.escribirEn(e.izq, nuevo);
            return null;
          }
          this.ev(e);
          return null;
        }

        case 'if': {
          if (this.truthy(this.ev(s.cond))) return this.ejecutar(s.entonces);
          if (s.siNo) return this.ejecutar(s.siNo);
          return null;
        }

        case 'while': {
          let vueltas = 0;
          while (this.truthy(this.ev(s.cond))) {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') break;
              if (r.t === 'return') return r;
              // continue sigue el bucle
            }
            vueltas++;
            if (vueltas > 100000) {
              throw new ErrorJava('el bucle while no termina (revisa la condición)', s.linea);
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
            vueltas++;
            if (vueltas > 100000) {
              throw new ErrorJava('el bucle do-while no termina', s.linea);
            }
          } while (this.truthy(this.ev(s.cond)));
          return null;
        }

        case 'for': {
          this.entra();
          if (s.init) {
            if (s.init.t === 'decl') this.ejecutarUna(s.init);
            else this.ev(s.init.exp);
          }
          let vueltas = 0;
          while (!s.cond || this.truthy(this.ev(s.cond))) {
            const r = this.ejecutar(s.cuerpo);
            if (r) {
              if (r.t === 'break') { this.sale(); return null; }
              if (r.t === 'return') { this.sale(); return r; }
            }
            if (s.paso) this.ev(s.paso);
            vueltas++;
            if (vueltas > 100000) {
              this.sale();
              throw new ErrorJava('el bucle for no termina (revisa la condición)', s.linea);
            }
          }
          this.sale();
          return null;
        }

        case 'forEach': {
          const arr = this.ev(s.arr);
          this.entra();
          const valores = arr && Array.isArray(arr.valor) ? arr.valor : [];
          const tipoElem = arr.tipo && arr.tipo.endsWith('[]') ? arr.tipo.slice(0, -2) : s.tipo;
          for (const v of valores) {
            this.definir(s.nombre, V(v, tipoElem));
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
              if (c.valor === null) { ejecutado = true; }
              else {
                const v = this.ev(c.valor);
                if (esIgual(d, v)) ejecutado = true;
              }
              if (!ejecutado) continue;
            }
            // fall-through: sigue hasta break
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
          const err = new ErrorJava('return');
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
      }
    }
  }

  // ════════════════════════════════════════
  // API PÚBLICA
  // ════════════════════════════════════════

  function ambosEnteros(a, b) {
    return (a.tipo === 'int' || a.tipo === 'char' || a.tipo === 'short' || a.tipo === 'byte' || a.tipo === 'long')
      && (b.tipo === 'int' || b.tipo === 'char' || b.tipo === 'short' || b.tipo === 'byte' || b.tipo === 'long');
  }

  function todosEnteros(lista) {
    return lista.every(v => ['int', 'char', 'short', 'byte', 'long'].includes(v.tipo));
  }

  /** Java compara números, y Strings con compareTo. */
  function comparar(a, b) {
    if (a.tipo === 'String' && b.tipo === 'String') {
      return String(a.valor) < String(b.valor) ? -1 : (a.valor === b.valor ? 0 : 1);
    }
    const x = Number(a.valor);
    const y = Number(b.valor);
    return x === y ? 0 : (x < y ? -1 : 1);
  }

  /**
   * Ejecuta un programa Java.
   * @returns {{output: string, error: boolean}}
   */
  function ejecutar(src, opciones) {
    try {
      const arbol = construirArbol(src);
      const principal = ejec_principal(arbol);

      if (!principal) {
        return {
          output: 'No se ha encontrado ningún método. ¿Has escrito public static void main(String[] args)?\n',
          error: true
        };
      }

      const ejec = new Ejecutor(arbol, opciones);
      ejec.entra();

      // Los campos estáticos con valor inicial se calculan primero
      for (const campo of principal.campos) {
        if (!campo.estatico) continue;
        const v = campo.valor ? ejec.ev(campo.valor) : valorPorDefecto(campo.tipo);
        ejec.estaticos.set(campo.nombre, v);
      }

      // main tiene prioridad; si no hay, el primer método estático
      const elegido = principal.metodos.find(m => m.nombre === 'main')
        || principal.metodos.find(m => m.estatico)
        || principal.metodos[0];

      if (!elegido) {
        return {
          output: 'No se ha encontrado ningún método. ¿Has escrito public static void main(String[] args)?\n',
          error: true
        };
      }

      ejec.metodoActual = elegido;
      elegido.params.forEach(p => ejec.definir(p.nombre, valorPorDefecto(p.tipo)));

      try {
        ejec.ejecutar(elegido.cuerpo);
      } catch (err) {
        if (!err || !err.__return) throw err;
      }

      // Un print sin cerrar al final del programa también cuenta como salida
      const lineas = ejec.salida.slice();
      if (ejec.pendiente !== '') lineas.push(ejec.pendiente);
      const salida = lineas.length ? lineas.join('\n') + '\n' : '(el programa no imprime nada)\n';
      return { output: salida, error: false };
    } catch (err) {
      if (err instanceof ErrorJava) {
        return { output: 'Error de Java: ' + err.message + '\n', error: true };
      }
      return { output: 'Error de Java: ' + (err && err.message ? err.message : String(err)) + '\n', error: true };
    }
  }

  /** La clase desde la que arranca el programa: la que tiene main, o la primera. */
  function ejec_principal(arbol) {
    return (arbol.clases || []).find(c => c.metodos.some(m => m.nombre === 'main'))
      || (arbol.clases || [])[0]
      || null;
  }

  return {
    ejecutar,
    tokenizar,
    construirArbol,
    ErrorJava,
    // se exportan por comodidad para los tests
    _internas: { V, aTexto, comparar, esIgual }
  };
})();
