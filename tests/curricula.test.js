// Coherencia de TODOS los temarios, no solo del que se acaba de escribir.
//
// Este test existe por una razón concreta: el peor fallo que puede tener un
// curso es un enunciado que miente. Si la solución de un ejercicio imprime una
// cosa y el test espera otra, el alumno escribe la respuesta correcta, la app
// la marca mal y no entiende nada. En un curso de programación eso destruye la
// confianza en todo lo demás.
//
// Así que aquí se comprueba, curso por curso y ejercicio por ejercicio:
//   · que los ids no se repitan
//   · que la opción marcada como correcta exista y sea la única posible
//   · que los huecos del código encajen con las respuestas declaradas
//   · y, en los lenguajes que se ejecutan de verdad, que la solución
//     IMPRIMA exactamente lo que el enunciado promete
//
// Esa última comprobación es la importante: el motor y la app usan la misma
// función de coincidencia, así que si aquí cuadra, al alumno le cuadra.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { syncGlobals } from './setup.js';

await import('../curriculum.js');
await import('../curriculums/javascript.js');
await import('../curriculums/html.js');
await import('../curriculums/css.js');
await import('../curriculums/sql.js');
await import('../curriculums/java.js');
await import('../curriculums/cpp.js');
await import('../curriculums/php.js');
await import('../curriculums/go.js');
await import('../curriculums/typescript.js');
await import('../engine.js');
await import('../sqlengine.js');
await import('../javaengine.js');
await import('../cppengine.js');
await import('../phpengine.js');
await import('../goengine.js');
await import('../tsengine.js');
syncGlobals();

const W = global.window;

/**
 * Los cursos que se ejecutan de verdad, con la forma de ejecutar su código.
 * HTML y CSS no se ejecutan: se comprueban por análisis, en sus propios tests.
 */
const EJECUTABLES = {
  python: {
    titulo: 'Python',
    modulos: () => W.CURRICULUM.modules,
    // Python corre con Skulpt, que viene de una CDN y no está en Node. Aquí no
    // se puede comprobar que la salida sea la correcta, y su propio temario
    // tiene tests que lo cubren con el motor real. Decirlo es preferible a
    // dar por buena una comprobación que en realidad no se ha hecho.
    ejecutar: null
  },
  sql: {
    titulo: 'SQL',
    modulos: () => W.SQL_CURRICULUM,
    ejecutar: (codigo) => W.SQL_ENGINE.ejecutar(codigo)
  },
  java: {
    titulo: 'Java',
    modulos: () => W.JAVA_CURRICULUM,
    ejecutar: (codigo) => W.JAVA_ENGINE.ejecutar(codigo)
  },
  cpp: {
    titulo: 'C++',
    modulos: () => W.CPP_CURRICULUM,
    ejecutar: (codigo) => W.CPP_ENGINE.ejecutar(codigo)
  },
  php: {
    titulo: 'PHP',
    modulos: () => W.PHP_CURRICULUM,
    ejecutar: (codigo) => W.PHP_ENGINE.ejecutar(codigo)
  },
  go: {
    titulo: 'Go',
    modulos: () => W.GO_CURRICULUM,
    ejecutar: (codigo) => W.GO_ENGINE.ejecutar(codigo)
  },
  typescript: {
    titulo: 'TypeScript',
    modulos: () => W.TS_CURRICULUM,
    ejecutar: (codigo) => W.TS_ENGINE.ejecutar(codigo)
  }
};

/** Los cursos que no se ejecutan, para las comprobaciones de estructura. */
const SOLO_ESTRUCTURA = {
  javascript: { titulo: 'JavaScript', modulos: () => W.JS_CURRICULUM },
  html: { titulo: 'HTML', modulos: () => W.HTML_CURRICULUM },
  css: { titulo: 'CSS', modulos: () => W.CSS_CURRICULUM }
};

/** Los cursos que de verdad se ejecutan aquí (sin Python: usa Skulpt). */
const CON_MOTOR = Object.fromEntries(
  Object.entries(EJECUTABLES).filter(([, c]) => typeof c.ejecutar === 'function')
);

const TODOS = { ...EJECUTABLES, ...SOLO_ESTRUCTURA };

/** Aplana un temario a una lista de ejercicios, guardando el módulo. */
function aplanar(modulos) {
  const lista = [];
  modulos.forEach(m => {
    (m.lessons || []).forEach(l => {
      (l.exercises || []).forEach(e => lista.push({ ejercicio: e, modulo: m, leccion: l }));
    });
  });
  return lista;
}

/**
 * Los cinco lenguajes se comparan con la salida literal.
 *
 * SQL es distinto a propósito: las opciones de sus ejercicios son el valor
 * que se quiere saber ("6", "3", "Ana y Luis"), no la tabla que imprimiría
 * psql con las cabeceras y el "(3 filas)". Comparar eso con la salida cruda
 * daría falso positivo en casi todas, así que se comprueba que lo que afirma
 * la opción esté de verdad en la salida:
 *   · si lleva números, esos números tienen que aparecer;
 *   · si no, cada parte separada por comas o por " y " tiene que aparecer.
 */
function opcionSqlEsReal(marcada, salida) {
  const planilla = String(salida).replace(/\s+/g, ' ');
  const numeros = String(marcada).match(/\d+/g);
  if (numeros) return numeros.every(n => planilla.includes(n));

  const partes = String(marcada)
    .split(/\s*,\s*|\s+y\s+/i)
    .map(p => p.trim())
    .filter(Boolean);
  if (!partes.length) return planilla.includes(String(marcada));
  return partes.every(p => planilla.includes(p));
}

/** Un curso puede declarar que sus predict-output no se comparan literales. */
const comparaLiteral = (clave) => clave !== 'sql';

// ════════════════════════════════════════════════
// ESTRUCTURA, para los cursos
// ════════════════════════════════════════════════

describe('Todos los cursos: estructura', () => {
  for (const [clave, curso] of Object.entries(TODOS)) {
    describe(curso.titulo, () => {
      const modulos = curso.modulos();

      test('tiene módulos con contenido', () => {
        assert.ok(Array.isArray(modulos), `${clave}: los módulos deben ser un array`);
        assert.ok(modulos.length > 0, `${clave}: no hay ningún módulo`);
        modulos.forEach(m => {
          assert.ok(m.id, `${clave}: un módulo sin id`);
          assert.ok(m.title, `${clave}: el módulo ${m.id} no tiene título`);
          assert.ok(Array.isArray(m.lessons) && m.lessons.length > 0,
            `${clave}: el módulo ${m.id} no tiene lecciones`);
        });
      });

      test('los ids de módulo, lección y ejercicio no se repiten', () => {
        const idsModulo = modulos.map(m => m.id);
        assert.equal(new Set(idsModulo).size, idsModulo.length,
          `${clave}: hay módulos con el mismo id`);

        const idsLeccion = modulos.flatMap(m => m.lessons.map(l => l.id));
        assert.equal(new Set(idsLeccion).size, idsLeccion.length,
          `${clave}: hay lecciones con el mismo id`);

        const idsEjercicio = aplanar(modulos).map(x => x.ejercicio.id);
        const repetidos = idsEjercicio.filter((x, i) => idsEjercicio.indexOf(x) !== i);
        assert.equal(repetidos.length, 0,
          `${clave}: ejercicios con id repetido: ${[...new Set(repetidos)].join(', ')}`);
      });

      test('cada ejercicio se puede validar contra el alumno', () => {
        const Fallos = [];
        for (const { ejercicio: e, modulo } of aplanar(modulos)) {
          const donde = `${e.id} (${modulo.title})`;

          // Sin explicación el alumno falla y no sabe por qué
          if (!e.explanation) Fallos.push(`${donde}: sin explicación`);

          // El enunciado dice QUÉ tiene que hacer el código. Si falta, el
          // alumno se encuentra el código solo y no sabe qué busca.
          if (e.type !== 'reorder' && !(e.question || e.description || e.code || e.brokenCode)) {
            Fallos.push(`${donde}: no dice qué hay que hacer`);
          }

          if (e.type === 'multiple-choice') {
            if (!Array.isArray(e.choices) || e.choices.length < 3) {
              Fallos.push(`${donde}: menos de 3 opciones`);
              continue;
            }
            if (typeof e.correct !== 'number' || !e.choices[e.correct]) {
              Fallos.push(`${donde}: correct=${e.correct} no apunta a una opción real`);
              continue;
            }
            // Con dos opciones idénticas no hay forma de saber cuál vale
            if (new Set(e.choices).size !== e.choices.length) {
              Fallos.push(`${donde}: tiene opciones repetidas, la respuesta correcta es ambigua`);
            }
            // fix-bug es un multiple-choice con su propio enunciado
            if (e.type === 'fix-bug' && !e.buggyCode) {
              Fallos.push(`${donde}: fix-bug sin buggyCode`);
            }
          }

          if (e.type === 'fill-blank') {
            }

          if (e.type === 'fill-blank') {
            // correct es opcional: el renderizador usa blanks[], que ya es la
            // lista de respuestas exactas, y con ellas compara una a una.
            // Solo hace falta que correct apunte a la opción buena si existe.
            if (e.correct !== undefined
              && (typeof e.correct !== 'number' || !e.options || !e.options[e.correct])) {
              Fallos.push(`${donde}: correct=${e.correct} no apunta a una opción real`);
            }
            if (typeof e.code !== 'string' || !e.code.includes('___')) {
              Fallos.push(`${donde}: el código no tiene ningún hueco ___`);
              continue;
            }
            if (!Array.isArray(e.blanks) || e.blanks.length === 0) {
              Fallos.push(`${donde}: sin blanks`);
              continue;
            }
            // El renderizador sustituye cada ___ y usa blanks.length, así que
            // los dos números tienen que coincidir o el ejercicio es injugable
            const huecos = (e.code.match(/___/g) || []).length;
            if (huecos !== e.blanks.length) {
              Fallos.push(`${donde}: ${huecos} hueco(s) en el código pero ${e.blanks.length} blanks`);
              continue;
            }
            if (e.correct !== undefined
              && (typeof e.correct !== 'number' || !e.options || !e.options[e.correct])) {
              Fallos.push(`${donde}: correct=${e.correct} no apunta a una opción real`);
              continue;
            }
            // Cada respuesta válida tiene que estar en el banco de palabras
            e.blanks.forEach((b, k) => {
              if (!e.options.includes(b)) {
                Fallos.push(`${donde}: el blank ${k} ("${b}") no está en options, sería imposible de elegir`);
              }
            });
          }

          if (e.type === 'predict-output') {
            if (typeof e.codeToRun !== 'string' || !e.codeToRun.trim()) {
              Fallos.push(`${donde}: sin codeToRun`);
              continue;
            }
            if (!Array.isArray(e.output) || e.output.length < 2) {
              Fallos.push(`${donde}: menos de 2 opciones de salida`);
              continue;
            }
            if (typeof e.correctOutput !== 'number' || !e.output[e.correctOutput]) {
              Fallos.push(`${donde}: correctOutput=${e.correctOutput} no apunta a una opción real`);
            }
          }

          if (e.type === 'type-code') {
            if (!e.starter) Fallos.push(`${donde}: sin starter`);
            if (!e.solution) { Fallos.push(`${donde}: sin solution`); continue; }
            if (!Array.isArray(e.tests) || e.tests.length === 0) {
              Fallos.push(`${donde}: sin tests, no se podría validar nada`);
              continue;
            }
            e.tests.forEach((t, k) => {
              if (t.expected === undefined) Fallos.push(`${donde}: el test ${k} no dice qué espera`);
            });
          }
        }
        assert.equal(Fallos.length, 0, `\n  ${Fallos.join('\n  ')}`);
      });
    });
  }
});

// ════════════════════════════════════════════════
// EJECUCIÓN REAL, para los lenguajes con motor
// ════════════════════════════════════════════════

describe('Cursos ejecutables: la solución imprime lo que promete', () => {
  for (const [clave, curso] of Object.entries(CON_MOTOR)) {
    describe(curso.titulo, () => {
      test('todos los type-code producen la salida que su test espera', () => {
        const Fallos = [];
        const ejercicios = aplanar(curso.modulos())
          .filter(x => x.ejercicio.type === 'type-code');

        assert.ok(ejercicios.length > 0, `${clave}: no hay type-code que comprobar`);

        for (const { ejercicio: e, modulo } of ejercicios) {
          const donde = `${e.id} (${modulo.title})`;
          const r = curso.ejecutar(e.solution);
          if (r.error) {
            Fallos.push(`${donde}: la solución no se ejecuta -> ${String(r.output).trim()}`);
            continue;
          }
          // Se usa la MISMA función que la app, no una comparación suelta.
          // Si aquí usáramos === mientras la app usa el comodín {{...}},
          // estos tests darían verde y el alumno suspendería su solución
          // correcta: exactamente el fallo que este test evita.
          if (!W.Engine._coincideSalida(e.tests[0].expected, r.output)) {
            Fallos.push(`${donde}: la solución imprime ${JSON.stringify(r.output)} `
              + `pero el test pide ${JSON.stringify(e.tests[0].expected)}`);
          }
        }
        assert.equal(Fallos.length, 0,
          `\n${ejercicios.length} type-code revisados\n  ${Fallos.join('\n  ')}`);
      });

      test('la opción buena de cada predict-output es la salida real', () => {
        const Fallos = [];
        const ejercicios = aplanar(curso.modulos())
          .filter(x => x.ejercicio.type === 'predict-output');

        for (const { ejercicio: e, modulo } of ejercicios) {
          const donde = `${e.id} (${modulo.title})`;
          const r = curso.ejecutar(e.codeToRun);

          // Hay ejercicios que consiste justamente en fallar: "esto da un
          // error de memoria liberada". Ahí lo correcto es que el motor avise,
          // y la opción buena es la que lo explica.
          if (r.error) {
            if (!e.expectError) {
              Fallos.push(`${donde}: el código no se ejecuta y no está marcado `
                + `como expectError -> ${String(r.output).trim()}`);
            } else if (typeof e.correctOutput !== 'number'
              || !/error|aviso|no vale|no se puede/i.test(String(e.output[e.correctOutput]))) {
              Fallos.push(`${donde}: está marcado expectError pero la opción buena `
                + `no explica el fallo: ${JSON.stringify(String(e.output[e.correctOutput]))}`);
            }
            continue;
          }
          if (e.expectError) {
            Fallos.push(`${donde}: marcado expectError pero el motor no da ningún error`);
            continue;
          }

          const real = String(r.output).replace(/\n$/, '');
          const marcada = String(e.output[e.correctOutput]);

          if (comparaLiteral(clave)) {
            if (real !== marcada) {
              Fallos.push(`${donde}: imprime ${JSON.stringify(real)} `
                + `pero la opción buena dice ${JSON.stringify(marcada)}`);
              continue;
            }
            // Si otra opción también coincide, el alumno no tiene forma de saber
            // cuál elegir aunque acierte
            e.output.forEach((op, k) => {
              if (k !== e.correctOutput && String(op) === real) {
                Fallos.push(`${donde}: la opción ${k} (${JSON.stringify(String(op))}) también sería correcta`);
              }
            });
          } else if (!opcionSqlEsReal(marcada, real)) {
            Fallos.push(`${donde}: la opción buena dice ${JSON.stringify(marcada)} `
              + `pero la salida real es ${JSON.stringify(real)}`);
          }
        }
        assert.equal(Fallos.length, 0,
          `\n${ejercicios.length} predict-output revisados\n  ${Fallos.join('\n  ')}`);
      });

      test('con la respuesta buena de cada fill-blank el código ya funciona', () => {
        const Fallos = [];
        const ejercicios = aplanar(curso.modulos())
          .filter(x => x.ejercicio.type === 'fill-blank' && x.ejercicio.solution !== undefined);

        for (const { ejercicio: e, modulo } of ejercicios) {
          const donde = `${e.id} (${modulo.title})`;
          const r = curso.ejecutar(e.solution);
          if (r.error) {
            Fallos.push(`${donde}: la solución con los huecos puestos no se ejecuta `
              + `-> ${String(r.output).trim()}`);
          }
        }
        assert.equal(Fallos.length, 0, `\n  ${Fallos.join('\n  ')}`);
      });

      test('el motor no revienta con nada del temario', () => {
        // Cualquier ejercicio escribe lo que el alumno escriba, así que el
        // motor tiene que aguantar basura: eso nunca debe lanzar una excepción
        // que rompa la web, sino devolver { output, error }.
        for (const { ejercicio: e } of aplanar(curso.modulos())) {
          let codigo = e.solution ?? e.codeToRun ?? '';
          if (!codigo && e.type === 'fill-blank' && e.code) {
            // Con los huecos puestos: código sin ___ no es PHP válido
            let n = 0;
            codigo = e.code.replace(/___/g, () => (n++ === 0 ? e.blanks[0] : e.options[0] || ''));
          }
          if (typeof codigo !== 'string' || !codigo.trim()) continue;
          assert.doesNotThrow(() => curso.ejecutar(codigo),
            `${e.id}: el motor lanzó una excepción sin capturarla`);
        }
      });
    });
  }
});

// ════════════════════════════════════════════════
// COHERENCIA ENTRE CURSOS
// ════════════════════════════════════════════════

describe('Coherencia entre cursos', () => {
  test('ningún ejercicio repite id entre lenguajes distintos', () => {
    // El progreso se guarda por id. Si dos cursos comparten un id, aprobar uno
    //Completaría el otro por accidente y el alumno vería el curso saltado.
    const vistos = new Map();
    const Choques = [];
    for (const [clave, curso] of Object.entries(TODOS)) {
      for (const { ejercicio: e } of aplanar(curso.modulos())) {
        if (vistos.has(e.id)) Choques.push(`${e.id}: ${vistos.get(e.id)} y ${clave}`);
        else vistos.set(e.id, clave);
      }
    }
    assert.equal(Choques.length, 0, `\n  ${Choques.slice(0, 20).join('\n  ')}`);
  });

  test('la cifra de la portada cuadra con lo que hay en los temarios', () => {
    // index.html afirma "N lenguajes · M módulos · L lecciones · X ejercicios".
    // Si esa cifra se queda vieja, la web está mintiendo sobre su propio
    // contenido, así que se comprueba contra los ficheros de verdad.
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const contador = html.match(
      /(\d+)\s+lenguajes\s+·\s+(\d+)\s+m[oó]dulos\s+·\s+(\d+)\s+lecciones\s+·\s+([\d.]+)\s+ejercicios/
    );
    assert.ok(contador, 'no encuentro el contador de la portada en index.html');

    const esperadoLenguajes = Object.keys(TODOS).length;
    const esperadoModulos = Object.values(TODOS).reduce((n, c) => n + c.modulos().length, 0);
    const esperadoLecciones = Object.values(TODOS)
      .reduce((n, c) => n + c.modulos().reduce((m, x) => m + x.lessons.length, 0), 0);
    const esperadoEjercicios = Object.values(TODOS)
      .reduce((n, c) => n + aplanar(c.modulos()).length, 0);

    // 1.352 viene en la portada con punto de millar, como se escribe en español
    const dePortada = contador[4].replace(/\./g, '');

    assert.equal(Number(contador[1]), esperadoLenguajes,
      `la portada dice ${contador[1]} lenguajes pero hay ${esperadoLenguajes} cursos`);
    assert.equal(Number(contador[2]), esperadoModulos,
      `la portada dice ${contador[2]} módulos pero hay ${esperadoModulos}`);
    assert.equal(Number(contador[3]), esperadoLecciones,
      `la portada dice ${contador[3]} lecciones pero hay ${esperadoLecciones}`);
    assert.equal(Number(dePortada), esperadoEjercicios,
      `la portada dice ${contador[4]} ejercicios pero hay ${esperadoEjercicios}`);
  });
});