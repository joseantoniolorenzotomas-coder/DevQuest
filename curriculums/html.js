// HTML Curriculum — La estructura de la web
// Módulos 1–3 en esta entrega; el resto llega en próximas sesiones.

window.HTML_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // HTML MÓDULO 1: TU PRIMER DOCUMENTO
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod1',
    title: 'Tu Primer Documento',
    subtitle: 'La estructura mínima de una web',
    icon: '🌱',
    color: '#E34F26',
    gradient: 'linear-gradient(135deg, #E34F26 0%, #F16529 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'html-mod1-les1',
        title: '¿Qué es HTML?',
        icon: '🤔',
        exercises: [
          {
            id: 'htme001', type: 'multiple-choice', xp: 10,
            question: '¿Qué significa HTML?',
            choices: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'HyperText Machine Learning'],
            correct: 0,
            explanation: 'HTML son las siglas de HyperText Markup Language: el lenguaje de marcado del hipertexto.'
          },
          {
            id: 'htme002', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve HTML?',
            choices: ['Dar estilo y colores', 'Estructurar el contenido de una página', 'Programar la lógica del servidor', 'Guardar datos'],
            correct: 1,
            explanation: 'HTML da estructura: títulos, párrafos, imágenes. El estilo es de CSS y la lógica de JavaScript.'
          },
          {
            id: 'htme003', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se llama un texto entre dos ángulos como <p>?',
            choices: ['Una etiqueta', 'Un atributo', 'Un valor', 'Una propiedad'],
            correct: 0,
            explanation: 'Se llama etiqueta (tag). La mayoria usan apertura <p> y cierre </p>.'
          },
          {
            id: 'htme004', type: 'fill-blank', xp: 20,
            question: 'Completa la etiqueta de párrafo cerrándola:',
            code: '<p>Hola mundo___',
            blanks: ['</p>'],
            options: ['</p>', '<p>', '</p></p>', '/p>'],
            explanation: 'La mayoria de etiquetas se cierran con una barra: </p>.'
          },
          {
            id: 'htme005', type: 'predict-output', xp: 20,
            question: '¿Qué texto verá el usuario en esta página?',
            codeToRun: '<body><h1>Mi web</h1><p>Hola a todos</p></body>',
            output: ['Mi web Hola a todos', 'Solo "Mi web"', 'Nada', 'Error'],
            correctOutput: 0,
            explanation: 'Se ve primero el encabezado "Mi web" y después el párrafo "Hola a todos".'
          },
          {
            id: 'htme006', type: 'type-code', xp: 25,
            explanation: 'El h1 es el encabezado principal de la página y su texto va entre la etiqueta de apertura y la de cierre.',
            description: 'Escribe una página con un encabezado <h1> que diga "Hola Mundo".',
            starter: '<!-- Tu código aquí -->',
            solution: '<h1>Hola Mundo</h1>',
            tests: [{ expected: 'Hola Mundo', contains: '<h1>' }]
          }
        ]
      },
      {
        id: 'html-mod1-les2',
        title: 'La estructura del documento',
        icon: '🧱',
        exercises: [
          {
            id: 'htme007', type: 'reorder', xp: 25,
            question: 'Ordena un documento HTML completo:',
            blocks: [
              '</html>',
              '<head>',
              '<!DOCTYPE html>',
              '<html lang="es">',
              '<title>Mi página</title>',
              '</head>',
              '<body>',
              '</body>'
            ],
            correctOrder: [2, 3, 1, 4, 5, 6, 7, 0],
            explanation: 'DOCTYPE → html → head con title → body → cierre de html.'
          },
          {
            id: 'htme008', type: 'multiple-choice', xp: 15,
            question: '¿Dónde va el título de la pestaña del navegador?',
            choices: ['<body>', '<head> dentro de <title>', 'Antes del DOCTYPE', 'En un <h1>'],
            correct: 1,
            explanation: 'El <title> va dentro del <head> y es lo que se ve en la pestaña del navegador.'
          },
          {
            id: 'htme009', type: 'fill-blank', xp: 20,
            question: 'Completa el idioma del documento:',
            code: '<html ___="es">\n</html>',
            blanks: ['lang'],
            options: ['lang', 'language', 'idioma', 'leng'],
            explanation: 'El atributo lang indica el idioma y ayuda a lectores de pantalla y buscadores.'
          },
          {
            id: 'htme010', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve el <!DOCTYPE html>?',
            choices: ['Importa CSS', 'Declara que el documento usa HTML5 moderno', 'Define el título', 'Crea el cuerpo'],
            correct: 1,
            explanation: 'El DOCTYPE le dice al navegador que use el modo estándar (HTML5).'
          },
          {
            id: 'htme011', type: 'fill-blank', xp: 20,
            question: '¿Qué etiqueta contiene el contenido visible?',
            code: '<html>\n    <head><title>Web</title></head>\n    ___\n        <h1>Contenido</h1>\n    </body>\n</html>',
            blanks: ['<body>'],
            options: ['<body>', '<head>', '<content>', '<main>'],
            explanation: 'Todo lo que ve el usuario va dentro del <body>.'
          },
          {
            id: 'htme012', type: 'type-code', xp: 30,
            explanation: 'La estructura mínima tiene doctype, html con lang, head con el title y body con el contenido que se ve.',
            description: 'Crea un documento HTML completo con title "Mi web" y un <h1> que diga "Bienvenido".',
            starter: '<!DOCTYPE html>\n<html lang="es">\n    <head>\n        ___\n    </head>\n    <body>\n        <h1>Bienvenido</h1>\n    </body>\n</html>',
            solution: '<!DOCTYPE html>\n<html lang="es">\n    <head>\n        <title>Mi web</title>\n    </head>\n    <body>\n        <h1>Bienvenido</h1>\n    </body>\n</html>',
            tests: [{ expected: 'Bienvenido', contains: '<title>Mi web</title>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 2: TEXTO
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod2',
    title: 'Etiquetas de Texto',
    subtitle: 'Títulos, párrafos y saltos de línea',
    icon: '📝',
    color: '#FA709A',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'html-mod2-les1',
        title: 'Encabezados',
        icon: '🔠',
        exercises: [
          {
            id: 'htme013', type: 'multiple-choice', xp: 10,
            question: '¿Cuál es el encabezado más importante de una página?',
            choices: ['<h6>', '<h1>', '<head>', '<header>'],
            correct: 1,
            explanation: '<h1> es el título principal. Debe haber un solo h1 por página.'
          },
          {
            id: 'htme014', type: 'multiple-choice', xp: 15,
            question: '¿Cuántos niveles de encabezado hay?',
            choices: ['3', '6', '10', '12'],
            correct: 1,
            explanation: 'Van de <h1> (principal) a <h6> (el menos importante).'
          },
          {
            id: 'htme015', type: 'fill-blank', xp: 20,
            question: 'Crea un subtítulo de nivel 2:',
            code: '___>Mi sección</___>',
            blanks: ['h2', 'h2></h2'],
            options: ['h2', 'h2></h2', 'h3', 'title'],
            explanation: 'Un <h2> marca una sección dentro del <h1>.'
          },
          {
            id: 'htme016', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve en esta página?',
            codeToRun: '<h1>Título</h1><h2>Subtítulo</h2>',
            output: ['Título Subtítulo', 'Título', 'Subtítulo', 'Error'],
            correctOutput: 0,
            explanation: 'Se ven ambos textos, título primero y subtítulo después.'
          },
          {
            id: 'htme017', type: 'multiple-choice', xp: 20,
            question: '¿Qué diferencia hay entre <h1> y <p>?',
            choices: ['No hay diferencia', '<h1> es un encabezado, <p> un párrafo', '<p> es más grande', '<h1> es un enlace'],
            correct: 1,
            explanation: '<h1> es un encabezado (estructura) y <p> un párrafo de texto normal.'
          },
          {
            id: 'htme018', type: 'type-code', xp: 30,
            explanation: 'Los encabezados van de h1 a h6 según su importancia: h1 es el título principal y h2 una sección dentro de él.',
            description: 'Crea una página con un <h1> "Manual" y un <h2> "Capítulo 1".',
            starter: '<!-- Tu código aquí -->',
            solution: '<h1>Manual</h1>\n<h2>Capítulo 1</h2>',
            tests: [{ expected: 'Manual Capítulo 1', contains: '<h2>' }]
          }
        ]
      },
      {
        id: 'html-mod2-les2',
        title: 'Párrafos y saltos',
        icon: '¶',
        exercises: [
          {
            id: 'htme019', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta se usa para un párrafo?',
            choices: ['<br>', '<p>', '<div>', '<span>'],
            correct: 1,
            explanation: '<p> es la etiqueta de párrafo.'
          },
          {
            id: 'htme020', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace <br>?',
            choices: ['Una línea horizontal', 'Un salto de línea', 'Un espacio enorme', 'Un comentario'],
            correct: 1,
            explanation: '<br> (break) fuerza un salto de línea. No necesita cierre.'
          },
          {
            id: 'htme021', type: 'fill-blank', xp: 20,
            question: 'Cierra el párrafo:',
            code: '<p>Texto largo___',
            blanks: ['</p>'],
            options: ['</p>', '<p>', '</br>', '/p'],
            explanation: 'Los párrafos se cierran con </p>.'
          },
          {
            id: 'htme022', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<p>Linea 1<br>Linea 2</p>',
            output: ['Linea 1 Linea 2', 'Linea 1Linea 2', 'Linea 1', 'Error'],
            correctOutput: 0,
            explanation: 'El <br> salta de línea, así que se leen dos líneas separadas.'
          },
          {
            id: 'htme023', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la forma CORRECTA de escribir HTML?',
            choices: ['<DIV>Hola</DIV>', '<div>Hola</div>', '<div>Hola', '< Div>Hola</Div>'],
            correct: 1,
            explanation: 'En HTML las etiquetas se escriben en minúsculas: <div>Hola</div>.'
          },
          {
            id: 'htme024', type: 'type-code', xp: 30,
            explanation: 'La etiqueta br es un salto de línea. A diferencia de un párrafo nuevo, no crea un bloque ni deja espacio.',
            description: 'Escribe un párrafo con "Hola" y un salto de línea, seguido de "Mundo".',
            starter: '<!-- Tu código aquí -->',
            solution: '<p>Hola<br>Mundo</p>',
            tests: [{ expected: 'Hola Mundo', contains: '<br>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 3: ENLACES E IMÁGENES
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod3',
    title: 'Enlaces e Imágenes',
    subtitle: 'Conecta tu página con el mundo',
    icon: '🔗',
    color: '#4FACFE',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'html-mod3-les1',
        title: 'Enlaces',
        icon: '🔗',
        exercises: [
          {
            id: 'htme025', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta se usa para un enlace?',
            choices: ['<link>', '<a>', '<url>', '<href>'],
            correct: 1,
            explanation: 'La etiqueta es <a> y el destino va en el atributo href.'
          },
          {
            id: 'htme026', type: 'fill-blank', xp: 20,
            question: 'Crea un enlace a example.com con el texto "Visita":',
            code: '<a ___="https://example.com">Visita</a>',
            blanks: ['href'],
            options: ['href', 'src', 'link', 'to'],
            explanation: 'href es el atributo que guarda la dirección del enlace.'
          },
          {
            id: 'htme027', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se abre un enlace en una pestaña nueva?',
            choices: ['target="_blank"', 'new="true"', 'open="yes"', 'blank'],
            correct: 0,
            explanation: 'Se añade target="_blank". En HTML moderno se recomienda también rel="noopener".'
          },
          {
            id: 'htme028', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve en la página?',
            codeToRun: '<a href="https://ejemplo.com">Haz clic aquí</a>',
            output: ['Haz clic aquí', 'https://ejemplo.com', 'Haz clic aquí https://ejemplo.com', 'Error'],
            correctOutput: 0,
            explanation: 'El usuario ve el texto del enlace, no la URL.'
          },
          {
            id: 'htme029', type: 'fill-blank', xp: 25,
            question: 'Enlace a un correo electrónico:',
            code: '<a ___="mailto:ana@correo.com">Escríbeme</a>',
            blanks: ['href'],
            options: ['href', 'src', 'mail', 'to'],
            explanation: 'Con mailto: dentro del href se abre el cliente de correo.'
          },
          {
            id: 'htme030', type: 'type-code', xp: 30,
            explanation: 'El atributo href guarda la dirección y el texto que ve la persona va entre las dos etiquetas a.',
            description: 'Crea un enlace con el texto "DevQuest" que apunte a https://devquest.app.',
            starter: '<!-- Tu código aquí -->',
            solution: '<a href="https://devquest.app">DevQuest</a>',
            tests: [{ expected: 'DevQuest', contains: 'https://devquest.app' }]
          }
        ]
      },
      {
        id: 'html-mod3-les2',
        title: 'Imágenes',
        icon: '🖼️',
        exercises: [
          {
            id: 'htme031', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta se usa para una imagen?',
            choices: ['<image>', '<img>', '<picture>', '<photo>'],
            correct: 1,
            explanation: 'Es <img>. No tiene cierre porque no contiene contenido.'
          },
          {
            id: 'htme032', type: 'fill-blank', xp: 20,
            question: 'Completa el atributo que apunta al archivo de imagen:',
            code: '<img ___="gato.jpg" alt="Un gato">',
            blanks: ['src'],
            options: ['src', 'href', 'alt', 'link'],
            explanation: 'src es el archivo y alt es el texto alternativo.'
          },
          {
            id: 'htme033', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve el atributo alt?',
            choices: ['Poner la imagen más grande', 'Describir la imagen si no carga', 'Enlazar a otra página', 'Ocultar la imagen'],
            correct: 1,
            explanation: 'alt describe la imagen para quien no ve o no puede cargarla. Es clave para accesibilidad.'
          },
          {
            id: 'htme034', type: 'fix-bug', xp: 25,
            question: 'Esta imagen le falta una etiqueta de cierre. ¿Cuál es correcta?',
            buggyCode: '<img src="logo.png"></img>',
            fixedCode: '<img src="logo.png" alt="Logo">',
            choices: ['<img src="logo.png"></img>', '<img src="logo.png" alt="Logo">', '<img href="logo.png">', '<image src="logo.png"></image>'],
            correct: 1,
            explanation: '<img> es una etiqueta vacía: no se cierra, y debe llevar alt descriptivo.'
          },
          {
            id: 'htme035', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si omites el atributo alt?',
            choices: ['La imagen carga más rápido', 'Los lectores de pantalla no saben qué es', 'La imagen no se ve', 'Da error de sintaxis'],
            correct: 1,
            explanation: 'Sin alt, las personas con lector de pantalla se quedan sin información.'
          },
          {
            id: 'htme036', type: 'type-code', xp: 30,
            explanation: 'El alt describe la imagen para quien no puede verla (por ejemplo con un lector de pantalla) o si no llega a cargar.',
            description: 'Crea una página con un <h1> "Mi perro" y una imagen "perro.jpg" con alt "Un perro".',
            starter: '<!-- Tu código aquí -->',
            solution: '<h1>Mi perro</h1>\n<img src="perro.jpg" alt="Un perro">',
            tests: [{ expected: 'Mi perro', contains: 'alt="Un perro"' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 4: LISTAS
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod4',
    title: 'Listas',
    subtitle: 'Ordena la información en listas',
    icon: '📋',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'html-mod4-les1',
        title: 'Listas desordenadas',
        icon: '🔸',
        exercises: [
          {
            id: 'htme037', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta crea una lista con viñetas?',
            choices: ['<ol>', '<ul>', '<li>', '<list>'],
            correct: 1,
            explanation: '<ul> es la lista desordenada (con puntos).'
          },
          {
            id: 'htme038', type: 'multiple-choice', xp: 15,
            question: '¿Qué etiqueta va cada elemento de la lista?',
            choices: ['<item>', '<li>', '<list-item>', '<element>'],
            correct: 1,
            explanation: 'Cada elemento es un <li> (list item).'
          },
          {
            id: 'htme039', type: 'fill-blank', xp: 20,
            question: 'Crea un elemento de lista:',
            code: '<ul>\n    ___>Pan</___>\n</ul>',
            blanks: ['li', 'li></li'],
            options: ['li', 'li></li', 'ol', 'item'],
            explanation: 'Cada punto de la lista es <li>Pan</li>.'
          },
          {
            id: 'htme040', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<ul><li>Pan</li><li>Leche</li></ul>',
            output: ['Pan Leche', 'Pan, Leche', 'ul li', 'Error'],
            correctOutput: 0,
            explanation: 'Se ven los dos elementos de la lista: Pan y Leche.'
          },
          {
            id: 'htme041', type: 'multiple-choice', xp: 20,
            question: '¿Qué diferencia hay entre <ul> y <ol>?',
            choices: ['<ul> es más grande', '<ul> usa viñetas y <ol> numera', '<ol> es opcional', 'No hay diferencia'],
            correct: 1,
            explanation: '<ul> muestra viñetas y <ol> numera los elementos automáticamente.'
          },
          {
            id: 'htme042', type: 'type-code', xp: 30,
            explanation: 'Una lista con viñetas se hace con ul y cada elemento de la lista es un li.',
            description: 'Crea una lista con viñetas de tres frutas: manzana, pera y uva.',
            starter: '<!-- Tu código aquí -->',
            solution: '<ul>\n    <li>manzana</li>\n    <li>pera</li>\n    <li>uva</li>\n</ul>',
            tests: [{ expected: 'manzana pera uva', contains: '<li>' }]
          }
        ]
      },
      {
        id: 'html-mod4-les2',
        title: 'Listas ordenadas y anidadas',
        icon: '🔢',
        exercises: [
          {
            id: 'htme043', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta crea una lista numerada?',
            choices: ['<ul>', '<ol>', '<dl>', '<num>'],
            correct: 1,
            explanation: '<ol> (ordered list) numera los elementos: 1, 2, 3.'
          },
          {
            id: 'htme044', type: 'fill-blank', xp: 20,
            question: 'Abre una lista ordenada:',
            code: '___>\n    <li>Uno</li>\n</___>',
            blanks: ['ol', 'ol></ol'],
            options: ['ol', 'ol></ol', 'ul', 'li'],
            explanation: '<ol> abre y </ol> cierra la lista ordenada.'
          },
          {
            id: 'htme045', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se anida una lista dentro de otra?',
            choices: ['Con <br>', 'Con <ul> o <ol> dentro de un <li>', 'Con <span>', 'No se puede'],
            correct: 1,
            explanation: 'Se mete una lista completa dentro de un <li> para crear subniveles.'
          },
          {
            id: 'htme046', type: 'predict-output', xp: 20,
            question: '¿Cuántos elementos se ven en total?',
            codeToRun: '<ol><li>Uno</li><li>Dos</li><li>Tres</li></ol>',
            output: ['2', '3', '4', 'Error'],
            correctOutput: 1,
            explanation: 'Hay tres elementos <li>: Uno, Dos y Tres.'
          },
          {
            id: 'htme047', type: 'multiple-choice', xp: 25,
            question: '¿Qué atributo hace que una lista <ol> empiece a numerar desde 3?',
            choices: ['start="3"', 'from="3"', 'begin="3"', 'number="3"'],
            correct: 0,
            explanation: 'start="3" hace que la numeración empiece en 3 en vez de 1.'
          },
          {
            id: 'htme048', type: 'type-code', xp: 30,
            explanation: 'La etiqueta ol es la lista ordenada: el navegador numera los li automáticamente.',
            description: 'Crea una lista numerada con: Primero, Segundo, Tercero.',
            starter: '<!-- Tu código aquí -->',
            solution: '<ol>\n    <li>Primero</li>\n    <li>Segundo</li>\n    <li>Tercero</li>\n</ol>',
            tests: [{ expected: 'Primero Segundo Tercero', contains: '<ol>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 5: TABLAS
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod5',
    title: 'Tablas',
    subtitle: 'Datos en filas y columnas',
    icon: '📊',
    color: '#A18CD1',
    gradient: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod5-les1',
        title: 'Filas y celdas',
        icon: '▦',
        exercises: [
          {
            id: 'htme049', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta define una tabla?',
            choices: ['<table>', '<grid>', '<tr>', '<rows>'],
            correct: 0,
            explanation: '<table> define la tabla. Dentro van <tr> (filas) y <td> (celdas).'
          },
          {
            id: 'htme050', type: 'multiple-choice', xp: 15,
            question: '¿Qué etiqueta representa una fila?',
            choices: ['<td>', '<tr>', '<th>', '<row>'],
            correct: 1,
            explanation: '<tr> es la fila (table row) y sus celdas van dentro.'
          },
          {
            id: 'htme051', type: 'fill-blank', xp: 20,
            question: 'Completa una celda de dato:',
            code: '<table>\n    <tr>\n        <___>Ana</___>\n    </tr>\n</table>',
            blanks: ['td', 'td></td'],
            options: ['td', 'td></td', 'th', 'tr'],
            explanation: '<td> es una celda de datos normal.'
          },
          {
            id: 'htme052', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<table><tr><td>Nombre</td><td>Edad</td></tr><tr><td>Ana</td><td>25</td></tr></table>',
            output: ['Nombre Edad Ana 25', 'Nombre', 'Ana 25', 'Error'],
            correctOutput: 0,
            explanation: 'Se ve la primera fila (encabezado) y la segunda (datos).'
          },
          {
            id: 'htme053', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es la diferencia entre <th> y <td>?',
            choices: ['<th> va en mayúsculas', '<th> es la celda de encabezado', '<td> es opcional', 'No hay diferencia'],
            correct: 1,
            explanation: '<th> (table head) marca celdas de encabezado y se muestra en negrita.'
          },
          {
            id: 'htme054', type: 'type-code', xp: 35,
            explanation: 'Cada fila de una tabla es un tr. La primera usa th para las cabeceras y td para los datos.',
            description: 'Crea una tabla con encabezado "Nombre"/"Edad" y una fila con "Ana"/"25".',
            starter: '<!-- Tu código aquí -->',
            solution: '<table>\n    <tr><th>Nombre</th><th>Edad</th></tr>\n    <tr><td>Ana</td><td>25</td></tr>\n</table>',
            tests: [{ expected: 'Nombre Edad Ana 25', contains: '<th>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 6: FORMULARIOS
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod6',
    title: 'Formularios',
    subtitle: 'Recoge datos de los usuarios',
    icon: '📝',
    color: '#F093FB',
    gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod6-les1',
        title: 'Campos básicos',
        icon: '⌨️',
        exercises: [
          {
            id: 'htme055', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta define un formulario?',
            choices: ['<input>', '<form>', '<formulario>', '<field>'],
            correct: 1,
            explanation: '<form> agrupa los campos y define dónde se envían los datos.'
          },
          {
            id: 'htme056', type: 'multiple-choice', xp: 15,
            question: '¿Qué atributo conecta un label con su campo?',
            choices: ['id', 'for', 'name', 'link'],
            correct: 1,
            explanation: 'El label usa for="id" y el input lleva ese mismo id.'
          },
          {
            id: 'htme057', type: 'fill-blank', xp: 20,
            question: 'Completa un campo de texto:',
            code: '<input type="___" id="nombre">',
            blanks: ['text'],
            options: ['text', 'name', 'entrada', 'string'],
            explanation: 'type="text" es el campo de texto de una línea.'
          },
          {
            id: 'htme058', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve el atributo name en un input?',
            choices: ['Poner el nombre bonito', 'Identificar el dato que se envía', 'Estilizar el campo', 'Ocultar el campo'],
            correct: 1,
            explanation: 'name es la clave con la que el servidor recibe ese valor.'
          },
          {
            id: 'htme059', type: 'fill-blank', xp: 25,
            question: 'Crea un campo de correo:',
            code: '<input type="___" id="correo">',
            blanks: ['email'],
            options: ['email', 'mail', 'correo', 'e-mail'],
            explanation: 'type="email" valida que tenga formato de correo en el móvil.'
          },
          {
            id: 'htme060', type: 'type-code', xp: 30,
            explanation: 'El for del label debe coincidir con el id del input: así, al pinchar la etiqueta, se enfoca el campo.',
            description: 'Crea un formulario con un campo de texto para el nombre (id="nombre").',
            starter: '<form>\n    ___\n</form>',
            solution: '<form>\n    <label for="nombre">Nombre</label>\n    <input type="text" id="nombre" name="nombre">\n</form>',
            tests: [{ expected: 'Nombre', contains: 'name="nombre"' }]
          }
        ]
      },
      {
        id: 'html-mod6-les2',
        title: 'Botones y áreas',
        icon: '🔘',
        exercises: [
          {
            id: 'htme061', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta crea un botón dentro de un formulario?',
            choices: ['<input type="submit">', '<button>', '<btn>', 'Ambas son válidas'],
            correct: 3,
            explanation: 'Sirven <button type="submit"> y <input type="submit">.'
          },
          {
            id: 'htme062', type: 'multiple-choice', xp: 15,
            question: '¿Qué etiqueta se usa para texto largo?',
            choices: ['<textarea>', '<text>', '<longtext>', '<p multiline>'],
            correct: 0,
            explanation: '<textarea> es un campo de varias líneas.'
          },
          {
            id: 'htme063', type: 'fill-blank', xp: 20,
            question: 'Completa un área de texto:',
            code: '<___ id="mensaje" rows="4"></___>',
            blanks: ['textarea', 'textarea></textarea'],
            options: ['textarea', 'textarea></textarea', 'input', 'text'],
            explanation: '<textarea> y </textarea> en este caso sí se cierra.'
          },
          {
            id: 'htme064', type: 'multiple-choice', xp: 20,
            question: '¿Qué etiqueta y atributo crean un desplegable?',
            choices: ['<input type="dropdown">', '<select>', '<option>', '<select> con <option>'],
            correct: 3,
            explanation: 'Un desplegable es un <select> con sus <option> dentro.'
          },
          {
            id: 'htme065', type: 'fill-blank', xp: 25,
            question: 'Crea una opción dentro del desplegable:',
            code: '<select id="color">\n    <___ value="rojo">Rojo</___>\n</select>',
            blanks: ['option', 'option></option'],
            options: ['option', 'option></option', 'li', 'input'],
            explanation: 'Cada opción del desplegable es un <option>.'
          },
          {
            id: 'htme066', type: 'type-code', xp: 35,
            explanation: 'Un desplegable se hace con select y cada opción es un option. El value es lo que se envía y el texto lo que se ve.',
            description: 'Crea un desplegable con id="ciudad" y una opción "Madrid".',
            starter: '<!-- Tu código aquí -->',
            solution: '<select id="ciudad">\n    <option value="madrid">Madrid</option>\n</select>',
            tests: [{ expected: 'Madrid', contains: '<option' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 7: DIV, CLASES E IDs
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod7',
    title: 'Div, Clases e IDs',
    subtitle: 'Agrupa y organiza el contenido',
    icon: '📦',
    color: '#667EEA',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod7-les1',
        title: 'Div y span',
        icon: '⬛',
        exercises: [
          {
            id: 'htme067', type: 'multiple-choice', xp: 10,
            question: '¿Qué usa <div> y <span>?',
            choices: ['Solo para texto', 'Agrupar bloques y texto en línea', 'Para imágenes', 'Para listas'],
            correct: 1,
            explanation: '<div> agrupa bloques y <span> agrupa texto en línea. Son "contenedores genéricos".'
          },
          {
            id: 'htme068', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la diferencia entre <div> y <span>?',
            choices: ['<div> es en línea y <span> es bloque', '<div> es bloque y <span> es en línea', 'Son iguales', '<span> es más grande'],
            correct: 1,
            explanation: '<div> ocupa una línea completa (bloque); <span> va dentro de una frase (en línea).'
          },
          {
            id: 'htme069', type: 'fill-blank', xp: 20,
            question: 'Abre un div con la clase "tarjeta":',
            code: '<___ class="tarjeta">\n    Contenido\n</div>',
            blanks: ['div'],
            options: ['div', 'span', 'section', 'box'],
            explanation: 'Un <div class="tarjeta"> agrupa contenido y lo identifica por su clase.'
          },
          {
            id: 'htme070', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<div>Primero <span>dentro</span> del div</div>',
            output: ['Primero dentro del div', 'Primero', 'Solo dentro', 'Error'],
            correctOutput: 0,
            explanation: 'El div y el span solo organizan: se ve todo el texto seguido.'
          },
          {
            id: 'htme071', type: 'multiple-choice', xp: 20,
            question: '¿Puede una página tener varios elementos con la misma clase?',
            choices: ['No, es único', 'Sí, las clases se repiten', 'Solo dos', 'Depende del navegador'],
            correct: 1,
            explanation: 'Sí: la clase se puede repetir en muchos elementos (el id no, debe ser único).'
          },
          {
            id: 'htme072', type: 'type-code', xp: 30,
            explanation: 'Una clase sirve para varios elementos a la vez y se escribe con un punto delante: class="perfil".',
            description: 'Crea un <div> con clase "perfil" que contenga el texto "Ana".',
            starter: '<!-- Tu código aquí -->',
            solution: '<div class="perfil">Ana</div>',
            tests: [{ expected: 'Ana', contains: 'class="perfil"' }]
          }
        ]
      },
      {
        id: 'html-mod7-les2',
        title: 'Clases e IDs',
        icon: '🏷️',
        exercises: [
          {
            id: 'htme073', type: 'multiple-choice', xp: 10,
            question: '¿Qué atributo identifica un elemento de forma única?',
            choices: ['class', 'id', 'name', 'key'],
            correct: 1,
            explanation: 'El id debe ser único en toda la página; la clase se puede repetir.'
          },
          {
            id: 'htme074', type: 'fill-blank', xp: 20,
            question: 'Completa un elemento con id:',
            code: '<p ___="intro">Texto</p>',
            blanks: ['id'],
            options: ['id', 'class', 'name', 'for'],
            explanation: 'id="intro" identifica ese párrafo de forma única.'
          },
          {
            id: 'htme075', type: 'multiple-choice', xp: 15,
            question: '¿Por qué se prefieren clases al estilo en HTML?',
            choices: ['Son más cortas', 'Separan la estructura del estilo (CSS)', 'Dan más color', 'Los id no existen'],
            correct: 1,
            explanation: 'HTML para la estructura y CSS para el estilo: las clases conectan ambos cleanly.'
          },
          {
            id: 'htme076', type: 'multiple-choice', xp: 20,
            question: '¿Se pueden repetir varios id en la página?',
            choices: ['Sí, como las clases', 'No, cada id es único', 'Solo dentro de un div', 'Depende'],
            correct: 1,
            explanation: 'No: el id debe ser único. Repetirlo rompe la accesibilidad y el CSS.'
          },
          {
            id: 'htme077', type: 'fill-blank', xp: 25,
            question: 'Une un label con un campo usando id:',
            code: '<label ___="correo">Correo</label>\n<input type="email" id="correo">',
            blanks: ['for'],
            options: ['for', 'id', 'to', 'link'],
            explanation: 'label for="correo" apunta al id del input, así se puede hacer clic en la etiqueta.'
          },
          {
            id: 'htme078', type: 'type-code', xp: 30,
            explanation: 'El div agrupa el contenido y la clase tarjeta permite darle estilo. El id titulo lo identifica de forma única en la página.',
            description: 'Crea un <div> con clase "tarjeta" y dentro un <h2> con id="titulo" que diga "Hola".',
            starter: '<!-- Tu código aquí -->',
            solution: '<div class="tarjeta">\n    <h2 id="titulo">Hola</h2>\n</div>',
            tests: [{ expected: 'Hola', contains: 'id="titulo"' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 8: HTML SEMÁNTICO
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod8',
    title: 'HTML Semántico',
    subtitle: 'Etiquetas que explican el significado',
    icon: '🏗️',
    color: '#FA709A',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod8-les1',
        title: 'Etiquetas con significado',
        icon: '🧭',
        exercises: [
          {
            id: 'htme079', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta es la principal de contenido de una página?',
            choices: ['<div>', '<main>', '<content>', '<body>'],
            correct: 1,
            explanation: '<main> marca el contenido principal y único de la página.'
          },
          {
            id: 'htme080', type: 'multiple-choice', xp: 15,
            question: '¿Qué etiqueta usarías para la navegación del sitio?',
            choices: ['<menu>', '<nav>', '<links>', '<header>'],
            correct: 1,
            explanation: '<nav> agrupa los enlaces de navegación principales.'
          },
          {
            id: 'htme081', type: 'fill-blank', xp: 20,
            question: 'Completa el pie de página:',
            code: '<___>\n    © 2026 Mi web\n</___>',
            blanks: ['footer', 'footer></footer'],
            options: ['footer', 'footer></footer', 'end', 'foot'],
            explanation: '<footer> es el pie de página (autoría, copyright, enlaces legales).'
          },
          {
            id: 'htme082', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<header><h1>Mi blog</h1></header>\n<main><article>Mi primer post</article></main>',
            output: ['Mi blog Mi primer post', 'Solo Mi blog', 'Mi primer post', 'Error'],
            correctOutput: 0,
            explanation: 'Se ve el encabezado y luego el artículo dentro de main.'
          },
          {
            id: 'htme083', type: 'multiple-choice', xp: 20,
            question: '¿Por qué usar HTML semántico en vez de solo <div>?',
            choices: ['Es más corto', 'Ayuda a buscadores y lectores de pantalla', 'Carga más rápido', 'Da más color'],
            correct: 1,
            explanation: 'El significado explícito mejora SEO, accesibilidad y mantenimiento del código.'
          },
          {
            id: 'htme084', type: 'type-code', xp: 35,
            explanation: 'header, main y footer son etiquetas semánticas: no cambian el aspecto, pero explican la estructura a los buscadores y lectores de pantalla.',
            description: 'Crea una estructura con <header> (texto "DevQuest"), <main> (texto "Contenido") y <footer> (texto "© 2026").',
            starter: '<!-- Tu código aquí -->',
            solution: '<header><h1>DevQuest</h1></header>\n<main><p>Contenido</p></main>\n<footer><p>© 2026</p></footer>',
            tests: [{ expected: 'DevQuest Contenido © 2026', contains: '<main>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 9: COMENTARIOS Y ENTIDADES
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod9',
    title: 'Comentarios y Entidades',
    subtitle: 'Notas en el código y símbolos especiales',
    icon: '💬',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod9-les1',
        title: 'Comentarios',
        icon: '🗨️',
        exercises: [
          {
            id: 'htme085', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se escribe un comentario en HTML?',
            choices: ['// comentario', '<!-- comentario -->', '/* comentario */', '# comentario'],
            correct: 1,
            explanation: 'En HTML los comentarios van entre <!-- y -->.'
          },
          {
            id: 'htme086', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve en la página?',
            codeToRun: '<p>Visible</p>\n<!-- Este texto no se ve -->',
            output: ['Visible', 'Visible Este texto no se ve', 'Este texto no se ve', 'Error'],
            correctOutput: 0,
            explanation: 'Los comentarios no se muestran: el usuario solo ve "Visible".'
          },
          {
            id: 'htme087', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirven los comentarios?',
            choices: ['Hacen la página más rápida', 'Explicar el código para quien lo lee', 'Ocultar errores', 'Cambian el color'],
            correct: 1,
            explanation: 'Los comentarios explican el código. No afectan al funcionamiento ni al estilo.'
          },
          {
            id: 'htme088', type: 'fill-blank', xp: 20,
            question: 'Completa un comentario:',
            code: '<p>Hola</p>\n___ Esto es una nota para el programador ___',
            blanks: ['<!--', '-->'],
            options: ['<!-- -->', '-- --> <!--', '<!--', '-->'],
            explanation: 'Se abre con <!-- y se cierra con -->.'
          },
          {
            id: 'htme089', type: 'predict-output', xp: 20,
            question: '¿Qué se ve?',
            codeToRun: '<!-- <h1>Secreto</h1> -->\n<h1>Público</h1>',
            output: ['Secreto Público', 'Público', 'Secreto', 'Error'],
            correctOutput: 1,
            explanation: 'El <h1> está dentro del comentario, así que no existe para el navegador.'
          },
          {
            id: 'htme090', type: 'type-code', xp: 30,
            explanation: 'Los comentarios en HTML se abren con <!-- y se cierran con --> y nunca se muestran en la web.',
            description: 'Escribe un párrafo "Hola" y antes un comentario que diga "Saludo inicial".',
            starter: '<!-- Tu código aquí -->',
            solution: '<!-- Saludo inicial -->\n<p>Hola</p>',
            tests: [{ expected: 'Hola', contains: '<!-- Saludo inicial -->' }]
          }
        ]
      },
      {
        id: 'html-mod9-les2',
        title: 'Entidades HTML',
        icon: '©',
        exercises: [
          {
            id: 'htme091', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se escribe el símbolo de copyright (©)?',
            choices: ['(c)', '&#169;', '&copy;', 'copyright'],
            correct: 2,
            explanation: '&copy; es la entidad de copyright. También funciona &#169;.'
          },
          {
            id: 'htme092', type: 'multiple-choice', xp: 15,
            question: '¿Por qué usar entidades en vez de escribir "<" directamente?',
            choices: ['Se ven más bonitas', 'Evitan que el navegador lo interprete como etiqueta', 'Cargan más rápido', 'Son obligatorias'],
            correct: 1,
            explanation: 'Un "<" suelto abriría una etiqueta. &lt; lo muestra literalmente.'
          },
          {
            id: 'htme093', type: 'fill-blank', xp: 20,
            question: 'Escribe "menor que" (&lt;) usando su entidad:',
            code: '<p>___ es menor que &gt;</p>',
            blanks: ['&lt;'],
            options: ['&lt;', '&lt', '&#60;', '<'],
            explanation: '&lt; representa el símbolo < sin que el navegador lo interprete.'
          },
          {
            id: 'htme094', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<p>caf&eacute; &amp; t&eacute;</p>',
            output: ['caf&eacute; &amp; t&eacute;', 'café & té', 'café y té', 'Error'],
            correctOutput: 1,
            explanation: '&eacute; es la é, &amp; es el "&". El usuario ve "café & té".'
          },
          {
            id: 'htme095', type: 'multiple-choice', xp: 20,
            question: '¿Qué entidad representa un espacio que no debe colapsarse?',
            choices: ['&space;', '&nbsp;', '&blank;', '&gap;'],
            correct: 1,
            explanation: '&nbsp; (no-break space) es un espacio que nunca se parte al final de una línea.'
          },
          {
            id: 'htme096', type: 'type-code', xp: 30,
            explanation: 'Un menor que se escribiría como etiqueta de cierre, así que hay que escribirlo como la entidad &lt; para que el navegador lo muestre.',
            description: 'Escribe un párrafo que muestre "5 < 10" usando entidades.',
            starter: '<!-- Tu código aquí -->',
            solution: '<p>5 &lt; 10</p>',
            tests: [{ expected: '5 < 10', contains: '&lt;' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 10: MULTIMEDIA
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod10',
    title: 'Imágenes y Multimedia',
    subtitle: 'Fotos, vídeo y audio',
    icon: '🎬',
    color: '#4FACFE',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod10-les1',
        title: 'Vídeo y audio',
        icon: '🎥',
        exercises: [
          {
            id: 'htme097', type: 'multiple-choice', xp: 10,
            question: '¿Qué etiqueta se usa para vídeo?',
            choices: ['<video>', '<movie>', '<film>', '<play>'],
            correct: 0,
            explanation: '<video> reproduce vídeo. Se cierra con </video>.'
          },
          {
            id: 'htme098', type: 'multiple-choice', xp: 15,
            question: '¿Qué etiqueta se usa para audio?',
            choices: ['<sound>', '<audio>', '<music>', '<song>'],
            correct: 1,
            explanation: '<audio> reproduce sonido. Como <video>, se cierra con </audio>.'
          },
          {
            id: 'htme099', type: 'fill-blank', xp: 20,
            question: 'Completa un vídeo con control:',
            code: '<video src="intro.mp4" ___></video>',
            blanks: ['controls'],
            options: ['controls', 'control', 'buttons', 'play'],
            explanation: 'El atributo controls añade los botones de reproducción.'
          },
          {
            id: 'htme100', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve la etiqueta <source>?',
            choices: ['Para escribir texto', 'Para indicar un archivo alternativo', 'Para pausar', 'Para poner subtítulos'],
            correct: 1,
            explanation: '<source> ofrece varias fuentes para que el navegador elija la que soporta.'
          },
          {
            id: 'htme101', type: 'fill-blank', xp: 25,
            question: 'Cierra el elemento de audio:',
            code: '<audio src="cancion.mp3" controls>___',
            blanks: ['</audio>'],
            options: ['</audio>', '<audio>', '</sound>', '/audio'],
            explanation: 'A diferencia de <img>, <audio> sí se cierra.'
          },
          {
            id: 'htme102', type: 'type-code', xp: 30,
            explanation: 'El atributo controls añade los botones de reproducción. Sin él el vídeo se ve, pero nadie puede controlarlo.',
            description: 'Crea un vídeo con un <h1> "Mi vídeo" y un <video> de "intro.mp4" con controles.',
            starter: '<!-- Tu código aquí -->',
            solution: '<h1>Mi vídeo</h1>\n<video src="intro.mp4" controls></video>',
            tests: [{ expected: 'Mi vídeo', contains: 'controls' }]
          }
        ]
      },
      {
        id: 'html-mod10-les2',
        title: 'Figure y picture',
        icon: '🖼️',
        exercises: [
          {
            id: 'htme103', type: 'multiple-choice', xp: 10,
            question: '¿Qué envuelve una imagen con su pie?',
            choices: ['<figure>', '<caption>', '<pic>', '<frame>'],
            correct: 0,
            explanation: '<figure> agrupa una imagen (o vídeo) con su <figcaption>.'
          },
          {
            id: 'htme104', type: 'fill-blank', xp: 20,
            question: 'Completa el pie de la imagen:',
            code: '<figure>\n    <img src="perro.jpg" alt="Perro">\n    <___>Mi perro en el parque</___>\n</figure>',
            blanks: ['figcaption', 'figcaption></figcaption'],
            options: ['figcaption', 'figcaption></figcaption', 'caption', 'p'],
            explanation: '<figcaption> es el texto descriptivo que acompaña a la imagen.'
          },
          {
            id: 'htme105', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<figure>\n    <img src="a.jpg" alt="Árbol">\n    <figcaption>Un árbol grande</figcaption>\n</figure>',
            output: ['Un árbol grande', 'Árbol', 'Un árbol grande Árbol', 'Error'],
            correctOutput: 0,
            explanation: 'Solo se ve el figcaption. El texto del alt no se muestra si la imagen carga.'
          },
          {
            id: 'htme106', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve <picture>?',
            choices: ['Elegir entre versiones de la imagen', 'Agrandar imágenes', 'Recortar fotos', 'Poner bordes'],
            correct: 0,
            explanation: '<picture> permite dar una imagen para móvil y otra para escritorio.'
          },
          {
            id: 'htme107', type: 'fill-blank', xp: 25,
            question: 'Define una imagen adaptable:',
            code: '<picture>\n    <source srcset="foto-movil.jpg" media="(max-width: 600px)">\n    <img src="foto.jpg" alt="Foto">\n</___>',
            blanks: ['picture'],
            options: ['picture', 'figure', 'source', 'imgset'],
            explanation: 'Cierra con </picture> tras la imagen de respaldo.'
          },
          {
            id: 'htme108', type: 'type-code', xp: 30,
            explanation: 'figure agrupa una imagen con su pie, y figcaption es ese pie. Es la forma semántica de poner un pie a un contenido visual.',
            description: 'Crea una <figure> con una imagen "montaña.jpg" (alt "Montaña") y su pie " nevada".',
            starter: '<!-- Tu código aquí -->',
            solution: '<figure>\n    <img src="montaña.jpg" alt="Montaña">\n    <figcaption>Una montaña nevada</figcaption>\n</figure>',
            tests: [{ expected: 'Una montaña nevada', contains: '<figcaption>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 11: ACCESIBILIDAD
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod11',
    title: 'Accesibilidad',
    subtitle: 'HTML para todas las personas',
    icon: '♿',
    color: '#00D4FF',
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'html-mod11-les1',
        title: 'HTML para todos',
        icon: '♿',
        exercises: [
          {
            id: 'htme109', type: 'multiple-choice', xp: 10,
            question: '¿Qué significa que una web sea accesible?',
            choices: ['Que carga rápido', 'Que cualquiera pueda usarla, incluso con discapacidades', 'Que tenga muchos colores', 'Que funcione sin internet'],
            correct: 1,
            explanation: 'Accesibilidad es que todas las personas puedan usarla, con o sin discapacidad.'
          },
          {
            id: 'htme110', type: 'multiple-choice', xp: 15,
            question: '¿Qué herramienta usan las personas con discapacidad visual por teclado?',
            choices: ['Ratón', 'Lector de pantalla', 'Joystick', 'Cámara'],
            correct: 1,
            explanation: 'Los lectores de pantalla leen el texto en voz alta. Por eso el alt es imprescindible.'
          },
          {
            id: 'htme111', type: 'fill-blank', xp: 20,
            question: 'El atributo para describir una imagen:',
            code: '<img src="ciudad.jpg" ___="Vista de la ciudad desde el aire">',
            blanks: ['alt'],
            options: ['alt', 'title', 'desc', 'caption'],
            explanation: 'alt describe la imagen para quien no la ve.'
          },
          {
            id: 'htme112', type: 'multiple-choice', xp: 20,
            question: 'Una imagen decorativa (sin información) debería llevar...',
            choices: ['alt="bonita"', 'alt=""', 'src="vacia.jpg"', 'Nada'],
            correct: 1,
            explanation: 'alt="" indica que es decorativa y el lector la saltará sin leerla.'
          },
          {
            id: 'htme113', type: 'multiple-choice', xp: 25,
            question: 'Si un enlace dice solo "Más info", ¿qué atributo ajuda a describirlo mejor?',
            choices: ['aria-label="Más información sobre Python"', 'title="Más información sobre Python"', 'alt="Más información"', 'name="Python"'],
            correct: 0,
            explanation: 'aria-label sustituye al texto visible cuando este no es suficientemente descriptivo.'
          },
          {
            id: 'htme114', type: 'type-code', xp: 30,
            explanation: 'Una imagen necesita su alt (imprescindible para accesibilidad) y puede llevar una clase para poder darle estilo.',
            description: 'Crea una imagen de "perro.jpg" con alt "Un perro saltando" y una clase "foto".',
            starter: '<!-- Tu código aquí -->',
            solution: '<img src="perro.jpg" alt="Un perro saltando" class="foto">',
            tests: [{ expected: '', contains: 'alt="Un perro saltando"' }]
          }
        ]
      },
      {
        id: 'html-mod11-les2',
        title: 'Formularios accesibles',
        icon: '⌨️',
        exercises: [
          {
            id: 'htme115', type: 'multiple-choice', xp: 15,
            question: '¿Por qué cada campo de un formulario necesita un <label>?',
            choices: ['Se ven más bonitos', 'Al hacer clic se seleccionan y los lectores los anuncian', 'Obliga a rellenar', 'Dan el foco solo'],
            correct: 1,
            explanation: 'El label con for hace clicable la etiqueta y anuncia qué campo es.'
          },
          {
            id: 'htme116', type: 'multiple-choice', xp: 15,
            question: '¿Qué debe tener todo campo obligatorio?',
            choices: ['id', 'name', 'required', 'value'],
            correct: 2,
            explanation: 'required impide enviar el formulario si el campo está vacío.'
          },
          {
            id: 'htme117', type: 'fill-blank', xp: 20,
            question: 'Marca un campo como obligatorio:',
            code: '<input type="email" id="correo" name="correo" ___.>',
            blanks: ['required'],
            options: ['required', 'obligatorio', 'must', 'needed'],
            explanation: 'required es el atributo HTML5 para campos obligatorios.'
          },
          {
            id: 'htme118', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el idioma de la página más accesible?',
            choices: ['Ocultarlo', 'Declararlo con lang en <html>', 'Usar solo imágenes', 'No importa'],
            correct: 1,
            explanation: '<html lang="es"> permite que el lector de pantalla use la pronunciación correcta.'
          },
          {
            id: 'htme119', type: 'fill-blank', xp: 25,
            question: 'Asocia el label a su campo:',
            code: '<label for="email">Email</label>\n<input type="email" id="___" name="email" required>',
            blanks: ['email'],
            options: ['email', 'name', 'correo', 'mail'],
            explanation: 'for y id deben coincidir exactamente ("email").'
          },
          {
            id: 'htme120', type: 'type-code', xp: 35,
            explanation: 'type="email" hace que el navegador valide el formato y required impide enviar el formulario vacío. El for del label apunta al id.',
            description: 'Crea un formulario con label e input de email, ambos conectados y obligatorios.',
            starter: '<!-- Tu código aquí -->',
            solution: '<form>\n    <label for="email">Email</label>\n    <input type="email" id="email" name="email" required>\n</form>',
            tests: [{ expected: 'Email', contains: 'required' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 12: ESTILOS EN LÍNEA
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod12',
    title: 'Primeros Estilos',
    subtitle: 'Un vistazo al estilo (bridge a CSS)',
    icon: '🎨',
    color: '#2965F1',
    gradient: 'linear-gradient(135deg, #2965F1 0%, #33A9DC 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'html-mod12-les1',
        title: 'Estilos en línea',
        icon: '🖌️',
        exercises: [
          {
            id: 'htme121', type: 'multiple-choice', xp: 10,
            question: '¿Qué atributo permite dar color y formato a un elemento?',
            choices: ['class', 'style', 'color', 'format'],
            correct: 1,
            explanation: 'style="..." aplica estilos rápidos directamente en el elemento.'
          },
          {
            id: 'htme122', type: 'fill-blank', xp: 20,
            question: 'Pon un párrafo en rojo:',
            code: '<p ___="color: red">Hola</p>',
            blanks: ['style'],
            options: ['style', 'class', 'color', 'css'],
            explanation: 'style="color: red" aplica ese estilo solo a este elemento.'
          },
          {
            id: 'htme123', type: 'predict-output', xp: 20,
            question: '¿Qué texto se ve?',
            codeToRun: '<p style="color: red">Hola</p>',
            output: ['Hola', '(vacío)', 'style="color: red"', 'Error'],
            correctOutput: 0,
            explanation: 'El estilo solo cambia el color; el texto sigue siendo "Hola".'
          },
          {
            id: 'htme124', type: 'multiple-choice', xp: 20,
            question: '¿Cuál es el problema de usar estilos en línea?',
            choices: ['No funcionan', 'Hay que repetirlos en cada elemento', 'Dan error', 'Son más lentos'],
            correct: 1,
            explanation: 'Se repiten mucho y son difíciles de cambiar. Por eso existe CSS (el siguiente lenguaje).'
          },
          {
            id: 'htme125', type: 'fill-blank', xp: 25,
            question: 'Completa el tamaño de letra grande:',
            code: '<h1 style="font-size: ___px">Título</h1>',
            blanks: ['32'],
            options: ['32', 'big', 'grande', 'large'],
            explanation: 'En style, el tamaño va en px: font-size: 32px.'
          },
          {
            id: 'htme126', type: 'type-code', xp: 30,
            explanation: 'El atributo style aplica CSS solo a ese elemento. Sirve para casos puntuales, pero lo habitual es usar una hoja de estilos aparte.',
            description: 'Crea un <h1> "Hola" con estilo inline que lo ponga en color azul.',
            starter: '<!-- Tu código aquí -->',
            solution: '<h1 style="color: blue">Hola</h1>',
            tests: [{ expected: 'Hola', contains: 'style="color: blue"' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 13: PROYECTO · TARJETA PERSONAL
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod13',
    title: '🏆 Proyecto: Tu Tarjeta',
    subtitle: 'Tu primera página completa',
    icon: '🪪',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'html-mod13-les1',
        title: 'Tarjeta personal',
        icon: '🪪',
        exercises: [
          {
            id: 'htme127', type: 'reorder', xp: 30,
            question: 'Ordena una tarjeta personal semántica:',
            blocks: [
              '<footer><p>© 2026 Ana</p></footer>',
              '<article>',
              '<h1>Ana</h1>',
              '<p>Aprendiendo a programar</p>',
              '</article>'
            ],
            correctOrder: [1, 2, 3, 4, 0],
            explanation: 'El article agrupa el contenido y el footer va fuera, al final.'
          },
          {
            id: 'htme128', type: 'multiple-choice', xp: 20,
            question: '¿Qué estructura semántica corresponde a una tarjeta personal?',
            choices: ['<div> repetido', '<article> con header y footer', '<table>', '<ul>'],
            correct: 1,
            explanation: '<article> representa un contenido autónomo: la tarjeta completa.'
          },
          {
            id: 'htme129', type: 'fill-blank', xp: 25,
            question: 'Añade un enlace a tu GitHub en el footer:',
            code: '<footer>\n    <a href="https://github.com/ana" rel="noopener" target="___">GitHub</a>\n</footer>',
            blanks: ['_blank'],
            options: ['_blank', 'blank', 'new', 'top'],
            explanation: 'target="_blank" abre el enlace en una pestaña nueva.'
          },
          {
            id: 'htme130', type: 'predict-output', xp: 25,
            question: '¿Qué texto se ve?',
            codeToRun: '<article><h1>Ana</h1><p>Pythonista</p></article>',
            output: ['Ana Pythonista', 'Ana', 'Pythonista', 'Error'],
            correctOutput: 0,
            explanation: 'Se ve el nombre y su descripción, en ese orden.'
          },
          {
            id: 'htme131', type: 'multiple-choice', xp: 25,
            question: '¿Qué haría bien una tarjeta personal accesible?',
            choices: ['Usar <h1> para el nombre y <p> para la descripción', 'Usar 6 <h1>', 'Poner todo en <b>', 'Usar <marquee>'],
            correct: 0,
            explanation: 'Jerarquía correcta (un h1 y párrafos) y nada de elementos antiguos como <marquee>.'
          },
          {
            id: 'htme132', type: 'type-code', xp: 40,
            explanation: 'article representa un contenido autónomo, y su footer lleva los metadatos, como el copyright.',
            description: 'Crea tu tarjeta: un <article> con un <h1> "Ana", un <p> "Desarrolladora" y un <footer> con "© 2026".',
            starter: '<!-- Tu código aquí -->',
            solution: '<article>\n    <h1>Ana</h1>\n    <p>Desarrolladora</p>\n    <footer><p>© 2026</p></footer>\n</article>',
            tests: [{ expected: 'Ana Desarrolladora © 2026', contains: '<article>' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // HTML MÓDULO 14: PROYECTO · WEB DE CONTACTO
  // ═══════════════════════════════════════════════
  {
    id: 'html-mod14',
    title: '🏆 Proyecto: Web deContacto',
    subtitle: 'Un formulario que funciona',
    icon: '📨',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'html-mod14-les1',
        title: 'Formulario de contacto',
        icon: '📨',
        exercises: [
          {
            id: 'htme133', type: 'multiple-choice', xp: 20,
            question: '¿Qué método se usa para enviar datos a un servidor?',
            choices: ['get', 'post', 'send', 'submit'],
            correct: 1,
            explanation: 'method="post" envía los datos de forma segura (en el cuerpo de la petición).'
          },
          {
            id: 'htme134', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve <fieldset> y <legend>?',
            choices: ['Para ocultar campos', 'Agrupar campos relacionados y ponerles un título', 'Hacer la página más bonita', 'Enviar el formulario'],
            correct: 1,
            explanation: 'fieldset agrupa campos y legend es su título visible.'
          },
          {
            id: 'htme135', type: 'fill-blank', xp: 25,
            question: 'Abre un fieldset con su leyenda:',
            code: '<___>\n    <legend>Datos personales</legend>\n</fieldset>',
            blanks: ['fieldset'],
            options: ['fieldset', 'group', 'set', 'box'],
            explanation: '<fieldset> se cierra con </fieldset> y contiene un <legend>.'
          },
          {
            id: 'htme136', type: 'predict-output', xp: 25,
            question: '¿Qué texto se ve?',
            codeToRun: '<form>\n    <label for="n">Nombre</label>\n    <button type="submit">Enviar</button>\n</form>',
            output: ['Nombre Enviar', 'Solo Enviar', 'Nombre', 'Error'],
            correctOutput: 0,
            explanation: 'Se ve la etiqueta "Nombre" y el botón "Enviar".'
          },
          {
            id: 'htme137', type: 'multiple-choice', xp: 25,
            question: '¿Qué falta en un formulario de contacto bien hecho?',
            choices: ['Nada', 'Un botón type="submit" y campos obligatorios', 'Una tabla', 'Un <marquee>'],
            correct: 1,
            explanation: 'Sin botón de envío y required, el usuario no puede completar la acción.'
          },
          {
            id: 'htme138', type: 'type-code', xp: 40,
            explanation: 'El botón usa type="submit" para enviar el formulario. Al pulsar Enter dentro del campo también se envía.',
            description: 'Crea un formulario con un campo de email obligatorio (label conectado) y un botón "Enviar".',
            starter: '<form>\n    ___\n</form>',
            solution: '<form>\n    <label for="email">Email</label>\n    <input type="email" id="email" name="email" required>\n    <button type="submit">Enviar</button>\n</form>',
            tests: [{ expected: 'Email Enviar', contains: 'required' }]
          }
        ]
      }
    ]
  }
];