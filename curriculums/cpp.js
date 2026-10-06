// C++ Curriculum — Potencia y control
//
// Los ejercicios se ejecutan con cppengine.js, un intérprete propio del
// subconjunto que se enseña aquí. El alumno ve la salida real de su programa,
// así que los type-code se validan de verdad.
//
// Convenciones del temario:
//   · Los(type-code) siempre traen int main() completo, porque es como se
//     escribe C++ de verdad.
//   · predict-output usa el intérprete para calcular la respuesta, así que la
//     opción correcta nunca puede quedar desfasada.
//   · Nada que el motor no soporte: ni plantillas, ni herencia, ni
//     polimorfismo. Se explican en los últimos módulos como concepto.

window.CPP_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // C++ MÓDULO 1: TU PRIMER PROGRAMA
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod1',
    title: 'Tu Primer Programa',
    subtitle: 'main, el include y el cout',
    icon: '⚙️',
    color: '#659AD2',
    gradient: 'linear-gradient(135deg, #659AD2 0%, #004482 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'cpp-mod1-les1',
        title: 'La estructura de C++',
        icon: '🏗️',
        exercises: [
          {
            id: 'cppe001', type: 'multiple-choice', xp: 10,
            question: '¿Por dónde empieza siempre un programa C++?',
            choices: ['start()', 'int main()', 'run()', 'init()'],
            correct: 1,
            explanation: 'main es el punto de entrada. El sistema busca esa función concreta y ejecuta lo que hay dentro.'
          },
          {
            id: 'cppe002', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve la línea #include <iostream>?',
            choices: [
              'Para poner el código en internet',
              'Para traer lo necesario para escribir con cout',
              'Para declarar el main',
              'Para guardar el programa en un fichero'
            ],
            correct: 1,
            explanation: 'iostream es la biblioteca de entrada y salida. Sin ella, cout no existiría. Está en la biblioteca estándar.'
          },
          {
            id: 'cppe003', type: 'fill-blank', xp: 20,
            question: 'Completa la línea que permite escribir en pantalla:',
            code: '___ << "Hola" << endl;',
            blanks: ['cout'],
            options: ['cout', 'print', 'echo', 'write'],
            correct: 0,
            explanation: 'cout es la salida estándar. Los dos ángulos << van pegados a él y mandan hacia la salida.'
          },
          {
            id: 'cppe004', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este programa?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hola, C++!" << endl;\n    return 0;\n}',
            output: ['Hola, C++!', ' nada', 'error de compilación', 'Hola'],
            correctOutput: 0,
            explanation: 'cout entre ángulos escribe el texto tal cual, y endl salta de línea. Las comillas son obligatorias en los textos.'
          },
          {
            id: 'cppe005', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace endl?',
            choices: [
              'Escribe la palabra "endl"',
              'Salta de línea',
              'Borra la pantalla',
              'Ende el programa'
            ],
            correct: 1,
            explanation: 'endl viene de "end line". También vacía el búfer de salida, pero lo que se ve es el salto de línea.'
          },
          {
            id: 'cppe006', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre cout y return?',
            choices: [
              'cout escribe, return termina la función',
              'Son lo mismo',
              'cout termina, return escribe',
              'return escribe, cout no existe'
            ],
            correct: 0,
            explanation: 'cout saca texto por pantalla. return entrega un valor y sale de la función. En main devuelve 0 para decir que todo fue bien.'
          },
          {
            id: 'cppe007', type: 'type-code', xp: 30,
            description: 'Escribe un programa completo que imprima "Hola, C++!" y en la línea siguiente "Me alegro de verte".',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu código aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hola, C++!" << endl;\n    cout << "Me alegro de verte" << endl;\n    return 0;\n}',
            explanation: 'int main() es el punto de entrada. Cada cout escribe una línea, y return 0 cierra el programa diciendo que no hubo errores.',
            tests: [{ expected: 'Hola, C++!\nMe alegro de verte\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod1-les2',
        title: 'Comentarios y formato',
        icon: '📝',
        exercises: [
          {
            id: 'cppe008', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un comentario de una línea en C++?',
            choices: ['// esto', '# esto', '<!-- esto -->', 'esto //'],
            correct: 0,
            explanation: 'Doble barra para una línea y /* ... */ para varias. Los comentarios no se ejecutan y ocupan un poco de espacio.'
          },
          {
            id: 'cppe009', type: 'fill-blank', xp: 20,
            question: 'Escribe la salida de 42 con su salto de línea:',
            code: 'cout << ___ << endl;',
            blanks: ['42'],
            options: ['42', '"42"', "'42'", 'int'],
            correct: 0,
            explanation: 'Un número va sin comillas. Las comillas dobles son solo para los textos: cout << "42" imprimiría el texto, no el número.'
          },
          {
            id: 'cppe010', type: 'multiple-choice', xp: 20,
            question: 'cout << "Total: " << 1 + 2; ¿qué imprime?',
            choices: ['Total: 3', 'Total: 12', '3', 'error'],
            correct: 0,
            explanation: 'El + tiene prioridad: primero se calcula 1 + 2 = 3, y luego se escribe "Total: " seguido de ese 3.'
          },
          {
            id: 'cppe011', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "a" << endl << "b" << endl;\n    cout << "sin salto";\n    return 0;\n}',
            output: ['a\nb\nsin salto', 'a\nb\n\nsin salto', 'ab sin salto', 'a b sin salto'],
            correctOutput: 0,
            explanation: 'Cada endl salta de línea. El último cout no lleva endl, así que el programa termina sin un salto extra.'
          },
          {
            id: 'cppe012', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si olvidas el punto y coma?',
            choices: [
              'C++ lo añade solo',
              'Da un error de compilación',
              'Imprime un aviso',
              'El programa va más lento'
            ],
            correct: 1,
            explanation: 'En C++ el punto y coma es obligatorio al final de cada sentencia. Sin él, el compilador avisa y no se compila.'
          },
          {
            id: 'cppe013', type: 'type-code', xp: 30,
            description: 'Escribe un programa con un comentario que imprima tu nombre y luego un 7.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Pon tu nombre y un 7\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Este programa imprime un nombre y un número\n    cout << "Ana" << endl;\n    cout << 7 << endl;\n    return 0;\n}',
            explanation: 'El comentario con doble barra documenta la intención y no hace nada al ejecutarse. El 7 va sin comillas porque es un número.',
            // El nombre puede ser cualquiera, pero el 7 tiene que salir
            tests: [{ expected: '{{tu nombre}}\n7\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 2: VARIABLES Y TIPOS
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod2',
    title: 'Variables y Tipos',
    subtitle: 'int, double, char, bool y string',
    icon: '📦',
    color: '#4F86C6',
    gradient: 'linear-gradient(135deg, #4F86C6 0%, #2C5F8D 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'cpp-mod2-les1',
        title: 'Declarar variables',
        icon: '🏷️',
        exercises: [
          {
            id: 'cppe014', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se declara una variable entera llamada edad?',
            choices: ['int edad = 30;', 'edad int = 30;', 'var = 30 edad;', 'integer edad: 30;'],
            correct: 0,
            explanation: 'En C++ va primero el tipo y después el nombre, igual que en Java. Es al revés que en JavaScript.'
          },
          {
            id: 'cppe015', type: 'multiple-choice', xp: 15,
            question: 'Una variable int sin valor inicial, ¿cuál es su valor?',
            choices: ['null', 'undefined', '0', 'no se puede usar'],
            correct: 2,
            explanation: 'C++ deja las variables en su valor por defecto: los int en 0 y los bool en false. Los textos, en cadena vacía.'
          },
          {
            id: 'cppe016', type: 'fill-blank', xp: 20,
            question: 'Declara un double para el precio:',
            code: '___ precio = 12.5;',
            blanks: ['double'],
            options: ['double', 'int', 'Decimal', 'float'],
            correct: 0,
            explanation: 'double es el tipo de los decimales. Con int, el 12.5 se truncaría a 12 y perderíamos los céntimos.'
          },
          {
            id: 'cppe017', type: 'predict-output', xp: 20,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int edad = 30;\n    cout << edad << endl;\n    return 0;\n}',
            output: ['30', '30.0', 'edad', 'error'],
            correctOutput: 0,
            explanation: 'cout escribe el int tal cual. Y ojo: un double con valor 5.0 también saldría como 5, sin decimales.'
          },
          {
            id: 'cppe018', type: 'multiple-choice', xp: 20,
            question: 'Si haces int x = 7.9; ¿qué valor tiene x?',
            choices: ['7.9', '7', '8', 'error de compilación'],
            correct: 1,
            explanation: 'Al meter un decimal en un int, C++ trunca y se queda con la parte entera. Para conservarla, declara double.'
          },
          {
            id: 'cppe019', type: 'type-code', xp: 30,
            description: 'Declara un int llamado edad con valor 30 y un double llamado altura con valor 1.75, e imprime ambos.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Declara e imprime\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int edad = 30;\n    double altura = 1.75;\n    cout << edad << endl;\n    cout << altura << endl;\n    return 0;\n}',
            explanation: 'int para el entero y double para el decimal. El tipo va delante del nombre, y cout escribe el valor de la variable.',
            tests: [{ expected: '30\n1.75\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod2-les2',
        title: 'char, bool y string',
        icon: '🔤',
        exercises: [
          {
            id: 'cppe020', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un carácter en C++?',
            choices: ["'A'", '"A"', 'A', 'char A'],
            correct: 0,
            explanation: 'Un char va entre comillas simples y solo guarda un carácter. Con comillas dobles sería un texto de un carácter.'
          },
          {
            id: 'cppe021', type: 'multiple-choice', xp: 15,
            question: 'Al imprimir un bool con cout, ¿qué sale?',
            choices: ['true / false', '1 / 0', 'sí / no', 'TRUE / FALSE'],
            correct: 1,
            explanation: 'C++ escribe los booleanos como 1 y 0. Es una diferencia clara con otros lenguajes que sí ponen true y false.'
          },
          {
            id: 'cppe022', type: 'fill-blank', xp: 20,
            question: 'Declara un texto llamado nombre:',
            code: '___ nombre = "Ana";',
            blanks: ['string'],
            options: ['string', 'text', 'str', 'char'],
            correct: 0,
            explanation: 'string guarda texto de cualquier largo. El valor va entre comillas dobles, como en Java.'
          },
          {
            id: 'cppe023', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    bool aprobado = true;\n    char inicial = \'M\';\n    cout << aprobado << endl;\n    cout << inicial << endl;\n    return 0;\n}',
            output: ['true\nM', '1\nM', 'M\n1', 'sí\nM'],
            correctOutput: 1,
            explanation: 'El true sale como 1 y el char sale como el propio carácter M. Ojo: cout no escribe la palabra true.'
          },
          {
            id: 'cppe024', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre char y string?',
            choices: [
              'Ninguna',
              'char guarda un carácter con comillas simples; string guarda texto con dobles',
              'string es más rápido',
              'char solo admite números'
            ],
            correct: 1,
            explanation: 'char es un tipo simple de un solo carácter. string es una clase de la biblioteca estándar que guarda texto de cualquier tamaño.'
          },
          {
            id: 'cppe025', type: 'type-code', xp: 30,
            description: 'Declara un bool mayorDeEdad con valor false y un string nombre con valor "Ana". Imprime ambos.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Declara e imprime\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    bool mayorDeEdad = false;\n    string nombre = "Ana";\n    cout << mayorDeEdad << endl;\n    cout << nombre << endl;\n    return 0;\n}',
            explanation: 'false sin comillas para el bool, y el texto entre comillas dobles. El false se imprimirá como 0, no como la palabra false.',
            tests: [{ expected: '0\nAna\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 3: OPERADORES
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod3',
    title: 'Operadores',
    subtitle: 'Aritmética, comparación y lógica',
    icon: '➗',
    color: '#2A9D8F',
    gradient: 'linear-gradient(135deg, #2A9D8F 0%, #4ECDC4 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'cpp-mod3-les1',
        title: 'Aritmética',
        icon: '🔢',
        exercises: [
          {
            id: 'cppe026', type: 'multiple-choice', xp: 10,
            question: '¿Cuánto vale 17 / 5 en C++, si ambos son int?',
            choices: ['3.4', '3', '4', '3.0'],
            correct: 1,
            explanation: 'La clave de C++: al dividir dos enteros el resultado es entero y trunca. Para decimales usa un double o un casting.'
          },
          {
            id: 'cppe027', type: 'multiple-choice', xp: 15,
            question: '¿Qué operador da el resto de una división?',
            choices: ['/', '//', '%', 'mod'],
            correct: 2,
            explanation: 'El módulo (%) da el resto: 17 % 5 = 2. Sirve para saber si un número es par o múltiplo de algo.'
          },
          {
            id: 'cppe028', type: 'fill-blank', xp: 20,
            question: 'Pide el resto de dividir 10 entre 3:',
            code: 'int resto = 10 ___ 3;',
            blanks: ['%'],
            options: ['%', '/', '#', '|'],
            correct: 0,
            explanation: 'El módulo da el resto. 10 entre 3 son 3 y sobran 1, así que el resto es 1.'
          },
          {
            id: 'cppe029', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int a = 17;\n    int b = 5;\n    cout << a / b << endl;\n    cout << (double) a / b << endl;\n    return 0;\n}',
            output: ['3\n3.4', '3.4\n3.4', '17\n5', '3\n17'],
            correctOutput: 0,
            explanation: 'int / int = 3. El casting (double) convierte antes de dividir y ya sale 3.4. Si el casting faltara, las dos líneas darían 3, porque entre enteros la división trunca.'
          },
          {
            id: 'cppe030', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se comprueba si un número es par?',
            choices: ['n / 2 == 0', 'n % 2 == 0', 'n * 2 == 0', 'n % 0 == 0'],
            correct: 1,
            explanation: 'El resto de dividir entre 2 es 0 justo cuando el número es par. Con == comparas el resultado del módulo.'
          },
          {
            id: 'cppe031', type: 'type-code', xp: 30,
            description: 'Declara int a = 17 e int b = 5, e imprime su suma, su resta, su división entera y su módulo.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 17;\n    int b = 5;\n    // Imprime las cuatro operaciones\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 17;\n    int b = 5;\n    cout << a + b << endl;\n    cout << a - b << endl;\n    cout << a / b << endl;\n    cout << a % b << endl;\n    return 0;\n}',
            explanation: 'La división entre dos int trunca (3) y el módulo da lo que sobra (2). Cada cout con su endl escribe una línea.',
            tests: [{ expected: '22\n12\n3\n2\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod3-les2',
        title: 'Comparación y lógica',
        icon: '⚖️',
        exercises: [
          {
            id: 'cppe032', type: 'multiple-choice', xp: 15,
            question: '¿Qué símbolo significa "distinto de" en C++?',
            choices: ['!=', '<>', '=<', '~'],
            correct: 0,
            explanation: 'Es !=. El "menor o igual" se escribe <= y el "mayor o igual" >=, todo seguido.'
          },
          {
            id: 'cppe033', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace el operador &&?',
            choices: [
              'O lógico',
              'Y lógico: ambas condiciones deben cumplirse',
              'Niega la condición',
              'Concatena textos'
            ],
            correct: 1,
            explanation: '&& es el "y": sale 1 (verdadero) solo si las dos partes son verdaderas. Su opuesto es ||, el "o".'
          },
          {
            id: 'cppe034', type: 'fill-blank', xp: 20,
            question: 'Comprueba que la edad sea al menos 18:',
            code: 'int edad = 20;\nif (edad >= ___) {\n    cout << "Mayor de edad" << endl;\n}',
            blanks: ['18'],
            options: ['18', '>=', '==', '"18"'],
            correct: 0,
            explanation: 'El >= va fuera de los paréntesis: dentro solo va la comparación. El 18 es un número, sin comillas.'
          },
          {
            id: 'cppe035', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int edad = 20;\n    bool mayor = edad >= 18;\n    cout << mayor << endl;\n    cout << (edad > 30 && mayor) << endl;\n    return 0;\n}',
            output: ['1\n1', '1\n0', '0\n1', '20\n1'],
            correctOutput: 1,
            explanation: '20 >= 18 es cierto, así que sale 1. La segunda línea pide las dos cosas a la vez, y 20 > 30 es falso, así que el && da 0.'
          },
          {
            id: 'cppe036', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se invierte una condición?',
            choices: ['!condicion', 'NOT condicion', 'condicion = false', '-condicion'],
            correct: 0,
            explanation: 'El signo de exclamación delante: if (!mayorDeEdad). Detrás no funciona.'
          },
          {
            id: 'cppe037', type: 'type-code', xp: 30,
            description: 'Crea un int nota con valor 8 e imprime si está aprobado (>=5) y si es par.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nota = 8;\n    // Imprime las dos comprobaciones\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nota = 8;\n    cout << (nota >= 5) << endl;\n    cout << (nota % 2 == 0) << endl;\n    return 0;\n}',
            explanation: 'Una comparación vale 1 si es cierta y 0 si es falsa, y por eso se puede imprimir directamente. Como 8 % 2 da 0, la comparación con == es cierta y sale 1.',
            tests: [{ expected: '1\n1\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 4: CONDICIONALES
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod4',
    title: 'Condicionales',
    subtitle: 'if, else y switch',
    icon: '🔀',
    color: '#E9C46A',
    gradient: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'cpp-mod4-les1',
        title: 'if y else',
        icon: '❓',
        exercises: [
          {
            id: 'cppe038', type: 'multiple-choice', xp: 15,
            question: '¿Las llaves de un if son obligatorias?',
            choices: [
              'Sí, siempre',
              'No, solo si dentro hay más de una línea',
              'Solo para el else',
              'Nunca hacen falta'
            ],
            correct: 1,
            explanation: 'Con una sola sentencia puedes omitirlas, pero C++ recomienda ponerlas siempre: si mañana añades otra línea, ya está correcto.'
          },
          {
            id: 'cppe039', type: 'multiple-choice', xp: 15,
            question: 'Sin else, ¿qué hace un if cuya condición es falsa?',
            choices: ['Imprime algo igualmente', 'No hace nada', 'Da error', 'Repite el programa'],
            correct: 1,
            explanation: 'Si la condición es falsa, el bloque del if se salta y el programa sigue por la siguiente sentencia.'
          },
          {
            id: 'cppe040', type: 'fill-blank', xp: 20,
            question: 'Completa el if para que se imprima solo si el número es mayor que 0:',
            code: 'int n = 5;\nif (n ___ 0) {\n    cout << "Positivo" << endl;\n}',
            blanks: ['>'],
            options: ['>', '<', '!', '=='],
            correct: 0,
            explanation: 'El > va dentro de los paréntesis del if, sin punto y coma. Pregunta si un número es mayor que otro.'
          },
          {
            id: 'cppe041', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int nota = 7;\n    if (nota >= 5) {\n        cout << "Aprobado" << endl;\n    } else {\n        cout << "Suspenso" << endl;\n    }\n    return 0;\n}',
            output: ['Aprobado', 'Suspenso', 'Las dos', 'Ninguna'],
            correctOutput: 0,
            explanation: '7 >= 5 es cierto, así que entra en el if y el else se salta. Solo se ejecuta uno de los dos bloques.'
          },
          {
            id: 'cppe042', type: 'multiple-choice', xp: 20,
            question: '¿En qué orden se evalúa una cadena if - else if - else?',
            choices: [
              'Todas las condiciones a la vez',
              'De arriba abajo, y para en la primera que sea cierta',
              'Solo el else',
              'Al azar'
            ],
            correct: 1,
            explanation: 'Se van probando en orden y en cuanto una se cumple se ejecuta su bloque y se saltan los demás.'
          },
          {
            id: 'cppe043', type: 'type-code', xp: 30,
            description: 'Crea un int nota con valor 7 y, con if/else, imprime "Aprobado" si es 5 o más y "Suspenso" si no.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nota = 7;\n    // Tu if / else aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nota = 7;\n    if (nota >= 5) {\n        cout << "Aprobado" << endl;\n    } else {\n        cout << "Suspenso" << endl;\n    }\n    return 0;\n}',
            explanation: 'El if lleva su condición entre paréntesis y sin punto y coma. El else va fuera de las llaves del if.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod4-les2',
        title: 'switch',
        icon: '🎛️',
        exercises: [
          {
            id: 'cppe044', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un switch?',
            choices: [
              'Repetir código',
              'Comparar un valor contra varios casos',
              'Crear arrays',
              'Escribir texto'
            ],
            correct: 1,
            explanation: 'Es una forma más de leer que un if-elseif largo cuando comparas el mismo valor contra muchos casos.'
          },
          {
            id: 'cppe045', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa si olvidas el break del último case?',
            choices: [
              'Da error',
              'Sigue ejecutando los cases siguientes',
              'Imprime doble',
              'Sale del programa'
            ],
            correct: 1,
            explanation: 'Es el "fall-through": el switch sigue hacia abajo con el siguiente caso. Por eso el break es tan importante.'
          },
          {
            id: 'cppe046', type: 'fill-blank', xp: 20,
            question: 'Completa el caso:',
            code: 'int dia = 1;\nswitch (dia) {\n    ___ 1:\n        cout << "Lunes" << endl;\n        break;\n}',
            blanks: ['case'],
            options: ['case', 'if', 'when', 'option'],
            correct: 0,
            explanation: 'Cada opción se llama case, y el break le dice que pare ahí y no siga leyendo.'
          },
          {
            id: 'cppe047', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int dia = 3;\n    switch (dia) {\n        case 1:\n            cout << "Lunes" << endl;\n            break;\n        case 3:\n            cout << "Miercoles" << endl;\n            break;\n        default:\n            cout << "Otro" << endl;\n    }\n    return 0;\n}',
            output: ['Miercoles', 'Lunes', 'Otro', 'Las tres'],
            correctOutput: 0,
            explanation: 'Solo coincide el case 3, así que imprime Miercoles y el break corta el switch. El default no se llega a ver.'
          },
          {
            id: 'cppe048', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve default?',
            choices: [
              'Para imprimir siempre',
              'Se ejecuta si ningún caso coincide',
              'Es el caso 1',
              'Da error'
            ],
            correct: 1,
            explanation: 'Es el "si no era ninguno de estos". No es obligatorio, pero evita dejar casos sin cubrir.'
          },
          {
            id: 'cppe049', type: 'type-code', xp: 30,
            description: 'Con switch, según un int día con valor 1 imprime "Lunes" y si no "No es lunes".',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int dia = 1;\n    // Tu switch aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int dia = 1;\n    switch (dia) {\n        case 1:\n            cout << "Lunes" << endl;\n            break;\n        default:\n            cout << "No es lunes" << endl;\n    }\n    return 0;\n}',
            explanation: 'El case que coincide escribe su línea y el break evita que siga con el default. El default cubre lo que no coincida.',
            tests: [{ expected: 'Lunes\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 5: BUCLES
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod5',
    title: 'Bucles',
    subtitle: 'for, while y range-for',
    icon: '🔁',
    color: '#264653',
    gradient: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'cpp-mod5-les1',
        title: 'for y while',
        icon: '🔂',
        exercises: [
          {
            id: 'cppe050', type: 'multiple-choice', xp: 15,
            question: '¿Cuántas veces se repite un for con i desde 1 hasta 5?',
            choices: ['5 veces', '6 veces', '4 veces', 'Depende'],
            correct: 0,
            explanation: 'Cinco: i toma 1, 2, 3, 4 y 5. El límite se incluye porque la condición es <=.'
          },
          {
            id: 'cppe051', type: 'multiple-choice', xp: 15,
            question: '¿Qué parte del for controla el número de vueltas?',
            choices: [
              'La condición del medio',
              'El incremento del final, i++',
              'La declaración inicial',
              'Las llaves'
            ],
            correct: 1,
            explanation: 'Las tres partes: dónde empieza (int i = 1), hasta cuándo (i <= 5) y cómo avanza (i++).'
          },
          {
            id: 'cppe052', type: 'fill-blank', xp: 20,
            question: 'Completa el for que va del 1 al 3:',
            code: 'for (int i = 1; i <= ___; i++) {\n    cout << i << endl;\n}',
            blanks: ['3'],
            options: ['3', '<', 'i++', '1'],
            correct: 0,
            explanation: 'El <= 3 hace que i llegue a valer 3. El ++ del final es lo que impide que el bucle sea infinito.'
          },
          {
            id: 'cppe053', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 1; i <= 4; i++) {\n        cout << i * 2 << endl;\n    }\n    return 0;\n}',
            output: ['2\n4\n6\n8', '2\n4\n6', '1\n2\n3\n4', '8\n6\n4\n2'],
            correctOutput: 0,
            explanation: 'El bucle imprime cuatro líneas, una por vuelta, y en cada una multiplica el valor de i por 2.'
          },
          {
            id: 'cppe054', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el peligro de un while?',
            choices: [
              'Que va muy lento',
              'Que si la condición nunca se hace falsa se queda infinito',
              'Que no admite números',
              'Que necesita llaves'
            ],
            correct: 1,
            explanation: 'Si dentro del while no cambias la variable de la condición, el bucle no termina nunca y el programa se cuelga.'
          },
          {
            id: 'cppe055', type: 'type-code', xp: 30,
            description: 'Usa un for para imprimir los números del 1 al 3, uno por línea.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu for aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        cout << i << endl;\n    }\n    return 0;\n}',
            explanation: 'int i = 1 declara el contador, i <= 3 decide hasta cuándo y i++ lo avanza. Las tres partes van separadas por punto y coma.',
            tests: [{ expected: '1\n2\n3\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod5-les2',
        title: 'break, continue y range-for',
        icon: '🛑',
        exercises: [
          {
            id: 'cppe056', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace break dentro de un bucle?',
            choices: ['Salta a la siguiente vuelta', 'Sale del bucle', 'Repite el bucle', 'Termina el programa'],
            correct: 1,
            explanation: 'break aborta el bucle y el programa sigue por la sentencia siguiente a cerrar las llaves.'
          },
          {
            id: 'cppe057', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace continue?',
            choices: [
              'Sale del bucle',
              'Salta a la siguiente vuelta sin llegar al final',
              'Termina el programa',
              'Imprime una línea'
            ],
            correct: 1,
            explanation: 'continue se salta el resto de esta vuelta. Sirve para ignorar algunos valores: if (i == 2) continue;'
          },
          {
            id: 'cppe058', type: 'fill-blank', xp: 20,
            question: 'Salta el 3 en un bucle del 1 al 5:',
            code: 'for (int i = 1; i <= 5; i++) {\n    if (i == 3) ___;\n    cout << i << endl;\n}',
            blanks: ['continue'],
            options: ['continue', 'break', 'return', 'exit'],
            correct: 0,
            explanation: 'continue deja pasar el 3 sin imprimirlo y sigue con el 4. Con break el bucle terminaría en el 3 y no llegaría al 4.'
          },
          {
            id: 'cppe059', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        if (i == 3) {\n            continue;\n        }\n        cout << i << endl;\n    }\n    return 0;\n}',
            output: ['1\n2\n4\n5', '1\n2\n3\n4\n5', '1\n2', '3'],
            correctOutput: 0,
            explanation: 'El continue salta el cout cuando i vale 3, así que ese número no aparece y el bucle sigue hasta el 5.'
          },
          {
            id: 'cppe060', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la ventaja del range-for?',
            choices: [
              'Es más rápido',
              'Recorre un array sin necesitar el índice',
              'Necesita menos memoria',
              'Permite parar antes'
            ],
            correct: 1,
            explanation: 'for (int n : nums) te da directamente cada elemento. Antes había que recorrer con i y usar el índice.'
          },
          {
            id: 'cppe061', type: 'type-code', xp: 30,
            description: 'Recorre el array int[] {"manga"} con valores 7, 8 y 9 usando un range-for e imprime cada uno.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int notas[3] = {7, 8, 9};\n    // Tu range-for aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int notas[3] = {7, 8, 9};\n    for (int nota : notas) {\n        cout << nota << endl;\n    }\n    return 0;\n}',
            explanation: 'La forma es for (tipo elemento : array). Cada vuelta toma el siguiente elemento, así que no hace falta ni índice ni tamaño.',
            tests: [{ expected: '7\n8\n9\n' }]
          }
        ]
      }
    ]
  }

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 6: ARRAYS
  // ═══════════════════════════════════════════════
  ,
  {
    id: 'cpp-mod6',
    title: 'Arrays',
    subtitle: 'Listas fijas de valores del mismo tipo',
    icon: '📊',
    color: '#6A4C93',
    gradient: 'linear-gradient(135deg, #6A4C93 0%, #9B5DE5 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'cpp-mod6-les1',
        title: 'Crear y recorrer arrays',
        icon: '🗂️',
        exercises: [
          {
            id: 'cppe062', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipos puede guardar un array?',
            choices: ['Cualquier cosa', 'Solo valores del mismo tipo', 'Solo números', 'Solo textos'],
            correct: 1,
            explanation: 'Un int[3] solo guarda enteros y un string[3] solo textos. Es la diferencia principal con las listas de JavaScript.'
          },
          {
            id: 'cppe063', type: 'multiple-choice', xp: 15,
            question: 'Los índices de un array empiezan en…',
            choices: ['1', '0', '-1', 'length'],
            correct: 1,
            explanation: 'En 0, como en casi todos los lenguajes. El último índice válido es el tamaño menos uno.'
          },
          {
            id: 'cppe064', type: 'fill-blank', xp: 20,
            question: 'Declara un array de 3 enteros:',
            code: 'int numeros[___];',
            blanks: ['3'],
            options: ['3', '3.0', 'int', 'new'],
            correct: 0,
            explanation: 'El tamaño va entre los corchetes, y todo lo que queda vale 0 hasta que lo asignes.'
          },
          {
            id: 'cppe065', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int nums[3];\n    nums[0] = 7;\n    cout << nums[0] << " " << nums[1] << endl;\n    return 0;\n}',
            output: ['7 0', '7 7', '0 0', 'error'],
            correctOutput: 0,
            explanation: 'Solo asignamos la posición 0, así que la 1 sigue valiendo 0. En C++ un array sin inicializar no vale lo que hubiera en memoria: vale 0.'
          },
          {
            id: 'cppe066', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si pides una posición que no existe?',
            choices: [
              'Devuelve 0',
              'Da un error en tiempo de ejecución',
              'Crea la posición',
              'Imprime null'
            ],
            correct: 1,
            explanation: 'Es un comportamiento indefinido: puede fallar, o leer basura de la memoria. Por eso hay que cuidar el límite del bucle.'
          },
          {
            id: 'cppe067', type: 'type-code', xp: 30,
            description: 'Crea un array int con los valores 4, 8 y 15, e imprime cuántos elementos tiene y el último.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu array aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int numeros[3] = {4, 8, 15};\n    cout << numeros[2] << endl;\n    return 0;\n}',
            explanation: 'Con las llaves creas el array con los valores puestos. El último elemento es el de la posición tamaño - 1, aquí el 15.',
            tests: [{ expected: '15\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod6-les2',
        title: 'Recorrer y sumar un array',
        icon: '➕',
        exercises: [
          {
            id: 'cppe068', type: 'multiple-choice', xp: 15,
            question: '¿Cómo recorres un array con un for clásico?',
            choices: [
              'for (int i = 0; i < n; i++)',
              'for (int i : n) con length',
              'for (int i = 1; i <= n; i++)',
              'No se puede'
            ],
            correct: 0,
            explanation: 'Empieza en 0 y llega hasta el tamaño menos uno. Con i <= tamaño intentaría leer una posición de más.'
          },
          {
            id: 'cppe069', type: 'fill-blank', xp: 20,
            question: 'Completa el bucle que suma un array de tamaño 3:',
            code: 'int nums[3] = {4, 8, 15};\nint suma = 0;\nfor (int i = 0; i < ___; i++) {\n    suma += nums[i];\n}',
            blanks: ['3'],
            options: ['3', '2', 'nums', 'i'],
            correct: 0,
            explanation: 'El índice va de 0 a 2 porque el array tiene 3 elementos. Con i < 3 se leen los tres y ninguno más.'
          },
          {
            id: 'cppe070', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int nums[3] = {4, 8, 15};\n    int suma = 0;\n    for (int i = 0; i < 3; i++) {\n        suma += nums[i];\n    }\n    cout << suma << endl;\n    return 0;\n}',
            output: ['27', '15', '4', '3'],
            correctOutput: 0,
            explanation: 'suma += nums[i] va añadiendo cada elemento: 4 + 8 + 15 = 27. Por eso el += es tan cómodo en los bucles.'
          },
          {
            id: 'cppe071', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el error típico al sumar un array?',
            choices: [
              'Usar += en vez de +',
              'Declarar el acumulador dentro del bucle, así se pierde al salir',
              'Usar int en vez de double',
              'Poner el for antes de la suma'
            ],
            correct: 1,
            explanation: 'Si escribes int suma = 0; dentro del bucle, en cada vuelta se crea de nuevo y al salir no existe. Va antes.'
          },
          {
            id: 'cppe072', type: 'type-code', xp: 30,
            description: 'Crea un array int con 5, 10 y 15 y calcula la suma recorriéndolo con un for clásico.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[3] = {5, 10, 15};\n    // Calcula la suma\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[3] = {5, 10, 15};\n    int suma = 0;\n    for (int i = 0; i < 3; i++) {\n        suma += nums[i];\n    }\n    cout << suma << endl;\n    return 0;\n}',
            explanation: 'El acumulador suma se declara antes del bucle (si no, se perdería en cada vuelta) y se va llenando con +=.',
            tests: [{ expected: '30\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 7: FUNCIONES
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod7',
    title: 'Funciones',
    subtitle: 'Trocea el programa en piezas',
    icon: '⚙️',
    color: '#0077B6',
    gradient: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'cpp-mod7-les1',
        title: 'Crear y llamar funciones',
        icon: '🔧',
        exercises: [
          {
            id: 'cppe073', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa void en una función?',
            choices: ['Que devuelve nada', 'Que devuelve un número', 'Que es privada', 'Que devuelve texto'],
            correct: 0,
            explanation: 'void significa "vacío": la función hace su trabajo pero no entrega ningún valor de vuelta.'
          },
          {
            id: 'cppe074', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se escriben las funciones en C++?',
            choices: [
              'Solo dentro de main',
              'Fuera de main, en el mismo fichero',
              'Dentro de los comentarios',
              'En un fichero aparte obligatorio'
            ],
            correct: 1,
            explanation: 'En C++ se declaran fuera de main, en el mismo fichero y antes de donde se usen.'
          },
          {
            id: 'cppe075', type: 'fill-blank', xp: 20,
            question: 'Completa la firma de una función que suma dos enteros y devuelve int:',
            code: '___ sumar(int a, int b) {\n    return a + b;\n}',
            blanks: ['int'],
            options: ['int', 'void', 'double', 'string'],
            correct: 0,
            explanation: 'Delante del nombre va el tipo que DEVUELVE la función, no el que recibe. Si no devolviera nada, ahí iría void.'
          },
          {
            id: 'cppe076', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nvoid saludar(string nombre) {\n    cout << "Hola, " << nombre << endl;\n}\nint main() {\n    saludar("Ana");\n    return 0;\n}',
            output: ['Hola, Ana', 'Hola, "Ana"', 'nombre', 'error'],
            correctOutput: 0,
            explanation: 'La función recibe "Ana" como nombre y lo concatena. Se llama por su nombre, sin la palabra clave.'
          },
          {
            id: 'cppe077', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace return?',
            choices: ['Sale del programa', 'Devuelve un valor y sale de la función', 'Escribe', 'Crea una variable'],
            correct: 1,
            explanation: 'return entrega el valor y termina la función. En un void se puede usar para salir antes de tiempo.'
          },
          {
            id: 'cppe078', type: 'type-code', xp: 35,
            description: 'Crea una función void llamada saludar que imprima "Hola, C++!" y llámala desde main.',
            starter: '#include <iostream>\nusing namespace std;\n\n// Tu función aquí\n\nint main() {\n    // Llama a la función\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nvoid saludar() {\n    cout << "Hola, C++!" << endl;\n}\n\nint main() {\n    saludar();\n    return 0;\n}',
            explanation: 'La función va fuera de main, con void delante porque no devuelve nada. Al llamarla se pasan los paréntesis, aunque no haya argumentos.',
            tests: [{ expected: 'Hola, C++!\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod7-les2',
        title: 'Funciones con retorno',
        icon: '🔙',
        exercises: [
          {
            id: 'cppe079', type: 'multiple-choice', xp: 15,
            question: 'Una función con retorno int, ¿cómo termina?',
            choices: ['Con cout', 'Con return y el valor', 'Con break', 'Con void'],
            correct: 1,
            explanation: 'Tiene que devolver el valor con return. Si llegara al final sin return, devolvería basura.'
          },
          {
            id: 'cppe080', type: 'multiple-choice', xp: 15,
            question: 'Si una función int puede tener varios return, ¿cuál se usa?',
            choices: ['Todos', 'El primero que se ejecuta', 'El último', 'Da error'],
            correct: 1,
            explanation: 'Al ejecutar un return, la función se termina ahí. El primero que se cumple es el que gana.'
          },
          {
            id: 'cppe081', type: 'fill-blank', xp: 20,
            question: 'Devuelve el doble de un número:',
            code: 'int doble(int n) {\n    return n * ___;\n}',
            blanks: ['2'],
            options: ['2', 'n', '+', 'n2'],
            correct: 0,
            explanation: 'return entrega el resultado de la expresión. Aquí n * 2 es el valor que vuelve al que llamó.'
          },
          {
            id: 'cppe082', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint sumar(int a, int b) {\n    return a + b;\n}\nint main() {\n    cout << sumar(3, 4) << endl;\n    return 0;\n}',
            output: ['7', '3', '4', 'sumar'],
            correctOutput: 0,
            explanation: 'La función devuelve 7 y ese valor es el que se escribe. cout puede recibir directamente el resultado de una llamada.'
          },
          {
            id: 'cppe083', type: 'multiple-choice', xp: 20,
            question: '¿Por qué es bueno una función con return?',
            choices: [
              'Es más rápido',
              'Puedes guardar el resultado y seguir trabajando con él',
              'Ocupa menos memoria',
              'Evita los errores'
            ],
            correct: 1,
            explanation: 'int total = sumar(3, 4); deja el resultado disponible para operar con él. Con void solo se hace el efecto lateral.'
          },
          {
            id: 'cppe084', type: 'type-code', xp: 35,
            description: 'Crea una función int llamada doble que devuelva el número que recibe multiplicado por 2, e imprímelo con el 5.',
            starter: '#include <iostream>\nusing namespace std;\n\n// Tu función aquí\n\nint main() {\n    // Imprime doble(5)\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint doble(int n) {\n    return n * 2;\n}\n\nint main() {\n    cout << doble(5) << endl;\n    return 0;\n}',
            explanation: 'El tipo int delante del nombre indica qué devuelve, y return entrega el resultado. Con 5 entra y devuelve 10.',
            tests: [{ expected: '10\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 8: STRINGS Y VECTORES
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod8',
    title: 'Textos y vectores',
    subtitle: 'string y vector de la biblioteca estándar',
    icon: '💬',
    color: '#8338EC',
    gradient: 'linear-gradient(135deg, #8338EC 0%, #B26AE0 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'cpp-mod8-les1',
        title: 'Trabajar con string',
        icon: '🔤',
        exercises: [
          {
            id: 'cppe085', type: 'multiple-choice', xp: 15,
            question: '¿string es un tipo primitivo de C++?',
            choices: ['Sí, como int', 'No, viene de la biblioteca estándar', 'Depende', 'Solo si es corto'],
            correct: 1,
            explanation: 'No es un tipo del lenguaje, sino una clase de la biblioteca estándar. Por eso puede tener métodos como length o substr.'
          },
          {
            id: 'cppe086', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve "Hola".length()?',
            choices: ['3', '4', '5', 'H'],
            correct: 1,
            explanation: 'Cuatro: H, o, l, a. length cuenta todos los caracteres, incluidos los espacios.'
          },
          {
            id: 'cppe087', type: 'fill-blank', xp: 20,
            question: 'Saca las tres primeras letras de "Hola Mundo":',
            code: 'string s = "Hola Mundo";\ncout << s.substr(0, ___) << endl;',
            blanks: ['3'],
            options: ['3', '2', '1', '4'],
            correct: 0,
            explanation: 'substr(0, 3) va del índice 0 hasta el 3 sin incluirlo, o sea H, o y l.'
          },
          {
            id: 'cppe088', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    string s = "Hola Mundo";\n    cout << s.length() << endl;\n    cout << s.substr(5) << endl;\n    cout << s.find("Mundo") << endl;\n    return 0;\n}',
            output: ['10\nMundo\n5', '9\nMundo\n5', '10\nHola Mundo\n0', '10\nHola\n5'],
            correctOutput: 0,
            explanation: 'length da 10 contando el espacio. substr(5) quita "Hola " y se queda "Mundo". Y Mundo empieza en el índice 5.'
          },
          {
            id: 'cppe089', type: 'multiple-choice', xp: 20,
            question: 'Si el texto no aparece, ¿qué devuelve find?',
            choices: ['0', '-1', 'nada', 'Da error'],
            correct: 1,
            explanation: 'Devuelve una posición enorme que en la práctica se usa como "no está". Comprueba siempre antes de usarlo.'
          },
          {
            id: 'cppe090', type: 'type-code', xp: 30,
            description: 'Dado el string nombre = "DevQuest", imprime su longitud y la primera letra de su nombre.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    string nombre = "DevQuest";\n    // Imprime la longitud y la primera letra\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    string nombre = "DevQuest";\n    cout << nombre.length() << endl;\n    cout << nombre[0] << endl;\n    return 0;\n}',
            explanation: 'length() lleva paréntesis porque es un método. El índice va entre corchetes, sin paréntesis, y devuelve un char.',
            tests: [{ expected: '8\nD\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod8-les2',
        title: 'Vectores',
        icon: '📈',
        exercises: [
          {
            id: 'cppe091', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre un array y un vector?',
            choices: [
              'Ninguna',
              'El array tiene tamaño fijo; el vector puede crecer con push_back',
              'El vector solo admite números',
              'El array es más rápido'
            ],
            correct: 1,
            explanation: 'El array se reserva con un tamaño que no cambia. El vector es dynamic: push_back añade elementos al final.'
          },
          {
            id: 'cppe092', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace push_back?',
            choices: ['Borra el último', 'Añade un elemento al final', 'Ordena el vector', 'Devuelve el tamaño'],
            correct: 1,
            explanation: 'Añade un valor al final del vector y lo amplía solo si hace falta.'
          },
          {
            id: 'cppe093', type: 'fill-blank', xp: 20,
            question: 'Declara un vector de enteros:',
            code: '___<int> nums;',
            blanks: ['vector'],
            options: ['vector', 'array', 'list', 'vec'],
            correct: 0,
            explanation: 'vector<tipo> es la forma de escribirlo. Los ángulos dicen qué tipo de valores va a guardar.'
          },
          {
            id: 'cppe094', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    vector<int> v;\n    v.push_back(4);\n    v.push_back(8);\n    v.push_back(15);\n    cout << v.size() << " " << v[2] << endl;\n    return 0;\n}',
            output: ['3 15', '4 15', '3 4', 'error'],
            correctOutput: 0,
            explanation: 'Se han añadido tres elementos, así que size da 3. El índice 2 es el tercero, que vale 15.'
          },
          {
            id: 'cppe095', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el error típico al recorrer un array?',
            choices: [
              'Usar int en el for',
              'Poner i <= tamaño y leer una posición que no existe',
              'Usar el índice dentro de los corchetes',
              'Empezar en 0'
            ],
            correct: 1,
            explanation: 'Con un array de 3 elementos los índices válidos son 0, 1 y 2. La condición debe ser i < tamaño, no i <= tamaño.'
          },
          {
            id: 'cppe096', type: 'type-code', xp: 30,
            description: 'Crea un vector, añade los valores 5, 10 y 15 con push_back y calcula la suma con un range-for.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu vector y la suma aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    vector<int> v;\n    v.push_back(5);\n    v.push_back(10);\n    v.push_back(15);\n    int suma = 0;\n    for (int x : v) {\n        suma += x;\n    }\n    cout << suma << endl;\n    return 0;\n}',
            explanation: 'push_back añade al final y el range-for recorre los valores sin índice. El acumulador se declara antes del bucle.',
            tests: [{ expected: '30\n' }]
          }
        ]
      }
    ]
  }

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 9: STRUCT
  // ═══════════════════════════════════════════════
  ,
  {
    id: 'cpp-mod9',
    title: 'Struct',
    subtitle: 'Tu propio tipo de dato',
    icon: '🏗️',
    color: '#1D3557',
    gradient: 'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'cpp-mod9-les1',
        title: 'Crear un struct',
        icon: '📐',
        exercises: [
          {
            id: 'cppe097', type: 'multiple-choice', xp: 15,
            question: '¿Qué es un struct?',
            choices: [
              'Un archivo de código',
              'Un tipo de dato que agrupa varios campos relacionados',
              'Un tipo de variable',
              'Un bucle'
            ],
            correct: 1,
            explanation: 'El struct es la plantilla; las variables que creas a partir de él son los objetos.'
          },
          {
            id: 'cppe098', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se accede a un campo de un struct?',
            choices: ['objeto->campo', 'objeto.campo', 'objeto::campo', 'objeto[campo]'],
            correct: 1,
            explanation: 'Con el punto si tienes el objeto. Con la flecha solo cuando lo tienes como puntero: p->campo.'
          },
          {
            id: 'cppe099', type: 'fill-blank', xp: 20,
            question: 'Completa la declaración del struct:',
            code: '___ Punto {\n    int x;\n    int y;\n};',
            blanks: ['struct'],
            options: ['struct', 'class', 'public', 'using'],
            correct: 0,
            explanation: 'struct es la palabra clave. Cierra con punto y coma, como cualquier declaración.'
          },
          {
            id: 'cppe100', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nstruct Punto { int x; int y; };\nint main() {\n    Punto p;\n    p.x = 3;\n    p.y = 4;\n    cout << p.x << "," << p.y << endl;\n    return 0;\n}',
            output: ['3,4', 'ninguno', 'Punto', 'error'],
            correctOutput: 0,
            explanation: 'Crear un Punto deja los campos a cero, y al asignarlos se leen con el punto. El punto separa los dos números, no es una coma decimal.'
          },
          {
            id: 'cppe101', type: 'multiple-choice', xp: 20,
            question: 'Dos structs del mismo tipo, ¿comparten sus campos?',
            choices: [
              'Sí, son la misma variable',
              'No, cada uno tiene sus propios valores',
              'Solo si son static',
              'Solo el primero'
            ],
            correct: 1,
            explanation: 'Cada variable tiene su propia copia de los campos. Por eso pueden ser dos libros con el mismo título y distinto autor.'
          },
          {
            id: 'cppe102', type: 'type-code', xp: 35,
            description: 'Crea un struct Libro con los campos titulo (string) y anio (int), crea un libro, ponle los valores e imprímelos.',
            starter: '#include <iostream>\nusing namespace std;\n\n// Tu struct aquí\n\nint main() {\n    // Crea el libro e imprímelo\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nstruct Libro {\n    string titulo;\n    int anio;\n};\n\nint main() {\n    Libro l;\n    l.titulo = "El Hobbit";\n    l.anio = 1937;\n    cout << l.titulo << endl;\n    cout << l.anio << endl;\n    return 0;\n}',
            explanation: 'El struct va fuera de main, terminado en punto y coma. El punto accede al campo del objeto que has creado.',
            tests: [{ expected: 'El Hobbit\n1937\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod9-les2',
        title: 'Constructores y métodos',
        icon: '🔨',
        exercises: [
          {
            id: 'cppe103', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un constructor?',
            choices: [
              'Para imprimir',
              'Para preparar el objeto nada más crearlo',
              'Para borrar el objeto',
              'Es obligatorio siempre'
            ],
            correct: 1,
            explanation: 'Se ejecuta al crear el objeto. Sirve para dejar los campos con valores válidos desde el principio.'
          },
          {
            id: 'cppe104', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama un constructor en C++?',
            choices: [
              'Con el mismo nombre del struct',
              'Con la palabra construct',
              'Con new',
              'No tiene nombre'
            ],
            correct: 0,
            explanation: 'Tiene exactamente el mismo nombre que el struct y sin tipo de retorno, ni siquiera void.'
          },
          {
            id: 'cppe105', type: 'fill-blank', xp: 20,
            question: 'Completa el constructor:',
            code: 'struct Libro {\n    string titulo;\n\n    Libro(string t) {\n        this.titulo = ___;\n    }\n};',
            blanks: ['t'],
            options: ['t', 'titulo', 'this.titulo', 'string'],
            correct: 0,
            explanation: 'this.titulo es el campo del objeto y t es el parámetro. El this es lo que distingue los dos.'
          },
          {
            id: 'cppe106', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nstruct Libro {\n    string titulo;\n    int anio;\n    Libro(string t, int a) {\n        this.titulo = t;\n        this.anio = a;\n    }\n};\nint main() {\n    Libro l("Dune", 1965);\n    cout << l.titulo << " (" << l.anio << ")" << endl;\n    return 0;\n}',
            output: ['Dune (1965)', 'Libro (1965)', 'Dune 1965', 'error'],
            correctOutput: 0,
            explanation: 'El constructor recibe los dos valores y los guarda. Luego el cout los lee del objeto.'
          },
          {
            id: 'cppe107', type: 'multiple-choice', xp: 20,
            question: '¿Qué es this?',
            choices: ['El struct', 'Una referencia al objeto que se está usando', 'Un tipo de dato', 'Un bucle'],
            correct: 1,
            explanation: 'this apunta al objeto actual. Sirve sobre todo en los constructores, para no confundir un campo con un parámetro.'
          },
          {
            id: 'cppe108', type: 'type-code', xp: 40,
            description: 'Crea un struct Producto con campos nombre y precio y un constructor que los reciba. Crea un producto e imprime "Manzana: 1.5".',
            starter: '#include <iostream>\nusing namespace std;\n\n// Tu struct aquí\n\nint main() {\n    // Crea el producto e imprímelo\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nstruct Producto {\n    string nombre;\n    double precio;\n    Producto(string n, double p) {\n        this.nombre = n;\n        this.precio = p;\n    }\n};\n\nint main() {\n    Producto p("Manzana", 1.5);\n    cout << p.nombre << ": " << p.precio << endl;\n    return 0;\n}',
            explanation: 'El constructor usa this para guardar en los campos lo que llega en los parámetros. El precio es double porque lleva decimales.',
            tests: [{ expected: 'Manzana: 1.5\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 10: PUNTEROS
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod10',
    title: 'Punteros',
    subtitle: 'Trabajar con direcciones de memoria',
    icon: '🧭',
    color: '#CE422B',
    gradient: 'linear-gradient(135deg, #CE422B 0%, #8A2A1B 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'cpp-mod10-les1',
        title: 'Direcciones y desreferencia',
        icon: '📍',
        exercises: [
          {
            id: 'cppe109', type: 'multiple-choice', xp: 15,
            question: '¿Qué es un puntero?',
            choices: [
              'Un número que guarda la dirección de otra variable',
              'Un tipo de variable más grande',
              'Un puntero físico de la pantalla',
              'Una función'
            ],
            correct: 0,
            explanation: 'Un puntero guarda la dirección de un valor en memoria. Es lo que permite trabajar con la posición en vez de con la copia.'
          },
          {
            id: 'cppe110', type: 'multiple-choice', xp: 15,
            question: '¿Qué operador da la dirección de una variable?',
            choices: ['&', '*', '#', '@'],
            correct: 0,
            explanation: 'El & delante de una variable da su dirección. El * delante de un puntero va al revés: va al valor.'
          },
          {
            id: 'cppe111', type: 'fill-blank', xp: 20,
            question: 'Guarda en el puntero p la DIRECCIÓN de la variable x:',
            code: 'int x = 5;\nint* p = ___x;',
            blanks: ['&'],
            options: ['&', '*', 'new', '.'],
            correct: 0,
            explanation: 'int* p = &x; guarda en p la dirección de x. El asterisco va en la declaración, el & al tomar la dirección.'
          },
          {
            id: 'cppe112', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5;\n    int* p = &x;\n    *p = 10;\n    cout << x << endl;\n    return 0;\n}',
            output: ['10', '5', 'la dirección', 'error'],
            correctOutput: 0,
            explanation: 'Este es el corazón de los punteros: al escribir por el puntero se cambia la variable original, así que x pasa a valer 10.'
          },
          {
            id: 'cppe113', type: 'multiple-choice', xp: 20,
            question: 'int y = x; ¿qué diferencia hay con int* p = &x;?',
            choices: [
              'Ninguna',
              'Con y se copia el valor; con p se guarda la dirección y se puede modificar el original',
              'Con y se copia la dirección',
              'Con p se copia el valor dos veces'
            ],
            correct: 1,
            explanation: 'Copiar el valor crea un número nuevo e independiente. Guardar la dirección apunta al sitio original, y escribir por ahí lo cambia.'
          },
          {
            id: 'cppe114', type: 'type-code', xp: 35,
            description: 'Crea un int x con valor 5, un puntero p a su dirección, cambia x a 10 a través del puntero e imprime x.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu puntero aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    *p = 10;\n    cout << x << endl;\n    return 0;\n}',
            explanation: 'int* p = &x; guarda la dirección. Luego *p = 10; escribe a través del puntero, y eso cambia x.',
            tests: [{ expected: '10\n' }]
          }
        ]
      },
      {
        id: 'cpp-mod10-les2',
        title: 'Punteros a arrays y nullptr',
        icon: '🧮',
        exercises: [
          {
            id: 'cppe115', type: 'multiple-choice', xp: 15,
            question: 'Al hacer int* p = nums; ¿qué pasa?',
            choices: [
              'Se copia el array entero',
              'p guarda la dirección del primer elemento',
              'p queda nulo',
              'Da error'
            ],
            correct: 1,
            explanation: 'El nombre de un array se convierte en la dirección de su primer elemento. Por eso p[0] y nums[0] son lo mismo.'
          },
          {
            id: 'cppe116', type: 'multiple-choice', xp: 15,
            question: '¿Qué es nullptr?',
            choices: [
              'Un puntero que no apunta a nada',
              'Un puntero vacío de memoria',
              'El número 0',
              'Un puntero al principio del programa'
            ],
            correct: 0,
            explanation: 'Es el puntero nulo: la forma correcta de decir "esto todavía no apunta a nada". Antes de desreferenciarlo hay que comprobarlo.'
          },
          {
            id: 'cppe117', type: 'fill-blank', xp: 20,
            question: 'Avanza el puntero una posición y lee su valor:',
            code: 'int nums[3] = {10, 20, 30};\nint* p = nums;\np++;\ncout << ___p << endl;',
            blanks: ['*'],
            options: ['*', '&', '->', '.'],
            correct: 0,
            explanation: 'p++ avanza al siguiente elemento del array. Para leer el valor de donde está ahora, hace falta desreferenciarlo con *.'
          },
          {
            id: 'cppe118', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int nums[3] = {10, 20, 30};\n    int* p = nums;\n    p++;\n    cout << *p << endl;\n    return 0;\n}',
            output: ['20', '10', '30', 'error'],
            correctOutput: 0,
            explanation: 'p empezaba en el elemento 0, que vale 10. Al incrementarlo pasa al elemento 1, que vale 20.'
          },
          {
            id: 'cppe119', type: 'multiple-choice', xp: 20,
            question: '¿Por qué hay que comprobar si un puntero es nullptr?',
            choices: [
              'Para que vaya más rápido',
              'Porque desreferenciar un nullptr provocaría un fallo grave',
              'Porque no se puede imprimir',
              'No hace falta comprobarlo'
            ],
            correct: 1,
            explanation: 'Leer o escribir por un puntero nulo hace que el programa falle de inmediato. El if (p != nullptr) lo evita.'
          },
          {
            id: 'cppe120', type: 'type-code', xp: 35,
            description: 'Con el array {10, 20, 30}, usa un puntero y la aritmética *(p + i) para imprimir los tres valores.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[3] = {10, 20, 30};\n    int* p = nums;\n    // Recorre con punteros\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[3] = {10, 20, 30};\n    int* p = nums;\n    for (int i = 0; i < 3; i++) {\n        cout << *(p + i) << endl;\n    }\n    return 0;\n}',
            explanation: 'p + i avanza i elementos desde el primero, y el * delante lee el valor de ahí. Por eso *(p + 0) es el primer elemento.',
            tests: [{ expected: '10\n20\n30\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 11: MEMORIA CON NEW Y DELETE
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod11',
    title: 'Memoria con new y delete',
    subtitle: 'Reservar y liberar a mano',
    icon: '🧹',
    color: '#D62828',
    gradient: 'linear-gradient(135deg, #D62828 0%, #A4133C 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'cpp-mod11-les1',
        title: 'new y delete',
        icon: '🔧',
        exercises: [
          {
            id: 'cppe121', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve new?',
            choices: [
              'Para crear un variable en la memoria y devolver su dirección',
              'Para borrar una variable',
              'Para reservar memoria que hay que liberar con delete',
              'Es lo mismo que declarar una variable normal'
            ],
            correct: 2,
            explanation: 'new reserva un trozo de memoria y devuelve el puntero a él. Esa memoria hay que liberarla con delete, y no se libera sola.'
          },
          {
            id: 'cppe122', type: 'multiple-choice', xp: 15,
            question: '¿Por qué hay que hacer delete?',
            choices: [
              'Por costumbre',
              'Porque si no, la memoria reservada se queda ocupada para siempre',
              'Para que el programa vaya más rápido',
              'Para poder imprimir el valor'
            ],
            correct: 1,
            explanation: 'La memoria reservada con new no se libera sola. Si te olvidas de hacerlo, el programa va acumular reservas y acabará quedándose sin memoria.'
          },
          {
            id: 'cppe123', type: 'fill-blank', xp: 20,
            question: 'Reserva memoria para un int y asígnale 42:',
            code: 'int* p = ___ int;\n*p = 42;\ncout << *p << endl;',
            blanks: ['new'],
            options: ['new', 'create', 'alloc', 'make'],
            correct: 0,
            explanation: 'new int reserva el hueco y devuelve el puntero. Luego se escribe a través de él con el asterisco.'
          },
          {
            id: 'cppe124', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int* p = new int;\n    *p = 42;\n    cout << *p << endl;\n    delete p;\n    return 0;\n}',
            output: ['42', 'la dirección', '0', 'error'],
            correctOutput: 0,
            explanation: 'Se escribe 42 a través del puntero y se lee igual. El delete va después de imprimir, cuando ya no lo necesitas.'
          },
          {
            id: 'cppe125', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el error grave de memoria en C++?',
            choices: [
              'Usar delete dos veces en la misma dirección',
              'Usar delete una vez',
              'Usar new sin problema',
              'Declarar dos punteros'
            ],
            correct: 0,
            explanation: 'Liberar dos veces la misma dirección corrompe datos de otro objeto y puede hacer fallar el programa. Este intérprete lo avisa en vez de dejarlo pasar.'
          },
          {
            id: 'cppe126', type: 'type-code', xp: 40,
            description: 'Reserva un int con new, ponle el valor 7, impímelo con * y libéralo con delete.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu new y delete aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = new int;\n    *p = 7;\n    cout << *p << endl;\n    delete p;\n    return 0;\n}',
            explanation: 'new int reserva la memoria, *p = 7; escribe en ella y *p la lee. El delete devuelve la memoria al sistema: sin él, la memoria se queda ocupada para siempre.',
            tests: [{ expected: '7\n', contains: 'delete' }]
          }
        ]
      },
      {
        id: 'cpp-mod11-les2',
        title: 'Fugas y doble liberación',
        icon: '⚠️',
        exercises: [
          {
            id: 'cppe127', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una fuga de memoria?',
            choices: [
              'Reservar memoria con new y no liberarla nunca',
              'Liberar memoria de más',
              'Usar un puntero sin inicializar',
              'Imprimir un puntero'
            ],
            correct: 0,
            explanation: 'Cada new que no va acompañado de su delete se queda ocupado. En un programa que se repite muchas veces, eso acaba con la memoria.'
          },
          {
            id: 'cppe128', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa si usas un puntero después de hacer delete?',
            choices: [
              'Sigue funcionando igual',
              'Es un error grave: la memoria ya no es tuya',
              'Devuelve 0',
              'Se libera sola otra vez'
            ],
            correct: 1,
            explanation: 'Se llama "use after free". La memoria puede haberla reutilizado otro, así que el programa puede hacer cualquier cosa. Por eso delete va cuando ya no se usa.'
          },
          {
            id: 'cppe129', type: 'fill-blank', xp: 20,
            question: 'Libera un array reservado con new[]:',
            code: 'int* nums = new int[3];\nnums[0] = 7;\ndelete[] ___;',
            blanks: ['nums'],
            options: ['nums', '', '*', '&'],
            correct: 0,
            explanation: 'delete[] libera un array y va con los mismos corchetes. Si reservas un array y liberas con delete sin corchetes, también es un error.'
          },
          {
            id: 'cppe130', type: 'predict-output', xp: 25,
            question: '¿Qué pasa con este código?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int* p = new int;\n    *p = 1;\n    delete p;\n    cout << *p << endl;\n    return 0;\n}',
            expectError: true,
            output: [
              '1',
              'error: se usa memoria ya liberada',
              '0',
              'imprime la dirección'
            ],
            correctOutput: 1,
            explanation: 'Tras el delete esa memoria ya no es del programa. Leerla es un "use after free", un error que en C++ real puede hacer cualquier cosa.',
            tests: [{ expected: 'Error de C++: ese puntero apunta a memoria que ya habías liberado con delete. Es un "use after free": el programa está usando una dirección que ya no le pertenece.\n' }]
          },
          {
            id: 'cppe131', type: 'multiple-choice', xp: 20,
            question: '¿Por qué C++ tiene new y delete si los otros lenguajes no?',
            choices: [
              'Es más rápido siempre',
              'Porque le da al programador el control y la velocidad, a cambio del riesgo de equivocarse',
              'Porque es más antiguo',
              'Para los principiantes'
            ],
            correct: 1,
            explanation: 'C++ da ese control por rendimiento. El precio es que la responsabilidad es del programador, y por eso existen languages como Java que lo hacen automático.'
          },
          {
            id: 'cppe132', type: 'type-code', xp: 40,
            description: 'Reserva un array de 3 enteros con new[], pon 7 en la primera posición, impímelo y libéralo con delete[].',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Tu new[] y delete[] aquí\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int* nums = new int[3];\nnums[0] = 7;\ncout << nums[0] << endl;\ndelete[] nums;\n    return 0;\n}',
            explanation: 'new int[3] reserva tres enteros seguidos y devuelve un puntero al primero. El delete[] lleva los mismos corchetes que el new[]: si se olvida, la memoria queda ocupada.',
            tests: [{ expected: '7\n', contains: 'delete[]' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 12: REFERENCIAS
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod12',
    title: 'Referencias',
    subtitle: 'Un alias que se usa como la variable',
    icon: '🔗',
    color: '#3A0CA3',
    gradient: 'linear-gradient(135deg, #3A0CA3 0%, #7209B7 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'cpp-mod12-les1',
        title: 'Referencias y paso por referencia',
        icon: '🪝',
        exercises: [
          {
            id: 'cppe133', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una referencia?',
            choices: [
              'Otro nombre para la misma variable',
              'Una copia del valor',
              'Un tipo de puntero con un nombre distinto',
              'Una función'
            ],
            correct: 0,
            explanation: 'Una referencia es un alias. Se usa como la variable original, sin necesitar el asterisco para leer o escribir.'
          },
          {
            id: 'cppe134', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la diferencia entre un puntero y una referencia?',
            choices: [
              'Son idénticos',
              'La referencia se usa como la variable; el puntero hay que desreferenciarlo con *',
              'El puntero es más rápido',
              'La referencia ocupa más memoria'
            ],
            correct: 1,
            explanation: 'Ambos apuntan al mismo sitio, pero la referencia se comporta como un alias y el puntero como una dirección que hay que desreferenciar.'
          },
          {
            id: 'cppe135', type: 'fill-blank', xp: 20,
            question: 'Declara una referencia a la variable x:',
            code: 'int x = 5;\nint& ___ = x;\nr = 10;\ncout << x << endl;',
            blanks: ['r'],
            options: ['r', 'p', '*r', '&r'],
            correct: 0,
            explanation: 'int& r = x; hace que r sea otro nombre de x. Al cambiar r, cambia x.'
          },
          {
            id: 'cppe136', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int x = 5;\n    int& r = x;\n    r = 10;\n    cout << x << endl;\n    return 0;\n}',
            output: ['10', '5', 'r', 'error'],
            correctOutput: 0,
            explanation: 'r es un alias de x, así que cambiar r cambia x. Por eso ahora x vale 10.'
          },
          {
            id: 'cppe137', type: 'multiple-choice', xp: 20,
            question: 'Una función con parámetro int, ¿modifica la variable del que llama?',
            choices: [
              'Sí, siempre',
              'No, recibe una copia',
              'Solo si es grande',
              'Depende del compilador'
            ],
            correct: 1,
            explanation: 'Por defecto C++ pasa los argumentos por valor: la función trabaja con una copia. Para tocar el original hace falta int&.'
          },
          {
            id: 'cppe138', type: 'type-code', xp: 40,
            description: 'Crea una función duplicar que reciba un int por referencia y lo multiplique por 2. Llámala con un 5 e imprime el resultado.',
            starter: '#include <iostream>\nusing namespace std;\n\n// Tu función aquí\n\nint main() {\n    // Llama a duplicar con un 5\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nvoid duplicar(int& n) {\n    n = n * 2;\n}\n\nint main() {\n    int x = 5;\n    duplicar(x);\n    cout << x << endl;\n    return 0;\n}',
            explanation: 'El int& del parámetro hace que la función reciba la variable original, no una copia. Por eso al multiplicar cambia x.',
            tests: [{ expected: '10\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 13: PROGRAMA COMPLETO
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod13',
    title: 'Todo Junto',
    subtitle: 'Un programa de principio a fin',
    icon: '🧩',
    color: '#2B9348',
    gradient: 'linear-gradient(135deg, #2B9348 0%, #52B788 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'cpp-mod13-les1',
        title: 'Combinar todo',
        icon: '🧱',
        exercises: [
          {
            id: 'cppe139', type: 'multiple-choice', xp: 20,
            question: 'Un programa que guarda datos, decide y repite, ¿qué necesita?',
            choices: [
              'Solo cout',
              'Variables, condicionales y bucles, combinadas',
              'Una clase obligatoria',
              'Nada especial'
            ],
            correct: 1,
            explanation: 'Un programa real encadena todo: guarda datos en variables, usa if para decidir y bucles para repetir.'
          },
          {
            id: 'cppe140', type: 'multiple-choice', xp: 20,
            question: '¿Qué conviene para partir un programa largo?',
            choices: [
              'Meterlo todo en main',
              'Crear funciones con una tarea cada una',
              'Repetir el código',
              'Usar más comentarios'
            ],
            correct: 1,
            explanation: 'Funciones cortas y con un nombre claro. Cada una hace una cosa y se prueba por separado.'
          },
          {
            id: 'cppe141', type: 'fill-blank', xp: 25,
            question: 'Completa el bucle que suma un array de 3 elementos:',
            code: 'int nums[3] = {2, 4, 6};\nint suma = 0;\nfor (int i = 0; i < ___; i++) {\n    suma += nums[i];\n}',
            blanks: ['3'],
            options: ['3', '2', 'nums', 'i'],
            correct: 0,
            explanation: 'Con i < 3 se leen los índices 0, 1 y 2, que son los tres elementos. Con i <= 3 se leería uno de más.'
          },
          {
            id: 'cppe142', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int nums[3] = {2, 4, 6};\n    int suma = 0;\n    for (int i = 0; i < 3; i++) {\n        suma += nums[i];\n    }\n    cout << suma / 3 << endl;\n    cout << suma % 3 << endl;\n    return 0;\n}',
            output: ['4\n0', '12\n3', '4.0\n0.0', '2\n2'],
            correctOutput: 0,
            explanation: 'La suma es 12 y al dividirla entre 3 con dos enteros trunca a 4. El resto de 12 entre 3 es 0.'
          },
          {
            id: 'cppe143', type: 'multiple-choice', xp: 20,
            question: '¿Qué leyó mejor un proyecto real?',
            choices: [
              'La función más corta',
              'Funciones con una tarea clara y nombres que expliquen lo que hacen',
              'Más comentarios',
              'Más cout'
            ],
            correct: 1,
            explanation: 'Un buen nombre dice más que un comentario: calcularTotal() explica su propósito sin abrir la función.'
          },
          {
            id: 'cppe144', type: 'type-code', xp: 45,
            description: 'Programa completo: crea un array de 3 notas, calcula la media con un bucle e imprime si está aprobado.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int notas[3] = {7, 8, 9};\n    // Calcula la media y decide\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int notas[3] = {7, 8, 9};\n    int suma = 0;\n    for (int i = 0; i < 3; i++) {\n        suma += notas[i];\n    }\n    int media = suma / 3;\n    if (media >= 5) {\n        cout << "Aprobado" << endl;\n    } else {\n        cout << "Suspenso" << endl;\n    }\n    return 0;\n}',
            explanation: 'Primero se acumula la suma con un bucle, luego se divide para obtener la media y con un if se decide. La división entre enteros trunca, y aquí da igual.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // C++ MÓDULO 14: 🏆 PROYECTO
  // ═══════════════════════════════════════════════
  {
    id: 'cpp-mod14',
    title: '🏆 Proyecto: Gestor de Biblioteca',
    subtitle: 'Un programa completo con struct y punteros',
    icon: '🏛️',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'cpp-mod14-les1',
        title: 'La biblioteca entera',
        icon: '🏛️',
        exercises: [
          {
            id: 'cppe145', type: 'multiple-choice', xp: 20,
            question: '¿Por qué usar un struct Libro en vez de variables sueltas?',
            choices: [
              'Es más corto',
              'Agrupa los datos relacionados y permite añadir comportamiento',
              'C++ lo obliga',
              'Es más rápido'
            ],
            correct: 1,
            explanation: 'Un struct deja el título, el año y el precio juntos, y permite añadir un método esAntiguo() sin ensuciar el main.'
          },
          {
            id: 'cppe146', type: 'multiple-choice', xp: 20,
            question: 'Para contar cuántos libros hay, ¿qué conviene?',
            choices: [
              'Una función que recorra el array y devuelva el total',
              'Contarlos a mano',
              'Un contador global',
              'Nada'
            ],
            correct: 0,
            explanation: 'Una función que devuelve el número de elementos deja el main limpio y se puede reutilizar en otros sitios.'
          },
          {
            id: 'cppe147', type: 'fill-blank', xp: 25,
            question: 'Completa el for que suma los precios de 3 libros:',
            code: 'int precios[3] = {10, 20, 30};\nint total = 0;\nfor (int i = 0; i < ___; i++) {\n    total += precios[i];\n}',
            blanks: ['3'],
            options: ['3', '2', 'precios', 'i'],
            correct: 0,
            explanation: 'Con i < 3 se recorren los tres precios. El += va guardando 10, luego 30 y al final 60.'
          },
          {
            id: 'cppe148', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '#include <iostream>\nusing namespace std;\nint main() {\n    int precios[3] = {10, 20, 30};\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total += precios[i];\n    }\n    cout << total << endl;\n    return 0;\n}',
            output: ['60', '30', '3', '10'],
            correctOutput: 0,
            explanation: 'El += va guardando 10, luego 30 y al final 60. El bucle recorre los tres precios porque i va de 0 a 2.'
          },
          {
            id: 'cppe149', type: 'multiple-choice', xp: 25,
            question: '¿Qué ventaja tiene una función que recibe un array por referencia?',
            choices: [
              'Que va más rápido',
              'Que puede modificar el array del que llama, si hace falta',
              'Que ocupa menos memoria',
              'Que evita los arrays'
            ],
            correct: 1,
            explanation: 'Con int& la función trabaja con el array original. Con int se le pasaría una copia y los cambios no se verían fuera.'
          },
          {
            id: 'cppe150', type: 'type-code', xp: 50,
            description: 'Informe de biblioteca: crea un array de 3 precios, calcula el total con un bucle y el número de libros, e imprime ambos.',
            starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int precios[3] = {12, 18, 15};\n    // Calcula e imprime el total y cuántos hay\n    return 0;\n}',
            solution: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int precios[3] = {12, 18, 15};\n    int total = 0;\n    for (int i = 0; i < 3; i++) {\n        total += precios[i];\n    }\n    cout << total << endl;\n    cout << 3 << endl;\n    return 0;\n}',
            explanation: 'El bucle acumula el total y la segunda línea dice cuántos libros hay. Las dos líneas del final son el informe.',
            tests: [{ expected: '45\n3\n' }]
          }
        ]
      }
    ]
  }
];
