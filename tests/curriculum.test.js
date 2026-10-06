// Tests para curriculum.js — Integridad de datos
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetMocks } from './setup.js';

// Cargar currículums y motor (para verificar soluciones JS)
await import('../curriculum.js');
await import('../curriculums/javascript.js');
await import('../curriculums/html.js');
await import('../curriculums/css.js');
await import('../curriculums/sql.js');
await import('../curriculums/java.js');
await import('../curriculums/cpp.js');
await import('../sqlengine.js');
await import('../javaengine.js');
await import('../cppengine.js');
await import('../engine.js');
await import('../app.js');

// El navegador decodifica las entidades HTML; el test debe imitarlo
const decodeEntities = (s) => s
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/&copy;/g, '©')
  .replace(/&eacute;/g, 'é')
  .replace(/&nbsp;/g, ' ');

/**
 * Comprueba que la salida de una solución es la que el ejercicio espera.
 *
 * Usa la misma función que la app (Engine._coincideSalida) a propósito: si el
 * test y la app comprobaran de manera distinta, un ejercicio sería "correcto"
 * en los tests y "incorrecto" para el alumno. Así fue como se colaron los
 * ejercicios que pedían un nombre personal con un nombre fijo.
 */
const coincideSalida = (esperado, real) => window.Engine._coincideSalida(esperado, real);

describe('Curriculum', () => {
  beforeEach(() => {
    resetMocks();
  });

  test('debe tener módulos definidos', () => {
    assert.ok(window.CURRICULUM);
    assert.ok(window.CURRICULUM.modules);
    assert.ok(Array.isArray(window.CURRICULUM.modules));
    assert.ok(window.CURRICULUM.modules.length > 0);
  });

  test('cada módulo debe tener id único', () => {
    const ids = window.CURRICULUM.modules.map(m => m.id);
    const uniqueIds = new Set(ids);
    assert.equal(ids.length, uniqueIds.size, 'Los ids de módulos deben ser únicos');
  });

  test('cada módulo debe tener título y descripción', () => {
    window.CURRICULUM.modules.forEach(mod => {
      assert.ok(mod.title, `Módulo ${mod.id} debe tener título`);
      assert.ok(mod.subtitle, `Módulo ${mod.id} debe tener subtítulo`);
      assert.ok(mod.icon, `Módulo ${mod.id} debe tener icono`);
    });
  });

  test('cada módulo debe tener lecciones', () => {
    window.CURRICULUM.modules.forEach(mod => {
      assert.ok(mod.lessons, `Módulo ${mod.id} debe tener lecciones`);
      assert.ok(Array.isArray(mod.lessons), `Módulo ${mod.id}: lecciones debe ser array`);
      assert.ok(mod.lessons.length > 0, `Módulo ${mod.id} debe tener al menos 1 lección`);
    });
  });

  test('cada lección debe tener id único dentro del módulo', () => {
    window.CURRICULUM.modules.forEach(mod => {
      const ids = mod.lessons.map(l => l.id);
      const uniqueIds = new Set(ids);
      assert.equal(ids.length, uniqueIds.size, `Módulo ${mod.id}: ids de lección deben ser únicos`);
    });
  });

  test('cada lección debe tener ejercicios', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        assert.ok(les.exercises, `Lección ${les.id} debe tener ejercicios`);
        assert.ok(Array.isArray(les.exercises), `Lección ${les.id}: ejercicios debe ser array`);
        assert.ok(les.exercises.length > 0, `Lección ${les.id} debe tener al menos 1 ejercicio`);
      });
    });
  });

  test('cada ejercicio debe tener id único dentro de la lección', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        const ids = les.exercises.map(e => e.id);
        const uniqueIds = new Set(ids);
        assert.equal(ids.length, uniqueIds.size, `Lección ${les.id}: ids de ejercicio deben ser únicos`);
      });
    });
  });

  test('cada ejercicio debe tener tipo válido', () => {
    const tiposValidos = ['multiple-choice', 'fill-blank', 'reorder', 'type-code', 'fix-bug', 'predict-output'];
    
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          assert.ok(tiposValidos.includes(ex.type), `Ejercicio ${ex.id}: tipo "${ex.type}" no es válido`);
        });
      });
    });
  });

  test('ejercicios multiple-choice deben tener choices y correct', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'multiple-choice') {
            assert.ok(ex.choices, `Ejercicio ${ex.id}: debe tener choices`);
            assert.ok(Array.isArray(ex.choices), `Ejercicio ${ex.id}: choices debe ser array`);
            assert.ok(ex.choices.length >= 2, `Ejercicio ${ex.id}: debe tener al menos 2 opciones`);
            assert.ok(ex.correct !== undefined, `Ejercicio ${ex.id}: debe tener correct`);
            assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `Ejercicio ${ex.id}: correct fuera de rango`);
          }
        });
      });
    });
  });

  test('ejercicios fill-blank deben tener blanks y options', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'fill-blank') {
            assert.ok(ex.blanks, `Ejercicio ${ex.id}: debe tener blanks`);
            assert.ok(Array.isArray(ex.blanks), `Ejercicio ${ex.id}: blanks debe ser array`);
            assert.ok(ex.blanks.length > 0, `Ejercicio ${ex.id}: debe tener al menos 1 blank`);
            assert.ok(ex.options, `Ejercicio ${ex.id}: debe tener options`);
            assert.ok(Array.isArray(ex.options), `Ejercicio ${ex.id}: options debe ser array`);
          }
        });
      });
    });
  });

  test('ejercicios reorder deben tener blocks y correctOrder', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'reorder') {
            assert.ok(ex.blocks, `Ejercicio ${ex.id}: debe tener blocks`);
            assert.ok(Array.isArray(ex.blocks), `Ejercicio ${ex.id}: blocks debe ser array`);
            assert.ok(ex.blocks.length >= 2, `Ejercicio ${ex.id}: debe tener al menos 2 bloques`);
            assert.ok(ex.correctOrder, `Ejercicio ${ex.id}: debe tener correctOrder`);
            assert.ok(Array.isArray(ex.correctOrder), `Ejercicio ${ex.id}: correctOrder debe ser array`);
          }
        });
      });
    });
  });

  test('ejercicios type-code deben tener tests', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'type-code') {
            assert.ok(ex.tests, `Ejercicio ${ex.id}: debe tener tests`);
            assert.ok(Array.isArray(ex.tests), `Ejercicio ${ex.id}: tests debe ser array`);
            assert.ok(ex.tests.length > 0, `Ejercicio ${ex.id}: debe tener al menos 1 test`);
            ex.tests.forEach((test, i) => {
              assert.ok(test.expected !== undefined, `Ejercicio ${ex.id} test ${i}: debe tener expected`);
            });
          }
        });
      });
    });
  });

  test('ejercicios predict-output deben tener output y correctOutput', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'predict-output') {
            assert.ok(ex.output, `Ejercicio ${ex.id}: debe tener output`);
            assert.ok(Array.isArray(ex.output), `Ejercicio ${ex.id}: output debe ser array`);
            assert.ok(ex.output.length >= 2, `Ejercicio ${ex.id}: debe tener al menos 2 opciones`);
            assert.ok(ex.correctOutput !== undefined, `Ejercicio ${ex.id}: debe tener correctOutput`);
          }
        });
      });
    });
  });

  test('ejercicios fix-bug deben tener buggyCode y choices', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          if (ex.type === 'fix-bug') {
            assert.ok(ex.buggyCode, `Ejercicio ${ex.id}: debe tener buggyCode`);
            assert.ok(ex.choices, `Ejercicio ${ex.id}: debe tener choices`);
            assert.ok(Array.isArray(ex.choices), `Ejercicio ${ex.id}: choices debe ser array`);
            assert.ok(ex.correct !== undefined, `Ejercicio ${ex.id}: debe tener correct`);
          }
        });
      });
    });
  });

  test('cada ejercicio debe tener xp definido', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          assert.ok(ex.xp !== undefined, `Ejercicio ${ex.id}: debe tener xp`);
          assert.ok(typeof ex.xp === 'number', `Ejercicio ${ex.id}: xp debe ser número`);
          assert.ok(ex.xp > 0, `Ejercicio ${ex.id}: xp debe ser positivo`);
        });
      });
    });
  });

  test('ejercicios deben tener explanation (obligatoria en todos los tipos)', () => {
    window.CURRICULUM.modules.forEach(mod => {
      mod.lessons.forEach(les => {
        les.exercises.forEach(ex => {
          // Sin explanation el alumno falla sin entender nada: obligatorio siempre
          assert.ok(ex.explanation, `Ejercicio ${ex.id}: debe tener explanation`);
          assert.ok(typeof ex.explanation === 'string', `Ejercicio ${ex.id}: explanation debe ser string`);
          assert.ok(ex.explanation.length > 0, `Ejercicio ${ex.id}: explanation no debe estar vacío`);
        });
      });
    });
  });

  test('cada módulo debe tener color y gradiente', () => {
    window.CURRICULUM.modules.forEach(mod => {
      assert.ok(mod.color, `Módulo ${mod.id}: debe tener color`);
      assert.ok(mod.gradient, `Módulo ${mod.id}: debe tener gradient`);
    });
  });

  test('cada módulo debe tener nivel válido', () => {
    const nivelesValidos = ['Principiante', 'Elemental', 'Intermedio', 'Avanzado', 'Experto', 'Proyecto'];
    window.CURRICULUM.modules.forEach(mod => {
      assert.ok(mod.level, `Módulo ${mod.id}: debe tener level`);
      assert.ok(nivelesValidos.includes(mod.level), `Módulo ${mod.id}: nivel "${mod.level}" no es válido`);
    });
  });

  test('el volumen de contenido coincide con lo anunciado (14 módulos · 40 lecciones · 230 ejercicios)', () => {
    const modules = window.CURRICULUM.modules;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 40);
    assert.equal(exercises.length, 230);
  });

  test('JavaScript tiene el volumen esperado (14 módulos · 43 lecciones · 258 ejercicios)', () => {
    const modules = window.JS_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 43);
    assert.equal(exercises.length, 258);
  });

  test('los ejercicios de JavaScript tienen ids únicos y tipos válidos', () => {
    const tiposValidos = ['multiple-choice', 'fill-blank', 'reorder', 'type-code', 'fix-bug', 'predict-output'];
    const ids = window.JS_CURRICULUM.flatMap(m => m.lessons.flatMap(l => l.exercises.map(e => e.id)));
    assert.equal(ids.length, new Set(ids).size);
    window.JS_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(tiposValidos.includes(ex.type), `Ejercicio ${ex.id}: tipo no válido`);
      assert.ok(ex.xp > 0, `Ejercicio ${ex.id}: debe tener xp`);
    })));
  });

  test('cada ejercicio de JavaScript cumple las reglas de su tipo', () => {
    window.JS_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
      }
      if (ex.type === 'reorder') {
        assert.ok(ex.blocks.length >= 2, `${ex.id}: mínimo 2 bloques`);
        assert.deepEqual([...ex.correctOrder].sort((a, b) => a - b), ex.blocks.map((_, i) => i), `${ex.id}: correctOrder inválido`);
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length, `${ex.id}: correctOutput fuera de rango`);
      }
      if (ex.type === 'fix-bug') {
        assert.ok(ex.buggyCode, `${ex.id}: debe tener buggyCode`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      // La explicación es obligatoria en TODOS los tipos: al fallar siempre debe explicar el porqué
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
    })));
  });

  test('las soluciones type-code de JavaScript producen la salida esperada', async () => {
    const { runCode } = window.Engine;
    const typeCodes = [];
    window.JS_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const result = await runCode.call(window.Engine, 'javascript', ex.solution);
      assert.equal(result.error, false, `${ex.id}: la solución da error: ${result.output}`);
      assert.ok(coincideSalida(ex.tests[0].expected, result.output),
        `${ex.id}: la solución no produce lo esperado`);
    }
  });

  // ───────────────────────────────────────
  // HTML
  // ───────────────────────────────────────
  test('HTML tiene el volumen esperado (14 módulos · 23 lecciones · 138 ejercicios)', () => {
    const modules = window.HTML_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 23);
    assert.equal(exercises.length, 138);
  });

  test('cada ejercicio de HTML cumple las reglas de su tipo', () => {
    window.HTML_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(ex.xp > 0, `${ex.id}: debe tener xp`);
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
      }
      if (ex.type === 'reorder') {
        assert.deepEqual([...ex.correctOrder].sort((a, b) => a - b), ex.blocks.map((_, i) => i), `${ex.id}: correctOrder inválido`);
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length, `${ex.id}: correctOutput fuera de rango`);
      }
      if (ex.type === 'fix-bug') {
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      // La explicación es obligatoria en TODOS los tipos: al fallar siempre debe explicar el porqué
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
    })));
  });

  test('las soluciones de HTML cumplen el texto y la estructura que piden', () => {
    const typeCodes = [];
    window.HTML_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const test = ex.tests[0];
      assert.ok(ex.solution && ex.solution.length > 0, `${ex.id}: falta la solución`);
      // El texto visible esperado debe aparecer en el body (igual que hace el navegador)
      const body = ex.solution.replace(/<head[\s\S]*?<\/head>/gi, ' ');
      const plain = decodeEntities(body.replace(/<[^>]*>/g, ' '))
        .replace(/\s+/g, ' ').trim();
      assert.equal(plain, test.expected, `${ex.id}: el texto visible de la solución no coincide`);
      // Si pide estructura concreta, debe estar presente
      if (test.contains) {
        assert.ok(ex.solution.toLowerCase().includes(test.contains.toLowerCase()),
          `${ex.id}: la solución no contiene "${test.contains}"`);
      }
    }
  });

  // ───────────────────────────────────────
  // CSS
  // ───────────────────────────────────────
  test('CSS tiene el volumen esperado (14 módulos · 25 lecciones · 150 ejercicios)', () => {
    const modules = window.CSS_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 25);
    assert.equal(exercises.length, 150);
  });

  test('el analizador de CSS detecta las reglas correctamente', async () => {
    const e = window.Engine;
    assert.equal((await e.runCss('h1 { color: red; }')).output, 'h1 { color: red }\n');
    assert.equal((await e.runCss('/* c */ p { color: red }')).output, 'p { color: red }\n');
    assert.equal(
      (await e.runCss('.a { color: red }\n.b { color: blue }')).output,
      '.a { color: red }\n.b { color: blue }\n'
    );
    assert.match((await e.runCss('')).output, /vacío/);
    assert.match((await e.runCss('solo texto')).output, /No se encontraron reglas/);
  });

  test('el analizador de CSS entiende bloques anidados (@keyframes, @media)', async () => {
    const e = window.Engine;
    assert.equal(
      (await e.runCss('@keyframes fade {\n  from { opacity: 0 }\n  to { opacity: 1 }\n}')).output,
      '@keyframes fade { from { opacity: 0 }; to { opacity: 1 } }\n'
    );
    assert.equal(
      (await e.runCss('@media (max-width: 600px) {\n  h1 { font-size: 24px }\n}')).output,
      '@media (max-width: 600px) { h1 { font-size: 24px } }\n'
    );
  });

  test('las soluciones CSS producen exactamente la regla esperada', async () => {
    const typeCodes = [];
    window.CSS_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const result = await window.Engine.runCss(ex.solution);
      assert.equal(result.error, false, `${ex.id}: error al analizar`);
      assert.ok(coincideSalida(ex.tests[0].expected, result.output),
        `${ex.id}: la solución no produce la regla esperada`);
    }
  });

  test('cada ejercicio de CSS cumple las reglas de su tipo', () => {
    window.CSS_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(ex.xp > 0, `${ex.id}: debe tener xp`);
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length, `${ex.id}: correctOutput fuera de rango`);
        // La opción correcta debe existir realmente en el CSS
        assert.equal(ex.codeToRun.replace(/\/\*[\s\S]*?\*\//g, '').includes('{'), true, `${ex.id}: el código no tiene regla`);
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
        // Para poder explicar la solución al fallar
        assert.ok(ex.solution && ex.solution.length > 0, `${ex.id}: debe tener solution`);
      }
      // La explicación es obligatoria en TODOS los tipos: al fallar siempre debe explicar el porqué
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
    })));
  });

  test('todo ejercicio puede mostrar su solución correcta al fallar', () => {
    // Si un tipo no aporta los datos necesarios, el alumno ve "Incorrecto" sin más
    const curricula = [
      ['python', window.CURRICULUM.modules],
      ['javascript', window.JS_CURRICULUM],
      ['html', window.HTML_CURRICULUM],
      ['css', window.CSS_CURRICULUM],
      ['sql', window.SQL_CURRICULUM],
      ['java', window.JAVA_CURRICULUM],
      ['cpp', window.CPP_CURRICULUM]
    ];
    curricula.forEach(([lang, mods]) => mods.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      const app = window.App;
      const html = app._correctAnswerHtml(ex);
      assert.ok(typeof html === 'string' && html.length > 0,
        `${lang}/${ex.id} (${ex.type}): no se puede mostrar la solución al fallar`);
      assert.ok(ex.explanation && ex.explanation.length > 0,
        `${lang}/${ex.id}: sin explicación el fallo no enseña nada`);
    }))));
  });

  test('la solución mostrada al fallar escapa el HTML (no puede inyectar etiquetas)', () => {
    const app = window.App;
    const html = app._correctAnswerHtml({
      type: 'multiple-choice',
      choices: ['<img src=x onerror=alert(1)>', 'otra'],
      correct: 0
    });
    assert.ok(!html.includes('<img'), 'el HTML debe ir escapado');
    assert.ok(html.includes('&lt;img'));
  });

  test('la solución de un fill-blank muestra el código completo', () => {
    const app = window.App;
    const html = app._correctAnswerHtml({
      type: 'fill-blank',
      code: '.a {\n  color: ___;\n  width: ___px\n}',
      blanks: ['red', '100']
    });
    assert.ok(html.includes('color: red;'));
    assert.ok(html.includes('width: 100px'));
    assert.ok(!html.includes('___'));
  });

  test('cada tipo de ejercicio genera su solución correcta', () => {
    const app = window.App;
    const casos = [
      ['type-code', { type: 'type-code', solution: 'print(1)' }, 'print(1)'],
      ['multiple-choice', { type: 'multiple-choice', choices: ['a', 'b'], correct: 1 }, 'b'],
      ['fix-bug', { type: 'fix-bug', choices: ['fix A', 'fix B'], correct: 1 }, 'fix B'],
      ['predict-output', { type: 'predict-output', output: ['mal', 'bien'], correctOutput: 1 }, 'bien']
    ];
    casos.forEach(([tipo, ej, esperado]) => {
      const html = app._correctAnswerHtml(ej);
      assert.ok(html.includes(esperado), `${tipo}: la solución no muestra "${esperado}"`);
      assert.ok(html.includes('solution-code'), `${tipo}: falta el bloque de código`);
    });
  });

  test('un tipo desconocido no rompe el feedback', () => {
    const app = window.App;
    assert.equal(app._correctAnswerHtml({ type: 'inventado' }), '');
    assert.equal(app._correctAnswerHtml(null), '');
  });

  // ───────────────────────────────────────
  // SQL
  // ───────────────────────────────────────
  test('SQL tiene el volumen esperado (14 módulos · 27 lecciones · 162 ejercicios)', () => {
    const modules = window.SQL_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 27);
    assert.equal(exercises.length, 162);
  });

  test('cada ejercicio de SQL cumple las reglas de su tipo', () => {
    window.SQL_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(ex.xp > 0, `${ex.id}: debe tener xp`);
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
        // Solo puede haber una opción correcta: si dos valen, el alumno no sabe
        const correctas = ex.options.filter(o => o === ex.blanks[0]);
        assert.equal(correctas.length, 1, `${ex.id}: más de una opción correcta`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length, `${ex.id}: correctOutput fuera de rango`);
        const r = window.SQL_ENGINE.ejecutar(ex.codeToRun);
        if (ex.expectError) {
          // Algunos ejercicios preguntan justamente por el error
          assert.equal(r.error, true, `${ex.id}: se esperaba un error`);
          assert.match(r.output, /^Error de SQL:/, `${ex.id}: el error debe explicarse`);
        } else {
          assert.equal(r.error, false, `${ex.id}: la consulta da error: ${r.output}`);
        }
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
        assert.ok(ex.solution && ex.solution.length > 0, `${ex.id}: debe tener solution`);
      }
    })));
  });

  test('las soluciones SQL producen exactamente la salida esperada', () => {
    const typeCodes = [];
    window.SQL_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const result = window.SQL_ENGINE.ejecutar(ex.solution);
      assert.equal(result.error, false, `${ex.id}: la solución da error: ${result.output}`);
      assert.ok(coincideSalida(ex.tests[0].expected, result.output),
        `${ex.id}: la solución no produce la salida esperada`);
    }
  });

  test('las opciones correctas de predict-output cuadran con la consulta', () => {
    // La opción es una versión corta de la respuesta ("2" en vez de la tabla
    // entera), así que se acepta que sea una abreviatura, pero tiene que ser
    // coherente con lo que devuelve la consulta.
    const normalizar = (s) => String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();

    const filasDeSalida = (salida) => salida.split('\n')
      .slice(2)                                   // fuera cabecera y separador
      .map(l => l.replace(/\s*\|\s*/g, ' ').trim())
      .filter(l => l && !/^\(.*\)$/.test(l));

    let comprobadas = 0;
    window.SQL_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'predict-output') return;
      const r = window.SQL_ENGINE.ejecutar(ex.codeToRun);
      if (ex.expectError) return;   // ya se comprueba en el test anterior
      assert.equal(r.error, false, `${ex.id}: la consulta da error: ${r.output}`);

      const filas = filasDeSalida(r.output).map(normalizar).filter(Boolean);
      const opcion = normalizar(ex.output[ex.correctOutput]);
      if (!filas.length) return;

      const coincide = filas.some(f => f === opcion)
        || filas.some(f => f.includes(opcion))
        || filas.every(f => opcion.includes(f))
        // O que cada palabra con sentido de la opción aparezca en el resultado
        || opcion.split(/\s+/).filter(p => p.length >= 3 && !/^\d+$/.test(p))
          .every(p => filas.some(f => f.includes(p)));
      assert.ok(coincide,
        `${ex.id}: la opcion correcta dice "${ex.output[ex.correctOutput]}" y la consulta devuelve ${JSON.stringify(filas)}`);
      comprobadas++;
    })));
    assert.ok(comprobadas > 10, 'deben comprobarse bastantes ejercicios');
  });

  // ───────────────────────────────────────
  // JAVA
  // ───────────────────────────────────────
  test('Java tiene el volumen esperado (14 módulos · 24 lecciones · 144 ejercicios)', () => {
    const modules = window.JAVA_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 24);
    assert.equal(exercises.length, 144);
  });

  test('cada ejercicio de Java cumple las reglas de su tipo', () => {
    window.JAVA_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(ex.xp > 0, `${ex.id}: debe tener xp`);
      // La explicación es obligatoria en TODOS los tipos: al fallar siempre
      // debe explicar el porqué, que es la regla del temario
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
        assert.equal(new Set(ex.choices).size, ex.choices.length,
          `${ex.id}: dos opciones idénticas, el alumno no puede elegir`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
        // Solo puede haber una opción correcta: si dos valen, el alumno no sabe
        const correctas = ex.options.filter(o => o === ex.blanks[0]);
        assert.equal(correctas.length, 1, `${ex.id}: más de una opción correcta`);
        assert.equal(new Set(ex.options).size, ex.options.length,
          `${ex.id}: dos opciones idénticas`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length,
          `${ex.id}: correctOutput fuera de rango`);
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
        assert.ok(ex.solution && ex.solution.length > 0, `${ex.id}: debe tener solution`);
      }
    })));
  });

  test('las soluciones de Java producen exactamente la salida esperada', () => {
    const typeCodes = [];
    window.JAVA_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const r = window.JAVA_ENGINE.ejecutar(ex.solution);
      assert.equal(r.error, false, `${ex.id}: la solución da error: ${r.output}`);
      assert.ok(coincideSalida(ex.tests[0].expected, r.output),
        `${ex.id}: la solución no produce la salida esperada`);
    }
  });

  test('los predict-output de Java se ejecutan (o fallan a propósito)', () => {
    // predict-output es la respuesta corta, no la salida entera: no se
    // compara carácter a carácter, pero sí se ejecuta el código para
    // comprobar que no está roto.
    let ejecutados = 0;
    window.JAVA_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'predict-output') return;
      const r = window.JAVA_ENGINE.ejecutar(ex.codeToRun);
      if (ex.expectError) {
        assert.equal(r.error, true, `${ex.id}: se esperaba un error`);
        assert.match(r.output, /^Error de Java:/, `${ex.id}: el error debe explicarse`);
      } else {
        assert.equal(r.error, false, `${ex.id}: el código da error: ${r.output}`);
      }
      ejecutados++;
    })));
    assert.ok(ejecutados > 15, 'deben comprobarse bastantes ejercicios');
  });

  test('la opción correcta de predict-output aparece en la salida real', () => {
    // Igual que en SQL: la opción es una abreviatura, pero tiene que ser
    // coherente con lo que el programa imprime de verdad.
    const norm = (s) => String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();

    let comprobadas = 0;
    window.JAVA_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'predict-output' || ex.expectError) return;
      const r = window.JAVA_ENGINE.ejecutar(ex.codeToRun);
      assert.equal(r.error, false, `${ex.id}: el código da error: ${r.output}`);

      const lineas = r.output.replace(/\n$/, '').split('\n').map(norm).filter(Boolean);
      if (lineas.includes('(el programa no imprime nada)')) return;

      const opcion = norm(ex.output[ex.correctOutput]);
      const coincide = lineas.some(f => f === opcion)
        || lineas.some(f => f.includes(opcion))
        || lineas.every(f => opcion.includes(f))
        // O que cada palabra con sentido de la opción aparezca en el resultado
        || opcion.split(/\s+/).filter(p => p.length >= 3 && !/^\d+$/.test(p))
          .every(p => lineas.some(f => f.includes(p)));
      assert.ok(coincide,
        `${ex.id}: la opción correcta dice "${ex.output[ex.correctOutput]}" y el programa imprime ${JSON.stringify(lineas)}`);
      comprobadas++;
    })));
    assert.ok(comprobadas > 10, 'deben comprobarse bastantes ejercicios');
  });

  // ───────────────────────────────────────
  // C++
  // ───────────────────────────────────────
  test('C++ tiene el volumen esperado (14 módulos · 25 lecciones · 150 ejercicios)', () => {
    const modules = window.CPP_CURRICULUM;
    const lessons = modules.flatMap(m => m.lessons);
    const exercises = lessons.flatMap(l => l.exercises);
    assert.equal(modules.length, 14);
    assert.equal(lessons.length, 25);
    assert.equal(exercises.length, 150);
  });

  test('cada ejercicio de C++ cumple las reglas de su tipo', () => {
    window.CPP_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      assert.ok(ex.xp > 0, `${ex.id}: debe tener xp`);
      assert.ok(ex.explanation && ex.explanation.length > 0, `${ex.id}: debe tener explanation`);
      if (ex.type === 'multiple-choice') {
        assert.ok(ex.choices.length >= 2, `${ex.id}: mínimo 2 opciones`);
        assert.ok(ex.correct >= 0 && ex.correct < ex.choices.length, `${ex.id}: correct fuera de rango`);
        assert.equal(new Set(ex.choices).size, ex.choices.length,
          `${ex.id}: dos opciones idénticas`);
      }
      if (ex.type === 'fill-blank') {
        const holes = (ex.code.match(/___/g) || []).length;
        assert.equal(holes, ex.blanks.length, `${ex.id}: nº de huecos distinto de blanks`);
        assert.ok(ex.options.length >= ex.blanks.length, `${ex.id}: faltan opciones`);
        const correctas = ex.options.filter(o => o === ex.blanks[0]);
        assert.equal(correctas.length, 1, `${ex.id}: más de una opción correcta`);
        assert.equal(new Set(ex.options).size, ex.options.length, `${ex.id}: dos opciones idénticas`);
      }
      if (ex.type === 'predict-output') {
        assert.ok(ex.correctOutput >= 0 && ex.correctOutput < ex.output.length,
          `${ex.id}: correctOutput fuera de rango`);
      }
      if (ex.type === 'type-code') {
        assert.ok(ex.tests.length > 0, `${ex.id}: debe tener tests`);
        assert.ok(ex.solution && ex.solution.length > 0, `${ex.id}: debe tener solution`);
      }
    })));
  });

  test('las soluciones de C++ producen exactamente la salida esperada', () => {
    const typeCodes = [];
    window.CPP_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code') typeCodes.push(ex);
    })));
    assert.ok(typeCodes.length > 0);
    for (const ex of typeCodes) {
      const r = window.CPP_ENGINE.ejecutar(ex.solution);
      assert.equal(r.error, false, `${ex.id}: la solución da error: ${r.output}`);
      assert.ok(coincideSalida(ex.tests[0].expected, r.output),
        `${ex.id}: la solución no produce la salida esperada`);
    }
  });

  test('los ejercicios de new/delete de C++ exigen liberar la memoria', () => {
    // Sin esto, un alumno que se salta el delete aprueba igual, porque la
    // salida es la misma: el ejercicio no enseñaría lo que dice enseñar.
    const conNew = [];
    window.CPP_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type === 'type-code' && /\bnew\b/.test(ex.solution)) conNew.push(ex);
    })));
    assert.ok(conNew.length > 0, 'debería haber ejercicios con new');
    for (const ex of conNew) {
      assert.ok(ex.tests[0].contains, `${ex.id}: usa new pero no exige nada sobre el delete`);
      assert.ok(ex.solution.includes(ex.tests[0].contains),
        `${ex.id}: la solución no contiene "${ex.tests[0].contains}"`);
    }
  });

  test('los predict-output de C++ se ejecutan (o fallan a propósito)', () => {
    let ejecutados = 0;
    window.CPP_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'predict-output') return;
      const r = window.CPP_ENGINE.ejecutar(ex.codeToRun);
      if (ex.expectError) {
        assert.equal(r.error, true, `${ex.id}: se esperaba un error`);
        assert.match(r.output, /^Error de C\+\+/, `${ex.id}: el error debe explicarse`);
      } else {
        assert.equal(r.error, false, `${ex.id}: el código da error: ${r.output}`);
      }
      ejecutados++;
    })));
    assert.ok(ejecutados > 15, 'deben comprobarse bastantes ejercicios');
  });

  test('la opción correcta de predict-output cuadra con la salida real', () => {
    const norm = (s) => String(s)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim();

    let comprobadas = 0;
    window.CPP_CURRICULUM.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'predict-output' || ex.expectError) return;
      const r = window.CPP_ENGINE.ejecutar(ex.codeToRun);
      assert.equal(r.error, false, `${ex.id}: el código da error: ${r.output}`);

      const lineas = r.output.replace(/\n$/, '').split('\n').map(norm).filter(Boolean);
      if (lineas.includes('(el programa no imprime nada)')) return;

      const opcion = norm(ex.output[ex.correctOutput]);
      const coincide = lineas.some(f => f === opcion)
        || lineas.some(f => f.includes(opcion))
        || lineas.every(f => opcion.includes(f))
        || opcion.split(/\s+/).filter(p => p.length >= 3 && !/^\d+$/.test(p))
          .every(p => lineas.some(f => f.includes(p)));
      assert.ok(coincide,
        `${ex.id}: la opción correcta dice "${ex.output[ex.correctOutput]}" y el programa imprime ${JSON.stringify(lineas)}`);
      comprobadas++;
    })));
    assert.ok(comprobadas > 10, 'deben comprobarse bastantes ejercicios');
  });

  test('ningún ejercicio de código se queda sin saber qué tiene que hacer', () => {
    // Fallo real de autoría: había huecos de operadores con preguntas que no
    // dejaban claro cuál era ("Completa el contador" con un while por debajo,
    // donde no se sabe si el bucle llega o no al último número). Con cuatro
    // opciones de operadores, eso es una adivinanza, no un ejercicio.
    //
    // Solo se miran los huecos que son operadores o símbolos: una palabra
    // como "print" o "public" no admite más de una respuesta razonable.
    const OPERADORES = /^[+\-*/%=<>!&|^~:,;]+$/;
    // Palabras que explican qué hace el código y dan la pista necesaria
    const PISTAS = /(suma|sumar|restar|resta|menos|más|multiplic|divide|dividir|divisi[oó]n|entera|compar|igual|mayor|menor|entre|asigna|coloca|coma|punto y coma|espacio|termina|cierra|abre|concatena|une|añade|agrega|comentario|direcci[oó]n|apunta|potencia|elevado|insensible|pendiente|carnet|acepta|obligatorio|ancho|antes de|hasta|incluyendo|no solo|solo si|lee)/i;

    const sinPista = [];
    const curricula = [
      ['python', window.CURRICULUM.modules],
      ['javascript', window.JS_CURRICULUM],
      ['html', window.HTML_CURRICULUM],
      ['css', window.CSS_CURRICULUM],
      ['sql', window.SQL_CURRICULUM],
      ['java', window.JAVA_CURRICULUM],
      ['cpp', window.CPP_CURRICULUM]
    ];

    curricula.forEach(([lang, mods]) => mods.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'fill-blank') return;

      if (!ex.question || !ex.question.trim()) {
        sinPista.push(`${lang}/${ex.id}: sin pregunta`);
        return;
      }
      const hayOperador = (ex.blanks || []).some(b => OPERADORES.test(String(b).trim()));
      if (!hayOperador) return;
      if (!PISTAS.test(ex.question)) {
        sinPista.push(`${lang}/${ex.id}: "${ex.question}" con hueco ${JSON.stringify(ex.blanks)}`);
      }
    }))));

    assert.equal(sinPista.length, 0,
      `estos ejercicios no dicen qué tiene que hacer el código:\n  ${sinPista.join('\n  ')}`);
  });

  test('los ejercicios que piden un dato personal lo dejan libre', () => {
    // Fallo real de autoría, cuatro veces: la tarjeta de presentación de
    // Python y JavaScript, y los ejercicios de "imprime tu nombre" de Java y
    // C++. Traían el nombre del autor metido en el expected, así que un
    // alumno que escribiera el suyo suspendía sin tener nada mal.
    //
    // Aquí no se busca un nombre concreto (cualquiera vale), sino que la
    // línea con el nombre lleve el comodín.
    const datos = /(?:^|\n)#{0,3}\s*(?:tu nombre|mi nombre|nombre)\b.*$/i;
    const suspendidos = [];
    const curricula = [
      ['python', window.CURRICULUM.modules],
      ['javascript', window.JS_CURRICULUM],
      ['java', window.JAVA_CURRICULUM],
      ['cpp', window.CPP_CURRICULUM]
    ];

    curricula.forEach(([lang, mods]) => mods.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      if (ex.type !== 'type-code') return;
      if (!datos.test(ex.description || '')) return;

      const esperado = String(ex.tests[0].expected || '');
      if (!esperado.includes('{{')) {
        suspendidos.push(`${lang}/${ex.id}`);
      }
    }))));

    assert.equal(suspendidos.length, 0,
      `estos ejercicios piden un nombre personal pero lo fijan: ${suspendidos.join(', ')}`);
  });

  test('el texto de los currículums no tiene caracteres de otro alfabeto', () => {
    // Fallo real de autoría: se colaron caracteres chinos/rusos en el español
    const raros = /[\u2E80-\u9FFF\uAC00-\uD7AF\u0400-\u04FF\u3040-\u30FF]/;
    const curricula = [
      ['python', window.CURRICULUM.modules],
      ['javascript', window.JS_CURRICULUM],
      ['html', window.HTML_CURRICULUM],
      ['css', window.CSS_CURRICULUM],
      ['sql', window.SQL_CURRICULUM],
      ['java', window.JAVA_CURRICULUM],
      ['cpp', window.CPP_CURRICULUM]
    ];
    curricula.forEach(([lang, mods]) => mods.forEach(m => m.lessons.forEach(l => l.exercises.forEach(ex => {
      const textos = [ex.question, ex.explanation, ex.description, ex.buggyCode,
        ...(ex.choices || []), ...(ex.options || []), ...(ex.output || [])]
        .filter(t => typeof t === 'string');
      textos.forEach(t => {
        assert.ok(!raros.test(t), `${lang}/${ex.id}: contiene caracteres de otro alfabeto → ${t}`);
      });
    }))));
  });

  test('la solución de un reorder muestra los bloques en el orden correcto', () => {
    const app = window.App;
    const html = app._correctAnswerHtml({
      type: 'reorder',
      blocks: ['uno', 'dos', 'tres'],
      correctOrder: [2, 0, 1]
    });
    const texto = html.replace(/<[^>]*>/g, '\n');
    assert.ok(texto.indexOf('tres') < texto.indexOf('uno'));
    assert.ok(texto.indexOf('uno') < texto.indexOf('dos'));
  });
});
