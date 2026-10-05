// JavaScript Curriculum — Módulo 1: Tu Primer Programa
// Réplica de la estructura de Python. Más módulos en próximas sesiones.

window.JS_CURRICULUM = [
  {
    id: 'js-mod1',
    title: 'Tu Primer Programa',
    subtitle: 'Empieza a hablar con el navegador',
    icon: '🐣',
    color: '#F7DF1E',
    gradient: 'linear-gradient(135deg, #F7DF1E 0%, #E8A800 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'js-mod1-les1',
        title: '¡Hola, Mundo!',
        icon: '👋',
        exercises: [
          {
            id: 'jse001', type: 'multiple-choice', xp: 10,
            question: '¿Qué función se usa en JavaScript para mostrar texto en la consola?',
            choices: ['print()', 'console.log()', 'echo()', 'mostrar()'],
            correct: 1,
            explanation: 'console.log() es la función fundamental de JavaScript para mostrar información en la consola.'
          },
          {
            id: 'jse002', type: 'fill-blank', xp: 15,
            question: 'Completa el código para imprimir "Hola, Mundo":',
            code: '___.___("Hola, Mundo")',
            blanks: ['console', 'log'],
            options: ['console', 'log', 'print', 'echo'],
            explanation: 'Se escribe console, un punto y log(). El texto va entre paréntesis y comillas.'
          },
          {
            id: 'jse003', type: 'predict-output', xp: 15,
            question: '¿Qué aparece en la consola al ejecutar este código?',
            codeToRun: 'console.log("JavaScript")',
            output: ['javascript', 'JavaScript', '"JavaScript"', 'Error'],
            correctOutput: 1,
            explanation: 'JavaScript distingue mayúsculas de minúsculas. Se imprime exactamente lo que está entre comillas.'
          },
          {
            id: 'jse004', type: 'multiple-choice', xp: 10,
            question: '¿Cuál de estos es un programa JavaScript válido?',
            choices: ['console.log["Hola"]', 'console.log("Hola")', 'CONSOLE.LOG("Hola")', 'Console.Log("Hola")'],
            correct: 1,
            explanation: 'JavaScript es sensible a mayúsculas. Se usa console.log() en minúsculas, con paréntesis.'
          },
          {
            id: 'jse005', type: 'fill-blank', xp: 20,
            question: 'Imprime tu lenguaje favorito:',
            code: 'console.log(___)',
            blanks: ['"JavaScript"'],
            options: ['"JavaScript"', 'JavaScript', '(JavaScript)', '[JavaScript]'],
            explanation: 'Los textos en JavaScript siempre van entre comillas, simples o dobles.'
          },
          {
            id: 'jse006', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log("1 + 1")',
            output: ['2', '1 + 1', 'Error', '"1 + 1"'],
            correctOutput: 1,
            explanation: 'Dentro de las comillas, "1 + 1" es texto, no una operación matemática.'
          }
        ]
      },
      {
        id: 'js-mod1-les2',
        title: 'Múltiples Logs',
        icon: '🖨️',
        exercises: [
          {
            id: 'jse007', type: 'predict-output', xp: 15,
            question: '¿Cuántas líneas imprime este código?',
            codeToRun: 'console.log("Línea 1")\nconsole.log("Línea 2")\nconsole.log("Línea 3")',
            output: ['1', '2', '3', '0'],
            correctOutput: 2,
            explanation: 'Cada console.log() imprime en una nueva línea.'
          },
          {
            id: 'jse008', type: 'reorder', xp: 20,
            question: 'Ordena el código para imprimir "Hola" y luego "Mundo":',
            blocks: ['console.log("Mundo")', 'console.log("Hola")'],
            correctOrder: [1, 0],
            explanation: 'JavaScript ejecuta las instrucciones de arriba a abajo.'
          },
          {
            id: 'jse009', type: 'fill-blank', xp: 20,
            question: 'Completa para imprimir dos cosas:',
            code: 'console.log("JavaScript")\n___.___("es genial")',
            blanks: ['console', 'log'],
            options: ['console', 'log', 'print', 'echo'],
            explanation: 'Usamos console.log() para cada línea que queremos mostrar.'
          },
          {
            id: 'jse010', type: 'multiple-choice', xp: 15,
            question: '¿Qué imprime console.log() sin argumentos?',
            choices: ['Nada, da error', 'undefined', '" "', 'null'],
            correct: 1,
            explanation: 'console.log() sin argumentos imprime undefined.'
          },
          {
            id: 'jse011', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log("A", "B", "C")',
            output: ['ABC', 'A B C', 'A, B, C', 'Error'],
            correctOutput: 1,
            explanation: 'console.log() separa múltiples argumentos con un espacio por defecto.'
          },
          {
            id: 'jse012', type: 'type-code', xp: 30,
            explanation: 'console.log() escribe en la consola y añade un salto de línea. Se necesita una llamada por cada línea que quieres ver.',
            description: 'Escribe un programa que imprima exactamente:\n¡Hola!\nBienvenido a DevQuest',
            starter: '// Escribe tu código aquí\n',
            solution: 'console.log("¡Hola!")\nconsole.log("Bienvenido a DevQuest")',
            tests: [{ expected: '¡Hola!\nBienvenido a DevQuest\n' }]
          }
        ]
      },
      {
        id: 'js-mod1-les3',
        title: 'Comentarios',
        icon: '💬',
        exercises: [
          {
            id: 'jse013', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se escribe un comentario de una línea en JavaScript?',
            choices: ['# Comentario', '// Comentario', '<!-- Comentario -->', '-- Comentario'],
            correct: 1,
            explanation: 'JavaScript usa // para comentarios de una sola línea.'
          },
          {
            id: 'jse014', type: 'fill-blank', xp: 15,
            question: 'Añade un comentario antes del log:',
            code: '___ Este código dice hola\nconsole.log("Hola")',
            blanks: ['//'],
            options: ['//', '#', '/*', '--'],
            explanation: 'El símbolo // indica que todo lo que sigue es un comentario.'
          },
          {
            id: 'jse015', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: '// console.log("Esto no aparece")\nconsole.log("Esto sí aparece")',
            output: ['Esto no aparece', 'Esto sí aparece', 'Ambas líneas', 'Error'],
            correctOutput: 1,
            explanation: 'Los comentarios son ignorados por JavaScript. Solo se ejecuta la segunda línea.'
          },
          {
            id: 'jse016', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirven los comentarios?',
            choices: ['Hacen el código más rápido', 'Explican el código para humanos', 'Son obligatorios en JavaScript', 'Ejecutan código especial'],
            correct: 1,
            explanation: 'Los comentarios son notas para los programadores. JavaScript los ignora completamente.'
          },
          {
            id: 'jse017', type: 'fill-blank', xp: 20,
            question: 'Completa el programa con un comentario explicativo:',
            code: '___ Saludar al usuario\nconsole.log("¡Bienvenido!")',
            blanks: ['//'],
            options: ['//', '#', 'rem', 'note'],
            explanation: '// es la forma de JavaScript para comentar una línea.'
          },
          {
            id: 'jse018', type: 'predict-output', xp: 20,
            question: '¿Cuántas líneas se imprimen?',
            codeToRun: 'console.log("Primera")\n// console.log("Segunda")\nconsole.log("Tercera")',
            output: ['1', '2', '3', '0'],
            correctOutput: 1,
            explanation: 'Solo se ejecutan "Primera" y "Tercera". La línea con // es un comentario.'
          }
        ]
      },
      {
        id: 'js-mod1-les4',
        title: 'Tu Primera App',
        icon: '🚀',
        exercises: [
          {
            id: 'jse019', type: 'reorder', xp: 25,
            question: 'Ordena el código para crear un programa que salude:',
            blocks: ['console.log("¡Hasta pronto!")', '// Programa de saludo', 'console.log("¡Hola, JS!")'],
            correctOrder: [1, 2, 0],
            explanation: 'Es buena práctica poner comentarios al inicio, luego el código principal.'
          },
          {
            id: 'jse020', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la extensión de los archivos JavaScript?',
            choices: ['.java', '.js', '.javascript', '.jsx siempre'],
            correct: 1,
            explanation: 'Los archivos JavaScript tienen extensión .js, como "mi_programa.js".'
          },
          {
            id: 'jse021', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este programa?',
            codeToRun: 'console.log("Nombre:", "Ana")\nconsole.log("Edad:", 25)',
            output: ['Nombre: Ana\nEdad: 25', 'Nombre:Ana\nEdad:25', 'Error', 'Ana\n25'],
            correctOutput: 0,
            explanation: 'console.log() con múltiples argumentos los separa con espacio.'
          },
          {
            id: 'jse022', type: 'fix-bug', xp: 25,
            question: 'Este código tiene un error. ¿Cuál es el correcto?',
            buggyCode: 'Console.Log("Hola, Mundo")',
            fixedCode: 'console.log("Hola, Mundo")',
            choices: ['Console.Log("Hola, Mundo")', 'console.log("Hola, Mundo")', 'CONSOLE.LOG("Hola, Mundo")', 'console.log["Hola, Mundo"]'],
            correct: 1,
            explanation: 'JavaScript distingue mayúsculas. Debe ser console.log() en minúsculas.'
          },
          {
            id: 'jse023', type: 'type-code', xp: 35,
            explanation: 'console.log() separa con un espacio los argumentos que le pases. Cada línea de la tarjeta es una llamada distinta.',
            description: 'Crea tu tarjeta de presentación:\n• Línea 1: "Nombre: " + tu nombre\n• Línea 2: "Lenguaje favorito: JavaScript"\n• Línea 3: "Nivel: Principiante"',
            starter: '// Mi tarjeta de presentación\n',
            solution: 'console.log("Nombre: JS")\nconsole.log("Lenguaje favorito: JavaScript")\nconsole.log("Nivel: Principiante")',
            tests: [{ expected: 'Nombre: JS\nLenguaje favorito: JavaScript\nNivel: Principiante\n' }]
          },
          {
            id: 'jse024', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se ejecuta JavaScript normalmente?',
            choices: ['Solo en servidores', 'En el navegador y en servidores (Node.js)', 'Solo en móviles', 'Solo en bases de datos'],
            correct: 1,
            explanation: 'JavaScript nació en el navegador y con Node.js también corre en servidores.'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 2: VARIABLES Y TIPOS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod2',
    title: 'Variables y Tipos',
    subtitle: 'Guarda y manipula información',
    icon: '📦',
    color: '#4FACFE',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'js-mod2-les1',
        title: 'Variables',
        icon: '🏷️',
        exercises: [
          {
            id: 'jse025', type: 'multiple-choice', xp: 10,
            question: '¿Qué palabra se usa para crear una variable que puede cambiar?',
            choices: ['variable', 'let', 'constante', 'make'],
            correct: 1,
            explanation: 'let crea una variable que puede cambiar. const es para valores que no cambian.'
          },
          {
            id: 'jse026', type: 'fill-blank', xp: 15,
            question: 'Crea una variable llamada "edad" con valor 20:',
            code: '___ edad = 20',
            blanks: ['let'],
            options: ['let', 'const', 'var', 'variable'],
            explanation: 'Empezamos declarando la variable con let, luego su nombre y el valor con =.'
          },
          {
            id: 'jse027', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let nombre = "Ana"\nconsole.log(nombre)',
            output: ['"Ana"', 'nombre', 'Ana', 'Error'],
            correctOutput: 2,
            explanation: 'console.log(nombre) imprime el valor guardado en la variable, no el nombre de la variable.'
          },
          {
            id: 'jse028', type: 'multiple-choice', xp: 15,
            question: '¿Cuál nombre de variable es VÁLIDO en JavaScript?',
            choices: ['mi-nombre', '1nombre', 'mi_nombre', 'let'],
            correct: 2,
            explanation: 'mi_nombre es válido. No valen guiones, empezar con número ni palabras reservadas como let.'
          },
          {
            id: 'jse029', type: 'fill-blank', xp: 20,
            question: 'Imprime el valor de la variable ciudad:',
            code: 'let ciudad = "Madrid"\nconsole.log(___)',
            blanks: ['ciudad'],
            options: ['ciudad', '"ciudad"', '(ciudad)', 'Madrid'],
            explanation: 'Para imprimir una variable, escribe su nombre sin comillas en console.log().'
          },
          {
            id: 'jse030', type: 'fix-bug', xp: 25,
            question: '¿Cuál es la versión correcta?',
            buggyCode: 'let 1ciudad = "Madrid"',
            fixedCode: 'let ciudad = "Madrid"',
            choices: ['let 1ciudad = "Madrid"', 'let ciudad = "Madrid"', 'let "ciudad" = "Madrid"', 'ciudad = "Madrid"'],
            correct: 1,
            explanation: 'Los nombres de variable no pueden empezar con número.'
          }
        ]
      },
      {
        id: 'js-mod2-les2',
        title: 'Números',
        icon: '🔢',
        exercises: [
          {
            id: 'jse031', type: 'multiple-choice', xp: 10,
            question: '¿Qué tipo de dato es el número 42 en JavaScript?',
            choices: ['number', 'int', 'float', 'string'],
            correct: 0,
            explanation: 'JavaScript tiene un único tipo numérico: number (vale para enteros y decimales).'
          },
          {
            id: 'jse032', type: 'fill-blank', xp: 15,
            question: 'Guarda el número 100 en una variable:',
            code: 'let puntuacion = ___',
            blanks: ['100'],
            options: ['100', '"100"', '(100)', '[100]'],
            explanation: 'Los números se escriben sin comillas.'
          },
          {
            id: 'jse033', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let x = 10\nlet y = 3\nconsole.log(x + y)',
            output: ['10', '3', '13', '103'],
            correctOutput: 2,
            explanation: 'JavaScript suma los valores numéricos: 10 + 3 = 13.'
          },
          {
            id: 'jse034', type: 'multiple-choice', xp: 15,
            question: '¿Cómo sabes el tipo de una variable?',
            choices: ['typeof miVar', 'type(miVar)', 'kind(miVar)', 'datatype(miVar)'],
            correct: 0,
            explanation: 'typeof es un operador: typeof 42 devuelve "number".'
          },
          {
            id: 'jse035', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let x = 5\nx = 10\nconsole.log(x)',
            output: ['5', '10', '15', 'Error'],
            correctOutput: 1,
            explanation: 'Las variables creadas con let pueden cambiar de valor. x fue reasignada a 10.'
          },
          {
            id: 'jse036', type: 'type-code', xp: 30,
            explanation: 'let crea una variable de bloque, que es la forma recomendada. Con manzanas + naranjas se suman los valores y se imprime 8.',
            description: 'Crea dos variables: "manzanas" con valor 5 y "naranjas" con valor 3. Imprime la suma.',
            starter: '// Variables de frutas\n',
            solution: 'let manzanas = 5\nlet naranjas = 3\nconsole.log(manzanas + naranjas)',
            tests: [{ expected: '8\n' }]
          }
        ]
      },
      {
        id: 'js-mod2-les3',
        title: 'Decimales y Texto',
        icon: '📝',
        exercises: [
          {
            id: 'jse037', type: 'multiple-choice', xp: 10,
            question: '¿Qué devuelve typeof 3.14?',
            choices: ['int', 'double', 'number', 'decimal'],
            correct: 2,
            explanation: 'En JavaScript los decimales también son de tipo number.'
          },
          {
            id: 'jse038', type: 'fill-blank', xp: 15,
            question: 'Crea una variable con el precio de algo:',
            code: 'let precio = ___',
            blanks: ['9.99'],
            options: ['9.99', '"9.99"', '9,99', '9-99'],
            explanation: 'Los decimales usan punto (.) no coma (,).'
          },
          {
            id: 'jse039', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama el tipo de dato para texto en JavaScript?',
            choices: ['text', 'string', 'str', 'char'],
            correct: 1,
            explanation: 'El tipo para texto es string. Ejemplo: let nombre = "Ana".'
          },
          {
            id: 'jse040', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let precio = 2.5\nlet cantidad = 3\nconsole.log(precio * cantidad)',
            output: ['5.5', '7.5', '2.53', 'Error'],
            correctOutput: 1,
            explanation: '2.5 × 3 = 7.5. JavaScript puede multiplicar decimales y enteros.'
          },
          {
            id: 'jse041', type: 'fill-blank', xp: 20,
            question: 'Completa con el tipo correcto:',
            code: 'let nombre = ___\nlet edad = ___\nlet altura = ___',
            blanks: ['"Luis"', '25', '1.75'],
            options: ['"Luis"', '25', '1.75', 'Luis', '"25"', '"1.75"'],
            explanation: 'Texto entre comillas, enteros sin decimales, decimales con punto.'
          },
          {
            id: 'jse042', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(typeof "hola")',
            output: ['string', 'text', 'str', 'Error'],
            correctOutput: 0,
            explanation: 'typeof devuelve el tipo como texto. "hola" es de tipo string.'
          }
        ]
      },
      {
        id: 'js-mod2-les4',
        title: 'Booleanos',
        icon: '✅',
        exercises: [
          {
            id: 'jse043', type: 'multiple-choice', xp: 10,
            question: '¿Cuántos valores posibles tiene un booleano?',
            choices: ['1', '2', '10', 'Infinitos'],
            correct: 1,
            explanation: 'Un booleano solo puede ser true o false.'
          },
          {
            id: 'jse044', type: 'fill-blank', xp: 15,
            question: 'Crea una variable booleana:',
            code: 'let activo = ___',
            blanks: ['true'],
            options: ['true', 'false', '"true"', '1'],
            explanation: 'En JavaScript los booleanos se escriben true y false (en minúsculas).'
          },
          {
            id: 'jse045', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(5 > 3)',
            output: ['5', '3', 'true', 'false'],
            correctOutput: 2,
            explanation: '5 es mayor que 3, así que la comparación devuelve true.'
          },
          {
            id: 'jse046', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(10 === 10)\nconsole.log(5 === 3)',
            output: ['true\ntrue', 'true\nfalse', 'false\ntrue', 'false\nfalse'],
            correctOutput: 1,
            explanation: '10 === 10 es true. 5 === 3 es false. === compara sin convertir tipos.'
          },
          {
            id: 'jse047', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el tipo de dato de true en JavaScript?',
            choices: ['int', 'string', 'boolean', 'number'],
            correct: 2,
            explanation: 'true y false son de tipo boolean.'
          },
          {
            id: 'jse048', type: 'fill-blank', xp: 20,
            question: 'Completa la comparación:',
            code: 'let mayor = 10 ___ 5\nconsole.log(mayor)',
            blanks: ['>'],
            options: ['>', '<', '=', '>='],
            explanation: '> es el operador "mayor que". 10 > 5 devuelve true.'
          }
        ]
      },
      {
        id: 'js-mod2-les5',
        title: 'Conversión de Tipos',
        icon: '🔄',
        exercises: [
          {
            id: 'jse049', type: 'multiple-choice', xp: 10,
            question: '¿Cómo conviertes el string "42" a número?',
            choices: ['string(42)', 'Number("42")', 'to_number("42")', 'Integer("42")'],
            correct: 1,
            explanation: 'Number() convierte un string a número: Number("42") da 42.'
          },
          {
            id: 'jse050', type: 'fill-blank', xp: 20,
            question: 'Convierte el texto a número:',
            code: 'let texto = "25"\nlet numero = ___(texto)\nconsole.log(numero + 5)',
            blanks: ['Number'],
            options: ['Number', 'String', 'Boolean', 'Parse'],
            explanation: 'Number() convierte strings a números para poder operar con ellos.'
          },
          {
            id: 'jse051', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let num = 42\nlet texto = String(num)\nconsole.log(texto + "!")',
            output: ['43!', '42!', '"42"!', 'Error'],
            correctOutput: 1,
            explanation: 'String(42) convierte el número al string "42". Luego "42" + "!" = "42!".'
          },
          {
            id: 'jse052', type: 'multiple-choice', xp: 15,
            question: '¿Qué convierte "3.14" a número decimal?',
            choices: ['parseInt("3.14")', 'Number("3.14")', 'decimal("3.14")', 'toDecimal("3.14")'],
            correct: 1,
            explanation: 'Number() convierte strings a números (parseInt lo cortaría a 3).'
          },
          {
            id: 'jse053', type: 'fix-bug', xp: 25,
            question: 'Este código imprime "205" en vez de 25. ¿Cuál es el correcto?',
            buggyCode: 'let edad = "20"\nconsole.log(edad + 5)',
            fixedCode: 'let edad = "20"\nconsole.log(Number(edad) + 5)',
            choices: ['console.log(edad + 5)', 'console.log(Number(edad) + 5)', 'console.log(String(edad) + 5)', 'console.log(edad + "5")'],
            correct: 1,
            explanation: 'Con strings, + concatena ("20" + 5 = "205"). Convierte a número primero.'
          },
          {
            id: 'jse054', type: 'type-code', xp: 35,
            explanation: 'Un string con número se puede concatenar con * (repitiendo el texto), por eso hay que convertirlo: Number("7") * 6 da 42.',
            description: 'Convierte el string "7" a número, multiplícalo por 6 e imprime el resultado.',
            starter: 'let numero = "7"\n// Tu código aquí\n',
            solution: 'let numero = "7"\nlet resultado = Number(numero) * 6\nconsole.log(resultado)',
            tests: [{ expected: '42\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 3: OPERACIONES MATEMÁTICAS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod3',
    title: 'Operaciones Matemáticas',
    subtitle: 'JavaScript como calculadora poderosa',
    icon: '🔢',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'js-mod3-les1',
        title: 'Suma, Resta y Multiplicación',
        icon: '➕',
        exercises: [
          {
            id: 'jse055', type: 'predict-output', xp: 10,
            question: '¿Cuánto es 15 + 8?',
            codeToRun: 'console.log(15 + 8)',
            output: ['7', '23', '158', 'Error'],
            correctOutput: 1,
            explanation: '15 + 8 = 23. JavaScript hace las sumas como una calculadora.'
          },
          {
            id: 'jse056', type: 'fill-blank', xp: 15,
            question: 'Calcula 100 menos 37:',
            code: 'let resultado = 100 ___ 37\nconsole.log(resultado)',
            blanks: ['-'],
            options: ['-', '+', '*', '/'],
            explanation: 'El operador - se usa para la resta.'
          },
          {
            id: 'jse057', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(6 * 7)',
            output: ['13', '42', '67', '6.7'],
            correctOutput: 1,
            explanation: '6 × 7 = 42. El operador * es la multiplicación.'
          },
          {
            id: 'jse058', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el operador de multiplicación en JavaScript?',
            choices: ['x', '×', '*', '·'],
            correct: 2,
            explanation: 'JavaScript usa * para multiplicar: 3 * 4 = 12.'
          },
          {
            id: 'jse059', type: 'reorder', xp: 25,
            question: 'Ordena para calcular el área (base × altura):',
            blocks: ['let area = base * altura', 'let base = 5', 'console.log(area)', 'let altura = 3'],
            correctOrder: [1, 3, 0, 2],
            explanation: 'Primero define las variables, luego calcula, por último imprime.'
          },
          {
            id: 'jse060', type: 'type-code', xp: 30,
            explanation: 'Cada línea hace una operación distinta: 30, 24 y 20. El asterisco es el operador de multiplicación.',
            description: 'Calcula e imprime: el doble de 15, el triple de 8 y el cuádruple de 5.',
            starter: '// Tus cálculos aquí\n',
            solution: 'console.log(15 * 2)\nconsole.log(8 * 3)\nconsole.log(5 * 4)',
            tests: [{ expected: '30\n24\n20\n' }]
          }
        ]
      },
      {
        id: 'js-mod3-les2',
        title: 'División, Módulo y Potencia',
        icon: '➗',
        exercises: [
          {
            id: 'jse061', type: 'predict-output', xp: 15,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(10 / 4)',
            output: ['2', '2.5', '2,5', 'Error'],
            correctOutput: 1,
            explanation: 'La división / en JavaScript devuelve decimales: 10 / 4 = 2.5.'
          },
          {
            id: 'jse062', type: 'predict-output', xp: 20,
            question: '¿Qué imprime 10 % 3?',
            codeToRun: 'console.log(10 % 3)',
            output: ['3', '1', '0.33', '3.33'],
            correctOutput: 1,
            explanation: '% es el módulo (resto de la división). 10 = 3×3 + 1, así que 10 % 3 = 1.'
          },
          {
            id: 'jse063', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve el operador %?',
            choices: ['Porcentaje', 'Resto de la división', 'División entera', 'Potencia'],
            correct: 1,
            explanation: '% da el resto de dividir. Útil para saber si un número es par (n % 2 === 0).'
          },
          {
            id: 'jse064', type: 'predict-output', xp: 20,
            question: '¿Es 12 un número par?',
            codeToRun: 'console.log(12 % 2 === 0)',
            output: ['true', 'false', '0', 'Error'],
            correctOutput: 0,
            explanation: '12 % 2 = 0 (12 es divisible entre 2, es par). 0 === 0 es true.'
          },
          {
            id: 'jse065', type: 'fill-blank', xp: 25,
            question: 'Potencia: 2 elevado a 8:',
            code: 'let resultado = 2 ___ 8\nconsole.log(resultado)  // 256',
            blanks: ['**'],
            options: ['**', '^', '*', '//'],
            explanation: '** es el operador de potencia en JavaScript. 2**8 = 256.'
          },
          {
            id: 'jse066', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(2 ** 3 + 1)',
            output: ['9', '7', '81', 'Error'],
            correctOutput: 0,
            explanation: 'Primero la potencia (2**3 = 8) y luego la suma: 8 + 1 = 9.'
          }
        ]
      },
      {
        id: 'js-mod3-les3',
        title: 'Comparación: == vs ===',
        icon: '⚖️',
        exercises: [
          {
            id: 'jse067', type: 'multiple-choice', xp: 10,
            question: '¿Qué operador comprueba valor Y tipo sin convertir nada?',
            choices: ['=', '==', '===', '!='],
            correct: 2,
            explanation: '=== es la igualdad estricta. Un solo = es asignación.'
          },
          {
            id: 'jse068', type: 'predict-output', xp: 15,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(5 !== 3)',
            output: ['true', 'false', '2', 'Error'],
            correctOutput: 0,
            explanation: '!== significa "estrictamente diferente". 5 es diferente de 3, así que es true.'
          },
          {
            id: 'jse069', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código? (¡trampa clásica!)',
            codeToRun: 'console.log("5" == 5)',
            output: ['true', 'false', 'Error', '"5"'],
            correctOutput: 0,
            explanation: '== convierte los tipos antes de comparar ("5" se vuelve 5). Por eso preferimos ===.'
          },
          {
            id: 'jse070', type: 'predict-output', xp: 20,
            question: '¿Y este código?',
            codeToRun: 'console.log("5" === 5)',
            output: ['true', 'false', 'Error'],
            correctOutput: 1,
            explanation: '=== NO convierte tipos: un string nunca es igual a un number. Da false.'
          },
          {
            id: 'jse071', type: 'fill-blank', xp: 20,
            question: 'Comprueba si edad es mayor o igual a 18:',
            code: 'let edad = 20\nlet esAdulto = edad ___ 18\nconsole.log(esAdulto)',
            blanks: ['>='],
            options: ['>=', '<=', '>', '<'],
            explanation: '>= significa "mayor o igual que".'
          },
          {
            id: 'jse072', type: 'type-code', xp: 30,
            explanation: 'La comparación > devuelve true o false; al imprimirla se ve ese booleano, no el número.',
            description: 'Crea una variable "temperatura" con valor 37.5. Imprime si es mayor que 36.5 (fiebre).',
            starter: 'let temperatura = 37.5\n',
            solution: 'let temperatura = 37.5\nconsole.log(temperatura > 36.5)',
            tests: [{ expected: 'true\n' }]
          }
        ]
      },
      {
        id: 'js-mod3-les4',
        title: 'Operadores Lógicos',
        icon: '🧠',
        exercises: [
          {
            id: 'jse073', type: 'multiple-choice', xp: 10,
            question: '¿Qué devuelve true && false?',
            choices: ['true', 'false', 'Error', 'undefined'],
            correct: 1,
            explanation: '&& requiere que AMBAS condiciones sean true. Si una es false, el resultado es false.'
          },
          {
            id: 'jse074', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(true || false)',
            output: ['true', 'false', 'Error', 'undefined'],
            correctOutput: 0,
            explanation: '|| devuelve true si AL MENOS UNA condición es true.'
          },
          {
            id: 'jse075', type: 'fill-blank', xp: 20,
            question: 'Comprueba si un número está entre 1 y 10:',
            code: 'let n = 5\nlet entre = n >= 1 ___ n <= 10\nconsole.log(entre)',
            blanks: ['&&'],
            options: ['&&', '||', '!', 'and'],
            explanation: 'Usamos && para que AMBAS condiciones se cumplan.'
          },
          {
            id: 'jse076', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(!true)',
            output: ['true', 'false', '!true', 'Error'],
            correctOutput: 1,
            explanation: '! invierte el booleano: !true es false, !false es true.'
          },
          {
            id: 'jse077', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve false || true || false?',
            choices: ['false', 'true', 'Error', 'undefined'],
            correct: 1,
            explanation: '|| devuelve true si alguna es true. El segundo valor es true, así que el resultado es true.'
          },
          {
            id: 'jse078', type: 'type-code', xp: 35,
            explanation: 'El doble ampersand es el "y" de JavaScript: solo devuelve true si ambos lados son true. Con hayEntradas en false el resultado es false.',
            description: 'Crea variables "tieneDinero" (true) y "hayEntradas" (false). Imprime si puede ir al cine (necesita ambas cosas).',
            starter: 'let tieneDinero = true\nlet hayEntradas = false\n',
            solution: 'let tieneDinero = true\nlet hayEntradas = false\nconsole.log(tieneDinero && hayEntradas)',
            tests: [{ expected: 'false\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 4: STRINGS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod4',
    title: 'Strings',
    subtitle: 'Domina el texto en JavaScript',
    icon: '📝',
    color: '#FA709A',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    level: 'Elemental',
    lessons: [      {
        id: 'js-mod4-les1',
        title: 'Métodos de String',
        icon: '🔧',
        exercises: [
          {
            id: 'jse079', type: 'predict-output', xp: 15,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "hola mundo"\nconsole.log(texto.toUpperCase())',
            output: ['hola mundo', 'HOLA MUNDO', 'Hola Mundo', 'Error'],
            correctOutput: 1,
            explanation: '.toUpperCase() convierte todo el texto a MAYÚSCULAS.'
          },
          {
            id: 'jse080', type: 'fill-blank', xp: 20,
            question: 'Convierte a minúsculas:',
            code: 'let grito = "¡AYUDA!"\nlet silencio = grito.___()\nconsole.log(silencio)',
            blanks: ['toLowerCase'],
            options: ['toLowerCase', 'toUpperCase', 'toTitle', 'toSmall'],
            explanation: '.toLowerCase() convierte todo el texto a minúsculas.'
          },
          {
            id: 'jse081', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código? (¡fíjate bien!)',
            codeToRun: 'console.log("Python".length)',
            output: ['5', '6', '7', 'Error'],
            correctOutput: 1,
            explanation: '.length es una PROPIEDAD (sin paréntesis) y "Python" tiene 6 caracteres.'
          },
          {
            id: 'jse082', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace .trim()?',
            choices: ['Elimina espacios del inicio y final', 'Divide el texto', 'Reemplaza caracteres', 'Cuenta palabras'],
            correct: 0,
            explanation: '.trim() elimina espacios en blanco al inicio y al final del string.'
          },
          {
            id: 'jse083', type: 'fill-blank', xp: 20,
            question: 'Reemplaza "malo" por "bueno":',
            code: 'let frase = "El tiempo malo"\nlet nueva = frase.___("malo", "bueno")\nconsole.log(nueva)',
            blanks: ['replace'],
            options: ['replace', 'swap', 'change', 'sub'],
            explanation: '.replace(viejo, nuevo) reemplaza texto dentro del string.'
          },
          {
            id: 'jse084', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "  hola  "\nconsole.log(texto.trim())',
            output: ['"  hola  "', 'hola', '"hola"', 'Error'],
            correctOutput: 1,
            explanation: '.trim() elimina los espacios del inicio y final.'
          }
        ]
      },
      {
        id: 'js-mod4-les2',
        title: 'Template Literals',
        icon: '✨',
        exercises: [
          {
            id: 'jse085', type: 'multiple-choice', xp: 10,
            question: '¿Cuál es la forma moderna de insertar variables en un string?',
            choices: ['Concatenación con +', 'Template literals con ${}', 'format() viejo', '.printf()'],
            correct: 1,
            explanation: 'Los template literals (`texto ${variable}`) son la forma moderna y recomendada.'
          },
          {
            id: 'jse086', type: 'fill-blank', xp: 20,
            question: 'Completa el template literal:',
            code: 'let nombre = "Carlos"\nconsole.log(`Hola, ${___}!`)',
            blanks: ['nombre'],
            options: ['nombre', 'name', '"nombre"', 'nombre()'],
            explanation: 'Las variables se insertan dentro de ${} en un template literal (comillas invertidas).'
          },
          {
            id: 'jse087', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let edad = 25\nconsole.log(`Tengo ${edad} años`)',
            output: ['Tengo {edad} años', 'Tengo 25 años', 'Tengo edad años', 'Error'],
            correctOutput: 1,
            explanation: '${edad} dentro de un template literal se reemplaza por el valor de la variable.'
          },
          {
            id: 'jse088', type: 'fill-blank', xp: 25,
            question: 'Usa un template literal para mostrar precio:',
            code: 'let producto = "Café"\nlet precio = 2.50\nconsole.log(`El ${___} cuesta ${___}€`)',
            blanks: ['producto', 'precio'],
            options: ['producto', 'precio', '"producto"', '"precio"'],
            explanation: 'Cada variable va dentro de sus propias llaves ${}.'
          },
          {
            id: 'jse089', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let x = 5\nlet y = 3\nconsole.log(`${x} + ${y} = ${x + y}`)',
            output: ['x + y = x + y', '5 + 3 = 8', '5 + 3 = ${x + y}', 'Error'],
            correctOutput: 1,
            explanation: 'Dentro de ${} en un template literal puedes hacer operaciones directamente.'
          },
          {
            id: 'jse090', type: 'type-code', xp: 35,
            explanation: 'Los template literals van entre acentos graves y las variables se meten entre ${}. Así no hay que concatenar con +.',
            description: 'Crea variables "nombre" y "ciudad". Usa un template literal para imprimir: "Me llamo [nombre] y soy de [ciudad]"',
            starter: 'let nombre = "JS"\nlet ciudad = "Madrid"\n',
            solution: 'let nombre = "JS"\nlet ciudad = "Madrid"\nconsole.log(`Me llamo ${nombre} y soy de ${ciudad}`)',
            tests: [{ expected: 'Me llamo JS y soy de Madrid\n' }]
          }
        ]
      },
      {
        id: 'js-mod4-les3',
        title: 'Recortar Strings',
        icon: '✂️',
        exercises: [
          {
            id: 'jse091', type: 'predict-output', xp: 15,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "Python"\nconsole.log(texto[0])',
            output: ['P', 'y', 'Python', 'Error'],
            correctOutput: 0,
            explanation: 'Los índices empiezan en 0. texto[0] es el primer carácter: "P".'
          },
          {
            id: 'jse092', type: 'fill-blank', xp: 20,
            question: 'Obtén los primeros 3 caracteres:',
            code: 'let palabra = "Hola"\nlet primeros = palabra.___(0, 3)\nconsole.log(primeros)  // "Hol"',
            blanks: ['slice'],
            options: ['slice', 'splice', 'split', 'cut'],
            explanation: '.slice(0, 3) obtiene desde el índice 0 hasta el 2 (el 3 no incluido).'
          },
          {
            id: 'jse093', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "Python"\nconsole.log(texto.at(-1))',
            output: ['P', 'y', 'n', 'Error'],
            correctOutput: 2,
            explanation: '.at(-1) da el último carácter. "Python".at(-1) es "n".'
          },
          {
            id: 'jse094', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve "Python".slice(2, 5)?',
            choices: ['Pyt', 'tho', 'hon', 'yth'],
            correct: 1,
            explanation: '.slice(2, 5) toma los índices 2, 3 y 4: "t", "h", "o".'
          },
          {
            id: 'jse095', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "abcdef"\nconsole.log(texto.slice(1, 4))',
            output: ['abc', 'bcd', 'bcde', 'Error'],
            correctOutput: 1,
            explanation: '.slice(1, 4) toma los índices 1, 2 y 3: "b", "c", "d".'
          },
          {
            id: 'jse096', type: 'type-code', xp: 30,
            explanation: 'slice(0, 4) va del inicio al índice 4 sin incluirlo, y slice(-5) toma los cinco últimos caracteres porque el índice negativo cuenta desde el final.',
            description: 'Dado el string "Hola Mundo", extrae e imprime por separado:\n• Las primeras 4 letras\n• Las últimas 5 letras',
            starter: 'let texto = "Hola Mundo"\n',
            solution: 'let texto = "Hola Mundo"\nconsole.log(texto.slice(0, 4))\nconsole.log(texto.slice(-5))',
            tests: [{ expected: 'Hola\nMundo\n' }]
          }
        ]
      },
      {
        id: 'js-mod4-les4',
        title: 'Buscar en Strings',
        icon: '🔍',
        exercises: [
          {
            id: 'jse097', type: 'predict-output', xp: 15,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = "Hola Python"\nconsole.log(texto.includes("Python"))',
            output: ['true', 'false', '5', 'Error'],
            correctOutput: 0,
            explanation: '.includes() comprueba si un string contiene otro. "Python" está en "Hola Python".'
          },
          {
            id: 'jse098', type: 'fill-blank', xp: 20,
            question: 'Busca la posición de "Python":',
            code: 'let texto = "Me gusta Python"\nlet pos = texto.___("Python")\nconsole.log(pos)',
            blanks: ['indexOf'],
            options: ['indexOf', 'find', 'locate', 'position'],
            explanation: '.indexOf() devuelve el índice donde empieza el texto buscado.'
          },
          {
            id: 'jse099', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let frase = "uno-dos-tres"\nconsole.log(frase.split("-").length)',
            output: ['1', '2', '3', 'Error'],
            correctOutput: 2,
            explanation: '.split("-") crea ["uno", "dos", "tres"]. Su length es 3.'
          },
          {
            id: 'jse100', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve "hola".startsWith("h")?',
            choices: ['true', 'false', '0', 'Error'],
            correct: 0,
            explanation: '.startsWith() devuelve true si el string empieza con el texto dado.'
          },
          {
            id: 'jse101', type: 'fill-blank', xp: 20,
            question: 'Une las palabras con un espacio:',
            code: 'let partes = ["Hola", "Mundo"]\nconsole.log(partes.___(" "))',
            blanks: ['join'],
            options: ['join', 'merge', 'concat', 'combine'],
            explanation: '.join(" ") une los elementos de un array con el separador dado.'
          },
          {
            id: 'jse102', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log("abc".toUpperCase().toLowerCase())',
            output: ['ABC', 'abc', 'Abc', 'Error'],
            correctOutput: 1,
            explanation: 'Los métodos se pueden encadenar: primero "ABC" y luego vuelve a "abc".'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 5: CONDICIONALES
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod5',
    title: 'Condicionales',
    subtitle: 'Enseña a JavaScript a tomar decisiones',
    icon: '🔀',
    color: '#A18CD1',
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
    level: 'Elemental',
    lessons: [
      {
        id: 'js-mod5-les1',
        title: 'if / else',
        icon: '🚦',
        exercises: [
          {
            id: 'jse103', type: 'multiple-choice', xp: 10,
            question: '¿Qué palabra clave ejecuta código SI una condición es verdadera?',
            choices: ['when', 'if', 'check', 'case'],
            correct: 1,
            explanation: '"if" ejecuta el bloque de código solo si la condición es true.'
          },
          {
            id: 'jse104', type: 'fill-blank', xp: 20,
            question: 'Completa el código condicional:',
            code: '___ (edad >= 18) {\n    console.log("Eres adulto")\n}',
            blanks: ['if'],
            options: ['if', 'when', 'for', 'while'],
            explanation: '"if" va antes de la condición entre paréntesis. El bloque va entre llaves {}.'
          },
          {
            id: 'jse105', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let llueve = true\nif (llueve) {\n    console.log("Coge el paraguas")\n} else {\n    console.log("Sal sin paraguas")\n}',
            output: ['Coge el paraguas', 'Sal sin paraguas', 'Ambas cosas', 'Error'],
            correctOutput: 0,
            explanation: 'llueve es true, así que se ejecuta el bloque if.'
          },
          {
            id: 'jse106', type: 'reorder', xp: 25,
            question: 'Ordena el código if/else:',
            blocks: ['    console.log("Aprobado")', 'let nota = 6', '} else {', 'if (nota >= 5) {', '    console.log("Suspenso")', '}'],
            correctOrder: [1, 3, 0, 2, 4, 5],
            explanation: 'Primero la variable, luego if con su bloque, luego else con su bloque.'
          },
          {
            id: 'jse107', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código? (¡falsy!)',
            codeToRun: 'let x = 0\nif (x) {\n    console.log("Verdadero")\n} else {\n    console.log("Falso")\n}',
            output: ['Verdadero', 'Falso', '0', 'Error'],
            correctOutput: 1,
            explanation: '0 es "falsy" en JavaScript: equivale a false en un if.'
          },
          {
            id: 'jse108', type: 'type-code', xp: 35,
            explanation: 'En JavaScript los paréntesis alrededor de la condición son obligatorios. Cada bloque se abre y se cierra con llaves.',
            description: 'Crea una variable "temperatura" con valor 35. Imprime "Hace calor" si supera 30, si no imprime "Temperatura normal".',
            starter: 'let temperatura = 35\n',
            solution: 'let temperatura = 35\nif (temperatura > 30) {\n    console.log("Hace calor")\n} else {\n    console.log("Temperatura normal")\n}',
            tests: [{ expected: 'Hace calor\n' }]
          }
        ]
      },
      {
        id: 'js-mod5-les2',
        title: 'else if y switch',
        icon: '🔱',
        exercises: [
          {
            id: 'jse109', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se escribe "si no, si" en JavaScript?',
            choices: ['else if (cond)', 'elif cond', 'or if (cond)', 'elseif cond'],
            correct: 0,
            explanation: 'En JavaScript se escribe "else if" separado, con la condición entre paréntesis.'
          },
          {
            id: 'jse110', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let nota = 7\nif (nota >= 9) {\n    console.log("Sobresaliente")\n} else if (nota >= 7) {\n    console.log("Notable")\n} else if (nota >= 5) {\n    console.log("Aprobado")\n} else {\n    console.log("Suspenso")\n}',
            output: ['Sobresaliente', 'Notable', 'Aprobado', 'Suspenso'],
            correctOutput: 1,
            explanation: '7 no es >= 9, pero sí es >= 7, así que imprime "Notable".'
          },
          {
            id: 'jse111', type: 'fill-blank', xp: 20,
            question: 'Completa con else if:',
            code: 'let hora = 14\nif (hora < 12) {\n    console.log("Buenos días")\n} ___ (hora < 18) {\n    console.log("Buenas tardes")\n} else {\n    console.log("Buenas noches")\n}',
            blanks: ['else if'],
            options: ['else if', 'elif', 'or if', 'elseif'],
            explanation: 'En JavaScript, "else if" son dos palabras (no "elif" como en Python).'
          },
          {
            id: 'jse112', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve switch?',
            choices: ['Encender el ordenador', 'Comparar un valor con muchos casos', 'Repetir código', 'Crear variables'],
            correct: 1,
            explanation: 'switch compara un valor con varios case. Ideal cuando hay muchas opciones fijas.'
          },
          {
            id: 'jse113', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let dia = 2\nswitch (dia) {\n    case 1:\n        console.log("Lunes")\n        break\n    case 2:\n        console.log("Martes")\n        break\n    default:\n        console.log("Otro día")\n}',
            output: ['Lunes', 'Martes', 'Otro día', 'Error'],
            correctOutput: 1,
            explanation: 'dia es 2, entra en case 2 e imprime "Martes". El break evita que siga a otros casos.'
          },
          {
            id: 'jse114', type: 'type-code', xp: 40,
            explanation: 'En un switch se comparan valores exactos (===). El break es imprescindible, o el flujo caería al siguiente case. default cubre lo que no coincide.',
            description: 'Con switch: si "color" es "verde" imprime "Avanza", si es "amarillo" imprime "Precaución", en otro caso imprime "Para".',
            starter: 'let color = "amarillo"\n',
            solution: 'let color = "amarillo"\nswitch (color) {\n    case "verde":\n        console.log("Avanza")\n        break\n    case "amarillo":\n        console.log("Precaución")\n        break\n    default:\n        console.log("Para")\n}',
            tests: [{ expected: 'Precaución\n' }]
          }
        ]
      },
      {
        id: 'js-mod5-les3',
        title: 'Condiciones y Ternario',
        icon: '🧩',
        exercises: [
          {
            id: 'jse115', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let edad = 20\nlet tieneDni = true\nif (edad >= 18 && tieneDni) {\n    console.log("Puede entrar")\n} else {\n    console.log("No puede entrar")\n}',
            output: ['Puede entrar', 'No puede entrar', 'Error', 'undefined'],
            correctOutput: 0,
            explanation: 'Tiene 20 años (>= 18) Y tiene dni (true). Ambas verdaderas: puede entrar.'
          },
          {
            id: 'jse116', type: 'fill-blank', xp: 25,
            question: 'Acepta si tiene carnet O pase:',
            code: 'let carnet = false\nlet pase = true\nif (carnet ___ pase) {\n    console.log("Acceso permitido")\n}',
            blanks: ['||'],
            options: ['||', '&&', '!', 'or'],
            explanation: '|| acepta si AL MENOS UNA condición es true.'
          },
          {
            id: 'jse117', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let premium = false\nif (!premium) {\n    console.log("Hazte premium para acceder")\n}',
            output: ['Hazte premium para acceder', 'Nada', 'false', 'Error'],
            correctOutput: 0,
            explanation: '!false es true, así que el if se ejecuta.'
          },
          {
            id: 'jse118', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve (5 > 3) && (2 < 1)?',
            choices: ['true', 'false', 'Error', 'undefined'],
            correct: 1,
            explanation: '5 > 3 es true, pero 2 < 1 es false. true && false = false.'
          },
          {
            id: 'jse119', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace el operador ternario (condición ? a : b)?',
            choices: ['Repite código', 'Es un if/else en una línea', 'Crea un bucle', 'Define una función'],
            correct: 1,
            explanation: 'El ternario es un if/else compacto: si la condición es true da "a", si no da "b".'
          },
          {
            id: 'jse120', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let edad = 16\nlet mensaje = edad >= 18 ? "Adulto" : "Menor"\nconsole.log(mensaje)',
            output: ['Adulto', 'Menor', 'undefined', 'Error'],
            correctOutput: 1,
            explanation: '16 >= 18 es false, así que el ternario devuelve "Menor".'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 6: BUCLES
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod6',
    title: 'Bucles',
    subtitle: 'Repite tareas automáticamente',
    icon: '🔁',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    level: 'Elemental',
    lessons: [
      {
        id: 'js-mod6-les1',
        title: 'Bucle while',
        icon: '⏳',
        exercises: [
          {
            id: 'jse121', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace el bucle while?',
            choices: ['Se ejecuta una vez', 'Se ejecuta mientras la condición sea true', 'Se ejecuta un número fijo de veces', 'Nunca termina'],
            correct: 1,
            explanation: 'while repite el bloque MIENTRAS la condición sea verdadera.'
          },
          {
            id: 'jse122', type: 'predict-output', xp: 20,
            question: '¿Cuántas veces se imprime "Hola"?',
            codeToRun: 'let i = 0\nwhile (i < 3) {\n    console.log("Hola")\n    i++\n}',
            output: ['1', '2', '3', 'Infinitas'],
            correctOutput: 2,
            explanation: 'i empieza en 0 y el bucle corre con i=0, i=1 e i=2. Total: 3 veces.'
          },
          {
            id: 'jse123', type: 'fill-blank', xp: 25,
            question: 'Completa el contador:',
            code: 'let cuenta = 1\nwhile (cuenta ___ 5) {\n    console.log(cuenta)\n    cuenta++\n}',
            blanks: ['<='],
            options: ['<=', '<', '>=', '=='],
            explanation: '<= significa "menor o igual". El bucle va de 1 a 5 incluyendo el 5.'
          },
          {
            id: 'jse124', type: 'reorder', xp: 25,
            question: 'Ordena el bucle de cuenta regresiva desde 3:',
            blocks: ['    n--', 'let n = 3', '    console.log(n)', 'while (n > 0) {', '}'],
            correctOrder: [1, 3, 2, 0, 4],
            explanation: 'Variable → while con condición → imprimir → decrementar → cerrar llave.'
          },
          {
            id: 'jse125', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let suma = 0\nlet i = 1\nwhile (i <= 5) {\n    suma += i\n    i++\n}\nconsole.log(suma)',
            output: ['5', '10', '15', '25'],
            correctOutput: 2,
            explanation: 'suma = 1+2+3+4+5 = 15.'
          },
          {
            id: 'jse126', type: 'type-code', xp: 35,
            explanation: 'while repite mientras la condición sea cierta, así que hay que incrementar i dentro del bloque o no terminaría nunca.',
            description: 'Usa while para imprimir los números del 1 al 10.',
            starter: '// Usa un bucle while\n',
            solution: 'let i = 1\nwhile (i <= 10) {\n    console.log(i)\n    i++\n}',
            tests: [{ expected: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n' }]
          }
        ]
      },
      {
        id: 'js-mod6-les2',
        title: 'Bucle for...of',
        icon: '🔂',
        exercises: [
          {
            id: 'jse127', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve for...of?',
            choices: ['Para repetir siempre 10 veces', 'Para recorrer los elementos de un array', 'Para crear objetos', 'Para parar un bucle'],
            correct: 1,
            explanation: 'for...of recorre cada elemento de un array, uno por uno.'
          },
          {
            id: 'jse128', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let frutas = ["manzana", "pera"]\nfor (let f of frutas) {\n    console.log(f)\n}',
            output: ['manzana\npera', 'frutas', '0\n1', 'Error'],
            correctOutput: 0,
            explanation: 'f toma cada valor del array: primero "manzana" y luego "pera".'
          },
          {
            id: 'jse129', type: 'fill-blank', xp: 20,
            question: 'Recorre el array con for...of:',
            code: 'let nums = [1, 2, 3]\n___ (let n of nums) {\n    console.log(n * 2)\n}',
            blanks: ['for'],
            options: ['for', 'while', 'if', 'each'],
            explanation: 'La sintaxis es: for (let elemento of array).'
          },
          {
            id: 'jse130', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre for...of y for...in?',
            choices: ['Son iguales', 'of da valores, in da índices/claves', 'in da valores, of da índices', 'Ninguno existe'],
            correct: 1,
            explanation: 'for...of da los VALORES del array. for...in da ÍNDICES (mejor para objetos).'
          },
          {
            id: 'jse131', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let total = 0\nfor (let n of [1, 2, 3, 4]) {\n    total += n\n}\nconsole.log(total)',
            output: ['4', '10', '24', '1234'],
            correctOutput: 1,
            explanation: 'Suma cada elemento: 1+2+3+4 = 10.'
          },
          {
            id: 'jse132', type: 'type-code', xp: 35,
            explanation: 'for...of recorre directamente los valores del array. toUpperCase() devuelve el texto en mayúsculas.',
            description: 'Con for...of, imprime cada color del array en mayúsculas.',
            starter: 'let colores = ["rojo", "azul"]\n',
            solution: 'let colores = ["rojo", "azul"]\nfor (let c of colores) {\n    console.log(c.toUpperCase())\n}',
            tests: [{ expected: 'ROJO\nAZUL\n' }]
          }
        ]
      },
      {
        id: 'js-mod6-les3',
        title: 'Bucle for clásico',
        icon: '🔢',
        exercises: [
          {
            id: 'jse133', type: 'multiple-choice', xp: 10,
            question: '¿Cuáles son las 3 partes de un for clásico?',
            choices: ['if, else, fin', 'inicio, condición, paso', 'abrir, cerrar, salir', 'suma, resta, total'],
            correct: 1,
            explanation: 'for (inicio; condición; paso): dónde empieza, cuándo sigue y cómo avanza.'
          },
          {
            id: 'jse134', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'for (let i = 0; i < 3; i++) {\n    console.log(i)\n}',
            output: ['0\n1\n2', '1\n2\n3', '0\n1\n2\n3', 'Error'],
            correctOutput: 0,
            explanation: 'i va de 0 a 2 (mientras i < 3). Imprime 0, 1 y 2.'
          },
          {
            id: 'jse135', type: 'fill-blank', xp: 25,
            question: 'Completa el paso del bucle:',
            code: 'for (let i = 0; i < 5; ___) {\n    console.log(i)\n}',
            blanks: ['i++'],
            options: ['i++', 'i--', 'i = 0', 'i'],
            explanation: 'i++ suma 1 en cada vuelta. Sin paso, el bucle sería infinito.'
          },
          {
            id: 'jse136', type: 'reorder', xp: 25,
            question: 'Ordena el for que imprime del 5 al 1:',
            blocks: ['}', 'for (let i = 5; i >= 1; i--) {', '    console.log(i)'],
            correctOrder: [1, 2, 0],
            explanation: 'Cabecera del for, cuerpo indentado y llave de cierre.'
          },
          {
            id: 'jse137', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'for (let i = 2; i <= 10; i += 2) {\n    console.log(i)\n}',
            output: ['2\n4\n6\n8\n10', '2\n3\n4\n5', '10', 'Error'],
            correctOutput: 0,
            explanation: 'Empieza en 2 y suma 2 cada vez: 2, 4, 6, 8 y 10.'
          },
          {
            id: 'jse138', type: 'type-code', xp: 35,
            explanation: 'El for clásico tiene tres partes: inicialización, condición y aumento. Se repite mientras la condición siga siendo cierta.',
            description: 'Con un for clásico, imprime la tabla del 3 (3×1 ... 3×5).',
            starter: '// Tabla del 3\n',
            solution: 'for (let i = 1; i <= 5; i++) {\n    console.log(3 * i)\n}',
            tests: [{ expected: '3\n6\n9\n12\n15\n' }]
          }
        ]
      },
      {
        id: 'js-mod6-les4',
        title: 'break y continue',
        icon: '✂️',
        exercises: [
          {
            id: 'jse139', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace break dentro de un bucle?',
            choices: ['Pausa el bucle momentáneamente', 'Sale completamente del bucle', 'Salta a la siguiente iteración', 'Reinicia el bucle'],
            correct: 1,
            explanation: 'break sale del bucle de golpe, no se ejecuta nada más de él.'
          },
          {
            id: 'jse140', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace continue dentro de un bucle?',
            choices: ['Sale del bucle', 'Salta al inicio de la siguiente iteración', 'Pausa el programa', 'Reinicia la variable'],
            correct: 1,
            explanation: 'continue salta el resto de la vuelta actual y pasa a la siguiente.'
          },
          {
            id: 'jse141', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'for (let i = 1; i <= 5; i++) {\n    if (i === 3) {\n        break\n    }\n    console.log(i)\n}',
            output: ['1\n2', '1\n2\n3', '3\n4\n5', '1\n2\n3\n4\n5'],
            correctOutput: 0,
            explanation: 'Imprime 1 y 2. Al llegar a 3, break sale del bucle.'
          },
          {
            id: 'jse142', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'for (let i = 1; i <= 4; i++) {\n    if (i === 2) {\n        continue\n    }\n    console.log(i)\n}',
            output: ['1\n2\n3\n4', '1\n3\n4', '2', '1\n2'],
            correctOutput: 1,
            explanation: 'Se salta la vuelta del 2 con continue: imprime 1, 3 y 4.'
          },
          {
            id: 'jse143', type: 'fill-blank', xp: 20,
            question: 'Sal del bucle al encontrar el 7:',
            code: 'for (let n of [5, 7, 9]) {\n    if (n === 7) {\n        ___\n    }\n    console.log(n)\n}',
            blanks: ['break'],
            options: ['break', 'continue', 'stop', 'exit'],
            explanation: 'break interrumpe el bucle en cuanto encuentra el 7.'
          },
          {
            id: 'jse144', type: 'type-code', xp: 35,
            explanation: 'continue pasa a la siguiente vuelta sin ejecutar el resto del bloque, así que el 4 nunca llega al console.log.',
            description: 'Imprime los números del 1 al 6 saltándote el 4 (usa continue).',
            starter: '// Del 1 al 6 sin el 4\n',
            solution: 'for (let i = 1; i <= 6; i++) {\n    if (i === 4) {\n        continue\n    }\n    console.log(i)\n}',
            tests: [{ expected: '1\n2\n3\n5\n6\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 7: ARRAYS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod7',
    title: 'Arrays',
    subtitle: 'Colecciones ordenadas de datos',
    icon: '📋',
    color: '#4FACFE',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'js-mod7-les1',
        title: 'Crear y Acceder',
        icon: '🗂️',
        exercises: [
          {
            id: 'jse145', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se crea un array en JavaScript?',
            choices: ['(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}', '<1, 2, 3>'],
            correct: 1,
            explanation: 'Los arrays se escriben entre corchetes: [1, 2, 3].'
          },
          {
            id: 'jse146', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let colores = ["rojo", "azul", "verde"]\nconsole.log(colores[1])',
            output: ['rojo', 'azul', 'verde', 'Error'],
            correctOutput: 1,
            explanation: 'Los índices empiezan en 0: colores[1] es el segundo elemento, "azul".'
          },
          {
            id: 'jse147', type: 'fill-blank', xp: 20,
            question: 'Obtén el último elemento:',
            code: 'let nums = [10, 20, 30]\nconsole.log(nums[nums.___ - 1])',
            blanks: ['length'],
            options: ['length', 'size', 'count', 'len'],
            explanation: '.length dice cuántos elementos hay. El último índice es length - 1.'
          },
          {
            id: 'jse148', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let lista = [1, 2, 3]\nconsole.log(lista.length)',
            output: ['2', '3', '4', 'Error'],
            correctOutput: 1,
            explanation: '.length cuenta los elementos: [1, 2, 3] tiene 3.'
          },
          {
            id: 'jse149', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa si accedes a un índice que no existe?',
            choices: ['Da error', 'Devuelve undefined', 'Devuelve null', 'Crea el elemento'],
            correct: 1,
            explanation: 'JavaScript no da error: devuelve undefined si el índice no existe.'
          },
          {
            id: 'jse150', type: 'type-code', xp: 30,
            explanation: 'Los índices empiezan en 0, y length - 1 da la posición del último elemento. También valdría el índice -1.',
            description: 'Crea el array ["manzana", "pera", "uva"]. Imprime el primero y el último.',
            starter: '// Tu array aquí\n',
            solution: 'let frutas = ["manzana", "pera", "uva"]\nconsole.log(frutas[0])\nconsole.log(frutas[frutas.length - 1])',
            tests: [{ expected: 'manzana\nuva\n' }]
          }
        ]
      },
      {
        id: 'js-mod7-les2',
        title: 'Añadir y Quitar',
        icon: '✏️',
        exercises: [
          {
            id: 'jse151', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace .push()?',
            choices: ['Quita el último elemento', 'Añade al final del array', 'Ordena el array', 'Vacía el array'],
            correct: 1,
            explanation: '.push() añade un elemento al FINAL del array.'
          },
          {
            id: 'jse152', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let nums = [1, 2]\nnums.push(3)\nconsole.log(nums.length)',
            output: ['2', '3', '4', 'Error'],
            correctOutput: 1,
            explanation: 'push(3) añade el 3: el array pasa a tener 3 elementos.'
          },
          {
            id: 'jse153', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace .pop()?',
            choices: ['Añade al final', 'Quita y devuelve el último elemento', 'Quita el primero', 'Invierte el array'],
            correct: 1,
            explanation: '.pop() quita el ÚLTIMO elemento y lo devuelve.'
          },
          {
            id: 'jse154', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let letras = ["a", "b", "c"]\nlet ultima = letras.pop()\nconsole.log(ultima)\nconsole.log(letras.length)',
            output: ['c\n2', 'c\n3', 'b\n2', 'Error'],
            correctOutput: 0,
            explanation: 'pop() saca la "c" (la guarda en ultima) y el array se queda con 2 elementos.'
          },
          {
            id: 'jse155', type: 'fill-blank', xp: 25,
            question: 'Quita el primer elemento del array:',
            code: 'let cola = ["Ana", "Beto"]\ncola.___()\nconsole.log(cola.length)',
            blanks: ['shift'],
            options: ['shift', 'pop', 'remove', 'delete'],
            explanation: '.shift() quita el PRIMER elemento (pop quita el último).'
          },
          {
            id: 'jse156', type: 'type-code', xp: 30,
            explanation: 'push() añade al final del array y pop() quita el último. length devuelve cuántos elementos quedan.',
            description: 'Tienes ["lunes", "martes"]. Añade "miércoles" al final y luego quítalo con pop. Imprime cuántos días quedan.',
            starter: 'let dias = ["lunes", "martes"]\n',
            solution: 'let dias = ["lunes", "martes"]\ndias.push("miércoles")\ndias.pop()\nconsole.log(dias.length)',
            tests: [{ expected: '2\n' }]
          }
        ]
      },
      {
        id: 'js-mod7-les3',
        title: 'map y filter',
        icon: '⚡',
        exercises: [
          {
            id: 'jse157', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace .map()?',
            choices: ['Ordena el array', 'Crea un array nuevo aplicando una función a cada elemento', 'Filtra elementos', 'Suma los elementos'],
            correct: 1,
            explanation: '.map() transforma cada elemento y devuelve un array NUEVO del mismo tamaño.'
          },
          {
            id: 'jse158', type: 'predict-output', xp: 20,
            question: '¿Qué elementos tiene el resultado?',
            codeToRun: 'let nums = [1, 2, 3]\nlet dobles = nums.map(n => n * 2)\nconsole.log(dobles.join(", "))',
            output: ['1, 2, 3', '2, 4, 6', '3, 6, 9', 'Error'],
            correctOutput: 1,
            explanation: 'map multiplica cada elemento por 2: [2, 4, 6].'
          },
          {
            id: 'jse159', type: 'fill-blank', xp: 25,
            question: 'Quédate solo con los mayores de edad:',
            code: 'let edades = [15, 20, 17, 30]\nlet adultos = edades.___(e => e >= 18)\nconsole.log(adultos.length)',
            blanks: ['filter'],
            options: ['filter', 'map', 'find', 'select'],
            explanation: '.filter() se queda solo con los elementos que cumplen la condición (20 y 30).'
          },
          {
            id: 'jse160', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let nombres = ["ana", "bob"]\nlet mayus = nombres.map(n => n.toUpperCase())\nconsole.log(mayus.join(" "))',
            output: ['ana bob', 'ANA BOB', 'Ana Bob', 'Error'],
            correctOutput: 1,
            explanation: 'map aplica .toUpperCase() a cada nombre y join los une con espacio.'
          },
          {
            id: 'jse161', type: 'reorder', xp: 25,
            question: 'Ordena el código que filtra palabras con "a":',
            blocks: ['let conA = palabras.filter(p => p.includes("a"))', 'let palabras = ["casa", "piso", "sala"]', 'console.log(conA.length)'],
            correctOrder: [1, 0, 2],
            explanation: 'Array original, filter con la condición, imprimir el resultado.'
          },
          {
            id: 'jse162', type: 'type-code', xp: 40,
            explanation: 'map() devuelve un array nuevo aplicando la función a cada elemento, sin modificar el original. join(", ") lo convierte en texto separado por comas.',
            description: 'Con map, crea un array con los cuadrados de [1, 2, 3, 4] e imprímelo separado por comas.',
            starter: 'let nums = [1, 2, 3, 4]\n',
            solution: 'let nums = [1, 2, 3, 4]\nlet cuadrados = nums.map(n => n ** 2)\nconsole.log(cuadrados.join(", "))',
            tests: [{ expected: '1, 4, 9, 16\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 8: OBJETOS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod8',
    title: 'Objetos',
    subtitle: 'Datos con clave y valor',
    icon: '📖',
    color: '#667EEA',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'js-mod8-les1',
        title: 'Crear y Acceder',
        icon: '🔑',
        exercises: [
          {
            id: 'jse163', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se crea un objeto en JavaScript?',
            choices: ['[clave: valor]', '{clave: valor}', '(clave: valor)', '<clave: valor>'],
            correct: 1,
            explanation: 'Los objetos usan llaves {} con pares clave: valor.'
          },
          {
            id: 'jse164', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let persona = { nombre: "Ana", edad: 25 }\nconsole.log(persona.nombre)',
            output: ['25', 'Ana', 'nombre', 'Error'],
            correctOutput: 1,
            explanation: 'El punto accede a la propiedad: persona.nombre es "Ana".'
          },
          {
            id: 'jse165', type: 'fill-blank', xp: 20,
            question: 'Accede a la propiedad "edad" con notación de corchetes:',
            code: 'let p = { edad: 25 }\nconsole.log(p.___])',
            blanks: ['"edad"'],
            options: ['"edad"', 'edad', '.edad'],
            explanation: 'p["edad"] accede por nombre de clave (útil si la clave tiene espacios).'
          },
          {
            id: 'jse166', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let p = { nombre: "Ana" }\nconsole.log(p.apellido)',
            output: ['Ana', 'undefined', 'Error', 'null'],
            correctOutput: 1,
            explanation: 'La propiedad no existe: JavaScript devuelve undefined (no da error).'
          },
          {
            id: 'jse167', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let notas = { Ana: 9, Bob: 7 }\nconsole.log(Object.keys(notas).length)',
            output: ['1', '2', '3', 'Error'],
            correctOutput: 1,
            explanation: 'Object.keys() devuelve las claves ["Ana", "Bob"], así que length es 2.'
          },
          {
            id: 'jse168', type: 'type-code', xp: 30,
            explanation: 'Las propiedades de un objeto se leen con punto: coche.marca. El template literal combina ambos valores en una sola cadena.',
            description: 'Crea un objeto "coche" con marca "Toyota" y modelo "Corolla". Imprime "Toyota Corolla" con un template literal.',
            starter: '// Tu objeto aquí\n',
            solution: 'let coche = { marca: "Toyota", modelo: "Corolla" }\nconsole.log(`${coche.marca} ${coche.modelo}`)',
            tests: [{ expected: 'Toyota Corolla\n' }]
          }
        ]
      },
      {
        id: 'js-mod8-les2',
        title: 'Propiedades y Métodos',
        icon: '✏️',
        exercises: [
          {
            id: 'jse169', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se accede a un método de un objeto?',
            choices: ['objeto.metodo()', 'objeto->metodo()', 'objeto.metodo', 'metodo(objeto)'],
            correct: 0,
            explanation: 'Se accede con punto y se llama con paréntesis: objeto.metodo().'
          },
          {
            id: 'jse170', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let user = {\n    nombre: "Ana",\n    saludar: function() {\n        return "Hola, soy " + this.nombre\n    }\n}\nconsole.log(user.saludar())',
            output: ['Hola, soy Ana', 'Hola, soy this.nombre', 'Error', 'undefined'],
            correctOutput: 0,
            explanation: 'this dentro del método apunta al objeto, así que this.nombre es "Ana".'
          },
          {
            id: 'jse171', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let c = { contador: 0 }\nc.contador = c.contador + 1\nconsole.log(c.contador)',
            output: ['0', '1', 'undefined', 'Error'],
            correctOutput: 1,
            explanation: 'Las propiedades se pueden reasignar: 0 + 1 = 1.'
          },
          {
            id: 'jse172', type: 'fill-blank', xp: 25,
            question: 'Añade una propiedad nueva al objeto:',
            code: 'let u = { nombre: "Ana" }\nu.___ = 25\nconsole.log(u.edad)',
            blanks: ['edad'],
            options: ['edad', 'edad()', 'set edad'],
            explanation: 'Se asigna directamente: u.edad = 25.'
          },
          {
            id: 'jse173', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace Object.entries()?',
            choices: ['Solo las claves', 'Solo los valores', 'Los pares clave-valor como arrays', 'El número de propiedades'],
            correct: 2,
            explanation: 'Object.entries() devuelve [[clave, valor], [clave, valor]...].'
          },
          {
            id: 'jse174', type: 'type-code', xp: 35,
            explanation: 'Un método es una función dentro del objeto y se llama con this.precio. toFixed(2) redondea y fuerza dos decimales.',
            description: 'Crea un objeto "producto" con nombre "Teclado" y precio 29.99. Añade un método que imprima el precio con 2 decimales.',
            starter: '// Tu objeto aquí\n',
            solution: 'let producto = {\n    nombre: "Teclado",\n    precio: 29.99,\n    verPrecio: function() {\n        return this.precio.toFixed(2)\n    }\n}\nconsole.log(producto.verPrecio())',
            tests: [{ expected: '29.99\n' }]
          }
        ]
      },
      {
        id: 'js-mod8-les3',
        title: 'Iterar y Desestructurar',
        icon: '🧩',
        exercises: [
          {
            id: 'jse175', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let notas = { Ana: 9, Bob: 7 }\nfor (let nombre of Object.keys(notas)) {\n    console.log(nombre)\n}',
            output: ['Ana Bob', 'Ana\nBob', '9\n7', 'Error'],
            correctOutput: 1,
            explanation: 'Object.keys() da ["Ana", "Bob"] y el for...of recorre ambos nombres.'
          },
          {
            id: 'jse176', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let u = { nombre: "Ana", edad: 25 }\nlet { nombre } = u\nconsole.log(nombre)',
            output: ['25', 'Ana', 'Error', 'undefined'],
            correctOutput: 1,
            explanation: 'La desestructuración extrae la propiedad "nombre" a una variable nueva.'
          },
          {
            id: 'jse177', type: 'fill-blank', xp: 25,
            question: 'Itera sobre las claves y valores:',
            code: 'let d = { a: 1, b: 2 }\nfor (let [k, v] of ___ (d)) {\n    console.log(k + " = " + v)\n}',
            blanks: ['Object.entries'],
            options: ['Object.entries', 'Object.keys', 'Object.values', 'entries'],
            explanation: 'Object.entries() devuelve pares [clave, valor] que se desestructuran en [k, v].'
          },
          {
            id: 'jse178', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let config = { puerto: 3000, debug: true }\nlet { puerto, debug } = config\nconsole.log(puerto + (debug ? "-debug" : ""))',
            output: ['3000', '3000-debug', 'debug-3000', 'Error'],
            correctOutput: 1,
            explanation: 'Extrae ambas propiedades. Como debug es true, añade "-debug".'
          },
          {
            id: 'jse179', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace Object.values()?',
            choices: ['Las claves', 'Los valores', 'Los pares clave-valor', 'El tamaño del objeto'],
            correct: 1,
            explanation: 'Object.values() devuelve solo los valores: Object.values({a:1,b:2}) = [1, 2].'
          },
          {
            id: 'jse180', type: 'type-code', xp: 35,
            explanation: 'Object.keys() devuelve un array con las claves del objeto. Con la clave obtenemos el valor y .length mide su longitud.',
            description: 'Con Object.keys, imprime cuántos caracteres tiene el nombre de un usuario.',
            starter: 'let u = { nombre: "Ana" }\n',
            solution: 'let u = { nombre: "Ana" }\nlet claves = Object.keys(u)\nconsole.log(u[claves[0]].length)',
            tests: [{ expected: '3\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 9: FUNCIONES
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod9',
    title: 'Funciones',
    subtitle: 'Reutiliza y organiza tu código',
    icon: '⚙️',
    color: '#F093FB',
    gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'js-mod9-les1',
        title: 'Definir Funciones',
        icon: '🔧',
        exercises: [
          {
            id: 'jse181', type: 'multiple-choice', xp: 10,
            question: '¿Qué palabra clave se usa para definir una función en JavaScript?',
            choices: ['func', 'function', 'def', 'fun'],
            correct: 1,
            explanation: '"function" es la palabra clave para definir funciones en JavaScript.'
          },
          {
            id: 'jse182', type: 'fill-blank', xp: 20,
            question: 'Define una función que salude:',
            code: '___ saludar() {\n    console.log("¡Hola!")\n}\nsaludar()',
            blanks: ['function'],
            options: ['function', 'def', 'func', 'fn'],
            explanation: 'function nombre() { ... } define la función y luego la llamas con su nombre.'
          },
          {
            id: 'jse183', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'function suma() {\n    return 2 + 3\n}\nconsole.log(suma())',
            output: ['5', 'undefined', 'Error', 'function'],
            correctOutput: 0,
            explanation: 'return 2 + 3 devuelve 5, y console.log lo muestra.'
          },
          {
            id: 'jse184', type: 'multiple-choice', xp: 15,
            question: 'Una función sin return, ¿qué devuelve?',
            choices: ['0', 'undefined', 'null', 'Error'],
            correct: 1,
            explanation: 'Si no hay return, la función devuelve undefined.'
          },
          {
            id: 'jse185', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'function saludar() {\n    console.log("Hola")\n}\nsaludar()\nsaludar()',
            output: ['Hola', 'Hola\nHola', 'Hola Hola Hola', 'Error'],
            correctOutput: 1,
            explanation: 'La función se ejecuta una vez por cada llamada: dos veces.'
          },
          {
            id: 'jse186', type: 'type-code', xp: 30,
            explanation: 'Una función se declara con function y no hace nada hasta que la invocas. Se puede llamar tantas veces como quieras.',
            description: 'Crea una función "saludar" que imprima "¡Hola!" y llámala dos veces.',
            starter: '// Tu función aquí\n',
            solution: 'function saludar() {\n    console.log("¡Hola!")\n}\nsaludar()\nsaludar()',
            tests: [{ expected: '¡Hola!\n¡Hola!\n' }]
          }
        ]
      },
      {
        id: 'js-mod9-les2',
        title: 'Parámetros y Retorno',
        icon: '📤',
        exercises: [
          {
            id: 'jse187', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'function suma(a, b) {\n    return a + b\n}\nlet resultado = suma(3, 4)\nconsole.log(resultado)',
            output: ['3', '4', '7', 'Error'],
            correctOutput: 2,
            explanation: 'suma(3, 4) devuelve 3+4=7, que se guarda en resultado y se imprime.'
          },
          {
            id: 'jse188', type: 'fill-blank', xp: 25,
            question: 'Completa la función que devuelve el cuadrado:',
            code: 'function cuadrado(n) {\n    ___ n * n\n}\n\nconsole.log(cuadrado(5))',
            blanks: ['return'],
            options: ['return', 'print', 'give', 'send'],
            explanation: '"return" devuelve un valor desde la función al código que la llamó.'
          },
          {
            id: 'jse189', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'function saludar(nombre) {\n    return "Hola, " + nombre\n}\nconsole.log(saludar("Ana"))',
            output: ['Hola, Ana', 'Hola, nombre', 'Error', 'undefined'],
            correctOutput: 0,
            explanation: 'El argumento "Ana" se asigna al parámetro nombre.'
          },
          {
            id: 'jse190', type: 'multiple-choice', xp: 15,
            question: 'Si llamas sumar(5) y la función espera (a, b), ¿qué pasa?',
            choices: ['Da error', 'b vale undefined y el resultado es NaN', 'b vale 0', 'Se repite la función'],
            correct: 1,
            explanation: 'El parámetro que falta queda undefined, y sumar un número a undefined da NaN.'
          },
          {
            id: 'jse191', type: 'fill-blank', xp: 25,
            question: 'Define un valor por defecto para un parámetro:',
            code: 'function saludar(nombre ___) {\n    return "Hola, " + nombre\n}\nconsole.log(saludar())',
            blanks: ['= "Mundo"'],
            options: ['= "Mundo"', '= Mundo', ': "Mundo"', 'default "Mundo"'],
            explanation: 'Si el argumento falta, se usa el valor por defecto que pongas con =.'
          },
          {
            id: 'jse192', type: 'type-code', xp: 35,
            explanation: 'return devuelve el valor a quien llama, que puede ser distinto de quien la ejecutó. Aquí el 7 se recibe como parámetro n.',
            description: 'Crea una función "doblar" que reciba un número y devuelva su doble. Imprime doble(7).',
            starter: '// Tu función aquí\n',
            solution: 'function doblar(n) {\n    return n * 2\n}\nconsole.log(doblar(7))',
            tests: [{ expected: '14\n' }]
          }
        ]
      },
      {
        id: 'js-mod9-les3',
        title: 'Arrow Functions',
        icon: '⚡',
        exercises: [
          {
            id: 'jse193', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se declara una arrow function?',
            choices: ['(x) => x * 2', 'def (x) x * 2', '-> (x)', 'arrow(x)'],
            correct: 0,
            explanation: 'Una arrow function se declara así: (parámetros) => expresión.'
          },
          {
            id: 'jse194', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let doble = x => x * 2\nconsole.log(doble(5))',
            output: ['5', '10', '25', 'Error'],
            correctOutput: 1,
            explanation: 'La arrow multiplica x por 2. doble(5) = 5 * 2 = 10.'
          },
          {
            id: 'jse195', type: 'fill-blank', xp: 25,
            question: 'Crea una arrow que sume dos números:',
            code: 'let suma = (a, b) => ___\nconsole.log(suma(3, 7))',
            blanks: ['a + b'],
            options: ['a + b', 'return a + b', 'a+b;', 'sum(a,b)'],
            explanation: 'Con una expresión corta no hace falta return: (a, b) => a + b.'
          },
          {
            id: 'jse196', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'let numeros = [1, 2, 3]\nlet dobles = numeros.map(n => n * 2)\nconsole.log(dobles.join(","))',
            output: ['1, 2, 3', '2, 4, 6', '3, 6, 9', 'Error'],
            correctOutput: 1,
            explanation: 'map con arrow multiplica cada elemento por 2: [2, 4, 6].'
          },
          {
            id: 'jse197', type: 'reorder', xp: 25,
            question: 'Ordena el código que crea y usa una arrow:',
            blocks: ['console.log(area(2))', 'let area = lado => lado * lado'],
            correctOrder: [1, 0],
            explanation: 'Primero se define la arrow y luego se usa.'
          },
          {
            id: 'jse198', type: 'type-code', xp: 35,
            explanation: 'Una arrow function de un solo parámetro puede quitar los paréntesis, y si el cuerpo es una sola expresión también puede quitarse el return.',
            description: 'Crea una arrow "cuadrado" que reciba un número y devuelva su cuadrado. Imprime cuadrado(6).',
            starter: '// Tu arrow aquí\n',
            solution: 'let cuadrado = n => n ** 2\nconsole.log(cuadrado(6))',
            tests: [{ expected: '36\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 10: MANEJO DE ERRORES
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod10',
    title: 'Manejo de Errores',
    subtitle: 'Código robusto que no falla',
    icon: '🛡️',
    color: '#FA709A',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'js-mod10-les1',
        title: 'try / catch',
        icon: '🎣',
        exercises: [
          {
            id: 'jse199', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve try/catch?',
            choices: ['Hacer el código más rápido', 'Manejar errores sin que el programa se rompa', 'Repetir código automáticamente', 'Definir funciones especiales'],
            correct: 1,
            explanation: 'try/catch captura los errores para que el programa siga funcionando.'
          },
          {
            id: 'jse200', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código? (¡OJO con los tipos!)',
            codeToRun: 'try {\n    let x = Number("abc")\n    console.log("Número:", x)\n} catch (error) {\n    console.log("No es un número válido")\n}',
            output: ['Número: NaN', 'No es un número válido', 'Error', 'undefined'],
            correctOutput: 0,
            explanation: 'Number("abc") NO lanza error: devuelve NaN. Por eso entra el console.log normal. El catch solo salta ante un error de verdad.'
          },
          {
            id: 'jse201', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'try {\n    console.log("Intentando...")\n    noExiste()\n} catch (error) {\n    console.log("Error capturado")\n}',
            output: ['Intentando...\nError capturado', 'Intentando...', 'Error capturado', 'Error'],
            correctOutput: 0,
            explanation: 'Falla al llamar noExiste(), así que el catch imprime el segundo mensaje.'
          },
          {
            id: 'jse202', type: 'fill-blank', xp: 25,
            question: 'Captura el error de una función que no existe:',
            code: 'try {\n    noExiste()\n} ___ (error) {\n    console.log("Error controlado")\n}',
            blanks: ['catch'],
            options: ['catch', 'except', 'rescue', 'handle'],
            explanation: 'En JavaScript es try { } catch (error) { }.'
          },
          {
            id: 'jse203', type: 'multiple-choice', xp: 20,
            question: '¿Qué contiene la variable "error" dentro del catch?',
            choices: ['El texto del error', 'Undefined', 'Un objeto con el mensaje del error', 'El número de línea'],
            correct: 2,
            explanation: 'error es un objeto Error con .message y .name.'
          },
          {
            id: 'jse204', type: 'type-code', xp: 35,
            explanation: 'try/catch atrapa el error para que el programa no se detenga. En el bloque catch recibes el error como parámetro.',
            description: 'Usa try/catch para imprimir "Error controlado" al llamar a una función que no existe.',
            starter: '// Tu try/catch aquí\n',
            solution: 'try {\n    noExiste()\n} catch (error) {\n    console.log("Error controlado")\n}',
            tests: [{ expected: 'Error controlado\n' }]
          }
        ]
      },
      {
        id: 'js-mod10-les2',
        title: 'finally y throw',
        icon: '🧹',
        exercises: [
          {
            id: 'jse205', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace "finally" en un try/catch?',
            choices: ['Solo se ejecuta si hay error', 'Solo se ejecuta si no hay error', 'Siempre se ejecuta, con o sin error', 'Reinicia el bloque try'],
            correct: 2,
            explanation: 'finally se ejecuta SIEMPRE, haya error o no. Ideal para limpiar.'
          },
          {
            id: 'jse206', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'try {\n    console.log("A")\n} catch (e) {\n    console.log("B")\n} finally {\n    console.log("C")\n}',
            output: ['A', 'A\nC', 'A\nB\nC', 'C'],
            correctOutput: 1,
            explanation: 'Se imprime A (sin error, así que catch no se ejecuta) y luego C en finally.'
          },
          {
            id: 'jse207', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'try {\n    noExiste()\n} catch (e) {\n    console.log("Capturado")\n} finally {\n    console.log("Siempre")\n}',
            output: ['Capturado', 'Siempre', 'Capturado\nSiempre', 'Error'],
            correctOutput: 2,
            explanation: 'Primero el catch (hubo error) y después finally, que siempre corre.'
          },
          {
            id: 'jse208', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve throw?',
            choices: ['Para imprimir un mensaje', 'Para lanzar un error propio', 'Para salir del programa', 'Para pausar el código'],
            correct: 1,
            explanation: 'throw lanza un error que puedes capturar tú mismo con try/catch.'
          },
          {
            id: 'jse209', type: 'fill-blank', xp: 25,
            question: 'Lanza un error propio:',
            code: 'function edad(n) {\n    if (n < 0) {\n        ___ new Error("Edad no válida")\n    }\n    return n\n}\n\ntry {\n    edad(-1)\n} catch (e) {\n    console.log(e.message)\n}',
            blanks: ['throw'],
            options: ['throw', 'raise', 'catch', 'error'],
            explanation: 'throw new Error("...") lanza el error con el mensaje que elijas.'
          },
          {
            id: 'jse210', type: 'type-code', xp: 35,
            explanation: 'throw lanza una excepción que interrumpe el flujo y try/catch la recoge para poder seguir. e.message guarda el texto del error.',
            description: 'Crea una función "dividir" que lance un error si el divisor es 0, y captura ese error con try/catch.',
            starter: 'function dividir(a, b) {\n    // Tu código aquí\n}\n\ntry {\n    console.log(dividir(10, 0))\n} catch (e) {\n    console.log(e.message)\n}',
            solution: 'function dividir(a, b) {\n    if (b === 0) {\n        throw new Error("No se puede dividir entre cero")\n    }\n    return a / b\n}\n\ntry {\n    console.log(dividir(10, 0))\n} catch (e) {\n    console.log(e.message)\n}',
            tests: [{ expected: 'No se puede dividir entre cero\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 11: CLASES Y POO
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod11',
    title: 'Clases y POO',
    subtitle: 'Programación Orientada a Objetos',
    icon: '🏗️',
    color: '#0F3460',
    gradient: 'linear-gradient(135deg, #0F3460 0%, #533483 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'js-mod11-les1',
        title: 'Clases y Objetos',
        icon: '🧱',
        exercises: [
          {
            id: 'jse211', type: 'multiple-choice', xp: 10,
            question: '¿Qué palabra clave se usa para definir una clase?',
            choices: ['object', 'class', 'new', 'define'],
            correct: 1,
            explanation: '"class" define una clase en JavaScript.'
          },
          {
            id: 'jse212', type: 'fill-blank', xp: 20,
            question: 'Crea una instancia de la clase Persona:',
            code: 'class Persona {\n    constructor(nombre) {\n        this.nombre = nombre\n    }\n}\n\nlet p = ___ Persona("Ana")',
            blanks: ['new'],
            options: ['new', 'class', 'create', 'make'],
            explanation: 'Se usa new para crear el objeto a partir de la clase.'
          },
          {
            id: 'jse213', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'class Persona {\n    constructor(nombre) {\n        this.nombre = nombre\n    }\n}\nlet p = new Persona("Ana")\nconsole.log(p.nombre)',
            output: ['Ana', 'Persona', 'undefined', 'Error'],
            correctOutput: 0,
            explanation: 'El constructor guarda "Ana" en this.nombre, que es la propiedad del objeto.'
          },
          {
            id: 'jse214', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace el método constructor?',
            choices: ['Borra el objeto', 'Se ejecuta al crear un objeto con new', 'Devuelve el resultado', 'Hereda de otra clase'],
            correct: 1,
            explanation: 'constructor se ejecuta automáticamente al crear el objeto con new.'
          },
          {
            id: 'jse215', type: 'fill-blank', xp: 25,
            question: 'Crea un método que salude:',
            code: 'class Persona {\n    constructor(n) {\n        this.nombre = n\n    }\n    saludar() {\n        return "Hola, " + ___.nombre\n    }\n}',
            blanks: ['this'],
            options: ['this', 'self', 'yo', 'p'],
            explanation: 'Dentro de los métodos, this es el propio objeto.'
          },
          {
            id: 'jse216', type: 'type-code', xp: 35,
            explanation: 'El constructor recibe los datos al crear el objeto y los guarda con this. Con new se crea una instancia de la clase.',
            description: 'Crea una clase "Coche" con constructor que guarde la marca, y un método que imprima "Mi coche es X".',
            starter: '// Tu clase aquí\n',
            solution: 'class Coche {\n    constructor(marca) {\n        this.marca = marca\n    }\n    mostrar() {\n        console.log("Mi coche es " + this.marca)\n    }\n}\nnew Coche("Toyota").mostrar()',
            tests: [{ expected: 'Mi coche es Toyota\n', contains: 'class' }]
          }
        ]
      },
      {
        id: 'js-mod11-les2',
        title: 'Herencia',
        icon: '🧬',
        exercises: [
          {
            id: 'jse217', type: 'multiple-choice', xp: 15,
            question: '¿Qué palabra clave crea una clase que hereda de otra?',
            choices: ['inherit', 'extends', 'implements', 'super'],
            correct: 1,
            explanation: '"extends" indica que la clase hereda de otra. "super" llama al padre.'
          },
          {
            id: 'jse218', type: 'fill-blank', xp: 25,
            question: 'Haz que Perro herede de Animal:',
            code: 'class Animal {\n    constructor(nombre) {\n        this.nombre = nombre\n    }\n}\n\nclass Perro ___ Animal {\n}',
            blanks: ['extends'],
            options: ['extends', 'inherit', 'implements', 'from'],
            explanation: 'class Perro extends Animal hereda todo lo de Animal.'
          },
          {
            id: 'jse219', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'class Animal {\n    constructor(n) {\n        this.nombre = n\n    }\n    hablar() {\n        return "Soy " + this.nombre\n    }\n}\nclass Perro extends Animal {}\nlet p = new Perro("Rex")\nconsole.log(p.hablar())',
            output: ['Soy Rex', 'Error', 'undefined', 'Soy undefined'],
            correctOutput: 0,
            explanation: 'Perro hereda hablar() y el constructor de Animal, así que funciona.'
          },
          {
            id: 'jse220', type: 'multiple-choice', xp: 20,
            question: 'Si una subclase define su propio constructor, ¿debe llamar al padre?',
            choices: ['No hace falta', 'Sí, con super(...) para reutilizar su lógica', 'Solo si no tiene propiedades', 'Nunca'],
            correct: 1,
            explanation: 'super(...) ejecuta el constructor de la clase padre antes de continuar.'
          },
          {
            id: 'jse221', type: 'fill-blank', xp: 25,
            question: 'Llama al constructor del padre:',
            code: 'class Perro extends Animal {\n    constructor(n, raza) {\n        ___(n)\n        this.raza = raza\n    }\n}',
            blanks: ['super'],
            options: ['super', 'this', 'parent', 'base'],
            explanation: 'super(n) inicializa la parte de Animal con el mismo constructor.'
          },
          {
            id: 'jse222', type: 'type-code', xp: 40,
            explanation: 'extends indica herencia y super(...) llama al constructor de la clase padre para reutilizar su código antes de añadir lo nuevo.',
            description: 'Crea la clase "Vehiculo" con marca y una clase "Coche" que herede y añada color.',
            starter: '// Tus clases aquí\n',
            solution: 'class Vehiculo {\n    constructor(marca) {\n        this.marca = marca\n    }\n}\n\nclass Coche extends Vehiculo {\n    constructor(marca, color) {\n        super(marca)\n        this.color = color\n    }\n}\n\nlet c = new Coche("Toyota", "rojo")\nconsole.log(c.marca + " " + c.color)',
            tests: [{ expected: 'Toyota rojo\n', contains: 'extends' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 12: HERRAMIENTAS INTEGRADAS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod12',
    title: 'Herramientas Integradas',
    subtitle: 'Math, JSON y fechas sin instalar nada',
    icon: '🧰',
    color: '#FA709A',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'js-mod12-les1',
        title: 'Math y números',
        icon: '🔢',
        exercises: [
          {
            id: 'jse223', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se accede al objeto de matemáticas?',
            choices: ['math.', 'Math.', 'Maths.', 'maths.'],
            correct: 1,
            explanation: 'En JavaScript es Math (con mayúscula): Math.sqrt(16).'
          },
          {
            id: 'jse224', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(Math.sqrt(16))',
            output: ['4', '16', '8', 'Error'],
            correctOutput: 0,
            explanation: 'Math.sqrt() devuelve la raíz cuadrada: raíz de 16 = 4.'
          },
          {
            id: 'jse225', type: 'fill-blank', xp: 20,
            question: 'Redondea Math.PI a 2 decimales:',
            code: 'let r = ___(Math.PI * 100) / 100\nconsole.log(r)',
            blanks: ['Math.round'],
            options: ['Math.round', 'Math.redondea', 'round', 'Math.floor'],
            explanation: 'Math.round redondea al entero más cercano.'
          },
          {
            id: 'jse226', type: 'multiple-choice', xp: 20,
            question: '¿Qué devuelve Math.max(3, 7, 2)?',
            choices: ['3', '2', '7', '12'],
            correct: 2,
            explanation: 'Math.max devuelve el valor más grande de los que recibe.'
          },
          {
            id: 'jse227', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este código?',
            codeToRun: 'console.log(Math.max(3, 7, 2))\nconsole.log(Math.min(3, 7, 2))',
            output: ['7\n3', '3\n7', '12\n2', 'Error'],
            correctOutput: 0,
            explanation: 'max da el mayor (7) y min el menor (3).'
          },
          {
            id: 'jse228', type: 'type-code', xp: 30,
            explanation: 'Math es un objeto con métodos matemáticos ya listos: Math.sqrt() devuelve la raíz cuadrada sin instalar nada.',
            description: 'Imprime la raíz cuadrada de 81 usando Math.',
            starter: '// Tu código aquí\n',
            solution: 'console.log(Math.sqrt(81))',
            tests: [{ expected: '9\n', contains: 'Math.' }]
          }
        ]
      },
      {
        id: 'js-mod12-les2',
        title: 'JSON y fechas',
        icon: '📦',
        exercises: [
          {
            id: 'jse229', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve JSON.stringify()?',
            choices: ['Leer un archivo', 'Convertir un objeto en texto JSON', 'Borrar un objeto', 'Ordenar claves'],
            correct: 1,
            explanation: 'stringify convierte un objeto de JavaScript en una cadena de texto JSON.'
          },
          {
            id: 'jse230', type: 'fill-blank', xp: 25,
            question: 'Convierte un objeto en texto JSON:',
            code: 'let datos = { nombre: "Ana", edad: 25 }\nlet texto = ___(datos)\nconsole.log(typeof texto)',
            blanks: ['JSON.stringify'],
            options: ['JSON.stringify', 'JSON.parse', 'JSON.text', 'String'],
            explanation: 'JSON.stringify devuelve texto, así que typeof da "string".'
          },
          {
            id: 'jse231', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let texto = \'{"nombre": "Ana", "edad": 25}\'\nlet obj = JSON.parse(texto)\nconsole.log(obj.nombre)',
            output: ['Ana', '{"nombre": "Ana", "edad": 25}', 'undefined', 'Error'],
            correctOutput: 0,
            explanation: 'JSON.parse convierte el texto en un objeto, y así se accede a sus propiedades.'
          },
          {
            id: 'jse232', type: 'multiple-choice', xp: 20,
            question: '¿Qué devuelve typeof JSON.parse("{}")?',
            choices: ['string', 'object', 'number', 'undefined'],
            correct: 1,
            explanation: 'JSON.parse siempre devuelve un objeto (typeof "object").'
          },
          {
            id: 'jse233', type: 'fill-blank', xp: 25,
            question: 'Obtén el año actual:',
            code: 'let anio = ___.getFullYear()\nconsole.log(typeof anio)',
            blanks: ['new Date'],
            options: ['new Date', 'Date.now', 'Math.year', 'new Time'],
            explanation: 'new Date().getFullYear() devuelve el año actual (un número).'
          },
          {
            id: 'jse234', type: 'type-code', xp: 35,
            explanation: 'JSON.stringify() convierte un objeto en texto JSON. Para volver a leerlo después se usa JSON.parse().',
            description: 'Convierte el objeto {nombre: "Ana", edad: 25} a texto JSON e imprímelo.',
            starter: 'let datos = { nombre: "Ana", edad: 25 }\n',
            solution: 'let datos = { nombre: "Ana", edad: 25 }\nlet texto = JSON.stringify(datos)\nconsole.log(texto)',
            tests: [{ expected: '{"nombre":"Ana","edad":25}\n', contains: 'JSON.stringify' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 13: PROYECTO CALCULADORA
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod13',
    title: '🏆 Proyecto: Calculadora',
    subtitle: 'Construye una calculadora completa',
    icon: '🧮',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    level: 'Proyecto',
    isProject: true,
    lessons: [
      {
        id: 'js-mod13-les1',
        title: 'Operaciones Básicas',
        icon: '➕',
        exercises: [
          {
            id: 'jse235', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el primer paso para diseñar una calculadora?',
            choices: ['Escribir el HTML', 'Decidir qué operaciones soporta y cómo se invocan', 'Ponerla bonita', 'Publicarla'],
            correct: 1,
            explanation: 'Primero se decide la lógica (operaciones y reglas); lo visual viene después.'
          },
          {
            id: 'jse236', type: 'fill-blank', xp: 25,
            question: 'Crea la función de suma:',
            code: 'function sumar(a, b) {\n    ___ a + b\n}\n\nconsole.log(sumar(10, 5))',
            blanks: ['return'],
            options: ['return', 'print', 'console', 'give'],
            explanation: 'return devuelve el resultado para poder usarlo o imprimirlo.'
          },
          {
            id: 'jse237', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'function potencia(base, exp) {\n    return base ** exp\n}\n\nlet ops = { "**": potencia }\nconsole.log(ops["**"](2, 10))',
            output: ['20', '1024', '10', 'Error'],
            correctOutput: 1,
            explanation: 'El objeto guarda la función y se llama con ops["**"](2, 10) = 2**10 = 1024.'
          },
          {
            id: 'jse238', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se evita el error de dividir entre cero?',
            choices: ['Con try/catch', 'Comprobando si el divisor es 0 antes de dividir', 'Con Math.min', 'No se puede evitar'],
            correct: 1,
            explanation: 'La forma más clara es validar la entrada antes de dividir.'
          },
          {
            id: 'jse239', type: 'reorder', xp: 25,
            question: 'Ordena una función que divide de forma segura:',
            blocks: ['    return a / b', 'function dividir(a, b) {', '    return "Error: división entre cero"', '    if (b === 0) {', '}'],
            correctOrder: [1, 3, 2, 0, 4],
            explanation: 'Primero comprobar, luego el error, luego dividir.'
          },
          {
            id: 'jse240', type: 'type-code', xp: 40,
            explanation: 'Cada operación es una función con su return. La division comprueba antes el divisor para no dividir entre cero.',
            description: 'Crea sumar, restar, multiplicar y dividir. La división debe devolver "Error: división entre cero" si b es 0. Imprime sumar(10,5), restar(10,5), multiplicar(4,3) y dividir(10,0).',
            starter: '// Tu calculadora aquí\n',
            solution: 'function sumar(a, b) {\n    return a + b\n}\nfunction restar(a, b) {\n    return a - b\n}\nfunction multiplicar(a, b) {\n    return a * b\n}\nfunction dividir(a, b) {\n    if (b === 0) {\n        return "Error: división entre cero"\n    }\n    return a / b\n}\nconsole.log(sumar(10, 5))\nconsole.log(restar(10, 5))\nconsole.log(multiplicar(4, 3))\nconsole.log(dividir(10, 0))',
            tests: [{ expected: '15\n5\n12\nError: división entre cero\n' }]
          }
        ]
      },
      {
        id: 'js-mod13-les2',
        title: 'Calculadora con Historial',
        icon: '📜',
        exercises: [
          {
            id: 'jse241', type: 'multiple-choice', xp: 20,
            question: '¿Qué estructura de datos usaremos para el historial?',
            choices: ['Un objeto', 'Un array de operaciones', 'Una variable', 'Una imagen'],
            correct: 1,
            explanation: 'Un array es lo natural: se añade con push y se recorre con for...of.'
          },
          {
            id: 'jse242', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se añade una operación al historial?',
            choices: ['historial.push(...)', 'historial.add(...)', 'historial[0] = ...', 'historial.append(...)'],
            correct: 0,
            explanation: 'push() añade un elemento al final del array.'
          },
          {
            id: 'jse243', type: 'fill-blank', xp: 25,
            question: 'Registra una operación en el historial:',
            code: 'let historial = []\n\nfunction registrar(operacion, resultado) {\n    historial.___({ operacion: operacion, resultado: resultado })\n}',
            blanks: ['push'],
            options: ['push', 'add', 'set', 'put'],
            explanation: 'historial.push() guarda la operación al final del array.'
          },
          {
            id: 'jse244', type: 'predict-output', xp: 25,
            question: '¿Cuántas operaciones hay en el historial?',
            codeToRun: 'let historial = []\nhistorial.push({ op: "+" })\nhistorial.push({ op: "-" })\nconsole.log(historial.length)',
            output: ['1', '2', '3', 'Error'],
            correctOutput: 1,
            explanation: 'Se añadieron dos objetos, así que el historial tiene 2 elementos.'
          },
          {
            id: 'jse245', type: 'fill-blank', xp: 25,
            question: 'Imprime cada operación guardada:',
            code: 'for (let item of ___) {\n    console.log(item.operacion + " = " + item.resultado)\n}',
            blanks: ['historial'],
            options: ['historial', 'items', 'ops', 'lista'],
            explanation: 'for...of recorre el array historial elemento a elemento.'
          },
          {
            id: 'jse246', type: 'type-code', xp: 40,
            explanation: 'push() guarda cada operación como un objeto {operacion, resultado}, y el for...of las va mostrando una a una.',
            description: 'Amplía la calculadora: crea una función registrar(op, resultado) que guarde en un array y una función mostrar() que imprima cada línea. Prueba: registrar("+", 15) y registrar("-", 5).',
            starter: '// Tu historial aquí\n',
            solution: 'let historial = []\nfunction registrar(operacion, resultado) {\n    historial.push({ operacion: operacion, resultado: resultado })\n}\nfunction mostrar() {\n    for (let item of historial) {\n        console.log(item.operacion + " = " + item.resultado)\n    }\n}\nregistrar("+", 15)\nregistrar("-", 5)\nmostrar()',
            tests: [{ expected: '+ = 15\n- = 5\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JS MÓDULO 14: PROYECTO GESTOR DE TAREAS
  // ═══════════════════════════════════════════════
  {
    id: 'js-mod14',
    title: '🏆 Proyecto: Gestor de Tareas',
    subtitle: 'Tu primera app de productividad',
    icon: '✅',
    color: '#00E87A',
    gradient: 'linear-gradient(135deg, #00E87A 0%, #38F9D7 100%)',
    level: 'Proyecto',
    isProject: true,
    lessons: [
      {
        id: 'js-mod14-les1',
        title: 'CRUD de Tareas',
        icon: '📋',
        exercises: [
          {
            id: 'jse247', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa CRUD?',
            choices: ['Crear, Leer, Actualizar, Borrar', 'Compilar, Repisar, Usar, Depurar', 'Cargar, Redirigir, Unir, Dividir', 'Crear, Romper, Usar, Duplicar'],
            correct: 0,
            explanation: 'CRUD son las cuatro operaciones básicas sobre datos.'
          },
          {
            id: 'jse248', type: 'multiple-choice', xp: 20,
            question: '¿Qué representa la "R" (Read) de CRUD en un gestor de tareas?',
            choices: ['Leer y mostrar las tareas', 'Recargar la página', 'Renombrar el archivo', 'Reiniciar los datos'],
            correct: 0,
            explanation: 'Leer es poder consultar y mostrar las tareas guardadas.'
          },
          {
            id: 'jse249', type: 'fill-blank', xp: 25,
            question: 'Diseña la estructura de una tarea:',
            code: 'function crearTarea(titulo) {\n    return {\n        id: 1,\n        titulo: titulo,\n        completada: ___\n    }\n}',
            blanks: ['false'],
            options: ['false', 'true', 'null', '0'],
            explanation: 'Una tarea nueva empieza sin completar: completada es false.'
          },
          {
            id: 'jse250', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let tareas = []\ntareas.push({ titulo: "Comprar pan", completada: false })\ntareas.push({ titulo: "Estudiar", completada: true })\nconsole.log(tareas.length + " " + tareas[1].titulo)',
            output: ['2 Estudiar', '1 Estudiar', '2 Comprar pan', 'Error'],
            correctOutput: 0,
            explanation: 'Hay 2 tareas y la de índice 1 es "Estudiar".'
          },
          {
            id: 'jse251', type: 'reorder', xp: 25,
            question: 'Ordena una función que marca una tarea como completada:',
            blocks: ['}', 'function completar(id) {', '    tarea.completada = true', '    let tarea = this.tareas.find(t => t.id === id)'],
            correctOrder: [1, 3, 2, 0],
            explanation: 'Declaración → buscar la tarea → marcarla → cerrar.'
          },
          {
            id: 'jse252', type: 'type-code', xp: 45,
            explanation: 'La clase guarda el array de tareas y un contador para los ids. find() busca el primer elemento que cumple la condición y así se marca como completada.',
            description: 'Crea una clase "GestorTareas" con: array de tareas, agregarTarea(titulo) con id auto-incremental, completarTarea(id) y listar() que imprima "titulo: completada". Prueba 2 tareas y completa la primera.',
            starter: '// Tu clase aquí\n',
            solution: 'class GestorTareas {\n    constructor() {\n        this.tareas = []\n        this.siguienteId = 1\n    }\n    agregarTarea(titulo) {\n        this.tareas.push({ id: this.siguienteId, titulo: titulo, completada: false })\n        this.siguienteId++\n    }\n    completarTarea(id) {\n        let tarea = this.tareas.find(t => t.id === id)\n        if (tarea) {\n            tarea.completada = true\n        }\n    }\n    listar() {\n        for (let t of this.tareas) {\n            console.log(t.titulo + ": " + t.completada)\n        }\n    }\n}\nlet g = new GestorTareas()\ng.agregarTarea("Tarea uno")\ng.agregarTarea("Tarea dos")\ng.completarTarea(1)\ng.listar()',
            tests: [{ expected: 'Tarea uno: true\nTarea dos: false\n', contains: 'class' }]
          }
        ]
      },
      {
        id: 'js-mod14-les2',
        title: 'Estadísticas y Filtros',
        icon: '📊',
        exercises: [
          {
            id: 'jse253', type: 'multiple-choice', xp: 20,
            question: '¿Cómo contamos las tareas completadas?',
            choices: ['Con un bucle que las recorra', 'Con filter()', 'Con un if suelto', 'No se puede'],
            correct: 1,
            explanation: 'filter() deja solo las que cumplen la condición; con length las contamos.'
          },
          {
            id: 'jse254', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este código?',
            codeToRun: 'let tareas = [{ c: true }, { c: false }, { c: true }]\nlet hechas = tareas.filter(t => t.c).length\nconsole.log(hechas)',
            output: ['1', '2', '3', 'Error'],
            correctOutput: 1,
            explanation: 'filter deja las 2 que están completadas y length da 2.'
          },
          {
            id: 'jse255', type: 'fill-blank', xp: 25,
            question: 'Calcula las pendientes:',
            code: 'let total = 10\nlet completadas = 4\nlet pendientes = total - ___\nconsole.log(pendientes)',
            blanks: ['completadas'],
            options: ['completadas', 'total', 'tareas', 'hechas'],
            explanation: 'Pendientes = total − completadas.'
          },
          {
            id: 'jse256', type: 'multiple-choice', xp: 20,
            question: '¿Cómo buscamos tareas cuyo título contenga un texto, ignorando mayúsculas?',
            choices: ['filter con toLowerCase() en ambos lados', 'Un if al principio', 'Con alert', 'Con length'],
            correct: 0,
            explanation: 'Se comparan ambos en minúsculas: t.titulo.toLowerCase().includes(texto.toLowerCase()).'
          },
          {
            id: 'jse257', type: 'fill-blank', xp: 25,
            question: 'Completa la búsqueda insensible a mayúsculas:',
            code: 'function buscar(tareas, texto) {\n    return tareas.filter(t => t.titulo.___(texto))\n}',
            blanks: ['toLowerCase().includes'],
            options: ['toLowerCase().includes', 'includes', 'toLowerCase', 'search'],
            explanation: 'Baja ambos a minúsculas y comprueba si el texto está incluido.'
          },
          {
            id: 'jse258', type: 'type-code', xp: 45,
            explanation: 'filter() devuelve los elementos que cumplen la condición. El toLowerCase() en ambos lados hace que la búsqueda ignore las mayúsculas.',
            description: 'Crea una función "buscar(tareas, texto)" que imprima los títulos que contengan ese texto (sin importar mayúsculas). Prueba con "Comprar" y "estudiar".',
            starter: 'let tareas = [\n    { titulo: "Comprar pan" },\n    { titulo: "Estudiar JS" },\n    { titulo: "Salir a correr" }\n]\n',
            solution: 'let tareas = [\n    { titulo: "Comprar pan" },\n    { titulo: "Estudiar JS" },\n    { titulo: "Salir a correr" }\n]\n\nfunction buscar(tareas, texto) {\n    let encontradas = tareas.filter(t => t.titulo.toLowerCase().includes(texto.toLowerCase()))\n    for (let t of encontradas) {\n        console.log(t.titulo)\n    }\n}\n\nbuscar(tareas, "comprar")\nbuscar(tareas, "ESTUDIAR")',
            tests: [{ expected: 'Comprar pan\nEstudiar JS\n', contains: 'toLowerCase' }]
          }
        ]
      }
    ]
  }
];
