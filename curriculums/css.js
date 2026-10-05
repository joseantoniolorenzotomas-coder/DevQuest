// CSS Curriculum — El estilo de la web
// Módulos 1–6 en esta entrega; el resto llega en próximas sesiones.

window.CSS_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // CSS MÓDULO 1: TU PRIMER ESTILO
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod1',
    title: 'Tu Primer Estilo',
    subtitle: 'Colores y formas con CSS',
    icon: '🌱',
    color: '#2965F1',
    gradient: 'linear-gradient(135deg, #2965F1 0%, #33A9DC 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'css-mod1-les1',
        title: '¿Qué es CSS?',
        icon: '🤔',
        exercises: [
          {
            id: 'css001', type: 'multiple-choice', xp: 10,
            question: '¿Qué significa CSS?',
            choices: ['Cascading Style Sheets', 'Code Styling System', 'Center of Style Sheets', 'Creative Style Syntax'],
            correct: 0,
            explanation: 'CSS son las siglas de Cascading Style Sheets: hojas de estilo en cascada.'
          },
          {
            id: 'css002', type: 'multiple-choice', xp: 10,
            question: '¿De qué se encarga CSS?',
            choices: ['La estructura del contenido', 'El aspecto: colores, tamaños y diseño', 'La lógica del programa', 'Los datos'],
            correct: 1,
            explanation: 'HTML da estructura y CSS da estilo: colores, fuentes, tamaños y posiciones.'
          },
          {
            id: 'css003', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama la parte que elige a quién aplicar el estilo?',
            choices: ['Declaración', 'Propiedad', 'Selector', 'Valor'],
            correct: 2,
            explanation: 'El selector dice a qué elementos se aplica la regla (por ejemplo, h1).'
          },
          {
            id: 'css004', type: 'fill-blank', xp: 20,
            question: 'Completa la regla para poner títulos en rojo:',
            code: 'h1 {\n    color: ___\n}',
            blanks: ['red'],
            options: ['red', 'rojo', '#red', 'color'],
            explanation: 'La propiedad es color y el valor red (en inglés o con su nombre CSS).'
          },
          {
            id: 'css005', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detectará al ejecutar este CSS?',
            codeToRun: 'h1 {\n    color: red\n}',
            output: ['h1 { color: red }', 'color: red', 'h1', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'La regla se lee como: selector h1, propiedad color, valor red.'
          },
          {
            id: 'css006', type: 'type-code', xp: 25,
            explanation: 'El selector es la etiqueta a la que se aplica la regla, y las declaraciones van entre llaves separadas por punto y coma.',
            description: 'Escribe una regla que ponga el color de todos los <h1> en rojo.',
            starter: '/* Tu CSS aquí */',
            solution: 'h1 {\n    color: red;\n}',
            tests: [{ expected: 'h1 { color: red }\n' }]
          }
        ]
      },
      {
        id: 'css-mod1-les2',
        title: 'Cómo conectar el CSS',
        icon: '🔗',
        exercises: [
          {
            id: 'css007', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama una regla CSS?',
            choices: ['Regla de estilo', 'Bloque de estilo', 'Estilo', 'Todas son correctas'],
            correct: 3,
            explanation: 'Un "bloque de reglas" es lo más correcto, pero se le llama regla, estilo o bloque.'
          },
          {
            id: 'css008', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se separa el selector de la propiedad?',
            choices: ['Con un punto y coma', 'Con llaves { }', 'Con dos puntos', 'Con un igual'],
            correct: 1,
            explanation: 'Las llaves separan el selector de las declaraciones.'
          },
          {
            id: 'css009', type: 'fill-blank', xp: 20,
            question: 'Completa la declaración con punto y coma:',
            code: 'p {\n    font-size: 16px___    color: black\n}',
            blanks: [';'],
            options: [';', ':', ',', '.'],
            explanation: 'Cada declaración termina en punto y coma.'
          },
          {
            id: 'css010', type: 'predict-output', xp: 20,
            question: '¿Qué reglas se detectan?',
            codeToRun: 'p {\n    font-size: 16px;\n    color: black\n}',
            output: ['p { font-size: 16px; color: black }', 'p', 'font-size: 16px', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El analizador muestra el selector y ambas declaraciones unidas.'
          },
          {
            id: 'css011', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se escribe un comentario en CSS?',
            choices: ['// comentario', '<!-- comentario -->', '/* comentario */', '# comentario'],
            correct: 2,
            explanation: 'Los comentarios de CSS van entre /* y */.'
          },
          {
            id: 'css012', type: 'type-code', xp: 30,
            explanation: 'El comentario se abre con /* y se cierra con */. Puede colocarse en cualquier punto del CSS y no se muestra en la web.',
            description: 'Escribe una regla para <p> con color gris y tamaño 14px, con un comentario antes.',
            starter: '/* Tu CSS aquí */',
            solution: '/* Estilo de párrafos */\np {\n    color: gray;\n    font-size: 14px;\n}',
            tests: [{ expected: 'p { color: gray; font-size: 14px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 2: COLORES Y FONDOS
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod2',
    title: 'Colores y Fondos',
    subtitle: 'Dale color a tu página',
    icon: '🎨',
    color: '#F093FB',
    gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'css-mod2-les1',
        title: 'Formas de color',
        icon: '🌈',
        exercises: [
          {
            id: 'css013', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se escribe un color en hexadecimal?',
            choices: ['#FF5733', 'rgbFF5733', 'FF5733', '@FF5733'],
            correct: 0,
            explanation: 'El hexadecimal empieza por # y usa 6 dígitos: #RRGGBB.'
          },
          {
            id: 'css014', type: 'multiple-choice', xp: 15,
            question: '¿Qué significan los dos dígitos de #RRGGBB?',
            choices: ['Rojo y verde', 'Gris y azul', 'Tamaño y color', 'Nada'],
            correct: 0,
            explanation: 'El primer par es rojo (R), el segundo verde (G) y el tercero azul (B).'
          },
          {
            id: 'css015', type: 'fill-blank', xp: 20,
            question: 'Pon un fondo rojo usando rgb:',
            code: 'body {\n    background-color: ___\n}',
            blanks: ['rgb(255, 0, 0)'],
            options: ['rgb(255, 0, 0)', 'rgb(#FF0000)', 'red, 255, 0', '255,0,0'],
            explanation: 'rgb(255, 0, 0) es rojo puro (valores de 0 a 255).'
          },
          {
            id: 'css016', type: 'multiple-choice', xp: 20,
            question: '¿Qué color indica rgba(0, 0, 0, 0.5)?',
            choices: ['Blanco transparente', 'Negro semi-transparente', 'Gris sólido', 'Rojo claro'],
            correct: 1,
            explanation: 'El cuarto valor es la opacidad (0.5 = 50%), sobre un negro.'
          },
          {
            id: 'css017', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'body {\n    background-color: #FFFFFF\n}',
            output: ['body { background-color: #FFFFFF }', 'body', 'background-color', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El analizador muestra la regla tal cual, con el valor hexadecimal.'
          },
          {
            id: 'css018', type: 'type-code', xp: 25,
            explanation: 'background-color con un color hexadecimal entre almohadillas pinta el fondo del elemento.',
            description: 'Escribe una regla para el body con fondo blanco (#FFFFFF).',
            starter: '/* Tu CSS aquí */',
            solution: 'body {\n    background-color: #FFFFFF;\n}',
            tests: [{ expected: 'body { background-color: #FFFFFF }\n' }]
          }
        ]
      },
      {
        id: 'css-mod2-les2',
        title: 'Bordes decorativos',
        icon: '🖌️',
        exercises: [
          {
            id: 'css019', type: 'multiple-choice', xp: 15,
            question: '¿Qué propiedad redondea las esquinas?',
            choices: ['round', 'border-radius', 'corner', 'curve'],
            correct: 1,
            explanation: 'border-radius redondea las esquinas de un elemento.'
          },
          {
            id: 'css020', type: 'fill-blank', xp: 20,
            question: 'Redondea todas las esquinas 8 píxeles:',
            code: '.tarjeta {\n    border-radius: ___px\n}',
            blanks: ['8'],
            options: ['8', 'todos', 'all', 'redondo'],
            explanation: 'border-radius: 8px redondea las cuatro esquinas.'
          },
          {
            id: 'css021', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace la propiedad box-shadow?',
            choices: ['Cambia el color del texto', 'Añade una sombra', 'Borra el fondo', 'Centra el texto'],
            correct: 1,
            explanation: 'box-shadow añade sombras: box-shadow: 2px 2px 5px gray.'
          },
          {
            id: 'css022', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.boton {\n    border-radius: 6px;\n    box-shadow: 0 2px 4px gray\n}',
            output: ['.boton { border-radius: 6px; box-shadow: 0 2px 4px gray }', '.boton', 'border-radius: 6px', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El selector es una clase (.boton) con dos declaraciones.'
          },
          {
            id: 'css023', type: 'multiple-choice', xp: 20,
            question: '¿Qué significa el primer valor de box-shadow: 0 2px 4px gray?',
            choices: ['El color', 'El desplazamiento horizontal', 'El tamaño del radio', 'El ancho'],
            correct: 1,
            explanation: 'box-shadow sigue el orden: desplazamiento X, desplazamiento Y, difuminado y color.'
          },
          {
            id: 'css024', type: 'type-code', xp: 30,
            explanation: 'border-radius redondea las esquinas y background-color pinta el fondo. Las dos declaraciones pueden ir en el mismo bloque.',
            description: 'Crea la clase ".boton" con esquinas redondeadas 20px y fondo azul.',
            starter: '/* Tu CSS aquí */',
            solution: '.boton {\n    border-radius: 20px;\n    background-color: blue;\n}',
            tests: [{ expected: '.boton { border-radius: 20px; background-color: blue }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 3: TIPOGRAFÍA
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod3',
    title: 'Tipografía',
    subtitle: 'Fuentes, tamaños y textos',
    icon: '🔠',
    color: '#4FACFE',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'css-mod3-les1',
        title: 'Fuentes y tamaños',
        icon: '🖋️',
        exercises: [
          {
            id: 'css025', type: 'multiple-choice', xp: 10,
            question: '¿Qué propiedad cambia la tipografía?',
            choices: ['font', 'font-family', 'typeface', 'letter'],
            correct: 1,
            explanation: 'font-family indica qué fuente (o lista de fuentes) se usa.'
          },
          {
            id: 'css026', type: 'fill-blank', xp: 20,
            question: 'Usa la fuente Arial como principal:',
            code: 'body {\n    font-family: ___\n}',
            blanks: ['Arial, sans-serif'],
            options: ['Arial, sans-serif', 'Arial()', 'Arial;', 'font: Arial'],
            explanation: 'Se escribe el nombre y, tras la coma, una fuente genérica por si Arial no está.'
          },
          {
            id: 'css027', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve font-weight?',
            choices: ['El color del texto', 'El grosor (normal, bold)', 'El interlineado', 'La alineación'],
            correct: 1,
            explanation: 'font-weight controla el grosor: normal, bold, 300, 700...'
          },
          {
            id: 'css028', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'h1 {\n    font-family: Arial;\n    font-size: 32px;\n    font-weight: bold\n}',
            output: ['h1 { font-family: Arial; font-size: 32px; font-weight: bold }', 'h1', 'font-size: 32px', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Una regla con tres declaraciones de tipografía.'
          },
          {
            id: 'css029', type: 'multiple-choice', xp: 20,
            question: '¿Qué propiedad separa las líneas de un texto?',
            choices: ['line-height', 'letter-spacing', 'text-height', 'spacing'],
            correct: 0,
            explanation: 'line-height controla el interlineado. letter-spacing es el espacio entre letras.'
          },
          {
            id: 'css030', type: 'type-code', xp: 25,
            explanation: 'font-family elige la tipografía, font-size el tamaño en píxeles y font-weight: bold pone el texto en negrita.',
            description: 'Escribe una regla para h1 con fuente Georgia, 28px y en negrita.',
            starter: '/* Tu CSS aquí */',
            solution: 'h1 {\n    font-family: Georgia;\n    font-size: 28px;\n    font-weight: bold;\n}',
            tests: [{ expected: 'h1 { font-family: Georgia; font-size: 28px; font-weight: bold }\n' }]
          }
        ]
      },
      {
        id: 'css-mod3-les2',
        title: 'Alinear y decorar texto',
        icon: '📏',
        exercises: [
          {
            id: 'css031', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se centra un texto?',
            choices: ['align: center', 'text-align: center', 'center: true', 'text: center'],
            correct: 1,
            explanation: 'text-align: center centra el texto dentro de su contenedor.'
          },
          {
            id: 'css032', type: 'fill-blank', xp: 20,
            question: 'Espacia las letras 2 píxeles:',
            code: '.titulo {\n    letter-spacing: ___px\n}',
            blanks: ['2'],
            options: ['2', 'todos', 'wide', 'espaciado'],
            explanation: 'letter-spacing aumenta el espacio entre caracteres.'
          },
          {
            id: 'css033', type: 'multiple-choice', xp: 20,
            question: '¿Qué valores puede tomar text-transform?',
            choices: ['uppercase, lowercase, capitalize', 'on, off', '1, 2, 3', 'true, false'],
            correct: 0,
            explanation: 'text-transform cambia las mayúsculas/minúsculas del texto mostrado.'
          },
          {
            id: 'css034', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.aviso {\n    text-align: center;\n    text-transform: uppercase\n}',
            output: ['.aviso { text-align: center; text-transform: uppercase }', '.aviso', 'text-align: center', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Dos declaraciones sobre una clase.'
          },
          {
            id: 'css035', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la convención más común para los tamaños de fuente?',
            choices: ['Puntos (pt)', 'Píxeles (px) y rem', 'Centímetros', 'Porcentajes'],
            correct: 1,
            explanation: 'Hoy se usan px y sobre todo rem, que respetan el tamaño del usuario.'
          },
          {
            id: 'css036', type: 'type-code', xp: 30,
            explanation: 'text-align alinea el texto, text-transform: uppercase lo pasa a mayúsculas y letter-spacing separa las letras entre sí.',
            description: 'Crea la clase ".destacado" con texto centrado, en mayúsculas y espaciado de 3px.',
            starter: '/* Tu CSS aquí */',
            solution: '.destacado {\n    text-align: center;\n    text-transform: uppercase;\n    letter-spacing: 3px;\n}',
            tests: [{ expected: '.destacado { text-align: center; text-transform: uppercase; letter-spacing: 3px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 4: EL MODELO DE CAJA
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod4',
    title: 'El Modelo de Caja',
    subtitle: 'width, height, padding, border y margin',
    icon: '📦',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'css-mod4-les1',
        title: 'Tamaño y espacio interno',
        icon: '📐',
        exercises: [
          {
            id: 'css037', type: 'multiple-choice', xp: 10,
            question: '¿Qué propiedad fija el ancho de un elemento?',
            choices: ['size', 'width', 'ancho', 'box'],
            correct: 1,
            explanation: 'width define el ancho (y height el alto).'
          },
          {
            id: 'css038', type: 'multiple-choice', xp: 15,
            question: '¿Qué es el padding?',
            choices: ['Espacio fuera del elemento', 'Espacio entre el borde y el contenido', 'El grosor del borde', 'La altura'],
            correct: 1,
            explanation: 'padding es el espacio interior: del borde hacia el contenido.'
          },
          {
            id: 'css039', type: 'fill-blank', xp: 20,
            question: 'Aplica 20 píxeles de relleno por dentro:',
            code: '.caja {\n    padding: ___px\n}',
            blanks: ['20'],
            options: ['20', 'todos', 'inside', '20%'],
            explanation: 'padding: 20px aplica el mismo valor a los cuatro lados.'
          },
          {
            id: 'css040', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.caja {\n    width: 200px;\n    padding: 10px\n}',
            output: ['.caja { width: 200px; padding: 10px }', '.caja', 'width: 200px', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'width y padding juntos definen el tamaño visible.'
          },
          {
            id: 'css041', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace box-sizing: border-box?',
            choices: ['Añade un borde', 'Incluye padding y borde dentro del width', 'Quita el margen', 'Centra el contenido'],
            correct: 1,
            explanation: 'Con border-box el width incluye padding y borde, lo que hace los cálculos más previsibles.'
          },
          {
            id: 'css042', type: 'type-code', xp: 25,
            explanation: 'box-sizing: border-box hace que el padding y el borde cuenten dentro del width, que es lo que se quiere casi siempre.',
            description: 'Crea la clase ".caja" con width 300px, padding 20px y box-sizing border-box.',
            starter: '/* Tu CSS aquí */',
            solution: '.caja {\n    width: 300px;\n    padding: 20px;\n    box-sizing: border-box;\n}',
            tests: [{ expected: '.caja { width: 300px; padding: 20px; box-sizing: border-box }\n' }]
          }
        ]
      },
      {
        id: 'css-mod4-les2',
        title: 'Bordes y márgenes',
        icon: '🖌️',
        exercises: [
          {
            id: 'css043', type: 'multiple-choice', xp: 15,
            question: '¿Qué es el margin?',
            choices: ['Espacio dentro del elemento', 'Espacio exterior alrededor del elemento', 'El borde', 'El fondo'],
            correct: 1,
            explanation: 'margin separa el elemento de los demás, hacia fuera.'
          },
          {
            id: 'css044', type: 'fill-blank', xp: 20,
            question: 'Centra horizontalmente un bloque:',
            code: '.bloque {\n    width: 50%;\n    margin: 0 ___\n}',
            blanks: ['auto'],
            options: ['auto', 'center', 'middle', '0'],
            explanation: 'margin: 0 auto centra el bloque cuando tiene un width definido.'
          },
          {
            id: 'css045', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se escribe un borde completo?',
            choices: ['borde: 2px solid red', 'border: 2px solid red', 'box: 2px solid red', 'line: 2px solid red'],
            correct: 1,
            explanation: 'border sigue el orden: grosor, estilo y color.'
          },
          {
            id: 'css046', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'p {\n    margin: 0 auto;\n    border: 1px solid gray\n}',
            output: ['p { margin: 0 auto; border: 1px solid gray }', 'p', 'margin: 0 auto', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Dos declaraciones: margen automático y borde gris.'
          },
          {
            id: 'css047', type: 'multiple-choice', xp: 20,
            question: '¿Qué valores puede tener border-style además de solid?',
            choices: ['dashed, dotted, double, none', 'on, off', '1, 2, 3', 'alto, bajo'],
            correct: 0,
            explanation: 'Los estilos de borde más usados: solid, dashed, dotted, double y none.'
          },
          {
            id: 'css048', type: 'type-code', xp: 30,
            explanation: 'El border dibuja el marco, el margin separa la caja de las demás y el padding deja aire entre el marco y el contenido.',
            description: 'Crea la clase ".panel" con borde 2px solid, margen exterior de 20px y padding 15px.',
            starter: '/* Tu CSS aquí */',
            solution: '.panel {\n    border: 2px solid;\n    margin: 20px;\n    padding: 15px;\n}',
            tests: [{ expected: '.panel { border: 2px solid; margin: 20px; padding: 15px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 5: DISPLAY Y POSICIONES
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod5',
    title: 'Display y Posiciones',
    subtitle: 'Coloca cada elemento donde toca',
    icon: '📍',
    color: '#A18CD1',
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'css-mod5-les1',
        title: 'La propiedad display',
        icon: '🧱',
        exercises: [
          {
            id: 'css049', type: 'multiple-choice', xp: 10,
            question: '¿Qué valor de display hace que un elemento NO aparezca?',
            choices: ['hidden', 'none', 'off', 'invisible'],
            correct: 1,
            explanation: 'display: none elimina el elemento por completo del layout.'
          },
          {
            id: 'css050', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es el display por defecto de los <div>?',
            choices: ['inline', 'block', 'inline-block', 'flex'],
            correct: 1,
            explanation: 'Los div son block: ocupan toda la línea y empiezan en una nueva.'
          },
          {
            id: 'css051', type: 'fill-blank', xp: 20,
            question: 'Haz que un span se comporte como bloque:',
            code: 'span {\n    display: ___\n}',
            blanks: ['block'],
            options: ['block', 'inline', 'none', 'flex'],
            explanation: 'display: block convierte el span en bloque.'
          },
          {
            id: 'css052', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.oculto {\n    display: none\n}',
            output: ['.oculto { display: none }', '.oculto', 'display', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'La regla oculta completamente los elementos con esa clase.'
          },
          {
            id: 'css053', type: 'multiple-choice', xp: 20,
            question: '¿Qué es inline-block?',
            choices: ['Bloque invisible', 'Híbrido: en línea pero con width y height', 'Igual que inline', 'Display de un <br>'],
            correct: 1,
            explanation: 'inline-block fluye en la línea como inline, pero acepta width, height, margin y padding.'
          },
          {
            id: 'css054', type: 'type-code', xp: 25,
            explanation: 'inline-block hace que la caja se comporte como texto en línea pero acepte width, height y padding.',
            description: 'Escribe una regla para la clase ".chip" con display inline-block, padding 6px y fondo gris claro.',
            starter: '/* Tu CSS aquí */',
            solution: '.chip {\n    display: inline-block;\n    padding: 6px;\n    background-color: #EEEEEE;\n}',
            tests: [{ expected: '.chip { display: inline-block; padding: 6px; background-color: #EEEEEE }\n' }]
          }
        ]
      },
      {
        id: 'css-mod5-les2',
        title: 'position',
        icon: '🧲',
        exercises: [
          {
            id: 'css055', type: 'multiple-choice', xp: 15,
            question: '¿Qué valor de position saca el elemento del flujo normal?',
            choices: ['relative', 'absolute', 'static', 'normal'],
            correct: 1,
            explanation: 'position: absolute y fixed sacan el elemento del flujo normal.'
          },
          {
            id: 'css056', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace position: fixed?',
            choices: ['Se mueve al hacer scroll', 'Se queda fijo respecto a la ventana', 'Se posiciona respecto al padre', 'Centra el elemento'],
            correct: 1,
            explanation: 'fixed se ancla a la ventana: no se mueve al hacer scroll.'
          },
          {
            id: 'css057', type: 'fill-blank', xp: 20,
            question: 'Fija una barra superior en 10 píxeles del tope:',
            code: '.barra {\n    position: fixed;\n    top: ___px;\n    left: 0\n}',
            blanks: ['10'],
            options: ['10', '0', 'top', 'arriba'],
            explanation: 'top: 10px deja la barra a 10 píxeles del borde superior.'
          },
          {
            id: 'css058', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.badge {\n    position: absolute;\n    top: 0;\n    right: 0\n}',
            output: ['.badge { position: absolute; top: 0; right: 0 }', '.badge', 'position: absolute', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Un badge posicionado en la esquina superior derecha.'
          },
          {
            id: 'css059', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el position por defecto de todo elemento?',
            choices: ['static', 'relative', 'absolute', 'block'],
            correct: 0,
            explanation: 'static es el valor inicial: el elemento sigue el flujo normal.'
          },
          {
            id: 'css060', type: 'type-code', xp: 30,
            explanation: 'position: fixed saca la caja del flujo normal y la ancla a la ventana; inset: 0 la estira para que cubra todo.',
            description: 'Crea una clase ".overlay" que cubra toda la ventana: position fixed, inset 0 y fondo negro semitransparente.',
            starter: '/* Tu CSS aquí */',
            solution: '.overlay {\n    position: fixed;\n    inset: 0;\n    background-color: rgba(0, 0, 0, 0.5);\n}',
            tests: [{ expected: '.overlay { position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5) }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 6: FLEXBOX
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod6',
    title: 'Flexbox',
    subtitle: 'Distribuye elementos en una o dos dimensiones',
    icon: '↔️',
    color: '#00D4FF',
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'css-mod6-les1',
        title: 'Contenedor y dirección',
        icon: '📐',
        exercises: [
          {
            id: 'css061', type: 'multiple-choice', xp: 10,
            question: '¿Qué valor activa Flexbox en un contenedor?',
            choices: ['display: flex', 'display: flexbox', 'flex: true', 'display: grid'],
            correct: 0,
            explanation: 'display: flex convierte el contenedor en un flex container.'
          },
          {
            id: 'css062', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace flex-direction: column?',
            choices: ['Coloca en horizontal', 'Coloca en vertical', 'Centra todo', 'Nada'],
            correct: 1,
            explanation: 'column apila los hijos verticalmente (row es el valor por defecto).'
          },
          {
            id: 'css063', type: 'fill-blank', xp: 20,
            question: 'Activa flexbox en horizontal:',
            code: '.contenedor {\n    display: flex;\n    flex-direction: ___\n}',
            blanks: ['row'],
            options: ['row', 'column', 'horizontal', 'block'],
            explanation: 'flex-direction: row es el valor por defecto.'
          },
          {
            id: 'css064', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.fila {\n    display: flex;\n    justify-content: space-between\n}',
            output: ['.fila { display: flex; justify-content: space-between }', '.fila', 'display: flex', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El contenedor reparte sus hijos con space-between.'
          },
          {
            id: 'css065', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace justify-content: space-between?',
            choices: ['Junta todo a la izquierda', 'Reparte el espacio sobrante entre los elementos', 'Centra verticalmente', 'Envuelve en varias líneas'],
            correct: 1,
            explanation: 'space-between deja el primer elemento al inicio y el último al final, con el espacio repartido.'
          },
          {
            id: 'css066', type: 'type-code', xp: 30,
            explanation: 'En flex, la dirección principal la marca flex-direction. justify-content reparte a los hijos en esa dirección y space-between pone el primero al principio y el último al final.',
            description: 'Crea la clase ".fila" con display flex, dirección column y space-between.',
            starter: '/* Tu CSS aquí */',
            solution: '.fila {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}',
            tests: [{ expected: '.fila { display: flex; flex-direction: column; justify-content: space-between }\n' }]
          }
        ]
      },
      {
        id: 'css-mod6-les2',
        title: 'Alineación y Wrap',
        icon: '🧮',
        exercises: [
          {
            id: 'css067', type: 'multiple-choice', xp: 15,
            question: '¿Qué alinea los hijos en el eje vertical?',
            choices: ['align-items', 'justify-content', 'align-self', 'vertical-align'],
            correct: 0,
            explanation: 'align-items alinea en el eje cruzado (vertical si la dirección es row).'
          },
          {
            id: 'css068', type: 'fill-blank', xp: 20,
            question: 'Centra los hijos verticalmente:',
            code: '.fila {\n    display: flex;\n    align-items: ___\n}',
            blanks: ['center'],
            options: ['center', 'middle', 'centro', 'space-between'],
            explanation: 'align-items: center centra cada hijo verticalmente.'
          },
          {
            id: 'css069', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace flex-wrap: wrap?',
            choices: ['Repite los hijos', 'Pasa a la línea siguiente si no caben', 'Endurece los hijos', 'Nada'],
            correct: 1,
            explanation: 'wrap permite que los hijos bajen de línea cuando no caben en el ancho.'
          },
          {
            id: 'css070', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.grid-cards {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 16px\n}',
            output: ['.grid-cards { display: flex; flex-wrap: wrap; gap: 16px }', '.grid-cards', 'gap: 16px', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Una rejilla de tarjetas que envuelve y usa gap para separarlas.'
          },
          {
            id: 'css071', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace align-items: stretch (valor por defecto)?',
            choices: ['Estira los hijos para llenar el alto del contenedor', 'Centra todo', 'Alinea a la derecha', 'Fija el ancho'],
            correct: 0,
            explanation: 'stretch es el valor inicial: los hijos se estiran en el eje cruzado.'
          },
          {
            id: 'css072', type: 'type-code', xp: 30,
            explanation: 'Con el eje principal en horizontal, justify-content alinea en horizontal y align-items en vertical. El gap separa los hijos sin usar márgenes.',
            description: 'Crea la clase ".centrado" con display flex, centrado en ambos ejes y gap de 10px.',
            starter: '/* Tu CSS aquí */',
            solution: '.centrado {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    gap: 10px;\n}',
            tests: [{ expected: '.centrado { display: flex; justify-content: center; align-items: center; gap: 10px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 7: CSS GRID
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod7',
    title: 'CSS Grid',
    subtitle: 'Rejillas de dos dimensiones',
    icon: '🔲',
    color: '#F7DF1E',
    gradient: 'linear-gradient(135deg, #F7DF1E 0%, #E8A800 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'css-mod7-les1',
        title: 'Columnas y filas',
        icon: '📊',
        exercises: [
          {
            id: 'css073', type: 'multiple-choice', xp: 10,
            question: '¿Qué valor activa CSS Grid?',
            choices: ['display: grid', 'display: gridbox', 'grid: true', 'display: flex'],
            correct: 0,
            explanation: 'display: grid convierte el contenedor en una rejilla de dos dimensiones.'
          },
          {
            id: 'css074', type: 'multiple-choice', xp: 15,
            question: '¿Qué unidad representa una fracción del espacio disponible?',
            choices: ['%', 'fr', 'px', 'em'],
            correct: 1,
            explanation: 'La unidad fr distribuye el espacio sobrante en fracciones.'
          },
          {
            id: 'css075', type: 'fill-blank', xp: 20,
            question: 'Crea una rejilla de 3 columnas iguales:',
            code: '.rejilla {\n    display: grid;\n    grid-template-columns: ___ (3, 1fr)\n}',
            blanks: ['repeat'],
            options: ['repeat', 'times', 'clone', 'loop'],
            explanation: 'repeat(3, 1fr) repite tres veces "1fr".'
          },
          {
            id: 'css076', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.rejilla {\n    display: grid;\n    grid-template-columns: 200px 1fr\n}',
            output: ['.rejilla { display: grid; grid-template-columns: 200px 1fr }', '.rejilla', 'display: grid', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Dos columnas: una fija de 200px y otra flexible con 1fr.'
          },
          {
            id: 'css077', type: 'multiple-choice', xp: 20,
            question: '¿Qué significa 1fr 1fr?',
            choices: ['Dos columnas iguales', 'Una columna de 1 píxel', 'Dos filas', 'Nada'],
            correct: 0,
            explanation: 'Cada 1fr toma la misma parte del espacio: dos columnas iguales.'
          },
          {
            id: 'css078', type: 'type-code', xp: 30,
            explanation: 'Grid divide el contenedor en filas y columnas. repeat(3, 1fr) crea tres columnas iguales y el gap añade la separación.',
            description: 'Crea la clase ".rejilla" con display grid, 3 columnas de 1fr y gap de 16px.',
            starter: '/* Tu CSS aquí */',
            solution: '.rejilla {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 16px;\n}',
            tests: [{ expected: '.rejilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px }\n' }]
          }
        ]
      },
      {
        id: 'css-mod7-les2',
        title: 'Filas y áreas',
        icon: '🗺️',
        exercises: [
          {
            id: 'css079', type: 'multiple-choice', xp: 15,
            question: '¿Qué propiedad define cuántas filas tiene la rejilla?',
            choices: ['grid-rows', 'grid-template-rows', 'rows', 'grid-height'],
            correct: 1,
            explanation: 'grid-template-rows define las filas (igual que grid-template-columns con las columnas).'
          },
          {
            id: 'css080', type: 'fill-blank', xp: 20,
            question: 'Haz que un elemento ocupe 2 columnas:',
            code: '.destacado {\n    grid-column: ___\n}',
            blanks: ['span 2'],
            options: ['span 2', '2', 'dos', 'col 2'],
            explanation: 'grid-column: span 2 hace que ocupe dos columnas.'
          },
          {
            id: 'css081', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve grid-template-areas?',
            choices: ['Poner imágenes de fondo', 'Nombrar zonas para colocarlas por nombre', 'Crear colores', 'Nada'],
            correct: 1,
            explanation: 'Permite dibujar la rejilla con nombres y asignarlos con grid-area.'
          },
          {
            id: 'css082', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.panel {\n    display: grid;\n    grid-template-rows: 100px auto\n}',
            output: ['.panel { display: grid; grid-template-rows: 100px auto }', '.panel', 'grid-template-rows: 100px auto', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Dos filas: una fija de 100px y otra automática.'
          },
          {
            id: 'css083', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace grid-row: 2 / 4?',
            choices: ['Va de la línea 2 a la 4', 'Va a la línea 2', 'Tiene 4 líneas', 'Nada'],
            correct: 0,
            explanation: 'La barra indica un rango: de la línea 2 hasta la 4.'
          },
          {
            id: 'css084', type: 'type-code', xp: 30,
            explanation: 'Las fracciones reparten el espacio sobrante: 2fr 1fr hace que la primera columna sea el doble que la segunda.',
            description: 'Crea la clase ".layout" con display grid, 2 columnas (2fr 1fr) y 20px de separación.',
            starter: '/* Tu CSS aquí */',
            solution: '.layout {\n    display: grid;\n    grid-template-columns: 2fr 1fr;\n    gap: 20px;\n}',
            tests: [{ expected: '.layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 8: SELECTORES Y ESPECIFICIDAD
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod8',
    title: 'Selectores y Especificidad',
    subtitle: 'Elige a quién aplicas el estilo y con qué prioridad',
    icon: '🎯',
    color: '#0F3460',
    gradient: 'linear-gradient(135deg, #0F3460 0%, #533483 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'css-mod8-les1',
        title: 'Tipos de selectores',
        icon: '🔎',
        exercises: [
          {
            id: 'css085', type: 'multiple-choice', xp: 10,
            question: '¿Qué selector aplica estilo a un elemento por su clase?',
            choices: ['p', '.p', '#p', 'p.p'],
            correct: 1,
            explanation: 'El punto (.) precede al nombre de la clase.'
          },
          {
            id: 'css086', type: 'multiple-choice', xp: 15,
            question: '¿Qué selector aplica estilo a un elemento por su id?',
            choices: ['.mi-id', '#mi-id', 'mi-id', ':mi-id'],
            correct: 1,
            explanation: 'La almohadilla (#) precede al id.'
          },
          {
            id: 'css087', type: 'fill-blank', xp: 20,
            question: 'Agrupa dos selectores para aplicarles lo mismo:',
            code: '___ h1, h2 {\n    color: red;\n}',
            blanks: ['h1,'],
            options: ['h1,', 'h1 and', 'h1+', 'h1 &'],
            explanation: 'La coma agrupa selectores: h1, h2.'
          },
          {
            id: 'css088', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.card p {\n    color: gray\n}',
            output: ['.card p { color: gray }', '.card', 'p { color: gray }', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El espacio es un combinador descendiente: los <p> dentro de .card.'
          },
          {
            id: 'css089', type: 'multiple-choice', xp: 20,
            question: '¿Qué selector aplica estilo a los hijos DIRECTOS?',
            choices: ['.padre', '.padre hijo', '.padre > hijo', '.padre + hijo'],
            correct: 2,
            explanation: 'El > selecciona solo hijos directos; el espacio alcanza a nietos y más.'
          },
          {
            id: 'css090', type: 'type-code', xp: 30,
            explanation: 'El espacio entre dos selectores es un combinador descendiente: la regla se aplica a todos los a que estén dentro de un nav.',
            description: 'Crea una regla para los <a> que están dentro de <nav> con color azul.',
            starter: '/* Tu CSS aquí */',
            solution: 'nav a {\n    color: blue;\n}',
            tests: [{ expected: 'nav a { color: blue }\n' }]
          }
        ]
      },
      {
        id: 'css-mod8-les2',
        title: 'Especificidad',
        icon: '⚖️',
        exercises: [
          {
            id: 'css091', type: 'multiple-choice', xp: 15,
            question: 'Si una regla de id y otra de clase se contradicen, ¿qué gana?',
            choices: ['La clase', 'El id', 'La última escrita', 'Da igual'],
            correct: 1,
            explanation: 'El id tiene más especificidad: #id (1,0,0) gana a .clase (0,1,0).'
          },
          {
            id: 'css092', type: 'multiple-choice', xp: 15,
            question: '¿Cuál de estos selectores tiene MÁS especificidad?',
            choices: ['p', '.clase', '#id', 'p.clase'],
            correct: 2,
            explanation: 'El id vale (1,0,0), por encima de clase (0,1,0) y etiqueta (0,0,1).'
          },
          {
            id: 'css093', type: 'fill-blank', xp: 20,
            question: 'Fuerza una regla con !important:',
            code: 'h1 {\n    color: red ___;\n}',
            blanks: ['!important'],
            options: ['!important', 'important', '!force', 'urgent'],
            explanation: '!important sube la prioridad de esa declaración (úsalo con precaución).'
          },
          {
            id: 'css094', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'h1 {\n    color: red !important;\n}',
            output: ['h1 { color: red !important }', 'h1', 'color: red', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'La declaración con !important se muestra tal cual.'
          },
          {
            id: 'css095', type: 'multiple-choice', xp: 20,
            question: '¿Por qué se recomienda no abusar de !important?',
            choices: ['Ralentiza la web', 'Rompe la cascada y hace el CSS impredecible', 'No funciona en móviles', 'Ocupa más espacio'],
            correct: 1,
            explanation: 'Si todo es !important, el orden deja de importar y el CSS se vuelve imposible de mantener.'
          },
          {
            id: 'css096', type: 'type-code', xp: 30,
            explanation: 'El # delante del nombre indica que es un id. Solo puede haber uno en la página y tiene la mayor especificidad.',
            description: 'Crea una regla para #principal con fondo gris claro y padding 20px.',
            starter: '/* Tu CSS aquí */',
            solution: '#principal {\n    background-color: #F0F0F0;\n    padding: 20px;\n}',
            tests: [{ expected: '#principal { background-color: #F0F0F0; padding: 20px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 9: PSEUDO-CLASES Y PSEUDO-ELEMENTOS
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod9',
    title: 'Pseudo-clases y Elementos',
    subtitle: 'Estilos según el estado o la posición',
    icon: '🎭',
    color: '#00E87A',
    gradient: 'linear-gradient(135deg, #00E87A 0%, #38F9D7 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'css-mod9-les1',
        title: 'Pseudo-clases',
        icon: '👆',
        exercises: [
          {
            id: 'css097', type: 'multiple-choice', xp: 10,
            question: '¿Qué pseudo-clase se aplica al pasar el ratón por encima?',
            choices: [':hover', ':active', ':focus', ':click'],
            correct: 0,
            explanation: ':hover se activa cuando el puntero está sobre el elemento.'
          },
          {
            id: 'css098', type: 'multiple-choice', xp: 15,
            question: '¿Cuántas pseudo-clases lleva un selector?',
            choices: ['Dos puntos siempre', 'Una', 'Depende del navegador', 'Cero'],
            correct: 1,
            explanation: 'Una pseudo-clase se separa con dos puntos y solo puede haber una por selector: a:hover:focus no es válido.'
          },
          {
            id: 'css099', type: 'fill-blank', xp: 20,
            question: 'Cambia el color al hacer clic:',
            code: '.boton {\n    color: ___\n}',
            blanks: [':active'],
            options: [':active', ':hover', ':focus', ':press'],
            explanation: ':active se aplica mientras el botón está presionado.'
          },
          {
            id: 'css100', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'a:hover {\n    color: red\n}',
            output: ['a:hover { color: red }', 'a:hover', 'a', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'La pseudo-clase :hover forma parte del selector.'
          },
          {
            id: 'css101', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace li:first-child?',
            choices: ['Selecciona el último li', 'Selecciona el primer li', 'Selecciona todos', 'Nada'],
            correct: 1,
            explanation: ':first-child selecciona el primer hijo; :last-child el último.'
          },
          {
            id: 'css102', type: 'type-code', xp: 30,
            explanation: 'La pseudo-clase :hover se activa mientras el puntero está sobre el elemento, y text-decoration: none quita el subrayado.',
            description: 'Crea una regla para los <a> cuando el ratón esté encima: color rojo y sin subrayado.',
            starter: '/* Tu CSS aquí */',
            solution: 'a:hover {\n    color: red;\n    text-decoration: none;\n}',
            tests: [{ expected: 'a:hover { color: red; text-decoration: none }\n' }]
          }
        ]
      },
      {
        id: 'css-mod9-les2',
        title: 'Pseudo-elementos',
        icon: '✨',
        exercises: [
          {
            id: 'css103', type: 'multiple-choice', xp: 15,
            question: '¿Qué pseudo-elemento añade contenido ANTES del elemento?',
            choices: ['::after', '::before', '::start', '::pre'],
            correct: 1,
            explanation: '::before inserta contenido antes y ::after después.'
          },
          {
            id: 'css104', type: 'multiple-choice', xp: 15,
            question: '¿Cuántos pseudo-elementos se pueden usar en un selector?',
            choices: ['Uno', 'Tres', 'Todos los que quieras', 'Ninguno'],
            correct: 0,
            explanation: 'Solo uno por selector: ::after y ::before no pueden combinarse.'
          },
          {
            id: 'css105', type: 'fill-blank', xp: 20,
            question: 'Añade un asterisco después de cada enlace:',
            code: 'a::___ {\n    content: "*";\n}',
            blanks: ['after'],
            options: ['after', 'before', 'post', 'next'],
            explanation: '::after con content genera contenido después del elemento.'
          },
          {
            id: 'css106', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: 'p::before {\n    content: "> "\n}',
            output: ['p::before { content: "> " }', 'p::before', 'p', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Un pseudo-elemento que añade un prefijo a cada párrafo.'
          },
          {
            id: 'css107', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve el pseudo-elemento ::placeholder?',
            choices: ['Estila el texto de ayuda de un input', 'Estila el botón', 'Estila el título', 'Nada'],
            correct: 0,
            explanation: '::placeholder da estilo al texto que aparece dentro de un campo vacío.'
          },
          {
            id: 'css108', type: 'type-code', xp: 30,
            explanation: 'El pseudo-elemento ::before genera contenido antes del elemento. Solo se ve si se indica qué contenido con la propiedad content.',
            description: 'Crea una regla que añada "(nuevo) " antes de cada .novedad con ::before.',
            starter: '/* Tu CSS aquí */',
            solution: '.novedad::before {\n    content: "(nuevo) ";\n    color: green;\n}',
            tests: [{ expected: '.novedad::before { content: "(nuevo) "; color: green }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 10: RESPONSIVE Y UNIDADES
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod10',
    title: 'Responsive y Unidades',
    subtitle: 'La misma web en cualquier pantalla',
    icon: '📱',
    color: '#E76F00',
    gradient: 'linear-gradient(135deg, #E76F00 0%, #5382A1 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'css-mod10-les1',
        title: 'Unidades relativas',
        icon: '📏',
        exercises: [
          {
            id: 'css109', type: 'multiple-choice', xp: 10,
            question: '¿Qué unidad es relativa a la raíz del documento?',
            choices: ['em', 'rem', 'px', 'pt'],
            correct: 1,
            explanation: 'rem se calcula sobre el tamaño de fuente de la raíz (html).'
          },
          {
            id: 'css110', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa 100% en width?',
            choices: ['El ancho total de la pantalla', 'El 100% del ancho del padre', 'Nada', 'El ancho del body'],
            correct: 1,
            explanation: 'Los porcentajes se calculan respecto al contenedor padre.'
          },
          {
            id: 'css111', type: 'fill-blank', xp: 20,
            question: 'Una caja que ocupa la mitad del ancho de su padre:',
            code: '.mitad {\n    width: 50___;\n}',
            blanks: ['%'],
            options: ['%', 'px', 'em', 'vh'],
            explanation: 'width: 50% es la mitad del ancho disponible.'
          },
          {
            id: 'css112', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.full {\n    width: 100vw;\n    min-height: 100vh\n}',
            output: ['.full { width: 100vw; min-height: 100vh }', '.full', 'width: 100vw', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'vw y vh miden el ancho y alto de la ventana.'
          },
          {
            id: 'css113', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la ventaja de usar rem para la tipografía?',
            choices: ['Carga más rápido', 'Respeta el tamaño que el usuario tiene configurado', 'Se ve siempre igual', 'Ocupa menos'],
            correct: 1,
            explanation: 'Si el usuario agranda la fuente del navegador, todo escala con rem. Es clave para accesibilidad.'
          },
          {
            id: 'css114', type: 'type-code', xp: 25,
            explanation: 'width: 100% con un max-width limita el crecimiento en pantallas grandes, y margin: 0 auto lo centra horizontalmente.',
            description: 'Crea la clase ".responsive" con width 100%, max-width 600px y margin 0 auto.',
            starter: '/* Tu CSS aquí */',
            solution: '.responsive {\n    width: 100%;\n    max-width: 600px;\n    margin: 0 auto;\n}',
            tests: [{ expected: '.responsive { width: 100%; max-width: 600px; margin: 0 auto }\n' }]
          }
        ]
      },
      {
        id: 'css-mod10-les2',
        title: 'Media queries',
        icon: '📲',
        exercises: [
          {
            id: 'css115', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirven las media queries?',
            choices: ['Cambiar estilos según el tamaño o tipo de pantalla', 'Cargar más rápido', 'Detectar errores', 'Nada'],
            correct: 0,
            explanation: 'Permiten aplicar reglas solo cuando se cumple una condición (por ejemplo, certain width).'
          },
          {
            id: 'css116', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa max-width en una media query?',
            choices: ['Se aplica en pantallas anchas', 'Se aplica mientras el ancho sea menor o igual', 'Fija el ancho', 'Nada'],
            correct: 1,
            explanation: '(max-width: 768px) significa "hasta 768 píxeles de ancho".'
          },
          {
            id: 'css117', type: 'fill-blank', xp: 20,
            question: 'Crea una media query para móvil:',
            code: '@___ (max-width: 768px) {\n    .menu {\n        display: none\n    }\n}',
            blanks: ['media'],
            options: ['media', 'screen', 'query', 'responsive'],
            explanation: 'Se empiezan con @media y dentro van las reglas que aplican en ese caso.'
          },
          {
            id: 'css118', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '@media (max-width: 600px) {\n    h1 {\n        font-size: 24px\n    }\n}',
            output: ['@media (max-width: 600px) { h1 { font-size: 24px } }', '@media (max-width: 600px)', 'h1 { font-size: 24px }', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El bloque completo con su regla interna se muestra en una línea.'
          },
          {
            id: 'css119', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el orden recomendado de los media queries?',
            choices: ['De mayor a menor, con min-width', 'De menor a mayor, con max-width', 'Al azar', 'Solo uno'],
            correct: 0,
            explanation: 'Se empieza por el móvil con max-width y se va subiendo con min-width.'
          },
          {
            id: 'css120', type: 'type-code', xp: 35,
            explanation: 'Dentro de @media se escriben las reglas tal cual, y solo se aplican si se cumple la condición (aquí, pantallas de 768px o menos).',
            description: 'Crea una media query para pantallas de 768px o menos que ponga el contenedor al 95% de ancho.',
            starter: '/* Tu CSS aquí */',
            solution: '@media (max-width: 768px) {\n    .contenedor {\n        width: 95%\n    }\n}',
            tests: [{ expected: '@media (max-width: 768px) { .contenedor { width: 95% } }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 11: VARIABLES Y ORGANIZACIÓN
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod11',
    title: 'Variables CSS',
    subtitle: 'Define una vez, usa en todas partes',
    icon: '🎛️',
    color: '#8b0000',
    gradient: 'linear-gradient(135deg, #8b0000 0%, #ff6347 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'css-mod11-les1',
        title: 'Variables personalizadas',
        icon: '🔣',
        exercises: [
          {
            id: 'css121', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se declara una variable CSS personalizada?',
            choices: ['$color: red', '--color: red', '@color: red', 'color: red'],
            correct: 1,
            explanation: 'Las variables personalizadas se declaran con dos guiones: --color.'
          },
          {
            id: 'css122', type: 'fill-blank', xp: 20,
            question: 'Usa una variable personalizada:',
            code: ':root {\n    --primario: blue;\n}\n\nh1 {\n    color: ___\n}',
            blanks: ['var(--primario)'],
            options: ['var(--primario)', '$primario', '--primario', 'primario'],
            explanation: 'var(--primario) inserta el valor que definiste en :root.'
          },
          {
            id: 'css123', type: 'multiple-choice', xp: 15,
            question: '¿Dónde se suelen declarar las variables globales?',
            choices: ['En body', 'En :root (o html)', 'En cada elemento', 'En un comentario'],
            correct: 1,
            explanation: ':root es la raíz del documento: todas las variables quedan disponibles.'
          },
          {
            id: 'css124', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: ':root {\n    --color: red\n}\n\nh1 {\n    color: var(--color)\n}',
            output: [':root { --color: red }\nh1 { color: var(--color) }', ':root { --color: red }', 'h1', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Se detectan las dos reglas: la definición y el uso de la variable.'
          },
          {
            id: 'css125', type: 'multiple-choice', xp: 20,
            question: '¿Para qué son útiles las variables CSS?',
            choices: ['Hacer la web más lenta', 'Centralizar colores y medidas para cambiarlas de una vez', 'Sustituir a HTML', 'Nada'],
            correct: 1,
            explanation: 'Cambiar una variable en :root actualiza toda la web: ideal para temas.'
          },
          {
            id: 'css126', type: 'type-code', xp: 30,
            explanation: 'Una variable personalizada se declara en :root con dos guiones delante y se usa con var(--nombre). Si cambias la variable, cambia toda la web.',
            description: 'Declara en :root la variable --espaciado con 16px y úsala en .caja con padding.',
            starter: '/* Tu CSS aquí */',
            solution: ':root {\n    --espaciado: 16px;\n}\n\n.caja {\n    padding: var(--espaciado);\n}',
            tests: [{ expected: ':root { --espaciado: 16px }\n.caja { padding: var(--espaciado) }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 12: TRANSICIONES Y ANIMACIONES
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod12',
    title: 'Transiciones y Animaciones',
    subtitle: 'Da vida a tu web',
    icon: '🎬',
    color: '#2965F1',
    gradient: 'linear-gradient(135deg, #2965F1 0%, #33A9DC 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'css-mod12-les1',
        title: 'Transiciones',
        icon: '🌀',
        exercises: [
          {
            id: 'css127', type: 'multiple-choice', xp: 10,
            question: '¿Qué propiedad aplica una transición?',
            choices: ['transform', 'transition', 'animation', 'motion'],
            correct: 1,
            explanation: 'transition define qué propiedad cambia y en cuánto tiempo.'
          },
          {
            id: 'css128', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa transition: all 0.3s?',
            choices: ['Todas las propiedades en 0.3 segundos', 'Solo el color', 'Tres cambios', 'Nada'],
            correct: 0,
            explanation: 'all aplica la transición a cualquier propiedad y 0.3s es la duración.'
          },
          {
            id: 'css129', type: 'fill-blank', xp: 20,
            question: 'Completa la transición del color:',
            code: '.boton {\n    color: black;\n    transition: color ___\n}',
            blanks: ['0.3s'],
            options: ['0.3s', '0.3', '300ms', '3s'],
            explanation: 'La duración se escribe con unidades de tiempo: 0.3s o 300ms.'
          },
          {
            id: 'css130', type: 'predict-output', xp: 20,
            question: '¿Qué regla se detecta?',
            codeToRun: '.boton {\n    transition: background-color 0.3s ease\n}',
            output: ['.boton { transition: background-color 0.3s ease }', '.boton', 'transition', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'Una transición con propiedad, duración y curva de velocidad.'
          },
          {
            id: 'css131', type: 'multiple-choice', xp: 20,
            question: '¿Qué curva da una sensación de arranque suave?',
            choices: ['linear', 'ease', 'steps', 'fast'],
            correct: 1,
            explanation: 'ease es la curva suave por defecto; linear va a velocidad constante.'
          },
          {
            id: 'css132', type: 'type-code', xp: 25,
            explanation: 'transition indica qué propiedad se anima y cuánto dura. El elemento necesita además el valor final en otra regla para que se note el cambio.',
            description: 'Crea una clase ".boton" con transition de color 0.2s y fondo azul.',
            starter: '/* Tu CSS aquí */',
            solution: '.boton {\n    background-color: blue;\n    transition: color 0.2s;\n}',
            tests: [{ expected: '.boton { background-color: blue; transition: color 0.2s }\n' }]
          }
        ]
      },
      {
        id: 'css-mod12-les2',
        title: 'Animaciones con keyframes',
        icon: '🎞️',
        exercises: [
          {
            id: 'css133', type: 'multiple-choice', xp: 10,
            question: '¿Qué at-rule define los pasos de una animación?',
            choices: ['@media', '@keyframes', '@import', '@font-face'],
            correct: 1,
            explanation: '@keyframes define los fotogramas (from, to, o porcentajes) de una animación.'
          },
          {
            id: 'css134', type: 'multiple-choice', xp: 15,
            question: '¿Qué propiedad lanza una animación?',
            choices: ['animation-name', 'animate', 'motion', 'keyframes'],
            correct: 0,
            explanation: 'animation llama a la animación: animation: nombre 1s infinite.'
          },
          {
            id: 'css135', type: 'fill-blank', xp: 20,
            question: 'Declara el nombre de una animación:',
            code: '@___ fade {\n    from {\n        opacity: 0\n    }\n    to {\n        opacity: 1\n    }\n}',
            blanks: ['keyframes'],
            options: ['keyframes', 'animation', 'media', 'motion'],
            explanation: '@keyframes followed del nombre de la animación.'
          },
          {
            id: 'css136', type: 'predict-output', xp: 25,
            question: '¿Qué se detecta?',
            codeToRun: '@keyframes fade {\n    from {\n        opacity: 0\n    }\n    to {\n        opacity: 1\n    }\n}',
            output: ['@keyframes fade { from { opacity: 0 }; to { opacity: 1 } }', '@keyframes fade', 'from { opacity: 0 }', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El bloque @keyframes se muestra con sus dos fotogramas.'
          },
          {
            id: 'css137', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace el valor infinite en animation?',
            choices: ['Repite la animación indefinidamente', 'La hace más rápida', 'La detiene', 'Nada'],
            correct: 0,
            explanation: 'infinite hace que la animación se repita para siempre.'
          },
          {
            id: 'css138', type: 'type-code', xp: 35,
            explanation: 'Dentro de @keyframes, from y to son los estados inicial y final. Después, animation con el nombre y la duración lanza la animación.',
            description: 'Crea la animación "aparece" (opacity 0 a 1) y aplícala a .modal con animation: aparece 0.5s.',
            starter: '/* Tu CSS aquí */',
            solution: '@keyframes aparece {\n    from {\n        opacity: 0\n    }\n    to {\n        opacity: 1\n    }\n}\n\n.modal {\n    animation: aparece 0.5s\n}',
            tests: [{ expected: '@keyframes aparece { from { opacity: 0 }; to { opacity: 1 } }\n.modal { animation: aparece 0.5s }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 13: PROYECTO · TARJETA DE PERFIL
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod13',
    title: '🏆 Proyecto: Tarjeta de Perfil',
    subtitle: 'Tu primera tarjeta con estilo',
    icon: '🪪',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'css-mod13-les1',
        title: 'Tarjeta de perfil',
        icon: '🪪',
        exercises: [
          {
            id: 'css139', type: 'multiple-choice', xp: 20,
            question: '¿Qué combinación define una tarjeta centrada y con sombra?',
            choices: ['margin: 0 auto y box-shadow', 'display: flex y color', 'width: 100% y position: fixed', 'Ninguna'],
            correct: 0,
            explanation: 'margin: 0 auto centra (si tiene width) y box-shadow da profundidad.'
          },
          {
            id: 'css140', type: 'multiple-choice', xp: 20,
            question: '¿Por qué conviene poner border-radius en una tarjeta?',
            choices: ['Para ocupar más espacio', 'Para suavizar las esquinas y mejorarla', 'Para cambiar el color', 'Para ocultarla'],
            correct: 1,
            explanation: 'Las esquinas redondeadas hacen que la tarjeta se vea más cuida.'
          },
          {
            id: 'css141', type: 'fill-blank', xp: 25,
            question: 'Redondea la tarjeta 12 píxeles:',
            code: '.tarjeta {\n    border-radius: ___px\n}',
            blanks: ['12'],
            options: ['12', 'todos', 'mucho', 'redondo'],
            explanation: 'border-radius: 12px suaviza las cuatro esquinas.'
          },
          {
            id: 'css142', type: 'predict-output', xp: 25,
            question: '¿Qué regla se detecta?',
            codeToRun: '.tarjeta {\n    display: flex;\n    flex-direction: column;\n    align-items: center\n}',
            output: ['.tarjeta { display: flex; flex-direction: column; align-items: center }', '.tarjeta', 'display: flex', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'La tarjeta centra su contenido en vertical y en horizontal.'
          },
          {
            id: 'css143', type: 'multiple-choice', xp: 25,
            question: '¿Qué hace gap dentro de una tarjeta con flex?',
            choices: ['Cambia el color de fondo', 'Separa los hijos sin usar márgenes', 'Centra la tarjeta', 'Nada'],
            correct: 1,
            explanation: 'gap es más limpio que poner márgenes a cada hijo.'
          },
          {
            id: 'css144', type: 'type-code', xp: 40,
            explanation: 'Con flex-direction: column los hijos se apilan en vertical y align-items: center los centra en horizontal. El gap y el padding dan el aire.',
            description: 'Crea la clase ".tarjeta": display flex, flex-direction column, align-items center, gap 12px, padding 24px y border-radius 12px.',
            starter: '/* Tu CSS aquí */',
            solution: '.tarjeta {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 12px;\n    padding: 24px;\n    border-radius: 12px;\n}',
            tests: [{ expected: '.tarjeta { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; border-radius: 12px }\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // CSS MÓDULO 14: PROYECTO · LANDING PAGE
  // ═══════════════════════════════════════════════
  {
    id: 'css-mod14',
    title: '🏆 Proyecto: Landing Page',
    subtitle: 'Una página completa y responsive',
    icon: '🚀',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'css-mod14-les1',
        title: 'Layout de una página',
        icon: '🚀',
        exercises: [
          {
            id: 'css145', type: 'multiple-choice', xp: 20,
            question: '¿Qué técnica centra el contenido y lo limita a un ancho cómodo de lectura?',
            choices: ['width: 100%', 'max-width con margin: 0 auto', 'position: fixed', 'display: block'],
            correct: 1,
            explanation: 'Es el patrón clásico: max-width + margin auto.'
          },
          {
            id: 'css146', type: 'multiple-choice', xp: 20,
            question: '¿Qué propiedad usarías para el espacio entre secciones?',
            choices: ['padding', 'margin', 'border', 'gap'],
            correct: 1,
            explanation: 'El margin separa secciones; el padding da aire al contenido dentro de cada una.'
          },
          {
            id: 'css147', type: 'fill-blank', xp: 25,
            question: 'Limita el ancho del contenedor y céntralo:',
            code: '.contenedor {\n    max-width: 1100px;\n    margin: 0 ___\n}',
            blanks: ['auto'],
            options: ['auto', 'center', 'middle', '0'],
            explanation: 'margin: 0 auto centra horizontalmente.'
          },
          {
            id: 'css148', type: 'predict-output', xp: 25,
            question: '¿Qué regla se detecta?',
            codeToRun: '.hero {\n    display: grid;\n    place-items: center;\n    min-height: 80vh\n}',
            output: ['.hero { display: grid; place-items: center; min-height: 80vh }', '.hero', 'display: grid', 'No se encontraron reglas CSS.'],
            correctOutput: 0,
            explanation: 'El hero usa Grid con place-items para centrar en ambos ejes.'
          },
          {
            id: 'css149', type: 'multiple-choice', xp: 25,
            question: '¿Qué significa vh?',
            choices: ['Ancho de la ventana (viewport height)', 'Alto de la ventana', 'Altura del texto', 'Nada'],
            correct: 1,
            explanation: 'vh = viewport height: 1vh es el 1% del alto de la ventana.'
          },
          {
            id: 'css150', type: 'type-code', xp: 45,
            explanation: 'max-width con margin: 0 auto es el patrón del contenedor centrado, y el padding añade aire interno sin romper el diseño en móvil.',
            description: 'Crea el contenedor de una landing: max-width 1100px, margin 0 auto y padding 20px.',
            starter: '/* Tu CSS aquí */',
            solution: '.contenedor {\n    max-width: 1100px;\n    margin: 0 auto;\n    padding: 20px;\n}',
            tests: [{ expected: '.contenedor { max-width: 1100px; margin: 0 auto; padding: 20px }\n' }]
          }
        ]
      }
    ]
  }
];