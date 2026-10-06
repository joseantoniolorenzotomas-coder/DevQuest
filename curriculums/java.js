// Java Curriculum — El lenguaje de las apps’entreprise
//
// Los ejercicios se ejecutan con javaengine.js, un intérprete propio del
// subconjunto que se enseña aquí. El alumno ve la salida real de su
// programa, así que los(type-code) se validan de verdad.
//
// Convenciones del temario:
//   · Los(type-code) siempre traen la classe y el main completos, porque es
//     como se escribe Java de verdad.
//   · predict-output usa el intérprete para calcular la respuesta, así que
//     la opción correcta nunca puede estar desfasada.
//
// La contraseña del modo administrador permite saltar al contenido para
// testearlo sin encadenar lecciones.

window.JAVA_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 1: TU PRIMER PROGRAMA
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod1',
    title: 'Tu Primer Programa',
    subtitle: 'La clase, el main y el print',
    icon: '☕',
    color: '#E76F00',
    gradient: 'linear-gradient(135deg, #E76F00 0%, #5382A1 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'java-mod1-les1',
        title: 'La estructura de Java',
        icon: '🏛️',
        exercises: [
          {
            id: 'javae001', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se llama el método por donde siempre empieza un programa Java?',
            choices: ['start', 'main', 'run', 'init'],
            correct: 1,
            explanation: 'Es public static void main(String[] args). El sistema busca ese método concreto y ejecuta lo que hay dentro.'
          },
          {
            id: 'javae002', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa public en "public class Main"?',
            choices: ['Que la clase es pública', 'Que hay que pagar por ella', 'Que solo la puede ver Java', 'Que es rápida'],
            correct: 0,
            explanation: 'public es un modificador de acceso: cualquiera puede usar esa clase. Si no lo pones, la clase es privada.'
          },
          {
            id: 'javae003', type: 'fill-blank', xp: 20,
            question: 'Completa el método main:',
            code: 'public static void main(String[] ___args) {\n    System.out.println("Hola");\n}',
            blanks: ['[]'],
            options: ['[]', '{}', '()', '<>'],
            correct: 0,
            explanation: 'String[] args es un array de textos que Java pasa al programa. Aunque no lo uses, la firma debe ser esa.'
          },
          {
            id: 'javae004', type: 'predict-output', xp: 20,
            question: '¿Qué imprime este programa?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola, Java!");\n    }\n}',
            output: ['Hola, Java!', ' nada', 'error de compilación', 'Hola'],
            correctOutput: 0,
            explanation: 'System.out.println entre paréntesis y comillas imprime ese texto tal cual, y añade el salto de línea.'
          },
          {
            id: 'javae005', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre println y print?',
            choices: ['print no existe', 'println añade un salto de línea al final; print no', 'println es más rápido', 'print imprime en mayúsculas'],
            correct: 1,
            explanation: 'La "ln" de println significa "line new": añade un salto. Con print, la siguiente salida seguiría en la misma línea.'
          },
          {
            id: 'javae006', type: 'type-code', xp: 30,
            description: 'Escribe un programa completo que imprima "Hola, Java!" seguido de otra línea con "Me alegro de verte".',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Tu código aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola, Java!");\n        System.out.println("Me alegro de verte");\n    }\n}',
            explanation: 'Un programa Java necesita la clase y el main. Cada println imprime una línea, y el punto y coma cierra la sentencia: en Java es obligatorio.',
            tests: [{ expected: 'Hola, Java!\nMe alegro de verte\n' }]
          }
        ]
      },
      {
        id: 'java-mod1-les2',
        title: 'Comentarios y orden',
        icon: '📝',
        exercises: [
          {
            id: 'javae007', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un comentario de una línea en Java?',
            choices: ['// esto es un comentario', '# esto es un comentario', '<!-- esto es un comentario -->', '/* esto */'],
            correct: 0,
            explanation: 'Doble barra para una línea y /* ... */ para varias. Los comentarios no se ejecutan y no ocupan memoria.'
          },
          {
            id: 'javae008', type: 'fill-blank', xp: 20,
            question: 'Añade un comentario antes del print:',
            code: '___\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola");\n    }\n}',
            blanks: ['// Este programa saluda'],
            options: ['// Este programa saluda', '// Hola', '/* Este programa saluda */'],
            correct: 0,
            explanation: 'El texto entre // es libre: no se ejecuta. Sirve para explicar qué hace el código, y las IDEs lo colorean.'
          },
          {
            id: 'javae009', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si olvidas el punto y coma?',
            choices: ['Java lo añade solo', 'Da un error de compilación', 'Imprime un aviso', 'El programa va más lento'],
            correct: 1,
            explanation: 'En Java el punto y coma es obligatorio al final de cada sentencia. Sin él el compilador avisa y el programa no arranca.'
          },
          {
            id: 'javae010', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        System.out.print("Hola ");\n        System.out.println("Mundo");\n    }\n}',
            output: ['Hola Mundo', 'Hola Mundo en dos líneas', 'Hola', 'nada'],
            correctOutput: 0,
            explanation: 'print deja el cursor al final de la línea, así que el println siguiente escribe justo detrás. Quien lo lleva "ln" es el que salta.'
          },
          {
            id: 'javae011', type: 'multiple-choice', xp: 20,
            question: 'El nombre de la clase y el del fichero, ¿tienen que coincidir?',
            choices: ['Sí, obligatoriamente y con mayúscula', 'No, no importa', 'Solo si la clase es pública', 'Da igual en Windows'],
            correct: 2,
            explanation: 'Java es sensible a mayúsculas: Main no es main. Y al compilar, el fichero público debe llamarse como la clase.'
          },
          {
            id: 'javae012', type: 'type-code', xp: 30,
            description: 'Escribe un programa con un comentario que imprima tu nombre.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Pon tu nombre en el print\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        // Este programa imprime un nombre\n        System.out.println("Ana");\n    }\n}',
            explanation: 'El comentario con doble barra documenta la intención. Luego el println imprime el texto entre comillas dobles.',
            // Da igual qué nombre ponga el alumno, mientras no esté vacío
            tests: [{ expected: '{{tu nombre}}\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 2: VARIABLES Y TIPOS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod2',
    title: 'Variables y Tipos',
    subtitle: 'int, double, boolean y String',
    icon: '📦',
    color: '#F4A261',
    gradient: 'linear-gradient(135deg, #F4A261 0%, #E76F00 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'java-mod2-les1',
        title: 'Declarar variables',
        icon: '🏷️',
        exercises: [
          {
            id: 'javae013', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se declara una variable entera llamada edad?',
            choices: ['int edad = 30;', 'edad int = 30;', 'var = 30 edad;', 'integer edad: 30;'],
            correct: 0,
            explanation: 'En Java va primero el tipo y después el nombre. Es al revés que en JavaScript.'
          },
          {
            id: 'javae014', type: 'multiple-choice', xp: 15,
            question: 'Una variable int sin valor inicial, ¿cuál es su valor?',
            choices: ['null', 'undefined', '0', 'no se puede usar'],
            correct: 2,
            explanation: 'Los tipos primitivos empiezan en su valor por defecto: int es 0. Los objetos (como String) empiezan en null.'
          },
          {
            id: 'javae015', type: 'fill-blank', xp: 20,
            question: 'Declara un double para el precio:',
            code: '___ precio = 12.5;',
            blanks: ['double'],
            options: ['double', 'int', 'Decimal', 'float'],
            correct: 0,
            explanation: 'double es el tipo de los decimales en Java. Con int, el 12.5 se truncaría a 12.'
          },
          {
            id: 'javae016', type: 'predict-output', xp: 20,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int edad = 30;\n        System.out.println(edad);\n    }\n}',
            output: ['30', '30.0', 'edad', 'error'],
            correctOutput: 0,
            explanation: 'int es un entero, así que al imprimir sale sin decimales. Un double imprimiría 30.0.'
          },
          {
            id: 'javae017', type: 'multiple-choice', xp: 20,
            question: 'Si haces int x = 7.9; ¿qué valor tiene x?',
            choices: ['7.9', '7', '8', 'error de compilación'],
            correct: 1,
            explanation: 'Al meter un decimal en un int, Java trunca y descarta la parte decimal. Para conservarla, declara double.'
          },
          {
            id: 'javae018', type: 'type-code', xp: 30,
            description: 'Declara un int llamado edad con valor 30 y otro double llamado altura con valor 1.75, e imprime ambos.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Declara e imprime\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int edad = 30;\n        double altura = 1.75;\n        System.out.println(edad);\n        System.out.println(altura);\n    }\n}',
            explanation: 'int para el entero y double para el decimal. Cada println imprime una variable, y el nombre va sin comillas.',
            tests: [{ expected: '30\n1.75\n' }]
          }
        ]
      },
      {
        id: 'java-mod2-les2',
        title: 'boolean, char y String',
        icon: '🔤',
        exercises: [
          {
            id: 'javae019', type: 'multiple-choice', xp: 15,
            question: '¿Qué valores puede tener un boolean?',
            choices: ['Sí y No', 'true y false', '1 y 0', 'on y off'],
            correct: 1,
            explanation: 'En Java se escriben en inglés y en minúscula: true y false. true es un 1 y false un 0 por debajo.'
          },
          {
            id: 'javae020', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe un carácter en Java?',
            choices: ["'A'", '"A"', 'A', 'char A'],
            correct: 0,
            explanation: 'Un char va entre comillas simples y solo guarda un carácter. Con comillas dobles sería un String.'
          },
          {
            id: 'javae021', type: 'fill-blank', xp: 20,
            question: 'Declara un boolean que sea verdadero:',
            code: 'boolean aprobado = ___;',
            blanks: ['true'],
            options: ['true', '"true"', '1', 'True'],
            correct: 0,
            explanation: 'true y false van sin comillas: con comillas serían el texto "true", que es otra cosa.'
          },
          {
            id: 'javae022', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        boolean aprobado = true;\n        char inicial = \'M\';\n        System.out.println(aprobado);\n        System.out.println(inicial);\n    }\n}',
            output: ['true\nM', 'true\n69', '1\nM', 'M\ntrue'],
            correctOutput: 0,
            explanation: 'println de un boolean escribe "true", y println de un char escribe el carácter tal cual, sin su número.'
          },
          {
            id: 'javae023', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre char y String?',
            choices: ['Ninguna', "char es un carácter con comillas simples; String es texto con comillas dobles", 'String es más rápido', 'char solo admite números'],
            correct: 1,
            explanation: 'char es un tipo primitivo de un solo carácter. String es una clase (objeto) que guarda texto de cualquier largo.'
          },
          {
            id: 'javae024', type: 'type-code', xp: 30,
            description: 'Declara un boolean llamado mayorDeEdad con valor false y un String llamado nombre con valor "Ana". Imprime ambos.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Declara e imprime\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        boolean mayorDeEdad = false;\n        String nombre = "Ana";\n        System.out.println(mayorDeEdad);\n        System.out.println(nombre);\n    }\n}',
            explanation: 'false sin comillas para el boolean; el texto sí va entre comillas dobles. El nombre de la variable no se imprime, solo su valor.',
            tests: [{ expected: 'false\nAna\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 3: OPERADORES
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod3',
    title: 'Operadores',
    subtitle: 'Aritmética, comparación y lógica',
    icon: '➗',
    color: '#2A9D8F',
    gradient: 'linear-gradient(135deg, #2A9D8F 0%, #4ECDC4 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'java-mod3-les1',
        title: 'Aritmética',
        icon: '🔢',
        exercises: [
          {
            id: 'javae025', type: 'multiple-choice', xp: 10,
            question: '¿Cuánto vale 17 / 5 en Java, si ambos son int?',
            choices: ['3.4', '3', '4', '3.0'],
            correct: 1,
            explanation: 'La clave de Java: al dividir dos enteros el resultado es entero y trunca. Para decimales usa double o un casting.'
          },
          {
            id: 'javae026', type: 'multiple-choice', xp: 15,
            question: '¿Qué operador da el resto de una división?',
            choices: ['/', '//', '%', 'mod'],
            correct: 2,
            explanation: 'El módulo (%) da el resto: 17 % 5 = 2. Sirve para saber si un número es par o múltiplo de algo.'
          },
          {
            id: 'javae027', type: 'fill-blank', xp: 20,
            question: 'Pide el resto de dividir 10 entre 3:',
            code: 'int resto = 10 ___ 3;',
            blanks: ['%'],
            options: ['%', '/', '#', '|'],
            correct: 0,
            explanation: 'El módulo da el resto. 10 entre 3 son 3 y sobran 1, así que el resto es 1.'
          },
          {
            id: 'javae028', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n        System.out.println(a / b);\n        System.out.println((double) a / b);\n    }\n}',
            output: ['3\n3.4', '3.4\n3.4', '17\n5', '3\n17'],
            correctOutput: 0,
            explanation: 'int / int = 3. El casting (double) convierte a antes de dividir y ya sale 3.4. Esta diferencia sorprende a mucha gente.'
          },
          {
            id: 'javae029', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se hace un número par?',
            choices: ['n / 2 == 0', 'n % 2 == 0', 'n * 2 == 0', 'n % 0 == 0'],
            correct: 1,
            explanation: 'El resto de dividir entre 2 es 0 justo cuando el número es par. Con == comparas; el % da el resto.'
          },
          {
            id: 'javae030', type: 'type-code', xp: 30,
            description: 'Declara int a = 17 e int b = 5, e imprime su suma, su resta, su división entera y su módulo.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n        // Imprime las cuatro operaciones\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n        System.out.println(a + b);\n        System.out.println(a - b);\n        System.out.println(a / b);\n        System.out.println(a % b);\n    }\n}',
            explanation: 'La división entre dos int trunca (3) y el módulo da lo que sobra (2). Fíjate en que los paréntesis van solo en el println.',
            tests: [{ expected: '22\n12\n3\n2\n' }]
          }
        ]
      },
      {
        id: 'java-mod3-les2',
        title: 'Comparación y lógica',
        icon: '⚖️',
        exercises: [
          {
            id: 'javae031', type: 'multiple-choice', xp: 15,
            question: '¿Qué símbolo significa "distinto de" en Java?',
            choices: ['!=', '<>', '=<', '~'],
            correct: 0,
            explanation: 'Es !=. El <> es de otros lenguajes; en Java el "distinto" se escribe con != y el "menor o igual" con <=.'
          },
          {
            id: 'javae032', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace el operador &&?',
            choices: ['O lógico', 'Y lógico: ambas condiciones deben cumplirse', 'Niega la condición', 'Concatena textos'],
            correct: 1,
            explanation: '&& es el "y": sale true solo si las dos partes son verdaderas. Su opuesto es ||, el "o".'
          },
          {
            id: 'javae033', type: 'fill-blank', xp: 20,
            question: 'Comprueba que la edad sea al menos 18:',
            code: 'int edad = 20;\nif (edad >= ___) {\n    System.out.println("Mayor de edad");\n}',
            blanks: ['18'],
            options: ['18', '>=', '==', '"18"'],
            correct: 0,
            explanation: 'El >= va fuera de los paréntesis: dentro solo va la comparación. El 18 es un número, sin comillas.'
          },
          {
            id: 'javae034', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int edad = 20;\n        boolean mayor = edad >= 18;\n        System.out.println(mayor);\n        System.out.println(edad > 30 && mayor);\n    }\n}',
            output: ['true\ntrue', 'true\nfalse', 'false\ntrue', '20\ntrue'],
            correctOutput: 1,
            explanation: '20 >= 18 es true. La segunda línea pide las dos cosas a la vez, y 20 > 30 es falso, así que el && da false.'
          },
          {
            id: 'javae035', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se invierte una condición?',
            choices: ['!condicion', 'NOT condicion', 'condicion = false', '-condicion'],
            correct: 0,
            explanation: 'El signo de exclamación delante: if (!mayorDeEdad). Ponerlo detrás no funciona.'
          },
          {
            id: 'javae036', type: 'type-code', xp: 30,
            description: 'Crea un int nota con valor 8 e imprime si está aprobado (>=5), y también si es par.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int nota = 8;\n        // Imprime las dos comprobaciones\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int nota = 8;\n        System.out.println(nota >= 5);\n        System.out.println(nota % 2 == 0);\n    }\n}',
            explanation: 'Una comparación entre paréntesis es un valor booleano, así que se puede imprimir directamente. Para ver si es par, el resto entre 2 debe ser 0.',
            tests: [{ expected: 'true\ntrue\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 4: CONDICIONALES
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod4',
    title: 'Condicionales',
    subtitle: 'if, else y switch',
    icon: '🔀',
    color: '#E9C46A',
    gradient: 'linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'java-mod4-les1',
        title: 'if y else',
        icon: '❓',
        exercises: [
          {
            id: 'javae037', type: 'multiple-choice', xp: 15,
            question: '¿Las llaves de un if son obligatorias?',
            choices: ['Sí, siempre', 'No, solo si dentro hay más de una línea', 'Solo para el else', 'Nunca hacen falta'],
            correct: 1,
            explanation: 'Con una sola línea puedes omitirlas, pero Java recomienda ponerlas siempre: si mañana añades otra línea, ya está correcto.'
          },
          {
            id: 'javae038', type: 'multiple-choice', xp: 15,
            question: 'Sin else, ¿qué hace un if cuya condición es falsa?',
            choices: ['Imprime algo igualmente', 'No hace nada', 'Da error', 'Repite el programa'],
            correct: 1,
            explanation: 'Si la condición es falsa, el bloque del if se salta y el programa sigue por la siguiente sentencia.'
          },
          {
            id: 'javae039', type: 'fill-blank', xp: 20,
            question: 'Completa el if para que se imprima solo si el número es mayor que 3:',
            code: 'int n = 5;\nif (n ___ 3) {\n    System.out.println("Mayor");\n}',
            blanks: ['>'],
            options: ['>', '<', '==', '<='],
            correct: 0,
            explanation: 'El > va dentro de los paréntesis del if, sin punto y coma. Es la forma de preguntar si un número es mayor que otro.'
          },
          {
            id: 'javae040', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int nota = 7;\n        if (nota >= 5) {\n            System.out.println("Aprobado");\n        } else {\n            System.out.println("Suspenso");\n        }\n    }\n}',
            output: ['Aprobado', 'Suspenso', 'Las dos', 'Ninguna'],
            correctOutput: 0,
            explanation: '7 >= 5 es cierto, así que entra en el if y el else se salta. Solo se ejecuta uno de los dos bloques.'
          },
          {
            id: 'javae041', type: 'multiple-choice', xp: 20,
            question: '¿En qué orden se evalúa una cadena if - else if - else?',
            choices: ['Todas las condiciones a la vez', 'De arriba abajo, y para en la primera que sea cierta', 'Solo el else', 'Al azar'],
            correct: 1,
            explanation: 'Se van probando en orden y en cuanto una se cumple se ejecuta su bloque y se saltan los demás.'
          },
          {
            id: 'javae042', type: 'type-code', xp: 30,
            description: 'Crea un int nota con valor 7 y, con if/else, imprime "Aprobado" si es 5 o más y "Suspenso" si no.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int nota = 7;\n        // Tu if / else aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int nota = 7;\n        if (nota >= 5) {\n            System.out.println("Aprobado");\n        } else {\n            System.out.println("Suspenso");\n        }\n    }\n}',
            explanation: 'El if lleva su condición entre paréntesis y sin punto y coma. El else va fuera de las llaves del if, pegado a la llave de cierre.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      },
      {
        id: 'java-mod4-les2',
        title: 'switch',
        icon: '🎛️',
        exercises: [
          {
            id: 'javae043', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un switch?',
            choices: ['Repetir código', 'Comparar un valor contra varios casos', 'Crear arrays', 'Imprimir texto'],
            correct: 1,
            explanation: 'Es una forma más de leer que un if-elseif largo cuando comparas el mismo valor contra muchos casos.'
          },
          {
            id: 'javae044', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa si olvidas el break del último case?',
            choices: ['Da error', 'Sigue ejecutando los cases siguientes', 'Imprime doble', 'Sale del programa'],
            correct: 1,
            explanation: 'Es el "fall-through": el switch sigue hacia abajo con el siguiente caso. Por eso el break es tan importante.'
          },
          {
            id: 'javae045', type: 'fill-blank', xp: 20,
            question: 'Completa el caso:',
            code: 'int dia = 1;\nswitch (dia) {\n    ___ 1:\n        System.out.println("Lunes");\n        break;\n}',
            blanks: ['case'],
            options: ['case', 'if', 'when', 'option'],
            correct: 0,
            explanation: 'Cada opción se llama case, y el break le dice que pare ahí y no siga leyendo.'
          },
          {
            id: 'javae046', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int dia = 3;\n        switch (dia) {\n            case 1:\n                System.out.println("Lunes");\n                break;\n            case 3:\n                System.out.println("Miercoles");\n                break;\n            default:\n                System.out.println("Otro");\n        }\n    }\n}',
            output: ['Miercoles', 'Lunes', 'Otro', 'Las tres'],
            correctOutput: 0,
            explanation: 'Solo coincide el case 3, así que imprime Miercoles y el break corta el switch. El default no se llega a ver.'
          },
          {
            id: 'javae047', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve default?',
            choices: ['Para imprimir siempre', 'Se ejecuta si ningún caso coincide', 'Es el caso 1', 'Da error'],
            correct: 1,
            explanation: 'Es el "si no era ninguno de estos". No es obligatorio, pero evita dejar casos sin cubrir.'
          },
          {
            id: 'javae048', type: 'type-code', xp: 30,
            description: 'Con switch, según un int día con valor 1 imprime "Lunes" y si no "No es lunes".',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int dia = 1;\n        // Tu switch aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int dia = 1;\n        switch (dia) {\n            case 1:\n                System.out.println("Lunes");\n                break;\n            default:\n                System.out.println("No es lunes");\n        }\n    }\n}',
            explanation: 'El case que coincide imprime y el break evita que siga con el default. El default cubre lo que no coincida.',
            tests: [{ expected: 'Lunes\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 5: BUCLES
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod5',
    title: 'Bucles',
    subtitle: 'while, for y for-each',
    icon: '🔁',
    color: '#264653',
    gradient: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'java-mod5-les1',
        title: 'for y while',
        icon: '🔂',
        exercises: [
          {
            id: 'javae049', type: 'multiple-choice', xp: 15,
            question: '¿Cuántas veces se repite un for con i desde 1 hasta 5?',
            choices: ['5 veces', '6 veces', '4 veces', 'Depende'],
            correct: 0,
            explanation: 'Cinco: i toma 1, 2, 3, 4 y 5. El límite no se incluye, igual que en range de Python.'
          },
          {
            id: 'javae050', type: 'multiple-choice', xp: 15,
            question: '¿Qué parte del for controla el número de vueltas?',
            choices: ['La condición del medio', 'El incremento del final, i++', 'La declaración inicial', 'Las llaves'],
            correct: 1,
            explanation: 'Las tres partes del for: dónde empieza (int i = 1), hasta cuándo (i <= 5) y cómo avanza (i++).'
          },
          {
            id: 'javae051', type: 'fill-blank', xp: 20,
            question: 'Completa el for que va del 1 al 3:',
            code: 'for (int i = 1; i <= ___; i++) {\n    System.out.println(i);\n}',
            blanks: ['3'],
            options: ['3', '<', 'i++', '1'],
            correct: 0,
            explanation: 'El <= 3 hace que i llegue a valer 3. El ++ del final es lo que impide que el bucle sea infinito.'
          },
          {
            id: 'javae052', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 4; i++) {\n            System.out.println(i * 2);\n        }\n    }\n}',
            output: ['2\n4\n6\n8', '2\n4\n6', '1\n2\n3\n4', '8\n6\n4\n2'],
            correctOutput: 0,
            explanation: 'El bucle imprime cuatro líneas, una por vuelta, y en cada una multiplica el valor de i por 2.'
          },
          {
            id: 'javae053', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el peligro de un while?',
            choices: ['Que va muy lento', 'Que si la condición nunca se hace falsa se queda infinito', 'Que no admite números', 'Que necesita llaves'],
            correct: 1,
            explanation: 'Si dentro del while no cambias la variable de la condición, el bucle no termina nunca y el programa se cuelga.'
          },
          {
            id: 'javae054', type: 'type-code', xp: 30,
            description: 'Usa un for para imprimir los números del 1 al 3, uno por línea.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Tu for aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            System.out.println(i);\n        }\n    }\n}',
            explanation: 'int i = 1 declara el contador, i <= 3 decide hasta cuándo y i++ lo avanza. Las tres van separadas por punto y coma.',
            tests: [{ expected: '1\n2\n3\n' }]
          }
        ]
      },
      {
        id: 'java-mod5-les2',
        title: 'break, continue y for-each',
        icon: '🛑',
        exercises: [
          {
            id: 'javae055', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace break dentro de un bucle?',
            choices: ['Salta a la siguiente vuelta', 'Sale del bucle', 'Repite el bucle', 'Termina el programa'],
            correct: 1,
            explanation: 'break aborta el bucle y el programa sigue por la sentencia siguiente a cerrar las llaves.'
          },
          {
            id: 'javae056', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace continue?',
            choices: ['Sale del bucle', 'Salta a la siguiente vuelta sin llegar al final', 'Termina el programa', 'Imprime una línea'],
            correct: 1,
            explanation: 'continue se salta el resto de esta vuelta. Sirve para ignorar algunos valores: if (i == 2) continue;'
          },
          {
            id: 'javae057', type: 'fill-blank', xp: 20,
            question: 'Salta el 3 en un bucle del 1 al 5:',
            code: 'for (int i = 1; i <= 5; i++) {\n    if (i == 3) ___;\n    System.out.println(i);\n}',
            blanks: ['continue'],
            options: ['continue', 'break', 'return', 'exit'],
            correct: 0,
            explanation: 'continue deja pasar el 3 sin imprimirlo y sigue con el 4. Con break el bucle terminaría en el 3 y no llegaría al 4.'
          },
          {
            id: 'javae058', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            if (i == 3) {\n                continue;\n            }\n            System.out.println(i);\n        }\n    }\n}',
            output: ['1\n2\n4\n5', '1\n2\n3\n4\n5', '1\n2', '3'],
            correctOutput: 0,
            explanation: 'El continue salta el println cuando i vale 3, así que ese número no aparece y el bucle sigue hasta el 5.'
          },
          {
            id: 'javae059', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la ventaja del for-each?',
            choices: ['Es más rápido', 'Recorre un array sin necesitar el índice', 'Necesita menos memoria', 'Permite parar antes'],
            correct: 1,
            explanation: 'for (String nombre : nombres) te da directamente cada elemento. Antes te tocaba recorrer con i y usar el índice.'
          },
          {
            id: 'javae060', type: 'type-code', xp: 30,
            description: 'Recorre el array String[] {"Ana", "Luis", "Marta"} con un for-each e imprime el nombre de cada uno.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        String[] socios = {"Ana", "Luis", "Marta"};\n        // Tu for-each aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        String[] socios = {"Ana", "Luis", "Marta"};\n        for (String socio : socios) {\n            System.out.println(socio);\n        }\n    }\n}',
            explanation: 'La forma es for (tipo elemento : array). Cada vuelta toma el siguiente elemento, así que no hay índice ni length.',
            tests: [{ expected: 'Ana\nLuis\nMarta\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 6: ARRAYS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod6',
    title: 'Arrays',
    subtitle: 'Listas de valores del mismo tipo',
    icon: '📊',
    color: '#6A4C93',
    gradient: 'linear-gradient(135deg, #6A4C93 0%, #9B5DE5 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod6-les1',
        title: 'Crear y recorrer arrays',
        icon: '🗂️',
        exercises: [
          {
            id: 'javae061', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipos puede guardar un array?',
            choices: ['Cualquier cosa', 'Solo valores del mismo tipo', 'Solo números', 'Solo textos'],
            correct: 1,
            explanation: 'Un int[] solo guarda enteros y un String[] solo textos. Es la diferencia principal con las listas de JavaScript.'
          },
          {
            id: 'javae062', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve un array.length?',
            choices: ['El último índice', 'Cuántos elementos tiene', 'Cuántos tipos admite', 'Nada'],
            correct: 1,
            explanation: 'length es el número de elementos. Como los índices empiezan en 0, el último es length - 1.'
          },
          {
            id: 'javae063', type: 'fill-blank', xp: 20,
            question: 'Declara un array de 3 enteros:',
            code: 'int[] numeros = ___;',
            blanks: ['new int[3]'],
            options: ['new int[3]', 'new int(3)', 'int new[3]', 'array(3)'],
            correct: 0,
            explanation: 'new int[3] reserva el hueco para 3 enteros. Sus valores iniciales son 0 hasta que los asignes.'
          },
          {
            id: 'javae064', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = new int[3];\n        nums[0] = 7;\n        System.out.println(nums[0] + " " + nums[1] + " " + nums.length);\n    }\n}',
            output: ['7 0 3', '7 7 3', '0 0 3', 'error'],
            correctOutput: 0,
            explanation: 'Solo asignamos la posición 0, así que la 1 sigue valiendo 0. Y length dice cuántos huecos hay: 3.'
          },
          {
            id: 'javae065', type: 'multiple-choice', xp: 20,
            question: 'Los índices de un array empiezan en…',
            choices: ['1', '0', '-1', 'length'],
            correct: 1,
            explanation: 'En 0, como en casi todos los lenguajes. El último índice válido es length - 1.'
          },
          {
            id: 'javae066', type: 'type-code', xp: 30,
            description: 'Crea un array int[] con los valores 4, 8 y 15, e imprime cuántos elementos tiene y el último.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Tu array aquí\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] numeros = {4, 8, 15};\n        System.out.println(numeros.length);\n        System.out.println(numeros[numeros.length - 1]);\n    }\n}',
            explanation: 'Con las llaves creas el array con los valores puestos. El último elemento es length - 1, porque los índices van de 0.',
            tests: [{ expected: '3\n15\n' }]
          }
        ]
      },
      {
        id: 'java-mod6-les2',
        title: 'Recorrer y sumar un array',
        icon: '➕',
        exercises: [
          {
            id: 'javae067', type: 'multiple-choice', xp: 15,
            question: '¿Qué pasa si pides una posición que no existe?',
            choices: ['Devuelve 0', 'Da un error en tiempo de ejecución', 'Crea la posición', 'Imprime null'],
            correct: 1,
            explanation: 'ArrayIndexOutOfBoundsException. El programa se detiene en esa línea: por eso hay que cuidar el límite del bucle.'
          },
          {
            id: 'javae068', type: 'multiple-choice', xp: 15,
            question: '¿Cómo recorres un array con un for clásico?',
            choices: ['for (int i = 0; i < nums.length; i++)', 'for (int i : nums) con length', 'for (int i = 1; i <= nums.length; i++)', 'No se puede'],
            correct: 0,
            explanation: 'Con i < length y el índice en los corchetes. Si pusieras i <= length, la última vuelta intentaría leer una posición de más.'
          },
          {
            id: 'javae069', type: 'fill-blank', xp: 20,
            question: 'Completa la condición para recorrer todo el array:',
            code: 'int[] nums = {4, 8, 15};\nfor (int i = 0; i < nums.___; i++) {\n    System.out.println(nums[i]);\n}',
            blanks: ['length'],
            options: ['length', 'size', 'count', 'len'],
            correct: 0,
            explanation: 'length es una propiedad, sin paréntesis. size() es de las listas de Java, no de los arrays.'
          },
          {
            id: 'javae070', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {4, 8, 15};\n        int suma = 0;\n        for (int i = 0; i < nums.length; i++) {\n            suma += nums[i];\n        }\n        System.out.println(suma);\n    }\n}',
            output: ['27', '4', '15', '3'],
            correctOutput: 0,
            explanation: 'suma += nums[i] va añadiendo cada elemento: 4 + 8 + 15 = 27. Por eso el += es tan útil en los bucles.'
          },
          {
            id: 'javae071', type: 'multiple-choice', xp: 20,
            question: '¿Por qué += es tan cómodo en un bucle?',
            choices: ['Es más rápido', 'Suma lo que ya había con lo nuevo en una línea', 'Evita los corchetes', 'Solo funciona con arrays'],
            correct: 1,
            explanation: 'suma += nums[i] es lo mismo que suma = suma + nums[i], pero en una línea. Así se acumulan valores sin esfuerzo.'
          },
          {
            id: 'javae072', type: 'type-code', xp: 30,
            description: 'Crea un array int[] con 5, 10 y 15 y calcula la suma recorriéndolo con un for clásico.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {5, 10, 15};\n        // Calcula la suma\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {5, 10, 15};\n        int suma = 0;\n        for (int i = 0; i < nums.length; i++) {\n            suma += nums[i];\n        }\n        System.out.println(suma);\n    }\n}',
            explanation: 'El acumulador suma se declara antes del bucle (si no, se perdería en cada vuelta) y se va llenando con +=.',
            tests: [{ expected: '30\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 7: MÉTODOS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod7',
    title: 'Métodos',
    subtitle: 'Trocea el programa en piezas',
    icon: '⚙️',
    color: '#0077B6',
    gradient: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod7-les1',
        title: 'Crear y llamar métodos',
        icon: '🔧',
        exercises: [
          {
            id: 'javae073', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa void en un método?',
            choices: ['Que devuelve nada', 'Que devuelve un número', 'Que es privado', 'Que devuelve texto'],
            correct: 0,
            explanation: 'void significa "vacío": el método hace su trabajo pero no entrega ningún valor de vuelta.'
          },
          {
            id: 'javae074', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama a un método estático desde main?',
            choices: ['Con new', 'Solo con su nombre, porque static significa que no necesita objetos', 'Con this', 'No se puede'],
            correct: 1,
            explanation: 'static significa que el método pertenece a la clase, no a un objeto. Por eso se llama con su nombre.'
          },
          {
            id: 'javae075', type: 'fill-blank', xp: 20,
            question: 'Completa la firma de un método que suma dos enteros y devuelve int:',
            code: '___ int sumar(int a, int b) {\n    return a + b;\n}',
            blanks: ['static'],
            options: ['static', 'void', 'public class', 'final'],
            correct: 0,
            explanation: 'static para poder llamarlo desde main. El tipo int delante del nombre es lo que devuelve, no lo que recibe.'
          },
          {
            id: 'javae076', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        saludar("Ana");\n    }\n    static void saludar(String nombre) {\n        System.out.println("Hola, " + nombre);\n    }\n}',
            output: ['Hola, Ana', 'Hola, "Ana"', 'nombre', 'error'],
            correctOutput: 0,
            explanation: 'El método recibe "Ana" como nombre y lo concatena. Se llama por su nombre porque es static.'
          },
          {
            id: 'javae077', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace return?',
            choices: ['Sale del programa', 'Devuelve un valor y sale del método', 'Imprime', 'Crea una variable'],
            correct: 1,
            explanation: 'return entrega el valor y termina el método. En un void se puede usar para salir antes de tiempo.'
          },
          {
            id: 'javae078', type: 'type-code', xp: 35,
            description: 'Crea un método estático void llamado saludar que imprima "Hola, Java!" y llámalo desde main.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Llama al método\n    }\n    // Tu método aquí\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        saludar();\n    }\n    static void saludar() {\n        System.out.println("Hola, Java!");\n    }\n}',
            explanation: 'Los métodos se escriben dentro de la clase pero fuera del main. static void es la firma mínima, y al llamar se pasan los paréntesis vacíos.',
            tests: [{ expected: 'Hola, Java!\n' }]
          }
        ]
      },
      {
        id: 'java-mod7-les2',
        title: 'Métodos con retorno',
        icon: '🔙',
        exercises: [
          {
            id: 'javae079', type: 'multiple-choice', xp: 15,
            question: 'Un método con retorno int, ¿cómo termina?',
            choices: ['Con println', 'Con return y el valor', 'Con break', 'Con void'],
            correct: 1,
            explanation: 'Tiene que devolver el valor con return. Si llegara al final sin return, Java daría error de compilación.'
          },
          {
            id: 'javae080', type: 'multiple-choice', xp: 15,
            question: 'Si un método int puede tener varios return, ¿cuál se usa?',
            choices: ['Todos', 'El primero que se ejecuta', 'El último', 'Da error'],
            correct: 1,
            explanation: 'Al ejecutar un return, el método se termina ahí. El primero que se cumple es el que gana.'
          },
          {
            id: 'javae081', type: 'fill-blank', xp: 20,
            question: 'Devuelve el doble de un número:',
            code: 'static int doble(int n) {\n    return n * ___;\n}',
            blanks: ['2'],
            options: ['2', 'n', '+', 'n2'],
            correct: 0,
            explanation: 'return entrega el resultado de la expresión. Aquí n * 2 es el valor que vuelve al que llamó.'
          },
          {
            id: 'javae082', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(sumar(3, 4));\n    }\n    static int sumar(int a, int b) {\n        return a + b;\n    }\n}',
            output: ['7', '3', '4', 'sumar'],
            correctOutput: 0,
            explanation: 'El método devuelve 7 y ese valor es el que se imprime. println puede recibir directamente el resultado de una llamada.'
          },
          {
            id: 'javae083', type: 'multiple-choice', xp: 20,
            question: '¿Por qué es bueno un método con return?',
            choices: ['Es más rápido', 'Puedes guardar el resultado en una variable y seguir trabajando con él', 'Ocupa menos memoria', 'Evita los errores'],
            correct: 1,
            explanation: 'int total = sumar(3, 4); deja el resultado disponible para operar con él. Con void solo se hace el efecto lateral.'
          },
          {
            id: 'javae084', type: 'type-code', xp: 35,
            description: 'Crea un método estático int llamado doble que devuelva el número que recibe multiplicado por 2, e imprímelo con el 5.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Imprime doble(5)\n    }\n    // Tu método aquí\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(doble(5));\n    }\n    static int doble(int n) {\n        return n * 2;\n    }\n}',
            explanation: 'El tipo int delante del nombre indica qué devuelve, y return entrega el resultado. Con 5 entra y devuelve 10.',
            tests: [{ expected: '10\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 8: CLASES Y OBJETOS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod8',
    title: 'Clases y Objetos',
    subtitle: 'Tu propio molde de datos',
    icon: '🏗️',
    color: '#1D3557',
    gradient: 'linear-gradient(135deg, #1D3557 0%, #457B9D 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod8-les1',
        title: 'Crear una clase',
        icon: '📐',
        exercises: [
          {
            id: 'javae085', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una clase?',
            choices: ['Un archivo de código', 'Un molde que describe qué datos y qué métodos tiene un objeto', 'Un tipo de variable', 'Un bucle'],
            correct: 1,
            explanation: 'La clase es la plantilla; los objetos son las instancias concretas creadas con new.'
          },
          {
            id: 'javae086', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se crea un objeto de una clase?',
            choices: ['new MiClase()', 'MiClase()', 'create MiClase', 'static MiClase'],
            correct: 0,
            explanation: 'Con new seguido del nombre de la clase y paréntesis: Libro libro = new Libro();'
          },
          {
            id: 'javae087', type: 'fill-blank', xp: 20,
            question: 'Completa la creación del objeto:',
            code: 'Libro libro = ___ Libro();',
            blanks: ['new'],
            options: ['new', 'class', 'public', 'void'],
            correct: 0,
            explanation: 'new reserva la memoria y construye el objeto. El tipo va a la izquierda y el new en medio.'
          },
          {
            id: 'javae088', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        Libro l = new Libro();\n        l.titulo = "El Hobbit";\n        System.out.println(l.titulo);\n    }\n}\nclass Libro {\n    String titulo;\n    int anio;\n}',
            output: ['El Hobbit', 'null', 'Libro', 'error'],
            correctOutput: 0,
            explanation: 'new Libro() crea el objeto. Luego se le asigna el titulo y al imprimir sale ese texto, no el nombre del campo.'
          },
          {
            id: 'javae089', type: 'multiple-choice', xp: 20,
            question: 'Un campo de tipo String sin inicializar vale…',
            choices: ['0', '""', 'null', 'false'],
            correct: 2,
            explanation: 'Los campos de tipo objeto empiezan en null. Los int en 0 y los boolean en false.'
          },
          {
            id: 'javae090', type: 'type-code', xp: 40,
            description: 'Crea una clase Libro con los campos titulo (String) y anio (int), crea un objeto, ponle los valores e imprime título y año.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Crea el objeto e imprime\n    }\n}\nclass Libro {\n    // Tus campos aquí\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        Libro l = new Libro();\n        l.titulo = "El Hobbit";\n        l.anio = 1937;\n        System.out.println(l.titulo);\n        System.out.println(l.anio);\n    }\n}\nclass Libro {\n    String titulo;\n    int anio;\n}',
            explanation: 'La clase va después de la de main, en el mismo fichero. El punto para asignar es el acceso al campo del objeto.',
            tests: [{ expected: 'El Hobbit\n1937\n' }]
          }
        ]
      },
      {
        id: 'java-mod8-les2',
        title: 'Constructores',
        icon: '🔨',
        exercises: [
          {
            id: 'javae091', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un constructor?',
            choices: ['Para imprimir', 'Para preparar el objeto nada más crearlo', 'Para borrar el objeto', 'Es obligatorio siempre'],
            correct: 1,
            explanation: 'Se ejecuta con new. Sirve para dejar los campos con valores válidos desde el principio.'
          },
          {
            id: 'javae092', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama un constructor?',
            choices: ['Con el mismo nombre de la clase', 'Con construct', 'Con new', 'No tiene nombre'],
            correct: 0,
            explanation: 'Tiene exactamente el mismo nombre que la clase y sin tipo de retorno, ni siquiera void.'
          },
          {
            id: 'javae093', type: 'fill-blank', xp: 20,
            question: 'Completa el constructor:',
            code: 'class Libro {\n    String titulo;\n    int anio;\n\n    Libro(String t, int a) {\n        this.titulo = ___;\n        this.anio = a;\n    }\n}',
            blanks: ['t'],
            options: ['t', 'titulo', 'this.titulo', 'String'],
            correct: 0,
            explanation: 'this.titulo es el campo del objeto y t es el parámetro. El this es lo que distingue los dos.'
          },
          {
            id: 'javae094', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        Libro l = new Libro("Dune", 1965);\n        System.out.println(l.titulo + " (" + l.anio + ")");\n    }\n}\nclass Libro {\n    String titulo;\n    int anio;\n    Libro(String t, int a) {\n        this.titulo = t;\n        this.anio = a;\n    }\n}',
            output: ['Dune (1965)', 'Libro (1965)', 'Dune 1965', 'error'],
            correctOutput: 0,
            explanation: 'El constructor recibe los dos valores y los guarda. Luego el println los lee del objeto.'
          },
          {
            id: 'javae095', type: 'multiple-choice', xp: 20,
            question: '¿Qué es this?',
            choices: ['La clase', 'Una referencia al objeto actual', 'Un tipo de dato', 'Un bucle'],
            correct: 1,
            explanation: 'this apunta al objeto que se está usando. Sirve sobre todo en los constructores, para no confundir campo con parámetro.'
          },
          {
            id: 'javae096', type: 'type-code', xp: 40,
            description: 'Crea una clase Producto con campos nombre y precio y un constructor que los reciba. Crea un producto e imprime "Manzana: 1.5".',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Crea el producto e imprime\n    }\n}\nclass Producto {\n    // Campos y constructor aquí\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        Producto p = new Producto("Manzana", 1.5);\n        System.out.println(p.nombre + ": " + p.precio);\n    }\n}\nclass Producto {\n    String nombre;\n    double precio;\n    Producto(String n, double pr) {\n        this.nombre = n;\n        this.precio = pr;\n    }\n}',
            explanation: 'El constructor usa this para guardar en los campos lo que llega en los parámetros. El precio es double porque lleva decimales.',
            tests: [{ expected: 'Manzana: 1.5\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 9: STRINGS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod9',
    title: 'Cadenas de Texto',
    subtitle: 'String y sus métodos',
    icon: '💬',
    color: '#8338EC',
    gradient: 'linear-gradient(135deg, #8338EC 0%, #B26AE0 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod9-les1',
        title: 'Trabajar con Strings',
        icon: '🔤',
        exercises: [
          {
            id: 'javae097', type: 'multiple-choice', xp: 15,
            question: '¿Es String un tipo primitivo?',
            choices: ['Sí, como int', 'No, es una clase', 'Depende', 'Solo si es corto'],
            correct: 1,
            explanation: 'String es una clase, no un primitivo. Por eso puede tener métodos como length() o substring().'
          },
          {
            id: 'javae098', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelve "Hola".length()?',
            choices: ['3', '4', '5', 'H'],
            correct: 1,
            explanation: 'Cuatro: H, o, l, a. length cuenta todos los caracteres, incluidos los espacios.'
          },
          {
            id: 'javae099', type: 'fill-blank', xp: 20,
            question: 'Saca las tres primeras letras de "Hola Mundo":',
            code: 'String s = "Hola Mundo";\nSystem.out.println(s.substring(0, ___));',
            blanks: ['3'],
            options: ['3', '2', '1', '4'],
            correct: 0,
            explanation: 'substring(0, 3) va del índice 0 hasta el 3 sin incluirlo, o sea H, o y l.'
          },
          {
            id: 'javae100', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        String s = "Hola Mundo";\n        System.out.println(s.length());\n        System.out.println(s.substring(5));\n        System.out.println(s.indexOf("Mundo"));\n    }\n}',
            output: ['10\nMundo\n5', '9\nMundo\n5', '10\nHola Mundo\n0', '10\nHola\n5'],
            correctOutput: 0,
            explanation: 'length da 10 contando el espacio. substring(5) quita "Hola " y se queda "Mundo". Y Mundo empieza en el índice 5.'
          },
          {
            id: 'javae101', type: 'multiple-choice', xp: 20,
            question: 'Si el texto no aparece, ¿qué devuelve indexOf?',
            choices: ['0', '-1', 'null', 'Da error'],
            correct: 1,
            explanation: 'Devuelve -1, que es la forma de decir "no está en ninguna posición".'
          },
          {
            id: 'javae102', type: 'type-code', xp: 30,
            description: 'Dado el String nombre = "DevQuest", imprime su longitud y su nombre en mayúsculas.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        String nombre = "DevQuest";\n        // Imprime longitud y mayúsculas\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        String nombre = "DevQuest";\n        System.out.println(nombre.length());\n        System.out.println(nombre.toUpperCase());\n    }\n}',
            explanation: 'length() lleva paréntesis porque es un método. toUpperCase() devuelve el texto en mayúsculas sin modificar el original.',
            tests: [{ expected: '8\nDEVQUEST\n' }]
          }
        ]
      },
      {
        id: 'java-mod9-les2',
        title: 'Comparar y transformar',
        icon: '🔁',
        exercises: [
          {
            id: 'javae103', type: 'multiple-choice', xp: 15,
            question: '¿Por qué == no funciona bien para comparar textos?',
            choices: ['Porque no existe', 'Porque compara si son el mismo objeto en memoria, no si tienen el mismo texto', 'Porque va muy lento', 'Porque solo funciona con números'],
            correct: 1,
            explanation: 'Para textos hay que usar equals: "a".equals("a") es true, mientras que dos "a" creados aparte serían objetos distintos.'
          },
          {
            id: 'javae104', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve contains?',
            choices: ['Contar caracteres', 'Comprobar si un texto está dentro de otro', 'Borrar espacios', 'Convertir a mayúsculas'],
            correct: 1,
            explanation: 's.contains("Mundo") devuelve true si esa palabra está dentro del texto, false si no.'
          },
          {
            id: 'javae105', type: 'fill-blank', xp: 20,
            question: 'Comprueba si el texto contiene "Java":',
            code: 'String s = "Hola Java";\nSystem.out.println(s.___("Java"));',
            blanks: ['contains'],
            options: ['contains', 'indexOf', 'length', 'find'],
            correct: 0,
            explanation: 'contains devuelve true o false. indexOf daría un número: la posición donde aparece.'
          },
          {
            id: 'javae106', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        String a = "hola";\n        String b = "HOLA";\n        System.out.println(a.equals(b));\n        System.out.println(a.equalsIgnoreCase(b));\n    }\n}',
            output: ['false\ntrue', 'true\ntrue', 'false\nfalse', 'true\nfalse'],
            correctOutput: 0,
            explanation: 'equals compara respetando mayúsculas, así que "hola" y "HOLA" son distintos. equalsIgnoreCase las iguala.'
          },
          {
            id: 'javae107', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace replace?',
            choices: ['Cambia un texto por otro dentro del String', 'Borra el String', 'Lo pone en mayúsculas', 'Lo da la vuelta'],
            correct: 0,
            explanation: 's.replace("-", "+") cambia todos los guiones por signos más y devuelve un texto nuevo.'
          },
          {
            id: 'javae108', type: 'type-code', xp: 30,
            description: 'Con el String texto = "Java es genial", imprime si contiene "genial" y el texto con la palabra "es" sustituida por "es muy".',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        String texto = "Java es genial";\n        // Imprime las dos cosas\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        String texto = "Java es genial";\n        System.out.println(texto.contains("genial"));\n        System.out.println(texto.replace("es", "es muy"));\n    }\n}',
            explanation: 'contains da true si lo encuentra. replace cambia todas las apariciones y devuelve un texto nuevo, sin tocar el original.',
            tests: [{ expected: 'true\nJava es muy genial\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 10: MATH Y UTILIDADES
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod10',
    title: 'Math y utilidades',
    subtitle: 'Cálculos y conversiones',
    icon: '📐',
    color: '#E85D04',
    gradient: 'linear-gradient(135deg, #E85D04 0%, #FAA307 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod10-les1',
        title: 'La clase Math',
        icon: '➗',
        exercises: [
          {
            id: 'javae109', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama la clase de matemáticas?',
            choices: ['Math', 'Numbers', 'Calc', 'Maths'],
            correct: 0,
            explanation: 'Se llama Math y todos sus métodos son estáticos: se usan como Math.max(...), sin crear objetos.'
          },
          {
            id: 'javae110', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace Math.abs(-5)?',
            choices: ['Redondea', 'Devuelve el valor absoluto, 5', 'Da error', 'Devuelve -5'],
            correct: 1,
            explanation: 'Quita el signo. Es muy útil con raíces, porque Math.sqrt de un negativo daría un error.'
          },
          {
            id: 'javae111', type: 'fill-blank', xp: 20,
            question: 'El mayor de 3 y 9:',
            code: 'System.out.println(Math.___(3, 9));',
            blanks: ['max'],
            options: ['max', 'min', 'abs', 'pow'],
            correct: 0,
            explanation: 'max devuelve el mayor de los dos. min daría 3, y pow el primero elevado al segundo.'
          },
          {
            id: 'javae112', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Math.max(4, 9));\n        System.out.println(Math.min(4, 9));\n        System.out.println(Math.abs(-7));\n    }\n}',
            output: ['9\n4\n7', '4\n9\n-7', '9\n9\n7', '7\n4\n-7'],
            correctOutput: 0,
            explanation: 'max se queda con el mayor, min con el menor y abs quita el signo del -7 dejándolo en 7.'
          },
          {
            id: 'javae113', type: 'multiple-choice', xp: 20,
            question: '¿Qué tipo devuelve Math.sqrt(81)?',
            choices: ['int', 'double', 'long', 'String'],
            correct: 1,
            explanation: 'double, aunque el resultado sea exacto. Por eso al imprimir 9.0 sale con decimal.'
          },
          {
            id: 'javae114', type: 'type-code', xp: 30,
            description: 'Imprime el máximo y el mínimo entre 12 y 5 usando Math.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Imprime max y min de 12 y 5\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(Math.max(12, 5));\n        System.out.println(Math.min(12, 5));\n    }\n}',
            explanation: 'Math.max y Math.min reciben los valores que quieras y devuelven uno de ellos. Como son int, imprimen sin decimales.',
            tests: [{ expected: '12\n5\n' }]
          }
        ]
      },
      {
        id: 'java-mod10-les2',
        title: 'Convertir tipos',
        icon: '🔄',
        exercises: [
          {
            id: 'javae115', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace Integer.parseInt("42")?',
            choices: ['Convierte el texto 42 en el número 42', 'Lo pasa a texto', 'Lo redondea', 'Da error siempre'],
            correct: 0,
            explanation: 'Convierte un texto en un número entero. Si el texto no es un número, lanza NumberFormatException.'
          },
          {
            id: 'javae116', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se hace un casting a double?',
            choices: ['(double) numero', 'double(numero)', 'numero.toDouble()', 'convert numero'],
            correct: 0,
            explanation: 'El casting va entre paréntesis delante del valor: (double) a / b. Cambia el tipo del dato.'
          },
          {
            id: 'javae117', type: 'fill-blank', xp: 20,
            question: 'Convierte el texto "7" en un número:',
            code: 'int n = Integer._____("7");',
            blanks: ['parseInt'],
            options: ['parseInt', 'toInt', 'value', 'cast'],
            correct: 0,
            explanation: 'parseInt es el método estático de Integer que transforma texto en entero. El 7 entre comillas es texto.'
          },
          {
            id: 'javae118', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int n = Integer.parseInt("7");\n        System.out.println(n + 1);\n        System.out.println((double) 7 / 2);\n    }\n}',
            output: ['8\n3.5', '7.1\n3', '8\n3', 'error'],
            correctOutput: 0,
            explanation: 'parseInt da el número 7, y 7 + 1 es una suma normal. El casting a double hace que la división de 7 entre 2 dé 3.5.'
          },
          {
            id: 'javae119', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si haces parseInt("hola")?',
            choices: ['Devuelve 0', 'Lanza una excepción', 'Devuelve null', 'Imprime "hola"'],
            correct: 1,
            explanation: 'NumberFormatException. Es bueno recordarlo: si el texto viene de un usuario, siempre puede fallar.'
          },
          {
            id: 'javae120', type: 'type-code', xp: 30,
            description: 'Convierte el texto "25" a número con parseInt y calcula su mitad como decimal (casting a double).',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Convierte y calcula la mitad\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int n = Integer.parseInt("25");\n        System.out.println((double) n / 2);\n    }\n}',
            explanation: 'parseInt convierte el texto. El casting a double va antes de dividir, o la división entre enteros truncaría a 12.',
            tests: [{ expected: '12.5\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 11: PROGRAMA COMPLETO
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod11',
    title: 'Todo Junto',
    subtitle: 'Un programa de principio a fin',
    icon: '🧩',
    color: '#2B9348',
    gradient: 'linear-gradient(135deg, #2B9348 0%, #52B788 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod11-les1',
        title: 'Combinar todo',
        icon: '🧱',
        exercises: [
          {
            id: 'javae121', type: 'multiple-choice', xp: 20,
            question: 'Un programa que lee datos, decide y calcula, ¿qué necesita?',
            choices: ['Solo println', 'Variables, condicionales y bucles, combinadas', 'Una clase obligatoria', 'Nada especial'],
            correct: 1,
            explanation: 'Un programa real encadena todo: guarda datos en variables, usa if para decidir y bucles para repetir.'
          },
          {
            id: 'javae122', type: 'multiple-choice', xp: 20,
            question: '¿Qué conviene para partir un programa largo?',
            choices: ['Meterlo todo en main', 'Crear métodos con una tarea cada uno', 'Repetir el código', 'Usar más comentarios'],
            correct: 1,
            explanation: 'Métodos cortos y con un nombre claro. Cada uno hace una cosa y se prueba por separado.'
          },
          {
            id: 'javae123', type: 'fill-blank', xp: 25,
            question: 'Completa el bucle que suma un array:',
            code: 'int[] nums = {2, 4, 6};\nint suma = 0;\nfor (int i = 0; i < nums.___; i++) {\n    suma += nums[i];\n}',
            blanks: ['length'],
            options: ['length', 'size', 'count', 'length()'],
            correct: 0,
            explanation: 'length es una propiedad sin paréntesis. Con length() el código no compila.'
          },
          {
            id: 'javae124', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int[] nums = {2, 4, 6};\n        int suma = 0;\n        for (int i = 0; i < nums.length; i++) {\n            suma += nums[i];\n        }\n        System.out.println(suma / nums.length);\n        System.out.println(suma % nums.length);\n    }\n}',
            output: ['4\n0', '12\n3', '4.0\n0.0', '2\n2'],
            correctOutput: 0,
            explanation: 'La suma es 12 y al dividirla entre 3 truncada da 4. El resto de 12 entre 3 es 0.'
          },
          {
            id: 'javae125', type: 'multiple-choice', xp: 25,
            question: '¿Qué ventaja tiene sacar la media a un método?',
            choices: ['Que corre más rápido', 'Que el main queda limpio y la media se puede probar sola', 'Que ocupa menos memoria', 'Que evita los arrays'],
            correct: 1,
            explanation: 'El main se queda con lo que coordina y cada método hace lo suyo. Además se puede llamar desde otros sitios.'
          },
          {
            id: 'javae126', type: 'type-code', xp: 45,
            description: 'Programa completo: crea un array int[] de 3 notas, calcula la media con un bucle e imprime si está aprobado.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int[] notas = {7, 8, 9};\n        // Calcula la media y decide\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] notas = {7, 8, 9};\n        int suma = 0;\n        for (int i = 0; i < notas.length; i++) {\n            suma += notas[i];\n        }\n        int media = suma / notas.length;\n        if (media >= 5) {\n            System.out.println("Aprobado");\n        } else {\n            System.out.println("Suspenso");\n        }\n    }\n}',
            explanation: 'Primero se acumula la suma con un bucle, luego se divide para obtener la media y con un if se decide. Todo sin usar un solo double.',
            tests: [{ expected: 'Aprobado\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 12: ERRORES Y EXCEPCIONES
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod12',
    title: 'Errores Comunes',
    subtitle: 'Lo que falla y por qué',
    icon: '🐛',
    color: '#C1121F',
    gradient: 'linear-gradient(135deg, #C1121F 0%, #E5383B 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'java-mod12-les1',
        title: 'Los errores típicos',
        icon: '⚠️',
        exercises: [
          {
            id: 'javae127', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el error nº1 al empezar con Java?',
            choices: ['Usar mayúsculas donde no toca', 'Olvidar el punto y coma', 'Elegir mal el color', 'Poner el programa en minúsculas'],
            correct: 1,
            explanation: 'Olvidar el ; es casi universal. Java es estricto: cada sentencia debe terminar en punto y coma.'
          },
          {
            id: 'javae128', type: 'multiple-choice', xp: 15,
            question: 'Java distingue mayúsculas de minúsculas, ¿verdad?',
            choices: ['Sí: Main y main son cosas distintas', 'No', 'Solo en los métodos', 'Solo en Linux'],
            correct: 0,
            explanation: 'Sí, Java es sensible a mayúsculas. String y string no son lo mismo, y el fallo puede ser muy difícil de ver.'
          },
          {
            id: 'javae129', type: 'fill-blank', xp: 20,
            question: 'En Java cada sentencia se cierra con punto y coma. Ponlo al final de la línea que declara la edad:',
            code: 'int edad = 30___\nSystem.out.println(edad);',
            blanks: [';'],
            options: [';', ':', '!', '?'],
            correct: 0,
            explanation: 'Falta el punto y coma al final de la declaración. Sin él el compilador señala la línea siguiente y confunde.'
          },
          {
            id: 'javae130', type: 'predict-output', xp: 25,
            question: '¿Qué pasa al ejecutar esto?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int x = 7;\n        int y = 0;\n        System.out.println(x / y);\n    }\n}',
            // El código falla a propósito: la pregunta es justo por qué
            expectError: true,
            output: ['imprime 0', 'error de división por cero', 'imprime Infinity', 'imprime NaN'],
            correctOutput: 1,
            explanation: 'Java lanza ArithmeticException y el programa se detiene en esa línea. En JavaScript daría Infinity, pero aquí se para en seco.'
          },
          {
            id: 'javae131', type: 'multiple-choice', xp: 20,
            question: '¿Por qué es peligroso dividir entre un cero que viene de una variable?',
            choices: ['Va muy lento', 'Porque puede_dumpiar el programa entero, no solo esa línea', 'Porque da 0', 'Porque redondea'],
            correct: 1,
            explanation: 'La excepción detiene el programa. Por eso conviene comprobar el divisor antes de dividir.'
          },
          {
            id: 'javae132', type: 'type-code', xp: 30,
            description: 'Programa que divide 10 entre 2 usando un bucle for y va imprimiendo el resultado de la división en cada vuelta.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Imprime 10/1, 10/2 y 10/3\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 3; i++) {\n            System.out.println(10 / i);\n        }\n    }\n}',
            explanation: 'El bucle va del 1 al 3 y en cada vuelta divide entre el valor de i. La división es entera, así que va troncando.',
            tests: [{ expected: '10\n5\n3\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 13: ORIENTACIÓN A OBJETOS
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod13',
    title: 'Orientación a Objetos',
    subtitle: 'Clases que se relacionan',
    icon: '🧬',
    color: '#3A0CA3',
    gradient: 'linear-gradient(135deg, #3A0CA3 0%, #7209B7 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'java-mod13-les1',
        title: 'Encapsular con private',
        icon: '🔒',
        exercises: [
          {
            id: 'javae133', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace private en un campo?',
            choices: ['Lo borra', 'Impide que se use desde fuera de la clase', 'Lo hace público', 'Lo vuelve estático'],
            correct: 1,
            explanation: 'Con private el campo solo es visible dentro de su clase. Es la forma de proteger los datos y obligar a usar métodos.'
          },
          {
            id: 'javae134', type: 'multiple-choice', xp: 20,
            question: '¿Por qué se oculta un campo y se usa un método?',
            choices: ['Es más rápido', 'Para poder validar el valor al entrar, no solo al asignar', 'Ocupa menos', 'Java lo pide'],
            correct: 1,
            explanation: 'El método puede comprobar cosas y lanzar un error si el valor no vale. Al asignar el campo directamente nadie te frena.'
          },
          {
            id: 'javae135', type: 'fill-blank', xp: 25,
            question: 'Declara un campo privado:',
            code: 'class Libro {\n    ___ String titulo;\n}',
            blanks: ['private'],
            options: ['private', 'public', 'hidden', 'secret'],
            correct: 0,
            explanation: 'private es la palabra clave. Sin modificador sería "de paquete", que no protege nada.'
          },
          {
            id: 'javae136', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        Libro l = new Libro();\n        l.setTitulo("Dune");\n        System.out.println(l.getTitulo());\n    }\n}\nclass Libro {\n    private String titulo;\n    public void setTitulo(String t) {\n        this.titulo = t;\n    }\n    public String getTitulo() {\n        return this.titulo;\n    }\n}',
            output: ['Dune', 'null', 'error', 'Libro'],
            correctOutput: 0,
            explanation: 'setTitulo guarda el valor y getTitulo lo devuelve. Con private, nadie puede tocar el campo desde fuera.'
          },
          {
            id: 'javae137', type: 'multiple-choice', xp: 25,
            question: '¿Cómo se llama un método que empieza por "get"?',
            choices: ['Un setter', 'Un getter, devuelve el valor', 'Un constructor', 'Un bucle'],
            correct: 1,
            explanation: 'getX() devuelve el valor y setX(valor) lo cambia. Es la convención que se usa en todas las clases de Java.'
          },
          {
            id: 'javae138', type: 'type-code', xp: 40,
            description: 'Crea una clase Temperatura con un campo privado celsius y métodos setCelsius y getCelsius. Crea una y comprueba que devuelve lo que le puse.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        // Crea la temperatura e imprímela\n    }\n}\nclass Temperatura {\n    // Campo, setter y getter\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        Temperatura t = new Temperatura();\n        t.setCelsius(21);\n        System.out.println(t.getCelsius());\n    }\n}\nclass Temperatura {\n    private int celsius;\n    public void setCelsius(int c) {\n        this.celsius = c;\n    }\n    public int getCelsius() {\n        return this.celsius;\n    }\n}',
            explanation: 'El campo es private, así que el main no puede tocarlo: tiene que pasar por los métodos. Eso es encapsular.',
            tests: [{ expected: '21\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // JAVA MÓDULO 14: 🏆 PROYECTO
  // ═══════════════════════════════════════════════
  {
    id: 'java-mod14',
    title: '🏆 Proyecto: Gestor de Biblioteca',
    subtitle: 'Un programa completo de principio a fin',
    icon: '🏛️',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'java-mod14-les1',
        title: 'La biblioteca entera',
        icon: '🏛️',
        exercises: [
          {
            id: 'javae139', type: 'multiple-choice', xp: 20,
            question: '¿Por qué usar una clase Libro en vez de solo variables sueltas?',
            choices: ['Es más corto', 'Agrupa los datos relacionados y se puede añadir comportamiento', 'Java lo obliga', 'Es más rápido'],
            correct: 1,
            explanation: 'Una clase deja el título, el año y el precio juntos, y permite añadir un método como esAntiguo() sin ensuciar el main.'
          },
          {
            id: 'javae140', type: 'multiple-choice', xp: 20,
            question: 'Para contar cuántos libros hay, ¿qué conviene?',
            choices: ['Un método que recorra el array y devuelva el total', 'Contarlos a mano', 'Un contador global', 'Nada'],
            correct: 0,
            explanation: 'Un método que devuelve el número de elementos deja el main limpio y se puede reutilizar en otros sitios.'
          },
          {
            id: 'javae141', type: 'fill-blank', xp: 25,
            question: 'Completa el for que suma los precios de todos los libros:',
            code: 'int total = 0;\nfor (int i = 0; i < libros.___; i++) {\n    total += libros[i].precio;\n}',
            blanks: ['length'],
            options: ['length', 'size', 'count', 'total'],
            correct: 0,
            explanation: 'length da el número de libros, y con i se accede a cada uno. El precio del libro es libros[i].precio.'
          },
          {
            id: 'javae142', type: 'predict-output', xp: 25,
            question: '¿Qué imprime?',
            codeToRun: 'public class Main {\n    public static void main(String[] args) {\n        int[] precios = {10, 20, 30};\n        int total = 0;\n        for (int i = 0; i < precios.length; i++) {\n            total += precios[i];\n        }\n        System.out.println(total);\n    }\n}',
            output: ['60', '30', '3', '10'],
            correctOutput: 0,
            explanation: 'El += va guardando 10, luego 30 y al final 60. El bucle recorre los tres precios gracias al length.'
          },
          {
            id: 'javae143', type: 'multiple-choice', xp: 25,
            question: '¿Qué leyó mejor un proyecto real?',
            choices: ['El método más corto', 'Métodos con una tarea clara y nombres que expliquen lo que hacen', 'Más comentarios', 'Más println'],
            correct: 1,
            explanation: 'Un buen nombre dice más que un comentario: calcularTotal() explica su propósito sin abrir el método.'
          },
          {
            id: 'javae144', type: 'type-code', xp: 55,
            description: 'Informe de biblioteca: crea un array de 3 precios, calcula el total con un bucle y el número de libros, e imprime ambos.',
            starter: 'public class Main {\n    public static void main(String[] args) {\n        int[] precios = {12, 18, 15};\n        // Calcula e imprime el total y cuántos hay\n    }\n}',
            solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] precios = {12, 18, 15};\n        int total = 0;\n        for (int i = 0; i < precios.length; i++) {\n            total += precios[i];\n        }\n        System.out.println(total);\n        System.out.println(precios.length);\n    }\n}',
            explanation: 'El bucle acumula el total y length da cuántos libros hay. Las dos líneas del final son el informe.',
            tests: [{ expected: '45\n3\n' }]
          }
        ]
      }
    ]
  }
];
