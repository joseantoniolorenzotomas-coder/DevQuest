// SQL Curriculum — El idioma de las bases de datos
//
// Todos los ejercicios se ejecutan contra la misma base de ejemplo, que
// está en sqlengine.js: libros, autores, socios y prestamos. Así el
// alumno ve siempre los mismos datos y puede comprobar sus consultas.
//
// La contraseña del modo administrador permite saltar al contenido para
// testearlo sin tener que encadenar lecciones.

window.SQL_CURRICULUM = [
  // ═══════════════════════════════════════════════
  // SQL MÓDULO 1: TU PRIMERA CONSULTA
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod1',
    title: 'Tu Primera Consulta',
    subtitle: 'Habla con la base de datos',
    icon: '💬',
    color: '#336791',
    gradient: 'linear-gradient(135deg, #336791 0%, #00B9D6 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'sql-mod1-les1',
        title: '¿Qué es una base de datos?',
        icon: '🗄️',
        exercises: [
          {
            id: 'sqle001', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve una base de datos?',
            choices: ['Para guardar y consultar información', 'Para dar estilo a la web', 'Para compilar programas', 'Para hacer copias de seguridad del disco'],
            correct: 0,
            explanation: 'Una base de datos guarda información de forma organizada para poder guardarla, buscarla y relacionarla. SQL es el idioma para hablar con ella.'
          },
          {
            id: 'sqle002', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa SQL?',
            choices: ['Structured Query Language', 'Simple Query Logic', 'Server Quality Language', 'Standard Question Level'],
            correct: 0,
            explanation: 'SQL son las siglas de Structured Query Language (lenguaje de consulta estructurado). Es un idioma estándar, lo usan MySQL, PostgreSQL, SQLite, Oracle...'
          },
          {
            id: 'sqle003', type: 'multiple-choice', xp: 15,
            question: 'En una base de datos relacional, los datos se guardan en...',
            choices: ['Columnas sueltas', 'Tablas formadas por filas y columnas', 'Archivos de texto', 'Carpetas del sistema'],
            correct: 1,
            explanation: 'Una tabla tiene filas (cada registro) y columnas (cada dato). Por ejemplo "libros" con una fila por libro y columnas titulo, anio y precio.'
          },
          {
            id: 'sqle004', type: 'predict-output', xp: 20,
            question: '¿Cuántos libros hay guardados?',
            codeToRun: "SELECT COUNT(*) FROM libros",
            output: ['6', '5', '4', 'El número no se puede saber'],
            correctOutput: 0,
            explanation: 'COUNT(*) cuenta las filas de la tabla. La tabla libros tiene 6 registros, así que devuelve 6.'
          },
          {
            id: 'sqle005', type: 'multiple-choice', xp: 20,
            question: 'Si una tabla "libros" tiene una columna "precio", ¿qué es una fila?',
            choices: ['Todos los precios juntos', 'Un libro concreto con su id, título y precio', 'El nombre de la columna', 'Una consulta que hacemos a la tabla'],
            correct: 1,
            explanation: 'La fila es cada registro completo: un libro con todos sus datos. Las columnas son los atributos (id, titulo, precio).'
          },
          {
            id: 'sqle006', type: 'type-code', xp: 30,
            description: 'Muestra todas las filas de la tabla libros.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT * FROM libros;',
            explanation: 'El asterisco significa "todas las columnas". SELECT * FROM libros devuelve las 6 filas con toda su información. El punto y coma cierra la sentencia.',
            tests: [{ expected: "id | titulo                             | autor_id | anio | precio | genero  \n-----------------------------------------------------------------------------\n 1 | El principito                      |        1 | 1943 |   12.5 | Infantil\n 2 | Cien años de soledad               |        2 | 1967 |     18 | Realismo\n 3 | Harry Potter y la piedra filosofal |        3 | 1997 |  15.75 | Fantasía\n 4 | El Hobbit                          |        3 | 1937 |   14.2 | Fantasía\n 5 | Pedro Páramo                       |        4 | 1955 |   11.9 | Realismo\n 6 | La sombra del viento               |        5 | 2001 |   16.4 | Misterio\n(6 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod1-les2',
        title: 'SELECT:asking por datos',
        icon: '🔍',
        exercises: [
          {
            id: 'sqle007', type: 'multiple-choice', xp: 10,
            question: '¿Cuál es la forma más básica de una consulta?',
            choices: ['SELECT columnas FROM tabla', 'IMPRIMIR tabla', 'ABRIR tabla', 'BUSCAR EN tabla'],
            correct: 0,
            explanation: 'La estructura es SELECT (qué columnas quieres) FROM (de qué tabla las sacas). El orden de las palabras clave es fijo.'
          },
          {
            id: 'sqle008', type: 'fill-blank', xp: 20,
            question: 'Completa para pedir el título de los libros:',
            code: 'SELECT ___ FROM libros;',
            blanks: ['titulo'],
            options: ['titulo', 'titulos', 'libro', '*'],
            explanation: 'Después de SELECT van los nombres de las columnas que quieres ver, separados por comas.'
          },
          {
            id: 'sqle009', type: 'predict-output', xp: 20,
            question: '¿Qué devuelve esta consulta?',
            codeToRun: 'SELECT genero FROM libros LIMIT 1',
            output: ['Infantil', 'Fantasía', '1943', 'El principito'],
            correctOutput: 0,
            explanation: 'LIMIT 1 recorta el resultado a la primera fila. La primera fila de libros es "El principito", de género Infantil.'
          },
          {
            id: 'sqle010', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si pides una columna que no existe?',
            choices: ['Devuelve NULL', 'Devuelve 0', 'Da un error', 'Te devuelve la tabla entera'],
            correct: 2,
            explanation: 'SQL avisa del error: esa columna no existe en la tabla. Es una de las ventajas de SQL, que es estricto con los nombres.'
          },
          {
            id: 'sqle011', type: 'multiple-choice', xp: 20,
            question: '¿Cómo pides dos columnas a la vez?',
            choices: ['SELECT titulo precio FROM libros', 'SELECT titulo, precio FROM libros', 'SELECT titulo AND precio FROM libros', 'SELECT titulo + precio FROM libros'],
            correct: 1,
            explanation: 'Las columnas se separan con comas. El AND es para condiciones del WHERE, no para listar columnas.'
          },
          {
            id: 'sqle012', type: 'type-code', xp: 30,
            description: 'Muestra solo el título y el año de cada libro.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, anio FROM libros;',
            explanation: 'Las columnas que quieres van separadas por comas entre SELECT y FROM, en el orden que tú decidas.',
            tests: [{ expected: 'titulo                             | anio\n-----------------------------------------\nEl principito                      | 1943\nCien años de soledad               | 1967\nHarry Potter y la piedra filosofal | 1997\nEl Hobbit                          | 1937\nPedro Páramo                       | 1955\nLa sombra del viento               | 2001\n(6 filas)\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 2: WHERE — FILTRAR
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod2',
    title: 'WHERE: Filtrar Datos',
    subtitle: 'Solo lo que te interesa',
    icon: '🔎',
    color: '#00B9D6',
    gradient: 'linear-gradient(135deg, #00B9D6 0%, #3EE6D0 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'sql-mod2-les1',
        title: 'Condiciones',
        icon: '✅',
        exercises: [
          {
            id: 'sqle013', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve WHERE?',
            choices: ['Para ordenar los resultados', 'Para filtrar las filas que cumplen una condición', 'Para elegir la tabla', 'Para contar filas'],
            correct: 1,
            explanation: 'WHERE va justo después de FROM y descarta las filas que no cumplen la condición. Devuelve solo las que la cumplen.'
          },
          {
            id: 'sqle014', type: 'fill-blank', xp: 20,
            question: 'Filtra los libros publicados antes de 1950:',
            code: 'SELECT titulo FROM libros\nWHERE anio ___ 1950;',
            blanks: ['<'],
            options: ['<', '>', '<=', '>'],
            correct: 0,
            explanation: 'El símbolo < significa "menor que". El Hobbit (1937) y El principito (1943) son anteriores a 1950.'
          },
          {
            id: 'sqle015', type: 'predict-output', xp: 20,
            question: '¿Cuántos libros tienen precio menor de 13?',
            codeToRun: 'SELECT COUNT(*) FROM libros WHERE precio < 13',
            output: ['2', '1', '3', '6'],
            correctOutput: 0,
            explanation: 'Pedro Páramo (11,90) y El principito (12,50) son los dos que cuestan menos de 13.'
          },
          {
            id: 'sqle016', type: 'multiple-choice', xp: 20,
            question: '¿Qué operadores de comparación tiene SQL?',
            choices: ['=, <>, <, <=, >, >=', 'Solo = y !=', '+ - * /', 'AND, OR, NOT'],
            correct: 0,
            explanation: 'Son = (igual), <> o != (distinto), < <= (menor) y > >= (mayor). AND, OR y NOT combinan condiciones.'
          },
          {
            id: 'sqle017', type: 'multiple-choice', xp: 20,
            question: 'En "WHERE precio = 18", ¿el 18 va con comillas?',
            choices: ['Sí, siempre', 'No, porque es un número', 'Solo si es decimal', 'Da igual'],
            correct: 1,
            explanation: 'Los números van sin comillas; los textos van entre comillas simples. Si pones "18" estás comparando con el texto, no con el número, y no encontrará nada.'
          },
          {
            id: 'sqle018', type: 'type-code', xp: 30,
            description: 'Muestra el título y el precio de los libros que cuesten más de 15.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, precio FROM libros WHERE precio > 15;',
            explanation: 'Los números se comparan sin comillas. Devuelve los tres libros más caros: Harry Potter, La sombra del viento y Cien años de soledad.',
            tests: [{ expected: "titulo                             | precio\n-------------------------------------------\nCien años de soledad               |     18\nHarry Potter y la piedra filosofal |  15.75\nLa sombra del viento               |   16.4\n(3 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod2-les2',
        title: 'AND, OR y NOT',
        icon: '🔗',
        exercises: [
          {
            id: 'sqle019', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace AND?',
            choices: ['Se cumple con que las dos condiciones sean ciertas', 'Se cumple con que una sola sea cierta', 'Niega la condición', 'Une dos tablas'],
            correct: 0,
            explanation: 'AND exige que todas las condiciones sean verdad. Es un "y" lógico.'
          },
          {
            id: 'sqle020', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace OR?',
            choices: ['Exige todas las condiciones', 'Se cumple con que al menos una sea cierta', 'Niega todo', 'Ordena los resultados'],
            correct: 1,
            explanation: 'OR se cumple si alguna condición es verdadera. Si las dos lo son, también se cumple.'
          },
          {
            id: 'sqle021', type: 'fill-blank', xp: 20,
            question: 'Fantasía y de antes de 1990:',
            code: "SELECT titulo FROM libros\nWHERE genero = 'Fantasía' ___ anio < 1990;",
            blanks: ['AND'],
            options: ['AND', 'OR', 'NOT', 'WHERE'],
            correct: 0,
            explanation: 'Con AND solo salen las filas que cumplen las dos cosas: El Hobbit (1937).'
          },
          {
            id: 'sqle022', type: 'predict-output', xp: 25,
            question: '¿Qué títulos devuelve?',
            codeToRun: "SELECT titulo FROM libros WHERE genero = 'Realismo' OR precio > 16",
            output: ['Cien años de soledad, Pedro Páramo, La sombra del viento', 'Solo Pedro Páramo', 'Los 6 libros', 'Ningún libro'],
            correctOutput: 0,
            explanation: 'OR con que una se cumpla vale: los dos de Realismo y La sombra del viento (16,40). Harry Potter se queda fuera porque 15,75 no pasa de 16.'
          },
          {
            id: 'sqle023', type: 'multiple-choice', xp: 20,
            question: '¿Cómo se niega una condición?',
            choices: ['WHERE NOT genero = \'Realismo\'', 'WHERE genero <> \'Realismo\'', 'Las dos anteriores valen', 'WHERE genero NO REALismo'],
            correct: 2,
            explanation: 'NOT genero = X y genero <> X hacen lo mismo: quedarse con lo que no sea X. El operador <> significa "distinto de".'
          },
          {
            id: 'sqle024', type: 'type-code', xp: 30,
            description: 'Muestra los títulos de los libros que NO son de género Realismo.',
            starter: '-- Tu consulta aquí',
            solution: "SELECT titulo FROM libros WHERE genero <> 'Realismo';",
            explanation: 'El operador <> significa distinto de. Salen los cuatro libros que no son realistas.',
            tests: [{ expected: "titulo                            \n----------------------------------\nEl principito                     \nHarry Potter y la piedra filosofal\nEl Hobbit                         \nLa sombra del viento              \n(4 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 3: ORDENAR Y RECORTAR
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod3',
    title: 'Ordenar y Recortar',
    subtitle: 'ORDER BY y LIMIT',
    icon: '📊',
    color: '#0B5FA5',
    gradient: 'linear-gradient(135deg, #0B5FA5 0%, #336791 100%)',
    level: 'Principiante',
    lessons: [
      {
        id: 'sql-mod3-les1',
        title: 'ORDER BY',
        icon: '🔃',
        exercises: [
          {
            id: 'sqle025', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve ORDER BY?',
            choices: ['Para filtrar', 'Para ordenar los resultados', 'Para borrar filas', 'Para crear la tabla'],
            correct: 1,
            explanation: 'ORDER BY va al final de la consulta yordena las filas por la columna que le indiques. Por defecto de menor a mayor.'
          },
          {
            id: 'sqle026', type: 'fill-blank', xp: 20,
            question: 'Ordena los libros del más caro al más barato:',
            code: 'SELECT titulo, precio FROM libros\nORDER BY precio ___;',
            blanks: ['DESC'],
            options: ['DESC', 'ASC', 'UP', 'DOWN'],
            correct: 0,
            explanation: 'DESC es "descending" (de mayor a menor). Para de menor a mayor, que es el orden por defecto, no hace falta nada o se pone ASC.'
          },
          {
            id: 'sqle027', type: 'predict-output', xp: 25,
            question: '¿Cuál sale primero con ORDER BY anio?',
            codeToRun: 'SELECT titulo FROM libros ORDER BY anio LIMIT 1',
            output: ['El Hobbit', 'La sombra del viento', 'El principito', 'Harry Potter'],
            correctOutput: 0,
            explanation: 'Sin nada el orden es de menor a mayor. El Hobbit es de 1937, el más antiguo de la tabla.'
          },
          {
            id: 'sqle028', type: 'multiple-choice', xp: 20,
            question: 'Se puede ordenar por varias columnas?',
            choices: ['No, solo una', 'Sí: ORDER BY genero, precio', 'Solo con texto', 'Solo con números'],
            correct: 1,
            explanation: 'Se separan por comas y se aplican en orden: primero por género y dentro de cada género por precio.'
          },
          {
            id: 'sqle029', type: 'multiple-choice', xp: 20,
            question: 'ORDER BY puede ordenar por una columna que no has pedido?',
            choices: ['No, da error', 'Sí, por ejemplo SELECT titulo ... ORDER BY anio', 'Solo con LIMIT', 'Solo con COUNT'],
            correct: 1,
            explanation: 'Puedes ordenar por columnas que no aparezcan en el SELECT. Solo tienes que conocer el nombre de la columna.'
          },
          {
            id: 'sqle030', type: 'type-code', xp: 30,
            description: 'Muestra los dos libros más recientes (año más alto primero).',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, anio FROM libros ORDER BY anio DESC LIMIT 2;',
            explanation: 'DESC pone los años más grandes primero y LIMIT 2 se queda solo con los dos primeros: La sombra del viento y Harry Potter.',
            tests: [{ expected: 'titulo                             | anio\n-----------------------------------------\nLa sombra del viento               | 2001\nHarry Potter y la piedra filosofal | 1997\n(2 filas)\n' }]
          }
        ]
      },
      {
        id: 'sql-mod3-les2',
        title: 'LIMIT y OFFSET',
        icon: '✂️',
        exercises: [
          {
            id: 'sqle031', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace LIMIT 3?',
            choices: ['Borra 3 filas', 'Devuelve como máximo 3 filas', 'Salta 3 filas', 'Cuenta hasta 3'],
            correct: 1,
            explanation: 'LIMIT recorta el resultado. Nunca borra datos, solo limita cuántas filas te devuelve la consulta.'
          },
          {
            id: 'sqle032', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve OFFSET?',
            choices: ['Para saltar un número de filas', 'Para borrar', 'Para filtrar', 'Para renombrar'],
            correct: 0,
            explanation: 'OFFSET salta las primeras N filas. Sirve para paginación: "dame los 10 siguientes saltándome los 20 primeros".'
          },
          {
            id: 'sqle033', type: 'fill-blank', xp: 20,
            question: 'Pide 3 libros, saltándote los 2 primeros:',
            code: 'SELECT titulo FROM libros\nORDER BY anio\nLIMIT 3 ___ 2;',
            blanks: ['OFFSET'],
            options: ['OFFSET', 'SKIP', 'AFTER', 'FROM'],
            correct: 0,
            explanation: 'La forma completa es LIMIT número OFFSET número. El OFFSET va siempre detrás del LIMIT.'
          },
          {
            id: 'sqle034', type: 'predict-output', xp: 25,
            question: '¿Qué devuelve?',
            codeToRun: 'SELECT titulo FROM libros ORDER BY anio LIMIT 2 OFFSET 1',
            output: ['El principito y Pedro Páramo', 'El Hobbit y El principito', 'Harry Potter y La sombra del viento', 'Los 6 libros'],
            correctOutput: 0,
            explanation: 'Ordenados por año quedan: El Hobbit (1937), El principito (1943), Pedro Páramo (1955)... El OFFSET 1 salta el primero y el LIMIT 2 se queda con dos.'
          },
          {
            id: 'sqle035', type: 'multiple-choice', xp: 20,
            question: '¿LIMIT 0 devuelve?',
            choices: ['Todas las filas', 'Ninguna fila', 'Error', 'Solo la primera'],
            correct: 1,
            explanation: 'LIMIT 0 no pide ninguna fila, así que devuelve la tabla vacía con la cabecera y "(0 filas)".'
          },
          {
            id: 'sqle036', type: 'type-code', xp: 25,
            description: 'Muestra los 3 libros más baratos de más a menos precio.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, precio FROM libros ORDER BY precio ASC LIMIT 3;',
            explanation: 'Ordenamos de menor a mayor y nos quedamos con tres: Pedro Páramo, El principito y El Hobbit.',
            tests: [{ expected: 'titulo        | precio\n----------------------\nPedro Páramo  |   11.9\nEl principito |   12.5\nEl Hobbit     |   14.2\n(3 filas)\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 4: TEXTOS Y NULL
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod4',
    title: 'Textos, Números y NULL',
    subtitle: 'Los tipos de dato y sus trampas',
    icon: '🔤',
    color: '#4A7DBB',
    gradient: 'linear-gradient(135deg, #4A7DBB 0%, #7FB3E0 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'sql-mod4-les1',
        title: 'Los tipos de datos',
        icon: '📦',
        exercises: [
          {
            id: 'sqle037', type: 'multiple-choice', xp: 10,
            question: '¿Cómo se escriben los textos en SQL?',
            choices: ['Entre comillas simples', 'Entre comillas dobles', 'Sin comillas', 'Entre comillas invertidas'],
            correct: 0,
            explanation: 'Los textos van entre comillas simples: WHERE genero = \'Fantasía\'. Las comillas dobles son para identificadores.'
          },
          {
            id: 'sqle038', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipo de dato es "1943"?',
            choices: ['Texto', 'Número entero', 'Booleano', 'Fecha'],
            correct: 1,
            explanation: 'Al no llevar comillas, 1943 es un número entero. Si el año fuera texto (\'1943\'), no entraría en las comparaciones numéricas.'
          },
          {
            id: 'sqle039', type: 'fill-blank', xp: 20,
            question: 'Completa el texto con las comillas correctas (una en cada hueco):',
            code: 'SELECT nombre FROM socios\nWHERE ciudad = ___ Sevilla ___;',
            blanks: ["'", "'"],
            options: ["'", '"', '`'],
            correct: 0,
            explanation: 'Un texto se abre y se cierra con comilla simple. Sin ellas SQL creería que "Sevilla" es el nombre de una columna y daría error.'
          },
          {
            id: 'sqle040', type: 'predict-output', xp: 25,
            question: 'Compara un texto con un número: ¿cuántas filas salen?',
            codeToRun: 'SELECT COUNT(*) FROM libros WHERE titulo = 12',
            output: ['0', '6', '1', 'Error'],
            correctOutput: 0,
            explanation: 'Un número sin comillas es el número 12, y ningún título se llama así, así que salen 0 filas. La trampa es al revés: si comparas un número con un texto entrecomillado, el motor lo convierte y puede darte una coincidencia inesperada.'
          },
          {
            id: 'sqle041', type: 'multiple-choice', xp: 20,
            question: '¿Qué hay que escribir cuando un texto lleva una comilla dentro?',
            choices: ['Dos comillas simples seguidas', 'Coma', 'Barra invertida', 'Nada especial'],
            correct: 0,
            explanation: 'Se duplica la comilla: \'O\'Brien\'. Es el mismo criterio que en Python con las comillas triples.'
          },
          {
            id: 'sqle042', type: 'type-code', xp: 30,
            description: 'Muestra el nombre de los socios que viven en Madrid.',
            starter: '-- Tu consulta aquí',
            solution: "SELECT nombre FROM socios WHERE ciudad = 'Madrid';",
            explanation: 'La ciudad es un texto, así que va entre comillas simples. Salen Ana y Marta, las dos de Madrid.',
            tests: [{ expected: "nombre\n------\nAna   \nMarta \n(2 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod4-les2',
        title: 'El valor NULL',
        icon: '❓',
        exercises: [
          {
            id: 'sqle043', type: 'multiple-choice', xp: 15,
            question: '¿Qué significa NULL?',
            choices: ['El número cero', 'Que falta el dato o no se conoce', 'Una cadena vacía', 'Un error'],
            correct: 1,
            explanation: 'NULL es "sin valor": no es cero ni texto vacío, es la ausencia de dato. Se escribe sin comillas.'
          },
          {
            id: 'sqle044', type: 'multiple-choice', xp: 15,
            question: '¿Por qué no puedes comprobar NULL con =?',
            choices: ['Porque NULL no existe', 'Porque NULL = NULL no es verdadero, es desconocido', 'Por ir muy lento', 'Porque hay que usar comillas'],
            correct: 1,
            explanation: 'NULL = NULL devuelve NULL, no verdadero. Por eso hay que usar IS NULL e IS NOT NULL.'
          },
          {
            id: 'sqle045', type: 'fill-blank', xp: 20,
            question: 'Muestra las filas sin autor asignado:',
            code: 'SELECT titulo FROM libros\nWHERE autor_id ___ NULL;',
            blanks: ['IS'],
            options: ['IS', '= ', 'EQUALS', 'LIKE'],
            correct: 0,
            explanation: 'Se comprueba con IS NULL, nunca con = NULL. En nuestro ejemplo no hay ninguno, así que saldría (0 filas).'
          },
          {
            id: 'sqle046', type: 'predict-output', xp: 25,
            question: '¿Cuántos libros tienen autor_id NULL?',
            codeToRun: 'SELECT COUNT(*) FROM libros WHERE autor_id IS NULL',
            output: ['0', '6', '1', 'Error'],
            correctOutput: 0,
            explanation: 'En nuestra tabla todos los libros tienen autor, así que no hay ninguno con NULL. Por eso sale 0 y no un error.'
          },
          {
            id: 'sqle047', type: 'multiple-choice', xp: 20,
            question: '¿NULL es lo mismo que un texto vacío?',
            choices: ['Sí', 'No: NULL es ausencia de dato y \'\' es un texto sin caracteres', 'Solo en MySQL', 'Depende de la tabla'],
            correct: 1,
            explanation: 'Son cosas distintas. Un texto vacío es un valor que existe; NULL es que no hay ningún valor guardado.'
          },
          {
            id: 'sqle048', type: 'type-code', xp: 30,
            description: 'Muestra los títulos que NO son NULL (es decir, que tienen título).',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo FROM libros WHERE titulo IS NOT NULL;',
            explanation: 'IS NOT NULL deja pasar las filas que sí tienen valor. En nuestra tabla los 6 libros tienen título.',
            tests: [{ expected: "titulo                            \n----------------------------------\nEl principito                     \nCien años de soledad              \nHarry Potter y la piedra filosofal\nEl Hobbit                         \nPedro Páramo                      \nLa sombra del viento              \n(6 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 5: PATRONES Y CONJUNTOS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod5',
    title: 'LIKE, IN y BETWEEN',
    subtitle: 'Filtros que ahorran tiempo',
    icon: '🔍',
    color: '#6C5CE7',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'sql-mod5-les1',
        title: 'LIKE: buscar textos',
        icon: '🔎',
        exercises: [
          {
            id: 'sqle049', type: 'multiple-choice', xp: 10,
            question: '¿Para qué sirve LIKE?',
            choices: ['Comparar números', 'Buscar textos que siguen un patrón', 'Unir tablas', 'Contar filas'],
            correct: 1,
            explanation: 'LIKE compara un texto contra un patrón en vez de contra un valor exacto.'
          },
          {
            id: 'sqle050', type: 'multiple-choice', xp: 15,
            question: 'En LIKE, ¿qué significa el %?',
            choices: ['Cualquier número de caracteres', 'Un solo carácter', 'El final del texto', 'Un espacio'],
            correct: 0,
            explanation: '% representa cualquier cantidad de caracteres, incluidas cero. El _ representa exactamente uno.'
          },
          {
            id: 'sqle051', type: 'fill-blank', xp: 20,
            question: 'Títulos que empiezan por "El":',
            code: "SELECT titulo FROM libros\nWHERE titulo ___ 'El%';",
            blanks: ['LIKE'],
            options: ['LIKE', '=', 'IN', 'AS'],
            correct: 0,
            explanation: 'El patrón va entre comillas y el % dice "y lo que venga detrás". Salen El principito y El Hobbit.'
          },
          {
            id: 'sqle052', type: 'predict-output', xp: 25,
            question: '¿Cuántos títulos no empiezan por "El"?',
            codeToRun: "SELECT COUNT(*) FROM libros WHERE titulo NOT LIKE 'El%'",
            output: ['4', '2', '6', '0'],
            correctOutput: 0,
            explanation: 'Dos empiezan por El (El principito y El Hobbit), así que los otros cuatro son los que no empiezan por El.'
          },
          {
            id: 'sqle053', type: 'multiple-choice', xp: 20,
            question: 'Para buscar "H___y" (cinco caracteres) ¿qué comodín se usa?',
            choices: ['%', '_', '#', '*'],
            correct: 1,
            explanation: 'El guion bajo _ es exactamente un carácter cualquiera. El asterisco es de otros lenguajes, aquí no hace nada.'
          },
          {
            id: 'sqle054', type: 'type-code', xp: 30,
            description: 'Muestra los títulos que contengan la palabra "el" en minúsculas.',
            starter: '-- Tu consulta aquí',
            solution: "SELECT titulo FROM libros WHERE titulo LIKE '%el%';",
            explanation: 'Con % delante y detrás buscamos la palabra en cualquier parte del título. Salen los tres que la llevan.',
            tests: [{ expected: "titulo              \n--------------------\nEl principito       \nEl Hobbit           \nLa sombra del viento\n(3 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod5-les2',
        title: 'IN y BETWEEN',
        icon: '📋',
        exercises: [
          {
            id: 'sqle055', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace IN?',
            choices: ['Comprueba que el valor esté en una lista', 'Comprueba un rango', 'Une dos tablas', 'Ordena resultados'],
            correct: 0,
            explanation: 'IN (a, b, c) comprueba si el valor es alguno de los de la lista. Sustituye a repetir OR.'
          },
          {
            id: 'sqle056', type: 'multiple-choice', xp: 15,
            question: '¿Qué hace BETWEEN?',
            choices: ['Comprueba que el valor esté entre dos límites', 'Comprueba que sea distinto', 'Agrupa filas', 'Cuenta filas'],
            correct: 0,
            explanation: 'BETWEEN min Y max incluye los dos extremos. Es cómodo para rangos de números.'
          },
          {
            id: 'sqle057', type: 'fill-blank', xp: 20,
            question: 'Fantasía o Misterio, sin repetir OR:',
            code: "SELECT titulo FROM libros\nWHERE genero ___ ('Fantasía', 'Misterio');",
            blanks: ['IN'],
            options: ['IN', 'LIKE', 'BETWEEN', 'OR'],
            correct: 0,
            explanation: 'IN lleva la lista entre paréntesis y separada por comas. Salen los tres libros de esos dos géneros.'
          },
          {
            id: 'sqle058', type: 'predict-output', xp: 25,
            question: '¿Cuántos libros están entre 1943 y 1997 (ambos incluidos)?',
            codeToRun: 'SELECT COUNT(*) FROM libros WHERE anio BETWEEN 1943 AND 1997',
            output: ['4', '3', '5', '6'],
            correctOutput: 0,
            explanation: 'Entran 1943, 1955, 1967 y 1997. Se quedan fuera El Hobbit (1937) y La sombra del viento (2001).'
          },
          {
            id: 'sqle059', type: 'multiple-choice', xp: 20,
            question: 'BETWEEN 12 AND 16, ¿el 16 entra?',
            choices: ['Sí, BETWEEN incluye los extremos', 'No, hay que poner 17', 'Depende de la base de datos', 'Da error'],
            correct: 0,
            explanation: 'BETWEEN es inclusivo: BETWEEN 12 AND 16 incluye el 12 y el 16.'
          },
          {
            id: 'sqle060', type: 'type-code', xp: 30,
            description: 'Muestra los títulos publicados entre 1940 y 1970.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, anio FROM libros WHERE anio BETWEEN 1940 AND 1970;',
            explanation: 'BETWEEN con las dos fechas incluye los extremos: El principito (1943), Pedro Páramo (1955) y Cien años de soledad (1967).',
            tests: [{ expected: "titulo               | anio\n---------------------------\nEl principito        | 1943\nCien años de soledad | 1967\nPedro Páramo         | 1955\n(3 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 6: AGREGAR Y RESUMIR
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod6',
    title: 'Funciones de Agregado',
    subtitle: 'COUNT, SUM, AVG, MIN y MAX',
    icon: '📈',
    color: '#00A878',
    gradient: 'linear-gradient(135deg, #00A878 0%, #4ECDC4 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'sql-mod6-les1',
        title: 'Contar y sumar',
        icon: '➕',
        exercises: [
          {
            id: 'sqle061', type: 'multiple-choice', xp: 10,
            question: '¿Qué hace COUNT(*)?',
            choices: ['Cuenta los caracteres de un texto', 'Cuenta las filas', 'Suma los valores', 'Cuenta las columnas'],
            correct: 1,
            explanation: 'El asterisco significa "todas las filas". COUNT(*) devuelve cuántas hay.'
          },
          {
            id: 'sqle062', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la diferencia entre COUNT(*) y COUNT(precio)?',
            choices: ['Ninguna', 'COUNT(*) cuenta filas; COUNT(precio) cuenta solo las que tienen precio', 'COUNT(*) suma', 'COUNT(precio) siempre da 0'],
            correct: 1,
            explanation: 'COUNT(*) cuenta filas, aunque alguna tenga NULL. COUNT(columna) ignora las filas donde esa columna es NULL, que es justo lo que suele interessarte.'
          },
          {
            id: 'sqle063', type: 'fill-blank', xp: 20,
            question: 'Suma todos los precios de la tabla:',
            code: 'SELECT ___ (precio) FROM libros;',
            blanks: ['SUM'],
            options: ['SUM', 'ADD', 'TOTAL', 'SUMA'],
            correct: 0,
            explanation: 'SUM suma los valores numéricos de una columna. La función se llama en inglés.'
          },
          {
            id: 'sqle064', type: 'predict-output', xp: 25,
            question: '¿Cuántos préstamos tiene el socio 3 (Marta)?',
            codeToRun: 'SELECT COUNT(*) FROM prestamos WHERE socio_id = 3',
            output: ['1', '2', '3', '0'],
            correctOutput: 0,
            explanation: 'Marta tiene un solo préstamo: el del 20 de febrero. Si sumáramos la columna libro_id obtendríamos 3, que es otra cosa.'
          },
          {
            id: 'sqle065', type: 'multiple-choice', xp: 20,
            question: 'Sin GROUP BY, un SELECT con COUNT devuelve...',
            choices: ['Una fila por cada libro', 'Una sola fila con la cuenta total', 'Ninguna fila', 'Una fila por columna'],
            correct: 1,
            explanation: 'Sin agrupar, todas las filas se cuentan juntas: el resultado es una única fila con el total.'
          },
          {
            id: 'sqle066', type: 'type-code', xp: 30,
            description: 'Calcula la suma de todos los precios de la tabla libros.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT SUM(precio) AS total FROM libros;',
            explanation: 'SUM suma la columna precio. Le ponemos AS total para que la cabecera se entienda; sin alias saldría el nombre de la función.',
            tests: [{ expected: "total\n-----\n88.75\n(1 fila)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod6-les2',
        title: 'Media, mínimo y máximo',
        icon: '📊',
        exercises: [
          {
            id: 'sqle067', type: 'multiple-choice', xp: 15,
            question: '¿Qué función da la media?',
            choices: ['AVERAGE', 'AVG', 'MEAN', 'MIDDLE'],
            correct: 1,
            explanation: 'AVG es la abreviatura de average (media). En algunos motores también existe AVERAGE, pero AVG es el estándar.'
          },
          {
            id: 'sqle068', type: 'multiple-choice', xp: 15,
            question: '¿Qué devuelven MIN y MAX?',
            choices: ['El mínimo y el máximo de una columna', 'El primer y el último registro', 'El número de filas', 'Nada si la columna es texto'],
            correct: 0,
            explanation: 'MIN y MAX dan el valor más pequeño y el más grande. También funcionan con textos, por orden alfabético.'
          },
          {
            id: 'sqle069', type: 'fill-blank', xp: 20,
            question: '¿Cuál es el libro más antiguo?',
            code: 'SELECT titulo FROM libros\nWHERE anio = (SELECT ___ (anio) FROM libros);',
            blanks: ['MIN'],
            options: ['MIN', 'LESS', 'FIRST', 'LOWER'],
            correct: 0,
            explanation: 'Con una subconsulta en el WHERE comparamos cada año con el mínimo de todos, y solo queda el que lo cumple: El Hobbit (1937).'
          },
          {
            id: 'sqle070', type: 'predict-output', xp: 25,
            question: '¿Cuál es el año más reciente?',
            codeToRun: 'SELECT MAX(anio) FROM libros',
            output: ['2001', '1943', '1997', '1967'],
            correctOutput: 0,
            explanation: 'MAX(anio) devuelve el año más alto de la tabla: 2001, el de La sombra del viento.'
          },
          {
            id: 'sqle071', type: 'multiple-choice', xp: 20,
            question: 'AVG sobre una columna con NULL, ¿los tiene en cuenta?',
            choices: ['Sí, los cuenta como cero', 'No, los ignora', 'Da error', 'Los convierte en 1'],
            correct: 1,
            explanation: 'Las funciones de agregado ignoran los NULL, igual que SUM. Por eso la media no se hunde por los huecos.'
          },
          {
            id: 'sqle072', type: 'type-code', xp: 30,
            description: 'Muestra el precio medio de los libros.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT AVG(precio) AS media FROM libros;',
            explanation: 'AVG calcula la media. Sale 14,792 porque 88,75 entre 6 libros da eso; AVG redondea a tres decimales.',
            tests: [{ expected: "media \n------\n14.792\n(1 fila)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 7: GROUP BY
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod7',
    title: 'GROUP BY',
    subtitle: 'Resumir por categorías',
    icon: '🗂️',
    color: '#F39C12',
    gradient: 'linear-gradient(135deg, #F39C12 0%, #F7DC6F 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'sql-mod7-les1',
        title: 'Agrupar filas',
        icon: '📦',
        exercises: [
          {
            id: 'sqle073', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve GROUP BY?',
            choices: ['Agrupar las filas que comparten un mismo valor', 'Ordenar', 'Filtrar', 'Borrar'],
            correct: 0,
            explanation: 'GROUP BY junta en un grupo las filas que tienen el mismo valor en esa columna, para poder aplicar funciones de agregado a cada grupo.'
          },
          {
            id: 'sqle074', type: 'multiple-choice', xp: 15,
            question: 'Al usar GROUP BY, ¿qué columnas puedo poner en SELECT?',
            choices: ['Solo la del GROUP BY y funciones de agregado', 'Cualquier columna', 'Ninguna', 'Solo columnas de texto'],
            correct: 0,
            explanation: 'En modo agrupado cada fila es un grupo, así que solo tiene sentido la columna por la que se agrupa y los agregados (COUNT, SUM...).'
          },
          {
            id: 'sqle075', type: 'fill-blank', xp: 20,
            question: 'Cuenta los libros de cada género:',
            code: 'SELECT genero, COUNT(*) AS total\nFROM libros\n___ genero;',
            blanks: ['GROUP BY'],
            options: ['GROUP BY', 'ORDER BY', 'PARTITION BY', 'SORT BY'],
            correct: 0,
            explanation: 'GROUP BY agrupa. ORDER BY solo ordenaría, y aquí necesitamos una fila por género.'
          },
          {
            id: 'sqle076', type: 'predict-output', xp: 25,
            question: '¿Cuántos hay de género Misterio?',
            codeToRun: 'SELECT COUNT(*) FROM libros WHERE genero = \'Misterio\'',
            output: ['1', '2', '0', '4'],
            correctOutput: 0,
            explanation: 'Solo hay un libro de misterio: La sombra del viento. Por eso el grupo Misterio sale con 1.'
          },
          {
            id: 'sqle077', type: 'multiple-choice', xp: 20,
            question: 'GROUP BY va siempre al final de la consulta?',
            choices: ['Sí, después del FROM y del WHERE', 'Antes del SELECT', 'Es lo primero', 'Da igual dónde se ponga'],
            correct: 0,
            explanation: 'El orden clásico es SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. Cada cláusula va en su sitio.'
          },
          {
            id: 'sqle078', type: 'type-code', xp: 30,
            description: 'Muestra cada género con cuántos libros tiene.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT genero, COUNT(*) AS total FROM libros GROUP BY genero;',
            explanation: 'Cada grupo es un género distinto y COUNT(*) cuenta los libros de ese grupo. Salen cuatro filas: Infantil 1, Realismo 2, Fantasía 2 y Misterio 1.',
            tests: [{ expected: 'genero   | total\n----------------\nInfantil |     1\nRealismo |     2\nFantasía |     2\nMisterio |     1\n(4 filas)\n' }]
          }
        ]
      },
      {
        id: 'sql-mod7-les2',
        title: 'HAVING y ordenar el resumen',
        icon: '🏆',
        exercises: [
          {
            id: 'sqle079', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre WHERE y HAVING?',
            choices: ['Nada, son iguales', 'WHERE filtra filas antes de agrupar; HAVING filtra los grupos ya formados', 'HAVING ordena', 'WHERE cuenta y HAVING filtra'],
            correct: 1,
            explanation: 'WHERE acts sobre las filas originales; HAVING sobre el resultado de cada grupo. Por eso HAVING puede mirar el COUNT.'
          },
          {
            id: 'sqle080', type: 'multiple-choice', xp: 15,
            question: '¿Por qué no puede usarse WHERE COUNT(*) > 1?',
            choices: ['Porque WHERE va después de GROUP BY', 'Porque en el WHERE todavía no hay grupo al que contar', 'Porque COUNT no existe', 'Porque da error de sintaxis siempre'],
            correct: 1,
            explanation: 'WHERE se aplica antes de agrupar, así que no existe todavía el grupo. Para contar hay que usar HAVING.'
          },
          {
            id: 'sqle081', type: 'fill-blank', xp: 20,
            question: 'Géneros con más de un libro:',
            code: 'SELECT genero, COUNT(*) AS total\nFROM libros\nGROUP BY genero\n___ COUNT(*) > 1;',
            blanks: ['HAVING'],
            options: ['HAVING', 'WHERE', 'AND', 'FILTER'],
            correct: 0,
            explanation: 'HAVING filtra los grupos ya calculados. Quedan Realismo y Fantasía con 2 cada uno.'
          },
          {
            id: 'sqle082', type: 'predict-output', xp: 25,
            question: '¿Qué grupos sobreviven a HAVING COUNT(*) > 1?',
            codeToRun: 'SELECT genero, COUNT(*) AS total FROM libros GROUP BY genero HAVING COUNT(*) > 1',
            output: ['Realismo y Fantasía', 'Los cuatro géneros', 'Solo Infantil', 'Ninguno'],
            correctOutput: 0,
            explanation: 'Realismo y Fantasía tienen 2 libros cada uno; Infantil y Misterio tienen 1 y se quedan fuera.'
          },
          {
            id: 'sqle083', type: 'multiple-choice', xp: 20,
            question: '¿Se puede ordenar un GROUP BY por un agregado?',
            choices: ['Sí, ORDER BY total donde total es el alias del agregado', 'No, nunca', 'Solo por la columna agrupada', 'Solo con texto'],
            correct: 0,
            explanation: 'Gracias al alias puedes ordenar por el resultado calculado. Por eso conviene poner AS nombre a los agregados.'
          },
          {
            id: 'sqle084', type: 'type-code', xp: 35,
            description: 'Muestra cada autor con cuántos libros tiene, ordenados de más a menos.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT a.nombre, COUNT(l.id) AS libros FROM autores a LEFT JOIN libros l ON a.id = l.autor_id GROUP BY a.nombre ORDER BY libros DESC;',
            explanation: 'La LEFT JOIN evita que un autor sin libros desaparezca, y COUNT(l.id) cuenta solo los que sí encontró. Tolkien queda con 2 y el resto con 1.',
            tests: [{ expected: "nombre                   | libros\n---------------------------------\nJ. R. R. Tolkien         |      2\nAntoine de Saint-Exupéry |      1\nGabriel García Márquez   |      1\nJuan Rulfo               |      1\nCarlos Ruiz Zafón        |      1\n(5 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 8: MODIFICAR DATOS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod8',
    title: 'INSERT, UPDATE y DELETE',
    subtitle: 'Cambiar lo que hay guardado',
    icon: '✏️',
    color: '#E74C3C',
    gradient: 'linear-gradient(135deg, #E74C3C 0%, #F1948A 100%)',
    level: 'Intermedio',
    lessons: [
      {
        id: 'sql-mod8-les1',
        title: 'INSERT: añadir filas',
        icon: '➕',
        exercises: [
          {
            id: 'sqle085', type: 'multiple-choice', xp: 10,
            question: '¿Qué sentencia añade una fila nueva?',
            choices: ['SELECT', 'INSERT', 'UPDATE', 'CREATE'],
            correct: 1,
            explanation: 'INSERT INTO tabla (columnas) VALUES (valores) inserta una fila. Si no pones las columnas, los valores van en el orden de la tabla.'
          },
          {
            id: 'sqle086', type: 'multiple-choice', xp: 15,
            question: '¿Por qué es mejor escribir los nombres de las columnas?',
            choices: ['Es más corto', 'Porque así no depende del orden de la tabla', 'Es obligatorio', 'Para que funcione más rápido'],
            correct: 1,
            explanation: 'Si escribes INSERT INTO libros VALUES (...) el orden importa y es frágil. Con los nombres, da igual cómo se reordenen las columnas.'
          },
          {
            id: 'sqle087', type: 'fill-blank', xp: 20,
            question: 'Completa el INSERT para añadir un socio nuevo:',
            code: "___ INTO socios (id, nombre, ciudad, socio_desde)\nVALUES (5, 'Nuria', 'Vigo', 2025);",
            blanks: ['INSERT'],
            options: ['INSERT', 'UPDATE', 'DELETE', 'SELECT'],
            correct: 0,
            explanation: 'La estructura es INSERT INTO tabla (columnas) VALUES (valores). Los textos van con comillas simples y los números sin ellas.'
          },
          {
            id: 'sqle088', type: 'predict-output', xp: 25,
            question: '¿Cuántos socios hay tras insertar a Nuria?',
            codeToRun: "INSERT INTO socios (id, nombre, ciudad, socio_desde) VALUES (5, 'Nuria', 'Vigo', 2025); SELECT COUNT(*) FROM socios;",
            output: ['5', '4', '6', 'Error'],
            correctOutput: 0,
            explanation: 'Estaban 4 socios y añadimos uno, así que ahora hay 5. En el editor cada consulta empieza de la base original, así que ves el efecto de tus sentencias.'
          },
          {
            id: 'sqle089', type: 'multiple-choice', xp: 20,
            question: '¿Se pueden insertar varias filas a la vez?',
            choices: ['No', 'Sí, separando los VALUES con comas', 'Solo con un bucle', 'Solo si la tabla está vacía'],
            correct: 1,
            explanation: 'Sí: VALUES (1, ...), (2, ...), (3, ...). Es mucho más rápido que mandar una sentencia por fila.'
          },
          {
            id: 'sqle090', type: 'type-code', xp: 30,
            description: 'Añade un libro nuevo a la tabla libros.',
            starter: '-- Tu INSERT aquí',
            solution: "INSERT INTO libros (id, titulo, autor_id, anio, precio, genero) VALUES (7, 'Seda', 5, 2002, 13.5, 'Realismo');",
            explanation: 'Los textos entre comillas simples y los números sin ellas. Ojo: cada consulta del editor parte de la base original, así que este INSERT no se ve en la siguiente consulta.',
            tests: [{ expected: '1 fila(s) insertada(s)\n' }]
          }
        ]
      },
      {
        id: 'sql-mod8-les2',
        title: 'UPDATE y DELETE',
        icon: '🗑️',
        exercises: [
          {
            id: 'sqle091', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la estructura de UPDATE?',
            choices: ['UPDATE tabla SET columna = valor WHERE ...', 'UPDATE tabla SET valor WHERE columna', 'SET tabla UPDATE ...', 'UPDATE valor FROM tabla'],
            correct: 0,
            explanation: 'Se indica la tabla, luego SET con las columnas a cambiar y su nuevo valor, y opcionalmente un WHERE para no tocar todo.'
          },
          {
            id: 'sqle092', type: 'multiple-choice', xp: 15,
            question: '¿Por qué es peligroso un UPDATE sin WHERE?',
            choices: ['Porque va más lento', 'Porque cambia absolutely todas las filas', 'Porque da error', 'Porque no funciona sin WHERE'],
            correct: 1,
            explanation: 'Sin WHERE el UPDATE se aplica a todas las filas de la tabla. Antes de ejecutarlo, prueba antes con un SELECT queUse el mismo WHERE.'
          },
          {
            id: 'sqle093', type: 'fill-blank', xp: 20,
            question: 'Sube el precio del libro 1 en 2 euros:',
            code: "UPDATE libros SET precio = precio + 2 WHERE id = ___;",
            blanks: ['1'],
            options: ['1', 'id', 'libro', 'titulo'],
            correct: 0,
            explanation: 'SET puede usar el valor actual: precio = precio + 2. El WHERE es imprescindible para no tocar los otros cinco libros.'
          },
          {
            id: 'sqle094', type: 'predict-output', xp: 25,
            question: '¿Cuántas filas cambia este UPDATE?',
            codeToRun: "UPDATE libros SET genero = 'Infantil' WHERE anio < 1950",
            output: ['2 filas actualizadas', '6 filas actualizadas', '1 fila actualizada', '0 filas actualizadas'],
            correctOutput: 0,
            explanation: 'Los libros anteriores a 1950 son El Hobbit (1937) y El principito (1943): exactamente dos filas.'
          },
          {
            id: 'sqle095', type: 'multiple-choice', xp: 20,
            question: '¿Qué hace DELETE FROM libros sin WHERE?',
            choices: ['Borra la tabla entera pero la deja creada, vacía', 'Borra un libro al azar', 'No hace nada', 'Borra solo la primera fila'],
            correct: 0,
            explanation: 'Borra todas las filas y deja la tabla vacía (sin borrarla del esquema). Por eso el WHERE es tan importante como en UPDATE.'
          },
          {
            id: 'sqle096', type: 'type-code', xp: 30,
            description: 'Cambia la ciudad del socio 4 a Bilbao.',
            starter: '-- Tu UPDATE aquí',
            solution: "UPDATE socios SET ciudad = 'Bilbao' WHERE id = 4;",
            explanation: 'La columna que cambia va en SET y el valor con su tipo correcto: texto entre comillas. El WHERE localiza al socio 4.',
            tests: [{ expected: '1 fila(s) actualizada(s)\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 9: JOINS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod9',
    title: 'JOIN: unir tablas',
    subtitle: 'La parte que más cuesta',
    icon: '🔗',
    color: '#0984E3',
    gradient: 'linear-gradient(135deg, #0984E3 0%, #6C5CE7 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'sql-mod9-les1',
        title: 'INNER JOIN',
        icon: '🤝',
        exercises: [
          {
            id: 'sqle097', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve un JOIN?',
            choices: ['Para borrar tablas', 'Para traer datos de dos tablas relacionados', 'Para contar filas', 'Para ordenar'],
            correct: 1,
            explanation: 'Un JOIN combina filas de dos tablas que están relacionadas. La relación se indica con ON.'
          },
          {
            id: 'sqle098', type: 'multiple-choice', xp: 15,
            question: 'En libros y autores, ¿qué columnas se relacionan?',
            choices: ['libros.titulo con autores.nombre', 'libros.autor_id con autores.id', 'libros.anio con autores.nacio', 'No hay relación'],
            correct: 1,
            explanation: 'La clave foránea autor_id de libros apunta al id de autores. Ese par de columnas es el que va en el ON.'
          },
          {
            id: 'sqle099', type: 'fill-blank', xp: 20,
            question: 'Une cada libro con su autor:',
            code: 'SELECT l.titulo, a.nombre\nFROM libros l\n___ autores a ON l.autor_id = a.id;',
            blanks: ['JOIN'],
            options: ['JOIN', 'MATCH', 'WITH', 'LINK'],
            correct: 0,
            explanation: 'JOIN a secas es lo mismo que INNER JOIN. El prefijo l. y a. son alias para no repetir el nombre de la tabla.'
          },
          {
            id: 'sqle100', type: 'predict-output', xp: 25,
            question: '¿Con qué autor sale "El Hobbit"?',
            codeToRun: "SELECT a.nombre FROM libros l JOIN autores a ON l.autor_id = a.id WHERE l.titulo = 'El Hobbit'",
            output: ['J. R. R. Tolkien', 'Juan Rulfo', 'Carlos Ruiz Zafón', 'Antoine de Saint-Exupéry'],
            correctOutput: 0,
            explanation: 'El Hobbit tiene autor_id 3, y el 3 de la tabla autores es Tolkien. El JOIN cruza el id con la clave foránea.'
          },
          {
            id: 'sqle101', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa si no pones ON en el JOIN?',
            choices: ['Funciona igual', 'SQL avisa de que falta la condición', 'Devuelve vacío', 'Borra datos'],
            correct: 1,
            explanation: 'ON es obligatorio: es la condición que decide qué filas se emparejan. Sin ella SQL da error.'
          },
          {
            id: 'sqle102', type: 'type-code', xp: 35,
            description: 'Muestra cada libro junto al nombre de su autor.',
            starter: '-- Tu JOIN aquí',
            solution: 'SELECT l.titulo, a.nombre FROM libros l JOIN autores a ON l.autor_id = a.id;',
            explanation: 'Cada libro tiene su autor_id, y el ON busca en autores esa id. Como todos los libros tienen autor, salen los 6.',
            tests: [{ expected: "titulo                             | nombre                  \n-------------------------------------------------------------\nEl principito                      | Antoine de Saint-Exupéry\nCien años de soledad               | Gabriel García Márquez  \nHarry Potter y la piedra filosofal | J. R. R. Tolkien        \nEl Hobbit                          | J. R. R. Tolkien        \nPedro Páramo                       | Juan Rulfo              \nLa sombra del viento               | Carlos Ruiz Zafón       \n(6 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod9-les2',
        title: 'LEFT JOIN',
        icon: '↔️',
        exercises: [
          {
            id: 'sqle103', type: 'multiple-choice', xp: 15,
            question: '¿Qué diferencia hay entre INNER JOIN y LEFT JOIN?',
            choices: ['Ninguna', 'LEFT JOIN mantiene también las filas de la izquierda que no encuentran pareja (con NULL)', 'LEFT JOIN devuelve más columnas', 'LEFT JOIN no necesita ON'],
            correct: 1,
            explanation: 'El INNER solo trae lo que tiene pareja en las dos tablas. El LEFT además se queda con lo de la izquierda que no encontró nada, rellenando con NULL.'
          },
          {
            id: 'sqle104', type: 'multiple-choice', xp: 15,
            question: '¿Cuándo es mejor un LEFT JOIN?',
            choices: ['Nunca', 'Para no perder filas: por ejemplo, libros que aún no tiene autor', 'Para contar más rápido', 'Para ordenar'],
            correct: 1,
            explanation: 'Si te importa "todos los libros, tengan autor o no", necesitas LEFT JOIN. Con INNER los que no tienen autor desaparecerían sin avisar.'
          },
          {
            id: 'sqle105', type: 'fill-blank', xp: 20,
            question: 'Todos los socios, tengan o no préstamos:',
            code: 'SELECT s.nombre, COUNT(p.id) AS prestamos\nFROM socios s\n___ prestamos p ON p.socio_id = s.id\nGROUP BY s.nombre;',
            blanks: ['LEFT JOIN'],
            options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'FULL JOIN'],
            correct: 0,
            explanation: 'Con LEFT JOIN el socio 4 (Javi), que no tiene préstamos, aparece igualmente con un 0.'
          },
          {
            id: 'sqle106', type: 'predict-output', xp: 25,
            question: '¿Cuántas filas da este INNER JOIN?',
            codeToRun: 'SELECT s.nombre FROM socios s INNER JOIN prestamos p ON p.socio_id = s.id',
            output: ['3', '4', '5', '2'],
            correctOutput: 0,
            explanation: 'Hay 4 préstamos y los tres socios queKFHan pedido algo (Ana, Luis y Marta). Javi no tiene ninguno, así que el INNER lo descarta y quedan 3 filas.'
          },
          {
            id: 'sqle107', type: 'multiple-choice', xp: 20,
            question: 'Con LEFT JOIN, ¿qué aparece en las columnas de la derecha para las filas sin pareja?',
            choices: ['0', 'Texto vacío', 'NULL', 'Error'],
            correct: 2,
            explanation: 'NULL es lo correcto: no hay dato. Si pones COALESCE(p.id, 0) lo puedes convertir a cero para que se vea más limpio.'
          },
          {
            id: 'sqle108', type: 'type-code', xp: 35,
            description: 'Muestra todos los socios con cuántos préstamos tiene (los que no tienen, con 0).',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT s.nombre, COUNT(p.id) AS prestamos FROM socios s LEFT JOIN prestamos p ON p.socio_id = s.id GROUP BY s.nombre;',
            explanation: 'La LEFT JOIN mantiene a Javi. COUNT(p.id) cuenta solo los préstamos reales, así que a él le sale 0.',
            tests: [{ expected: "nombre | prestamos\n------------------\nAna    |         2\nLuis   |         1\nMarta  |         1\nJavi   |         0\n(4 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 10: ALIAS Y SUBCONSULTAS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod10',
    title: 'Alias y Subconsultas',
    subtitle: 'Consultas dentro de consultas',
    icon: '🎯',
    color: '#AF7AC5',
    gradient: 'linear-gradient(135deg, #AF7AC5 0%, #E0B0FF 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'sql-mod10-les1',
        title: 'Alias y funciones',
        icon: '🏷️',
        exercises: [
          {
            id: 'sqle109', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve AS?',
            choices: ['Para ordenar', 'Para poner un nombre a una columna o tabla', 'Para borrar', 'Para contar'],
            correct: 1,
            explanation: 'AS crea un alias: le da un nombre legible a una columna calculada o abrevia el nombre de una tabla.'
          },
          {
            id: 'sqle110', type: 'multiple-choice', xp: 15,
            question: '¿Qué pone en la cabecera SELECT SUM(precio)?',
            choices: ['precio', 'SUM(precio)', 'total', 'Nada'],
            correct: 1,
            explanation: 'Sin alias la cabecera es el texto literal de la expresión. Con AS total queda mucho más legible.'
          },
          {
            id: 'sqle111', type: 'fill-blank', xp: 20,
            question: 'Completa el alias de tabla (para no escribir "libros." cada vez):',
            code: 'SELECT l.titulo, a.nombre\nFROM libros ___ l\nJOIN autores ___ a ON l.autor_id = a.id;',
            blanks: ['AS', 'AS'],
            options: ['AS', 'ALIAS', 'BE'],
            correct: 0,
            explanation: 'El alias se escribe con AS (aunque es opcional). Con l y a la consulta queda mucho más corta.'
          },
          {
            id: 'sqle112', type: 'predict-output', xp: 25,
            question: '¿Qué número sale?',
            codeToRun: 'SELECT ROUND(AVG(precio), 2) AS media FROM libros',
            output: ['14.79', '14.8', '14', '88.75'],
            correctOutput: 0,
            explanation: 'ROUND(..., 2) redondea a dos decimales. El resultado de AVG era 14,792 y se queda en 14,79.'
          },
          {
            id: 'sqle113', type: 'multiple-choice', xp: 20,
            question: '¿Para qué sirve un alias de columna?',
            choices: ['Para renombrar el resultado y poder ordenarlo por él', 'Para cambiar el nombre en la tabla', 'Para crear columnas nuevas', 'Para borrar columnas'],
            correct: 0,
            explanation: 'Renombra solo en la salida, no la tabla. Su uso estrella es ORDER BY total, que ordena por el resultado del agregado.'
          },
          {
            id: 'sqle114', type: 'type-code', xp: 30,
            description: 'Muestra el título del libro y su precio con un 21% de descuento (redondeado a 2 decimales).',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo, ROUND(precio * 0.79, 2) AS con_descuento FROM libros;',
            explanation: 'Un SELECT puede contener cálculos. ROUND(..., 2) deja dos decimales para que el precio no salga con muchos decimales.',
            tests: [{ expected: "titulo                             | con_descuento\n--------------------------------------------------\nEl principito                      |          9.88\nCien años de soledad               |         14.22\nHarry Potter y la piedra filosofal |         12.44\nEl Hobbit                          |         11.22\nPedro Páramo                       |           9.4\nLa sombra del viento               |         12.96\n(6 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod10-les2',
        title: 'Subconsultas',
        icon: '🔬',
        exercises: [
          {
            id: 'sqle115', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una subconsulta?',
            choices: ['Una consulta dentro de otra, entre paréntesis', 'Una tabla nueva', 'Un tipo de dato', 'Un índice'],
            correct: 0,
            explanation: 'Es una consulta anidada que devuelve un valor, una lista o un conjunto, y que se usa dentro de la consulta principal.'
          },
          {
            id: 'sqle116', type: 'multiple-choice', xp: 15,
            question: '¿Para qué sirve poner (SELECT MAX(anio) FROM libros) en el WHERE?',
            choices: ['Para ordenar por año', 'Para comparar cada fila con el máximo y quedarse solo con la que lo tiene', 'Para contar años', 'Para borrar libros'],
            correct: 1,
            explanation: 'El WHERE compara fila a fila con el resultado de la subconsulta, así que al final solo sobrevive el libro más reciente.'
          },
          {
            id: 'sqle117', type: 'fill-blank', xp: 20,
            question: 'Libros más caros que la media:',
            code: 'SELECT titulo, precio FROM libros\nWHERE precio > (SELECT ___ (precio) FROM libros);',
            blanks: ['AVG'],
            options: ['AVG', 'MAX', 'COUNT', 'SUM'],
            correct: 0,
            explanation: 'Con AVG obtenemos 14,792 y así quedan solo los tres que lo superan.'
          },
          {
            id: 'sqle118', type: 'predict-output', xp: 25,
            question: '¿Cuál es el libro más caro?',
            codeToRun: 'SELECT titulo FROM libros WHERE precio = (SELECT MAX(precio) FROM libros)',
            output: ['Cien años de soledad', 'La sombra del viento', 'Harry Potter', 'El Hobbit'],
            correctOutput: 0,
            explanation: 'MAX(precio) da 18, y el libro que cuesta 18 es Cien años de soledad. Un empate daría varias filas.'
          },
          {
            id: 'sqle119', type: 'multiple-choice', xp: 20,
            question: '¿Una subconsulta puede devolver varias filas?',
            choices: ['Nunca, solo un valor', 'Sí, y entonces el WHERE debe compararse con IN en vez de =', 'Solo en el FROM', 'Da error siempre'],
            correct: 1,
            explanation: 'Con = se espera un único valor. Si la subconsulta devuelve varias filas hay que usar IN: WHERE autor_id IN (SELECT id FROM autores WHERE pais = ...).'
          },
          {
            id: 'sqle120', type: 'type-code', xp: 30,
            description: 'Muestra los libros que no son del autor más antiguo.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT titulo FROM libros WHERE autor_id <> (SELECT id FROM autores WHERE nacio = 1892);',
            explanation: 'La subconsulta devuelve un solo id (el de Tolkien, que nació en 1892) y el WHERE descarta ese autor. Como Tolkien escribió 2 de los 6 libros, quedan los 4 de los demás autores.',
                                    tests: [{ expected: "titulo              \n--------------------\nEl principito       \nCien a\u00f1os de soledad\nPedro P\u00e1ramo        \nLa sombra del viento\n(4 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 11: DISEÑAR TABLAS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod11',
    title: 'Crear Tablas',
    subtitle: 'CREATE TABLE y tipos de columna',
    icon: '🏗️',
    color: '#16A085',
    gradient: 'linear-gradient(135deg, #16A085 0%, #48C9B0 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'sql-mod11-les1',
        title: 'CREATE TABLE',
        icon: '📐',
        exercises: [
          {
            id: 'sqle121', type: 'multiple-choice', xp: 15,
            question: '¿Cuál es la estructura de CREATE TABLE?',
            choices: ['CREATE TABLE nombre (columna tipo, ...)', 'CREATE TABLE FROM nombre', 'TABLE CREATE nombre', 'INSERT TABLE nombre'],
            correct: 0,
            explanation: 'Se indica el nombre y entre paréntesis las columnas con su tipo, separadas por comas.'
          },
          {
            id: 'sqle122', type: 'multiple-choice', xp: 15,
            question: '¿Qué tipos de dato hay?',
            choices: ['INT, TEXT, REAL y DATE, entre otros', 'Solo INT', 'Solo TEXT', 'NUMBER y STRING'],
            correct: 0,
            explanation: 'Los más usados son INT (enteros), REAL (decimales), TEXT (textos) y DATE (fechas). Cada motor acepta algunos propios.'
          },
          {
            id: 'sqle123', type: 'fill-blank', xp: 20,
            question: 'Completa el CREATE TABLE de una tabla de notas:',
            code: 'CREATE ___ notas (\n    id ___,\n    materia TEXT,\n    nota REAL\n);',
            blanks: ['TABLE', 'INT'],
            options: ['TABLE', 'INT', 'SELECT', 'TEXT'],
            correct: 0,
            explanation: 'CREATE TABLE va primero, y cada columna es nombre + tipo: id INT para enteros, TEXT para textos y REAL para decimales.'
          },
          {
            id: 'sqle124', type: 'predict-output', xp: 25,
            question: '¿Cuántas filas tiene una tabla recién creada?',
            codeToRun: 'CREATE TABLE vacia (id INT, texto TEXT); SELECT COUNT(*) FROM vacia;',
            output: ['0', '1', 'Error', 'NULL'],
            correctOutput: 0,
            explanation: 'CREATE TABLE solo define la estructura: la tabla nace vacía, así que COUNT(*) da 0. Insertar filas es otra sentencia.'
          },
          {
            id: 'sqle125', type: 'multiple-choice', xp: 20,
            question: '¿Qué pasa al crear dos veces la misma tabla?',
            choices: ['Se fusionan', 'SQL avisa de que ya existe', 'Se borra la anterior', 'No pasa nada'],
            correct: 1,
            explanation: 'Da error porque el nombre debe ser único. Si quieres vaciarla usa DROP TABLE, y para borrarla y crearla de nuevo, DROP y luego CREATE.'
          },
          {
            id: 'sqle126', type: 'type-code', xp: 25,
            description: 'Crea una tabla "etiquetas" con una columna id (INT) y una columna nombre (TEXT).',
            starter: '-- Tu CREATE TABLE aquí',
            solution: 'CREATE TABLE etiquetas (id INT, nombre TEXT);',
            explanation: 'El nombre de la tabla va primero y las columnas entre paréntesis. Después de crearla, aparece el aviso de que se ha creado.',
            tests: [{ expected: 'Tabla "etiquetas" creada\n' }]
          }
        ]
      },
      {
        id: 'sql-mod11-les2',
        title: 'Claves y restricciones',
        icon: '🔑',
        exercises: [
          {
            id: 'sqle127', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una clave primaria (PRIMARY KEY)?',
            choices: ['Una columna que no se repite en ninguna fila', 'La primera columna', 'Una columna de texto', 'Un índice rápido'],
            correct: 0,
            explanation: 'Identifica cada fila de forma única. No puede haber dos filas con el mismo valor ni nulos, y es la referencia natural de las claves foráneas.'
          },
          {
            id: 'sqle128', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una clave foránea (FOREIGN KEY)?',
            choices: ['Una columna que apunta al valor de una clave primaria de otra tabla', 'La clave del sistema', 'Una contraseña', 'Un índice'],
            correct: 0,
            explanation: 'Es la que mantiene la coherencia entre tablas: autor_id apunta a autores.id. Así no puede haber un libro de un autor inexistente.'
          },
          {
            id: 'sqle129', type: 'fill-blank', xp: 20,
            question: 'Declara id como clave primaria:',
            code: 'CREATE TABLE socios (\n    id INT PRIMARY ___,\n    nombre TEXT\n);',
            blanks: ['KEY'],
            options: ['KEY', 'INDEX', 'UNIQUE', 'ID'],
            correct: 0,
            explanation: 'Se escribe PRIMARY KEY. En algunas bases de datos PRIMARY KEY ya implica que no puede repetirse.'
          },
          {
            id: 'sqle130', type: 'predict-output', xp: 25,
            question: 'Crea una tabla con id como clave primaria e intenta meter dos veces el mismo id:',
            codeToRun: "CREATE TABLE socios_nuevos (id INT PRIMARY KEY, nombre TEXT); INSERT INTO socios_nuevos (id, nombre) VALUES (1, 'Ana'), (1, 'Repetido');",
            expectError: true,   // la pregunta ES qué pasa al violar la clave
            output: ['Se guardan las dos filas', 'Error de clave duplicada', 'Se guarda solo la primera', 'No pasa nada'],
            correctOutput: 1,
            explanation: 'La clave primaria no puede repetirse, así que la base rechaza la segunda fila. Por eso sirve: garantiza que cada fila se identifique de forma única.'
          },
          {
            id: 'sqle131', type: 'multiple-choice', xp: 20,
            question: '¿Qué significa NOT NULL?',
            choices: ['Que la columna no puede quedar vacía', 'Que se puede borrar', 'Que es texto', 'Que es única'],
            correct: 0,
            explanation: 'Obliga a guardar siempre un valor. Se combina con la clave primaria: id INT PRIMARY KEY NOT NULL.'
          },
          {
            id: 'sqle132', type: 'type-code', xp: 30,
            description: 'Crea una tabla "lecturas" con id (INT, clave primaria) y libro_id (INT, clave foránea a libros).',
            starter: '-- Tu CREATE TABLE aquí',
            solution: 'CREATE TABLE lecturas (id INT PRIMARY KEY, libro_id INT, FOREIGN KEY (libro_id) REFERENCES libros(id));',
            explanation: 'La clave foránea se declara con FOREIGN KEY (columna) REFERENCES tabla(columna). Así la base impide que se apunte a un libro que no existe.',
            tests: [{ expected: 'Tabla "lecturas" creada\n' }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 12: SEGURIDAD Y BUENAS PRÁCTICAS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod12',
    title: 'SQL y Seguridad',
    subtitle: 'Inyección y cómo evitarla',
    icon: '🔒',
    color: '#C0392B',
    gradient: 'linear-gradient(135deg, #C0392B 0%, #EC7063 100%)',
    level: 'Avanzado',
    lessons: [
      {
        id: 'sql-mod12-les1',
        title: 'Inyección SQL',
        icon: '⚠️',
        exercises: [
          {
            id: 'sqle133', type: 'multiple-choice', xp: 15,
            question: '¿Qué es una inyección SQL?',
            choices: ['Un virus que daña la base de datos', 'Que alguien mete código SQL dentro de un dato que tú creías inocuo', 'Una consulta muy larga', 'Un tipo de backup'],
            correct: 1,
            explanation: 'Si concatenas lo que escribe el usuario dentro de la consulta, puede cerrar las comillas y añadir su propio SQL: por ejemplo, hacer un DROP TABLE.'
          },
          {
            id: 'sqle134', type: 'multiple-choice', xp: 15,
            question: 'Esta consulta, ¿es segura?',
            choices: ['Sí: "SELECT * FROM socios WHERE nombre = \'" + nombre + "\'"', 'No: si nombre vale x\'; DROP TABLE socios; -- el atacante ejecuta su SQL', 'Sí, porque lleva comillas', 'Solo si el usuario es de confianza'],
            correct: 1,
            explanation: 'Eso se llama concatenar. Un atacante puede mandar la comilla que cierre la suya y escribir lo que quiera detrás.'
          },
          {
            id: 'sqle135', type: 'fill-blank', xp: 20,
            question: 'La forma correcta es usar consultas preparadas:',
            code: 'SELECT * FROM socios WHERE nombre = ?;\n-- se pasa el valor por separado, sin ___ de nada con el código',
            blanks: ['mezclar'],
            options: ['mezclar', 'juntar', 'unir', 'pegar'],
            correct: 0,
            explanation: 'El signo ? es un hueco. El motor envía la consulta y el dato por separado, así que el dato nunca se interpreta como código.'
          },
          {
            id: 'sqle136', type: 'predict-output', xp: 25,
            question: '¿Qué devuelve esta comparación?',
            codeToRun: "SELECT COUNT(*) FROM socios WHERE nombre = 'Ana' OR 1 = 1",
            output: ['4', '0', '1', 'Error'],
            correctOutput: 0,
            explanation: 'El 1 = 1 siempre es cierto, así que OR lo convierte en "muestra todos". Con el OR de siempre en la tabla socias salen los 4 socios.'
          },
          {
            id: 'sqle137', type: 'multiple-choice', xp: 20,
            question: '¿Cuáles son buenas prácticas?',
            choices: ['Concatenar para ir más rápido', 'Usar consultas preparadas, permisos mínimos y escapar cuando haga falta', 'Dejar la base abierta a internet', 'Usar el mismo usuario root siempre'],
            correct: 1,
            explanation: 'Consultas preparadas contra inyección, usuario con los permisos justos y nunca exponer la base directamente.'
          },
          {
            id: 'sqle138', type: 'type-code', xp: 30,
            description: 'Busca socios por ciudad usando un parámetro, no concatenando.',
            starter: '-- Tu consulta segura aquí',
            solution: "SELECT nombre FROM socios WHERE ciudad = 'Madrid';",
            explanation: 'En una app real sería "SELECT nombre FROM socios WHERE ciudad = ?" y se le pasa Madrid como dato aparte. Así el motor nunca mezcla el dato con el código.',
            tests: [{ expected: "nombre\n------\nAna   \nMarta \n(2 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod12-les2',
        title: 'BUENAS PRÁCTICAS',
        icon: '💎',
        exercises: [
          {
            id: 'sqle139', type: 'multiple-choice', xp: 15,
            question: '¿Por qué conviene SELECT * y no lista de columnas?',
            choices: ['Es más corto', 'Porque si añades una columna cambia el resultado y rompe lo que depende de las posiciones', 'Porque es más rápido', 'Porque lo obliga el estándar'],
            correct: 1,
            explanation: 'Con * te llevas columnas que no necesitas y si alguien añade una columna al principio, todo lo que leía por número se rompe.'
          },
          {
            id: 'sqle140', type: 'multiple-choice', xp: 15,
            question: '¿Cómo se write un UPDATE con riesgo?',
            choices: ['Con WHERE muy específico', 'Sin WHERE o con un WHERE mal pensado', 'Con comillas dobles', 'Con un alias'],
            correct: 1,
            explanation: 'El riesgo es tocar filas que no querías. Prueba antes el mismo WHERE con un SELECT para ver a cuántas filas afectaría.'
          },
          {
            id: 'sqle141', type: 'fill-blank', xp: 20,
            question: 'Completa la verificación previa a un DELETE:',
            code: "SELECT ___ (*) FROM libros\nWHERE genero = 'Realismo';",
            blanks: ['COUNT'],
            options: ['COUNT', 'DELETE', 'DROP', 'INSERT'],
            correct: 0,
            explanation: 'Pon primero el SELECT con el mismo WHERE. Si el número no es el que esperabas, algo va mal y no has borrado nada todavía.'
          },
          {
            id: 'sqle142', type: 'predict-output', xp: 25,
            question: '¿Qué devuelve esta verificación?',
            codeToRun: "SELECT COUNT(*) FROM libros WHERE genero = 'Realismo'",
            output: ['2', '1', '6', '4'],
            correctOutput: 0,
            explanation: 'Antes de borrar los libros de Realismo, esta consulta te dice que son 2. Si esperabas 1, mejor parar y revisar.'
          },
          {
            id: 'sqle143', type: 'multiple-choice', xp: 20,
            question: '¿Qué es una transacción?',
            choices: ['Un tipo de consulta', 'Un grupo de operaciones que se aplican todas o ninguna', 'Una copia de seguridad', 'Un índice'],
            correct: 1,
            explanation: 'Con BEGIN, TRANSACTION y COMMIT: si algo falla a mitad, un ROLLBACK deja la base como estaba. Es lo que evita datos a medio guardar.'
          },
          {
            id: 'sqle144', type: 'type-code', xp: 30,
            description: 'Comprueba con SELECT cuántos socios hay de cada ciudad antes de tocar nada.',
            starter: '-- Tu consulta aquí',
            solution: 'SELECT ciudad, COUNT(*) AS socios FROM socios GROUP BY ciudad ORDER BY socios DESC;',
            explanation: 'Antes de un cambio de datos, un GROUP BY te da la foto de lo que hay ahora mismo. Madrid es la ciudad con más socios.',
            tests: [{ expected: "ciudad  | socios\n----------------\nMadrid  |      2\nSevilla |      1\nBilbao  |      1\n(3 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 13: PROYECTO · INFORME DE LA BIBLIOTECA
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod13',
    title: '🏆 Proyecto: Informe de la Biblioteca',
    subtitle: 'Un informe completo con todo lo aprendido',
    icon: '🏛️',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FF8C00 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'sql-mod13-les1',
        title: 'Catálogo con autores',
        icon: '🏛️',
        exercises: [
          {
            id: 'sqle145', type: 'multiple-choice', xp: 20,
            question: 'Para el informe "libros con su autor y su país", ¿qué hace falta?',
            choices: ['Solo SELECT', 'Un JOIN entre libros y autores', 'Un GROUP BY', 'Un ORDER BY'],
            correct: 1,
            explanation: 'El autor y su país están en otra tabla, así que hace falta un JOIN. El GROUP BY y el ORDER BY solo affectan a la forma, no a los datos.'
          },
          {
            id: 'sqle146', type: 'multiple-choice', xp: 20,
            question: 'Para "los 3 libros más caros", ¿qué combinación se usa?',
            choices: ['JOIN + LIMIT', 'ORDER BY precio DESC + LIMIT 3', 'GROUP BY + WHERE', 'COUNT + HAVING'],
            correct: 1,
            explanation: 'Primero ordenas de mayor a menor y luego te quedas con tres. Es el mismo patrón que usaste en los cambios de precio.'
          },
          {
            id: 'sqle147', type: 'fill-blank', xp: 25,
            question: 'Ordena por país y por año dentro de cada país:',
            code: 'SELECT l.titulo, a.pais, l.anio\nFROM libros l JOIN autores a ON l.autor_id = a.id\nORDER BY a.pais, l.anio ___;',
            blanks: ['ASC'],
            options: ['ASC', 'DESC', 'GROUP', 'BY'],
            correct: 0,
            explanation: 'Con varios criterios se separan por comas y se aplican en orden: primero por país y dentro de cada país por año.'
          },
          {
            id: 'sqle148', type: 'predict-output', xp: 25,
            question: '¿Qué país sale primero al ordenar por país?',
            codeToRun: 'SELECT a.pais FROM libros l JOIN autores a ON l.autor_id = a.id ORDER BY a.pais LIMIT 1',
            output: ['Colombia', 'España', 'Francia', 'México'],
            correctOutput: 0,
            explanation: 'Al ordenar alfabéticamente por país el primero es Colombia (Gabriel García Márquez), antes que España, Francia o México.'
          },
          {
            id: 'sqle149', type: 'multiple-choice', xp: 25,
            question: '¿Por qué en el informe final conviene poner alias?',
            choices: ['Para que la tabla ocupe menos', 'Para que las cabeceras del informe se entiendan', 'Por obligación del motor', 'Para poder borrar después'],
            correct: 1,
            explanation: 'AS total o AS nº libros convierten cabeceras como COUNT(*) en algo que un lector entiende de un vistazo.'
          },
          {
            id: 'sqle150', type: 'type-code', xp: 45,
            description: 'Informe: cada libro con su autor y el país de ese autor, ordenados por país.',
            starter: '-- Tu informe aquí',
            solution: 'SELECT l.titulo, a.nombre, a.pais FROM libros l JOIN autores a ON l.autor_id = a.id ORDER BY a.pais, l.titulo;',
            explanation: 'El JOIN trae el autor y su país, y el ORDER BY ordena por país y luego por título para que sea legible. Las cabeceras salen limpias (titulo, nombre, pais) porque el motor quita el prefijo de tabla.',
            tests: [{ expected: "titulo                             | nombre                   | pais       \n---------------------------------------------------------------------------\nCien años de soledad               | Gabriel García Márquez   | Colombia   \nLa sombra del viento               | Carlos Ruiz Zafón        | España     \nEl principito                      | Antoine de Saint-Exupéry | Francia    \nPedro Páramo                       | Juan Rulfo               | México     \nEl Hobbit                          | J. R. R. Tolkien         | Reino Unido\nHarry Potter y la piedra filosofal | J. R. R. Tolkien         | Reino Unido\n(6 filas)\n" }]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════
  // SQL MÓDULO 14: PROYECTO · PANEL DE PRÉSTAMOS
  // ═══════════════════════════════════════════════
  {
    id: 'sql-mod14',
    title: '🏆 Proyecto: Panel de Préstamos',
    subtitle: 'Cruza libros, socios y préstamos',
    icon: '📊',
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    isProject: true,
    level: 'Proyecto',
    lessons: [
      {
        id: 'sql-mod14-les1',
        title: 'Historial de préstamos',
        icon: '📋',
        exercises: [
          {
            id: 'sqle151', type: 'multiple-choice', xp: 20,
            question: 'Para "quién pidió qué libro y cuándo", ¿cuántas tablas hay que cruzar?',
            choices: ['Una', 'Dos', 'Tres: libros, socios y prestamos', 'Ninguna'],
            correct: 2,
            explanation: 'El préstamo solo guarda libro_id y socio_id, así que hacen falta dos JOIN para llegar al título y al nombre del socio.'
          },
          {
            id: 'sqle152', type: 'multiple-choice', xp: 20,
            question: 'Para contar préstamos por socio sin perder a quien no tiene ninguno, ¿qué hace falta?',
            choices: ['INNER JOIN', 'LEFT JOIN desde socios y COUNT(p.id)', 'GROUP BY prestamos', 'ORDER BY'],
            correct: 1,
            explanation: 'Empiezas por socios y haces LEFT JOIN a prestamos. COUNT(p.id) cuenta los que sí existen, así que Javi sale con 0.'
          },
          {
            id: 'sqle153', type: 'fill-blank', xp: 25,
            question: 'Agrupa por socio para tener el recuento:',
            code: 'SELECT s.nombre, COUNT(p.id) AS prestamos\nFROM socios s LEFT JOIN prestamos p ON p.socio_id = s.id\nGROUP BY s.___;',
            blanks: ['nombre'],
            options: ['nombre', 'socio', 's', 'p'],
            correct: 0,
            explanation: 'El GROUP BY usa la columna que define el grupo, la misma que pones en el SELECT para identificar cada fila.'
          },
          {
            id: 'sqle154', type: 'predict-output', xp: 25,
            question: '¿Cuántos préstamos lleva Ana?',
            codeToRun: 'SELECT COUNT(*) FROM prestamos WHERE socio_id = 1',
            output: ['2', '1', '3', '0'],
            correctOutput: 0,
            explanation: 'Ana (id 1) tiene dos préstamos: el 15 de enero y el 11 de marzo.'
          },
          {
            id: 'sqle155', type: 'multiple-choice', xp: 25,
            question: '¿Por qué conviene LEFT JOIN en vez de INNER JOIN para este informe?',
            choices: ['Porque es más rápido', 'Porque si no, los socios sin préstamos desaparecerían del informe', 'Porque INNER JOIN no admite GROUP BY', 'Porque permite ordenar'],
            correct: 1,
            explanation: 'Con INNER JOIN, Javi (que no tiene préstamos) no aparecería. Un informe de biblioteca normal lo quiere ver con un 0 al lado.'
          },
          {
            id: 'sqle156', type: 'type-code', xp: 50,
            description: 'Informe: cada socio con su ciudad y cuántos préstamos ha hecho.',
            starter: '-- Tu informe aquí',
            solution: 'SELECT s.nombre, s.ciudad, COUNT(p.id) AS prestamos FROM socios s LEFT JOIN prestamos p ON p.socio_id = s.id GROUP BY s.nombre, s.ciudad ORDER BY prestamos DESC, s.nombre;',
            explanation: 'LEFT JOIN para no perder a Javi, COUNT(p.id) para contar solo los préstamos reales, y ORDER BY prestamos DESC para que quien más ha leído salga arriba. Javi aparece con 0.',
            tests: [{ expected: "nombre | ciudad  | prestamos\n----------------------------\nAna    | Madrid  |         2\nLuis   | Sevilla |         1\nMarta  | Madrid  |         1\nJavi   | Bilbao  |         0\n(4 filas)\n" }]
          }
        ]
      },
      {
        id: 'sql-mod14-les2',
        title: 'Resumen de leído por autor',
        icon: '🏆',
        exercises: [
          {
            id: 'sqle157', type: 'multiple-choice', xp: 20,
            question: 'Para "los tres libros más prestados", ¿qué camino sigue?',
            choices: ['JOIN libros-prestamos, GROUP BY libro, COUNT, ORDER BY y LIMIT', 'ORDER BY precio', 'GROUP BY socio', 'Solo COUNT'],
            correct: 0,
            explanation: 'Primero unes, luego agrupas por libro para contar, ordenas por esa cuenta y por fin LIMIT 3.'
          },
          {
            id: 'sqle158', type: 'multiple-choice', xp: 20,
            question: '¿Por qué el ORDER BY va con el nombre del SELECT?',
            choices: ['Porque ORDER BY solo funciona con alias', 'Para no repetir la expresión larga del agregado', 'Porque es obligatorio en los proyectos', 'Por costumbre'],
            correct: 1,
            explanation: 'Si pusieras "ORDER BY COUNT(*)" tendrías que repetir el COUNT entero. Con AS total el ORDER BY queda corto y legible.'
          },
          {
            id: 'sqle159', type: 'fill-blank', xp: 25,
            question: 'Los libros que alguien ha pedido más de una vez:',
            code: 'SELECT l.titulo, COUNT(*) AS veces\nFROM libros l JOIN prestamos p ON p.libro_id = l.id\nGROUP BY l.titulo\nHAVING COUNT(*) > ___;',
            blanks: ['1'],
            options: ['1', '2', '0', '3'],
            correct: 0,
            explanation: 'Harry Potter es el único con dos préstamos. Con HAVING > 1 sale solo él.'
          },
          {
            id: 'sqle160', type: 'predict-output', xp: 25,
            question: '¿Qué libro se pidió más veces?',
            codeToRun: 'SELECT l.titulo, COUNT(*) AS veces FROM libros l JOIN prestamos p ON p.libro_id = l.id GROUP BY l.titulo ORDER BY veces DESC LIMIT 1',
            output: ['Harry Potter', 'El principito', 'La sombra del viento', 'El Hobbit'],
            correctOutput: 0,
            explanation: 'Harry Potter y la piedra filosofal tiene dos préstamos; el resto, uno cada uno. Por eso queda primero.'
          },
          {
            id: 'sqle161', type: 'multiple-choice', xp: 25,
            question: 'Un libro sin préstamos, ¿aparece con INNER JOIN?',
            choices: ['Sí, con un 0', 'No, el INNER lo descarta', 'Sí, con NULL en el título', 'Da error'],
            correct: 1,
            explanation: 'El INNER solo trae filas con pareja en las dos tablas. Si quieres ver los libros nunca prestados, arranca por libros con LEFT JOIN.'
          },
          {
            id: 'sqle162', type: 'type-code', xp: 50,
            description: 'Ranking: los libros más prestados de la biblioteca.',
            starter: '-- Tu ranking aquí',
            solution: 'SELECT l.titulo, COUNT(*) AS veces FROM libros l JOIN prestamos p ON p.libro_id = l.id GROUP BY l.titulo ORDER BY veces DESC LIMIT 3;',
            explanation: 'El JOIN une, el GROUP BY agrupa por libro, COUNT(*) cuenta préstamos y ORDER BY veces DESC con LIMIT 3 deja el podio. Harry Potter primero con 2, y después El principito y La sombra del viento con 1.',
            tests: [{ expected: "titulo                             | veces\n------------------------------------------\nHarry Potter y la piedra filosofal |     2\nEl principito                      |     1\nLa sombra del viento               |     1\n(3 filas)\n" }]
          }
        ]
      }
    ]
  }
];
