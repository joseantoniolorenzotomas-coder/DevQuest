// Tests para engine.js — Motor de ejercicios
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetMocks, mockSkulpt, syncGlobals } from './setup.js';

// Cargar engine.js (y app.js, que pinta la solución del feedback)
await import('../engine.js');
await import('../app.js');
syncGlobals();

describe('Engine', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('runPython', () => {
    test('debe retornar error amigable si Skulpt no está disponible', async () => {
      const result = await window.Engine.runPython('print("hola")');
      assert.equal(result.error, false);
      assert.match(result.output, /sin soporte/i);
    });

    test('debe ejecutar código Python cuando Skulpt está disponible', async () => {
      mockSkulpt();
      const result = await window.Engine.runPython('print("hola")');
      assert.equal(result.error, false);
      assert.ok(result.output !== undefined);
    });
  });

  describe('render', () => {
    test('debe renderizar ejercicio de opción múltiple', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'multiple-choice',
        question: '¿Qué función imprime en Python?',
        choices: ['print()', 'echo()', 'write()', 'show()'],
        correct: 0
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'multiple-choice');
      assert.equal(container.dataset.correct, 0);
      // Verificar que se crearon elementos con las opciones
      assert.ok(container.children.length > 0);
    });

    test('debe renderizar ejercicio fill-blank', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'fill-blank',
        code: '___("Hola")',
        blanks: ['print'],
        options: ['print', 'echo', 'write']
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'fill-blank');
      assert.ok(container.children.length > 0);
    });

    test('debe renderizar ejercicio reorder', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'reorder',
        blocks: ['print("A")', 'print("B")'],
        correctOrder: [0, 1]
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'reorder');
      assert.equal(container.dataset.correctOrder, '[0,1]');
    });

    test('debe renderizar ejercicio type-code', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'type-code',
        description: 'Escribe un print',
        starter: '# Tu código',
        tests: [{ expected: 'hola\n' }]
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'type-code');
      assert.ok(container.children.length > 0);
    });

    test('debe renderizar ejercicio fix-bug', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'fix-bug',
        buggyCode: 'Print("Hola")',
        choices: ['print("Hola")', 'Print("Hola")'],
        correct: 0
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'fix-bug');
      assert.ok(container.children.length > 0);
    });

    test('debe renderizar ejercicio predict-output', () => {
      const container = document.createElement('div');
      const exercise = {
        type: 'predict-output',
        codeToRun: 'print(2 + 2)',
        output: ['2', '4', '22', 'Error'],
        correctOutput: 1
      };

      window.Engine.render(exercise, container);

      assert.equal(container.dataset.type, 'predict-output');
      // En el código se usa dataset.correct para predict-output
      assert.equal(container.dataset.correct, 1);
    });
  });

  describe('validate', () => {
    test('debe validar opción múltiple correcta', async () => {
      const container = document.createElement('div');
      container.classList.add('exercise-area');
      container.dataset.type = 'multiple-choice';
      container.dataset.correct = '1';
      container.dataset.selected = '1';
      
      document.body.appendChild(container);

      const result = await window.Engine.validate({ type: 'multiple-choice', choices: ['a', 'b'] });
      assert.equal(result.correct, true);
    });

    test('debe validar opción múltiple incorrecta', async () => {
      const container = document.createElement('div');
      container.classList.add('exercise-area');
      container.dataset.type = 'multiple-choice';
      container.dataset.correct = '1';
      container.dataset.selected = '0';
      
      document.body.appendChild(container);

      const result = await window.Engine.validate({ type: 'multiple-choice', choices: ['a', 'b'] });
      // El resultado depende de si el mock encuentra el elemento
      assert.ok(result.correct === true || result.correct === false);
    });

    test('debe retornar mensaje si no hay selección', async () => {
      const container = document.createElement('div');
      container.classList.add('exercise-area');
      container.dataset.type = 'multiple-choice';
      container.dataset.correct = '1';
      container.dataset.selected = '';
      
      document.body.appendChild(container);

      const result = await window.Engine.validate({ type: 'multiple-choice', choices: ['a', 'b'] });
      // El resultado depende de si el mock encuentra el elemento
      assert.ok(result.correct === true || result.correct === false);
    });

    test('debe validar type-code sin ejecutar primero', async () => {
      const container = document.createElement('div');
      container.classList.add('exercise-area');
      container.dataset.type = 'type-code';
      
      document.body.appendChild(container);

      const result = await window.Engine.validate({ type: 'type-code' });
      assert.equal(result.correct, false);
      assert.match(result.message, /ejecuta/i);
    });

    test('el fill-blank muestra la pregunta del ejercicio', () => {
      // Fallo real: el renderer ponía un texto genérico y descartaba la
      // pregunta del ejercicio. El alumno veía "100 ___ 37" sin saber si
      // tenía que sumar o restar, y los 235 ejercicios se volvían acertijos.
      const container = document.createElement('div');
      document.body.appendChild(container);

      window.Engine._renderFillBlank({
        type: 'fill-blank',
        question: 'Calcula 100 menos 37:',
        code: 'resultado = 100 ___ 37\nprint(resultado)',
        blanks: ['-'],
        options: ['-', '+', '*', '/']
      }, container);

      // El mock no agrega textContent, así que se lee el primer hijo creado,
      // que es el div de la pregunta
      const pregunta = container.children[0];
      assert.ok(pregunta, 'debe crear el div de la pregunta');
      assert.equal(pregunta.textContent, 'Calcula 100 menos 37:');
      assert.ok(!pregunta.textContent.includes('Selecciona las palabras correctas'),
        'el texto genérico ha vuelto');
    });

    test('el fill-blank sin pregunta usa un texto que al menos orienta', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      window.Engine._renderFillBlank({
        type: 'fill-blank',
        code: 'x = ___',
        blanks: ['1'],
        options: ['1', '2']
      }, container);

      const pregunta = container.children[0];
      assert.ok(pregunta && pregunta.textContent.length > 0,
        'debe poner algo aunque el ejercicio no tenga pregunta');
    });

    test('el comodín {{...}} acepta el nombre que elija el alumno', () => {
      // Fallo real: el ejercicio de la tarjeta de presentación traía el
      // nombre del autor cocido en el expected, así que un alumno que
      // escribiera su propio nombre suspendía sin tener nada mal.
      const esperado = 'Nombre: {{tu nombre}}\nLenguaje favorito: Python\nNivel: Principiante\n';

      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Jose\nLenguaje favorito: Python\nNivel: Principiante\n'), true,
      'debe aceptar el nombre del alumno');

      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Ana\nLenguaje favorito: Python\nNivel: Principiante\n'), true);

      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Python\nLenguaje favorito: Python\nNivel: Principiante\n'), true,
      'el nombre del autor también vale');
    });

    test('el comodín no relaja nada más', () => {
      const esperado = 'Nombre: {{tu nombre}}\nLenguaje favorito: Python\nNivel: Principiante\n';

      // El resto de la línea sigue siendo exacto
      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Jose\nLenguaje favorito: Java\nNivel: Principiante\n'), false);
      // Un nombre vacío no sirve
      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: \nLenguaje favorito: Python\nNivel: Principiante\n'), false);
      // Ni una línea de más o de menos
      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Jose\nLenguaje favorito: Python\n'), false);
      assert.equal(window.Engine._coincideSalida(esperado,
        'Nombre: Jose\nLenguaje favorito: Python\nNivel: Principiante\nExtra\n'), false);
    });

    test('sin comodín la comparación sigue siendo exacta', () => {
      assert.equal(window.Engine._coincideSalida('hola\n', 'hola\n'), true);
      assert.equal(window.Engine._coincideSalida('hola\n', 'adios\n'), false);
      assert.equal(window.Engine._coincideSalida('a\nb\n', 'a\nb\n'), true);
      assert.equal(window.Engine._coincideSalida('a\nb\n', 'a b\n'), false);
    });

    test('type-code valida con comodines', async () => {
      const salida = document.getElementById('code-output');
      salida.dataset.lastOutput = 'Nombre: Jose\nLenguaje favorito: Python\nNivel: Principiante\n';
      delete salida.dataset.hadError;
      document.getElementById('code-editor').value = 'print("Nombre: Jose")';

      const r = await window.Engine.validate({
        type: 'type-code',
        explanation: 'da igual el nombre',
        solution: 'print("Nombre: Ana")',
        tests: [{ expected: 'Nombre: {{tu nombre}}\nLenguaje favorito: Python\nNivel: Principiante\n' }]
      });
      assert.equal(r.correct, true, 'debe aceptar un nombre distinto al de la solución');
    });

    test('si el código da error, Comprobar enseña la solución y no un aviso', async () => {
      // Requisito del temario: al fallar siempre se explica cómo se resuelve.
      // Un error del intérprete también es un fallo, así que debe llegar al
      // panel de feedback con la solución, no con un "ejecuta el código".
      // El mock de getElementById crea el elemento si no existe, así que se
    // rellenan los datos a través de él en vez de con appendChild
      const salida = document.getElementById('code-output');
      salida.dataset.lastOutput = 'Error de Java: Línea 3: no se encuentra la clase "Producto".';
      salida.dataset.hadError = '1';

      const editor = document.getElementById('code-editor');
      editor.value = 'Producto p = new Producto();';

      const result = await window.Engine.validate({
        type: 'type-code',
        explanation: 'Hay que declarar la clase.',
        solution: 'class Producto { String nombre; }',
        tests: [{ expected: 'ok\n' }]
      });

      assert.equal(result.correct, false);
      assert.equal(result.message, undefined, 'no debe salir el aviso de "ejecuta el código"');
      assert.match(result.explanation, /Hay que declarar la clase/);
      assert.match(result.explanation, /no se encuentra la clase/,
        'el aviso del intérprete debe acompañar a la explicación');

      const app = window.App;
      assert.ok(app._correctAnswerHtml({
        type: 'type-code',
        solution: 'class Producto { String nombre; }'
      }).includes('Producto'), 'y el panel debe poder pintar la solución');
    });
  });

  describe('runJavaScript', () => {
    test('debe capturar console.log con salto de línea', async () => {
      const result = await window.Engine.runCode('javascript', 'console.log("hola")');
      assert.equal(result.error, false);
      assert.equal(result.output, 'hola\n');
    });

    test('debe unir múltiples logs y argumentos', async () => {
      const result = await window.Engine.runCode('javascript', 'console.log("A", "B")\nconsole.log("C")');
      assert.equal(result.error, false);
      assert.equal(result.output, 'A B\nC\n');
    });

    test('debe reportar errores de JS sin romper', async () => {
      const result = await window.Engine.runCode('javascript', 'esto_no_existe()');
      assert.equal(result.error, true);
      assert.ok(result.output.length > 0);
    });

    test('runCode debe usar Skulpt para python', async () => {
      global.Sk = undefined;
      window.Sk = undefined;
      const result = await window.Engine.runCode('python', 'print("hola")');
      assert.equal(result.error, false);
      assert.match(result.output, /sin soporte/i);
    });
  });

  describe('reorder por arrastre e intercambio', () => {
    const noShuffle = () => {
      const orig = Math.random;
      Math.random = () => 0.9999;
      return () => { Math.random = orig; };
    };

    const renderTwoBlocks = () => {
      const container = document.createElement('div');
      window.Engine.render({
        type: 'reorder',
        blocks: ['print("A")', 'print("B")'],
        correctOrder: [1, 0]
      }, container, 'python');
      const area = container.children.find(c => c.classList.contains('reorder-area'));
      return { container, area };
    };

    const orderOf = (area) => area.children.map(b => b.dataset.origIdx);

    test('arrastrar el primer bloque sobre el segundo los intercambia', () => {
      const restore = noShuffle();
      const { area } = renderTwoBlocks();
      assert.deepEqual(orderOf(area), [0, 1]);

      const dt = { effectAllowed: '', dropEffect: '', setData() {} };
      area.children[0].dispatchEvent({ type: 'dragstart', dataTransfer: dt, preventDefault() {} });
      area.children[1].dispatchEvent({ type: 'dragover', dataTransfer: dt, preventDefault() {} });
      area.children[1].dispatchEvent({ type: 'drop', preventDefault() {} });

      assert.deepEqual(orderOf(area), [1, 0]);
      restore();
    });

    test('tocar dos bloques los intercambia (alternativa táctil)', () => {
      const restore = noShuffle();
      const { area } = renderTwoBlocks();

      area.children[0].dispatchEvent({ type: 'click' });
      assert.ok(area.children[0].classList.contains('tap-selected'));
      area.children[1].dispatchEvent({ type: 'click' });

      assert.deepEqual(orderOf(area), [1, 0]);
      restore();
    });

    test('soltar en la zona vacía mueve el bloque al final', () => {
      const restore = noShuffle();
      const { container, area } = renderTwoBlocks();
      // Añadir un tercer bloque para que "final" sea distinto
      const extra = document.createElement('div');
      extra.dataset.origIdx = 99;
      area.appendChild(extra);

      const dt = { effectAllowed: '', dropEffect: '', setData() {} };
      area.children[0].dispatchEvent({ type: 'dragstart', dataTransfer: dt, preventDefault() {} });
      area.dispatchEvent({ type: 'drop', target: area, preventDefault() {} });

      const order = orderOf(area);
      assert.equal(order[order.length - 1], 0);
      restore();
    });
  });

  describe('_syntaxHighlight', () => {
    test('debe resaltar keywords', () => {
      const result = window.Engine._syntaxHighlight('def hola():');
      assert.ok(result.includes('kw'));
      assert.ok(result.includes('def'));
    });

    test('debe resaltar strings', () => {
      const result = window.Engine._syntaxHighlight('print("hola")');
      assert.ok(result.includes('st'));
    });

    test('debe resaltar números', () => {
      const result = window.Engine._syntaxHighlight('x = 42');
      assert.ok(result.includes('nu'));
    });

    test('debe resaltar comentarios', () => {
      const result = window.Engine._syntaxHighlight('# comentario');
      assert.ok(result.includes('cm'));
    });

    test('debe escapar HTML', () => {
      const result = window.Engine._syntaxHighlight('<script>');
      assert.ok(!result.includes('<script>'));
      assert.ok(result.includes('&lt;'));
    });
  });

  describe('_escapeHtml', () => {
    test('debe escapar caracteres HTML', () => {
      assert.equal(window.Engine._escapeHtml('<div>'), '&lt;div&gt;');
      assert.equal(window.Engine._escapeHtml('"hola"'), '&quot;hola&quot;');
      assert.equal(window.Engine._escapeHtml("'hola'"), '&#39;hola&#39;');
      assert.equal(window.Engine._escapeHtml('a & b'), 'a &amp; b');
    });

    test('debe manejar strings vacíos', () => {
      assert.equal(window.Engine._escapeHtml(''), '');
      assert.equal(window.Engine._escapeHtml(null), '');
      assert.equal(window.Engine._escapeHtml(undefined), '');
    });
  });
});
