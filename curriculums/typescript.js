// TypeScript Curriculum — JavaScript con los tipos puestos
//
// Los ejercicios pasan por tsengine.js, que NO es un intérprete: comprueba
// los tipos, quita las anotaciones y ejecuta el JavaScript que queda. Igual que
// harían tsc y el navegador.
//
// Por eso el temario tiene una idea que los otros cursos no tienen: el alumno
// ve errores de tipos ANTES de que nada se ejecute, y el enunciado de cada
// ejercicio explica qué esperaba y qué se encontró.
//
// Convenciones del temario:
//   · Los type-code llevan solo código: las anotaciones se escriben cuando el
//     ejercicio las pide, y el motor las quita.
//   · predict-output calcula la respuesta con el motor.
//   · Nada que el motor no compruebe: ni espacios de nombres, ni sobrecargas,
//     ni tipos condicionales, ni mapped types, ni módulos.

window.TS_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // TS MÓDULO 1: QUÉ ES TYPESCRIPT
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod1',
    title: 'Qué es TypeScript',
    subtitle: 'JavaScript que avisa antes de romperse',
    icon: '🟦',
    color: '#3178C6',
    gradient: 'linear-gradient(135deg, #3178C6 0%, #1E4E8C 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'ts-mod1-les1',
        title: 'La idea',
        icon: '💡',
        exercises: [
          {
            id: 'tse001', type: 'multiple-choice', xp: 10,
            question: '¿Qué es TypeScript?',
            choices: [
              'Un lenguaje distinto de JavaScript',
              'JavaScript con anotaciones de tipo que se quitan al compilar',
              'Una biblioteca para validar formularios',
              'La versión nueva de JavaScript'
            ],
            correct: 1,
            explanation: 'TypeScript es JavaScript con anotaciones de tipo. Cuando se compila, esas anotaciones desaparecen y queda JavaScript de toda la vida. Nada del código que escribes existe al final.'
          },
          {
            id: 'tse002', type: 'multiple-choice', xp: 15,
            question: '¿Qué gana uno al usar tipos?',
            choices: [
              'Que el programa va más rápido',
              'Que los errores se ven antes de ejecutar, sin probarlo',
              'Que ocupa menos memoria',
              'Que se puede usar sin Internet'
            ],
            correct: 1,
            explanation: 'La velocidad es la de JavaScript, sin cambios. Lo que se gana es que el compilador encuentra errores que en JavaScript solo aparecerían al ejecutar, cuando ya has escrito media hora de código.'
          },
          {
            id: 'tse003', type: 'multiple-choice', xp: 15,
            question: 'En un archivo .ts, ¿qué línea da error?',
            choices: [
              'const edad: number = 30;',
              'const nombre: string = "Ana";',
              'const edad: number = "treinta";',
              'const lista: number[] = [1, 2, 3];'
            ],
            correct: 2,
            explanation: 'La tercera: un texto no se puede guardar en una variable de números. En JavaScript esto no daría ningún error y rompería más tarde, al comparar.'
          },
          {
            id: 'tse004', type: 'predict-output', xp: 25,
            question: '¿Qué pasa al ejecutar este programa?',
            codeToRun: 'const edad: number = "treinta";\nconsole.log(edad);',
            output: [
              'Imprime treinta',
              'Imprime undefined',
              'Da un error de tipos y no se ejecuta nada',
              'Da un error al ejecutar'
            ],
            correctOutput: 2,
            expectError: true,
            explanation: 'Da un error de tipos ANTES de ejecutar. Eso es justo lo que aporta TypeScript: el fallo aparece en el momento de compilar, no después.'
          },
          {
            id: 'tse005', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa con las anotaciones al compilar?',
            choices: [
              'Se quedan en el JavaScript final',
              'Desaparecen: el JavaScript final es JavaScript normal',
              'Se convierten en comentarios',
              'Se traducen a un número'
            ],
            correct: 1,
            explanation: 'Desaparecen por completo. El navegador recibe JavaScript sin una sola anotación, y por eso TypeScript no necesita un motor propio ni cambia la velocidad.'
          },
          {
            id: 'tse006', type: 'type-code', xp: 30,
            description: 'Declara una variable de texto llamada nombre con "Ana" y otra de número llamada edad con 30. Imprime las dos.',
            starter: '// Declara nombre como texto y edad como número, e imprímelas',
            solution: 'const nombre: string = "Ana";\nconst edad: number = 30;\nconsole.log(nombre, edad);',
            explanation: 'La anotación va entre el nombre y el igual, y dice de qué tipo es la variable. Al imprimir, console.log las separa con un espacio.',
            tests: [{ expected: 'Ana 30\n' }]
          }
        ]
      },
      {
        id: 'ts-mod1-les2',
        title: 'Tu primer programa con tipos',
        icon: '🚀',
        exercises: [
          {
            id: 'tse007', type: 'multiple-choice', xp: 15,
            question: '¿Dónde va la anotación de tipo?',
            choices: [
              'Antes del nombre: number edad = 30',
              'Después del nombre: edad: number = 30',
              'Al final de la línea',
              'Dentro de las comillas'
            ],
            correct: 1,
            explanation: 'Después del nombre y antes del igual, con dos puntos: edad: number = 30. Es el mismo orden que en un parámetro de función.'
          },
          {
            id: 'tse008', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama el tipo de los textos?',
            choices: ['text', 'string', 'str', 'char'],
            correct: 1,
            explanation: 'string. En TypeScript no hay char: para un solo carácter se usa string con comillas simples, como \'A\'.'
          },
          {
            id: 'tse009', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de la variable:',
            code: 'const edad: ___ = 30;\nconsole.log(edad);',
            blanks: ['number'],
            options: ['number', 'num', 'int', 'float'],
            correct: 0,
            explanation: 'El tipo de los números enteros es number. Si escribieras num, el compilador no sabría qué tipo es y lo trataría como any.'
          },
          {
            id: 'tse010', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const nombre: string = "Ana";\nconst edad: number = 30;\nconsole.log(nombre, edad);',
            output: ['Ana 30', 'Ana30', 'Nombre: Ana Edad: 30', 'error de tipos'],
            correctOutput: 0,
            explanation: 'console.log separa los argumentos con un espacio. Los tipos no se imprimen: solo sirven para comprobar el código.'
          },
          {
            id: 'tse011', type: 'multiple-choice', xp: 20,
            question: '¿El tipo se pone siempre?',
            choices: [
              'Sí, es obligatorio',
              'No: si lo deduces, puedes omitirlo',
              'Solo en las funciones',
              'Solo si usas punto y coma'
            ],
            correct: 1,
            explanation: 'No hace falta si el tipo se deduce. const edad = 30 ya es un number. Se anota cuando quieres dejar claro el tipo o cuando la deducción no vale (por ejemplo, un valor vacío).'
          },
          {
            id: 'tse012', type: 'type-code', xp: 30,
            description: 'Declara un número decimal llamado precio con 1.5 y un texto llamado producto con "Pan", e imprímelos.',
            starter: '// Un decimal y un texto, con su tipo declarado',
            solution: 'const precio: number = 1.5;\nconst producto: string = "Pan";\nconsole.log(producto, precio);',
            explanation: 'number sirve para decimales y enteros. Si le pones comillas al 1.5 pasa a ser un texto y el programa daría error.',
            tests: [{ expected: 'Pan 1.5\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 2: LOS TIPOS BÁSICOS
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod2',
    title: 'Los Tipos',
    subtitle: 'number, string, boolean',
    icon: '🔢',
    color: '#2563EB',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'ts-mod2-les1',
        title: 'number, string y boolean',
        icon: '🎲',
        exercises: [
          {
            id: 'tse013', type: 'multiple-choice', xp: 15,
            question: '¿Cuántos tipos primitivos tiene TypeScript?',
            choices: ['Tres: number, string y boolean', 'Cinco', 'Diez', 'Solo uno'],
            correct: 1,
            explanation: 'Los tres que se usan el 95% del tiempo son number, string y boolean. Luego están undefined, null, any y unknown, que son casos aparte.'
          },
          {
            id: 'tse014', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipo tiene "42"?',
            choices: ['number', 'string', 'texto', 'número'],
            correct: 1,
            explanation: 'string, porque va entre comillas. El 42 a secas es number. Es la diferencia que más errores evita: "42" + 1 es "421" y 42 + 1 es 43.'
          },
          {
            id: 'tse015', type: 'multiple-choice', xp: 15,
            question: '¿Cuántos valores tiene boolean?',
            choices: ['Dos: true y false', 'Tres', 'Todos los números', 'Ninguno'],
            correct: 0,
            explanation: 'true y false, en minúsculas y sin comillas. Con comillas ("true") sería un texto, y entonces el valor de verdad sería otro.'
          },
          {
            id: 'tse016', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de una variable de texto:',
            code: 'const nombre: ___ = "Ana";\nconsole.log(nombre);',
            blanks: ['string'],
            options: ['string', 'str', 'texto', 'char'],
            correct: 0,
            explanation: 'string es el tipo de los textos. char no existe en TypeScript: para un carácter suelto se usa string con comillas simples.'
          },
          {
            id: 'tse017', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const n: number = 42;\nconst s: string = "42";\nconst b: boolean = true;\nconsole.log(n, s, b);',
            output: ['42 42 true', '42 42 1', 'number string boolean', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Imprime el valor de cada variable. Y fíjate en que el número y el texto se ven igual al imprimir: la diferencia no se ve, por eso los tipos sirven.'
          },
          {
            id: 'tse018', type: 'type-code', xp: 30,
            description: 'Declara un número, un texto y un booleano, e imprime los tres valores en una línea.',
            starter: '// Un valor de cada tipo primitivo',
            solution: 'const n: number = 7;\nconst s: string = "siete";\nconst b: boolean = true;\nconsole.log(n, s, b);',
            explanation: 'number, string y boolean son los tres tipos primitivos. El booleano se escribe sin comillas.',
            tests: [{ expected: '7 siete true\n' }]
          }
        ]
      },
      {
        id: 'ts-mod2-les2',
        title: 'any, unknown y la inferencia',
        icon: '❓',
        exercises: [
          {
            id: 'tse019', type: 'multiple-choice', xp: 20,
            question: '¿Qué es any?',
            choices: [
              'Un tipo que desactiva la comprobación: ahí puede valer cualquier cosa',
              'El tipo de los números',
              'Un error',
              'La ausencia de tipo'
            ],
            correct: 0,
            explanation: 'any es "no me importa, deja pasar todo". Es práctico cuando vienes de JavaScript, pero en cuanto se usa mucho se pierden las ventajas: es como no haber puesto tipos.'
          },
          {
            id: 'tse020', type: 'multiple-choice', xp: 20,
            question: '¿Y unknown?',
            choices: [
              'Igual que any pero más estricto: primero tienes que mirar dentro',
              'Lo mismo que any',
              'Un tipo que solo sirve para números',
              'La palabra null'
            ],
            correct: 0,
            explanation: 'unknown es la versión prudente de any. Puedes guardar cualquier cosa, pero no usarla sin comprobar antes qué es. Es el tipo que se debería elegir por defecto cuando no sabes.'
          },
          {
            id: 'tse021', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace const edad = 30 sin anotar?',
            choices: [
              'Da error por falta de tipo',
              'TypeScript deduce que es number',
              'Se queda como any',
              'No compila'
            ],
            correct: 1,
            explanation: 'Lo deduce: la variable edad es un number. Anotar solo hace falta cuando quieres ser explícito o cuando la deducción no vale.'
          },
          {
            id: 'tse022', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo que desactiva la comprobación:',
            code: 'const cosa: ___ = "texto";\nconsole.log(cosa);',
            blanks: ['any'],
            options: ['any', 'unknow', 'nada', '*'],
            correct: 0,
            explanation: 'any deja pasar cualquier valor. Se usa cuando estás migrando código de JavaScript y no quieres escribirlo todo de golpe.'
          },
          {
            id: 'tse023', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const edad = 30;\nconst nombre = "Ana";\nconsole.log(edad, nombre);',
            output: ['30 Ana', '30Ana', 'number string', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Funciona igual que sin tipos: TypeScript deduce que edad es number y nombre es string, y el programa se ejecuta normal.'
          },
          {
            id: 'tse024', type: 'multiple-choice', xp: 20,
            question: '¿Por qué no conviene llenar el código de any?',
            choices: [
              'Porque es más lento',
              'Porque en cuanto hay un any, el compilador deja de comprobar esa parte',
              'Porque ocupa más memoria',
              'Porque no se puede compilar'
            ],
            correct: 1,
            explanation: 'Un any desactiva la comprobación en toda la cadena: si una función recibe any, lo que devuelve también es any. Es la forma más rápida de perder la ventaja de TypeScript.'
          },
          {
            id: 'tse025', type: 'type-code', xp: 30,
            description: 'Declara una variable sin anotar y otra con tipo any, e imprime las dos.',
            starter: '// Una deducida y otra con any',
            solution: 'const edad = 30;\nconst dato: any = "lo que sea";\nconsole.log(edad, dato);',
            explanation: 'La primera deduce su tipo y la segunda lo desactiva con any. Any deja pasar cualquier valor sin comprobar nada.',
            tests: [{ expected: '30 lo que sea\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 3: LOS ERRORES
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod3',
    title: 'Errores de Tipos',
    subtitle: 'El motivo de existir',
    icon: '🛑',
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'ts-mod3-les1',
        title: 'No se asignan cosas distintas',
        icon: '✋',
        exercises: [
          {
            id: 'tse026', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el error más típico al empezar?',
            choices: [
              'Poner un texto en una variable de números',
              'Usar const cuando toca let',
              'Faltar un punto y coma'
            ],
            correct: 0,
            explanation: 'Asignar un texto a una variable de números. Es exactamente el error que en JavaScript no se ve hasta que algo se rompe.'
          },
          {
            id: 'tse027', type: 'multiple-choice', xp: 20,
            question: 'En JavaScript, ¿qué pasa con const edad = "treinta"; console.log(edad * 2)?',
            choices: [
              'Imprime 60',
              'Imprime NaN sin avisar',
              'Da error',
              'Imprime treinta2'
            ],
            correct: 1,
            explanation: 'Imprime NaN y no avisa de nada. Con TypeScript el error aparece al compilar, con un mensaje que dice qué esperaba y qué encontró.'
          },
          {
            id: 'tse028', type: 'multiple-choice', xp: 20,
            question: '¿Qué mensaje da el compilador?',
            choices: [
              'Algún error',
              "El tipo '\"treinta\"' no es asignable al tipo 'number'.",
              'number no acepta textos',
              'Variable inválida'
            ],
            correct: 1,
            explanation: "Nombra los dos tipos: el que encontró y el que esperaba. Por eso el mensaje sirve para arreglarlo sin buscar por dónde."
          },
          {
            id: 'tse029', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo para que esta línea sea un error:',
            code: 'const edad: ___ = "treinta";\nconsole.log(edad);',
            blanks: ['number'],
            options: ['number', 'string', 'any', 'text'],
            correct: 0,
            explanation: 'Con number y un texto a la derecha, el compilador da error. Con any o string no daría error, y no se aprendería nada.'
          },
          {
            id: 'tse030', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este programa?',
            codeToRun: 'const edad: number = "treinta";\nconsole.log("esto no llega a imprimirse");',
            output: [
              'NaN',
              'esto no llega a imprimirse',
              'Un error de tipos, y el programa no se ejecuta',
              'treinta'
            ],
            correctOutput: 2,
            expectError: true,
            explanation: 'Primero se comprueban los tipos y solo después se ejecuta. Como hay un error, el programa entero no corre: esa es la diferencia con JavaScript.'
          },
          {
            id: 'tse031', type: 'multiple-choice', xp: 20,
            question: 'Si hay dos errores en el archivo, ¿el compilador avisa de los dos?',
            choices: [
              'Solo del primero, y para',
              'De los dos a la vez',
              'De ninguno',
              'Depende del editor'
            ],
            correct: 1,
            explanation: 'De todos a la vez, con el número total al principio. En JavaScript habría que ejecutar y esperar al primero, corregir, ejecutar otra vez...'
          },
          {
            id: 'tse032', type: 'type-code', xp: 30,
            description: 'Declara una variable de números y guarda en ella la suma de 20 y 22.',
            starter: '// La suma, en una variable de números',
            solution: 'const resultado: number = 20 + 22;\nconsole.log(resultado);',
            explanation: 'El compilador comprueba que la suma da un número, que es lo que espera la variable. Si sumaras dos textos en una variable de números, avisaría.',
            tests: [{ expected: '42\n' }]
          }
        ]
      },
      {
        id: 'ts-mod3-les2',
        title: 'Encontrar el error',
        icon: '🔍',
        exercises: [
          {
            id: 'tse033', type: 'multiple-choice', xp: 20,
            question: '¿Por qué number + string da un error?',
            choices: [
              'Porque los números no se pueden sumar',
              'Porque no se puede sumar un número con un texto sin decidir a cuál de los dos se convierte',
              'Porque string solo admite un carácter',
              'Porque falta un punto y coma'
            ],
            correct: 1,
            explanation: 'TypeScript te obliga a decidir: si quieres texto, convierte el número con String(n), y si quieres número, convierte el texto con Number(s). Nunca adivina por ti.'
          },
          {
            id: 'tse034', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se convierte un número en texto de forma explícita?',
            choices: ['String(n)', 'str(n)', 'texto(n)', 'n.string()'],
            correct: 0,
            explanation: 'String(n). Así el compilador sabe que has tomado una decisión y el resultado es un texto a propósito.'
          },
          {
            id: 'tse035', type: 'multiple-choice', xp: 20,
            question: 'Un array de textos, ¿de qué tipo es?',
            choices: ['text', 'string[]', 'list<string>', 'array de string'],
            correct: 1,
            explanation: 'string[]. El tipo base va delante y los corchetes detrás significan "una lista de". Así: number[], boolean[].'
          },
          {
            id: 'tse036', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de un array de números:',
            code: 'const nums: ___ = [1, 2, 3];\nconsole.log(nums);',
            blanks: ['number[]'],
            options: ['number[]', 'array', '[number]', 'numbers'],
            correct: 0,
            explanation: 'number[]: el tipo del elemento y luego los corchetes que dicen "lista de". El orden inverso no vale.'
          },
          {
            id: 'tse037', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const nums: number[] = [1, 2, 3];\nconst nombres: string[] = ["Ana", "Luis"];\nconsole.log(nums.length, nombres[0]);',
            output: ['3 Ana', '3 [1 2 3]', '1 Ana', 'error de tipos'],
            correctOutput: 0,
            explanation: 'length da cuántos elementos tiene el array y los índices empiezan en 0, así que nombres[0] es "Ana".'
          },
          {
            id: 'tse038', type: 'type-code', xp: 30,
            description: 'Crea un array de tres números, añade un cuarto con push e imprime cuántos hay.',
            starter: '// Un array de números y su tamaño',
            solution: 'const nums: number[] = [10, 20, 30];\nnums.push(40);\nconsole.log(nums.length);',
            explanation: 'El tipo del array se comprueba al declararlo: si metieras un texto, el error saltaría ahí. length dice cuántos tiene ahora.',
            tests: [{ expected: '4\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 4: INTERFACES
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod4',
    title: 'Interfaces',
    subtitle: 'La forma de un objeto',
    icon: '🧩',
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'ts-mod4-les1',
        title: 'Declarar una interfaz',
        icon: '📐',
        exercises: [
          {
            id: 'tse039', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve una interface?',
            choices: [
              'Describir qué campos tiene que tener un objeto',
              'Hacer el programa más rápido',
              'Convertir un objeto en texto',
              'Crear una clase'
            ],
            correct: 0,
            explanation: 'Una interface describe la FORMA de un objeto: qué campos tiene y de qué tipo es cada uno. Es un contrato que el compilador comprueba.'
          },
          {
            id: 'tse040', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara una interface?',
            choices: [
              'interface Persona { nombre: string }',
              'class Persona { nombre: string }',
              'type Persona = { nombre: string }',
              'interface Persona = { nombre: string }'
            ],
            correct: 0,
            explanation: 'Con interface, el nombre y las llaves. Dentro, cada campo con su tipo, separados por punto y coma.'
          },
          {
            id: 'tse041', type: 'multiple-choice', xp: 20,
            question: 'Una interface, ¿existe al compilar?',
            choices: [
              'Sí, se convierte en código',
              'No: desaparece, era solo para el compilador',
              'Solo si tiene métodos',
              'Depende del navegador'
            ],
            correct: 1,
            explanation: 'Desaparece por completo. El JavaScript final es un objeto normal, sin rastro de la interface. Por eso una interface no añade nada en tiempo de ejecución.'
          },
          {
            id: 'tse042', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que declara una interfaz:',
            code: '___ Persona {\n  nombre: string;\n}\n\nconst p: Persona = { nombre: "Ana" };\nconsole.log(p.nombre);',
            blanks: ['interface'],
            options: ['interface', 'class', 'type', 'struct'],
            correct: 0,
            explanation: 'Con interface. type serviría para un alias, pero entonces el cuerpo va con un igual, no con llaves sueltas.'
          },
          {
            id: 'tse043', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nconst ana: Persona = { nombre: "Ana", edad: 30 };\nconsole.log(ana.nombre, ana.edad);',
            output: ['Ana 30', 'ana.nombre ana.edad', 'error: la interface no existe', 'Ana, 30'],
            correctOutput: 0,
            explanation: 'El objeto cumple la interfaz y el programa corre normal. La interface solo ha servido para que el compilador compruebe la forma.'
          },
          {
            id: 'tse044', type: 'type-code', xp: 35,
            description: 'Declara una interface Producto con nombre y precio, y crea un producto que la cumpla.',
            starter: '// La interface, el objeto que la cumple y su impresión',
            solution: 'interface Producto {\n  nombre: string;\n  precio: number;\n}\n\nconst pan: Producto = { nombre: "Pan", precio: 1.5 };\nconsole.log(pan.nombre, pan.precio);',
            explanation: 'Al declarar el objeto con : Producto, el compilador comprueba que tenga todos los campos con el tipo correcto. Si faltara alguno, daría error.',
            tests: [{ expected: 'Pan 1.5\n' }]
          }
        ]
      },
      {
        id: 'ts-mod4-les2',
        title: 'Lo que una interface NO comprueba',
        icon: '🕳️',
        exercises: [
          {
            id: 'tse045', type: 'multiple-choice', xp: 20,
            question: 'Una interface con nombre y edad, y le creas un objeto con nombre, edad y un campo de más. ¿Qué pasa?',
            choices: [
              'Da error por el campo de más',
              'No da error: los campos de más se permiten',
              'Da error solo si el campo de más es del tipo equivocado',
              'Depende del compilador'
            ],
            correct: 1,
            explanation: 'TypeScript es estructural: le da igual que el objeto tenga más cosas. Solo comprueba que tenga los campos que la interface pide, y con el tipo correcto.'
          },
          {
            id: 'tse046', type: 'multiple-choice', xp: 20,
            question: '¿Y si le falta un campo?',
            choices: [
              'No da error',
              'Da error: la interfaz no se cumple',
              'Da error solo si el campo es de texto',
              'Se rellena solo con undefined'
            ],
            correct: 1,
            explanation: 'Ahí sí da error. La regla es simple: los campos de la interface tienen que estar todos; los de más sobran sin problema.'
          },
          {
            id: 'tse047', type: 'multiple-choice', xp: 20,
            question: 'Un campo de una interface puede ser opcional. ¿Cómo se marca?',
            choices: [
              'Con una interrogación detrás del nombre',
              'Con la palabra optional',
              'Con un asterisco',
              'No se puede'
            ],
            correct: 0,
            explanation: 'Con ? detrás del nombre: nombre?: string. El campo puede no estar, y entonces vale undefined.'
          },
          {
            id: 'tse048', type: 'fill-blank', xp: 20,
            question: 'Marca la edad como opcional para que pueda no estar:',
            code: 'interface Persona {\n  nombre: string;\n  edad___ number;\n}\n\nconst a: Persona = { nombre: "Ana" };\nconsole.log(a.nombre);',
            blanks: ['?'],
            options: ['?', '!', '*', 'opt'],
            correct: 0,
            explanation: 'La interrogación detrás del nombre lo hace opcional. Con ! se pediría que siempre esté, pero presente y no nulo.'
          },
          {
            id: 'tse049', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'interface Persona {\n  nombre: string;\n  edad?: number;\n}\n\nconst ana: Persona = { nombre: "Ana" };\nconsole.log(ana.nombre, ana.edad);',
            output: ['Ana undefined', 'Ana 0', 'error: falta la edad', 'Ana'],
            correctOutput: 0,
            explanation: 'Como edad es opcional y no está, vale undefined. No es 0: un campo opcional ausente no se rellena con el valor cero del tipo.'
          },
          {
            id: 'tse050', type: 'multiple-choice', xp: 20,
            question: '¿Qué significa readonly en un campo de una interface?',
            choices: [
              'Que no se puede cambiar después de crearlo',
              'Que solo se puede leer desde fuera',
              'Que es opcional',
              'Que es un número entero'
            ],
            correct: 0,
            explanation: 'Que el compilador no te deja reasignarlo. Sirve para datos que no cambian, como un identificador.'
          },
          {
            id: 'tse051', type: 'type-code', xp: 35,
            description: 'Declara una interface con un campo obligatorio y otro opcional, y crea un objeto que solo tenga el obligatorio.',
            starter: '// Un campo obligatorio y otro opcional que no está',
            solution: 'interface Persona {\n  nombre: string;\n  edad?: number;\n}\n\nconst ana: Persona = { nombre: "Ana" };\nconsole.log(ana.nombre, ana.edad);',
            explanation: 'Con ? el campo es opcional: el compilador acepta que no esté. Al leerlo da undefined, que es lo que se imprime.',
            tests: [{ expected: 'Ana undefined\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 5: UNIONES Y ALIAS
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod5',
    title: 'Uniones y Alias',
    subtitle: 'Un valor puede ser de varios tipos',
    icon: '🔀',
    color: '#0891B2',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'ts-mod5-les1',
        title: 'type y las uniones',
        icon: '🔗',
        exercises: [
          {
            id: 'tse052', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara un alias de tipo?',
            choices: [
              'type Estado = "pendiente" | "listo"',
              'interface Estado { pendiente | listo }',
              'var Estado = "pendiente"',
              'type Estado: "pendiente"'
            ],
            correct: 0,
            explanation: 'Con type, un igual y el tipo. El alias permite poner un nombre a un tipo y reutilizarlo sin repetirlo.'
          },
          {
            id: 'tse053', type: 'multiple-choice', xp: 20,
            question: '¿Qué significa "a" | "b"?',
            choices: [
              'Que el valor es un texto que puede ser "a" o "b", y nada más',
              'Que el valor puede ser dos textos a la vez',
              'Que el texto a es opcional',
              'Que hay dos tipos'
            ],
            correct: 0,
            explanation: 'Una unión: este valor O este otro. El | separa alternativas, como un "o". Es de las herramientas más útiles de TypeScript.'
          },
          {
            id: 'tse054', type: 'multiple-choice', xp: 20,
            question: 'Un alias con un solo tipo, ¿en qué se diferencia de una interface?',
            choices: [
              'type solo sirve para textos',
              'type sirve para cualquier tipo, interface solo para formas de objeto',
              'No hay diferencia',
              'interface es más rápido'
            ],
            correct: 1,
            explanation: 'type puede nombrar cualquier tipo, incluidas uniones y números literales. interface está pensado para describir la forma de un objeto.'
          },
          {
            id: 'tse055', type: 'fill-blank', xp: 20,
            question: 'Completa el símbolo de unión:',
            code: 'type Estado = "pendiente" ___ "listo";\n\nconst e: Estado = "listo";\nconsole.log(e);',
            blanks: ['|'],
            options: ['|', '&', 'o', '+'],
            correct: 0,
            explanation: 'La barra vertical | separa las alternativas de una unión. La Y & sería una intersección: tiene que cumplir las dos.'
          },
          {
            id: 'tse056', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'type Estado = "pendiente" | "listo";\n\nconst e: Estado = "listo";\nconsole.log(e);',
            output: ['listo', '1', 'error de tipos', 'pendiente'],
            correctOutput: 0,
            explanation: 'Imprime el texto tal cual. La unión no convierte nada: solo garantiza que el valor sea uno de los dos.'
          },
          {
            id: 'tse057', type: 'multiple-choice', xp: 20,
            question: 'Si declaras const e: Estado = "cancelado", ¿qué pasa?',
            choices: [
              'Imprime cancelado',
              'Error: cancelado no está en la unión',
              'Se convierte a pendiente',
              'Queda como any'
            ],
            correct: 1,
            explanation: 'Da error, porque "cancelado" no es ninguno de los dos valores permitidos. Eso es lo que impide escribir estados inventados.'
          },
          {
            id: 'tse058', type: 'type-code', xp: 35,
            description: 'Declara un alias Estado con tres valores posibles, usa uno e imprímelo.',
            starter: '// El alias con sus tres valores',
            solution: 'type Estado = "pendiente" | "en curso" | "listo";\n\nconst e: Estado = "en curso";\nconsole.log(e);',
            explanation: 'Con | se van encadenando alternativas. El compilador solo permitirá dar a la variable uno de esos tres valores.',
            tests: [{ expected: 'en curso\n' }]
          }
        ]
      },
      {
        id: 'ts-mod5-les2',
        title: 'Uniones con null y números',
        icon: '➕',
        exercises: [
          {
            id: 'tse059', type: 'multiple-choice', xp: 20,
            question: 'Una variable que puede ser un texto o nada, ¿cómo se escribe?',
            choices: [
              'string?',
              'string | null',
              'nullstring',
              'string and null'
            ],
            correct: 1,
            explanation: 'string | null. O también string | undefined, según de dónde venga. Con ? se escribiría string?, que es otra cosa.'
          },
          {
            id: 'tse060', type: 'multiple-choice', xp: 20,
            question: 'type Id = number | string, ¿qué permite?',
            choices: [
              'Un identificador que puede ser número o texto',
              'Un número que también es texto',
              'Dos variables a la vez',
              'Nada especial'
            ],
            correct: 0,
            explanation: 'Es un identificador con número o con texto. Muy útil para IDs que unas veces vienen de la base de datos y otras del usuario.'
          },
          {
            id: 'tse061', type: 'multiple-choice', xp: 20,
            question: 'type Resultado = { ok: true } | { ok: false }, ¿para qué sirve?',
            choices: [
              'Para un objeto que o bien tiene el resultado o bien tiene el error',
              'Para dos objetos a la vez',
              'Para tipar un número',
              'No se puede escribir'
            ],
            correct: 0,
            explanation: 'Es un patrón muy usado: un valor que lleva o el resultado o el error, nunca los dos. TypeScript te obliga a mirar cuál de los dos tienes.'
          },
          {
            id: 'tse062', type: 'fill-blank', xp: 20,
            question: 'Completa la unión para que admita texto o nulo:',
            code: 'function buscar(): string ___ null {\n  return null;\n}\n\nconst r = buscar();\nconsole.log(r);',
            blanks: ['|'],
            options: ['|', '&', '?', '+'],
            correct: 0,
            explanation: 'La barra vertical declara las dos alternativas. Con ? sería un parámetro opcional, que es otra cosa.'
          },
          {
            id: 'tse063', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'function buscar(): string | null {\n  return null;\n}\n\nconsole.log(buscar());',
            output: ['nada', 'null', 'undefined', 'error de tipos'],
            correctOutput: 1,
            explanation: 'Devuelve null y console.log lo escribe como null. Que el tipo admita null no lo convierte: solo permite que exista.'
          },
          {
            id: 'tse064', type: 'type-code', xp: 35,
            description: 'Declara un alias Id que admita número o texto, y muestra uno de cada.',
            starter: '// Un alias con dos tipos admitidos',
            solution: 'type Id = number | string;\n\nconst a: Id = 42;\nconst b: Id = "abc";\nconsole.log(a, b);',
            explanation: 'La misma variable admitirá un número o un texto, según el caso. Aquí hay dos variables distintas, cada una con su valor.',
            tests: [{ expected: '42 abc\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 6: FUNCIONES TIPADAS
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod6',
    title: 'Funciones',
    subtitle: 'Parámetros y retornos con tipo',
    icon: '⚙️',
    color: '#EA580C',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'ts-mod6-les1',
        title: 'Tipar los parámetros',
        icon: '🔧',
        exercises: [
          {
            id: 'tse065', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se anota el tipo de un parámetro?',
            choices: [
              'function f(edad: number) { }',
              'function f(number edad) { }',
              'function f(edad = number) { }',
              'function f(: number edad) { }'
            ],
            correct: 0,
            explanation: 'Después del nombre del parámetro y con dos puntos, igual que una variable. El tipo de retorno va fuera del paréntesis.'
          },
          {
            id: 'tse066', type: 'multiple-choice', xp: 20,
            question: 'Una función sin tipo de retorno anotado, ¿qué devuelve?',
            choices: [
              'Nada: void',
              'Lo que quiera',
              'number',
              'Da error al declararla'
            ],
            correct: 0,
            explanation: 'En TypeScript void significa "no devuelve nada". Si la función devuelve algo y no lo anotas, el compilador se queja.'
          },
          {
            id: 'tse067', type: 'multiple-choice', xp: 20,
            question: '¿Qué impide tipar los parámetros?',
            choices: [
              'Que se avise antes de llamar con un valor del tipo que no es',
              'Que la función sea más lenta',
              'Que se pueda reutilizar',
              'Nada, es solo decoración'
            ],
            correct: 0,
            explanation: 'Si declaras function sumar(a: number, b: number), llamar a sumar("x", 2) da error antes de ejecutar. Ese es el valor.'
          },
          {
            id: 'tse068', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de retorno de la función:',
            code: 'function duplicar(n: number): ___ {\n  return n * 2;\n}\n\nconsole.log(duplicar(5));',
            blanks: ['number'],
            options: ['number', 'void', 'int', 'double'],
            correct: 0,
            explanation: 'El tipo de retorno va detrás del paréntesis, con dos puntos. Si pones void, el compilador avisaría de que devolver un valor no está permitido.'
          },
          {
            id: 'tse069', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'function duplicar(n: number): number {\n  return n * 2;\n}\n\nconsole.log(duplicar(5));',
            output: ['10', '5', 'n2', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Devuelve 10. El tipo de retorno también se comprueba: si la función promete number y devuelve un texto, daría error.'
          },
          {
            id: 'tse070', type: 'multiple-choice', xp: 20,
            question: 'Una función que promete number pero no tiene ningún return, ¿qué pasa?',
            choices: [
              'Devuelve undefined sin avisar',
              'Da error al compilar',
              'Devuelve 0',
              'Da error al ejecutar'
            ],
            correct: 1,
            explanation: 'Da error al compilar. En JavaScript te devolvería undefined y lo descubrirías tarde; TypeScript te lo dice en el momento.'
          },
          {
            id: 'tse071', type: 'type-code', xp: 35,
            description: 'Crea una función que reciba un número y devuelva su doble.',
            starter: '// La función con el parámetro y el retorno tipados',
            solution: 'function duplicar(n: number): number {\n  return n * 2;\n}\n\nconsole.log(duplicar(5));',
            explanation: 'Se anota el parámetro y el retorno. Con las dos anotaciones, una llamada con un texto daría error de tipos.',
            tests: [{ expected: '10\n' }]
          }
        ]
      },
      {
        id: 'ts-mod6-les2',
        title: 'Funciones flecha',
        icon: '🏹',
        exercises: [
          {
            id: 'tse072', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se anota una función flecha?',
            choices: [
              'const f = (n: number): number => n * 2;',
              'const f = (number n): number => n * 2;',
              'const f = (n) -> number => n * 2;',
              'No se puede'
            ],
            correct: 0,
            explanation: 'Igual que en una función normal: el tipo del parámetro detrás del nombre y el de retorno detrás del paréntesis.'
          },
          {
            id: 'tse073', type: 'multiple-choice', xp: 20,
            question: 'Una flecha sin tipo de retorno anotado, ¿está bien?',
            choices: [
              'Sí, se deduce',
              'No, es obligatorio',
              'Solo si no tiene parámetros',
              'Solo en TypeScript 4'
            ],
            correct: 0,
            explanation: 'Sí: se deduce igual que en una variable. La anotación del retorno es opcional si se puede deducir sin ambigüedad.'
          },
          {
            id: 'tse074', type: 'multiple-choice', xp: 20,
            question: 'type Res = (n: number) => string, ¿qué es?',
            choices: [
              'Una función que recibe un número y devuelve un texto',
              'Un objeto con dos campos',
              'Una unión de tipos',
              'Un error'
            ],
            correct: 0,
            explanation: 'Un tipo de función: indica qué recibe y qué devuelve. Sirve para tipar parámetros que son funciones.'
          },
          {
            id: 'tse075', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo del parámetro de la flecha:',
            code: 'const doble = (n: ___): number => n * 2;\n\nconsole.log(doble(4));',
            blanks: ['number'],
            options: ['number', 'num', 'int', '*'],
            correct: 0,
            explanation: 'El tipo va detrás del nombre del parámetro. La flecha en sí es el =>, que no lleva tipo.'
          },
          {
            id: 'tse076', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const doble = (n: number): number => n * 2;\n\nconsole.log(doble(4));',
            output: ['8', '4', 'error de tipos', 'n2'],
            correctOutput: 0,
            explanation: '4 por 2 son 8. Las anotaciones desaparecen al compilar, así que en JavaScript queda simplemente (n) => n * 2.'
          },
          {
            id: 'tse077', type: 'type-code', xp: 35,
            description: 'Crea una función flecha que reciba un texto y devuelva su longitud.',
            starter: '// La flecha con el parámetro y el retorno tipados',
            solution: 'const longitud = (s: string): number => s.length;\n\nconsole.log(longitud("hola"));',
            explanation: 'El retorno es number porque length da un número. Si el cuerpo devolviera un texto, el compilador avisaría.',
            tests: [{ expected: '4\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 7: CLASES
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod7',
    title: 'Clases',
    subtitle: 'Datos y comportamiento juntos',
    icon: '🏛️',
    color: '#BE185D',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #831843 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'ts-mod7-les1',
        title: 'Clases con propiedades tipadas',
        icon: '🏠',
        exercises: [
          {
            id: 'tse078', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara una propiedad con tipo en una clase?',
            choices: [
              'nombre: string;',
              'string nombre;',
              'nombre = string;',
              'var nombre: string;'
            ],
            correct: 0,
            explanation: 'Con dos puntos, como una variable. El private y el public delante son opcionales.'
          },
          {
            id: 'tse079', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace private delante de una propiedad?',
            choices: [
              'Impide modificarla desde fuera de la clase',
              'La hace opcional',
              'La convierte en texto',
              'Oculta el nombre al compilar'
            ],
            correct: 0,
            explanation: 'Marca que solo se puede tocar desde dentro. Es una ayuda para el compilador y para quien lee: no es seguridad de verdad, porque el atributo sigue ahí al final.'
          },
          {
            id: 'tse080', type: 'multiple-choice', xp: 20,
            question: 'Una propiedad tipada desaparece al compilar. ¿Cierto?',
            choices: [
              'Sí, igual que las interfaces',
              'No, se convierte en un atributo más',
              'Solo las privadas',
              'Solo si no tienen valor inicial'
            ],
            correct: 0,
            explanation: 'Sí, la anotación desaparece. Lo que queda es el atributo normal de JavaScript. Por eso private no protege nada en tiempo de ejecución.'
          },
          {
            id: 'tse081', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de la propiedad:',
            code: 'class Punto {\n  x: ___ = 0;\n  y: number = 0;\n}\n\nconst p = new Punto();\nconsole.log(p.x);',
            blanks: ['number'],
            options: ['number', 'num', 'int', 'float'],
            correct: 0,
            explanation: 'Cada propiedad lleva su tipo detrás del nombre. Si le pones un texto a una de números, el compilador avisa.'
          },
          {
            id: 'tse082', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'class Punto {\n  x: number = 0;\n  y: number = 0;\n}\n\nconst p = new Punto();\nconsole.log(p.x, p.y);',
            output: ['0 0', 'undefined undefined', 'error de tipos', 'x y'],
            correctOutput: 0,
            explanation: 'Las propiedades con valor inicial valen 0. new crea un objeto con esos valores, y console.log los lee con un espacio entre ellos.'
          },
          {
            id: 'tse083', type: 'multiple-choice', xp: 20,
            question: 'Un constructor en TypeScript, ¿qué es?',
            choices: [
              'Un método especial que se llama al crear el objeto con new',
              'Una función normal',
              'Una interface',
              'Un tipo de dato'
            ],
            correct: 0,
            explanation: 'Es un método con el nombre reservado constructor. Se ejecuta automáticamente al hacer new, y es donde se suelen preparar los datos.'
          },
          {
            id: 'tse084', type: 'type-code', xp: 40,
            description: 'Crea una clase Rectángulo con base y alto, y un constructor que los reciba.',
            starter: '// La clase con sus dos propiedades y el constructor',
            solution: 'class Rectangulo {\n  base: number;\n  alto: number;\n\n  constructor(base: number, alto: number) {\n    this.base = base;\n    this.alto = alto;\n  }\n}\n\nconst r = new Rectangulo(3, 4);\nconsole.log(r.base, r.alto);',
            explanation: 'Las propiedades se declaran con su tipo y el constructor las prepara con this. Con esto, new siempre deja el objeto con los datos puestos.',
            tests: [{ expected: '3 4\n' }]
          }
        ]
      },
      {
        id: 'ts-mod7-les2',
        title: 'Métodos',
        icon: '🎯',
        exercises: [
          {
            id: 'tse085', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se declara un método con tipo de retorno?',
            choices: [
              'area(): number { return this.base * this.alto; }',
              'number area() { }',
              'area: number { }',
              'function area(): number { }'
            ],
            correct: 0,
            explanation: 'Con dos puntos detrás del paréntesis de los parámetros, como en una función normal.'
          },
          {
            id: 'tse086', type: 'multiple-choice', xp: 20,
            question: 'Dentro de un método, ¿a qué se refiere this?',
            choices: [
              'Al objeto que está ejecutando el método',
              'A la clase completa',
              'Al archivo',
              'A la función global'
            ],
            correct: 0,
            explanation: 'Al objeto. Por eso this.base lee la base de ESTE rectángulo, y con dos objetos distintos cada uno tiene la suya.'
          },
          {
            id: 'tse087', type: 'multiple-choice', xp: 20,
            question: 'Un método que no devuelve nada, ¿cómo se anota?',
            choices: ['mostrar(): void { }', 'mostrar(): nada { }', 'mostrar() { }', 'mostrar(): any { }'],
            correct: 0,
            explanation: 'Con void, que significa "no devuelve nada". Es una manera de dejar dicho que el método existe para hacer algo, no para dar un valor.'
          },
          {
            id: 'tse088', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de retorno del método:',
            code: 'class Contador {\n  n: number = 0;\n  valor(): ___ {\n    return this.n;\n  }\n}\n\nconst c = new Contador();\nconsole.log(c.valor());',
            blanks: ['number'],
            options: ['number', 'void', 'int', 'any'],
            correct: 0,
            explanation: 'El método devuelve this.n, que es number. Si anotaras void, el compilador diría que void no devuelve valores.'
          },
          {
            id: 'tse089', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'class Rectangulo {\n  base: number;\n  alto: number;\n\n  constructor(base: number, alto: number) {\n    this.base = base;\n    this.alto = alto;\n  }\n\n  area(): number {\n    return this.base * this.alto;\n  }\n}\n\nconst r = new Rectangulo(3, 4);\nconsole.log(r.area());',
            output: ['12', '7', '3 4', 'error de tipos'],
            correctOutput: 0,
            explanation: 'El método devuelve 3 por 4, que son 12. Fíjate en que el this es lo que hace que valga para cualquier rectángulo.'
          },
          {
            id: 'tse090', type: 'type-code', xp: 45,
            description: 'Crea una clase Contador que vaya sumando, y úsala dos veces para ver el total.',
            starter: '// La clase con un método que suma',
            solution: 'class Contador {\n  n: number = 0;\n\n  suma(): void {\n    this.n = this.n + 1;\n  }\n\n  valor(): number {\n    return this.n;\n  }\n}\n\nconst c = new Contador();\nc.suma();\nc.suma();\nconsole.log(c.valor());',
            explanation: 'El método suma usa this.n para leerse y escribirse. El método valor devuelve el estado, y void marca que sumar no devuelve nada.',
            tests: [{ expected: '2\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 8: ERRORES Y ENUM
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod8',
    title: 'Errores y Enum',
    subtitle: 'Enumeraciones y tipos de retorno',
    icon: '🧾',
    color: '#B45309',
    gradient: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'ts-mod8-les1',
        title: 'Enumeraciones',
        icon: '🎨',
        exercises: [
          {
            id: 'tse091', type: 'multiple-choice', xp: 20,
            question: '¿Qué es un enum?',
            choices: [
              'Un tipo con una lista de valores con nombre',
              'Una función que cuenta',
              'Un tipo de número',
              'Una forma de interfaz'
            ],
            correct: 0,
            explanation: 'Una lista de valores con nombre. En vez de escribir 0, 1, 2 por todo el código, escribes Estado.Pendiente y se lee solo.'
          },
          {
            id: 'tse092', type: 'multiple-choice', xp: 20,
            question: '¿Qué problema resuelve un enum frente a usar números?',
            choices: [
              'Que con un número no sabes qué significa el 0, y con el enum sí',
              'Que los números no sirven',
              'Que el enum ocupa menos',
              'Que el enum es más rápido'
            ],
            correct: 0,
            explanation: 'Con un número suelto, el 0 no dice si es "pendiente" o "cerrado". Con Estado.Pendiente no hay duda, y si te equivocas al escribirlo, da error.'
          },
          {
            id: 'tse093', type: 'multiple-choice', xp: 20,
            question: 'Un enum existe al compilar?',
            choices: [
              'Sí, es un objeto que se genera',
              'No, desaparece',
              'Solo si tiene valores',
              'Depende'
            ],
            correct: 0,
            explanation: 'Sí: el compilador crea un objeto. Por eso los miembros tienen número detrás y Estado[0] devuelve el primer nombre.'
          },
          {
            id: 'tse094', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que declara un enum:',
            code: '___ Estado {\n  Pendiente,\n  Listo\n}\n\nconsole.log(Estado.Listo);',
            blanks: ['enum'],
            options: ['enum', 'type', 'interface', 'const'],
            correct: 0,
            explanation: 'Con enum. type solo sirve para tipos, no para valores; const declararía una variable normal.'
          },
          {
            id: 'tse095', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'enum Estado {\n  Pendiente,\n  Listo\n}\n\nconsole.log(Estado.Pendiente, Estado.Listo);',
            output: ['0 1', 'Pendiente Listo', '1 2', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Cada miembro empieza en 0 y sube de uno en uno. Estado.Pendiente vale 0 y Estado.Listo vale 1.'
          },
          {
            id: 'tse096', type: 'multiple-choice', xp: 20,
            question: 'Si en un enum escribes Listo = 5, ¿qué vale Estado.Listo?',
            choices: ['1', '5', '0', 'Da error'],
            correct: 1,
            explanation: '5, y los que vengan después seguirán desde 6. Los números se pueden poner a mano cuando hace falta.'
          },
          {
            id: 'tse097', type: 'type-code', xp: 35,
            description: 'Declara un enum de tres estados e imprime el segundo.',
            starter: '// El enum con sus tres estados',
            solution: 'enum Estado {\n  Pendiente,\n  EnCurso,\n  Listo\n}\n\nconsole.log(Estado.EnCurso);',
            explanation: 'Los miembros empiezan en 0 y suben solos. Estado.EnCurso vale 1, y se lee mucho mejor que un 1 suelto.',
            tests: [{ expected: '1\n' }]
          }
        ]
      },
      {
        id: 'ts-mod8-les2',
        title: 'tipos que dependen del resultado',
        icon: '⚖️',
        exercises: [
          {
            id: 'tse098', type: 'multiple-choice', xp: 20,
            question: 'type Resultado = { ok: boolean; valor?: number }, ¿qué expresa?',
            choices: [
              'Un objeto que siempre tiene ok y a veces un valor',
              'Un objeto con dos números',
              'Una función',
              'Una unión'
            ],
            correct: 0,
            explanation: 'ok siempre está, y valor solo cuando hay resultado. Es la forma de tipar "o bien esto o bien aquello" sin usar excepciones.'
          },
          {
            id: 'tse099', type: 'multiple-choice', xp: 20,
            question: '¿Qué devuelve una función que no declara tipo de retorno y no hace return?',
            choices: ['undefined', '0', 'Da error', 'null'],
            correct: 0,
            explanation: 'undefined, y es lo que sale en JavaScript. void es la manera de decirlo, no cambia lo que pasa en ejecución.'
          },
          {
            id: 'tse100', type: 'multiple-choice', xp: 20,
            question: 'void en el tipo de retorno significa…',
            choices: [
              'Que la función no devuelve nada útil',
              'Que devuelve el número void',
              'Que devuelve un texto vacío',
              'Que es un error'
            ],
            correct: 0,
            explanation: 'Que la función existe para hacer algo, no para devolver un valor. Sirve para documentar la intención.'
          },
          {
            id: 'tse101', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de una función que no devuelve nada:',
            code: 'function mostrar(s: string): ___ {\n  console.log(s);\n}\n\nmostrar("hola");',
            blanks: ['void'],
            options: ['void', 'nothing', 'nada', 'none'],
            correct: 0,
            explanation: 'void es la palabra que usa TypeScript para decir "no devuelve nada". En JavaScript sería undefined.'
          },
          {
            id: 'tse102', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'function mostrar(s: string): void {\n  console.log(s);\n}\n\nmostrar("hola");',
            output: ['hola', 'undefined', 'void', 'error de tipos'],
            correctOutput: 0,
            explanation: 'La función imprime hola. void solo dice que ella no devuelve nada; no cambia lo que hay dentro.'
          },
          {
            id: 'tse103', type: 'type-code', xp: 35,
            description: 'Crea una función que imprima un texto y devuelva void, y llámala.',
            starter: '// La función que imprime y no devuelve nada',
            solution: 'function saludar(nombre: string): void {\n  console.log("Hola, " + nombre);\n}\n\nsaludar("Ana");',
            explanation: 'void marca que la función no devuelve nada. El + concatena el texto con el nombre, y ambos son string.',
            tests: [{ expected: 'Hola, Ana\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 9: ESTRECHAR TIPOS
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod9',
    title: 'Estrechar Tipos',
    subtitle: 'Saber qué hay dentro de una unión',
    icon: '🔬',
    color: '#4F46E5',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'ts-mod9-les1',
        title: 'typeof para distinguir',
        icon: '🔎',
        exercises: [
          {
            id: 'tse104', type: 'multiple-choice', xp: 20,
            question: 'Con una variable string | number, ¿qué hay que hacer antes de llamar a un método de texto?',
            choices: [
              'Comprobar con typeof qué es',
              'Nada, se puede hacer directamente',
              'Convertirlo con Number',
              'Renombrar la variable'
            ],
            correct: 0,
            explanation: 'Antes hay que narrowing o estrechar: dentro de un if con typeof, TypeScript sabe que es un string y permite los métodos de texto.'
          },
          {
            id: 'tse105', type: 'multiple-choice', xp: 20,
            question: 'typeof "¿qué devuelve"?',
            choices: ['text', 'string', 'object', 'tipo'],
            correct: 1,
            explanation: 'El nombre del tipo: typeof 5 es "number" y typeof "hola" es "string". Se escribe en minúsculas y entre comillas.'
          },
          {
            id: 'tse106', type: 'multiple-choice', xp: 20,
            question: '¿Qué es el narrowing?',
            choices: [
              'Que el compilador sepa que, en ese punto, la variable es de un tipo concreto',
              'Hacer la variable más pequeña',
              'Convertir tipos',
              'Un tipo especial'
            ],
            correct: 0,
            explanation: 'Es que dentro de un if o un bloque, si has comprobado el tipo, el compilador lo tiene en cuenta y no se queja al usar ese tipo.'
          },
          {
            id: 'tse107', type: 'fill-blank', xp: 20,
            question: 'Completa la comprobación de tipo:',
            code: 'function largo(v: string | number): number {\n  if (typeof v === "___") {\n    return v.length;\n  }\n  return 0;\n}\n\nconsole.log(largo("hola"), largo(3));',
            blanks: ['string'],
            options: ['string', 'texto', 'str', 'String'],
            correct: 0,
            explanation: 'Dentro del if, v es string y por eso se puede usar v.length. Fuera del bloque vuelve a ser string | number.'
          },
          {
            id: 'tse108', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'function largo(v: string | number): number {\n  if (typeof v === "string") {\n    return v.length;\n  }\n  return 0;\n}\n\nconsole.log(largo("hola"), largo(3));',
            output: ['4 0', 'hola 3', '0 0', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Con "hola" devuelve 4 (las cuatro letras) y con un número devuelve 0 porque no es un texto.'
          },
          {
            id: 'tse109', type: 'type-code', xp: 40,
            description: 'Crea una función que reciba un texto o un número y diga de qué tipo es cada uno.',
            starter: '// La función con la unión y el typeof',
            solution: 'function describir(v: string | number): string {\n  if (typeof v === "string") {\n    return "texto";\n  }\n  return "numero";\n}\n\nconsole.log(describir("hola"), describir(3));',
            explanation: 'La unión permite las dos. El typeof estrecha el tipo dentro de cada rama, y así el compilador sabe qué devuelve cada una.',
            tests: [{ expected: 'texto numero\n' }]
          }
        ]
      },
      {
        id: 'ts-mod9-les2',
        title: 'La aserción as',
        icon: '🎚️',
        exercises: [
          {
            id: 'tse110', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace "hola" as string?',
            choices: [
              'Le dice al compilador "confía en mí, esto es un texto"',
              'Convierte el valor',
              'Comprueba que sea un texto',
              'Nada especial'
            ],
            correct: 0,
            explanation: 'Es una aserción: no comprueba nada, solo le dice al compilador qué es. Si te equivocas, el error aparecerá más tarde.'
          },
          {
            id: 'tse111', type: 'multiple-choice', xp: 20,
            question: '¿Cuándo conviene usar as?',
            choices: [
              'Cuando sabes con certeza el tipo y el compilador no puede deducirlo',
              'Para convertir tipos automáticamente',
              'Para comprobar errores',
              'Siempre, es más seguro'
            ],
            correct: 0,
            explanation: 'Cuando hay algo que el compilador no puede ver, como un valor que viene de una API externa. Es un salto de fe, así que conviene usarlo poco.'
          },
          {
            id: 'tse112', type: 'multiple-choice', xp: 20,
            question: 'typeof (v as string).length, ¿funciona?',
            choices: [
              'Sí: el as le dice que es un texto y length vale',
              'No, da error',
              'Devuelve undefined',
              'Imprime el tipo'
            ],
            correct: 0,
            explanation: 'El as le da el tipo al compilador, y a partir de ahí se puede usar como un texto normal. Mejor que repetir el typeof.'
          },
          {
            id: 'tse113', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra de la aserción:',
            code: 'const v: unknown = "hola";\nconst s = v as ___;\nconsole.log(s.length);',
            blanks: ['string'],
            options: ['string', 'text', 'str', 'any'],
            correct: 0,
            explanation: 'Con as string le dices al compilador que el unknown es en realidad un texto. A partir de ahí puedes usar sus métodos.'
          },
          {
            id: 'tse114', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'const v: unknown = "hola";\nconst s = v as string;\nconsole.log(s.length);',
            output: ['4', 'hola', 'unknown', 'error de tipos'],
            correctOutput: 0,
            explanation: 'El as le dice al compilador que el valor es un texto, y entonces s.length vale 4.'
          },
          {
            id: 'tse115', type: 'type-code', xp: 35,
            description: 'Usa una aserción para tratar un unknown como texto y sacar su longitud.',
            starter: '// El unknown convertido con as',
            solution: 'const valor: unknown = "hola";\nconst texto = valor as string;\nconsole.log(texto.length);',
            explanation: 'Con as le dices al compilador qué es. Es un salto de fe: si el valor fuera un número, el error saldría más tarde.',
            tests: [{ expected: '4\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // TS MÓDULO 10: CÓDIGO REAL
  // ═══════════════════════════════════════════════
  {
    id: 'ts-mod10',
    title: 'Código Real',
    subtitle: 'Todo junto, como en un proyecto',
    icon: '🏗️',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'ts-mod10-les1',
        title: 'Combinar todo',
        icon: '🧱',
        exercises: [
          {
            id: 'tse116', type: 'multiple-choice', xp: 20,
            question: '¿Por qué tipar los datos de entrada de una función?',
            choices: [
              'Para documentar qué acepta y detectar llamadas equivocadas',
              'Para que la función sea más rápida',
              'Porque es obligatorio',
              'Para ordenar el código'
            ],
            correct: 0,
            explanation: 'Es la primera barrera: si alguien llama a tu función con un texto donde debe ir un número, lo descubre al compilar y no al fallar.'
          },
          {
            id: 'tse117', type: 'multiple-choice', xp: 20,
            question: '¿Qué es lo mejor de tener una interface para un objeto que pasa por varias funciones?',
            choices: [
              'Que todos usan la misma forma, y si cambias algo el compilador avisa',
              'Que se ejecuta más rápido',
              'Que ocupa menos',
              'Que no hace falta revisar el código'
            ],
            correct: 0,
            explanation: 'Es el contrato compartido. Si añades un campo a la interface, el compilador te dirá en qué funciones hay que actualizarlo.'
          },
          {
            id: 'tse118', type: 'multiple-choice', xp: 20,
            question: 'Una función que procesa una lista, ¿cómo la tiparías?',
            choices: ['numeros: number[]', 'numeros: [number]', 'numeros: number', 'numeros: lista'],
            correct: 0,
            explanation: 'number[] es una lista de números. Si le pasaras una lista de textos, el compilador te avisaría antes de ejecutar.'
          },
          {
            id: 'tse119', type: 'fill-blank', xp: 20,
            question: 'Completa el tipo de un parámetro que es una lista de textos:',
            code: 'function unir(nombres: ___): string {\n  return nombres.join(", ");\n}\n\nconsole.log(unir(["Ana", "Luis"]));',
            blanks: ['string[]'],
            options: ['string[]', 'strings', '[string]', 'lista'],
            correct: 0,
            explanation: 'string[]: el tipo del elemento y luego los corchetes que dicen lista. Así el join y el resto de métodos de texto están disponibles.'
          },
          {
            id: 'tse120', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'function unir(nombres: string[]): string {\n  return nombres.join(", ");\n}\n\nconsole.log(unir(["Ana", "Luis", "Marta"]));',
            output: ['Ana, Luis, Marta', 'AnaLuisMarta', '3', 'error de tipos'],
            correctOutput: 0,
            explanation: 'join junta los elementos con el separador que le pases, en este caso una coma y un espacio.'
          },
          {
            id: 'tse121', type: 'type-code', xp: 40,
            description: 'Crea una función que reciba una lista de números y devuelva su suma.',
            starter: '// La función que suma una lista',
            solution: 'function sumar(nums: number[]): number {\n  let total = 0;\n  for (const n of nums) {\n    total = total + n;\n  }\n  return total;\n}\n\nconsole.log(sumar([1, 2, 3]));',
            explanation: 'El parámetro es una lista de números y el retorno un número. Si le pasaras una lista de textos, el compilador avisaría.',
            tests: [{ expected: '6\n' }]
          }
        ]
      },
      {
        id: 'ts-mod10-les2',
        title: 'Un proyecto pequeño',
        icon: '📦',
        exercises: [
          {
            id: 'tse122', type: 'multiple-choice', xp: 20,
            question: 'Una clase Inventario con una lista de productos, ¿qué tipo tendría la propiedad?',
            choices: ['Producto[]', 'Producto', 'lista', 'array'],
            correct: 0,
            explanation: 'Producto[] es una lista de productos. El compilador te avisará si intentas meter algo que no sea un Producto.'
          },
          {
            id: 'tse123', type: 'multiple-choice', xp: 20,
            question: '¿Qué se ve mejor al leer un código con tipos?',
            choices: [
              'Qué espera cada función sin tener que buscarlo',
              'Nada especial',
              'Que se ejecuta más rápido',
              'Que ocupa menos'
            ],
            correct: 0,
            explanation: 'La anotación es documentación que no se queda obsoleta: si la función cambia, la anotación cambia con ella o da error.'
          },
          {
            id: 'tse124', type: 'multiple-choice', xp: 20,
            question: 'Un método que devuelve un Producto de una lista, ¿qué debe devolver si no lo encuentra?',
            choices: [
              'Debe indicarlo en el tipo, por ejemplo "| undefined"',
              'Debe devolver null siempre',
              'Debe devolver un Producto vacío',
              'Da igual'
            ],
            correct: 0,
            explanation: 'Con Producto | undefined el compilador te obliga a comprobar si lo encontró. Si no lo dices, quien llame recibiría undefined sin saberlo.'
          },
          {
            id: 'tse125', type: 'fill-blank', xp: 25,
            question: 'Completa el tipo de la propiedad de la clase:',
            code: 'class Inventario {\n  productos: ___ = [];\n  total(): number {\n    return this.productos.length;\n  }\n}\n\nconst inv = new Inventario();\nconsole.log(inv.total());',
            blanks: ['Producto[]'],
            options: ['Producto[]', 'Producto', 'lista', '[]Producto'],
            correct: 0,
            explanation: 'Producto[] es una lista de productos. Al inicializarla con [] se cumple: es una lista vacía de Producto.'
          },
          {
            id: 'tse126', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'class Inventario {\n  productos: string[] = [];\n\n  anadir(p: string): void {\n    this.productos.push(p);\n  }\n\n  total(): number {\n    return this.productos.length;\n  }\n}\n\nconst inv = new Inventario();\ninv.anadir("Pan");\ninv.anadir("Leche");\nconsole.log(inv.total());',
            output: ['2', 'Pan Leche', '0', 'error de tipos'],
            correctOutput: 0,
            explanation: 'Se han añadido dos productos, así que total devuelve 2. El método anadir es void porque no devuelve nada: solo prepara.'
          },
          {
            id: 'tse127', type: 'type-code', xp: 50,
            description: 'Crea una clase Inventario con una lista, un método para añadir y otro para contar.',
            starter: '// La clase con su lista y sus dos métodos',
            solution: 'class Inventario {\n  productos: string[] = [];\n\n  anadir(p: string): void {\n    this.productos.push(p);\n  }\n\n  total(): number {\n    return this.productos.length;\n  }\n}\n\nconst inv = new Inventario();\ninv.anadir("Pan");\ninv.anadir("Leche");\nconsole.log(inv.total());',
            explanation: 'La propiedad es una lista de textos y el método anadir es void porque no devuelve nada. La clase guarda datos y comportamiento juntos.',
            tests: [{ expected: '2\n' }]
          }
        ]
      }
    ]
  }
];