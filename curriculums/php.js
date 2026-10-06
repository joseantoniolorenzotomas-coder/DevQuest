// PHP Curriculum — El lenguaje de la web dinámica
//
// Los ejercicios se ejecutan con phpengine.js, un intérprete propio del
// subconjunto que se enseña aquí. El alumno ve la salida real de su programa,
// así que los type-code se validan de verdad.
//
// Convenciones del temario:
//   · Los(type-code) llevan el armazón <?php ... ?> completo, porque es como
//     se escribe PHP de verdad.
//   · predict-output usa el intérprete para calcular la respuesta, así que la
//     opción correcta nunca puede quedar desfasada.
//   · Nada que el motor no soporte: ni clases, ni sesiones, ni require.

window.PHP_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // PHP MÓDULO 1: TU PRIMER PROGRAMA
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod1',
    title: 'Tu Primer Programa',
    subtitle: 'Las etiquetas, el echo y el punto y coma',
    icon: '🐘',
    color: '#777BB4',
    gradient: 'linear-gradient(135deg, #777BB4 0%, #4F5B93 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'php-mod1-les1',
        title: 'La estructura de PHP',
        icon: '🏗️',
        exercises: [
          {
            id: 'phpe001', type: 'multiple-choice', xp: 10,
            question: '¿Con qué etiquetas empieza un fichero PHP?',
            choices: ['<html></html>', '<?php ?>', '<script></script>', '<#php #>'],
            correct: 1,
            explanation: 'Todo lo que va dentro de <?php ?> es código PHP. Fuera de esas etiquetas es HTML normal, y se puede combinar.'
          },
          {
            id: 'phpe002', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace echo?',
            choices: [
              'Nada visible: guarda el texto',
              'Escribe un valor en pantalla',
              'Termina el programa',
              'Crea una variable'
            ],
            correct: 1,
            explanation: 'echo es la forma de sacar texto por pantalla. Es shorthand de print, que hace lo mismo pero devuelve un 1.'
          },
          {
            id: 'phpe003', type: 'fill-blank', xp: 20,
            question: 'Completa la etiqueta que abre el código PHP:',
            code: '___ \necho "Hola";\n?>',
            blanks: ['<?php'],
            options: ['<?php', '<?', '<php', '<?='],
            correct: 0,
            explanation: 'Se abre con <?php y se cierra con ?>. El cierre es opcional si el fichero es solo PHP.'
          },
          {
            id: 'phpe004', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este programa?',
            codeToRun: '<?php\necho "Hola, PHP!";',
            output: ['Hola, PHP!', ' nada', 'error de compilación', 'Hola'],
            correctOutput: 0,
            explanation: 'echo entre paréntesis... no: echo seguido del texto. Los textos siempre van entre comillas.'
          },
          {
            id: 'phpe005', type: 'multiple-choice', xp: 20,
            question: 'En PHP, ¿el punto y coma es obligatorio?',
            choices: [
              'Sí, siempre',
              'No, es opcional',
              'Solo al final del fichero',
              'Solo dentro de las funciones'
            ],
            correct: 1,
            explanation: 'En PHP es opcional y por eso mucha gente se lo salta. Aun así se recomienda ponerlo: separa las sentencias y evita errores raros.'
          },
          {
            id: 'phpe006', type: 'type-code', xp: 30,
            description: 'Imprime "Hola, PHP!" y, en la línea siguiente, "Me alegro de verte".',
            starter: '<?php\n// Ojo: echo no salta de línea solo',
            solution: '<?php\necho "Hola, PHP!\\n";\necho "Me alegro de verte";',
            explanation: 'echo escribe el texto tal cual y no añade ningún salto de línea: si lo sacas de dentro de las comillas, los dos textos saldrían pegados. El \\n es el que produce el salto.',
            tests: [{ expected: 'Hola, PHP!\nMe alegro de verte\n' }]
          }
        ]
      },
      {
        id: 'php-mod1-les2',
        title: 'Comentarios y var_dump',
        icon: '📝',
        exercises: [
          {
            id: 'phpe007', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un comentario de una línea en PHP?',
            choices: ['// esto', '# esto', '<!-- esto -->', '/* esto'],
            correct: 1,
            explanation: 'PHP admite las tres formas: // para una línea, # también para una línea, y /* ... */ para varias.'
          },
          {
            id: 'phpe008', type: 'fill-blank', xp: 20,
            question: 'Completa el comentario de una línea:',
            code: '<?php\n___ Este programa saluda\necho "Hola";',
            blanks: ['//'],
            options: ['//', '#', '<//', '/*'],
            correct: 0,
            explanation: 'Con dos barras se abre un comentario de una línea. También vale una almohadilla (#), pero aquí se usa la forma más habitual.'
          },
          {
            id: 'phpe009', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve var_dump?',
            choices: [
              'Imprimir un texto bonito',
              'Ver el valor de una variable y su tipo',
              'Borrar una variable',
              'Convertir un texto en número'
            ],
            correct: 1,
            explanation: 'Es la herramienta de trabajo de PHP: muestra el valor y el tipo. Por eso int(5) y "5" se distinguen de un vistazo.'
          },
          {
            id: 'phpe010', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nvar_dump(5);\nvar_dump("5");',
            output: ['int(5)\nstring(1) "5"', '5\n5', 'int(5)\nint(5)', '5\n5.'],
            correctOutput: 0,
            explanation: 'var_dump muestra el tipo delante del valor. El 5 es un número entero y el "5" un texto, y ahí está toda la diferencia.'
          },
          {
            id: 'phpe011', type: 'multiple-choice', xp: 20,
            question: 'echo false; ¿qué muestra?',
            choices: ['false', '0', 'Nada', 'null'],
            correct: 2,
            explanation: 'echo convierte los booleanos: true sale como 1 y false como una cadena vacía, o sea, no se ve nada.'
          },
          {
            id: 'phpe012', type: 'type-code', xp: 30,
            description: 'Usa var_dump para mostrar el número 42 y el texto "42", para que se vea que son de tipos distintos.',
            starter: '<?php\n// Muestra el número y el texto con su tipo',
            solution: '<?php\nvar_dump(42);\nvar_dump("42");',
            explanation: 'var_dump escribe el tipo antes del valor. Verás int(42) y string(2) "42", y ya se nota que no son lo mismo.',
            tests: [{ expected: 'int(42)\nstring(2) "42"\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 2: VARIABLES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod2',
    title: 'Variables',
    subtitle: 'El dollar y el tipado dinámico',
    icon: '📦',
    color: '#6067C8',
    gradient: 'linear-gradient(135deg, #6067C8 0%, #3D3B8E 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'php-mod2-les1',
        title: 'Declarar y usar variables',
        icon: '🏷️',
        exercises: [
          {
            id: 'phpe013', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se declara una variable en PHP?',
            choices: ['var edad = 30;', '$edad = 30;', 'edad: 30;', 'let edad = 30;'],
            correct: 1,
            explanation: 'En PHP toda variable empieza por $. No hay que declarar el tipo: el lenguaje lo deduce del valor.'
          },
          {
            id: 'phpe014', type: 'multiple-choice', xp: 15,
            question: '¿PHP obliga a declarar el tipo de las variables?',
            choices: ['Sí, siempre', 'No, es de tipado dinámico', 'Solo para los números', 'Solo dentro de las funciones'],
            correct: 1,
            explanation: 'PHP es de tipado dinámico: el tipo se calcula al asignar. Puedes poner un número y luego un texto en la misma variable.'
          },
          {
            id: 'phpe015', type: 'fill-blank', xp: 20,
            question: 'Completa la variable y su impresión:',
            code: '<?php\n$nombre = "Ana";\necho $___;',
            blanks: ['nombre'],
            options: ['nombre', 'text', 'Nombre'],
            correct: 0,
            explanation: 'Las variables distinguen mayúsculas de minúsculas: $nombre y $Nombre son dos variables distintas.'
          },
          {
            id: 'phpe016', type: 'predict-output', xp: 20,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$edad = 30;\necho $edad;',
            output: ['30', '30.0', '$edad', 'error'],
            correctOutput: 0,
            explanation: 'echo escribe el valor de la variable, no su nombre. Y al no poner comillas, el 30 sale como número.'
          },
          {
            id: 'phpe017', type: 'multiple-choice', xp: 20,
            question: 'PHP guarda el nombre con el dollar o sin él?',
            choices: [
              'Con el dollar, que forma parte del nombre',
              'Sin el dollar, solo al escribir',
              'Solo en las funciones',
              'Da igual'
            ],
            correct: 0,
            explanation: 'Para el intérprete la variable se llama $nombre, con el dollar delante. Por eso no se puede llamar $nombre a otra cosa.'
          },
          {
            id: 'phpe018', type: 'type-code', xp: 30,
            description: 'Declara una variable $edad con valor 30 y otra $altura con valor 1.75, e imprime ambas.',
            starter: '<?php\n// Declara e imprime',
            solution: '<?php\n$edad = 30;\n$altura = 1.75;\necho $edad;\necho $altura;',
            explanation: 'PHP no necesita int ni double: con el $ y el valor ya está. El 1.75 sí lleva decimales, así que sale con ellos.',
            tests: [{ expected: '301.75\n' }]
          }
        ]
      },
      {
        id: 'php-mod2-les2',
        title: 'Textos y concatenar',
        icon: '🔤',
        exercises: [
          {
            id: 'phpe019', type: 'multiple-choice', xp: 15,
            question: '¿Qué operador concatena textos en PHP?',
            choices: ['+', '.', '&', ','],
            correct: 1,
            explanation: 'El punto. El + suma números, y si le das dos textos te avisa con un warning en vez de pegarlos.'
          },
          {
            id: 'phpe020', type: 'multiple-choice', xp: 15,
            question: 'echo "5" + 3; ¿qué da?',
            choices: ['53', '8', '"53"', 'error'],
            correct: 1,
            explanation: 'El + convierte a número: "5" se vuelve 5 y 5 + 3 son 8. Con el punto sí darías "53".'
          },
          {
            id: 'phpe021', type: 'fill-blank', xp: 20,
            question: 'Pega dos textos con el operador correcto:',
            code: '<?php\necho "Hola" ___ " Mundo";',
            blanks: ['.'],
            options: ['.', '+', '&', ','],
            correct: 0,
            explanation: 'El punto concatena. Con el + PHP intentaría sumar, convierte los textos a número y fallaría.'
          },
          {
            id: 'phpe022', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$nombre = "Ana";\n$edad = 30;\necho $nombre . " tiene " . $edad . " años";',
            output: ['Ana tiene 30 años', 'Ana30 años', 'Ana tiene 30', 'Ana tiene años'],
            correctOutput: 0,
            explanation: 'Encadena un texto, una variable, otro texto y un número. El 30 se convierte a texto al pegarlo con el punto.'
          },
          {
            id: 'phpe023', type: 'multiple-choice', xp: 20,
            question: '¿Se pueden meter variables dentro de un texto?',
            choices: [
              'No, hay que usar el punto',
              'Sí, con comillas dobles: "Hola $nombre"',
              'Solo con comillas simples',
              'Solo si son números'
            ],
            correct: 1,
            explanation: 'Con comillas dobles, PHP sustituye $nombre dentro del texto. Con comillas simples se escribe tal cual.'
          },
          {
            id: 'phpe024', type: 'type-code', xp: 30,
            description: 'Con $nombre = "Ana" y $edad = 30, imprime en una sola línea "Ana tiene 30 años".',
            starter: '<?php\n$nombre = "Ana";\n$edad = 30;\n// Concatena con el punto',
            solution: '<?php\n$nombre = "Ana";\n$edad = 30;\necho $nombre . " tiene " . $edad . " años";',
            explanation: 'Con el punto se van pegando textos y variables en el orden que quieras. El número se convierte solo al pegarlo.',
            tests: [{ expected: 'Ana tiene 30 años\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 3: OPERADORES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod3',
    title: 'Operadores',
    subtitle: 'Aritmética, comparación y lógica',
    icon: '➗',
    color: '#2A9D8F',
    gradient: 'linear-gradient(135deg, #2A9D8F 0%, #4ECDC4 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'php-mod3-les1',
        title: 'Aritmética',
        icon: '🔢',
        exercises: [
          {
            id: 'phpe025', type: 'multiple-choice', xp: 10,
            question: '¿Cuánto vale 7 / 2 en PHP?',
            choices: ['3', '3.5', '4', '2'],
            correct: 1,
            explanation: 'La división da decimal si no es exacta: 3.5. Si fuera exacta, como 6 / 2, daría el entero 3.'
          },
          {
            id: 'phpe026', type: 'multiple-choice', xp: 15,
            question: '¿Qué operador da el resto de una división?',
            choices: ['/', '//', '%', 'mod'],
            correct: 2,
            explanation: 'El módulo (%): 17 % 5 da 2. Sirve para saber si un número es par o múltiplo de algo.'
          },
          {
            id: 'phpe027', type: 'fill-blank', xp: 20,
            question: 'Pide el resto de dividir 10 entre 3:',
            code: '<?php\n$resto = 10 ___ 3;\necho $resto;',
            blanks: ['%'],
            options: ['%', '/', '#', '|'],
            correct: 0,
            explanation: 'El módulo da el resto. 10 entre 3 son 3 y sobran 1, así que el resto es 1.'
          },
          {
            id: 'phpe028', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$a = 17;\n$b = 5;\necho $a / $b;\necho $a % $b;',
            output: ['3.42', '3.52', '3.45', '12342'],
            correctOutput: 0,
            explanation: '17 entre 5 no es exacto, así que da 3.4. Y el módulo da lo que sobra, que es 2. Como no hay separador, los dos resultados salen pegados: 3.4 y luego 2.'
          },
          {
            id: 'phpe029', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se comprueba si un número es par?',
            choices: ['$n / 2 == 0', '$n % 2 == 0', '$n * 2 == 0', '$n % 0 == 0'],
            correct: 1,
            explanation: 'El resto de dividir entre 2 es 0 justo cuando el número es par.'
          },
          {
            id: 'phpe030', type: 'type-code', xp: 30,
            description: 'Declara $a = 17 y $b = 5, e imprime su suma, su resta, su división y su módulo.',
            starter: '<?php\n$a = 17;\n$b = 5;\n// Imprime las cuatro operaciones',
            solution: '<?php\n$a = 17;\n$b = 5;\necho $a + $b;\necho $a - $b;\necho $a / $b;\necho $a % $b;',
            explanation: 'La división da 3.4 porque no es exacta, y el módulo da 2. Cada echo escribe a continuación, sin separador.',
            tests: [{ expected: '2212' + '3.42\n' }]
          }
        ]
      },
      {
        id: 'php-mod3-les2',
        title: 'Comparación y lógica',
        icon: '⚖️',
        exercises: [
          {
            id: 'phpe031', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa "distinto de" en PHP?',
            choices: ['!=', '<>', '=<', '!=='],
            correct: 1,
            explanation: 'Se puede escribir != o <>. El !== es más estricto: además de distinto exige que sean de tipos distintos.'
          },
          {
            id: 'phpe032', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre == y ===?',
            choices: [
              'Ninguna',
              '== convierte tipos antes de comparar; === exige el mismo tipo',
              '=== es más rápido',
              '== solo funciona con números'
            ],
            correct: 1,
            explanation: '"5" == 5 es true porque convierte el texto a número. "5" === 5 es false porque uno es texto y el otro número.'
          },
          {
            id: 'phpe033', type: 'fill-blank', xp: 20,
            question: 'Comprueba que la edad sea al menos 18:',
            code: '<?php\n$edad = 20;\nif ($edad >= ___) {\n    echo "Mayor de edad";\n}',
            blanks: ['18'],
            options: ['18', '>=', '==', '"18"'],
            correct: 0,
            explanation: 'El >= va fuera de los paréntesis: dentro solo va la comparación. El 18 es un número, sin comillas.'
          },
          {
            id: 'phpe034', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nvar_dump("5" == 5);\nvar_dump("5" === 5);',
            output: ['bool(true)\nbool(false)', 'bool(false)\nbool(true)', '1\n0', 'true\nfalse'],
            correctOutput: 0,
            explanation: 'Con == PHP convierte el texto a número y son iguales. Con === además mira el tipo, y uno es string y el otro int.'
          },
          {
            id: 'phpe035', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se invierte una condición?',
            choices: ['!$condicion', 'NOT $condicion', '$condicion = false', '-$condicion'],
            correct: 0,
            explanation: 'El signo de exclamación delante: if (!$mayorDeEdad).'
          },
          {
            id: 'phpe036', type: 'type-code', xp: 30,
            description: 'Crea $nota = 7 e imprime si está aprobado (>= 5) y si es par.',
            starter: '<?php\n$nota = 7;\n// Imprime las dos comprobaciones',
            solution: '<?php\n$nota = 7;\necho ($nota >= 5);\necho ($nota % 2 == 0);',
            explanation: '7 está aprobado, así que la primera comparación vale true y echo escribe 1. La segunda es falsa, y un false con echo no escribe nada: por eso solo se ve un 1.',
            tests: [{ expected: '1\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 4: CONDICIONALES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod4',
    title: 'Condicionales',
    subtitle: 'if, elseif, else y switch',
    icon: '🔀',
    color: '#E9C46A',
    gradient: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'php-mod4-les1',
        title: 'if y else',
        icon: '❓',
        exercises: [
          {
            id: 'phpe037', type: 'multiple-choice', xp: 15,
            question: '¿Las llaves de un if son obligatorias?',
            choices: [
              'Sí, siempre',
              'No, si dentro solo hay una sentencia',
              'Solo para el else',
              'Nunca hacen falta'
            ],
            correct: 1,
            explanation: 'Con una sola sentencia puedes omitirlas, pero lo normal es ponerlas: si mañana añades otra línea, ya está correcto.'
          },
          {
            id: 'phpe038', type: 'multiple-choice', xp: 15,
            question: 'Sin else, ¿qué hace un if cuya condición es falsa?',
            choices: ['Imprime algo igualmente', 'No hace nada', 'Da error', 'Repite el programa'],
            correct: 1,
            explanation: 'Si la condición es falsa, el bloque del if se salta y el programa sigue por la siguiente sentencia.'
          },
          {
            id: 'phpe039', type: 'fill-blank', xp: 20,
            question: 'Completa el if para que se imprima solo si el número es mayor que 3:',
            code: '<?php\n$n = 5;\nif ($n ___ 3) {\n    echo "Mayor";\n}',
            blanks: ['>'],
            options: ['>', '<', '!', '=='],
            correct: 0,
            explanation: 'El > va dentro de los paréntesis del if, sin punto y coma. Pregunta si un número es mayor que otro.'
          },
          {
            id: 'phpe040', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$nota = 7;\nif ($nota >= 5) {\n    echo "Aprobado";\n} else {\n    echo "Suspenso";\n}',
            output: ['Aprobado', 'Suspenso', 'Las dos', 'Ninguna'],
            correctOutput: 0,
            explanation: '7 >= 5 es cierto, así que entra en el if y el else se salta. Solo se ejecuta uno de los dos bloques.'
          },
          {
            id: 'phpe041', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre elseif y else if?',
            choices: [
              'Ninguna, es lo mismo',
              'elseif no lleva espacio y va encadenado al if; else if es un if dentro del else',
              'elseif solo funciona con números',
              'else if es más rápido'
            ],
            correct: 1,
            explanation: 'elseif encadena condiciones, igual que en elisp. else if es un if normal dentro del else y no encadena igual.'
          },
          {
            id: 'phpe042', type: 'type-code', xp: 30,
            description: 'Crea $nota = 7 y, con if/else, imprime "Aprobado" si es 5 o más y "Suspenso" si no.',
            starter: '<?php\n$nota = 7;\n// Tu if / else aquí',
            solution: '<?php\n$nota = 7;\nif ($nota >= 5) {\n    echo "Aprobado";\n} else {\n    echo "Suspenso";\n}',
            explanation: 'La condición va entre paréntesis y sin punto y coma. El else va fuera de las llaves del if.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      },
      {
        id: 'php-mod4-les2',
        title: 'switch',
        icon: '🎛️',
        exercises: [
          {
            id: 'phpe043', type: 'multiple-choice', xp: 15,
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
            id: 'phpe044', type: 'multiple-choice', xp: 15,
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
            id: 'phpe045', type: 'fill-blank', xp: 20,
            question: 'Completa el caso:',
            code: '<?php\n$dia = 1;\nswitch ($dia) {\n    ___ 1:\n        echo "Lunes";\n        break;\n}',
            blanks: ['case'],
            options: ['case', 'if', 'when', 'option'],
            correct: 0,
            explanation: 'Cada opción se llama case, y el break le dice que pare ahí y no siga leyendo.'
          },
          {
            id: 'phpe046', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$dia = 3;\nswitch ($dia) {\n    case 1: echo "Lunes"; break;\n    case 3: echo "Miercoles"; break;\n    default: echo "Otro";\n}',
            output: ['Miercoles', 'Lunes', 'Otro', 'Las tres'],
            correctOutput: 0,
            explanation: 'Solo coincide el case 3, así que imprime Miercoles y el break corta el switch. El default no se llega a ver.'
          },
          {
            id: 'phpe047', type: 'multiple-choice', xp: 20,
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
            id: 'phpe048', type: 'type-code', xp: 30,
            description: 'Con switch, según un $dia con valor 1 imprime "Lunes" y si no "No es lunes".',
            starter: '<?php\n$dia = 1;\n// Tu switch aquí',
            solution: '<?php\n$dia = 1;\nswitch ($dia) {\n    case 1:\n        echo "Lunes";\n        break;\n    default:\n        echo "No es lunes";\n}',
            explanation: 'El case que coincide escribe su texto y el break evita que siga con el default. El default cubre lo que no coincida.',
            tests: [{ expected: 'Lunes\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 5: BUCLES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod5',
    title: 'Bucles',
    subtitle: 'for, while y foreach',
    icon: '🔁',
    color: '#264653',
    gradient: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'php-mod5-les1',
        title: 'for y while',
        icon: '🔂',
        exercises: [
          {
            id: 'phpe049', type: 'multiple-choice', xp: 15,
            question: '¿Cuántas veces se repite un for con i desde 1 hasta 5?',
            choices: ['5 veces', '6 veces', '4 veces', 'Depende'],
            correct: 0,
            explanation: 'Cinco: i toma 1, 2, 3, 4 y 5. El límite se incluye porque la condición es <=.'
          },
          {
            id: 'phpe050', type: 'multiple-choice', xp: 15,
            question: '¿Qué parte del for controla el número de vueltas?',
            choices: [
              'La condición del medio',
              'El incremento del final, $i++',
              'La declaración inicial',
              'Las llaves'
            ],
            correct: 1,
            explanation: 'Las tres partes: dónde empieza ($i = 1), hasta cuándo ($i <= 5) y cómo avanza ($i++).'
          },
          {
            id: 'phpe051', type: 'fill-blank', xp: 20,
            question: 'Completa la condición del bucle para que llegue a imprimir el 5, no solo hasta el 4:',
            code: '<?php\nfor ($i = 1; $i <= ___; $i++) {\n    echo $i;\n}',
            blanks: ['5'],
            options: ['5', '<', '$i++', '1'],
            correct: 0,
            explanation: 'Con $i <= 5 el bucle llega a valer 5 y lo imprime. Si pusieras $i < 5 se quedaría en el 4.'
          },
          {
            id: 'phpe052', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nfor ($i = 1; $i <= 4; $i++) {\n    echo $i * 2;\n}',
            output: ['2468', '246', '1234', '8642'],
            correctOutput: 0,
            explanation: 'El bucle da cuatro vueltas y en cada una multiplica el valor de $i por 2: 2, 4, 6 y 8, pegados.'
          },
          {
            id: 'phpe053', type: 'multiple-choice', xp: 20,
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
            id: 'phpe054', type: 'type-code', xp: 30,
            description: 'Usa un for para imprimir los números del 1 al 3, separados por un espacio.',
            starter: '<?php\n// Tu for aquí',
            solution: '<?php\nfor ($i = 1; $i <= 3; $i++) {\n    echo $i . " ";\n}',
            explanation: 'Las tres partes del for: dónde empieza, hasta cuándo y cómo avanza. El punto pega el espacio después del número.',
            tests: [{ expected: '1 2 3 \n' }]
          }
        ]
      },
      {
        id: 'php-mod5-les2',
        title: 'foreach y control del bucle',
        icon: '🛑',
        exercises: [
          {
            id: 'phpe055', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace break dentro de un bucle?',
            choices: ['Salta a la siguiente vuelta', 'Sale del bucle', 'Repite el bucle', 'Termina el programa'],
            correct: 1,
            explanation: 'break aborta el bucle y el programa sigue por la sentencia siguiente a cerrar las llaves.'
          },
          {
            id: 'phpe056', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace continue?',
            choices: [
              'Sale del bucle',
              'Salta a la siguiente vuelta sin llegar al final',
              'Termina el programa',
              'Imprime una línea'
            ],
            correct: 1,
            explanation: 'continue se salta el resto de esta vuelta. Sirve para ignorar algunos valores.'
          },
          {
            id: 'phpe057', type: 'fill-blank', xp: 20,
            question: 'Salta el 3 en un bucle del 1 al 5:',
            code: '<?php\nfor ($i = 1; $i <= 5; $i++) {\n    if ($i == 3) ___;\n    echo $i;\n}',
            blanks: ['continue'],
            options: ['continue', 'break', 'return', 'exit'],
            correct: 0,
            explanation: 'continue deja pasar el 3 sin imprimirlo y sigue con el 4. Con break el bucle terminaría en el 3.'
          },
          {
            id: 'phpe058', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nforeach ([1, 2, 3] as $x) {\n    if ($x == 2) { continue; }\n    echo $x;\n}',
            output: ['13', '123', '2', 'error'],
            correctOutput: 0,
            explanation: 'El continue salta el echo cuando $x vale 2, así que ese número no aparece y el bucle sigue con el 3.'
          },
          {
            id: 'phpe059', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la ventaja del foreach?',
            choices: [
              'Es más rápido',
              'Recorre un array sin necesitar el índice',
              'Necesita menos memoria',
              'Permite parar antes'
            ],
            correct: 1,
            explanation: 'foreach ($a as $x) te da directamente cada elemento. Antes había que recorrer con un índice.'
          },
          {
            id: 'phpe060', type: 'type-code', xp: 30,
            description: 'Recorre el array ["Ana", "Luis", "Marta"] con un foreach e imprime el nombre de cada uno.',
            starter: '<?php\n$socios = ["Ana", "Luis", "Marta"];\n// Tu foreach aquí',
            solution: '<?php\n$socios = ["Ana", "Luis", "Marta"];\nforeach ($socios as $socio) {\n    echo $socio . " ";\n}',
            explanation: 'foreach recibe primero el array y luego, tras el as, la variable donde va cada elemento. Cada vuelta toma el siguiente.',
            tests: [{ expected: 'Ana Luis Marta \n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 6: ARRAYS
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod6',
    title: 'Arrays',
    subtitle: 'Listas con índice o con clave',
    icon: '📊',
    color: '#6A4C93',
    gradient: 'linear-gradient(135deg, #6A4C93 0%, #9B5DE5 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'php-mod6-les1',
        title: 'Crear y leer arrays',
        icon: '🗂️',
        exercises: [
          {
            id: 'phpe061', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un array en PHP?',
            choices: ['$a = (1, 2, 3);', '$a = [1, 2, 3];', '$a = <1, 2, 3>;', '$a = {1, 2, 3};'],
            correct: 1,
            explanation: 'Con corchetes. La forma antigua array(1, 2, 3) sigue funcionando, pero la moderna es la de corchetes.'
          },
          {
            id: 'phpe062', type: 'multiple-choice', xp: 15,
            question: 'Los índices de un array empiezan en…',
            choices: ['1', '0', '-1', 'count'],
            correct: 1,
            explanation: 'En 0, como en casi todos los lenguajes. El último índice válido es el tamaño menos uno.'
          },
          {
            id: 'phpe063', type: 'fill-blank', xp: 20,
            question: 'Completa el array para que tenga 4, 8 y 15:',
            code: '<?php\n$nums = [___, 8, 15];',
            blanks: ['4'],
            options: ['4', '4;', '"4"', 'int 4'],
            correct: 0,
            explanation: 'Los valores van separados por comas. El primer elemento es el que se acaba de abrir tras el corchete.'
          },
          {
            id: 'phpe064', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$nums = [4, 8, 15];\necho $nums[0] . " " . $nums[2];',
            output: ['4 15', '4 15\n', '04 2', 'error'],
            correctOutput: 0,
            explanation: 'Los índices empiezan en 0, así que $nums[0] es el 4 y $nums[2] es el 15. El punto pega el espacio entre ellos.'
          },
          {
            id: 'phpe065', type: 'multiple-choice', xp: 20,
            question: '¿Cuántos elementos tiene el array [10, 20, 30]?',
            choices: ['2', '3', '4', 'No se puede saber'],
            correct: 1,
            explanation: 'Tres. Para saberlo automáticamente está count($array), que devuelve cuántos elementos hay.'
          },
          {
            id: 'phpe066', type: 'type-code', xp: 30,
            description: 'Crea un array con 4, 8 y 15, e imprime cuántos elementos tiene y el último.',
            starter: '<?php\n// Tu array aquí',
            solution: '<?php\n$nums = [4, 8, 15];\necho count($nums);\necho $nums[2];',
            explanation: 'count dice cuántos elementos hay. Y el último es el que está en la posición count - 1, aquí el 2 que vale 15.',
            tests: [{ expected: '315\n' }]
          }
        ]
      },
      {
        id: 'php-mod6-les2',
        title: 'Arrays con claves y añadir',
        icon: '🔑',
        exercises: [
          {
            id: 'phpe067', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un array con claves propias?',
            choices: [
              '["nombre" => "Ana"]',
              '["nombre": "Ana"]',
              '{"nombre" = "Ana"}',
              '["nombre" = "Ana"]'
            ],
            correct: 0,
            explanation: 'La flecha => une la clave con su valor. Es la forma más típica de guardar datos relacionados.'
          },
          {
            id: 'phpe068', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se añade un elemento al final de un array?',
            choices: ['$a[] = "x";', '$a.add("x");', '$a[3] = "x";', '$a.push = "x";'],
            correct: 0,
            explanation: 'Con corchetes vacíos, PHP añade al final y amplía el array solo. También sirve la función array_push.'
          },
          {
            id: 'phpe069', type: 'fill-blank', xp: 20,
            question: 'Completa la clave para leer el nombre:',
            code: '<?php\n$p = ["nombre" => "Ana"];\necho $p[___];',
            blanks: ['"nombre"'],
            options: ['"nombre"', 'nombre', '0', '=>'],
            correct: 0,
            explanation: 'La clave es un texto, así que va entre comillas. Si pones nombre sin comillas, PHP lo busca como una constante y, al no existir, para el programa.'
          },
          {
            id: 'phpe070', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$a = [];\n$a[] = "uno";\n$a[] = "dos";\necho count($a) . " " . $a[1];',
            output: ['2 dos', '2 uno', '1 dos', 'error'],
            correctOutput: 0,
            explanation: 'Los corchetes vacíos añaden al final, así que queda un array de dos elementos y $a[1] es el segundo.'
          },
          {
            id: 'phpe071', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si lees una clave que no existe?',
            choices: ['Da un error grave', 'Devuelve null y avisa con un warning', 'Devuelve 0', 'Crea la clave'],
            correct: 1,
            explanation: 'PHP no se cae: devuelve null y escribe un aviso. Por eso conviene comprobar con isset antes de leer.'
          },
          {
            id: 'phpe072', type: 'type-code', xp: 30,
            description: 'Crea un array de nombres y añade tres con $a[] =, e imprime cuántos hay y el último.',
            starter: '<?php\n$a = [];\n// Añade tres nombres y míralos',
            solution: '<?php\n$a = [];\n$a[] = "Ana";\n$a[] = "Luis";\n$a[] = "Marta";\necho count($a);\necho $a[2];',
            explanation: 'Con $a[] = el array crece solo al final. Luego count dice cuántos hay y el último está en la posición count - 1.',
            tests: [{ expected: '3Marta\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 7: FUNCIONES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod7',
    title: 'Funciones',
    subtitle: 'Trocea el programa en piezas',
    icon: '⚙️',
    color: '#0077B6',
    gradient: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'php-mod7-les1',
        title: 'Crear y llamar funciones',
        icon: '🔧',
        exercises: [
          {
            id: 'phpe073', type: 'multiple-choice', xp: 15,
            question: '¿Cómo empieza la declaración de una función?',
            choices: ['function sumar($a, $b) { }', 'def sumar($a, $b) { }', 'func sumar($a, $b) { }', 'summar($a, $b) { }'],
            correct: 0,
            explanation: 'Con la palabra function, el nombre, los parámetros entre paréntesis y el cuerpo entre llaves.'
          },
          {
            id: 'phpe074', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se escriben las funciones en PHP?',
            choices: [
              'Solo dentro de main',
              'Fuera, en el mismo fichero o en otro que se incluye',
              'Dentro de los comentarios',
              'En una tabla aparte'
            ],
            correct: 1,
            explanation: 'Normalmente en su propio fichero, y luego se carga con require o include. Aquí se escriben en el mismo fichero.'
          },
          {
            id: 'phpe075', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que declara una función:',
            code: '<?php\n___ sumar($a, $b) {\n    return $a + $b;\n}\necho sumar(3, 4);',
            blanks: ['function'],
            options: ['function', 'return', 'echo', 'public'],
            correct: 0,
            explanation: 'La palabra clave es function. return es lo que devuelve el valor, y echo lo escribe.'
          },
          {
            id: 'phpe076', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nfunction saludar($nombre) {\n    echo "Hola, " . $nombre;\n}\nsaludar("Ana");',
            output: ['Hola, Ana', 'Hola, "Ana"', '$nombre', 'error'],
            correctOutput: 0,
            explanation: 'La función recibe "Ana" como $nombre y lo concatena. Se llama por su nombre, sin nada delante.'
          },
          {
            id: 'phpe077', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace return?',
            choices: ['Sale del programa', 'Devuelve un valor y sale de la función', 'Escribe', 'Crea una variable'],
            correct: 1,
            explanation: 'return entrega el valor y termina la función. Con echo dentro ya no haría falta return.'
          },
          {
            id: 'phpe078', type: 'type-code', xp: 35,
            description: 'Crea una función saludar que imprima "Hola, PHP!" y llámala desde el programa.',
            starter: '<?php\n\n// Tu función aquí\n\necho saludar();',
            solution: '<?php\n\nfunction saludar() {\n    echo "Hola, PHP!";\n}\n\necho saludar();',
            explanation: 'Una función que no recibe nada se declara con los paréntesis vacíos. Al llamarla también van vacíos.',
            tests: [{ expected: 'Hola, PHP!\n' }]
          }
        ]
      },
      {
        id: 'php-mod7-les2',
        title: 'Paso por valor y por referencia',
        icon: '🔄',
        exercises: [
          {
            id: 'phpe079', type: 'multiple-choice', xp: 15,
            question: 'Por defecto, ¿cómo recibe PHP los argumentos?',
            choices: ['Por referencia', 'Por valor', 'Por puntero', 'No los recibe'],
            correct: 1,
            explanation: 'Por valor: la función recibe una copia y no toca la variable original.'
          },
          {
            id: 'phpe080', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara un argumento por referencia?',
            choices: ['function f($x)', 'function f(&$x)', 'function f(*x)', 'function f(&x)'],
            correct: 1,
            explanation: 'Con & delante del nombre: function f(&$x). Entonces la función trabaja con la variable original.'
          },
          {
            id: 'phpe081', type: 'fill-blank', xp: 20,
            question: 'Haz que la función reciba la variable original para poder cambiarla:',
            code: '<?php\nfunction subir(___$n) {\n    $n = $n + 1;\n}\n$x = 5;\nsubir($x);\necho $x;',
            blanks: ['&'],
            options: ['&', '*', '@', '!'],
            correct: 0,
            explanation: 'El & va delante del parámetro, en la declaración, y no en la llamada. Con él la función trabaja con la variable original y al salir $x vale 6.'
          },
          {
            id: 'phpe082', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\nfunction subir($n) { $n = $n + 1; }\n$x = 5;\nsubir($x);\necho $x;',
            output: ['6', '5', '10', 'error'],
            correctOutput: 1,
            explanation: 'Sin & la función recibe una copia y trabaja con ella. Al salir, $x sigue valiendo 5.'
          },
          {
            id: 'phpe083', type: 'predict-output', xp: 25,
            question: '¿Y con & en el parámetro?',
            codeToRun: '<?php\nfunction subir(&$n) { $n = $n + 1; }\n$x = 5;\nsubir($x);\necho $x;',
            output: ['6', '5', '10', 'error'],
            correctOutput: 0,
            explanation: 'Con & la función enlaza $n con la variable original, así que al sumarle 1 el $x de fuera pasa a valer 6.'
          },
          {
            id: 'phpe084', type: 'type-code', xp: 40,
            description: 'Crea una función duplicar que reciba por referencia y multiplique por 2. Llámala con un 5 e imprime el resultado.',
            starter: '<?php\n\n// Tu función aquí\n\n$x = 5;\nduplicar($x);\necho $x;',
            solution: '<?php\n\nfunction duplicar(&$n) {\n    $n = $n * 2;\n}\n\n$x = 5;\nduplicar($x);\necho $x;',
            explanation: 'El &$n hace que la función trabaje con la variable original. Por eso al multiplicar, $x pasa a valer 10.',
            tests: [{ expected: '10\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 8: FUNCIONES DE TEXTO
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod8',
    title: 'Texto y arrays',
    subtitle: 'La biblioteca que se usa cada día',
    icon: '🔤',
    color: '#8338EC',
    gradient: 'linear-gradient(135deg, #8338EC 0%, #B26AE0 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'php-mod8-les1',
        title: 'Funciones de texto',
        icon: '💬',
        exercises: [
          {
            id: 'phpe085', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve strlen("Hola")?',
            choices: ['3', '4', '5', 'H'],
            correct: 1,
            explanation: 'Cuatro: H, o, l, a. strlen cuenta todos los caracteres, incluidos los espacios.'
          },
          {
            id: 'phpe086', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se pasan los textos a mayúsculas?',
            choices: ['strtoupper()', 'upper()', 'toUpper()', 'uppercase()'],
            correct: 0,
            explanation: 'strtoupper() para mayúsculas y strtolower() para minúsculas. Los paréntesis vacíos son parte de la llamada.'
          },
          {
            id: 'phpe087', type: 'fill-blank', xp: 20,
            question: 'Saca las tres primeras letras de "Hola Mundo":',
            code: '<?php\n$s = "Hola Mundo";\necho substr($s, 0, ___);',
            blanks: ['3'],
            options: ['3', '2', '1', '4'],
            correct: 0,
            explanation: 'substr($texto, desde, cuanto): empieza en la posición 0 y coge 3 caracteres, o sea H, o y l.'
          },
          {
            id: 'phpe088', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$s = "Hola Mundo";\necho strlen($s);\necho " ";\necho substr($s, 5);\necho " ";\necho strpos($s, "Mundo");',
            output: ['10 Mundo 5', '9 Mundo 5', '10 Hola Mundo 0', '10 Hola 5'],
            correctOutput: 0,
            explanation: 'strlen da 10 contando el espacio. substr desde la 5 quita "Hola " y deja "Mundo". Y Mundo empieza en la 5.'
          },
          {
            id: 'phpe089', type: 'multiple-choice', xp: 20,
            question: 'Si el texto no aparece, ¿qué devuelve strpos?',
            choices: ['0', 'false', 'null', 'Da error'],
            correct: 1,
            explanation: 'Devuelve false, no -1 como en otros lenguajes. Conviene comprobarlo con !== false.'
          },
          {
            id: 'phpe090', type: 'type-code', xp: 30,
            description: 'Dado el texto "DevQuest", imprime su longitud y su versión en mayúsculas.',
            starter: '<?php\n$nombre = "DevQuest";\n// Imprime longitud y mayúsculas',
            solution: '<?php\n$nombre = "DevQuest";\necho strlen($nombre);\necho " ";\necho strtoupper($nombre);',
            explanation: 'strlen cuenta los caracteres y strtoupper devuelve una copia en mayúsculas sin cambiar la variable original.',
            tests: [{ expected: '8 DEVQUEST\n' }]
          }
        ]
      },
      {
        id: 'php-mod8-les2',
        title: 'Funciones de array',
        icon: '📈',
        exercises: [
          {
            id: 'phpe091', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve array_sum([5, 10, 15])?',
            choices: ['3', '30', '15', 'error'],
            correct: 1,
            explanation: 'La suma de todos los valores: 5 + 10 + 15 = 30. Se usa muchísimo.'
          },
          {
            id: 'phpe092', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve implode?',
            choices: [
              'Convierte un texto en array',
              'Junta los elementos de un array con un separador',
              'Borra un array',
              'Cuenta los elementos'
            ],
            correct: 1,
            explanation: 'implode(", ", $a) convierte un array en un texto separado por comas. explode() hace lo contrario.'
          },
          {
            id: 'phpe093', type: 'fill-blank', xp: 20,
            question: 'Convierte el texto "a-b-c" en un array:',
            code: '<?php\n$partes = ___("-", "a-b-c");\necho count($partes);',
            blanks: ['explode'],
            options: ['explode', 'implode', 'join', 'split'],
            correct: 0,
            explanation: 'explode(separador, texto) corta el texto en un array. implode es justo lo contrario.'
          },
          {
            id: 'phpe094', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$a = ["Ana", "Luis", "Marta"];\necho count($a);\necho " ";\necho implode(", ", $a);\necho " ";\necho array_sum([5, 10, 15]);',
            output: ['3 Ana, Luis, Marta 30', '3 Ana Luis Marta 3', '3  Ana, Luis, Marta 45', 'error'],
            correctOutput: 0,
            explanation: 'count da 3, implode junta los nombres con comas y array_sum suma los números: 30.'
          },
          {
            id: 'phpe095', type: 'multiple-choice', xp: 20,
            question: '¿Qué devuelve in_array(10, [5, 10])?',
            choices: ['true', 'false', '2', 'error'],
            correct: 0,
            explanation: 'true, porque el 10 está dentro. Se usa para preguntar si un valor aparece en un array.'
          },
          {
            id: 'phpe096', type: 'type-code', xp: 30,
            description: 'Con un array de notas [7, 8, 9], imprime cuántas hay, cuál es su suma y cuál es el total de sumar las tres.',
            starter: '<?php\n$notas = [7, 8, 9];\n// Imprime cantidad, suma y total',
            solution: '<?php\n$notas = [7, 8, 9];\n$suma = array_sum($notas);\necho count($notas) . " " . $suma . " " . count($notas) + $suma;',
            explanation: 'count dice cuántas hay y array_sum las suma. Ojo con el orden: el + suma antes que el punto, así que el total sale 3 + 24 = 27 y luego se pega a los otros dos datos.',
            tests: [{ expected: '3 24 27\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 9: FORMULARIOS Y WEB
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod9',
    title: 'PHP en la Web',
    subtitle: 'Lo que hace la web dinámica',
    icon: '🌐',
    color: '#D62828',
    gradient: 'linear-gradient(135deg, #D62828 0%, #A4133C 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'php-mod9-les1',
        title: 'Qué aporta PHP a una web',
        icon: '🕸️',
        exercises: [
          {
            id: 'phpe097', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve PHP en una web?',
            choices: [
              'Para pintar el diseño con colores',
              'Para generar la página en el servidor según los datos',
              'Para escribir los botones',
              'Para guardar las fotos'
            ],
            correct: 1,
            explanation: 'PHP se ejecuta en el servidor y genera el HTML que recibe el navegador. Puede leer datos, hacer cálculos y montar la página.'
          },
          {
            id: 'phpe098', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se ejecuta el código PHP?',
            choices: ['En el navegador del usuario', 'En el servidor', 'En la base de datos', 'En el sistema operativo del usuario'],
            correct: 1,
            explanation: 'En el servidor, antes de enviar la página. Por eso quien usa la web no ve el código PHP, solo el HTML resultante.'
          },
          {
            id: 'phpe099', type: 'fill-blank', xp: 20,
            question: 'Marca el inicio del código PHP dentro de una página HTML:',
            code: '<html>\n<body>\n___\necho "Hola";\n?>\n</body>\n</html>',
            blanks: ['<?php'],
            options: ['<?php', '<php', '<?', '<%php'],
            correct: 0,
            explanation: 'El HTML de alrededor se envía tal cual y el bloque <?php ?> es lo único que se ejecuta en el servidor.'
          },
          {
            id: 'phpe100', type: 'predict-output', xp: 25,
            question: 'Una página con HTML y un bloque PHP. ¿Qué recibe el navegador?',
            codeToRun: '<?php\n$nombre = "Ana";\n?>\n<h1>Hola <?php echo $nombre; ?></h1>',
            output: [
              '<h1>Hola Ana</h1>',
              '<h1>Hola <?php echo $nombre; ?></h1>',
              'Hola Ana',
              'Nada, porque PHP no funciona en el navegador'
            ],
            correctOutput: 0,
            explanation: 'El servidor ejecuta el PHP y lo sustituye por su resultado. El navegador recibe el HTML ya resuelto, sin ver una línea de código PHP.'
          },
          {
            id: 'phpe101', type: 'multiple-choice', xp: 20,
            question: '¿Por qué WordPress y casi toda la web clásica usan PHP?',
            choices: [
              'Porque es el más rápido',
              'Porque los servidores lo tienen instalado de serie y hay mucha gente que lo conoce',
              'Porque es el más moderno',
              'Porque solo funciona en webs'
            ],
            correct: 1,
            explanation: 'Prácticamente cualquier servidor tiene PHP instalado y hay décadas de código y gente que lo domina. Por eso sigue tan presente.'
          },
          {
            id: 'phpe102', type: 'type-code', xp: 35,
            description: 'Genera una página con un <h1> que salude a Ana usando PHP y una variable.',
            starter: '<?php\n// Genera el HTML de un saludo',
            solution: '<?php\n$nombre = "Ana";\necho "<h1>Hola $nombre</h1>";',
            explanation: 'echo escribe etiquetas HTML como si fueran texto. Con comillas dobles, la variable $nombre se sustituye dentro.',
            tests: [{ expected: '<h1>Hola Ana</h1>\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 10: SEGURIDAD Y ERRORES
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod10',
    title: 'Errores Comunes',
    subtitle: 'Lo que falla y por qué',
    icon: '🐛',
    color: '#C1121F',
    gradient: 'linear-gradient(135deg, #C1121F 0%, #E5383B 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'php-mod10-les1',
        title: 'Los errores típicos',
        icon: '⚠️',
        exercises: [
          {
            id: 'phpe103', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el error nº1 al empezar con PHP?',
            choices: [
              'Olvidar el $ delante de una variable',
              'Elegir mal el color',
              'Poner el programa en minúsculas'
            ],
            correct: 0,
            explanation: 'Olvidar el $ es casi universal: la variable se crea sola, vacía, y no da error. Es el fallo más silencioso que hay.'
          },
          {
            id: 'phpe104', type: 'multiple-choice', xp: 15,
            question: 'PHP distingue mayúsculas de minúsculas, ¿verdad?',
            choices: ['Sí: $nombre y $Nombre son distintas', 'No', 'Solo en las funciones', 'Solo en Linux'],
            correct: 0,
            explanation: 'Sí, tanto en las variables como en las funciones. $nombre y $Nombre son dos variables diferentes.'
          },
          {
            id: 'phpe105', type: 'fill-blank', xp: 20,
            question: 'Completa la variable con su signo de dólar:',
            code: '<?php\n___nombre = "Ana";\necho $nombre;',
            blanks: ['$'],
            options: ['$', '&', '@', '%'],
            correct: 0,
            explanation: 'Toda variable empieza por $. Si se te olvida, PHP no avisa: simplemente crea una variable nueva.'
          },
          {
            id: 'phpe106', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$edad = 30;\necho $edad;',
            output: ['30', ' nada', 'error de compilación', '$edad'],
            correctOutput: 0,
            explanation: 'El $ no se imprime: es parte del nombre de la variable. Si se te olvida el $ en el echo, el programa da error.'
          },
          {
            id: 'phpe107', type: 'multiple-choice', xp: 20,
            question: '¿Por qué conviene mostrar los errores mientras aprendes?',
            choices: [
              'Para que quede bonito',
              'Porque te dicen qué línea falla y por qué',
              'Para que el programa vaya más rápido',
              'Para ver los comentarios'
            ],
            correct: 1,
            explanation: 'PHP avisa por pantalla y en el log. Con los avisos a la vista se sabe al instante qué línea es la que falla.'
          },
          {
            id: 'phpe108', type: 'type-code', xp: 30,
            description: 'Programa que declara $n = 7 y avisa con un mensaje distinto si es positivo o si no lo es.',
            starter: '<?php\n$n = 7;\n// Decide con un if / else',
            solution: '<?php\n$n = 7;\nif ($n > 0) {\n    echo "Positivo";\n} else {\n    echo "No positivo";\n}',
            explanation: 'La condición va entre paréntesis. Solo se ejecuta uno de los dos bloques, el que corresponda.',
            tests: [{ expected: 'Positivo\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 11: TODO JUNTO
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod11',
    title: 'Todo Junto',
    subtitle: 'Un programa de principio a fin',
    icon: '🧩',
    color: '#2B9348',
    gradient: 'linear-gradient(135deg, #2B9348 0%, #52B788 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'php-mod11-les1',
        title: 'Combinar todo',
        icon: '🧱',
        exercises: [
          {
            id: 'phpe109', type: 'multiple-choice', xp: 20,
            question: 'Un programa que guarda datos, decide y repite, ¿qué necesita?',
            choices: [
              'Solo echo',
              'Variables, condicionales y bucles, combinadas',
              'Una clase obligatoria',
              'Nada especial'
            ],
            correct: 1,
            explanation: 'Un programa real encadena todo: guarda datos en arrays, usa if para decidir y bucles para recorrer.'
          },
          {
            id: 'phpe110', type: 'multiple-choice', xp: 20,
            question: '¿Qué conviene para partir un programa largo?',
            choices: [
              'Meterlo todo en un solo bloque',
              'Crear funciones con una tarea cada una',
              'Repetir el código',
              'Usar más comentarios'
            ],
            correct: 1,
            explanation: 'Funciones cortas con un nombre claro. Cada una hace una cosa y se puede probar por separado.'
          },
          {
            id: 'phpe111', type: 'fill-blank', xp: 25,
            question: 'Completa el foreach para que recorra las 3 notas del array:',
            code: '<?php\n$notas = [7, 8, 9];\n$suma = 0;\nforeach ($notas as $n) {\n    $suma += ___;\n}',
            blanks: ['$n'],
            options: ['$n', 'notas', 'n', '$suma'],
            correct: 0,
            explanation: 'foreach entrega cada elemento en la variable del as. Con $n sumas la nota de cada vuelta.'
          },
          {
            id: 'phpe112', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$notas = [7, 8, 9];\n$suma = 0;\nforeach ($notas as $n) { $suma += $n; }\necho $suma / count($notas);\necho " ";\necho $suma % count($notas);',
            output: ['8 0', '24 3', '8.0 0.0', '2 2'],
            correctOutput: 0,
            explanation: 'La suma es 24 y al dividirla entre 3 da 8. Y el resto de 24 entre 3 es 0, porque 24 es múltiplo de 3.'
          },
          {
            id: 'phpe113', type: 'multiple-choice', xp: 20,
            question: '¿Qué ventaja tiene sacar la media a una función?',
            choices: [
              'Que corre más rápido',
              'Que el programa queda limpio y la media se puede probar sola',
              'Que ocupa menos memoria',
              'Que evita los arrays'
            ],
            correct: 1,
            explanation: 'La función se ocupa de la media y el resto del programa solo la llama. Además se puede reutilizar en otros sitios.'
          },
          {
            id: 'phpe114', type: 'type-code', xp: 45,
            description: 'Programa completo: con un array de 3 notas, calcula la media con un foreach e imprime si está aprobado.',
            starter: '<?php\n$notas = [7, 8, 9];\n// Calcula la media y decide',
            solution: '<?php\n$notas = [7, 8, 9];\n$suma = 0;\nforeach ($notas as $n) {\n    $suma += $n;\n}\n$media = $suma / count($notas);\nif ($media >= 5) {\n    echo "Aprobado";\n} else {\n    echo "Suspenso";\n}',
            explanation: 'Primero se acumula la suma recorriendo el array, luego se divide entre el número de notas y con un if se decide.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // PHP MÓDULO 12: PROYECTO
  // ═══════════════════════════════════════════════
  {
    id: 'php-mod12',
    title: '🏆 Proyecto: Agenda de Contactos',
    subtitle: 'Un programa completo con arrays y funciones',
    icon: '📒',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'php-mod12-les1',
        title: 'La agenda entera',
        icon: '📒',
        exercises: [
          {
            id: 'phpe115', type: 'multiple-choice', xp: 20,
            question: '¿Por qué guardar los contactos en un array con claves?',
            choices: [
              'Es más corto',
              'Cada contacto queda con su nombre como clave y sus datos como valor',
              'PHP lo obliga',
              'Es más rápido'
            ],
            correct: 1,
            explanation: 'Un array asociativo guarda "Ana" => ["tel" => ...], así que se busca por el nombre y no hace falta recorrerlo entero.'
          },
          {
            id: 'phpe116', type: 'multiple-choice', xp: 20,
            question: '¿Qué función devuelve el número de contactos guardados?',
            choices: ['count()', 'size()', 'length()', 'total()'],
            correct: 0,
            explanation: 'count($agenda) dice cuántos contactos hay. Se usa muchísimo con arrays.'
          },
          {
            id: 'phpe117', type: 'fill-blank', xp: 25,
            question: 'Completa el foreach para que muestre cada contacto:',
            code: '<?php\n$agenda = ["Ana" => "600111222", "Luis" => "600333444"];\nforeach ($agenda as $nombre => $tel) {\n    echo $___ . ": " . $tel;\n}',
            blanks: ['nombre'],
            options: ['nombre', 'tel', 'agenda', 'clave'],
            correct: 0,
            explanation: 'Con "as $clave => $valor" foreach entrega la clave en la primera variable y el valor en la segunda.'
          },
          {
            id: 'phpe118', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: '<?php\n$agenda = ["Ana" => "600111222", "Luis" => "600333444"];\nforeach ($agenda as $nombre => $tel) {\n    echo $nombre . ": " . $tel . " ";\n}',
            output: [
              'Ana: 600111222 Luis: 600333444 ',
              '600111222: Ana 600333444: Luis ',
              'Ana Luis',
              'error'
            ],
            correctOutput: 0,
            explanation: 'Cada vuelta entrega el nombre como clave y el teléfono como valor. El foreach recorre el array en el orden en que se añadió.'
          },
          {
            id: 'phpe119', type: 'multiple-choice', xp: 25,
            question: '¿Cómo se borra un contacto de la agenda?',
            choices: [
              'unset($agenda["Ana"]);',
              'delete($agenda["Ana"]);',
              '$agenda.remove("Ana");',
              'drop($agenda, "Ana");'
            ],
            correct: 0,
            explanation: 'unset() quita la clave del array. Si la clave no estaba, no pasa nada ni avisa.'
          },
          {
            id: 'phpe120', type: 'type-code', xp: 50,
            description: 'Informe de agenda: crea un array con 3 contactos, imprime cuántos hay y muestra cada nombre con su teléfono.',
            starter: '<?php\n$agenda = ["Ana" => "600111222", "Luis" => "600333444"];\n// Amplía la agenda e informa',
            solution: '<?php\n$agenda = ["Ana" => "600111222", "Luis" => "600333444"];\n$agenda["Marta"] = "600555666";\necho count($agenda);\nforeach ($agenda as $nombre => $tel) {\n    echo $nombre . ": " . $tel . " ";\n}',
            explanation: 'Se añade el tercer contacto con $agenda["Marta"], count dice cuántos hay y el foreach los lista uno a uno.',
            tests: [{ expected: '3Ana: 600111222 Luis: 600333444 Marta: 600555666 \n' }]
          }
        ]
      }
    ]
  }
];