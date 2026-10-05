// DevQuest Curriculum — De cero a proyectos reales
// 14 módulos · 40 lecciones · 230 ejercicios

window.CURRICULUM = {
  modules: [

    // ═══════════════════════════════════════════════
    // MÓDULO 1: TU PRIMER PROGRAMA
    // ═══════════════════════════════════════════════
    {
      id: 'mod1',
      title: 'Tu Primer Programa',
      subtitle: 'Empieza a hablar con el ordenador',
      icon: '🐣',
      color: '#FF6B9D',
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C850C0 100%)',
      level: 'Principiante',
      lessons: [
        {
          id: 'mod1-les1',
          title: '¡Hola, Mundo!',
          icon: '👋',
          exercises: [
            {
              id: 'e001', type: 'multiple-choice', xp: 10,
              question: '¿Qué función se usa en Python para mostrar texto en pantalla?',
              choices: ['show()', 'print()', 'display()', 'write()'],
              correct: 1,
              explanation: 'print() es la función fundamental de Python para mostrar información en pantalla.'
            },
            {
              id: 'e002', type: 'fill-blank', xp: 15,
              question: 'Completa el código para imprimir "Hola, Mundo":',
              code: '___("Hola, Mundo")',
              blanks: ['print'],
              options: ['print', 'show', 'write', 'display'],
              explanation: 'print() es la función correcta. El texto va entre paréntesis y comillas.'
            },
            {
              id: 'e003', type: 'predict-output', xp: 15,
              question: '¿Qué aparece en pantalla al ejecutar este código?',
              codeToRun: 'print("Python")',
              output: ['python', 'Python', '"Python"', 'Error'],
              correctOutput: 1,
              explanation: 'Python distingue mayúsculas de minúsculas. Se imprime exactamente lo que está entre comillas.'
            },
            {
              id: 'e004', type: 'multiple-choice', xp: 10,
              question: '¿Cuál de estos es un programa Python válido?',
              choices: ['print["Hola"]', 'print("Hola")', 'PRINT("Hola")', 'Print("Hola")'],
              correct: 1,
              explanation: 'Python es sensible a mayúsculas. La función es print() en minúsculas, con paréntesis.'
            },
            {
              id: 'e005', type: 'fill-blank', xp: 20,
              question: 'Imprime tu nombre con print:',
              code: 'print(___)',
              blanks: ['"Python"'],
              options: ['"Python"', 'Python', '(Python)', '[Python]'],
              explanation: 'Los textos en Python siempre van entre comillas, simples o dobles.'
            },
            {
              id: 'e006', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print("1 + 1")',
              output: ['2', '1 + 1', 'Error', '"1 + 1"'],
              correctOutput: 1,
              explanation: 'Dentro de las comillas, "1 + 1" es texto, no una operación matemática.'
            }
          ]
        },
        {
          id: 'mod1-les2',
          title: 'Múltiples Prints',
          icon: '🖨️',
          exercises: [
            {
              id: 'e007', type: 'predict-output', xp: 15,
              question: '¿Cuántas líneas imprime este código?',
              codeToRun: 'print("Línea 1")\nprint("Línea 2")\nprint("Línea 3")',
              output: ['1', '2', '3', '0'],
              correctOutput: 2,
              explanation: 'Cada print() imprime en una nueva línea.'
            },
            {
              id: 'e008', type: 'reorder', xp: 20,
              question: 'Ordena el código para imprimir "Hola" y luego "Mundo":',
              blocks: ['print("Mundo")', 'print("Hola")'],
              correctOrder: [1, 0],
              explanation: 'Python ejecuta las instrucciones de arriba a abajo.'
            },
            {
              id: 'e009', type: 'fill-blank', xp: 20,
              question: 'Completa para imprimir dos cosas:',
              code: 'print("Python")\n___("es genial")',
              blanks: ['print'],
              options: ['print', 'show', 'echo', 'write'],
              explanation: 'Usamos print() para cada línea que queremos mostrar.'
            },
            {
              id: 'e010', type: 'multiple-choice', xp: 15,
              question: '¿Qué imprime print() sin argumentos?',
              choices: ['Nada, da error', 'Una línea vacía', '" "', 'None'],
              correct: 1,
              explanation: 'print() sin argumentos imprime una línea en blanco.'
            },
            {
              id: 'e011', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print("A", "B", "C")',
              output: ['ABC', 'A B C', 'A, B, C', 'Error'],
              correctOutput: 1,
              explanation: 'print() separa múltiples argumentos con un espacio por defecto.'
            },
            {
              id: 'e012', type: 'type-code', xp: 30,
              explanation: 'Cada print() escribe una línea y añade un salto al final. Como el enunciado pide dos líneas separadas, necesitas dos llamadas a print.',
              description: 'Escribe un programa que imprima exactamente:\n¡Hola!\nBienvenido a DevQuest',
              starter: '# Escribe tu código aquí\n',
              solution: 'print("¡Hola!")\nprint("Bienvenido a DevQuest")',
              tests: [{ expected: '¡Hola!\nBienvenido a DevQuest\n' }]
            }
          ]
        },
        {
          id: 'mod1-les3',
          title: 'Comentarios',
          icon: '💬',
          exercises: [
            {
              id: 'e013', type: 'multiple-choice', xp: 10,
              question: '¿Cómo se escribe un comentario de una línea en Python?',
              choices: ['// Comentario', '/* Comentario */', '# Comentario', '-- Comentario'],
              correct: 2,
              explanation: 'Python usa # para comentarios de una sola línea.'
            },
            {
              id: 'e014', type: 'fill-blank', xp: 15,
              question: 'Añade un comentario antes del print:',
              code: '___ Este código dice hola\nprint("Hola")',
              blanks: ['#'],
              options: ['#', '//', '/*', '--'],
              explanation: 'El símbolo # indica que todo lo que sigue es un comentario.'
            },
            {
              id: 'e015', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: '# print("Esto no aparece")\nprint("Esto sí aparece")',
              output: ['Esto no aparece', 'Esto sí aparece', 'Ambas líneas', 'Error'],
              correctOutput: 1,
              explanation: 'Los comentarios son ignorados por Python. Solo se ejecuta print("Esto sí aparece").'
            },
            {
              id: 'e016', type: 'multiple-choice', xp: 15,
              question: '¿Para qué sirven los comentarios?',
              choices: ['Hacen el código más rápido', 'Explican el código para humanos', 'Son obligatorios en Python', 'Ejecutan código especial'],
              correct: 1,
              explanation: 'Los comentarios son notas para los programadores. Python los ignora completamente.'
            },
            {
              id: 'e017', type: 'fill-blank', xp: 20,
              question: 'Completa el programa con un comentario explicativo:',
              code: '___ Saludar al usuario\nprint("¡Bienvenido!")',
              blanks: ['#'],
              options: ['#', '//', 'rem', 'note'],
              explanation: '# es la forma de Python para comentar código.'
            },
            {
              id: 'e018', type: 'predict-output', xp: 20,
              question: '¿Cuántas líneas se imprimen?',
              codeToRun: 'print("Primera")\n# print("Segunda")\nprint("Tercera")',
              output: ['1', '2', '3', '0'],
              correctOutput: 1,
              explanation: 'Solo se ejecutan "Primera" y "Tercera". La línea con # es un comentario.'
            }
          ]
        },
        {
          id: 'mod1-les4',
          title: 'Tu Primera App',
          icon: '🚀',
          exercises: [
            {
              id: 'e019', type: 'reorder', xp: 25,
              question: 'Ordena el código para crear un programa que salude:',
              blocks: ['print("¡Hasta pronto!")', '# Programa de saludo', 'print("¡Hola, Pythonista!")'],
              correctOrder: [1, 2, 0],
              explanation: 'Es buena práctica poner comentarios al inicio, luego el código principal.'
            },
            {
              id: 'e020', type: 'multiple-choice', xp: 15,
              question: '¿Cuál es el archivo de extensión de los programas Python?',
              choices: ['.java', '.py', '.python', '.pt'],
              correct: 1,
              explanation: 'Los archivos Python tienen extensión .py, como "mi_programa.py".'
            },
            {
              id: 'e021', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este programa?',
              codeToRun: 'print("Nombre:", "Ana")\nprint("Edad:", 25)',
              output: ['Nombre: Ana\nEdad: 25', 'Nombre:Ana\nEdad:25', 'Error', 'Ana\n25'],
              correctOutput: 0,
              explanation: 'print() con múltiples argumentos los separa con espacio.'
            },
            {
              id: 'e022', type: 'fix-bug', xp: 25,
              question: 'Este código tiene un error. ¿Cuál es el correcto?',
              buggyCode: 'Print("Hola, Mundo")',
              fixedCode: 'print("Hola, Mundo")',
              choices: ['Print("Hola, Mundo")', 'print("Hola, Mundo")', 'PRINT("Hola, Mundo")', 'printf("Hola, Mundo")'],
              correct: 1,
              explanation: 'Python distingue mayúsculas. La función debe ser print() en minúsculas.'
            },
            {
              id: 'e023', type: 'type-code', xp: 35,
              explanation: 'print() separa con un espacio los argumentos que le pases. Aquí cada línea de la tarjeta es un print independiente.',
              description: 'Crea tu tarjeta de presentación:\n• Línea 1: "Nombre: " + tu nombre\n• Línea 2: "Lenguaje favorito: Python"\n• Línea 3: "Nivel: Principiante"',
              starter: '# Mi tarjeta de presentación\n',
              solution: 'print("Nombre: Python")\nprint("Lenguaje favorito: Python")\nprint("Nivel: Principiante")',
              tests: [{ expected: 'Nombre: Python\nLenguaje favorito: Python\nNivel: Principiante\n' }]
            },
            {
              id: 'e024', type: 'multiple-choice', xp: 15,
              question: '¿Cuál es la ventaja de Python como primer lenguaje?',
              choices: ['Es el más rápido', 'Tiene sintaxis clara y legible', 'Solo sirve para web', 'Necesita compilación'],
              correct: 1,
              explanation: 'Python tiene una sintaxis muy limpia y legible, ideal para aprender programación.'
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 2: VARIABLES Y TIPOS
    // ═══════════════════════════════════════════════
    {
      id: 'mod2',
      title: 'Variables y Tipos',
      subtitle: 'Guarda y manipula información',
      icon: '📦',
      color: '#4FACFE',
      gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      level: 'Principiante',
      lessons: [
        {
          id: 'mod2-les1',
          title: 'Variables',
          icon: '🏷️',
          exercises: [
            {
              id: 'e025', type: 'multiple-choice', xp: 10,
              question: '¿Qué es una variable en Python?',
              choices: ['Un número fijo', 'Un contenedor para guardar datos', 'Una función especial', 'Un tipo de bucle'],
              correct: 1,
              explanation: 'Una variable es como una caja con nombre donde guardamos información.'
            },
            {
              id: 'e026', type: 'fill-blank', xp: 15,
              question: 'Crea una variable llamada "edad" con valor 20:',
              code: '___ = 20',
              blanks: ['edad'],
              options: ['edad', '"edad"', 'Edad', '(edad)'],
              explanation: 'Los nombres de variables no llevan comillas. Se asignan con el signo =.'
            },
            {
              id: 'e027', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'nombre = "Ana"\nprint(nombre)',
              output: ['"Ana"', 'nombre', 'Ana', 'Error'],
              correctOutput: 2,
              explanation: 'print(nombre) imprime el valor guardado en la variable, no el nombre de la variable.'
            },
            {
              id: 'e028', type: 'multiple-choice', xp: 15,
              question: '¿Cuál nombre de variable es INVÁLIDO en Python?',
              choices: ['mi_nombre', 'nombre1', '1nombre', '_nombre'],
              correct: 2,
              explanation: 'Los nombres de variables no pueden empezar con un número.'
            },
            {
              id: 'e029', type: 'fill-blank', xp: 20,
              question: 'Imprime el valor de la variable ciudad:',
              code: 'ciudad = "Madrid"\nprint(___)',
              blanks: ['ciudad'],
              options: ['ciudad', '"ciudad"', '(ciudad)', 'Madrid'],
              explanation: 'Para imprimir una variable, escribe su nombre sin comillas en print().'
            },
            {
              id: 'e030', type: 'fix-bug', xp: 25,
              question: '¿Cuál es la versión correcta?',
              buggyCode: '1ciudad = "Madrid"',
              fixedCode: 'ciudad = "Madrid"',
              choices: ['1ciudad = "Madrid"', 'ciudad = "Madrid"', '"ciudad" = "Madrid"', 'ciudad == "Madrid"'],
              correct: 1,
              explanation: 'Los nombres de variable no pueden empezar con número y se asignan con = (no ==).'
            }
          ]
        },
        {
          id: 'mod2-les2',
          title: 'Números Enteros',
          icon: '🔢',
          exercises: [
            {
              id: 'e031', type: 'multiple-choice', xp: 10,
              question: '¿Qué tipo de dato es el número 42 en Python?',
              choices: ['float', 'int', 'str', 'bool'],
              correct: 1,
              explanation: 'Los números enteros (sin decimales) son de tipo int en Python.'
            },
            {
              id: 'e032', type: 'fill-blank', xp: 15,
              question: 'Guarda el número 100 en una variable:',
              code: 'puntuacion = ___',
              blanks: ['100'],
              options: ['100', '"100"', '(100)', '[100]'],
              explanation: 'Los números enteros se escriben sin comillas.'
            },
            {
              id: 'e033', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'x = 10\ny = 3\nprint(x + y)',
              output: ['10', '3', '13', '103'],
              correctOutput: 2,
              explanation: 'Python suma los valores numéricos: 10 + 3 = 13.'
            },
            {
              id: 'e034', type: 'multiple-choice', xp: 15,
              question: '¿Cuál función muestra el tipo de una variable?',
              choices: ['typeof()', 'type()', 'kind()', 'datatype()'],
              correct: 1,
              explanation: 'type(variable) devuelve el tipo de dato de la variable.'
            },
            {
              id: 'e035', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'x = 5\nx = 10\nprint(x)',
              output: ['5', '10', '15', 'Error'],
              correctOutput: 1,
              explanation: 'Las variables pueden cambiar de valor. x fue reasignada a 10.'
            },
            {
              id: 'e036', type: 'type-code', xp: 30,
              explanation: 'El signo = crea una variable y guarda el valor. Al imprimir manzanas + naranjas se ve el resultado (8), no las letras.',
              description: 'Crea dos variables: "manzanas" con valor 5 y "naranjas" con valor 3. Imprime la suma.',
              starter: '# Variables de frutas\n',
              solution: 'manzanas = 5\nnaranjas = 3\nprint(manzanas + naranjas)',
              tests: [{ expected: '8\n' }]
            }
          ]
        },
        {
          id: 'mod2-les3',
          title: 'Decimales y Texto',
          icon: '📝',
          exercises: [
            {
              id: 'e037', type: 'multiple-choice', xp: 10,
              question: '¿Qué tipo de dato es 3.14 en Python?',
              choices: ['int', 'double', 'float', 'decimal'],
              correct: 2,
              explanation: 'Los números con decimales son de tipo float (punto flotante).'
            },
            {
              id: 'e038', type: 'fill-blank', xp: 15,
              question: 'Crea una variable con el precio de algo:',
              code: 'precio = ___',
              blanks: ['9.99'],
              options: ['9.99', '"9.99"', '9,99', '9-99'],
              explanation: 'Los decimales usan punto (.) no coma (,).'
            },
            {
              id: 'e039', type: 'multiple-choice', xp: 15,
              question: '¿Cómo se llama el tipo de dato para texto en Python?',
              choices: ['text', 'string', 'str', 'char'],
              correct: 2,
              explanation: 'El tipo para texto es str (string). Ejemplo: nombre = "Ana".'
            },
            {
              id: 'e040', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'precio = 2.5\ncantidad = 3\nprint(precio * cantidad)',
              output: ['5.5', '7.5', '2.53', 'Error'],
              correctOutput: 1,
              explanation: '2.5 × 3 = 7.5. Python puede multiplicar floats e ints.'
            },
            {
              id: 'e041', type: 'fill-blank', xp: 20,
              question: 'Completa con el tipo correcto:',
              code: 'nombre = ___\nedad = ___\naltura = ___',
              blanks: ['"Luis"', '25', '1.75'],
              options: ['"Luis"', '25', '1.75', 'Luis', '"25"', '"1.75"'],
              explanation: 'Texto entre comillas, enteros sin decimales, decimales con punto.'
            },
            {
              id: 'e042', type: 'predict-output', xp: 20,
              question: '¿Qué tipo devuelve type(3.14)?',
              codeToRun: 'print(type(3.14))',
              output: ["<class 'int'>", "<class 'float'>", "<class 'double'>", 'float'],
              correctOutput: 1,
              explanation: 'type() devuelve la clase del objeto. 3.14 es de tipo float.'
            }
          ]
        },
        {
          id: 'mod2-les4',
          title: 'Booleanos',
          icon: '✅',
          exercises: [
            {
              id: 'e043', type: 'multiple-choice', xp: 10,
              question: '¿Cuántos valores posibles tiene un booleano?',
              choices: ['1', '2', '10', 'Infinitos'],
              correct: 1,
              explanation: 'Un booleano solo puede ser True o False.'
            },
            {
              id: 'e044', type: 'fill-blank', xp: 15,
              question: 'Crea una variable booleana:',
              code: 'activo = ___',
              blanks: ['True'],
              options: ['True', 'true', '"True"', '1'],
              explanation: 'En Python los booleanos se escriben True y False (con mayúscula inicial).'
            },
            {
              id: 'e045', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(5 > 3)',
              output: ['5', '3', 'True', 'False'],
              correctOutput: 2,
              explanation: '5 es mayor que 3, así que la comparación devuelve True.'
            },
            {
              id: 'e046', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(10 == 10)\nprint(5 == 3)',
              output: ['True\nTrue', 'True\nFalse', 'False\nTrue', 'False\nFalse'],
              correctOutput: 1,
              explanation: '10 == 10 es True. 5 == 3 es False. == compara igualdad.'
            },
            {
              id: 'e047', type: 'multiple-choice', xp: 15,
              question: '¿Cuál es el tipo de dato de True en Python?',
              choices: ['int', 'str', 'bool', 'boolean'],
              correct: 2,
              explanation: 'True y False son de tipo bool (boolean).'
            },
            {
              id: 'e048', type: 'fill-blank', xp: 20,
              question: 'Completa la comparación:',
              code: 'mayor = 10 ___ 5\nprint(mayor)',
              blanks: ['>'],
              options: ['>', '<', '=', '>='],
              explanation: '> es el operador "mayor que". 10 > 5 devuelve True.'
            }
          ]
        },
        {
          id: 'mod2-les5',
          title: 'Conversión de Tipos',
          icon: '🔄',
          exercises: [
            {
              id: 'e049', type: 'multiple-choice', xp: 10,
              question: '¿Cómo conviertes el string "42" a entero?',
              choices: ['string(42)', 'int("42")', 'to_int("42")', 'Integer("42")'],
              correct: 1,
              explanation: 'int() convierte un string a número entero: int("42") → 42.'
            },
            {
              id: 'e050', type: 'fill-blank', xp: 20,
              question: 'Convierte el texto a número:',
              code: 'texto = "25"\nnumero = ___(texto)\nprint(numero + 5)',
              blanks: ['int'],
              options: ['int', 'str', 'float', 'bool'],
              explanation: 'int() convierte strings a enteros para poder operar con ellos.'
            },
            {
              id: 'e051', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'num = 42\ntexto = str(num)\nprint(texto + "!")',
              output: ['43!', '42!', '"42"!', 'Error'],
              correctOutput: 1,
              explanation: 'str(42) convierte el número al string "42". Luego "42" + "!" = "42!".'
            },
            {
              id: 'e052', type: 'multiple-choice', xp: 15,
              question: '¿Cuál convierte "3.14" a decimal?',
              choices: ['int("3.14")', 'float("3.14")', 'decimal("3.14")', 'num("3.14")'],
              correct: 1,
              explanation: 'float() convierte strings a números decimales.'
            },
            {
              id: 'e053', type: 'fix-bug', xp: 25,
              question: '¿Cuál versión suma correctamente un número y una edad en texto?',
              buggyCode: 'edad = "20"\nprint(edad + 5)',
              fixedCode: 'edad = "20"\nprint(int(edad) + 5)',
              choices: ['print(edad + 5)', 'print(int(edad) + 5)', 'print(str(edad) + 5)', 'print(edad + "5")'],
              correct: 1,
              explanation: 'Debes convertir el string a int antes de sumar con otro número.'
            },
            {
              id: 'e054', type: 'type-code', xp: 35,
              explanation: 'Un string con un número no sirve para multiplicar ("7" * 6 repetiría el texto). Con int() lo conviertes a número y ya puedes operar.',
              description: 'Convierte el string "7" a int, multiplícalo por 6 e imprime el resultado.',
              starter: 'numero = "7"\n# Tu código aquí\n',
              solution: 'numero = "7"\nresultado = int(numero) * 6\nprint(resultado)',
              tests: [{ expected: '42\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 3: OPERACIONES MATEMÁTICAS
    // ═══════════════════════════════════════════════
    {
      id: 'mod3',
      title: 'Operaciones Matemáticas',
      subtitle: 'Python como calculadora poderosa',
      icon: '🔢',
      color: '#43E97B',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
      level: 'Principiante',
      lessons: [
        {
          id: 'mod3-les1',
          title: 'Suma, Resta y Multiplicación',
          icon: '➕',
          exercises: [
            {
              id: 'e055', type: 'predict-output', xp: 10,
              question: '¿Cuánto es 15 + 8?',
              codeToRun: 'print(15 + 8)',
              output: ['7', '23', '158', 'Error'],
              correctOutput: 1,
              explanation: '15 + 8 = 23. Python hace las sumas como una calculadora.'
            },
            {
              id: 'e056', type: 'fill-blank', xp: 15,
              question: 'Calcula 100 menos 37:',
              code: 'resultado = 100 ___ 37\nprint(resultado)',
              blanks: ['-'],
              options: ['-', '+', '*', '/'],
              explanation: 'El operador - se usa para la resta.'
            },
            {
              id: 'e057', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(6 * 7)',
              output: ['13', '42', '67', '6.7'],
              correctOutput: 1,
              explanation: '6 × 7 = 42. El operador * es la multiplicación.'
            },
            {
              id: 'e058', type: 'multiple-choice', xp: 15,
              question: '¿Cuál es el operador de multiplicación en Python?',
              choices: ['x', '×', '*', '·'],
              correct: 2,
              explanation: 'Python usa * para multiplicar: 3 * 4 = 12.'
            },
            {
              id: 'e059', type: 'reorder', xp: 25,
              question: 'Ordena para calcular el área (base × altura):',
              blocks: ['area = base * altura', 'base = 5', 'print(area)', 'altura = 3'],
              correctOrder: [1, 3, 0, 2],
              explanation: 'Primero define las variables, luego calcula, por último imprime.'
            },
            {
              id: 'e060', type: 'type-code', xp: 30,
              explanation: 'Cada línea hace una operación distinta y muestra su resultado: 30, 24 y 20. Aquí los paréntesis no hacen falta porque solo hay un operador.',
              description: 'Calcula e imprime: el doble de 15, el triple de 8 y el cuádruple de 5.',
              starter: '# Tus cálculos aquí\n',
              solution: 'print(15 * 2)\nprint(8 * 3)\nprint(5 * 4)',
              tests: [{ expected: '30\n24\n20\n' }]
            }
          ]
        },
        {
          id: 'mod3-les2',
          title: 'División y Módulo',
          icon: '➗',
          exercises: [
            {
              id: 'e061', type: 'predict-output', xp: 15,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(10 / 4)',
              output: ['2', '2.5', '2,5', 'Error'],
              correctOutput: 1,
              explanation: 'La división / en Python siempre devuelve float: 10 / 4 = 2.5.'
            },
            {
              id: 'e062', type: 'fill-blank', xp: 20,
              question: 'División entera (sin decimales):',
              code: 'resultado = 17 ___ 5\nprint(resultado)  # Imprime 3',
              blanks: ['//'],
              options: ['//', '/', '%', '**'],
              explanation: '// es la división entera. 17 // 5 = 3 (descarta los decimales).'
            },
            {
              id: 'e063', type: 'predict-output', xp: 20,
              question: '¿Qué imprime 10 % 3?',
              codeToRun: 'print(10 % 3)',
              output: ['3', '1', '0.33', '3.33'],
              correctOutput: 1,
              explanation: '% es el módulo (resto de la división). 10 = 3×3 + 1, así que 10 % 3 = 1.'
            },
            {
              id: 'e064', type: 'multiple-choice', xp: 15,
              question: '¿Para qué sirve el operador %?',
              choices: ['Porcentaje', 'Resto de la división', 'División entera', 'Potencia'],
              correct: 1,
              explanation: '% da el resto de dividir. Útil para saber si un número es par (n % 2 == 0).'
            },
            {
              id: 'e065', type: 'predict-output', xp: 20,
              question: '¿Es 12 un número par?',
              codeToRun: 'print(12 % 2 == 0)',
              output: ['True', 'False', '0', 'Error'],
              correctOutput: 0,
              explanation: '12 % 2 = 0 (12 es divisible entre 2, es par). 0 == 0 es True.'
            },
            {
              id: 'e066', type: 'fill-blank', xp: 25,
              question: 'Potencia: 2 elevado a 8:',
              code: 'resultado = 2 ___ 8\nprint(resultado)  # 256',
              blanks: ['**'],
              options: ['**', '^', '*', '//'],
              explanation: '** es el operador de potencia en Python. 2**8 = 256.'
            }
          ]
        },
        {
          id: 'mod3-les3',
          title: 'Operadores de Comparación',
          icon: '⚖️',
          exercises: [
            {
              id: 'e067', type: 'multiple-choice', xp: 10,
              question: '¿Qué operador comprueba si dos valores son IGUALES?',
              choices: ['=', '==', '!=', '==='],
              correct: 1,
              explanation: '== es el operador de igualdad. Un solo = es asignación.'
            },
            {
              id: 'e068', type: 'predict-output', xp: 15,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(5 != 3)',
              output: ['True', 'False', '2', 'Error'],
              correctOutput: 0,
              explanation: '!= significa "diferente de". 5 es diferente de 3, así que es True.'
            },
            {
              id: 'e069', type: 'fill-blank', xp: 20,
              question: 'Comprueba si edad es mayor o igual a 18:',
              code: 'edad = 20\nes_adulto = edad ___ 18\nprint(es_adulto)',
              blanks: ['>='],
              options: ['>=', '<=', '>', '<'],
              explanation: '>= significa "mayor o igual que".'
            },
            {
              id: 'e070', type: 'reorder', xp: 25,
              question: 'Ordena para comprobar si un número es positivo:',
              blocks: ['print(es_positivo)', 'numero = 7', 'es_positivo = numero > 0'],
              correctOrder: [1, 2, 0],
              explanation: 'Primero la variable, luego la comparación, luego imprimir.'
            },
            {
              id: 'e071', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'x = 10\nprint(x >= 10)\nprint(x > 10)',
              output: ['True\nTrue', 'True\nFalse', 'False\nFalse', 'False\nTrue'],
              correctOutput: 1,
              explanation: 'x >= 10: 10 >= 10 es True. x > 10: 10 > 10 es False (no es estrictamente mayor).'
            },
            {
              id: 'e072', type: 'type-code', xp: 30,
              explanation: 'La comparación > devuelve un booleano: True si se cumple y False si no. Por eso al imprimirla ves True y no un número.',
              description: 'Crea una variable "temperatura" con valor 37.5. Imprime si es mayor que 36.5 (fiebre).',
              starter: 'temperatura = 37.5\n',
              solution: 'temperatura = 37.5\nprint(temperatura > 36.5)',
              tests: [{ expected: 'True\n' }]
            }
          ]
        },
        {
          id: 'mod3-les4',
          title: 'Operadores Lógicos',
          icon: '🧠',
          exercises: [
            {
              id: 'e073', type: 'multiple-choice', xp: 10,
              question: '¿Qué devuelve True AND False?',
              choices: ['True', 'False', 'Error', 'None'],
              correct: 1,
              explanation: 'and requiere que AMBAS condiciones sean True. Si una es False, el resultado es False.'
            },
            {
              id: 'e074', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(True or False)',
              output: ['True', 'False', 'Error', 'None'],
              correctOutput: 0,
              explanation: 'or devuelve True si AL MENOS UNA condición es True.'
            },
            {
              id: 'e075', type: 'fill-blank', xp: 20,
              question: 'Comprueba si un número está entre 1 y 10:',
              code: 'n = 5\nentre = n >= 1 ___ n <= 10\nprint(entre)',
              blanks: ['and'],
              options: ['and', 'or', 'not', 'but'],
              explanation: 'Usamos and para que AMBAS condiciones se cumplan.'
            },
            {
              id: 'e076', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'print(not True)',
              output: ['True', 'False', 'Not True', 'Error'],
              correctOutput: 1,
              explanation: 'not invierte el booleano: not True → False, not False → True.'
            },
            {
              id: 'e077', type: 'multiple-choice', xp: 15,
              question: '¿Qué devuelve False OR True OR False?',
              choices: ['False', 'True', 'Error', 'None'],
              correct: 1,
              explanation: 'or devuelve True si alguna es True. El segundo valor es True, así que el resultado es True.'
            },
            {
              id: 'e078', type: 'type-code', xp: 35,
              explanation: 'and solo devuelve True si las dos condiciones son True. Como hay_entradas es False, el resultado será False aunque tenga dinero.',
              description: 'Crea variables "tiene_dinero" (True) y "hay_entradas" (False). Imprime si puede ir al cine (necesita ambas cosas).',
              starter: 'tiene_dinero = True\nhay_entradas = False\n',
              solution: 'tiene_dinero = True\nhay_entradas = False\nprint(tiene_dinero and hay_entradas)',
              tests: [{ expected: 'False\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 4: STRINGS
    // ═══════════════════════════════════════════════
    {
      id: 'mod4',
      title: 'Strings',
      subtitle: 'Domina el texto en Python',
      icon: '📝',
      color: '#FA709A',
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      level: 'Elemental',
      lessons: [
        {
          id: 'mod4-les1',
          title: 'Métodos de String',
          icon: '🔧',
          exercises: [
            {
              id: 'e079', type: 'predict-output', xp: 15,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "hola mundo"\nprint(texto.upper())',
              output: ['hola mundo', 'HOLA MUNDO', 'Hola Mundo', 'Error'],
              correctOutput: 1,
              explanation: '.upper() convierte todo el texto a MAYÚSCULAS.'
            },
            {
              id: 'e080', type: 'fill-blank', xp: 20,
              question: 'Convierte a minúsculas:',
              code: 'grito = "¡AYUDA!"\nsilencio = grito.___()\nprint(silencio)',
              blanks: ['lower'],
              options: ['lower', 'upper', 'title', 'small'],
              explanation: '.lower() convierte todo el texto a minúsculas.'
            },
            {
              id: 'e081', type: 'predict-output', xp: 20,
              question: '¿Qué imprime len("Python")?',
              codeToRun: 'print(len("Python"))',
              output: ['5', '6', '7', 'Error'],
              correctOutput: 1,
              explanation: 'len() devuelve la longitud del string. "Python" tiene 6 caracteres.'
            },
            {
              id: 'e082', type: 'multiple-choice', xp: 15,
              question: '¿Qué hace .strip()?',
              choices: ['Elimina espacios del inicio y final', 'Divide el texto', 'Reemplaza caracteres', 'Cuenta palabras'],
              correct: 0,
              explanation: '.strip() elimina espacios en blanco al inicio y al final del string.'
            },
            {
              id: 'e083', type: 'fill-blank', xp: 20,
              question: 'Reemplaza "malo" por "bueno":',
              code: 'frase = "El tiempo malo"\nnueva = frase.___("malo", "bueno")\nprint(nueva)',
              blanks: ['replace'],
              options: ['replace', 'swap', 'change', 'sub'],
              explanation: '.replace(viejo, nuevo) reemplaza texto dentro del string.'
            },
            {
              id: 'e084', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "  hola  "\nprint(texto.strip())',
              output: ['  hola  ', 'hola', '"hola"', 'Error'],
              correctOutput: 1,
              explanation: '.strip() elimina los espacios del inicio y final.'
            }
          ]
        },
        {
          id: 'mod4-les2',
          title: 'f-Strings',
          icon: '✨',
          exercises: [
            {
              id: 'e085', type: 'multiple-choice', xp: 10,
              question: '¿Cuál es la forma moderna de insertar variables en un string?',
              choices: ['Concatenación con +', 'f-strings con {}', 'format() viejo', '.printf()'],
              correct: 1,
              explanation: 'Los f-strings (f"texto {variable}") son la forma moderna y recomendada.'
            },
            {
              id: 'e086', type: 'fill-blank', xp: 20,
              question: 'Completa el f-string:',
              code: 'nombre = "Carlos"\nprint(___"Hola, {nombre}!")',
              blanks: ['f'],
              options: ['f', 's', 'r', 'b'],
              explanation: 'Los f-strings empiezan con la letra f antes de las comillas.'
            },
            {
              id: 'e087', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'edad = 25\nprint(f"Tengo {edad} años")',
              output: ['Tengo {edad} años', 'Tengo 25 años', 'Tengo edad años', 'Error'],
              correctOutput: 1,
              explanation: '{edad} dentro de un f-string se reemplaza por el valor de la variable.'
            },
            {
              id: 'e088', type: 'fill-blank', xp: 25,
              question: 'Usa f-string para mostrar precio:',
              code: 'producto = "Café"\nprecio = 2.50\nprint(f"El ___ cuesta {___}€")',
              blanks: ['{producto}', 'precio'],
              options: ['precio', '{producto}', 'producto', '{precio}'],
              explanation: 'Las variables se insertan dentro de {} en un f-string.'
            },
            {
              id: 'e089', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'x = 5\ny = 3\nprint(f"{x} + {y} = {x + y}")',
              output: ['x + y = x + y', '5 + 3 = 8', '5 + 3 = {x + y}', 'Error'],
              correctOutput: 1,
              explanation: 'Dentro de {} en un f-string puedes hacer operaciones directamente.'
            },
            {
              id: 'e090', type: 'type-code', xp: 35,
              explanation: 'Con un f-string solo abres comillas con f delante y metes las variables entre llaves. Es más cómodo que pegar textos con +.',
              description: 'Crea variables "nombre" y "ciudad". Usa un f-string para imprimir: "Me llamo [nombre] y soy de [ciudad]"',
              starter: 'nombre = "Pythonista"\nciudad = "Madrid"\n',
              solution: 'nombre = "Pythonista"\nciudad = "Madrid"\nprint(f"Me llamo {nombre} y soy de {ciudad}")',
              tests: [{ expected: 'Me llamo Pythonista y soy de Madrid\n' }]
            }
          ]
        },
        {
          id: 'mod4-les3',
          title: 'Slicing de Strings',
          icon: '✂️',
          exercises: [
            {
              id: 'e091', type: 'predict-output', xp: 15,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "Python"\nprint(texto[0])',
              output: ['P', 'y', 'Python', 'Error'],
              correctOutput: 0,
              explanation: 'Los índices empiezan en 0. texto[0] es el primer carácter: "P".'
            },
            {
              id: 'e092', type: 'fill-blank', xp: 20,
              question: 'Obtén los primeros 3 caracteres:',
              code: 'palabra = "Hola"\nprimeros = palabra[___:___]\nprint(primeros)  # "Hol"',
              blanks: ['0', '3'],
              options: ['0', '1', '2', '3', '4'],
              explanation: '[0:3] obtiene desde índice 0 hasta el 2 (3 no incluido).'
            },
            {
              id: 'e093', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "Python"\nprint(texto[-1])',
              output: ['P', 'y', 'n', 'Error'],
              correctOutput: 2,
              explanation: 'El índice -1 da el último carácter. "Python"[-1] = "n".'
            },
            {
              id: 'e094', type: 'multiple-choice', xp: 15,
              question: '¿Qué devuelve "Python"[2:5]?',
              choices: ['Pyt', 'tho', 'hon', 'yth'],
              correct: 1,
              explanation: '[2:5] toma índices 2,3,4: "t","h","o" → "tho".'
            },
            {
              id: 'e095', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "abcdef"\nprint(texto[::2])',
              output: ['abcdef', 'ace', 'bdf', 'Error'],
              correctOutput: 1,
              explanation: '[::2] toma cada segundo carácter: a(0), c(2), e(4) → "ace".'
            },
            {
              id: 'e096', type: 'type-code', xp: 30,
              explanation: 'texto[:4] va del inicio hasta el índice 4 sin incluirlo. Con índices negativos, texto[-5:] toma los cinco últimos caracteres.',
              description: 'Dado el string "Hola Mundo", extrae e imprime por separado:\n• Las primeras 4 letras\n• Las últimas 5 letras',
              starter: 'texto = "Hola Mundo"\n',
              solution: 'texto = "Hola Mundo"\nprint(texto[:4])\nprint(texto[-5:])',
              tests: [{ expected: 'Hola\nMundo\n' }]
            }
          ]
        },
        {
          id: 'mod4-les4',
          title: 'Buscar en Strings',
          icon: '🔍',
          exercises: [
            {
              id: 'e097', type: 'predict-output', xp: 15,
              question: '¿Qué imprime este código?',
              codeToRun: 'texto = "Hola Python"\nprint("Python" in texto)',
              output: ['True', 'False', '5', 'Error'],
              correctOutput: 0,
              explanation: '"in" comprueba si un string contiene otro. "Python" está en "Hola Python".'
            },
            {
              id: 'e098', type: 'fill-blank', xp: 20,
              question: 'Busca la posición de "Python":',
              code: 'texto = "Me gusta Python"\npos = texto.___(\"Python\")\nprint(pos)',
              blanks: ['find'],
              options: ['find', 'search', 'index', 'locate'],
              explanation: '.find() devuelve el índice donde empieza la cadena buscada.'
            },
            {
              id: 'e099', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'correo = "ana@gmail.com"\nprint(correo.count("a"))',
              output: ['1', '2', '3', 'Error'],
              correctOutput: 1,
              explanation: '.count() cuenta cuántas veces aparece un substring. "a" aparece en "ana" y en "gmail": 3 veces... espera: a,n,a,@,g,m,a,i,l → "a" aparece en posiciones 0, 2, 6 = 3 veces.'
            },
            {
              id: 'e100', type: 'multiple-choice', xp: 15,
              question: '¿Qué devuelve "hola".startswith("h")?',
              choices: ['True', 'False', '0', 'Error'],
              correct: 0,
              explanation: '.startswith() devuelve True si el string empieza con el texto dado.'
            },
            {
              id: 'e101', type: 'fill-blank', xp: 20,
              question: 'Divide el texto en palabras:',
              code: 'frase = "uno dos tres"\npalabras = frase.___()\nprint(palabras)',
              blanks: ['split'],
              options: ['split', 'divide', 'cut', 'break'],
              explanation: '.split() divide un string en una lista de palabras.'
            },
            {
              id: 'e102', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'partes = ["Hola", "Mundo"]\nprint(" ".join(partes))',
              output: ['["Hola", "Mundo"]', 'HolaMundo', 'Hola Mundo', 'Error'],
              correctOutput: 2,
              explanation: '.join() une los elementos de una lista con el separador dado: "Hola" + " " + "Mundo".'
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 5: CONDICIONALES
    // ═══════════════════════════════════════════════
    {
      id: 'mod5',
      title: 'Condicionales',
      subtitle: 'Enseña a Python a tomar decisiones',
      icon: '🔀',
      color: '#A18CD1',
      gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
      level: 'Elemental',
      lessons: [
        {
          id: 'mod5-les1',
          title: 'if / else',
          icon: '🚦',
          exercises: [
            {
              id: 'e103', type: 'multiple-choice', xp: 10,
              question: '¿Qué palabra clave ejecuta código SI una condición es verdadera?',
              choices: ['when', 'if', 'check', 'case'],
              correct: 1,
              explanation: '"if" ejecuta el bloque de código solo si la condición es True.'
            },
            {
              id: 'e104', type: 'fill-blank', xp: 20,
              question: 'Completa el código condicional:',
              code: '___ edad >= 18:\n    print("Eres adulto")',
              blanks: ['if'],
              options: ['if', 'when', 'for', 'while'],
              explanation: '"if" va antes de la condición. No olvides los dos puntos (:) al final.'
            },
            {
              id: 'e105', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'llueve = True\nif llueve:\n    print("Coge el paraguas")\nelse:\n    print("Sal sin paraguas")',
              output: ['Coge el paraguas', 'Sal sin paraguas', 'Ambas cosas', 'Error'],
              correctOutput: 0,
              explanation: 'llueve es True, así que se ejecuta el bloque if.'
            },
            {
              id: 'e106', type: 'reorder', xp: 25,
              question: 'Ordena el código if/else:',
              blocks: ['    print("Aprobado")', 'nota = 6', 'else:', 'if nota >= 5:', '    print("Suspenso")'],
              correctOrder: [1, 3, 0, 2, 4],
              explanation: 'Primero la variable, luego if con su bloque, luego else con su bloque.'
            },
            {
              id: 'e107', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'x = 0\nif x:\n    print("Verdadero")\nelse:\n    print("Falso")',
              output: ['Verdadero', 'Falso', '0', 'Error'],
              correctOutput: 1,
              explanation: '0 es "falsy" en Python, equivale a False en un contexto booleano.'
            },
            {
              id: 'e108', type: 'type-code', xp: 35,
              explanation: 'La línea del if termina en dos puntos y su bloque se indenta 4 espacios. Si la condición es False se ejecuta el else.',
              description: 'Crea una variable "temperatura" con valor 35. Imprime "Hace calor" si supera 30, si no imprime "Temperatura normal".',
              starter: 'temperatura = 35\n',
              solution: 'temperatura = 35\nif temperatura > 30:\n    print("Hace calor")\nelse:\n    print("Temperatura normal")',
              tests: [{ expected: 'Hace calor\n' }]
            }
          ]
        },
        {
          id: 'mod5-les2',
          title: 'elif',
          icon: '🔱',
          exercises: [
            {
              id: 'e109', type: 'multiple-choice', xp: 10,
              question: '¿Qué significa "elif"?',
              choices: ['Else if (si no, si)', 'Else (si no)', 'Error if (error si)', 'End if (fin si)'],
              correct: 0,
              explanation: '"elif" significa "else if": si la condición anterior fue False, prueba esta otra.'
            },
            {
              id: 'e110', type: 'predict-output', xp: 25,
              question: '¿Qué imprime este código?',
              codeToRun: 'nota = 7\nif nota >= 9:\n    print("Sobresaliente")\nelif nota >= 7:\n    print("Notable")\nelif nota >= 5:\n    print("Aprobado")\nelse:\n    print("Suspenso")',
              output: ['Sobresaliente', 'Notable', 'Aprobado', 'Suspenso'],
              correctOutput: 1,
              explanation: '7 no es >= 9, pero sí es >= 7, así que imprime "Notable".'
            },
            {
              id: 'e111', type: 'fill-blank', xp: 20,
              question: 'Completa con elif:',
              code: 'hora = 14\nif hora < 12:\n    print("Buenos días")\n___ hora < 18:\n    print("Buenas tardes")\nelse:\n    print("Buenas noches")',
              blanks: ['elif'],
              options: ['elif', 'else if', 'or if', 'elseif'],
              explanation: 'En Python, "elif" es la forma correcta (no "else if" como en otros lenguajes).'
            },
            {
              id: 'e112', type: 'reorder', xp: 25,
              question: 'Ordena el clasificador de edades:',
              blocks: ['elif edad >= 18:', '    print("Adulto")', 'if edad < 13:', '    print("Niño")', '    print("Adolescente")'],
              correctOrder: [2, 3, 0, 4, 1],
              explanation: 'if primero, luego elif. Los bloques van indentados (4 espacios).'
            },
            {
              id: 'e113', type: 'predict-output', xp: 20,
              question: '¿Cuántos elif puede tener un if?',
              choices: ['Solo 1', 'Máximo 3', 'Tantos como quieras', 'Ninguno'],
              output: ['Solo 1', 'Máximo 3', 'Tantos como quieras', 'Ninguno'],
              correctOutput: 2,
              type: 'multiple-choice',
              choices: ['Solo 1', 'Máximo 3', 'Tantos como quieras', 'Ninguno'],
              correct: 2,
              explanation: 'Puedes encadenar tantos elif como necesites.'
            },
            {
              id: 'e114', type: 'type-code', xp: 40,
              explanation: 'Con elif encadenas condiciones: se evalúa la primera que sea cierta y las demás se ignoran. El else final cubre el caso rojo.',
              description: 'Crea un semáforo: si el color es "verde" imprime "Avanza", si es "amarillo" imprime "Precaución", si es "rojo" imprime "Para".',
              starter: 'color = "amarillo"\n',
              solution: 'color = "amarillo"\nif color == "verde":\n    print("Avanza")\nelif color == "amarillo":\n    print("Precaución")\nelse:\n    print("Para")',
              tests: [{ expected: 'Precaución\n' }]
            }
          ]
        },
        {
          id: 'mod5-les3',
          title: 'Condiciones Compuestas',
          icon: '🧩',
          exercises: [
            {
              id: 'e115', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'edad = 20\ndni = True\nif edad >= 18 and dni:\n    print("Puede entrar")\nelse:\n    print("No puede entrar")',
              output: ['Puede entrar', 'No puede entrar', 'Error', 'None'],
              correctOutput: 0,
              explanation: 'Tiene 20 años (>= 18) Y tiene dni (True). Ambas verdaderas: puede entrar.'
            },
            {
              id: 'e116', type: 'fill-blank', xp: 25,
              question: 'Acepta si tiene carnet O pase:',
              code: 'carnet = False\npase = True\nif carnet ___ pase:\n    print("Acceso permitido")',
              blanks: ['or'],
              options: ['or', 'and', 'not', 'but'],
              explanation: 'or acepta si AL MENOS UNA condición es True.'
            },
            {
              id: 'e117', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'premium = False\nif not premium:\n    print("Hazte premium para acceder")',
              output: ['Hazte premium para acceder', 'Nada', 'False', 'Error'],
              correctOutput: 0,
              explanation: 'not False = True, así que el if se ejecuta.'
            },
            {
              id: 'e118', type: 'multiple-choice', xp: 15,
              question: '¿Qué devuelve (5 > 3) and (2 < 1)?',
              choices: ['True', 'False', 'Error', 'None'],
              correct: 1,
              explanation: '5 > 3 es True, pero 2 < 1 es False. True AND False = False.'
            },
            {
              id: 'e119', type: 'reorder', xp: 30,
              question: 'Construye la condición de acceso a un club nocturno:',
              blocks: ['    print("Bienvenido al club")', 'else:', 'if edad >= 18 and tiene_id:', '    print("No puedes entrar")', 'tiene_id = True\nedad = 21'],
              correctOrder: [4, 2, 0, 1, 3],
              explanation: 'Variables primero, luego la condición con and, luego los bloques.'
            },
            {
              id: 'e120', type: 'type-code', xp: 40,
              explanation: 'Los operadores and y % se combinan sin paréntesis porque el módulo tiene más prioridad que la comparación. El número es especial si se cumplen las tres.',
              description: 'Un número es "especial" si es mayor que 10 Y menor que 100 Y divisible entre 3. Comprueba si 33 es especial.',
              starter: 'numero = 33\n',
              solution: 'numero = 33\nif numero > 10 and numero < 100 and numero % 3 == 0:\n    print("Es especial")\nelse:\n    print("No es especial")',
              tests: [{ expected: 'Es especial\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 6: BUCLES
    // ═══════════════════════════════════════════════
    {
      id: 'mod6',
      title: 'Bucles',
      subtitle: 'Repite tareas automáticamente',
      icon: '🔁',
      color: '#F7971E',
      gradient: 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)',
      level: 'Elemental',
      lessons: [
        {
          id: 'mod6-les1',
          title: 'Bucle while',
          icon: '⏳',
          exercises: [
            {
              id: 'e121', type: 'multiple-choice', xp: 10,
              question: '¿Qué hace el bucle while?',
              choices: ['Se ejecuta una vez', 'Se ejecuta mientras la condición sea True', 'Se ejecuta un número fijo de veces', 'Nunca termina'],
              correct: 1,
              explanation: 'while repite el bloque MIENTRAS la condición sea verdadera.'
            },
            {
              id: 'e122', type: 'predict-output', xp: 20,
              question: '¿Cuántas veces se imprime "Hola"?',
              codeToRun: 'i = 0\nwhile i < 3:\n    print("Hola")\n    i += 1',
              output: ['1', '2', '3', 'Infinitas'],
              correctOutput: 2,
              explanation: 'i empieza en 0, el bucle se ejecuta mientras i < 3: cuando i=0, i=1, i=2. Total: 3 veces.'
            },
            {
              id: 'e123', type: 'fill-blank', xp: 25,
              question: 'Completa el contador:',
              code: 'cuenta = 1\nwhile cuenta ___ 5:\n    print(cuenta)\n    cuenta += 1',
              blanks: ['<='],
              options: ['<=', '<', '>=', '=='],
              explanation: '<= significa "menor o igual". El bucle va de 1 a 5 incluyendo el 5.'
            },
            {
              id: 'e124', type: 'reorder', xp: 25,
              question: 'Ordena el bucle que cuenta regresiva desde 3:',
              blocks: ['    n -= 1', 'n = 3', '    print(n)', 'while n > 0:'],
              correctOrder: [1, 3, 2, 0],
              explanation: 'Variable → while con condición → imprimir → decrementar.'
            },
            {
              id: 'e125', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'suma = 0\ni = 1\nwhile i <= 5:\n    suma += i\n    i += 1\nprint(suma)',
              output: ['5', '10', '15', '25'],
              correctOutput: 2,
              explanation: 'suma = 1+2+3+4+5 = 15.'
            },
            {
              id: 'e126', type: 'type-code', xp: 35,
              explanation: 'Un while repite MIENTAS la condición sea cierta, así que hay que modificar la variable i dentro (i += 1) o sería un bucle infinito.',
              description: 'Usa while para imprimir los números del 1 al 10.',
              starter: '# Usa un bucle while\n',
              solution: 'i = 1\nwhile i <= 10:\n    print(i)\n    i += 1',
              tests: [{ expected: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n' }]
            }
          ]
        },
        {
          id: 'mod6-les2',
          title: 'Bucle for',
          icon: '🔂',
          exercises: [
            {
              id: 'e127', type: 'multiple-choice', xp: 10,
              question: '¿Qué hace el bucle for en Python?',
              choices: ['Itera sobre una colección o rango', 'Repite indefinidamente', 'Ejecuta solo si hay error', 'Es igual que while'],
              correct: 0,
              explanation: 'for itera sobre cada elemento de una lista, string, rango, etc.'
            },
            {
              id: 'e128', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'for letra in "Hola":\n    print(letra)',
              output: ['Hola', 'H\no\nl\na', 'H o l a', 'Error'],
              correctOutput: 1,
              explanation: 'for itera sobre cada carácter del string, imprimiendo uno por línea.'
            },
            {
              id: 'e129', type: 'fill-blank', xp: 20,
              question: 'Itera sobre una lista de frutas:',
              code: 'frutas = ["manzana", "pera", "uva"]\n___ fruta ___ frutas:\n    print(fruta)',
              blanks: ['for', 'in'],
              options: ['for', 'in', 'while', 'of'],
              explanation: 'La sintaxis es: for elemento in colección:'
            },
            {
              id: 'e130', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'for i in range(3):\n    print(i)',
              output: ['0 1 2', '0\n1\n2', '1\n2\n3', '1 2 3'],
              correctOutput: 1,
              explanation: 'range(3) genera 0, 1, 2. Cada uno en una línea.'
            },
            {
              id: 'e131', type: 'reorder', xp: 25,
              question: 'Suma todos los números de una lista:',
              blocks: ['print(total)', 'for num in numeros:', 'numeros = [1, 2, 3, 4, 5]', 'total = 0', '    total += num'],
              correctOrder: [2, 3, 1, 4, 0],
              explanation: 'Lista, acumulador, bucle, suma en bucle, resultado final.'
            },
            {
              id: 'e132', type: 'type-code', xp: 35,
              explanation: 'range(1, 11) genera del 1 al 10: el segundo número nunca se incluye. Dentro del bucle, i va cambiando sola en cada vuelta.',
              description: 'Usa for para imprimir la tabla de multiplicar del 3 (3×1 hasta 3×10).',
              starter: '# Tabla del 3\n',
              solution: 'for i in range(1, 11):\n    print(f"3 x {i} = {3 * i}")',
              tests: [{ expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30\n' }]
            }
          ]
        },
        {
          id: 'mod6-les3',
          title: 'range()',
          icon: '📏',
          exercises: [
            {
              id: 'e133', type: 'predict-output', xp: 15,
              question: '¿Qué genera range(1, 6)?',
              codeToRun: 'print(list(range(1, 6)))',
              output: ['[1, 2, 3, 4, 5, 6]', '[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4, 5]', '[1, 5]'],
              correctOutput: 1,
              explanation: 'range(start, stop) genera desde start hasta stop-1. range(1,6) = 1,2,3,4,5.'
            },
            {
              id: 'e134', type: 'fill-blank', xp: 20,
              question: 'Genera números del 0 al 9:',
              code: 'for i in range(___):\n    print(i)',
              blanks: ['10'],
              options: ['10', '9', '11', '0'],
              explanation: 'range(10) genera de 0 a 9. El parámetro es el límite exclusivo.'
            },
            {
              id: 'e135', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'for i in range(0, 10, 2):\n    print(i)',
              output: ['0 2 4 6 8 10', '0\n2\n4\n6\n8', '0\n2\n4\n6\n8\n10', 'Error'],
              correctOutput: 1,
              explanation: 'range(0, 10, 2) genera de 0 a 9 de 2 en 2: 0, 2, 4, 6, 8.'
            },
            {
              id: 'e136', type: 'multiple-choice', xp: 15,
              question: '¿Qué hace range(10, 0, -1)?',
              choices: ['Error', 'Del 10 al 1 descendiendo', 'Del 0 al 10', 'Solo el número 10'],
              correct: 1,
              explanation: 'Un paso negativo (-1) hace que range vaya de mayor a menor.'
            },
            {
              id: 'e137', type: 'fill-blank', xp: 25,
              question: 'Genera solo números pares del 2 al 10:',
              code: 'for n in range(___, ___, ___):\n    print(n)',
              blanks: ['2', '11', '2'],
              options: ['0', '1', '2', '10', '11', '12'],
              explanation: 'range(2, 11, 2): empieza en 2, acaba antes de 11, de 2 en 2.'
            },
            {
              id: 'e138', type: 'type-code', xp: 35,
              explanation: 'range con tres parámetros cuenta hacia atrás: range(10, 0, -1) da 10, 9, 8... hasta el 1. El print final va fuera del bucle.',
              description: 'Usa range para imprimir la cuenta regresiva: 10, 9, 8, ... 1, ¡Despegue!',
              starter: '# Cuenta regresiva\n',
              solution: 'for i in range(10, 0, -1):\n    print(i)\nprint("¡Despegue!")',
              tests: [{ expected: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n¡Despegue!\n' }]
            }
          ]
        },
        {
          id: 'mod6-les4',
          title: 'break y continue',
          icon: '⏸️',
          exercises: [
            {
              id: 'e139', type: 'multiple-choice', xp: 10,
              question: '¿Qué hace "break" dentro de un bucle?',
              choices: ['Pausa el bucle momentáneamente', 'Sale completamente del bucle', 'Salta a la siguiente iteración', 'Reinicia el bucle'],
              correct: 1,
              explanation: 'break termina el bucle inmediatamente y sigue ejecutando el código después.'
            },
            {
              id: 'e140', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)',
              output: ['0 1 2 3', '0\n1\n2', '0\n1\n2\n3', '1\n2\n3'],
              correctOutput: 1,
              explanation: 'Al llegar a i=3, break sale del bucle. Solo se imprime 0, 1, 2.'
            },
            {
              id: 'e141', type: 'multiple-choice', xp: 10,
              question: '¿Qué hace "continue" dentro de un bucle?',
              choices: ['Sale del bucle', 'Salta al inicio de la siguiente iteración', 'Pausa el programa', 'Reinicia la variable'],
              correct: 1,
              explanation: 'continue salta el resto del código de la iteración actual y va a la siguiente.'
            },
            {
              id: 'e142', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'for i in range(6):\n    if i % 2 == 0:\n        continue\n    print(i)',
              output: ['0 2 4', '1 3 5', '0\n2\n4', '1\n3\n5'],
              correctOutput: 3,
              explanation: 'continue salta los pares. Solo se imprimen los impares: 1, 3, 5.'
            },
            {
              id: 'e143', type: 'fill-blank', xp: 25,
              question: 'Sale del bucle cuando encuentra "stop":',
              code: 'palabras = ["hola", "stop", "mundo"]\nfor p in palabras:\n    if p == "stop":\n        ___\n    print(p)',
              blanks: ['break'],
              options: ['break', 'continue', 'pass', 'exit'],
              explanation: 'break sale del bucle al encontrar "stop".'
            },
            {
              id: 'e144', type: 'type-code', xp: 40,
              explanation: 'continue salta a la siguiente vuelta, así que el print de abajo no se ejecuta para los múltiplos de 3.',
              description: 'Usa continue para imprimir solo los números del 1 al 10 que NO sean divisibles entre 3.',
              starter: '# Evita múltiplos de 3\n',
              solution: 'for i in range(1, 11):\n    if i % 3 == 0:\n        continue\n    print(i)',
              tests: [{ expected: '1\n2\n4\n5\n7\n8\n10\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 7: LISTAS
    // ═══════════════════════════════════════════════
    {
      id: 'mod7',
      title: 'Listas',
      subtitle: 'Colecciones ordenadas de datos',
      icon: '📋',
      color: '#11998E',
      gradient: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
      level: 'Intermedio',
      lessons: [
        {
          id: 'mod7-les1',
          title: 'Crear y Acceder',
          icon: '🗂️',
          exercises: [
            {
              id: 'e145', type: 'multiple-choice', xp: 10,
              question: '¿Cómo se crea una lista en Python?',
              choices: ['(1, 2, 3)', '[1, 2, 3]', '{1, 2, 3}', '<1, 2, 3>'],
              correct: 1,
              explanation: 'Las listas se crean con corchetes []. Pueden contener cualquier tipo de dato.'
            },
            {
              id: 'e146', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'frutas = ["manzana", "pera", "uva"]\nprint(frutas[1])',
              output: ['manzana', 'pera', 'uva', 'Error'],
              correctOutput: 1,
              explanation: 'Los índices empiezan en 0. frutas[1] es el segundo elemento: "pera".'
            },
            {
              id: 'e147', type: 'fill-blank', xp: 20,
              question: 'Accede al último elemento:',
              code: 'numeros = [10, 20, 30, 40]\nultimo = numeros[___]\nprint(ultimo)',
              blanks: ['-1'],
              options: ['-1', '4', '3', 'last'],
              explanation: 'El índice -1 siempre da el último elemento de la lista.'
            },
            {
              id: 'e148', type: 'predict-output', xp: 15,
              question: '¿Qué imprime len([1, 2, 3, 4, 5])?',
              codeToRun: 'print(len([1, 2, 3, 4, 5]))',
              output: ['4', '5', '6', 'Error'],
              correctOutput: 1,
              explanation: 'len() devuelve el número de elementos de la lista.'
            },
            {
              id: 'e149', type: 'multiple-choice', xp: 15,
              question: '¿Puede una lista contener distintos tipos de datos?',
              choices: ['No, solo un tipo', 'Sí, cualquier combinación', 'Solo números y strings', 'Solo si están ordenados'],
              correct: 1,
              explanation: 'Las listas de Python pueden mezclar tipos: [1, "hola", True, 3.14].'
            },
            {
              id: 'e150', type: 'type-code', xp: 30,
              explanation: 'En una lista el primer elemento es el índice 0 y el último se pide con -1, que cuenta desde el final.',
              description: 'Crea una lista con tus 3 colores favoritos e imprime el primero y el último.',
              starter: '# Lista de colores\n',
              solution: 'colores = ["rojo", "azul", "verde"]\nprint(colores[0])\nprint(colores[-1])',
              tests: [{ expected: 'rojo\nverde\n' }]
            }
          ]
        },
        {
          id: 'mod7-les2',
          title: 'Modificar Listas',
          icon: '✏️',
          exercises: [
            {
              id: 'e151', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'lista = [1, 2, 3]\nlista.append(4)\nprint(lista)',
              output: ['[1, 2, 3]', '[1, 2, 3, 4]', '[4, 1, 2, 3]', 'Error'],
              correctOutput: 1,
              explanation: '.append() añade un elemento al FINAL de la lista.'
            },
            {
              id: 'e152', type: 'fill-blank', xp: 20,
              question: 'Elimina el último elemento:',
              code: 'lista = [1, 2, 3, 4]\nultimo = lista.___()\nprint(lista)',
              blanks: ['pop'],
              options: ['pop', 'remove', 'delete', 'drop'],
              explanation: '.pop() elimina y devuelve el último elemento de la lista.'
            },
            {
              id: 'e153', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'lista = ["a", "b", "c"]\nlista.insert(1, "X")\nprint(lista)',
              output: ["['X', 'a', 'b', 'c']", "['a', 'X', 'b', 'c']", "['a', 'b', 'X', 'c']", 'Error'],
              correctOutput: 1,
              explanation: '.insert(índice, valor) inserta en la posición dada. insert(1, "X") inserta en posición 1.'
            },
            {
              id: 'e154', type: 'multiple-choice', xp: 15,
              question: '¿Cómo se elimina un elemento específico por valor?',
              choices: ['.delete(val)', '.remove(val)', '.pop(val)', '.erase(val)'],
              correct: 1,
              explanation: '.remove(valor) elimina la primera ocurrencia del valor especificado.'
            },
            {
              id: 'e155', type: 'reorder', xp: 25,
              question: 'Construye el código para añadir "naranja" a la lista:',
              blocks: ['print(frutas)', 'frutas.append("naranja")', 'frutas = ["manzana", "pera"]'],
              correctOrder: [2, 1, 0],
              explanation: 'Lista, modificar, imprimir.'
            },
            {
              id: 'e156', type: 'type-code', xp: 35,
              explanation: 'append() añade al final de la lista y pop(0) quita el primer elemento. Al imprimir después del pop ya solo quedan el 20 y el 30.',
              description: 'Crea una lista vacía. Añade los números 10, 20, 30. Luego elimina el primero. Imprime la lista final.',
              starter: '# Empieza con una lista vacía\n',
              solution: 'lista = []\nlista.append(10)\nlista.append(20)\nlista.append(30)\nlista.pop(0)\nprint(lista)',
              tests: [{ expected: '[20, 30]\n' }]
            }
          ]
        },
        {
          id: 'mod7-les3',
          title: 'List Comprehensions',
          icon: '⚡',
          exercises: [
            {
              id: 'e157', type: 'multiple-choice', xp: 10,
              question: '¿Qué son las list comprehensions?',
              choices: ['Un tipo especial de lista', 'Forma compacta de crear listas con un for', 'Método para ordenar listas', 'Alias de range()'],
              correct: 1,
              explanation: 'Las list comprehensions crean listas de forma elegante: [expr for item in iterable].'
            },
            {
              id: 'e158', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'cuadrados = [x**2 for x in range(1, 6)]\nprint(cuadrados)',
              output: ['[1, 4, 9, 16, 25]', '[2, 4, 6, 8, 10]', '[1, 2, 3, 4, 5]', 'Error'],
              correctOutput: 0,
              explanation: 'x**2 para cada x en [1,2,3,4,5]: 1,4,9,16,25.'
            },
            {
              id: 'e159', type: 'fill-blank', xp: 25,
              question: 'Crea una lista de números pares del 0 al 18:',
              code: 'pares = [n for n in range(20) ___ n % 2 == 0]\nprint(pares)',
              blanks: ['if'],
              options: ['if', 'when', 'while', 'and'],
              explanation: 'Puedes filtrar con if dentro de una list comprehension.'
            },
            {
              id: 'e160', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'nombres = ["ana", "bob", "cara"]\nmayus = [n.upper() for n in nombres]\nprint(mayus)',
              output: ["['ANA', 'BOB', 'CARA']", "['ana', 'bob', 'cara']", 'ANA BOB CARA', 'Error'],
              correctOutput: 0,
              explanation: 'Aplica .upper() a cada nombre: ["ANA", "BOB", "CARA"].'
            },
            {
              id: 'e161', type: 'reorder', xp: 25,
              question: 'Crea una lista de strings que contengan "a":',
              blocks: ['con_a = [p for p in palabras if "a" in p]', 'palabras = ["casa", "piso", "sala", "cuarto"]', 'print(con_a)'],
              correctOrder: [1, 0, 2],
              explanation: 'Lista original, comprehension con filtro, imprimir resultado.'
            },
            {
              id: 'e162', type: 'type-code', xp: 40,
              explanation: 'Una list comprehension tiene la forma [expresión for variable in rango if condición]: primero se filtran los impares y luego se calcula el cuadrado.',
              description: 'Con una list comprehension, crea una lista con los cuadrados de los números impares del 1 al 10. Imprímela.',
              starter: '# List comprehension con filtro\n',
              solution: 'resultado = [x**2 for x in range(1, 11) if x % 2 != 0]\nprint(resultado)',
              tests: [{ expected: '[1, 9, 25, 49, 81]\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 8: DICCIONARIOS
    // ═══════════════════════════════════════════════
    {
      id: 'mod8',
      title: 'Diccionarios',
      subtitle: 'Datos con clave y valor',
      icon: '📖',
      color: '#667EEA',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      level: 'Intermedio',
      lessons: [
        {
          id: 'mod8-les1',
          title: 'Diccionarios Básicos',
          icon: '🗝️',
          exercises: [
            {
              id: 'e163', type: 'multiple-choice', xp: 10,
              question: '¿Cómo se crea un diccionario en Python?',
              choices: ['[clave: valor]', '{clave: valor}', '(clave: valor)', '<clave: valor>'],
              correct: 1,
              explanation: 'Los diccionarios usan llaves {} con pares clave: valor.'
            },
            {
              id: 'e164', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'persona = {"nombre": "Ana", "edad": 25}\nprint(persona["nombre"])',
              output: ['Ana', '"Ana"', 'nombre', 'Error'],
              correctOutput: 0,
              explanation: 'Se accede al valor mediante la clave entre corchetes.'
            },
            {
              id: 'e165', type: 'fill-blank', xp: 20,
              question: 'Añade una clave nueva al diccionario:',
              code: 'coche = {"marca": "Toyota"}\ncoche[___] = "Azul"\nprint(coche)',
              blanks: ['"color"'],
              options: ['"color"', 'color', '"marca"', '"Toyota"'],
              explanation: 'Para añadir una clave nueva, usa dict["nueva_clave"] = valor.'
            },
            {
              id: 'e166', type: 'multiple-choice', xp: 15,
              question: '¿Qué pasa si accedes a una clave que no existe?',
              choices: ['Devuelve None', 'Devuelve 0', 'Lanza un KeyError', 'Devuelve ""'],
              correct: 2,
              explanation: 'Acceder a una clave inexistente lanza KeyError. Usa .get() para evitarlo.'
            },
            {
              id: 'e167', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'd = {"a": 1, "b": 2}\nprint(d.get("c", "no existe"))',
              output: ['None', '0', 'no existe', 'Error'],
              correctOutput: 2,
              explanation: '.get(clave, default) devuelve el valor o el default si la clave no existe.'
            },
            {
              id: 'e168', type: 'type-code', xp: 35,
              explanation: 'Un diccionario guarda pares clave: valor y se accede con los corchetes y el nombre de la clave entre comillas.',
              description: 'Crea un diccionario "libro" con claves: titulo, autor y año. Imprime cada valor.',
              starter: '# Diccionario de libro\n',
              solution: 'libro = {"titulo": "Python", "autor": "Guido", "año": 1991}\nprint(libro["titulo"])\nprint(libro["autor"])\nprint(libro["año"])',
              tests: [{ expected: 'Python\nGuido\n1991\n' }]
            }
          ]
        },
        {
          id: 'mod8-les2',
          title: 'Iterar Diccionarios',
          icon: '🔄',
          exercises: [
            {
              id: 'e169', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'd = {"x": 1, "y": 2}\nfor clave in d:\n    print(clave)',
              output: ['1\n2', 'x\ny', 'x: 1\ny: 2', 'Error'],
              correctOutput: 1,
              explanation: 'Iterar un diccionario con for da las CLAVES, no los valores.'
            },
            {
              id: 'e170', type: 'fill-blank', xp: 20,
              question: 'Itera sobre claves y valores:',
              code: 'd = {"a": 1, "b": 2}\nfor k, v in d.___().__:\n    print(f"{k} = {v}")',
              blanks: ['items'],
              options: ['items', 'values', 'keys', 'pairs'],
              explanation: '.items() devuelve pares (clave, valor) para iterar juntos.'
            },
            {
              id: 'e171', type: 'multiple-choice', xp: 15,
              question: '¿Qué devuelve dict.values()?',
              choices: ['Las claves', 'Los valores', 'Los pares clave-valor', 'El tamaño'],
              correct: 1,
              explanation: '.values() devuelve solo los valores del diccionario.'
            },
            {
              id: 'e172', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'notas = {"Ana": 9, "Bob": 7, "Cara": 8}\nprint(len(notas))',
              output: ['3', '7', '24', 'Error'],
              correctOutput: 0,
              explanation: 'len() sobre un diccionario devuelve el número de pares clave-valor.'
            },
            {
              id: 'e173', type: 'reorder', xp: 25,
              question: 'Imprime todos los valores de un diccionario:',
              blocks: ['for valor in precios.values():', '    print(valor)', 'precios = {"manzana": 1.2, "pera": 0.8}'],
              correctOrder: [2, 0, 1],
              explanation: 'Diccionario, for con .values(), imprimir.'
            },
            {
              id: 'e174', type: 'type-code', xp: 40,
              explanation: 'El método items() devuelve pares (clave, valor) que el for desempaqueta en dos variables, así que no hay que buscar cada clave a mano.',
              description: 'Dado el diccionario de notas {"Ana": 8, "Bob": 6, "Cara": 9}, imprime el nombre y la nota de cada estudiante con un f-string.',
              starter: 'notas = {"Ana": 8, "Bob": 6, "Cara": 9}\n',
              solution: 'notas = {"Ana": 8, "Bob": 6, "Cara": 9}\nfor nombre, nota in notas.items():\n    print(f"{nombre}: {nota}")',
              tests: [{ expected: 'Ana: 8\nBob: 6\nCara: 9\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 9: FUNCIONES
    // ═══════════════════════════════════════════════
    {
      id: 'mod9',
      title: 'Funciones',
      subtitle: 'Reutiliza y organiza tu código',
      icon: '⚙️',
      color: '#F093FB',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
      level: 'Intermedio',
      lessons: [
        {
          id: 'mod9-les1',
          title: 'Definir Funciones',
          icon: '🔧',
          exercises: [
            {
              id: 'e175', type: 'multiple-choice', xp: 10,
              question: '¿Qué palabra clave se usa para definir una función?',
              choices: ['func', 'function', 'def', 'fun'],
              correct: 2,
              explanation: '"def" es la palabra clave para definir funciones en Python.'
            },
            {
              id: 'e176', type: 'fill-blank', xp: 20,
              question: 'Define una función que salude:',
              code: '___ saludar():\n    print("¡Hola!")\n\nsaludar()',
              blanks: ['def'],
              options: ['def', 'fun', 'func', 'define'],
              explanation: 'def nombre(): define la función. Luego nombre() la llama.'
            },
            {
              id: 'e177', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'def despedir():\n    print("¡Adiós!")\n\nprint("Inicio")\ndespedir()\nprint("Fin")',
              output: ['Inicio\nAdiós!\nFin', '¡Adiós!\nInicio\nFin', 'Inicio\nFin', 'Error'],
              correctOutput: 0,
              explanation: 'Se ejecuta en orden: Inicio, luego la función (Adiós!), luego Fin.'
            },
            {
              id: 'e178', type: 'reorder', xp: 25,
              question: 'Ordena el código de la función:',
              blocks: ['doble(7)', '    print(numero * 2)', 'def doble(numero):'],
              correctOrder: [2, 1, 0],
              explanation: 'Primero se define la función, luego se llama con un argumento.'
            },
            {
              id: 'e179', type: 'predict-output', xp: 20,
              question: '¿Cuántas veces se imprime "Python"?',
              codeToRun: 'def decir_python():\n    print("Python")\n\ndecir_python()\ndecir_python()\ndecir_python()',
              output: ['1', '2', '3', 'Error'],
              correctOutput: 2,
              explanation: 'La función se llama 3 veces, así que "Python" se imprime 3 veces.'
            },
            {
              id: 'e180', type: 'type-code', xp: 35,
              explanation: 'Una función se define con def y solo hace algo cuando la llamas. Como no devuelve nada (no hay return), su resultado es None.',
              description: 'Define una función "presentarse" que imprima "Soy una función de Python". Llámala 2 veces.',
              starter: '# Define y llama la función\n',
              solution: 'def presentarse():\n    print("Soy una función de Python")\n\npresentarse()\npresentarse()',
              tests: [{ expected: 'Soy una función de Python\nSoy una función de Python\n' }]
            }
          ]
        },
        {
          id: 'mod9-les2',
          title: 'Parámetros y Retorno',
          icon: '📤',
          exercises: [
            {
              id: 'e181', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'def suma(a, b):\n    return a + b\n\nresultado = suma(3, 4)\nprint(resultado)',
              output: ['3', '4', '7', 'Error'],
              correctOutput: 2,
              explanation: 'suma(3, 4) devuelve 3+4=7, que se guarda en resultado y se imprime.'
            },
            {
              id: 'e182', type: 'fill-blank', xp: 25,
              question: 'Completa la función que devuelve el cuadrado:',
              code: 'def cuadrado(n):\n    ___ n * n\n\nprint(cuadrado(5))',
              blanks: ['return'],
              options: ['return', 'print', 'give', 'send'],
              explanation: '"return" devuelve un valor desde la función al código que la llamó.'
            },
            {
              id: 'e183', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'def mayor(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(mayor(5, 8))',
              output: ['5', '8', 'True', 'Error'],
              correctOutput: 1,
              explanation: '5 no es > 8, así que pasa al segundo return y devuelve 8.'
            },
            {
              id: 'e184', type: 'multiple-choice', xp: 15,
              question: '¿Cuántos valores puede devolver una función con return?',
              choices: ['Exactamente 1', 'Máximo 2', 'Ninguno (return no devuelve nada)', 'Varios (separados por coma)'],
              correct: 3,
              explanation: 'return puede devolver múltiples valores: return a, b devuelve una tupla.'
            },
            {
              id: 'e185', type: 'fill-blank', xp: 25,
              question: 'Función con parámetro por defecto:',
              code: 'def saludar(nombre=___):\n    print(f"Hola, {nombre}!")\n\nsaludar()\nsaludar("Ana")',
              blanks: ['"Mundo"'],
              options: ['"Mundo"', 'Mundo', '""', 'None'],
              explanation: 'Los parámetros por defecto se usan cuando no se pasa argumento.'
            },
            {
              id: 'e186', type: 'type-code', xp: 40,
              explanation: 'return entrega el resultado a quien llama. El módulo con 2 da el resto de la división, así que n % 2 == 0 es True si el número es par.',
              description: 'Define una función "es_par" que reciba un número y devuelva True si es par, False si es impar. Pruébala con 4 y con 7.',
              starter: '# Función es_par\n',
              solution: 'def es_par(n):\n    return n % 2 == 0\n\nprint(es_par(4))\nprint(es_par(7))',
              tests: [{ expected: 'True\nFalse\n' }]
            }
          ]
        },
        {
          id: 'mod9-les3',
          title: 'Funciones Lambda',
          icon: '⚡',
          exercises: [
            {
              id: 'e187', type: 'multiple-choice', xp: 10,
              question: '¿Qué es una función lambda en Python?',
              choices: ['Una función con muchos parámetros', 'Una función anónima de una línea', 'Una función que no retorna nada', 'Una función de clase'],
              correct: 1,
              explanation: 'Lambda crea funciones anónimas pequeñas: lambda x: x * 2.'
            },
            {
              id: 'e188', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'doble = lambda x: x * 2\nprint(doble(5))',
              output: ['5', '10', '25', 'Error'],
              correctOutput: 1,
              explanation: 'La lambda multiplica x por 2. doble(5) = 5 * 2 = 10.'
            },
            {
              id: 'e189', type: 'fill-blank', xp: 25,
              question: 'Crea una lambda que sume dos números:',
              code: 'suma = ___ a, b: a + b\nprint(suma(3, 7))',
              blanks: ['lambda'],
              options: ['lambda', 'def', 'fun', 'func'],
              explanation: 'lambda parámetros: expresión es la sintaxis básica.'
            },
            {
              id: 'e190', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'nums = [3, 1, 4, 1, 5, 9]\nnums.sort(key=lambda x: -x)\nprint(nums[0])',
              output: ['1', '3', '9', 'Error'],
              correctOutput: 2,
              explanation: 'Ordena de mayor a menor (-x). El primero es 9.'
            },
            {
              id: 'e191', type: 'multiple-choice', xp: 15,
              question: '¿Cuántas expresiones puede tener una lambda?',
              choices: ['Varias con ;', 'Solo una', 'Máximo tres', 'Ilimitadas'],
              correct: 1,
              explanation: 'Lambda solo puede tener UNA expresión. Para más, usa def.'
            },
            {
              id: 'e192', type: 'type-code', xp: 40,
              explanation: 'key=lambda x: len(x) indica la clave por la que se ordena (aquí, la longitud). sorted() devuelve una lista nueva y no toca la original.',
              description: 'Usa lambda y sorted() para ordenar la lista ["banana", "manzana", "kiwi"] por longitud de la palabra.',
              starter: 'frutas = ["banana", "manzana", "kiwi"]\n',
              solution: 'frutas = ["banana", "manzana", "kiwi"]\nordenadas = sorted(frutas, key=lambda x: len(x))\nprint(ordenadas)',
              tests: [{ expected: "['kiwi', 'banana', 'manzana']\n" }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 10: MANEJO DE ERRORES
    // ═══════════════════════════════════════════════
    {
      id: 'mod10',
      title: 'Manejo de Errores',
      subtitle: 'Código robusto que no falla',
      icon: '🛡️',
      color: '#EE0979',
      gradient: 'linear-gradient(135deg, #EE0979 0%, #FF6A00 100%)',
      level: 'Avanzado',
      lessons: [
        {
          id: 'mod10-les1',
          title: 'try / except',
          icon: '🎣',
          exercises: [
            {
              id: 'e193', type: 'multiple-choice', xp: 10,
              question: '¿Para qué sirve try/except?',
              choices: ['Hacer el código más rápido', 'Manejar errores sin que el programa se rompa', 'Repetir código automáticamente', 'Definir funciones especiales'],
              correct: 1,
              explanation: 'try/except captura errores y permite manejarlos de forma controlada.'
            },
            {
              id: 'e194', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'try:\n    x = int("abc")\nexcept ValueError:\n    print("No es un número válido")',
              output: ['abc', 'Error', 'No es un número válido', 'None'],
              correctOutput: 2,
              explanation: 'int("abc") lanza ValueError. El except lo captura e imprime el mensaje.'
            },
            {
              id: 'e195', type: 'fill-blank', xp: 25,
              question: 'Captura el error de división entre cero:',
              code: 'try:\n    resultado = 10 / 0\n___ ZeroDivisionError:\n    print("No se puede dividir entre cero")',
              blanks: ['except'],
              options: ['except', 'catch', 'error', 'handle'],
              explanation: '"except" captura el tipo de error especificado.'
            },
            {
              id: 'e196', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'try:\n    print("Intentando...")\n    x = 5 / 0\nexcept ZeroDivisionError:\n    print("Error capturado")\nprint("Programa continúa")',
              output: ['Solo Error capturado', 'Intentando...\nError capturado\nPrograma continúa', 'El programa se rompe', 'Error'],
              correctOutput: 1,
              explanation: 'try ejecuta hasta el error, except lo maneja, y el programa continúa.'
            },
            {
              id: 'e197', type: 'multiple-choice', xp: 15,
              question: '¿Qué hace "finally" en un try/except?',
              choices: ['Solo se ejecuta si hay error', 'Solo se ejecuta si no hay error', 'Siempre se ejecuta, con o sin error', 'Reinicia el bloque try'],
              correct: 2,
              explanation: '"finally" siempre se ejecuta, sea cual sea el resultado del try/except.'
            },
            {
              id: 'e198', type: 'type-code', xp: 45,
              explanation: 'try ejecuta el bloque y, si salta ZeroDivisionError, ejecuta el except. Así el programa sigue vivo en lugar de romperse.',
              description: 'Escribe una función "dividir(a, b)" que use try/except. Si b es 0, devuelve "Error: división entre cero". Si no, devuelve el resultado.',
              starter: 'def dividir(a, b):\n    # Tu código aquí\n    pass\n\nprint(dividir(10, 2))\nprint(dividir(5, 0))',
              solution: 'def dividir(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Error: división entre cero"\n\nprint(dividir(10, 2))\nprint(dividir(5, 0))',
              tests: [{ expected: '5.0\nError: división entre cero\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 11: CLASES Y POO
    // ═══════════════════════════════════════════════
    {
      id: 'mod11',
      title: 'Clases y POO',
      subtitle: 'Programación Orientada a Objetos',
      icon: '🏗️',
      color: '#0F3460',
      gradient: 'linear-gradient(135deg, #0F3460 0%, #533483 100%)',
      level: 'Avanzado',
      lessons: [
        {
          id: 'mod11-les1',
          title: 'Clases y Objetos',
          icon: '🧱',
          exercises: [
            {
              id: 'e199', type: 'multiple-choice', xp: 10,
              question: '¿Qué es una clase en Python?',
              choices: ['Un módulo de Python', 'Un molde para crear objetos', 'Un tipo de bucle', 'Una función especial'],
              correct: 1,
              explanation: 'Una clase es un molde o plantilla. Los objetos son instancias de esa clase.'
            },
            {
              id: 'e200', type: 'fill-blank', xp: 20,
              question: 'Define una clase Perro:',
              code: '___ Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre',
              blanks: ['class'],
              options: ['class', 'def', 'type', 'object'],
              explanation: '"class" define una nueva clase. Por convención, con mayúscula inicial.'
            },
            {
              id: 'e201', type: 'predict-output', xp: 25,
              question: '¿Qué imprime este código?',
              codeToRun: 'class Gato:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\nmi_gato = Gato("Misi")\nprint(mi_gato.nombre)',
              output: ['Gato', 'Misi', '__init__', 'Error'],
              correctOutput: 1,
              explanation: 'Creamos un Gato con nombre "Misi". mi_gato.nombre accede al atributo.'
            },
            {
              id: 'e202', type: 'multiple-choice', xp: 15,
              question: '¿Qué es "__init__"?',
              choices: ['Un error de Python', 'El constructor de la clase', 'Un método que borra el objeto', 'Un módulo especial'],
              correct: 1,
              explanation: '__init__ es el constructor. Se ejecuta automáticamente al crear un objeto.'
            },
            {
              id: 'e203', type: 'reorder', xp: 30,
              question: 'Ordena la clase y su uso:',
              blocks: ['mi_coche = Coche("Toyota", 2020)', '    def __init__(self, marca, año):', 'class Coche:', 'print(mi_coche.marca)', '        self.marca = marca\n        self.año = año'],
              correctOrder: [2, 1, 4, 0, 3],
              explanation: 'class → __init__ → atributos → crear instancia → usar atributos.'
            },
            {
              id: 'e204', type: 'type-code', xp: 50,
              explanation: '__init__ es el constructor: se llama al crear el objeto y guarda los atributos con self. El método area() devuelve la operación.',
              description: 'Crea una clase "Rectangulo" con atributos "base" y "altura". Añade un método "area()" que devuelva base * altura. Crea un rectángulo de 5×3 e imprime su área.',
              starter: 'class Rectangulo:\n    def __init__(self, base, altura):\n        # Tus atributos aquí\n        pass\n    \n    def area(self):\n        # Tu código aquí\n        pass\n\nrect = Rectangulo(5, 3)\nprint(rect.area())',
              solution: 'class Rectangulo:\n    def __init__(self, base, altura):\n        self.base = base\n        self.altura = altura\n    \n    def area(self):\n        return self.base * self.altura\n\nrect = Rectangulo(5, 3)\nprint(rect.area())',
              tests: [{ expected: '15\n' }]
            }
          ]
        },
        {
          id: 'mod11-les2',
          title: 'Herencia',
          icon: '🧬',
          exercises: [
            {
              id: 'e205', type: 'multiple-choice', xp: 10,
              question: '¿Qué permite la herencia en POO?',
              choices: ['Copiar variables', 'Una clase heredar atributos y métodos de otra', 'Borrar clases', 'Importar módulos'],
              correct: 1,
              explanation: 'La herencia permite crear clases nuevas basadas en clases existentes.'
            },
            {
              id: 'e206', type: 'fill-blank', xp: 25,
              question: 'Hereda de la clase Animal:',
              code: 'class Animal:\n    def respirar(self):\n        print("Respiro")\n\nclass Perro(___):\n    def ladrar(self):\n        print("¡Guau!")',
              blanks: ['Animal'],
              options: ['Animal', 'Perro', 'super()', 'base'],
              explanation: 'La clase hija recibe el nombre de la clase padre entre paréntesis.'
            },
            {
              id: 'e207', type: 'predict-output', xp: 25,
              question: '¿Qué imprime este código?',
              codeToRun: 'class Figura:\n    def describir(self):\n        return "Soy una figura"\n\nclass Circulo(Figura):\n    pass\n\nc = Circulo()\nprint(c.describir())',
              output: ['Error', 'Soy un circulo', 'Soy una figura', 'None'],
              correctOutput: 2,
              explanation: 'Circulo hereda describir() de Figura. Se ejecuta el método de la clase padre.'
            },
            {
              id: 'e208', type: 'multiple-choice', xp: 15,
              question: '¿Cómo se llama al constructor del padre desde el hijo?',
              choices: ['parent.__init__()', 'base.__init__()', 'super().__init__()', 'father.__init__()'],
              correct: 2,
              explanation: 'super().__init__() llama al constructor de la clase padre.'
            },
            {
              id: 'e209', type: 'predict-output', xp: 25,
              question: '¿Qué imprime este código?',
              codeToRun: 'class Vehiculo:\n    def __init__(self, marca):\n        self.marca = marca\n\nclass Moto(Vehiculo):\n    def tipo(self):\n        return f"{self.marca} es una moto"\n\nm = Moto("Honda")\nprint(m.tipo())',
              output: ['Honda', 'Honda es una moto', 'Vehiculo', 'Error'],
              correctOutput: 1,
              explanation: 'Moto hereda el atributo marca de Vehiculo. m.tipo() usa self.marca.'
            },
            {
              id: 'e210', type: 'type-code', xp: 55,
              explanation: 'Perro(Animal) indica herencia. Al redefinir sonido() con el mismo nombre, gana el método del hijo en lugar del de la clase padre.',
              description: 'Crea una clase "Animal" con método "sonido()" que devuelva "...". Crea "Perro" que herede de Animal y sobreescriba sonido() para devolver "¡Guau!". Imprime el sonido de un Perro.',
              starter: 'class Animal:\n    def sonido(self):\n        return "..."\n\nclass Perro(Animal):\n    # Sobreescribe sonido()\n    pass\n\nmi_perro = Perro()\nprint(mi_perro.sonido())',
              solution: 'class Animal:\n    def sonido(self):\n        return "..."\n\nclass Perro(Animal):\n    def sonido(self):\n        return "¡Guau!"\n\nmi_perro = Perro()\nprint(mi_perro.sonido())',
              tests: [{ expected: '¡Guau!\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 12: MÓDULOS Y LIBRERÍAS
    // ═══════════════════════════════════════════════
    {
      id: 'mod12',
      title: 'Módulos y Librerías',
      subtitle: 'Usa el poder del ecosistema Python',
      icon: '📦',
      color: '#1A1A2E',
      gradient: 'linear-gradient(135deg, #16213E 0%, #0F3460 50%, #533483 100%)',
      level: 'Avanzado',
      lessons: [
        {
          id: 'mod12-les1',
          title: 'import y math',
          icon: '📐',
          exercises: [
            {
              id: 'e211', type: 'multiple-choice', xp: 10,
              question: '¿Cómo importas el módulo math?',
              choices: ['include math', 'require math', 'import math', 'use math'],
              correct: 2,
              explanation: '"import math" carga el módulo y todas sus funciones matemáticas.'
            },
            {
              id: 'e212', type: 'fill-blank', xp: 20,
              question: 'Calcula la raíz cuadrada de 16:',
              code: '___ math\nresultado = math.___(16)\nprint(resultado)',
              blanks: ['import', 'sqrt'],
              options: ['import', 'require', 'sqrt', 'root', 'squareroot'],
              explanation: 'import math, luego math.sqrt() para raíz cuadrada.'
            },
            {
              id: 'e213', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'import math\nprint(math.pi)',
              output: ['3.14', '3.141592653589793', 'pi', 'Error'],
              correctOutput: 1,
              explanation: 'math.pi contiene el valor de π con alta precisión.'
            },
            {
              id: 'e214', type: 'multiple-choice', xp: 15,
              question: '¿Qué hace "from math import sqrt"?',
              choices: ['Importa todo el módulo math', 'Importa solo la función sqrt', 'Crea un alias para math', 'Elimina el módulo math'],
              correct: 1,
              explanation: '"from módulo import función" importa solo lo que necesitas.'
            },
            {
              id: 'e215', type: 'predict-output', xp: 20,
              question: '¿Qué imprime este código?',
              codeToRun: 'import random\nrandom.seed(42)\nprint(random.randint(1, 10))',
              output: ['1', '7', '42', 'Error'],
              correctOutput: 1,
              explanation: 'random.randint(a, b) da un número aleatorio entre a y b. Con seed(42) siempre es 7.'
            },
            {
              id: 'e216', type: 'type-code', xp: 40,
              explanation: 'Se importa el módulo con import math y se llama a math.ceil (redondea hacia arriba) y math.floor (redondea hacia abajo).',
              description: 'Usa el módulo math para calcular:\n• El techo de 4.2 (math.ceil)\n• El piso de 4.8 (math.floor)\nImprime ambos.',
              starter: 'import math\n',
              solution: 'import math\nprint(math.ceil(4.2))\nprint(math.floor(4.8))',
              tests: [{ expected: '5\n4\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 13: PROYECTO - CALCULADORA
    // ═══════════════════════════════════════════════
    {
      id: 'mod13',
      title: '🏆 Proyecto: Calculadora',
      subtitle: 'Construye una calculadora completa',
      icon: '🧮',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      level: 'Proyecto',
      isProject: true,
      lessons: [
        {
          id: 'mod13-les1',
          title: 'Operaciones Básicas',
          icon: '➕',
          exercises: [
            {
              id: 'e217', type: 'multiple-choice', xp: 15,
              question: '¿Cuál es el primer paso para diseñar nuestra calculadora?',
              choices: ['Dibujar la interfaz', 'Definir las operaciones como funciones', 'Instalar librerías', 'Crear una clase Calculator'],
              correct: 1,
              explanation: 'Empezamos definiendo cada operación como una función reutilizable.'
            },
            {
              id: 'e218', type: 'reorder', xp: 30,
              question: 'Construye la función de suma:',
              blocks: ['    return a + b', 'def sumar(a, b):', 'print(sumar(5, 3))'],
              correctOrder: [1, 0, 2],
              explanation: 'Definir función → cuerpo con return → llamar la función.'
            },
            {
              id: 'e219', type: 'type-code', xp: 50,
              explanation: 'Cada función devuelve su resultado con return. La division comprueba antes el divisor para no lanzar una excepcion.',
              description: 'Crea las 4 funciones básicas: sumar(a,b), restar(a,b), multiplicar(a,b), dividir(a,b). La división debe manejar división entre cero. Prueba: sumar(10,5), restar(10,5), multiplicar(4,3), dividir(10,0).',
              starter: '# Calculadora básica\n\ndef sumar(a, b):\n    pass\n\ndef restar(a, b):\n    pass\n\ndef multiplicar(a, b):\n    pass\n\ndef dividir(a, b):\n    pass\n',
              solution: 'def sumar(a, b):\n    return a + b\n\ndef restar(a, b):\n    return a - b\n\ndef multiplicar(a, b):\n    return a * b\n\ndef dividir(a, b):\n    if b == 0:\n        return "Error: división entre cero"\n    return a / b\n\nprint(sumar(10, 5))\nprint(restar(10, 5))\nprint(multiplicar(4, 3))\nprint(dividir(10, 0))',
              tests: [{ expected: '15\n5\n12\nError: división entre cero\n' }]
            },
            {
              id: 'e220', type: 'fill-blank', xp: 30,
              question: 'Usa un diccionario para mapear operaciones:',
              code: 'operaciones = {\n    "+": sumar,\n    "-": restar,\n    "*": multiplicar,\n    "/": dividir\n}\n\nop = "+"\nresultado = ___[op](10, 5)\nprint(resultado)',
              blanks: ['operaciones'],
              options: ['operaciones', 'op', 'calcular', 'funciones'],
              explanation: 'El diccionario mapea símbolos a funciones. operaciones["+"] devuelve la función sumar.'
            },
            {
              id: 'e221', type: 'predict-output', xp: 25,
              question: '¿Qué imprime este código?',
              codeToRun: 'def potencia(base, exp):\n    return base ** exp\n\nops = {"**": potencia}\nprint(ops["**"](2, 10))',
              output: ['20', '210', '1024', 'Error'],
              correctOutput: 2,
              explanation: '2 ** 10 = 1024. ops["**"] devuelve la función potencia.'
            },
            {
              id: 'e222', type: 'type-code', xp: 60,
              explanation: 'El operador ** es la potencia (base ** exp). La raiz cuadrada de un numero es ese numero elevado a 0.5.',
              description: 'Amplía la calculadora: añade funciones potencia(base, exp) y raiz(n) (raíz cuadrada usando **0.5). Prueba potencia(2, 8) y raiz(144).',
              starter: 'def potencia(base, exp):\n    pass\n\ndef raiz(n):\n    pass\n\nprint(potencia(2, 8))\nprint(raiz(144))',
              solution: 'def potencia(base, exp):\n    return base ** exp\n\ndef raiz(n):\n    return n ** 0.5\n\nprint(potencia(2, 8))\nprint(raiz(144))',
              tests: [{ expected: '256\n12.0\n' }]
            }
          ]
        },
        {
          id: 'mod13-les2',
          title: 'Calculadora con Historial',
          icon: '📜',
          exercises: [
            {
              id: 'e223', type: 'multiple-choice', xp: 15,
              question: '¿Qué estructura de datos usaremos para el historial?',
              choices: ['Un string', 'Una lista', 'Un int', 'Un set'],
              correct: 1,
              explanation: 'Una lista es perfecta para el historial: podemos añadir, ver y limpiar operaciones.'
            },
            {
              id: 'e224', type: 'reorder', xp: 30,
              question: 'Añade una operación al historial:',
              blocks: ['historial.append(entrada)', 'entrada = f"{a} {op} {b} = {resultado}"', 'historial = []', 'print(historial)'],
              correctOrder: [2, 1, 0, 3],
              explanation: 'Lista vacía → crear entrada formateada → añadir → mostrar.'
            },
            {
              id: 'e225', type: 'type-code', xp: 70,
              explanation: 'calcular() decide la operacion con if/elif y luego guarda la entrada en el historial con append antes de devolver el resultado.',
              description: 'Crea una clase Calculadora con:\n• atributo historial (lista vacía)\n• método calcular(a, op, b) que haga la operación, la guarde en historial y devuelva el resultado\n• método ver_historial() que imprima cada entrada\nPrueba con 10+5, 20-3, 4*7.',
              starter: 'class Calculadora:\n    def __init__(self):\n        self.historial = []\n    \n    def calcular(self, a, op, b):\n        # Tu código aquí\n        pass\n    \n    def ver_historial(self):\n        # Tu código aquí\n        pass\n\ncalc = Calculadora()\ncalc.calcular(10, "+", 5)\ncalc.calcular(20, "-", 3)\ncalc.calcular(4, "*", 7)\ncalc.ver_historial()',
              solution: 'class Calculadora:\n    def __init__(self):\n        self.historial = []\n    \n    def calcular(self, a, op, b):\n        if op == "+":\n            resultado = a + b\n        elif op == "-":\n            resultado = a - b\n        elif op == "*":\n            resultado = a * b\n        elif op == "/":\n            resultado = a / b if b != 0 else "Error"\n        entrada = f"{a} {op} {b} = {resultado}"\n        self.historial.append(entrada)\n        return resultado\n    \n    def ver_historial(self):\n        for entrada in self.historial:\n            print(entrada)\n\ncalc = Calculadora()\ncalc.calcular(10, "+", 5)\ncalc.calcular(20, "-", 3)\ncalc.calcular(4, "*", 7)\ncalc.ver_historial()',
              tests: [{ expected: '10 + 5 = 15\n20 - 3 = 17\n4 * 7 = 28\n' }]
            }
          ]
        }
      ]
    },

    // ═══════════════════════════════════════════════
    // MÓDULO 14: PROYECTO - GESTOR DE TAREAS
    // ═══════════════════════════════════════════════
    {
      id: 'mod14',
      title: '🏆 Proyecto: Gestor de Tareas',
      subtitle: 'Tu primera app de productividad',
      icon: '✅',
      color: '#00B4DB',
      gradient: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
      level: 'Proyecto',
      isProject: true,
      lessons: [
        {
          id: 'mod14-les1',
          title: 'CRUD de Tareas',
          icon: '📝',
          exercises: [
            {
              id: 'e226', type: 'multiple-choice', xp: 15,
              question: '¿Qué significa CRUD en programación?',
              choices: ['Create, Read, Update, Delete', 'Code, Run, Use, Deploy', 'Class, Return, Use, Define', 'Connect, Request, Upload, Download'],
              correct: 0,
              explanation: 'CRUD son las 4 operaciones básicas de cualquier sistema de datos.'
            },
            {
              id: 'e227', type: 'reorder', xp: 30,
              question: 'Diseña la estructura de datos de una tarea:',
              blocks: ['"completada": False', '"id": 1,', 'tarea = {', '"titulo": "Aprender Python",', '}'],
              correctOrder: [2, 1, 3, 0, 4],
              explanation: 'Una tarea es un diccionario con id, titulo y estado completada.'
            },
            {
              id: 'e228', type: 'type-code', xp: 80,
              explanation: 'Cada tarea es un diccionario dentro de una lista. El id sale de un contador que sube en cada alta y completar_tarea busca la tarea por su id.',
              description: 'Crea una clase GestorTareas con:\n• Lista de tareas (list)\n• agregar_tarea(titulo) → añade tarea con id auto-incremental\n• completar_tarea(id) → marca como completada\n• listar_tareas() → imprime todas\nPrueba añadiendo 3 tareas y completando la 2.',
              starter: 'class GestorTareas:\n    def __init__(self):\n        self.tareas = []\n        self.contador = 1\n    \n    def agregar_tarea(self, titulo):\n        # Tu código aquí\n        pass\n    \n    def completar_tarea(self, id):\n        # Tu código aquí\n        pass\n    \n    def listar_tareas(self):\n        # Tu código aquí\n        pass\n\ng = GestorTareas()\ng.agregar_tarea("Estudiar Python")\ng.agregar_tarea("Hacer ejercicio")\ng.agregar_tarea("Leer un libro")\ng.completar_tarea(2)\ng.listar_tareas()',
              solution: 'class GestorTareas:\n    def __init__(self):\n        self.tareas = []\n        self.contador = 1\n    \n    def agregar_tarea(self, titulo):\n        tarea = {"id": self.contador, "titulo": titulo, "completada": False}\n        self.tareas.append(tarea)\n        self.contador += 1\n    \n    def completar_tarea(self, id):\n        for tarea in self.tareas:\n            if tarea["id"] == id:\n                tarea["completada"] = True\n    \n    def listar_tareas(self):\n        for tarea in self.tareas:\n            estado = "✓" if tarea["completada"] else "○"\n            print(f"[{estado}] {tarea[\'id\']}. {tarea[\'titulo\']}")\n\ng = GestorTareas()\ng.agregar_tarea("Estudiar Python")\ng.agregar_tarea("Hacer ejercicio")\ng.agregar_tarea("Leer un libro")\ng.completar_tarea(2)\ng.listar_tareas()',
              tests: [{ expected: '[○] 1. Estudiar Python\n[✓] 2. Hacer ejercicio\n[○] 3. Leer un libro\n' }]
            }
          ]
        },
        {
          id: 'mod14-les2',
          title: 'Estadísticas y Filtros',
          icon: '📊',
          exercises: [
            {
              id: 'e229', type: 'type-code', xp: 50,
              explanation: 'len() da la longitud de la lista y una list comprehension entre corchetes cuenta las que cumplen la condicion.',
              description: 'Dado el gestor, añade un método "estadisticas()" que imprima:\n• Total de tareas\n• Tareas completadas\n• Tareas pendientes',
              starter: 'tareas = [\n    {"id": 1, "titulo": "Tarea A", "completada": True},\n    {"id": 2, "titulo": "Tarea B", "completada": False},\n    {"id": 3, "titulo": "Tarea C", "completada": True},\n    {"id": 4, "titulo": "Tarea D", "completada": False}\n]\n\n# Calcula e imprime las estadísticas\n',
              solution: 'tareas = [\n    {"id": 1, "titulo": "Tarea A", "completada": True},\n    {"id": 2, "titulo": "Tarea B", "completada": False},\n    {"id": 3, "titulo": "Tarea C", "completada": True},\n    {"id": 4, "titulo": "Tarea D", "completada": False}\n]\n\ntotal = len(tareas)\ncompletadas = len([t for t in tareas if t["completada"]])\npendientes = total - completadas\nprint(f"Total: {total}")\nprint(f"Completadas: {completadas}")\nprint(f"Pendientes: {pendientes}")',
              tests: [{ expected: 'Total: 4\nCompletadas: 2\nPendientes: 2\n' }]
            },
            {
              id: 'e230', type: 'type-code', xp: 70,
              explanation: 'El lower() en ambos lados hace que la comparación no dependa de mayusculas; texto.lower() in t["titulo"].lower() comprueba si está contenido.',
              description: 'Crea una función "buscar_tarea(tareas, texto)" que devuelva todas las tareas cuyo título contenga el texto (sin importar mayúsculas). Imprime los títulos encontrados.',
              starter: 'tareas = [\n    {"titulo": "Estudiar Python"},\n    {"titulo": "Comprar leche"},\n    {"titulo": "Estudiar matemáticas"},\n    {"titulo": "Llamar a mamá"}\n]\n\ndef buscar_tarea(tareas, texto):\n    # Tu código aquí\n    pass\n\nresultados = buscar_tarea(tareas, "estudiar")\nfor t in resultados:\n    print(t["titulo"])',
              solution: 'tareas = [\n    {"titulo": "Estudiar Python"},\n    {"titulo": "Comprar leche"},\n    {"titulo": "Estudiar matemáticas"},\n    {"titulo": "Llamar a mamá"}\n]\n\ndef buscar_tarea(tareas, texto):\n    return [t for t in tareas if texto.lower() in t["titulo"].lower()]\n\nresultados = buscar_tarea(tareas, "estudiar")\nfor t in resultados:\n    print(t["titulo"])',
              tests: [{ expected: 'Estudiar Python\nEstudiar matemáticas\n' }]
            }
          ]
        }
      ]
    }

  ]
};
