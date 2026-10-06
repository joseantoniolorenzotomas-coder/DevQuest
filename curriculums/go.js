// Go Curriculum — El lenguaje de Google
//
// Los ejercicios se ejecutan con goengine.js, un intérprete propio del
// subconjunto que se enseña aquí. El alumno ve la salida real de su programa,
// así que los type-code se validan de verdad.
//
// Convenciones del temario:
//   · Los type-code llevan el armazón completo: package main, func main y las
//     llaves, porque es como se escribe Go de verdad.
//   · predict-output usa el intérprete para calcular la respuesta, así que la
//     opción correcta nunca puede quedar desfasada.
//   · Nada que el motor no soporte: ni goroutines reales, ni canales, ni
//     generics, ni interfaces con métodos múltiples.

window.GO_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // GO MÓDULO 1: TU PRIMER PROGRAMA
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod1',
    title: 'Tu Primer Programa',
    subtitle: 'main, fmt.Println y los verbos de Printf',
    icon: '🐹',
    color: '#00ADD8',
    gradient: 'linear-gradient(135deg, #00ADD8 0%, #007D9C 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod1-les1',
        title: 'La estructura de Go',
        icon: '🏗️',
        exercises: [
          {
            id: 'goe001', type: 'multiple-choice', xp: 10,
            question: '¿Por dónde tiene que empezar un programa de Go?',
            choices: ['Por una función main', 'Por package main', 'Por un import', 'Por una variable'],
            correct: 1,
            explanation: 'Todo programa de Go empieza con package main. Después se importan los paquetes que se necesiten y luego está func main(), que es por donde arranca todo.'
          },
          {
            id: 'goe002', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la función que se ejecuta al arrancar?',
            choices: ['start()', 'main()', 'run()', 'init()'],
            correct: 1,
            explanation: 'func main(). Es el punto de entrada obligatorio: cuando ejecutas el programa, Go busca esa función y empieza por ella. Sin ella, el programa no hace nada.'
          },
          {
            id: 'goe003', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que declara el paquete:',
            code: '___ main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola")\n}',
            blanks: ['package'],
            options: ['package', 'import', 'module', 'use'],
            correct: 0,
            explanation: 'package main va en la primera línea. main es un nombre reservado: es el paquete de los programas ejecutables, el que compila en un binario.'
          },
          {
            id: 'goe004', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este programa?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola, Go!")\n}',
            output: ['Hola, Go!', ' nada', 'error de compilación', 'Hola,'],
            correctOutput: 0,
            explanation: 'Println escribe el texto y salta de línea. El programa entero es obligatorio: package main, import y func main.'
          },
          {
            id: 'goe005', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve el import?',
            choices: [
              'Para descargar archivos',
              'Para usar las funciones de otro paquete, como las de fmt',
              'Para declarar el tipo de las variables',
              'Para salir del programa'
            ],
            correct: 1,
            explanation: 'import "fmt" trae el paquete fmt, que es donde están Println y Printf. Las comillas van siempre: es una cadena.'
          },
          {
            id: 'goe006', type: 'type-code', xp: 30,
            description: 'Escribe un programa Go que imprima "Hola, Go!" y en la línea siguiente "Me alegro de verte".',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Ojo: Println ya salta de línea solo\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hola, Go!")\n\tfmt.Println("Me alegro de verte")\n}',
            explanation: 'Cada Println escribe su línea y salta. Si pones el salto tú también dentro del texto, saldrían dos líneas en blanco.',
            tests: [{ expected: 'Hola, Go!\nMe alegro de verte\n' }]
          }
        ]
      },
      {
        id: 'go-mod1-les2',
        title: 'Println y Printf',
        icon: '🖨️',
        exercises: [
          {
            id: 'goe007', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre Println y Print?',
            choices: [
              'Println mete espacios y salta de línea; Print no hace ninguna de las dos cosas',
              'Println es más rápido',
              'Print solo sirve para números',
              'No hay diferencia'
            ],
            correct: 0,
            explanation: 'Println(1, 2) escribe "1 2" y salta de línea. Print(1, 2) escribe "12" y sigue en la misma línea.'
          },
          {
            id: 'goe008', type: 'multiple-choice', xp: 15,
            question: '¿Qué escribe fmt.Println(1, 2, 3)?',
            choices: ['123', '1 2 3', '1,2,3', '6'],
            correct: 1,
            explanation: 'Println mete un espacio entre cada valor. El 1, el 2 y el 3 salen separados por un espacio y luego un salto de línea.'
          },
          {
            id: 'goe009', type: 'fill-blank', xp: 20,
            question: 'Completa el verbo para imprimir un texto:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Printf("___\\n", "Hola")\n}',
            blanks: ['%s'],
            options: ['%s', '%d', '%v', '%f'],
            correct: 0,
            explanation: 'Printf usa verbos: %s para texto, %d para enteros, %f para decimales y %v para cualquier valor.'
          },
          {
            id: 'goe010', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Suma:", 2+3)\n    fmt.Printf("%d - %d = %d\\n", 10, 4, 10-4)\n}',
            output: ['Suma: 5\n10 - 4 = 6', 'Suma:5\n10 - 4 = 6', '5 6', 'error de compilación'],
            correctOutput: 0,
            explanation: 'Println junta el texto y el número con un espacio, y Printf rellena cada verbo %d con su número en orden.'
          },
          {
            id: 'goe011', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace el verbo %T?',
            choices: [
              'Convierte el valor a texto',
              'Muestra el tipo del valor',
              'Multiplica por 100',
              'Trunca el número'
            ],
            correct: 1,
            explanation: '%T escribe el tipo: fmt.Printf("%T", 5) muestra int. Es muy útil para entender por qué un programa se comporta como se comporta.'
          },
          {
            id: 'goe012', type: 'type-code', xp: 30,
            description: 'Usa Printf para mostrar que el 42 es un número entero y que el "42" es un texto.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Muestra el tipo de cada uno con %T\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Printf("numero: %T\\n", 42)\n\tfmt.Printf("texto: %T\\n", "42")\n}',
            explanation: 'El verbo %T muestra el tipo del valor. Verás int y string, y ya se nota que "42" no puede sumar como el 42.',
            tests: [{ expected: 'numero: int\ntexto: string\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 2: VARIABLES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod2',
    title: 'Variables',
    subtitle: 'var, := y el valor cero',
    icon: '📦',
    color: '#00ADD8',
    gradient: 'linear-gradient(135deg, #00ADD8 0%, #00709C 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod2-les1',
        title: 'Declarar con := y con var',
        icon: '🏷️',
        exercises: [
          {
            id: 'goe013', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace := ?',
            choices: [
              'Declara una variable nueva y le da el valor',
              'Compara dos valores',
              'Convierte un tipo',
              'Repite una línea'
            ],
            correct: 0,
            explanation: 'x := 5 declara la variable x y le asigna 5. Es la forma más rápida y la que más se usa en Go.'
          },
          {
            id: 'goe014', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el error más típico al empezar con Go?',
            choices: [
              'Poner := donde tocaba =',
              'Elegir mal el color',
              'Olvidar el salto de línea'
            ],
            correct: 0,
            explanation: 'Escribir := dos veces sobre la misma variable. La segunda vez Go avisa: esa variable ya existe, y para reasignar toca usar =.'
          },
          {
            id: 'goe015', type: 'fill-blank', xp: 20,
            question: 'Reasigna la variable con el operador que NO la vuelve a declarar:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    edad := 30\n    edad ___ 31\n    fmt.Println(edad)\n}',
            blanks: ['='],
            options: ['=', ':=', '+', '=>'],
            correct: 0,
            explanation: 'Con = reasignas una variable que ya existe. Con := la declararías otra vez y Go daría error.'
          },
          {
            id: 'goe016', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    edad := 30\n    edad = 31\n    fmt.Println(edad)\n}',
            output: ['30', '31', 'error', ' nada'],
            correctOutput: 1,
            explanation: 'La segunda línea reasigna, no declara, así que pasa a valer 31. Con := en la segunda línea el programa no compilaría.'
          },
          {
            id: 'goe017', type: 'multiple-choice', xp: 20,
            question: 'Go, ¿obliga a declarar el tipo de las variables?',
            choices: [
              'Sí, siempre hay que escribir int o string',
              'Se puede omitir cuando usas := porque se deduce del valor',
              'Solo para números',
              'Nunca'
            ],
            correct: 1,
            explanation: 'Con := el tipo se deduce: edad := 30 crea un int. Cuando necesitas ser explícito usas var edad int = 30.'
          },
          {
            id: 'goe018', type: 'type-code', xp: 30,
            description: 'Declara edad con 30, reasígnala a 31 e imprime el valor final.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tedad := 30\n\t// Reasigna a 31 e imprime\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tedad := 30\n\tedad = 31\n\tfmt.Println(edad)\n}',
            explanation: 'La primera vez se declara con := y la segunda se reasigna con un solo =. Confundirlos es el error más común al empezar.',
            tests: [{ expected: '31\n' }]
          }
        ]
      },
      {
        id: 'go-mod2-les2',
        title: 'Valor cero, const y varias variables',
        icon: '0️⃣',
        exercises: [
          {
            id: 'goe019', type: 'multiple-choice', xp: 15,
            question: '¿Qué vale una variable int declarada pero sin valor?',
            choices: ['No vale nada', '0', '-1', 'Da error'],
            correct: 1,
            explanation: 'Es el valor cero: 0 para int, "" para string, false para bool y nil para punteros. Go siempre tiene un valor por defecto.'
          },
          {
            id: 'goe020', type: 'multiple-choice', xp: 15,
            question: '¿Cuál NO es el valor cero de su tipo?',
            choices: ['0 para int', '"" para string', 'false para bool', 'nil para int'],
            correct: 3,
            explanation: 'Un int vale 0, un string vale "" y un bool vale false. El nil es para punteros, mapas, slices y canales: para un int no existe.'
          },
          {
            id: 'goe021', type: 'fill-blank', xp: 20,
            question: 'Declara una variable sin darle valor para que valga 0:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var contador ___\n    fmt.Println(contador)\n}',
            blanks: ['int'],
            options: ['int', '= 0', ':= 0', 'equals'],
            correct: 0,
            explanation: 'var contador int declara la variable y, al no darle valor, toma el valor cero de int, que es 0.'
          },
          {
            id: 'goe022', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var n int\n    var s string\n    var b bool\n    fmt.Println(n, b)\n    fmt.Printf("[%s]\\n", s)\n}',
            output: ['0 false\n[]', '0 false\n[ ]', 'error', 'false 0\n[]'],
            correctOutput: 0,
            explanation: 'int vale 0 y bool vale false. El string vacío no se ve, así que Println pone los corchetes y dentro no hay nada.'
          },
          {
            id: 'goe023', type: 'multiple-choice', xp: 20,
            question: '¿QuéDifference hay entre var y const?',
            choices: [
              'Ninguna, son sinónimos',
              'const guarda un valor que no se puede cambiar',
              'const solo sirve para números',
              'var es más rápido'
            ],
            correct: 1,
            explanation: 'Una constante es un valor fijo. Si intentas reasignarla el programa no compila, y por eso sirve para cosas como el PI.'
          },
          {
            id: 'goe024', type: 'type-code', xp: 35,
            description: 'Declara una constante Pi con valor 3.14, declara un radio de 2 y calcula el área del círculo.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Declara la constante Pi y el radio, y calcula el área\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tconst Pi = 3.14\n\tradio := 2.0\n\tarea := Pi * radio * radio\n\tfmt.Println(area)\n}',
            explanation: 'Las constantes se declaran con const y no se pueden cambiar. El radio tiene .0 para que sea float64 y el área salga con decimales.',
            tests: [{ expected: '12.56\n' }]
          }
        ]
      },
      {
        id: 'go-mod2-les3',
        title: 'Varias variables a la vez',
        icon: '🔄',
        exercises: [
          {
            id: 'goe025', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara la variable a con valor 1 y la b con valor 2?',
            choices: ['a := 1, b := 2', 'a, b := 1, 2', 'a, b = 1, 2', 'var a, b = 1, 2'],
            correct: 1,
            explanation: 'La coma separa los nombres y el := declara. Así de corto: a, b := 1, 2.'
          },
          {
            id: 'goe026', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se intercambian los valores de a y b?',
            choices: [
              'a, b = b, a',
              'swap(a, b)',
              'a = a + b; b = a - b',
              'No se puede'
            ],
            correct: 0,
            explanation: 'a, b = b, a. Go calcula primero los dos lados y luego asigna, así que funciona en una sola línea sin variable auxiliar.'
          },
          {
            id: 'goe027', type: 'fill-blank', xp: 20,
            question: 'Intercambia los valores de x e y:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x, y := 1, 2\n    x, y = ___\n    fmt.Println(x, y)\n}',
            blanks: ['y, x'],
            options: ['y, x', 'x, y', '1, 2', 'x = y'],
            correct: 0,
            explanation: 'Se escribe el orden nuevo a la izquierda: x, y = y, x. Lo que se calcula es y primero y x después.'
          },
          {
            id: 'goe028', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a, b := 1, 2\n    a, b = b, a\n    fmt.Println(a, b)\n}',
            output: ['1 2', '2 1', 'error', '3 3'],
            correctOutput: 1,
            explanation: 'Después del intercambio a vale 2 y b vale 1. Si se asignara de uno en uno, a y b acabarían con el mismo valor.'
          },
          {
            id: 'goe029', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si declaras más variables de las que hay valores?',
            choices: [
              'Las que sobran valen 0',
              'Go avisa de que no cuadran las cantidades',
              'No pasa nada',
              'Da error al ejecutar, no al compilar'
            ],
            correct: 1,
            explanation: 'Go avisa antes de ejecutar: "2 variables a la izquierda pero 1 valor a la derecha". Es un error de compilación, no una sorpresa al ejecutar.'
          },
          {
            id: 'goe030', type: 'type-code', xp: 30,
            description: 'Declara dos números y queda con el valor más grande primero, intercambiándolos si hace falta.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Deja el número más grande primero\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tmayor, menor := 3, 7\n\tif mayor < menor {\n\t\tmayor, menor = menor, mayor\n\t}\n\tfmt.Println(mayor, menor)\n}',
            explanation: 'Dentro del if se usa = para reasignar, porque mayor y menor ya existen. Si usas := dentro del bloque, declararías otras nuevas.',
            tests: [{ expected: '7 3\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 3: TIPOS
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod3',
    title: 'Tipos',
    subtitle: 'Estáticos: no se convierten solos',
    icon: '🔢',
    color: '#2A9D8F',
    gradient: 'linear-gradient(135deg, #2A9D8F 0%, #4ECDC4 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod3-les1',
        title: 'Los tipos básicos',
        icon: '🎲',
        exercises: [
          {
            id: 'goe031', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipo tiene el número 5 en Go?',
            choices: ['float', 'int', 'number', 'double'],
            correct: 1,
            explanation: 'Go tiene enteros (int) y decimales (float64) por separado. El 5 es un int y el 5.0 es un float64.'
          },
          {
            id: 'goe032', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un decimal en Go?',
            choices: ['5.0', '5,0', '5f', 'real(5)'],
            correct: 0,
            explanation: 'Con punto decimal: 5.0 o 1.75. Si pones solo el 5, Go lo toma como entero y algunas operaciones dan un resultado distinto.'
          },
          {
            id: 'goe033', type: 'fill-blank', xp: 20,
            question: 'Declara una variable float64 con el valor 1.75:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    precio := ___\n    fmt.Println(precio)\n}',
            blanks: ['1.75'],
            options: ['1.75', '1,75', '75', '"1.75"'],
            correct: 0,
            explanation: 'Un float64 se escribe con punto decimal. Sin comillas, porque si las pones es un texto y no un número.'
          },
          {
            id: 'goe034', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    entero := 5\n    decimal := 5.0\n    fmt.Printf("%T %T\\n", entero, decimal)\n}',
            output: ['int int', 'int float64', 'float64 int', '5 5'],
            correctOutput: 1,
            explanation: 'El 5 sin punto es int y el 5.0 es float64. Son tipos distintos y por eso Go necesita que conviertas a propósito.'
          },
          {
            id: 'goe035', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el tipo de "Hola"?',
            choices: ['text', 'string', 'char', 'string8'],
            correct: 1,
            explanation: 'En Go los textos son string. No hay char: para un solo carácter se usa rune entre comillas simples, como \'A\'.'
          },
          {
            id: 'goe036', type: 'type-code', xp: 30,
            description: 'Declara un int, un float64, un string y un bool, e imprime el tipo de cada uno con %T.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Un valor de cada tipo y su %T\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tentero := 5\n\tdecimal := 1.75\n\ttexto := "Hola"\n\tactivo := true\n\tfmt.Printf("%T %T %T %T\\n", entero, decimal, texto, activo)\n}',
            explanation: 'Los cuatro tipos básicos de Go: int, float64, string y bool. El verbo %T muestra cuál es cada uno.',
            tests: [{ expected: 'int float64 string bool\n' }]
          }
        ]
      },
      {
        id: 'go-mod3-les2',
        title: 'Conversión de tipos',
        icon: '🔁',
        exercises: [
          {
            id: 'goe037', type: 'multiple-choice', xp: 15,
            question: '¿Cómo conviertes un int en float64?',
            choices: ['float64(x)', 'int(x)', '(float64) x', 'toFloat(x)'],
            correct: 0,
            explanation: 'Se escribe el tipo entre paréntesis delante: float64(x). Es elNombreDelTipo(valor), una función que parece pero es una conversión.'
          },
          {
            id: 'goe038', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa con float64(7) / 2?',
            choices: [
              'Da 3, como la división entre enteros',
              'Da 3.5',
              'Da error',
              'Da 4'
            ],
            correct: 1,
            explanation: 'Al convertir a float64, la división es decimal y da 3.5. Sin convertir, 7 / 2 entre enteros daría 3.'
          },
          {
            id: 'goe039', type: 'fill-blank', xp: 20,
            question: 'Convierte la variable x a float64 para que la división salga con decimales:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 7\n    resultado := ___(x) / 2\n    fmt.Println(resultado)\n}',
            blanks: ['float64'],
            options: ['float64', 'int', 'string', 'bool'],
            correct: 0,
            explanation: 'float64(x) convierte el 7 en decimal, y al dividir entre 2 el resultado conserva la parte decimal: 3.5.'
          },
          {
            id: 'goe040', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 7\n    fmt.Println(x / 2)\n    fmt.Println(float64(x) / 2)\n}',
            output: ['3\n3.5', '3.5\n3.5', '3\n3', 'error'],
            correctOutput: 0,
            explanation: 'Entre enteros la división trunca y da 3. Convierta a float64 y da 3.5. Es la forma de pedir una división decimal en Go.'
          },
          {
            id: 'goe041', type: 'multiple-choice', xp: 20,
            question: 'En Go, ¿un float64 se puede asignar a un int sin más?',
            choices: [
              'Sí, se trunca solo',
              'No, da error: hay que escribir int(x) a propósito',
              'Solo si el número es redondo',
              'Depende del programa'
            ],
            correct: 1,
            explanation: 'Go es de tipado estático y no convierte nada por su cuenta. Si pierdes decimales al convertir, quiere que lo decidas tú.'
          },
          {
            id: 'goe042', type: 'type-code', xp: 35,
            description: 'Calcula el promedio de 3 notas enteros mostrando el resultado con dos decimales.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Convierte a float64 para el promedio y usa %.2f\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\ta, b, c := 7, 8, 9\n\tpromedio := float64(a+b+c) / 3\n\tfmt.Printf("%.2f\\n", promedio)\n}',
            explanation: 'Sin convertir, (7+8+9)/3 entre enteros daría 8. Con float64 da 8 y el verbo %.2f lo muestra con dos decimales.',
            tests: [{ expected: '8.00\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 4: OPERADORES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod4',
    title: 'Operadores',
    subtitle: 'Aritmética, comparación y lógica',
    icon: '➗',
    color: '#E9C46A',
    gradient: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod4-les1',
        title: 'Aritmética y la división entera',
        icon: '🧮',
        exercises: [
          {
            id: 'goe043', type: 'multiple-choice', xp: 15,
            question: '¿Cuánto vale 7 / 2 entre enteros en Go?',
            choices: ['3.5', '3', '4', '2'],
            correct: 1,
            explanation: 'Da 3, porque entre enteros la división descarta la parte decimal. Es lo que más sorprende al venir de Python o JavaScript.'
          },
          {
            id: 'goe044', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se saca la parte decimal de una división?',
            choices: ['7.0 / 2', 'float64(7) / 2', '7 % 2', 'round(7) / 2'],
            correct: 1,
            explanation: 'Con float64(7) / 2 (o 7.0 / 2). Cualquiera de las dos convierte a decimal antes de dividir.'
          },
          {
            id: 'goe045', type: 'fill-blank', xp: 20,
            question: 'Saca el resto de dividir 17 entre 5:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    resto := 17 ___ 5\n    fmt.Println(resto)\n}',
            blanks: ['%'],
            options: ['%', '/', '&', '|'],
            correct: 0,
            explanation: 'El módulo es %. 17 entre 5 son 3 y sobran 2, así que el resto es 2. Sirve para saber si un número es par.'
          },
          {
            id: 'goe046', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a := 17\n    b := 5\n    fmt.Println(a / b)\n    fmt.Println(a % b)\n}',
            output: ['3.4\n2', '3\n2', '3.4\n3', '2\n3'],
            correctOutput: 1,
            explanation: 'La división entre enteros trunca: 3. Y el módulo da lo que sobra, que es 2. Println mete un salto entre cada Println.'
          },
          {
            id: 'goe047', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se comprueba si un número es par?',
            choices: ['n / 2 == 0', 'n % 2 == 0', 'n * 2 == 0', 'n % 0 == 0'],
            correct: 1,
            explanation: 'El resto de dividir entre 2 es 0 justo cuando el número es par.'
          },
          {
            id: 'goe048', type: 'type-code', xp: 30,
            description: 'Declara a = 17 y b = 5, e imprime la división entera y el resto.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\ta := 17\n\tb := 5\n\t// Las dos operaciones en líneas separadas\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\ta := 17\n\tb := 5\n\tfmt.Println(a / b)\n\tfmt.Println(a % b)\n}',
            explanation: 'Cada Println en su línea. La división entre enteros da 3 y el módulo da 2: entre ambos está la información del número.',
            tests: [{ expected: '3\n2\n' }]
          }
        ]
      },
      {
        id: 'go-mod4-les2',
        title: 'Comparación y lógica',
        icon: '⚖️',
        exercises: [
          {
            id: 'goe049', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe "distinto de" en Go?',
            choices: ['!=', '<>', '=<', '!=='],
            correct: 0,
            explanation: 'Es !=. No hay <>, que sí existe en PHP, ni !==, que en Go no hace falta porque los tipos no se mezclan.'
          },
          {
            id: 'goe050', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se invierte una condición?',
            choices: ['!condicion', 'NOT condicion', 'condicion = false', '-condicion'],
            correct: 0,
            explanation: 'El signo de exclamación delante: if !aprobado. Es el único operador lógico de negación.'
          },
          {
            id: 'goe051', type: 'fill-blank', xp: 20,
            question: 'Completa la condición para que sea mayor de edad:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    edad := 20\n    if edad ___ 18 {\n        fmt.Println("Mayor")\n    }\n}',
            blanks: ['>='],
            options: ['>=', '>', '==', '!='],
            correct: 0,
            explanation: 'El >= va dentro de los paréntesis del if. Con > también valdría para 20, pero con 18 daría falso y esa edad sí cuenta.'
          },
          {
            id: 'goe052', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 10\n    fmt.Println(n > 5 && n < 20)\n    fmt.Println(n > 20 || n == 10)\n    fmt.Println(!false)\n}',
            output: ['true\ntrue\ntrue', 'true\nfalse\ntrue', '1\n1\n1', 'error'],
            correctOutput: 0,
            explanation: 'Las condiciones valen true o false, y Println los escribe tal cual. Yikes: true es true porque 10 está entre 5 y 20, 10 es igual a 10, y no falso es cierto.'
          },
          {
            id: 'goe053', type: 'multiple-choice', xp: 20,
            question: 'En Go, ¿se pueden comparar textos con < y >?',
            choices: [
              'Sí, compara letra a letra',
              'No, da error',
              'Solo con ==',
              'Solo con números'
            ],
            correct: 0,
            explanation: 'Sí: "Ana" < "Beto" es true porque compara los caracteres. Y "abc" == "abc" también funciona.'
          },
          {
            id: 'goe054', type: 'type-code', xp: 30,
            description: 'Crea n = 10 e imprime si está entre 5 y 20, y si es distinto de 10.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tn := 10\n\t// Las dos comprobaciones\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tn := 10\n\tfmt.Println(n > 5 && n < 20)\n\tfmt.Println(n != 10)\n}',
            explanation: 'El && exige que las dos partes sean ciertas. Y n != 10 es falso porque n vale exactamente 10, así que sale false.',
            tests: [{ expected: 'true\nfalse\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 5: CONDICIONALES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod5',
    title: 'Condicionales',
    subtitle: 'if y switch sin fallthrough',
    icon: '🔀',
    color: '#E76F51',
    gradient: 'linear-gradient(135deg, #E76F51 0%, #F4A261 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod5-les1',
        title: 'if y else',
        icon: '❓',
        exercises: [
          {
            id: 'goe055', type: 'multiple-choice', xp: 15,
            question: '¿Las llaves del if en Go son obligatorias?',
            choices: [
              'Sí, siempre, aunque solo haya una línea',
              'No, si solo hay una sentencia',
              'Solo para el else',
              'Nunca hacen falta'
            ],
            correct: 0,
            explanation: 'Sí. Go obliga a las llaves siempre, incluso con una sola línea. Es una decisión de diseño del lenguaje para que el código sea uniforme.'
          },
          {
            id: 'goe056', type: 'multiple-choice', xp: 15,
            question: 'Sin else, ¿qué hace un if cuya condición es falsa?',
            choices: ['Imprime algo igualmente', 'No hace nada y sigue', 'Da error', 'Repite el programa'],
            correct: 1,
            explanation: 'Se salta el bloque y el programa continúa con la línea siguiente. Igual que en cualquier lenguaje.'
          },
          {
            id: 'goe057', type: 'fill-blank', xp: 20,
            question: 'Completa el if para que imprima solo si el número es mayor que 3:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 5\n    if n ___ 3 {\n        fmt.Println("Mayor")\n    }\n}',
            blanks: ['>'],
            options: ['>', '<', '!', '=='],
            correct: 0,
            explanation: 'El > va dentro de los paréntesis y sin punto y coma. Las llaves van fuera, como en C, Java o JavaScript.'
          },
          {
            id: 'goe058', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nota := 7\n    if nota >= 5 {\n        fmt.Println("Aprobado")\n    } else {\n        fmt.Println("Suspenso")\n    }\n}',
            output: ['Aprobado', 'Suspenso', 'Las dos', 'Ninguna'],
            correctOutput: 0,
            explanation: '7 >= 5 es cierto, así que entra en el if y el else se salta. Solo se ejecuta uno de los dos bloques.'
          },
          {
            id: 'goe059', type: 'multiple-choice', xp: 20,
            question: 'En Go, ¿el else va pegado al if?',
            choices: [
              'Va en la línea siguiente, separado',
              'Va pegado a la llave de cierre del if',
              'Da igual',
              'Solo en switch'
            ],
            correct: 1,
            explanation: 'Se escribe else pegado a la } del if. En Go es casi siempre el final del bloque: si termina en return, ni se pone else.'
          },
          {
            id: 'goe060', type: 'type-code', xp: 30,
            description: 'Crea nota = 7 e imprime "Aprobado" si es 5 o más y "Suspenso" si no.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnota := 7\n\t// El if / else con sus llaves\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnota := 7\n\tif nota >= 5 {\n\t\tfmt.Println("Aprobado")\n\t} else {\n\t\tfmt.Println("Suspenso")\n\t}\n}',
            explanation: 'La condición va entre paréntesis, las llaves son obligatorias y el else va pegado a la llave del if.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      },
      {
        id: 'go-mod5-les2',
        title: 'switch: sin fallthrough',
        icon: '🎛️',
        exercises: [
          {
            id: 'goe061', type: 'multiple-choice', xp: 15,
            question: '¿Qué tiene de especial el switch de Go?',
            choices: [
              'Cae al siguiente caso si no pones break',
              'No hay fallthrough: cada caso termina solo',
              'Solo admite números',
              'Necesita punto y coma'
            ],
            correct: 1,
            explanation: 'En Go cada case termina solo y no hace falta break. Es una diferencia importante con C, Java o JavaScript.'
          },
          {
            id: 'goe062', type: 'multiple-choice', xp: 15,
            question: '¿Qué separador usan los case de Go?',
            choices: ['Dos puntos (:)', 'Flechas (->)', 'Igual (=)', 'Comas'],
            correct: 0,
            explanation: 'Dos puntos: case 1: y default:. Es lo que distingue a Go de otros lenguajes donde es break o igual.'
          },
          {
            id: 'goe063', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que abre un caso del switch:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    dia := 1\n    switch dia {\n    ___ 1:\n        fmt.Println("Lunes")\n    }\n}',
            blanks: ['case'],
            options: ['case', 'if', 'when', 'option'],
            correct: 0,
            explanation: 'Cada opción del switch se llama case y termina con dos puntos. No hace falta break porque Go no cae al siguiente caso.'
          },
          {
            id: 'goe064', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    dia := 3\n    switch dia {\n    case 1:\n        fmt.Println("Lunes")\n    case 3:\n        fmt.Println("Miercoles")\n    default:\n        fmt.Println("Otro")\n    }\n}',
            output: ['Miercoles', 'Lunes', 'Miercoles\nOtro', 'Otro'],
            correctOutput: 0,
            explanation: 'Solo coincide el case 3 y se ejecuta ese. El case 1 no se mira y el default no se alcanza. No hay break, pero tampoco hace falta.'
          },
          {
            id: 'goe065', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve default?',
            choices: [
              'Para imprimir siempre',
              'Se ejecuta si ningún caso coincide',
              'Es el caso número uno',
              'Da error'
            ],
            correct: 1,
            explanation: 'Es el "si no era ninguno de estos". No es obligatorio, pero evita dejar casos sin cubrir.'
          },
          {
            id: 'goe066', type: 'type-code', xp: 35,
            description: 'Con un switch sobre dia = 1, imprime "Lunes" y nada más, sin usar break.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tdia := 1\n\t// Tu switch aquí\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tdia := 1\n\tswitch dia {\n\tcase 1:\n\t\tfmt.Println("Lunes")\n\tcase 2:\n\t\tfmt.Println("Martes")\n\tdefault:\n\t\tfmt.Println("Otro")\n\t}\n}',
            explanation: 'Con dia = 1 solo se ejecuta el primer case. No hay break, y esa es justamente la gracia del switch de Go.',
            tests: [{ expected: 'Lunes\n' }]
          },
          {
            id: 'goe067', type: 'predict-output', xp: 25,
            question: '¿Qué imprime este switch sin expresión?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 12\n    switch {\n    case n > 10:\n        fmt.Println("grande")\n    case n > 5:\n        fmt.Println("mediano")\n    default:\n        fmt.Println("pequeno")\n    }\n}',
            output: ['grande', 'mediano', 'grande\nmediano', 'pequeno'],
            correctOutput: 0,
            explanation: 'Sin expresión, lo que hay en cada case es una condición. Se ejecuta el primer caso que sea cierto y se para ahí: el segundo ni se mira.'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 6: BUCLES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod6',
    title: 'Bucles',
    subtitle: 'for con tres formas',
    icon: '🔁',
    color: '#264653',
    gradient: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'go-mod6-les1',
        title: 'for clásico y for con condición',
        icon: '🔂',
        exercises: [
          {
            id: 'goe068', type: 'multiple-choice', xp: 15,
            question: '¿Cuántos bucles tiene Go?',
            choices: ['Uno: el for clásico', 'Tres: clásico, con condición y range', 'Dos', 'Cuatro'],
            correct: 1,
            explanation: 'Go tiene una sola palabra clave, for, con tres formas: las tres partes, solo la condición, y range para recorrer.'
          },
          {
            id: 'goe069', type: 'multiple-choice', xp: 15,
            question: 'En Go, ¿existe la palabra while?',
            choices: [
              'Sí, pero está en desuso',
              'No: se usa for sin condición inicial',
              'Sí, y hace falta para el bucle infinito',
              'Solo dentro de funciones'
            ],
            correct: 1,
            explanation: 'No existe while en Go. El equivalente es `for i < 5 { }`, y el bucle infinito es `for { }`.'
          },
          {
            id: 'goe070', type: 'fill-blank', xp: 20,
            question: 'Completa la condición para que el bucle imprima del 1 al 3:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= ___; i++ {\n        fmt.Println(i)\n    }\n}',
            blanks: ['3'],
            options: ['3', '<', 'i++', '1'],
            correct: 0,
            explanation: 'Con i <= 3 el bucle llega a valer 3 y lo imprime. Si pusieras i < 3 se quedaría en el 2.'
          },
          {
            id: 'goe071', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 3; i++ {\n        fmt.Println(i * 2)\n    }\n}',
            output: ['2\n4\n6', '246', '135', '8642'],
            correctOutput: 0,
            explanation: 'Tres vueltas, y en cada una multiplica el valor de i por 2: 2, 4 y 6. Cada Println en su línea.'
          },
          {
            id: 'goe072', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el peligro de un bucle con condición?',
            choices: [
              'Que va muy lento',
              'Que si la condición nunca se hace falsa se queda infinito',
              'Que no admite números',
              'Que necesita llaves'
            ],
            correct: 1,
            explanation: 'Si dentro no cambias la variable de la condición, el bucle no termina. Go lo detecta y avisa en vez de colgarse.'
          },
          {
            id: 'goe073', type: 'type-code', xp: 30,
            description: 'Usa un for para imprimir los números del 1 al 3, cada uno en su línea.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// El for de tres partes\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfor i := 1; i <= 3; i++ {\n\t\tfmt.Println(i)\n\t}\n}',
            explanation: 'Las tres partes: dónde empieza i, hasta cuándo sigue y cómo avanza. El <= incluye el 3, que es lo que hace que salga tres veces.',
            tests: [{ expected: '1\n2\n3\n' }]
          }
        ]
      },
      {
        id: 'go-mod6-les2',
        title: 'range, break y continue',
        icon: '🛑',
        exercises: [
          {
            id: 'goe074', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace break dentro de un bucle?',
            choices: ['Salta a la siguiente vuelta', 'Sale del bucle', 'Repite el bucle', 'Termina el programa'],
            correct: 1,
            explanation: 'break aborta el bucle y el programa sigue por la línea siguiente al cierre. Es igual que en otros lenguajes.'
          },
          {
            id: 'goe075', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve range sobre un slice?',
            choices: ['Solo el valor', 'El índice y el valor', 'Solo el índice', 'La longitud'],
            correct: 1,
            explanation: 'for i, v := range lista da el índice y el valor. Con un solo nombre te da el índice; con _, te da solo el valor.'
          },
          {
            id: 'goe076', type: 'fill-blank', xp: 20,
            question: 'Recorre la lista dando índice y valor:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    lista := []int{10, 20, 30}\n    for i, v := ___ lista {\n        fmt.Println(i, v)\n    }\n}',
            blanks: ['range'],
            options: ['range', 'in', 'over', 'for'],
            correct: 0,
            explanation: 'range es la palabra que recorre. Los nombres que pongas antes del := son el índice y el valor, en ese orden.'
          },
          {
            id: 'goe077', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    for i, v := range []int{10, 20, 30} {\n        if i == 1 {\n            continue\n        }\n        fmt.Println(i, v)\n    }\n}',
            output: ['0 10\n2 30', '0 10\n1 20\n2 30', '10\n30', 'error'],
            correctOutput: 0,
            explanation: 'El continue salta esa vuelta sin imprimirla. Así solo salen el 10 y el 30, y el bucle sigue con el tercero.'
          },
          {
            id: 'goe078', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la forma más natural de recorrer un slice en Go?',
            choices: [
              'Un for clásico con índice',
              'Un for con range',
              'Un while',
              'Con append'
            ],
            correct: 1,
            explanation: 'range te da el índice y el valor sin más cálculo. Es la forma idiomática y la que se lee mejor.'
          },
          {
            id: 'goe079', type: 'type-code', xp: 35,
            description: 'Recorre la lista ["Ana", "Luis", "Marta"] con range e imprime el índice y el nombre.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tlista := []string{"Ana", "Luis", "Marta"}\n\t// El range con índice y valor\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tlista := []string{"Ana", "Luis", "Marta"}\n\tfor i, nombre := range lista {\n\t\tfmt.Println(i, nombre)\n\t}\n}',
            explanation: 'range reparte el índice y el valor entre los dos nombres. Println los separa con un espacio.',
            tests: [{ expected: '0 Ana\n1 Luis\n2 Marta\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 7: FUNCIONES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod7',
    title: 'Funciones',
    subtitle: 'Declarar, llamar y devolver',
    icon: '⚙️',
    color: '#0077B6',
    gradient: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'go-mod7-les1',
        title: 'Declarar funciones',
        icon: '🔧',
        exercises: [
          {
            id: 'goe080', type: 'multiple-choice', xp: 15,
            question: '¿Cómo empieza la declaración de una función en Go?',
            choices: ['function f(a int) int { }', 'func f(a int) int { }', 'def f(a int) int { }', 'f := func(a int) int { }'],
            correct: 1,
            explanation: 'Con func, el nombre, los parámetros con su tipo y el tipo que devuelve antes de la llave.'
          },
          {
            id: 'goe081', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se escriben las funciones en Go?',
            choices: [
              'Solo dentro de main',
              'Fuera de main, en el mismo paquete',
              'Dentro de los comentarios',
              'En una tabla aparte'
            ],
            correct: 1,
            explanation: 'Fuera de main, en cualquier orden del fichero. En Go da igual si la usas antes de declararla.'
          },
          {
            id: 'goe082', type: 'fill-blank', xp: 20,
            question: 'Completa la palabra que declara una función:',
            code: 'package main\n\nimport "fmt"\n\n___ sumar(a, b int) int {\n    return a + b\n}\n\nfunc main() {\n    fmt.Println(sumar(3, 4))\n}',
            blanks: ['func'],
            options: ['func', 'return', 'public', 'def'],
            correct: 0,
            explanation: 'La palabra clave es func. El return es lo que devuelve el valor, y los parámetros llevan su tipo después del nombre.'
          },
          {
            id: 'goe083', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc saludar(nombre string) {\n    fmt.Println("Hola,", nombre)\n}\n\nfunc main() {\n    saludar("Ana")\n}',
            output: ['Hola, Ana', 'Hola,"Ana"', 'error', 'nombre'],
            correctOutput: 0,
            explanation: 'La función recibe "Ana" como nombre y lo imprime con Println, que mete el espacio entre el texto y el nombre.'
          },
          {
            id: 'goe084', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se indica el tipo que devuelve una función?',
            choices: [
              'Se pone detrás: f() int',
              'Se pone antes del nombre: int f()',
              'Con la palabra out',
              'No hace falta decirlo'
            ],
            correct: 0,
            explanation: 'Va detrás del paréntesis de los parámetros: func sumar(a, b int) int. Si no devuelve nada, no se pone nada.'
          },
          {
            id: 'goe085', type: 'type-code', xp: 35,
            description: 'Crea una función sumar que reciba dos números y devuelva su suma, y llámala con 3 y 4.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu función aquí\n\nfunc main() {\n\tfmt.Println(sumar(3, 4))\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc sumar(a, b int) int {\n\treturn a + b\n}\n\nfunc main() {\n\tfmt.Println(sumar(3, 4))\n}',
            explanation: 'Los parámetros llevan su tipo (a, b int) y el tipo que devuelve va también detrás del paréntesis. El return entrega el resultado.',
            tests: [{ expected: '7\n' }]
          }
        ]
      },
      {
        id: 'go-mod7-les2',
        title: 'Varios valores de retorno y defer',
        icon: '🔄',
        exercises: [
          {
            id: 'goe086', type: 'multiple-choice', xp: 15,
            question: '¿Puede una función de Go devolver dos valores?',
            choices: [
              'No, solo uno',
              'Sí: func divide(a, b int) (int, int)',
              'Solo si son del mismo tipo',
              'Con una palabra clave'
            ],
            correct: 1,
            explanation: 'Sí, y es algo muy usado: una función devuelve el valor y un error, o un resultado y un "estaba".'
          },
          {
            id: 'goe087', type: 'multiple-choice', xp: 15,
            question: 'Al llamar a una función que devuelve dos valores, ¿cómo se recogen?',
            choices: [
              'resultado = divide(10, 3)',
              'q, r := divide(10, 3)',
              'q = divide(10, 3).r',
              'divide(10, 3) := q, r'
            ],
            correct: 1,
            explanation: 'Con := y los dos nombres: q, r := divide(10, 3). El primero es el primer valor que devuelve y el segundo el segundo.'
          },
          {
            id: 'goe088', type: 'fill-blank', xp: 20,
            question: 'Completa los dos tipos que devuelve divide:',
            code: 'package main\n\nimport "fmt"\n\nfunc divide(a, b int) (___) {\n    return a / b, a % b\n}\n\nfunc main() {\n    q, r := divide(10, 3)\n    fmt.Println(q, r)\n}',
            blanks: ['int, int'],
            options: ['int, int', 'int int', 'two', 'int'],
            correct: 0,
            explanation: 'Los dos tipos van separados por coma dentro del paréntesis: (int, int). El return también los separa con coma.'
          },
          {
            id: 'goe089', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc divide(a, b int) (int, int) {\n    return a / b, a % b\n}\n\nfunc main() {\n    q, r := divide(10, 3)\n    fmt.Println(q, r)\n}',
            output: ['3 1', '3 1 10 3', 'error', '10 3'],
            correctOutput: 0,
            explanation: '10 entre 3 son 3 y sobran 1. El := recoge los dos valores en orden: primero el cociente, luego el resto.'
          },
          {
            id: 'goe090', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve defer?',
            choices: [
              'Para retrasar el programa',
              'Para ejecutar algo al salir de la función, pase lo que pase',
              'Para declarar una constante',
              'Para provar funciones'
            ],
            correct: 1,
            explanation: 'defer guarda una instrucción para ejecutarla cuando la función termine, incluso si hay un return por el medio.'
          },
          {
            id: 'goe091', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc saludar() {\n    defer fmt.Println("adios")\n    fmt.Println("hola")\n}\n\nfunc main() {\n    saludar()\n}',
            output: ['hola\nadios', 'adios\nhola', 'hola', 'adios'],
            correctOutput: 0,
            explanation: 'El defer se ejecuta AL SALIR de la función, no al declararlo. Así que hola se escribe primero y adios después, aunque esté en la línea de arriba.'
          },
          {
            id: 'goe092', type: 'type-code', xp: 35,
            description: 'Crea una función dividir que devuelva cociente y resto, y llámala con 17 entre 5.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu función aquí\n\nfunc main() {\n\tq, r := dividir(17, 5)\n\tfmt.Println(q, r)\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc dividir(a, b int) (int, int) {\n\treturn a / b, a % b\n}\n\nfunc main() {\n\tq, r := dividir(17, 5)\n\tfmt.Println(q, r)\n}',
            explanation: 'Los dos tipos de retorno van en paréntesis separados por coma, y el return devuelve los dos valores en el mismo orden.',
            tests: [{ expected: '3 2\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 8: ERRORES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod8',
    title: 'Errores',
    subtitle: 'error en lugar de excepciones',
    icon: '⚠️',
    color: '#C1121F',
    gradient: 'linear-gradient(135deg, #C1121F 0%, #E5383B 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'go-mod8-les1',
        title: 'Cómo se manejan los errores',
        icon: '🩹',
        exercises: [
          {
            id: 'goe093', type: 'multiple-choice', xp: 15,
            question: '¿Cómo avisa Go de un error?',
            choices: [
              'Con try / catch',
              'Devolviendo un valor de tipo error',
              'Con una excepción',
              'Escribiendo en la consola'
            ],
            correct: 1,
            explanation: 'Go no tiene excepciones. Una función que puede fallar devuelve un valor de tipo error, y quien llama decide qué hacer.'
          },
          {
            id: 'goe094', type: 'multiple-choice', xp: 15,
            question: '¿Qué es nil en Go?',
            choices: [
              'El valor cero de los punteros, mapas, slices y del propio error',
              'El número 0',
              'Una cadena vacía',
              'Un error genérico'
            ],
            correct: 0,
            explanation: 'nil significa "nada aquí". Un error que vale nil es que no ha pasado nada, así que se comprueba con != nil.'
          },
          {
            id: 'goe095', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se comprueba si hubo error?',
            choices: ['if error != nil', 'if err != nil', 'if error { }', 'try { }'],
            correct: 1,
            explanation: 'if err != nil. Cuando err vale nil es que todo fue bien, así que lo habitual es comprobarlo y salir pronto si no.'
          },
          {
            id: 'goe096', type: 'fill-blank', xp: 20,
            question: 'Crea un error con el texto "no se puede dividir por cero":',
            code: 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nfunc main() {\n    err := errors.New("___")\n    fmt.Println(err)\n}',
            blanks: ['no se puede dividir por cero'],
            options: ['no se puede dividir por cero', 'error', 'division por cero', 'nil'],
            correct: 0,
            explanation: 'errors.New(texto) crea un error con ese mensaje. Es del paquete errors, así que hay que importarlo.'
          },
          {
            id: 'goe097', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nfunc main() {\n    var err error\n    fmt.Println(err)\n}',
            output: ['<nil>', 'nil', 'error', ' nada'],
            correctOutput: 0,
            explanation: 'Un error que no se ha asignado vale nil, y nil se escribe <nil>. Significa que no hay ningún error.'
          },
          {
            id: 'goe098', type: 'multiple-choice', xp: 20,
            question: '¿Por qué Go tiene errores en vez de excepciones?',
            choices: [
              'Porque son más fáciles de escribir',
              'Porque el error se ve en la propia firma de la función y hay que decidir si se comprueba',
              'Porque las excepciones son lentas',
              'Porque no se puede usar'
            ],
            correct: 1,
            explanation: 'La gran ventaja es que al leer la declaración de la función ya sabes si puede fallar. Con excepciones eso no se ve hasta que falla.'
          },
          {
            id: 'goe099', type: 'type-code', xp: 40,
            description: 'Crea una función dividir que devuelva error si el divisor es 0, y úsala con un 10 entre 0 mostrando el mensaje.',
            starter: 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\n// Tu función aquí\n\nfunc main() {\n\tresultado, err := dividir(10, 0)\n\tif err != nil {\n\t\tfmt.Println("Error:", err)\n\t}\n\tfmt.Println(resultado)\n}',
            solution: 'package main\n\nimport (\n\t"errors"\n\t"fmt"\n)\n\nfunc dividir(a, b int) (int, error) {\n\tif b == 0 {\n\t\treturn 0, errors.New("no se puede dividir por cero")\n\t}\n\treturn a / b, nil\n}\n\nfunc main() {\n\tresultado, err := dividir(10, 0)\n\tif err != nil {\n\t\tfmt.Println("Error:", err)\n\t}\n\tfmt.Println(resultado)\n}',
            explanation: 'Cuando puede fallar, la función devuelve (valor, error). Si todo va bien devuelve nil como error, y si no, el valor cero y el motivo.',
            tests: [{ expected: 'Error: no se puede dividir por cero\n0\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 9: SLICES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod9',
    title: 'Slices',
    subtitle: 'Listas de tamaño variable',
    icon: '📊',
    color: '#6A4C93',
    gradient: 'linear-gradient(135deg, #6A4C93 0%, #9B5DE5 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'go-mod9-les1',
        title: 'Crear y recorrer slices',
        icon: '🗂️',
        exercises: [
          {
            id: 'goe100', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un slice en Go?',
            choices: ['[]int{1, 2, 3}', 'list(1, 2, 3)', '{1, 2, 3}', 'Array(1, 2, 3)'],
            correct: 0,
            explanation: 'Con corchetes delante del tipo: []int{1, 2, 3}. El corchete vacío significa "lista de", como en []string o []float64.'
          },
          {
            id: 'goe101', type: 'multiple-choice', xp: 15,
            question: 'Los índices de un slice empiezan en…',
            choices: ['1', '0', '-1', 'count'],
            correct: 1,
            explanation: 'En 0, como en casi todos los lenguajes. El último índice válido es la longitud menos uno.'
          },
          {
            id: 'goe102', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve len de un slice?',
            choices: ['El último elemento', 'Cuántos elementos tiene', 'El tipo', 'Nada'],
            correct: 1,
            explanation: 'len(lista) dice cuántos elementos tiene. También funciona con textos y mapas.'
          },
          {
            id: 'goe103', type: 'fill-blank', xp: 20,
            question: 'Completa el slice con tres números:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nums := []int{4, 8, ___}\n    fmt.Println(nums[2])\n}',
            blanks: ['15'],
            options: ['15', '14', '8', '15}'],
            correct: 0,
            explanation: 'Los elementos van separados por comas dentro de las llaves. nums[2] es el tercero, porque el primer índice es el 0.'
          },
          {
            id: 'goe104', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nums := []int{4, 8, 15}\n    fmt.Println(len(nums))\n    fmt.Println(nums[0], nums[2])\n}',
            output: ['3\n4 15', '4 15\n3', '3\n4 15 8', 'error'],
            correctOutput: 0,
            explanation: 'len dice cuántos hay, que son 3. Y los índices empiezan en 0, así que nums[0] es el 4 y nums[2] es el 15.'
          },
          {
            id: 'goe105', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se imprime un slice entero con %v o Println?',
            choices: ['[1 2 3]', '1,2,3', 'lista de 3', '(1, 2, 3)'],
            correct: 0,
            explanation: 'Como una lista entre corchetes, con los elementos separados por un espacio: [1 2 3].'
          },
          {
            id: 'goe106', type: 'type-code', xp: 30,
            description: 'Crea un slice con 4, 8 y 15, e imprime cuántos elementos tiene y el último.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Tu slice aquí\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnums := []int{4, 8, 15}\n\tfmt.Println(len(nums))\n\tfmt.Println(nums[len(nums)-1])\n}',
            explanation: 'len dice cuántos hay, y el último está en la posición len(nums) - 1. Así funciona con cualquier tamaño.',
            tests: [{ expected: '3\n15\n' }]
          }
        ]
      },
      {
        id: 'go-mod9-les2',
        title: 'append y sub-slices',
        icon: '🔧',
        exercises: [
          {
            id: 'goe107', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se añade un elemento a un slice?',
            choices: ['append(lista, valor)', 'lista.add(valor)', 'lista.push(valor)', 'lista[10] = valor'],
            correct: 0,
            explanation: 'append(lista, valor) devuelve la lista nueva, ya con el valor al final. Hay que guardar el resultado: s = append(s, x).'
          },
          {
            id: 'goe108', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve un sub-slice como lista[1:3]?',
            choices: [
              'Los elementos del 1 al 3, sin el 3',
              'Los elementos del 1 al 2',
              'Los elementos del 0 al 3',
              'Da error'
            ],
            correct: 1,
            explanation: 'Va del índice 1 hasta antes del 3, o sea los elementos 1 y 2. El final es exclusivo, igual que en Python.'
          },
          {
            id: 'goe109', type: 'fill-blank', xp: 20,
            question: 'Amplía el slice con el número 4:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nums := []int{1, 2, 3}\n    nums = ___(nums, 4)\n    fmt.Println(nums)\n}',
            blanks: ['append'],
            options: ['append', 'push', 'add', 'insert'],
            correct: 0,
            explanation: 'append devuelve el slice nuevo, así que hay que guardarlo con =. Olvidar ese = es un error típico.'
          },
          {
            id: 'goe110', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    nums := []int{1, 2, 3}\n    nums = append(nums, 4)\n    fmt.Println(nums)\n    fmt.Println(nums[1:3])\n}',
            output: ['[1 2 3 4]\n[2 3]', '[1 2 3 4]\n[1 2 3]', '[1 2 3]\n[2 3]', 'error'],
            correctOutput: 0,
            explanation: 'append lo añade al final y deja la lista con cuatro elementos. Y lista[1:3] va del 1 hasta antes del 3, o sea 2 y 3.'
          },
          {
            id: 'goe111', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si lees un índice que no existe?',
            choices: [
              'Da 0',
              'El programa avisa de que el índice está fuera de rango',
              'Da error al compilar',
              'Se para el programa'
            ],
            correct: 1,
            explanation: 'Go lo comprueba en tiempo de ejecución y avisa con un mensaje que dice hasta dónde llega la lista, para que se vea cuál fue el error.'
          },
          {
            id: 'goe112', type: 'type-code', xp: 35,
            description: 'Crea un slice con 10 y 20, añade 30 con append e imprime la lista y su longitud.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnums := []int{10, 20}\n\t// Añade el 30 e imprime\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tnums := []int{10, 20}\n\tnums = append(nums, 30)\n\tfmt.Println(nums)\n\tfmt.Println(len(nums))\n}',
            explanation: 'append devuelve la lista nueva, así que hay que guardarla con =. Después, len dice cuántos elementos tiene.',
            tests: [{ expected: '[10 20 30]\n3\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 10: MAPAS
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod10',
    title: 'Mapas',
    subtitle: 'Claves y valores',
    icon: '🗺️',
    color: '#8338EC',
    gradient: 'linear-gradient(135deg, #8338EC 0%, #B26AE0 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'go-mod10-les1',
        title: 'Crear y leer mapas',
        icon: '🔑',
        exercises: [
          {
            id: 'goe113', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un mapa en Go?',
            choices: [
              'map[string]int{"a": 1}',
              'dict{"a": 1}',
              '{"a": 1}',
              'map{"a": 1}'
            ],
            correct: 0,
            explanation: 'map[tipoDeClave]tipoDeValor. El corchete del medio dice de qué tipo son las claves.'
          },
          {
            id: 'goe114', type: 'multiple-choice', xp: 15,
            question: '¿De qué tipo pueden ser las claves de un mapa?',
            choices: [
              'Cualquiera',
              'Solo string o tipos enteros',
              'Solo string',
              'Solo números'
            ],
            correct: 1,
            explanation: 'Las claves tienen que ser comparables con ==, y eso descarta las listas y los mapas. En el curso se usan string e int.'
          },
          {
            id: 'goe115', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve leer una clave que no existe?',
            choices: ['Da error', 'El valor cero de su tipo', 'nil', 'NaN'],
            correct: 1,
            explanation: 'Devuelve el valor cero: 0 para int, "" para string. No da error, y por eso hay un truco para saber si la clave estaba.'
          },
          {
            id: 'goe116', type: 'fill-blank', xp: 20,
            question: 'Crea un mapa con la clave "edad" y el valor 30:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    persona := map[string]int{"edad": ___}\n    fmt.Println(persona["edad"])\n}',
            blanks: ['30'],
            options: ['30', '"30"', 'set', '30.0'],
            correct: 0,
            explanation: 'La clave va entre comillas y el valor sin ellas, porque el valor es un int. Si el valor fuera texto, también iría entre comillas.'
          },
          {
            id: 'goe117', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := map[string]int{"a": 1, "b": 2}\n    fmt.Println(m["a"])\n    fmt.Println(m["b"])\n    fmt.Println(len(m))\n}',
            output: ['1\n2\n2', '1 2 2', '2\n2\n2', 'error'],
            correctOutput: 0,
            explanation: 'Se accede por la clave y len dice cuántas hay, que son dos. La clave "a" vale 1 y la "b" vale 2.'
          },
          {
            id: 'goe118', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se añade un par a un mapa que ya existe?',
            choices: ['m["clave"] = valor', 'm.add("clave", valor)', 'm.push(valor)', 'append(m, valor)'],
            correct: 0,
            explanation: 'Como en un array: m["clave"] = valor. Si la clave no estaba, se crea; si estaba, se cambia el valor.'
          },
          {
            id: 'goe119', type: 'type-code', xp: 35,
            description: 'Crea un mapa de nombres con edades, añade uno más e imprime cuántos hay.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tedades := map[string]int{"Ana": 30, "Luis": 25}\n\t// Añade a Marta e imprime el total\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tedades := map[string]int{"Ana": 30, "Luis": 25}\n\tedades["Marta"] = 28\n\tfmt.Println(len(edades))\n}',
            explanation: 'Asignar a una clave que no estaba la crea. Y len dice cuántas hay ahora: tres.',
            tests: [{ expected: '3\n' }]
          }
        ]
      },
      {
        id: 'go-mod10-les2',
        title: 'Recorrer y borrar en un mapa',
        icon: '🔄',
        exercises: [
          {
            id: 'goe120', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se borra una clave de un mapa?',
            choices: [
              'delete(m, "clave")',
              'm.delete("clave")',
              'm.remove("clave")',
              'unset(m["clave"])'
            ],
            correct: 0,
            explanation: 'delete(mapa, clave). Si la clave no estaba, no pasa nada ni avisa.'
          },
          {
            id: 'goe121', type: 'multiple-choice', xp: 20,
            question: 'Al recorrer un mapa con range, ¿qué dan las dos variables?',
            choices: [
              'El índice y el valor, como en un slice',
              'La clave y el valor',
              'La longitud y la clave',
              'Solo el valor'
            ],
            correct: 1,
            explanation: 'for k, v := range mapa da la clave y el valor. En un slice era el índice y el valor.'
          },
          {
            id: 'goe122', type: 'multiple-choice', xp: 20,
            question: '¿En qué orden sale un mapa al recorrerlo con range?',
            choices: [
              'En el orden en que semeteron las claves',
              'En un orden que no está garantizado',
              'Ordenado alfabéticamente',
              'En orden inverso'
            ],
            correct: 1,
            explanation: 'Go no garantiza el orden. En estos ejercicios el motor ordena las claves para que el resultado sea siempre el mismo.'
          },
          {
            id: 'goe123', type: 'fill-blank', xp: 20,
            question: 'Borra la clave "Ana" del mapa:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := map[string]int{"Ana": 30, "Luis": 25}\n    ___(m, "Ana")\n    fmt.Println(len(m))\n}',
            blanks: ['delete'],
            options: ['delete', 'remove', 'unset', 'pop'],
            correct: 0,
            explanation: 'delete(mapa, clave) quita la clave. Después queda solo Luis, así que len vale 1.'
          },
          {
            id: 'goe124', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := map[string]int{"Ana": 30, "Luis": 25}\n    delete(m, "Ana")\n    fmt.Println(len(m))\n    fmt.Println(m["Ana"])\n}',
            output: ['1\n0', '0\n0', '1\n30', 'error'],
            correctOutput: 0,
            explanation: 'Después de borrar queda un elemento. Y al leer la clave que ya no está, el mapa devuelve el valor cero de int, que es 0.'
          },
          {
            id: 'goe125', type: 'type-code', xp: 40,
            description: 'Recorre un mapa de dos ciudades con su población usando range e imprime cada par.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tpoblacion := map[string]int{"Madrid": 3000000, "Bilbao": 350000}\n\t// Recorre con range e imprime\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tpoblacion := map[string]int{"Madrid": 3000000, "Bilbao": 350000}\n\tfor ciudad, gente := range poblacion {\n\t\tfmt.Println(ciudad, gente)\n\t}\n}',
            explanation: 'Con range, la primera variable es la clave y la segunda el valor. En estos ejercicios el orden es siempre el mismo para que puedas comparar.',
            tests: [{ expected: 'Bilbao 350000\nMadrid 3000000\n' }]
          },
          {
            id: 'goe126', type: 'predict-output', xp: 25,
            question: '¿Qué imprime v, ok := m["Ana"] si el mapa está vacío?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := map[string]int{}\n    v, ok := m["Ana"]\n    fmt.Println(v, ok)\n}',
            output: ['0 false', 'nil false', '0 true', 'error'],
            correctOutput: 0,
            explanation: 'v vale el cero del tipo, que es 0, y ok vale false porque la clave no estaba. Es la forma de preguntar "¿existe esta clave?" sin ambigüedad.'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 11: STRUCTS
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod11',
    title: 'Structs',
    subtitle: 'Agrupar datos y métodos',
    icon: '🧱',
    color: '#D62828',
    gradient: 'linear-gradient(135deg, #D62828 0%, #A4133C 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'go-mod11-les1',
        title: 'Definir y usar structs',
        icon: '🏛️',
        exercises: [
          {
            id: 'goe127', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara un struct?',
            choices: [
              'type Punto struct { x int; y int }',
              'struct Punto { x int }',
              'class Punto { x: int }',
              'type Punto = {x: int}'
            ],
            correct: 0,
            explanation: 'Con type, el nombre, struct y las llaves. Cada campo lleva su nombre y su tipo.'
          },
          {
            id: 'goe128', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se crea un struct con valores?',
            choices: [
              'p := Punto{x: 3, y: 4}',
              'p := new(Punto)',
              'p := Punto{3, 4}',
              'p = {x: 3}'
            ],
            correct: 0,
            explanation: 'Con el nombre del tipo y las llaves. Se nombra cada campo con su dos puntos, que es lo que evita confundir el orden.'
          },
          {
            id: 'goe129', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se lee un campo?',
            choices: ['p.x', 'p["x"]', 'p->x', 'x.p'],
            correct: 0,
            explanation: 'Con el punto: p.x. El punto también sirve para llamar a los métodos del struct.'
          },
          {
            id: 'goe130', type: 'fill-blank', xp: 20,
            question: 'Crea un struct Punto y llámalo con x = 3 e y = 4:',
            code: 'package main\n\nimport "fmt"\n\ntype Punto struct {\n    x int\n    y int\n}\n\nfunc main() {\n    p := Punto{x: 3, y: ___}\n    fmt.Println(p.x, p.y)\n}',
            blanks: ['4'],
            options: ['4', '"4"', '4.0', 'y'],
            correct: 0,
            explanation: 'Cada campo se nombra con su dos puntos y el valor. Así da igual el orden en que los escribas.'
          },
          {
            id: 'goe131', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\ntype Punto struct {\n    x int\n    y int\n}\n\nfunc main() {\n    p := Punto{x: 3, y: 4}\n    fmt.Println(p.x, p.y)\n}',
            output: ['3 4', '3, 4', 'Punto{3 4}', 'error'],
            correctOutput: 0,
            explanation: 'Se accede a cada campo con el punto y Println los separa con un espacio.'
          },
          {
            id: 'goe132', type: 'multiple-choice', xp: 20,
            question: 'Un struct declarado pero sin crear, ¿qué valen sus campos?',
            choices: ['No existe', 'El valor cero de cada tipo', 'undefined', 'Da error'],
            correct: 1,
            explanation: 'var p Punto crea el struct con todos sus campos al valor cero: los int a 0 y los string a "".'
          },
          {
            id: 'goe133', type: 'type-code', xp: 35,
            description: 'Declara un struct Rectángulo con base y alto, créalo con 3 y 4 e imprime su área.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu struct aquí\n\nfunc main() {\n\tr := Rect{base: 3, alto: 4}\n\tfmt.Println(r.base * r.alto)\n}',
            solution: 'package main\n\nimport "fmt"\n\ntype Rect struct {\n\tbase int\n\talto int\n}\n\nfunc main() {\n\tr := Rect{base: 3, alto: 4}\n\tfmt.Println(r.base * r.alto)\n}',
            explanation: 'type Rect struct agrupa los dos campos. Luego se crea con base y alto y se accede a ellos con el punto.',
            tests: [{ expected: '12\n' }]
          }
        ]
      },
      {
        id: 'go-mod11-les2',
        title: 'Métodos y punteros',
        icon: '🎯',
        exercises: [
          {
            id: 'goe134', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se declara un método?',
            choices: [
              'func (r Rect) Area() int { return r.base * r.alto }',
              'func Rect.Area(r Rect) int { }',
              'method Rect Area() { }',
              'func area(r Rect) int { }'
            ],
            correct: 0,
            explanation: 'Con func, y entre paréntesis el receptor: (r Rect). Después el nombre del método y sus parámetros.'
          },
          {
            id: 'goe135', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la diferencia entre un receptor de valor y uno de puntero?',
            choices: [
              'Ninguna',
              'Con puntero el método puede modificar el struct de fuera; con valor solo ve una copia',
              'El de puntero es más rápido',
              'Solo uno de los dos compila'
            ],
            correct: 1,
            explanation: 'Go pasa por valor, así que un receptor de valor recibe una copia y no puede cambiar lo de fuera. El de puntero sí puede.'
          },
          {
            id: 'goe136', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace &Struct en Go?',
            choices: [
              'Crea un struct vacío',
              'Toma la dirección del struct para poder modificarlo',
              'Lo convierte a texto',
              'Duplica el struct'
            ],
            correct: 1,
            explanation: '&variable toma su dirección. Con esa dirección, un método de puntero puede escribir en el struct original.'
          },
          {
            id: 'goe137', type: 'fill-blank', xp: 20,
            question: 'Completa el receptor de puntero para que el método pueda modificar el struct:',
            code: 'package main\n\nimport "fmt"\n\ntype Contador struct {\n    n int\n}\n\nfunc (c ___Contador) Suma() {\n    c.n++\n}\n\nfunc main() {\n    cont := &Contador{}\n    cont.Suma()\n    cont.Suma()\n    fmt.Println(cont.n)\n}',
            blanks: ['*'],
            options: ['*', '&', '', '->'],
            correct: 0,
            explanation: 'El asterisco va delante del tipo: (c *Contador). Con él el método recibe la dirección y puede cambiar el struct de fuera.'
          },
          {
            id: 'goe138', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\ntype Contador struct {\n    n int\n}\n\nfunc (c *Contador) Suma() {\n    c.n++\n}\n\nfunc main() {\n    cont := &Contador{}\n    cont.Suma()\n    cont.Suma()\n    fmt.Println(cont.n)\n}',
            output: ['2', '0', '1', 'error'],
            correctOutput: 0,
            explanation: 'El receptor de puntero recibe la dirección del struct, así que cada Suma sí se queda guardado. Con un receptor de valor saldría 0.'
          },
          {
            id: 'goe139', type: 'predict-output', xp: 25,
            question: '¿Y con un receptor de valor?',
            codeToRun: 'package main\n\nimport "fmt"\n\ntype Contador struct {\n    n int\n}\n\nfunc (c Contador) Suma() {\n    c.n++\n}\n\nfunc main() {\n    cont := Contador{}\n    cont.Suma()\n    cont.Suma()\n    fmt.Println(cont.n)\n}',
            output: ['2', '0', '1', 'error'],
            correctOutput: 1,
            explanation: 'Con receptor de valor, cada llamada recibe una COPIA del struct. El c.n++ se pierde al salir, así que el struct de fuera sigue a 0.'
          },
          {
            id: 'goe140', type: 'type-code', xp: 45,
            description: 'Crea un struct Contador con un método Suma de puntero, llámalo dos veces e imprime el total.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu struct y tu método aquí\n\nfunc main() {\n\tcont := &Contador{}\n\tcont.Suma()\n\tcont.Suma()\n\tfmt.Println(cont.n)\n}',
            solution: 'package main\n\nimport "fmt"\n\ntype Contador struct {\n\tn int\n}\n\nfunc (c *Contador) Suma() {\n\tc.n++\n}\n\nfunc main() {\n\tcont := &Contador{}\n\tcont.Suma()\n\tcont.Suma()\n\tfmt.Println(cont.n)\n}',
            explanation: 'El & al crear el struct y el * en el receptor son las dos piezas: una da la dirección y la otra la usa para modificar el struct de fuera.',
            tests: [{ expected: '2\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 12: CONCURRENCIA
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod12',
    title: 'Concurrencia',
    subtitle: 'Goroutines y canales, la gracia de Go',
    icon: '⚡',
    color: '#8338EC',
    gradient: 'linear-gradient(135deg, #8338EC 0%, #5A189A 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'go-mod12-les1',
        title: 'Goroutines y canales',
        icon: '🧵',
        exercises: [
          {
            id: 'goe141', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una goroutine?',
            choices: [
              'Un hilo del sistema operativo',
              'Una función que se ejecuta a la vez que el resto del programa',
              'Un tipo de variable',
              'Un bucle paralelo'
            ],
            correct: 1,
            explanation: 'Es una función que se lanza con go y sigue su camino mientras el programa continúa. Go crea muchas más porque son muy baratas.'
          },
          {
            id: 'goe142', type: 'multiple-choice', xp: 15,
            question: '¿Con qué palabra se lanza una goroutine?',
            choices: ['go f()', 'async f()', 'thread f()', 'run f()'],
            correct: 0,
            explanation: 'Con go delante de la llamada: go saludar(). A partir de ahí sigue en segundo plano hasta que termine.'
          },
          {
            id: 'goe143', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un canal?',
            choices: [
              'Para guardar archivos',
              'Para que una goroutine pase datos a otra y las coordine',
              'Para declarar un canal de televisión',
              'Para cerrar el programa'
            ],
            correct: 1,
            explanation: 'Un canal es una vía por la que una goroutine envía valores a otra. Así se coordinan sin compartir memoria, que es el problema clásico.'
          },
          {
            id: 'goe144', type: 'multiple-choice', xp: 20,
            question: '¿Por qué Go se usa tanto en servidores?',
            choices: [
              'Porque las goroutines hacen muchas cosas a la vez con pocas máquinas',
              'Porque es el lenguaje más rápido',
              'Porque tiene más funciones',
              'Porque ocupa menos memoria'
            ],
            correct: 0,
            explanation: 'Un servidor en Go maneja miles de conexiones a la vez con unas pocas goroutines, y eso hace que rinda mucho con poco equipo.'
          },
          {
            id: 'goe145', type: 'multiple-choice', xp: 20,
            question: '¿Qué dos cosas se pueden hacer con un canal?',
            choices: [
              'Leer y escribir valores',
              'Abrir y cerrar',
              'Crear y borrar',
              'Crear y destruir'
            ],
            correct: 0,
            explanation: 'Enviar y recibir. Con esas dos operaciones, una goroutine entrega el resultado y otra lo espera.'
          },
          {
            id: 'goe146', type: 'type-code', xp: 35,
            description: 'Escribe una función saludar que imprima "Hola" y llámala desde main.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu función aquí\n\nfunc main() {\n\tsaludar()\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc saludar() {\n\tfmt.Println("Hola")\n}\n\nfunc main() {\n\tsaludar()\n}',
            explanation: 'Una función normal se escribe como siempre. Luego, con go delante, se puede lanzar en segundo plano: go saludar().',
            tests: [{ expected: 'Hola\n' }]
          },
          {
            id: 'goe147', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el problema clásico de compartir memoria entre goroutines?',
            choices: [
              'Que la memoria se llena',
              'Que dos puedan tocarla a la vez y no saber qué valor se leería',
              'Que el programa se hace lento',
              'Que no compila'
            ],
            correct: 1,
            explanation: 'Se llama "condición de carrera": dos goroutines leen y escriben lo mismo sin orden. Go lo resuelve con canales y con el keyword sync.'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 13: ERRORES COMUNES
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod13',
    title: 'Errores Comunes',
    subtitle: 'Lo que falla y por qué',
    icon: '🐛',
    color: '#C1121F',
    gradient: 'linear-gradient(135deg, #C1121F 0%, #9B2226 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'go-mod13-les1',
        title: 'Los errores típicos',
        icon: '⚠️',
        exercises: [
          {
            id: 'goe148', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el error nº1 al escribir Go?',
            choices: [
              'Usar := donde tocaba =',
              'Elegir mal el nombre del paquete',
              'Poner el programa en minúsculas'
            ],
            correct: 0,
            explanation: 'Escribir := dos veces sobre la misma variable. Go lo detecta al compilar y avisa de que para reasignar hace falta =.'
          },
          {
            id: 'goe149', type: 'multiple-choice', xp: 15,
            question: '¿Go distingue mayúsculas de minúsculas?',
            choices: [
              'Sí: nombre y Nombre son dos cosas distintas',
              'No',
              'Solo en las funciones',
              'Solo en Windows'
            ],
            correct: 0,
            explanation: 'Sí, en todo. Y por eso los nombres de tipo y de función empiezan en mayúscula por convención cuando se exportan.'
          },
          {
            id: 'goe150', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la sorpresa de las llaves en Go?',
            choices: [
              'Son opcionales',
              'Son obligatorias siempre, incluso con una sola línea',
              'Solo hacen falta en los bucles',
              'Hay que ponerlas en la misma línea'
            ],
            correct: 1,
            explanation: 'Siempre hacen falta. En otros lenguajes puedes quitar las llaves de una sola línea y en Go no.'
          },
          {
            id: 'goe151', type: 'fill-blank', xp: 20,
            question: 'La segunda edad da error. Pon el operador correcto para reasignarla:',
            code: 'package main\n\nimport "fmt"\n\nfunc main() {\n    edad := 30\n    edad ___ 31\n    fmt.Println(edad)\n}',
            blanks: ['='],
            options: ['=', ':=', '+', '>'],
            correct: 0,
            explanation: 'La segunda vez la variable ya existe, así que := daría error. Con = simplemente se reasigna, y ahora imprime 31.'
          },
          {
            id: 'goe152', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 7\n    fmt.Println(n / 2)\n    fmt.Println(float64(n) / 2)\n}',
            output: ['3\n3.5', '3.5\n3.5', '3\n3', 'error'],
            correctOutput: 0,
            explanation: 'Entre enteros trunca y da 3. Convierta a float64 y da 3.5. Es la forma de pedir una división con decimales en Go.'
          },
          {
            id: 'goe153', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si usas una variable que no has declarado?',
            choices: [
              'Vale 0 y sigue',
              'Go avisa de que no está declarada, incluso antes de ejecutar',
              'Se crea vacía',
              'Imprime nada'
            ],
            correct: 1,
            explanation: 'Go comprueba al compilar, así que ni llega a ejecutarse. Es una ventaja: muchos fallos se ven sin lanzar el programa.'
          },
          {
            id: 'goe154', type: 'type-code', xp: 35,
            description: 'Declara un número de intentos y calcula el promedio con decimales, convirtiendo a float64.',
            starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n\t// Declara 3 intentos, calcula el promedio y muéstralo\n}',
            solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n\ta, b, c := 7, 8, 9\n\tpromedio := float64(a+b+c) / 3\n\tfmt.Println(promedio)\n}',
            explanation: 'Sin convertir, la división entre enteros trunca. Con float64 el promedio conserva los decimales.',
            tests: [{ expected: '8\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // GO MÓDULO 14: PROYECTO
  // ═══════════════════════════════════════════════
  {
    id: 'go-mod14',
    title: '🏆 Proyecto: Inventario de una Tienda',
    subtitle: 'Structs, slices y mapas juntos',
    icon: '🏪',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'go-mod14-les1',
        title: 'El inventario entero',
        icon: '🏪',
        exercises: [
          {
            id: 'goe155', type: 'multiple-choice', xp: 20,
            question: '¿Por qué guardar cada producto en un struct?',
            choices: [
              'Es más corto',
              'Para agrupar los datos de un producto y poder pasarles por un método',
              'PHP lo obliga',
              'Es más rápido'
            ],
            correct: 1,
            explanation: 'Un struct agrupa lo que pertenece a un mismo producto, y sus campos, para que no se mezclen los datos de uno con los de otro.'
          },
          {
            id: 'goe156', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve append al construir el inventario?',
            choices: [
              'Para ordenar',
              'Para añadir productos a la lista uno a uno',
              'Para borrar',
              'Para contar'
            ],
            correct: 1,
            explanation: 'Se empieza con un slice vacío y se va añadiendo cada producto con append. Así el inventario crece según se lee.'
          },
          {
            id: 'goe157', type: 'multiple-choice', xp: 20,
            question: '¿Qué método pondrías en un struct Producto?',
            choices: [
              'Una función que calcule su valor total',
              'Un color',
              'Un comentario',
              'Nada'
            ],
            correct: 0,
            explanation: 'Los métodos agrupan el comportamiento junto a los datos. Un método Valor() en el struct Producto es lo natural: sabe multiplicar precio por cantidad.'
          },
          {
            id: 'goe158', type: 'fill-blank', xp: 25,
            question: 'Completa el método que devuelve el valor total de un producto:',
            code: 'package main\n\nimport "fmt"\n\ntype Producto struct {\n    nombre string\n    precio float64\n    unidades int\n}\n\nfunc (p Producto) Valor() float64 {\n    return p.precio * float64(___)\n}\n\nfunc main() {\n    prod := Producto{nombre: "Pan", precio: 1.5, unidades: 4}\n    fmt.Println(prod.Valor())\n}',
            blanks: ['p.unidades'],
            options: ['p.unidades', 'unidades', 'prod.unidades', 'p.precio'],
            correct: 0,
            explanation: 'El precio es float64 y las unidades son int, así que hay que convertir para poder multiplicarlos. Sin eso, Go daría error de tipos.'
          },
          {
            id: 'goe159', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'package main\n\nimport "fmt"\n\ntype Producto struct {\n    nombre    string\n    precio    float64\n    unidades  int\n}\n\nfunc (p Producto) Valor() float64 {\n    return p.precio * float64(p.unidades)\n}\n\nfunc main() {\n    pan := Producto{nombre: "Pan", precio: 1.5, unidades: 4}\n    fmt.Println(pan.Valor())\n}',
            output: ['6', '6.0', '1.5', 'error'],
            correctOutput: 0,
            explanation: '1.5 por 4 son 6. Go escribe el float sin el .0 cuando es entero, así que sale 6 y no 6.0.'
          },
          {
            id: 'goe160', type: 'multiple-choice', xp: 25,
            question: '¿Cómo se recorre una lista de structs con range?',
            choices: [
              'for _, p := range lista',
              'for i := range lista',
              'for lista { }',
              'for p of lista'
            ],
            correct: 0,
            explanation: 'El índice y el valor: for i, p := range lista. Con el _ se descarta el índice porque no hace falta.'
          },
          {
            id: 'goe161', type: 'type-code', xp: 50,
            description: 'Crea un struct Producto con nombre, precio y unidades, y un método que devuelva su valor total. Imprime el valor de dos productos.',
            starter: 'package main\n\nimport "fmt"\n\n// Tu struct y tu método aquí\n\nfunc main() {\n\tpan := Producto{nombre: "Pan", precio: 1.5, unidades: 4}\n\tleche := Producto{nombre: "Leche", precio: 1.2, unidades: 2}\n\tfmt.Println(pan.Valor(), leche.Valor())\n}',
            solution: 'package main\n\nimport "fmt"\n\ntype Producto struct {\n\tnombre   string\n\tprecio   float64\n\tunidades int\n}\n\nfunc (p Producto) Valor() float64 {\n\treturn p.precio * float64(p.unidades)\n}\n\nfunc main() {\n\tpan := Producto{nombre: "Pan", precio: 1.5, unidades: 4}\n\tleche := Producto{nombre: "Leche", precio: 1.2, unidades: 2}\n\tfmt.Println(pan.Valor(), leche.Valor())\n}',
            explanation: 'El struct agrupa los tres datos de un producto y el método devuelve su valor. Ojo con convertir unidades a float64: precio es decimal y unidades es entero.',
            tests: [{ expected: '6 2.4\n' }]
          }
        ]
      }
    ]
  }
];