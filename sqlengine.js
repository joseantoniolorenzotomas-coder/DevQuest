// DevQuest SQL — Mini motor de SQL para los ejercicios
//
// Por qué un motor propio y no sql.js: el proyecto no usa dependencias
// externas (solo Skulpt por CDN para Python) y así las soluciones de los
// ejercicios se pueden ejecutar también en los tests de Node, que es lo
// que permite validar el contenido del curso.
//
// Cubre el subconjunto que se enseña en el curso:
//   SELECT · WHERE · ORDER BY · LIMIT · INSERT · UPDATE · DELETE
//   CREATE TABLE · INNER/LEFT JOIN · GROUP BY · HAVING · funciones
//
// 'use strict';

window.SQL_ENGINE = (function () {

  // ════════════════════════════════════════
  // BASE DE DATOS DE EJEMPLO
  // Es la misma en todo el curso para que el alumno la vaya
  // consultando y los ejemplos del temario no cambien.
  // ════════════════════════════════════════

  const PLANTILLA = {
    libros: {
      columnas: ['id', 'titulo', 'autor_id', 'anio', 'precio', 'genero'],
      filas: [
        { id: 1, titulo: 'El principito', autor_id: 1, anio: 1943, precio: 12.5, genero: 'Infantil' },
        { id: 2, titulo: 'Cien años de soledad', autor_id: 2, anio: 1967, precio: 18, genero: 'Realismo' },
        { id: 3, titulo: 'Harry Potter y la piedra filosofal', autor_id: 3, anio: 1997, precio: 15.75, genero: 'Fantasía' },
        { id: 4, titulo: 'El Hobbit', autor_id: 3, anio: 1937, precio: 14.2, genero: 'Fantasía' },
        { id: 5, titulo: 'Pedro Páramo', autor_id: 4, anio: 1955, precio: 11.9, genero: 'Realismo' },
        { id: 6, titulo: 'La sombra del viento', autor_id: 5, anio: 2001, precio: 16.4, genero: 'Misterio' }
      ]
    },
    autores: {
      columnas: ['id', 'nombre', 'pais', 'nacio'],
      filas: [
        { id: 1, nombre: 'Antoine de Saint-Exupéry', pais: 'Francia', nacio: 1900 },
        { id: 2, nombre: 'Gabriel García Márquez', pais: 'Colombia', nacio: 1927 },
        { id: 3, nombre: 'J. R. R. Tolkien', pais: 'Reino Unido', nacio: 1892 },
        { id: 4, nombre: 'Juan Rulfo', pais: 'México', nacio: 1917 },
        { id: 5, nombre: 'Carlos Ruiz Zafón', pais: 'España', nacio: 1964 }
      ]
    },
    socios: {
      columnas: ['id', 'nombre', 'ciudad', 'socio_desde'],
      filas: [
        { id: 1, nombre: 'Ana', ciudad: 'Madrid', socio_desde: 2021 },
        { id: 2, nombre: 'Luis', ciudad: 'Sevilla', socio_desde: 2023 },
        { id: 3, nombre: 'Marta', ciudad: 'Madrid', socio_desde: 2019 },
        { id: 4, nombre: 'Javi', ciudad: 'Bilbao', socio_desde: 2024 }
      ]
    },
    prestamos: {
      columnas: ['id', 'libro_id', 'socio_id', 'fecha'],
      filas: [
        { id: 1, libro_id: 1, socio_id: 1, fecha: '2024-01-15' },
        { id: 2, libro_id: 3, socio_id: 2, fecha: '2024-02-03' },
        { id: 3, libro_id: 3, socio_id: 3, fecha: '2024-02-20' },
        { id: 4, libro_id: 6, socio_id: 1, fecha: '2024-03-11' }
      ]
    }
  };

  /** Copia profunda: modificar datos no debe arrastrar la plantilla. */
  function crearBase() {
    const copia = {};
    for (const tabla in PLANTILLA) {
      copia[tabla] = {
        columnas: PLANTILLA[tabla].columnas.slice(),
        // La plantilla no declara claves primarias; el motor solo las
        // comprueba en las tablas creadas con PRIMARY KEY.
        pk: [],
        filas: PLANTILLA[tabla].filas.map(f => Object.assign({}, f))
      };
    }
    return copia;
  }

  /**
   * Comprueba que una fila no repita la clave primaria.
   * En un motor real es el propio servidor quien lo impide.
   */
  function comprobarPk(t, fila, ignorar) {
    if (!t.pk || !t.pk.length) return;
    const valores = t.pk.map(c => fila[c]);
    if (valores.some(v => v === null || v === undefined)) {
      throw new Error('la clave primaria no puede quedar vacía');
    }
    const repite = t.filas.some(f => {
      if (ignorar && ignorar === f) return false;
      return t.pk.every(c => String(f[c]) === String(valores[t.pk.indexOf(c)]));
    });
    if (repite) {
      throw new Error('clave duplicada: ' + t.pk.join(', ') + ' = ' + valores.join(', '));
    }
  }

  // ════════════════════════════════════════
  // AYUDAS DE TEXTO
  // ════════════════════════════════════════

  function quitarComentarios(sql) {
    return sql.replace(/--[^\n]*/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ');
  }

  /** Divide en sentencias por ';' respetando comillas. */
  function dividirSentencias(sql) {
    const partes = [];
    let actual = '';
    let enTexto = false;
    for (const c of sql) {
      if (c === "'") enTexto = !enTexto;
      if (c === ';' && !enTexto) {
        partes.push(actual);
        actual = '';
      } else {
        actual += c;
      }
    }
    partes.push(actual);
    return partes.map(p => p.trim()).filter(Boolean);
  }

  /** Parte por un separador regex que no esté dentro de paréntesis ni comillas. */
  function partirPor(texto, regex) {
    const partes = [];
    let actual = '';
    let nivel = 0;
    let enTexto = false;
    const flags = regex.flags.includes('i') ? regex.flags + 'g' : regex.flags + 'gi';
    const patron = new RegExp(regex.source, flags);
    let i = 0;
    while (i < texto.length) {
      const c = texto[i];
      if (c === "'") enTexto = !enTexto;
      if (!enTexto) {
        if (c === '(') nivel++;
        else if (c === ')') nivel--;
        else if (nivel === 0) {
          patron.lastIndex = i;
          const m = patron.exec(texto);
          if (m && m.index === i) {
            partes.push(actual);
            actual = '';
            i += m[0].length;
            continue;
          }
        }
      }
      actual += c;
      i++;
    }
    partes.push(actual);
    return partes.map(p => p.trim()).filter(Boolean);
  }

  /** Separa los identificadores de una lista por comas (pueden llevar paréntesis). */
  function partirPorComa(texto) {
    return partirPor(texto, /,/);
  }

  const CLAUSULAS = /\b(FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|OFFSET|SET|VALUES|ON)\b/i;

  /**
   * Trocea una sentencia en sus cláusulas. Cada parte lleva la palabra clave
   * con la que EMPIEZA (no la que la sigue), que es lo natural:
   *   "libros WHERE anio > 1" → [{libros, ''}, {anio > 1, 'WHERE'}]
   * Los JOIN se quitan antes con partirJoins, así que no están aquí.
   */
  function partirClausulas(sql) {
    const partes = [];
    let actual = '';
    let clave = '';
    let nivel = 0;
    let enTexto = false;
    let i = 0;
    while (i < sql.length) {
      const c = sql[i];
      if (c === "'") enTexto = !enTexto;
      if (!enTexto) {
        if (c === '(') nivel++;
        else if (c === ')') nivel--;
        if (nivel === 0) {
          const m = sql.slice(i).match(CLAUSULAS);
          if (m && m.index === 0) {
            if (actual.trim()) partes.push({ texto: actual.trim(), clave });
            actual = '';
            clave = m[0].toUpperCase().replace(/\s+/g, ' ');
            i += m[0].length;
            continue;
          }
        }
      }
      actual += c;
      i++;
    }
    if (actual.trim()) partes.push({ texto: actual.trim(), clave });
    return partes;
  }

  /** ¿Los paréntesis de la expresión están equilibrados y envuelven todo? */
  function envuelveEntero(s) {
    const t = s.trim();
    if (!t.startsWith('(') || !t.endsWith(')')) return false;
    let nivel = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '(') nivel++;
      else if (t[i] === ')') {
        nivel--;
        if (nivel === 0 && i < t.length - 1) return false;
      }
    }
    return nivel === 0;
  }

  // ════════════════════════════════════════
  // VALORES
  // ════════════════════════════════════════

  function aValor(token) {
    const t = String(token).trim();
    if (/^NULL$/i.test(t)) return null;
    if (/^'(.*)'$/s.test(t)) return t.slice(1, -1).replace(/''/g, "'");
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
    if (/^TRUE$/i.test(t)) return true;
    if (/^FALSE$/i.test(t)) return false;
    return t;
  }

  function aTexto(v) {
    if (v === null || v === undefined) return 'NULL';
    if (v === true) return '1';
    if (v === false) return '0';
    return String(v);
  }

  /** Compara como haría SQL: devuelve -1, 0, 1 o null si hay algún NULL. */
  function comparar(a, b) {
    if (a === null || a === undefined || b === null || b === undefined) return null;
    const na = Number(a);
    const nb = Number(b);
    if (typeof a === 'number' || typeof b === 'number') {
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb ? 0 : (na < nb ? -1 : 1);
    }
    const sa = String(a);
    const sb = String(b);
    return sa === sb ? 0 : (sa < sb ? -1 : 1);
  }

  function likeA(texto, patron) {
    const fuente = String(patron)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.');
    return new RegExp('^' + fuente + '$', 'i').test(String(texto));
  }

  // ════════════════════════════════════════
  // FUNCIONES
  // ════════════════════════════════════════

  const AGREGADOS = {
    count: (v, esStar) => esStar ? v.length : v.filter(x => x !== null && x !== undefined).length,
    sum: (v) => {
      const n = v.filter(x => typeof x === 'number');
      return n.length ? n.reduce((a, b) => a + b, 0) : null;
    },
    avg: (v) => {
      const n = v.filter(x => typeof x === 'number');
      if (!n.length) return null;
      return Math.round((n.reduce((a, b) => a + b, 0) / n.length) * 1000) / 1000;
    },
    min: (v) => {
      const n = v.filter(x => x !== null && x !== undefined);
      if (!n.length) return null;
      return n.reduce((a, b) => (comparar(a, b) <= 0 ? a : b));
    },
    max: (v) => {
      const n = v.filter(x => x !== null && x !== undefined);
      if (!n.length) return null;
      return n.reduce((a, b) => (comparar(a, b) >= 0 ? a : b));
    }
  };

  const FUNCIONES = {
    upper: (a) => aTexto(a[0]).toUpperCase(),
    lower: (a) => aTexto(a[0]).toLowerCase(),
    length: (a) => aTexto(a[0]).length,
    abs: (a) => Math.abs(Number(a[0])),
    round: (a) => {
      const dec = Number(a[1] ?? 0);
      const f = 10 ** dec;
      return Math.round(Number(a[0]) * f) / f;
    },
    coalesce: (a) => {
      for (const x of a) if (x !== null && x !== undefined) return x;
      return null;
    }
  };

  // Para detectar si hay que agrupar: sin ancla, porque el agregado puede
// estar anidado dentro de una función (ROUND(AVG(precio), 2)).
const TIENE_AGGREGADO = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i;
// Para interpretarlo: aquí sí tiene que ser toda la expresión.
const ES_AGGREGADO = /^(COUNT|SUM|AVG|MIN|MAX)\s*\(([\s\S]*)\)$/i;

  // ════════════════════════════════════════
  // EVALUAR EXPRESIONES
  // Devuelve el valor, o {__agregado, expr, esStar} si es un agregado
  // (lo resuelve quien tenga el grupo de filas).
  // ════════════════════════════════════════

  function evaluar(expr, fila) {
    let e = String(expr == null ? '' : expr).trim();
    if (!e) return null;

    // Los paréntesis que envuelven toda la expresión se quitan
    while (envuelveEntero(e)) e = e.slice(1, -1).trim();

    // BETWEEN se reescribe ANTES de partir por AND, porque
    // "x BETWEEN 1 AND 5" contiene un AND que no es un operador lógico
    const partesBetween = partirPor(e, /\s+BETWEEN\s+/i);
    if (partesBetween.length === 2) {
      const valor = evaluar(partesBetween[0], fila);
      const limites = partirPor(partesBetween[1], /\s+AND\s+/i);
      if (limites.length === 2) {
        const lo = evaluar(limites[0], fila);
        const hi = evaluar(limites[1], fila);
        if (valor === null || lo === null || hi === null) return null;
        return comparar(valor, lo) >= 0 && comparar(valor, hi) <= 0;
      }
    }

    const partesOr = partirPor(e, /\s+OR\s+/i);
    if (partesOr.length > 1) return partesOr.some(p => evaluar(p, fila) === true);

    const partesAnd = partirPor(e, /\s+AND\s+/i);
    if (partesAnd.length > 1) return partesAnd.every(p => evaluar(p, fila) === true);

    const mNot = e.match(/^NOT\s+([\s\S]+)$/i);
    if (mNot) {
      const v = evaluar(mNot[1], fila);
      return v === null ? null : v !== true;
    }

    // Agregados
    const mAg = e.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(([\s\S]*)\)$/i);
    if (mAg) {
      const fn = mAg[1].toLowerCase();
      const dentro = mAg[2].trim();
      if (fn === 'count' && dentro === '*') return { __agregado: fn, esStar: true };
      return { __agregado: fn, expr: dentro };
    }

    // Funciones de una fila
    const mFn = e.match(/^(\w+)\s*\(([\s\S]*)\)$/);
    if (mFn && FUNCIONES[mFn[1].toLowerCase()]) {
      const args = partirPorComa(mFn[2]).map(a => simple(evaluar(a, fila)));
      return FUNCIONES[mFn[1].toLowerCase()](args);
    }

    // IS NULL / IS NOT NULL
    const mIsNull = e.match(/^([\s\S]+?)\s+IS\s+(NOT\s+)?NULL$/i);
    if (mIsNull) {
      const v = simple(evaluar(mIsNull[1], fila));
      const esNull = v === null || v === undefined;
      return mIsNull[2] ? !esNull : esNull;
    }

    // IN (...) y NOT IN (...)
    const mIn = e.match(/^([\s\S]+?)\s+IN\s*\(([\s\S]*)\)$/i);
    if (mIn) {
      // El "NOT" puede haber quedado pegado al operando por el patrón
      // vago, así que se separa antes de comparar
      let negada = false;
      let operando = mIn[1];
      if (/\sNOT$/i.test(operando)) {
        negada = true;
        operando = operando.replace(/\s+NOT$/i, '');
      }
      const v = simple(evaluar(operando, fila));
      if (v === null) return null;
      const lista = partirPorComa(mIn[2]);
      const r = lista.some(x => comparar(v, simple(evaluar(x, fila))) === 0);
      return negada ? !r : r;
    }

    // LIKE / NOT LIKE
    const mLike = e.match(/^([\s\S]+?)\s+(NOT\s+)?LIKE\s+([\s\S]+)$/i);
    if (mLike) {
      const v = simple(evaluar(mLike[1], fila));
      const patron = simple(evaluar(mLike[3], fila));
      if (v === null || patron === null) return null;
      const r = likeA(v, patron);
      return mLike[2] ? !r : r;
    }

    // Comparaciones. Se prueban de dos en dos: primero >=, <= y luego el resto,
    // porque "a >= b" también encaja con el patrón de ">" si no se cuida.
    for (const ops of ['<=|>=|<>|!=|=|<|>', '<=|>=|<>|!=|=|<|>']) {
      const m = e.match(new RegExp('^([\\s\\S]+?)\\s*(' + ops + ')\\s*([\\s\\S]+)$'));
      if (m) return compararOperador(simple(evaluar(m[1], fila)), m[2], simple(evaluar(m[3], fila)));
    }

    // Aritmética
    const mAr = e.match(/^([\s\S]+?)\s*([-+*/])\s*([\s\S]+)$/);
    if (mAr && !/[<>=]/.test(e)) {
      const a = Number(simple(evaluar(mAr[1], fila)));
      const b = Number(simple(evaluar(mAr[3], fila)));
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        if (mAr[2] === '+') return a + b;
        if (mAr[2] === '-') return a - b;
        if (mAr[2] === '*') return a * b;
        return b === 0 ? null : Math.round((a / b) * 1e6) / 1e6;
      }
    }

    return resolverColumna(e, fila);
  }

  /** Si es un descriptor de agregado, se queda sin valor (se resuelve luego). */
  function simple(v) {
    return v && typeof v === 'object' && v.__agregado ? null : v;
  }

  function compararOperador(izq, op, der) {
    if (izq === null || der === null || izq === undefined || der === undefined) return null;
    const c = comparar(izq, der);
    switch (op) {
      case '=': return c === 0;
      case '<>': case '!=': return c !== 0;
      case '<': return c < 0;
      case '<=': return c <= 0;
      case '>': return c > 0;
      case '>=': return c >= 0;
      default: return null;
    }
  }

  /** Busca la columna en la fila. Admite tabla.columna y el alias de la tabla. */
  function resolverColumna(token, fila) {
    const t = String(token).trim();
    if (fila && Object.prototype.hasOwnProperty.call(fila, t)) return fila[t];
    if (fila && /\w+\.\w+/.test(t)) {
      const clave = t.split('.').pop();
      if (Object.prototype.hasOwnProperty.call(fila, clave)) return fila[clave];
    }
    return aValor(t);
  }

  /**
 * Sustituye las subconsultas escalares por su valor.
 *   WHERE precio > (SELECT AVG(precio) FROM libros)
 * La subconsulta se ejecuta como una consulta más y se queda con el primer
 * valor de la primera fila, que es lo que hacen los motores de verdad.
 */
  function resolverSubconsultas(expresion, base) {
    const texto = String(expresion == null ? '' : expresion);
    if (!/\(\s*SELECT/i.test(texto)) return texto;

    let salida = '';
    let i = 0;
    while (i < texto.length) {
      if (texto[i] === '(' && /^\(\s*SELECT/i.test(texto.slice(i))) {
        // Busca el paréntesis de cierre teniendo en cuenta anidación
        let nivel = 0;
        let enTexto = false;
        let j = i;
        for (; j < texto.length; j++) {
          const c = texto[j];
          if (c === "'") enTexto = !enTexto;
          if (enTexto) continue;
          if (c === '(') nivel++;
          else if (c === ')') {
            nivel--;
            if (nivel === 0) break;
          }
        }
        const interior = texto.slice(i + 1, j).trim();
        const r = ejecutarSelect(base, interior, interior);

        // Si la subconsulta va detrás de un IN, salen todos sus valores
        if (/\bIN\s+$/i.test(salida)) {
          const lista = r.filas.map(f => {
            const v = f[r.cabeceras[0]];
            if (v === null) return 'NULL';
            if (typeof v === 'number') return String(v);
            return "'" + String(v).replace(/'/g, "''") + "'";
          });
          // Sin resultados, IN (vacío) nunca es cierto
          salida += lista.length ? ' (' + lista.join(', ') + ')' : ' (NULL)';
          i = j + 1;
          continue;
        }

        let valor = null;
        if (r.cabeceras.length && r.filas.length) valor = r.filas[0][r.cabeceras[0]];
        if (valor === null) salida += 'NULL';
        else if (typeof valor === 'number') salida += String(valor);
        else salida += "'" + String(valor).replace(/'/g, "''") + "'";
        i = j + 1;
        continue;
      }
      salida += texto[i];
      i++;
    }
    return salida;
  }

  /** Calcula un agregado sobre un grupo de filas. */
  function calcularAgregado(desc, filas) {
    if (desc.esStar) return AGREGADOS.count(filas, true);
    const valores = filas.map(f => simple(evaluar(desc.expr, f)));
    return AGREGADOS[desc.__agregado](valores, false);
  }

  /**
   * Sustituye los agregados de una expresión por su valor ya calculado.
   * Hace falta para HAVING, donde aparece "HAVING COUNT(*) > 1": el
   * COUNT va dentro de una comparación y evaluar() solo reconoce el
   * agregado cuando ocupa toda la expresión.
   */
  function expandirAgregados(expr, grupo) {
    return String(expr).replace(
      /(COUNT|SUM|AVG|MIN|MAX)\s*\(([^()]*)\)/gi,
      (todo, fn, dentro) => {
        const limpio = dentro.trim();
        const desc = { __agregado: fn.toLowerCase(), esStar: limpio === '*', expr: limpio };
        const v = calcularAgregado(desc, grupo);
        if (v === null) return 'NULL';
        if (typeof v === 'number') return String(v);
        return "'" + String(v).replace(/'/g, "''") + "'";
      }
    );
  }

  // ════════════════════════════════════════
  // FILAS DE LAS TABLAS
  // ════════════════════════════════════════

  function tabla(base, nombre) {
    const t = base[nombre];
    if (!t) {
      throw new Error('No existe la tabla "' + nombre + '"');
    }
    return t;
  }

  /**
 * Añade las claves "tabla.columna" para poder desambiguar los JOIN.
 * La columna "suelta" solo se guarda si no choca con otra ya presente.
 */
  function decorar(fila, prefijo, destino) {
    for (const k in fila) {
      destino[prefijo + '.' + k] = fila[k];
      if (!(k in destino)) destino[k] = fila[k];
    }
  }

  function filasDeTabla(base, nombre) {
    return tabla(base, nombre).filas.map(f => {
      const out = {};
      decorar(f, nombre, out);
      return out;
    });
  }

  // ════════════════════════════════════════
  // SELECT
  // ════════════════════════════════════════

  function ejecutarSelect(base, sql, cabecera) {
    const mCabecera = cabecera.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([\s\S]+)$/i);
    if (!mCabecera) throw new Error('La consulta debe tener la forma SELECT ... FROM ...');

    let seleccion = mCabecera[1].trim();
    const desde = mCabecera[2].trim();

    let distinct = false;
    if (/^DISTINCT\s+/i.test(seleccion)) {
      distinct = true;
      seleccion = seleccion.replace(/^DISTINCT\s+/i, '');
    }

    const partes = partirClausulas(desde);
    if (!partes.length) throw new Error('Falta el FROM');

    if (!partes.length) throw new Error('Falta el FROM');

    // ---- FROM: se separa tabla base + JOINs guardando el tipo de cada uno
    const definiciones = partirJoins(desde);
    if (!definiciones.length) throw new Error('Falta la tabla en el FROM');

    let where = null;
    let groupBy = null;
    let having = null;
    let orderBy = null;
    let limit = null;
    let offset = 0;

    definiciones.forEach(def => {
      for (const p of def.clausulas) {
        switch (p.clave) {
          case 'WHERE': where = p.texto; break;
          case 'GROUP BY': groupBy = partirPorComa(p.texto); break;
          case 'HAVING': having = p.texto; break;
          case 'ORDER BY': orderBy = p.texto; break;
          case 'LIMIT': {
            const m = p.texto.match(/^(\d+)(?:\s+OFFSET\s+(\d+))?$/i);
            if (m) {
              limit = Number(m[1]);
              offset = m[2] ? Number(m[2]) : 0;
            }
            break;
          }
          case 'OFFSET': offset = Number(aValor(p.texto)) || 0; break;
          default: break;   // ON se usa más abajo
        }
      }
    });

    // ---- Filas de la tabla base (con su alias si tiene)
    const nombreBase = quitarAliasTabla(definiciones[0].tabla);
    const aliasBase = extraerAlias(definiciones[0].tabla);
    let filas = filasDeTabla(base, nombreBase).map(f => renombrar(f, aliasBase));

    // ---- JOINs
    for (let i = 1; i < definiciones.length; i++) {
      const def = definiciones[i];
      const condicion = (def.clausulas.find(p => p.clave === 'ON') || {}).texto || null;

      const nombreTabla = quitarAliasTabla(def.tabla);
      const alias = extraerAlias(def.tabla);

      const derecha = filasDeTabla(base, nombreTabla).map(f => renombrar(f, alias));
      const columnasDerecha = tabla(base, nombreTabla).columnas;

      const combinadas = [];
      for (const izq of filas) {
        let huboCoincidencia = false;
        for (const der of derecha) {
          const fila = Object.assign({}, izq);
          for (const k in der) fila[k] = der[k];
          if (!condicion || simple(evaluar(condicion, fila)) === true) {
            combinadas.push(fila);
            huboCoincidencia = true;
          }
        }
        // LEFT JOIN: si esta fila de la izquierda no tuvo pareja, se mantiene
        if (!huboCoincidencia && def.tipo === 'LEFT JOIN') {
          const fila = Object.assign({}, izq);
          columnasDerecha.forEach(col => {
            if (alias) fila[alias + '.' + col] = null;
          });
          if (condicion) simple(evaluar(condicion, fila));
          combinadas.push(fila);
        }
      }
      filas = combinadas;
    }

    // ---- WHERE (las subconsultas se sustituyen por su valor antes)
    if (where) {
      const condicion = resolverSubconsultas(where, base);
      filas = filas.filter(f => simple(evaluar(condicion, f)) === true);
    }

    // ---- Columnas de salida
    let items = partirPorComa(seleccion).map(c => {
      const bruto = c.trim();
      const mAlias = bruto.match(/^([\s\S]+?)\s+AS\s+(\w+)$/i) || bruto.match(/^(\w+\.\w+|\w+|\*)\s+(\w+)$/i);
      if (mAlias) return { expr: mAlias[1], alias: mAlias[2] };
      return { expr: bruto, alias: null };
    });

    // "SELECT *" se expande a todas las columnas de las tablas implicadas,
    // en el orden de aparición. No se toca el * de COUNT(*), que viene
    // dentro de paréntesis y partirPorComa ya lo dejó entero.
    if (items.some(it => it.expr === '*')) {
      const columnas = [];
      definiciones.forEach(def => {
        tabla(base, quitarAliasTabla(def.tabla)).columnas.forEach(c => {
          if (!columnas.includes(c)) columnas.push(c);
        });
      });
      const expandidas = [];
      items.forEach(it => {
        if (it.expr === '*') {
          columnas.forEach(c => expandidas.push({ expr: c, alias: null }));
        } else {
          expandidas.push(it);
        }
      });
      items = expandidas;
    }

    // La cabecera que se ve es la del SELECT, sin el prefijo de tabla
    const nombreColumna = (it) => it.alias || it.expr.replace(/^\w+\./, '');

    // Si hay que agrupar: un agregado por SELECT, un GROUP BY o un HAVING.
    // Se mira el texto original, no los items ya expandidos: si no, al
    // sustituir AVG(precio) por su valor dentro de ROUND(...) se perdería
    // la pista de que hay un agregado y saldrían una fila por fila.
    const hayAgregado = TIENE_AGGREGADO.test(seleccion)
      || (having !== null) || (groupBy !== null);

    let salida;
    if (hayAgregado) {
      // ---- Agrupación
      let grupos;
      if (groupBy) {
        grupos = new Map();
        for (const f of filas) {
          const clave = groupBy.map(g => aTexto(simple(evaluar(g, f)))).join('|');
          if (!grupos.has(clave)) grupos.set(clave, []);
          grupos.get(clave).push(f);
        }
        grupos = [...grupos.values()];
      } else {
        grupos = [filas];
      }

      salida = grupos.map(grupo => {
        const fila = { __origen: grupo[0] };
        items.forEach(it => {
          // expandirAgregados permite anidar un agregado en una función,
          // por ejemplo ROUND(AVG(precio), 2)
          const expr = expandirAgregados(it.expr, grupo);
          const bruto = evaluar(expr, grupo[0]);
          const nombre = nombreColumna(it);
          if (bruto && typeof bruto === 'object' && bruto.__agregado) {
            fila[nombre] = calcularAgregado(bruto, grupo);
          } else {
            fila[nombre] = simple(bruto);
          }
        });
        // HAVING se aplica sobre el resultado ya calculado del grupo
        if (having) {
          const cond = resolverSubconsultas(expandirAgregados(having, grupo), base);
          fila.__having = simple(evaluar(cond, fila));
        }
        return fila;
      });
      if (having) salida = salida.filter(f => f.__having === true);
      salida.forEach(f => { delete f.__having; });
    } else {
      salida = filas.map(f => {
        const fila = { __origen: f };
        items.forEach(it => {
          const expr = expandirAgregados(it.expr, [f]);
          fila[nombreColumna(it)] = simple(evaluar(expr, f));
        });
        return fila;
      });
    }

    // ---- ORDER BY
    if (orderBy) {
      const criterios = partirPorComa(orderBy).map(c => {
        const m = c.match(/^([\s\S]+?)\s+(ASC|DESC)$/i);
        return { col: (m ? m[1] : c).trim(), desc: m ? /^DESC$/i.test(m[2]) : false };
      });
      // ORDER BY puede referirse a columnas que no están en el SELECT
      // (p. ej. "SELECT titulo ... ORDER BY anio"), así que se calculan
      // contra la fila original y se guardan aparte.
      salida.forEach(f => {
        const base = Object.assign({}, f.__origen, f);
        criterios.forEach(c => {
          f['__ord_' + c.col] = simple(evaluar(c.col, base));
        });
      });
      salida.sort((a, b) => {
        for (const c of criterios) {
          const va = a['__ord_' + c.col];
          const vb = b['__ord_' + c.col];
          const cmp = comparar(va, vb);
          if (cmp === null) continue;
          if (cmp !== 0) return c.desc ? -cmp : cmp;
        }
        return 0;
      });
      salida.forEach(f => {
        criterios.forEach(c => { delete f['__ord_' + c.col]; });
      });
    }

    // ---- Columnas finales
    const cabeceras = [];
    salida.forEach(fila => {
      for (const k in fila) {
        if (k === '__origen') continue;
        if (!cabeceras.includes(k)) cabeceras.push(k);
      }
    });
    if (!cabeceras.length) items.forEach(it => cabeceras.push(nombreColumna(it)));

    // ---- DISTINCT
    if (distinct) {
      const vistos = new Set();
      salida = salida.filter(f => {
        const clave = cabeceras.map(c => aTexto(f[c])).join('|');
        if (vistos.has(clave)) return false;
        vistos.add(clave);
        return true;
      });
    }

    // ---- LIMIT / OFFSET
    if (offset) salida = salida.slice(offset);
    if (limit !== null) salida = salida.slice(0, limit);

    salida.forEach(f => { delete f.__origen; });
    return { cabeceras, filas: salida };
  }

  /**
 * Trocea la parte FROM en tabla base + JOINs.
 * Devuelve [{ tipo, tabla, clausulas }]; el primero es el FROM a secas.
 * No usa partirPor porque hay que conservar si el JOIN es INNER o LEFT.
 */
  function partirJoins(texto) {
    const definiciones = [];
    const troceado = partirPor(texto, /\s+(?:(INNER|LEFT)\s+)?JOIN\s+/i);

    // partirPor se come el separador, así que el tipo se recupera
    // mirando el texto original en la posición de cada JOIN
    const separadores = [];
    const re = /\s+(?:(INNER|LEFT)\s+)?JOIN\s+/gi;
    let m;
    while ((m = re.exec(texto)) !== null) separadores.push(m);

    troceado.forEach((t, i) => {
      const partes = partirClausulas(t);
      let tipo = '';
      if (i > 0 && separadores[i - 1]) {
        tipo = separadores[i - 1][1]
          ? separadores[i - 1][1].toUpperCase() + ' JOIN'
          : 'JOIN';
      }
      definiciones.push({
        tipo,
        tabla: partes[0] ? partes[0].texto : '',
        clausulas: partes.slice(1)
      });
    });

    return definiciones;
  }

  /** "libros l" → "libros" */
  function quitarAliasTabla(def) {
    const s = String(def).trim();
    const m = s.match(/\s+(?:AS\s+)?\w+\s*$/i);
    return m ? s.slice(0, m.index).trim() : s;
  }

  /** "libros l" → "l" (null si no lleva alias) */
  function extraerAlias(def) {
    const m = String(def).trim().match(/\s+(?:AS\s+)?(\w+)\s*$/i);
    return m ? m[1] : null;
  }

  /** Si la tabla tiene alias, se añade la clave "alias.columna" también. */
  function renombrar(fila, alias) {
    if (!alias) return fila;
    const out = Object.assign({}, fila);
    for (const k in fila) out[alias + '.' + k] = fila[k];
    return out;
  }

  // ════════════════════════════════════════
  // OTRAS SENTENCIAS
  // ════════════════════════════════════════

  function ejecutarInsert(base, sql) {
    const m = sql.match(/^INSERT\s+INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*([\s\S]+)$/i);
    if (!m) throw new Error('la forma debe ser INSERT INTO tabla (columnas) VALUES (...)');
    const t = tabla(base, m[1]);
    const columnas = partirPorComa(m[2]);
    const valores = partirPorComa(m[3]).map(v => {
      const dentro = v.trim();
      if (envuelveEntero(dentro)) {
        return partirPorComa(dentro.slice(1, -1)).map(aValor);
      }
      return [aValor(dentro)];
    });

    let insertadas = 0;
    valores.forEach(vals => {
      if (vals.length !== columnas.length) {
        throw new Error('se dan ' + vals.length + ' valores para ' + columnas.length + ' columnas');
      }
      const fila = {};
      columnas.forEach((c, j) => { fila[quitarComillas(c)] = vals[j]; });
      comprobarPk(t, fila);
      t.filas.push(fila);
      insertadas++;
    });
    return { cabeceras: [], filas: [], mensaje: insertadas + ' fila(s) insertada(s)' };
  }

  function ejecutarUpdate(base, sql) {
    const m = sql.match(/^UPDATE\s+(\w+)\s+SET\s+([\s\S]+?)(\s+WHERE\s+([\s\S]+))?$/i);
    if (!m) throw new Error('La forma debe ser UPDATE tabla SET ... [WHERE ...]');
    const t = tabla(base, m[1]);
    const asignaciones = partirPorComa(m[2]).map(a => {
      const p = a.split('=');
      if (p.length !== 2) throw new Error('Asignación inválida: ' + a);
      return { columna: quitarComillas(p[0].trim()), valor: aValor(p[1]) };
    });
    let afectadas = 0;
    t.filas.forEach(f => {
      if (!m[4] || simple(evaluar(m[4], f)) === true) {
        const copia = Object.assign({}, f);
        asignaciones.forEach(as => { copia[as.columna] = as.valor; });
        comprobarPk(t, copia, f);
        Object.assign(f, copia);
        afectadas++;
      }
    });
    return { cabeceras: [], filas: [], mensaje: afectadas + ' fila(s) actualizada(s)' };
  }

  function ejecutarDelete(base, sql) {
    const m = sql.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (!m) throw new Error('La forma debe ser DELETE FROM tabla [WHERE ...]');
    const t = tabla(base, m[1]);
    const antes = t.filas.length;
    t.filas = m[2] ? t.filas.filter(f => simple(evaluar(m[2], f)) !== true) : [];
    return { cabeceras: [], filas: [], mensaje: (antes - t.filas.length) + ' fila(s) borrada(s)' };
  }

  function ejecutarCreate(base, sql) {
    const m = sql.match(/^CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]+)\)$/i);
    if (!m) throw new Error('la forma debe ser CREATE TABLE nombre (columnas)');
    if (base[m[1]]) throw new Error('la tabla "' + m[1] + '" ya existe');

    const definiciones = partirPorComa(m[2]).map(c => {
      const trozos = c.trim().split(/\s+/);
      return { nombre: trozos[0], resto: c.trim() };
    });

    base[m[1]] = {
      columnas: definiciones.map(d => d.nombre),
      // PRIMARY KEY se guarda aparte para poder comprobar duplicados
      pk: definiciones.filter(d => /PRIMARY\s+KEY/i.test(d.resto)).map(d => d.nombre),
      filas: []
    };
    return { cabeceras: [], filas: [], mensaje: 'Tabla "' + m[1] + '" creada' };
  }

  function quitarComillas(s) {
    return String(s).trim().replace(/^["'`]|["'`]$/g, '');
  }

  // ════════════════════════════════════════
  // PRESENTACIÓN
  // ════════════════════════════════════════

  /** Tabla alineada: texto a la izquierda, números a la derecha. */
  function formatearTabla(cabeceras, filas) {
    if (!cabeceras.length) return '';
    const anchos = cabeceras.map(c => c.length);
    filas.forEach(f => cabeceras.forEach((c, i) => {
      anchos[i] = Math.max(anchos[i], aTexto(f[c]).length);
    }));

    // 'valores' es una lista ya en el orden de las columnas
    const linea = (valores, alinearDerecha) => valores
      .map((v, i) => {
        const txt = aTexto(v);
        return alinearDerecha[i] ? txt.padStart(anchos[i]) : txt.padEnd(anchos[i]);
      })
      .join(' | ');

    const derecha = cabeceras.map(c => filas.some(f => typeof f[c] === 'number'));
    const separador = '-'.repeat(anchos.reduce((a, b) => a + b, 0) + (cabeceras.length - 1) * 3);

    const partes = [
      linea(cabeceras, derecha.map(() => false)),
      separador
    ];
    filas.forEach(f => partes.push(linea(cabeceras.map(c => f[c]), derecha)));
    partes.push('(' + filas.length + ' fila' + (filas.length === 1 ? '' : 's') + ')');
    return partes.join('\n');
  }

  // ════════════════════════════════════════
  // API PÚBLICA
  // ════════════════════════════════════════

  const errorSQL = (mensaje) => ({ output: 'Error de SQL: ' + mensaje + '\n', error: true });

  /**
   * Ejecuta una o varias sentencias SQL sobre la base de ejemplo.
   * @returns {{output: string, error: boolean}}
   */
  function ejecutar(sql, opciones) {
    const base = (opciones && opciones.base) || crearBase();
    const texto = quitarComentarios(String(sql == null ? '' : sql)).trim();

    if (!texto) return { output: '(consulta vacía)\n', error: false };

    // El fallo más común al empezar: poner los textos entre comillas dobles.
    // En SQL eso es un identificador, así que la consulta no da error pero
    // devuelve 0 filas y el alumno no entiende por qué. Mejor avisar.
    if (/"[^"]*"/.test(texto)) {
      return errorSQL('los textos van entre comillas simples. Usa ' +
        "'texto' en lugar de \"texto\".");
    }

    const sentencias = dividirSentencias(texto);
    if (!sentencias.length) return { output: '(consulta vacía)\n', error: false };

    const salidas = [];
    for (const s of sentencias) {
      const limpia = s.trim().replace(/;\s*$/, '').trim();
      if (!limpia) continue;
      try {
        let r;
        if (/^SELECT/i.test(limpia)) r = ejecutarSelect(base, limpia, limpiarCabecera(limpia));
        else if (/^INSERT/i.test(limpia)) r = ejecutarInsert(base, limpia);
        else if (/^UPDATE/i.test(limpia)) r = ejecutarUpdate(base, limpia);
        else if (/^DELETE/i.test(limpia)) r = ejecutarDelete(base, limpia);
        else if (/^CREATE/i.test(limpia)) r = ejecutarCreate(base, limpia);
        else throw new Error('sentencia no reconocida: ' + limpia.split(/\s+/)[0]);

        if (r.cabeceras && r.cabeceras.length) {
          salidas.push(formatearTabla(r.cabeceras, r.filas));
        } else if (r.mensaje) {
          salidas.push(r.mensaje);
        }
      } catch (err) {
        return errorSQL(err && err.message ? err.message : String(err));
      }
    }

    if (!salidas.length) return { output: '(consulta vacía)\n', error: false };
    return { output: salidas.join('\n\n') + '\n', error: false };
  }

  /** quita el punto y coma final y el "SELECT" inicial para el parser. */
  function limpiarCabecera(limpia) {
    return limpia.replace(/;\s*$/, '').trim();
  }

  return {
    ejecutar,
    crearBase,
    formatearTabla,
    quitarComentarios,
    dividirSentencias,
    partirPor,
    partirPorComa,
    partirClausulas,
    partirJoins,
    aValor,
    aTexto,
    comparar,
    likeA,
    evaluar,
    AGREGADOS,
    FUNCIONES,
    PLANTILLA
  };
})();
