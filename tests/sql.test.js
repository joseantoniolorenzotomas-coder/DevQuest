// Tests del mini motor de SQL (sqlengine.js)
//
// El motor tiene que ser fiable: si se rompe, los(type-code) del curso
// dejan de poder validarse y el alumno se atasca en un test imposible.
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { resetMocks, syncGlobals } from './setup.js';

await import('../sqlengine.js');
await import('../engine.js');
syncGlobals();

// La tabla alinea las columnas, así que hay que comparar ignorando espacios
const filas = (salida) => salida.split('\n')
  .map(l => l.replace(/\s*\|\s*/g, '|').trim())
  .filter(l => l && !l.startsWith('-') && !l.startsWith('('));

const E = () => window.SQL_ENGINE;

describe('Motor SQL', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('SELECT', () => {
    test('selecciona todas las columnas con *', () => {
      const r = E().ejecutar('SELECT * FROM socios');
      assert.equal(r.error, false);
      assert.match(r.output, /^id \| nombre \| ciudad  \| socio_desde/);
      assert.match(r.output, /\(4 filas\)/);
    });

    test('selecciona solo las columnas pedidas', () => {
      const r = E().ejecutar('SELECT nombre, ciudad FROM socios');
      assert.equal(r.error, false);
      assert.deepEqual(filas(r.output)[0], 'nombre|ciudad');
      assert.deepEqual(filas(r.output)[1], 'Ana|Madrid');
      // No debe aparecer la columna id
      assert.ok(!r.output.includes('socio_desde'));
    });

    test('el * de COUNT(*) no se expande como columna', () => {
      const r = E().ejecutar('SELECT COUNT(*) FROM libros');
      assert.match(r.output, /^COUNT\(\*\)/);
      assert.match(r.output, /\(1 fila\)/);
    });

    test('acepta * y columnas mezcladas', () => {
      const r = E().ejecutar('SELECT titulo, * FROM libros LIMIT 1');
      assert.equal(r.error, false);
      assert.match(r.output, /titulo/);
      assert.match(r.output, /genero/);
    });
  });

  describe('WHERE', () => {
    test('filtra por comparación numérica', () => {
      const r = E().ejecutar('SELECT titulo FROM libros WHERE anio > 1950');
      assert.match(r.output, /\(4 filas\)/);
      assert.ok(!r.output.includes('El Hobbit'), 'El Hobbit es de 1937');
      assert.ok(r.output.includes('Pedro Páramo'));
    });

    test('combina condiciones con AND', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE anio > 1900 AND genero = 'Fantasía'"
      );
      assert.match(r.output, /\(2 filas\)/);
      assert.ok(r.output.includes('El Hobbit'));
      assert.ok(r.output.includes('Harry Potter'));
    });

    test('combina condiciones con OR', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero = 'Infantil' OR genero = 'Misterio'"
      );
      assert.match(r.output, /\(2 filas\)/);
    });

    test('usa NOT para negar', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE NOT genero = 'Realismo'"
      );
      assert.match(r.output, /\(4 filas\)/);
    });

    test('usa BETWEEN para rangos', () => {
      const r = E().ejecutar('SELECT titulo FROM libros WHERE precio BETWEEN 12 AND 16');
      assert.match(r.output, /\(3 filas\)/);
      assert.ok(!r.output.includes('Cien años de soledad'), 'cuesta 18');
    });

    test('usa IN para varios valores', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero IN ('Fantasía', 'Infantil')"
      );
      assert.match(r.output, /\(3 filas\)/);
    });

    test('usa NOT IN para descartar varios valores', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero NOT IN ('Realismo', 'Misterio')"
      );
      // 6 libros menos los 2 de Realismo y el 1 de Misterio
      assert.match(r.output, /\(3 filas\)/);
      assert.ok(!r.output.includes('Pedro Páramo'), 'es Realismo, debe quedar fuera');
    });

    test('usa NOT LIKE para negar el patrón', () => {
      const r = E().ejecutar("SELECT titulo FROM libros WHERE titulo NOT LIKE 'El%'");
      assert.match(r.output, /\(4 filas\)/);
      assert.ok(!r.output.includes('El Hobbit'));
    });

    test('usa LIKE con comodines', () => {
      const r = E().ejecutar("SELECT titulo FROM libros WHERE titulo LIKE 'El%'");
      assert.match(r.output, /\(2 filas\)/);
      assert.ok(r.output.includes('El principito'));
      assert.ok(r.output.includes('El Hobbit'));
    });

    test('detecta NULL con IS NULL e IS NOT NULL', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero IS NOT NULL"
      );
      assert.match(r.output, /\(6 filas\)/);
    });

    test('una comparación con NULL no selecciona la fila', () => {
      // NULL = NULL es desconocido, no verdadero
      const r = E().ejecutar('SELECT titulo FROM libros WHERE NULL = NULL');
      assert.match(r.output, /\(0 filas\)/);
    });
  });

  describe('ORDER BY y LIMIT', () => {
    test('ordena ascendente por defecto', () => {
      const r = E().ejecutar('SELECT titulo FROM libros ORDER BY anio LIMIT 1');
      assert.match(r.output, /El Hobbit/, '1937 es el más antiguo');
    });

    test('ordena descendente con DESC', () => {
      const r = E().ejecutar('SELECT titulo FROM libros ORDER BY anio DESC LIMIT 1');
      assert.match(r.output, /La sombra del viento/, '2001 es el más reciente');
    });

    test('ordena por una columna que no está en el SELECT', () => {
      // Este caso rompía el motor: solo miraba las columnas de salida
      const r = E().ejecutar('SELECT titulo FROM libros ORDER BY anio DESC LIMIT 2');
      assert.match(r.output, /\(2 filas\)/);
      assert.ok(r.output.indexOf('La sombra del viento') < r.output.indexOf('Harry Potter'));
    });

    test('ordena por varios criterios', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros ORDER BY genero ASC, precio DESC"
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(6 filas\)/);
    });

    test('LIMIT corta las filas', () => {
      const r = E().ejecutar('SELECT titulo FROM socios LIMIT 2');
      assert.match(r.output, /\(2 filas\)/);
    });

    test('LIMIT 0 devuelve la tabla vacía', () => {
      const r = E().ejecutar('SELECT titulo FROM socios LIMIT 0');
      assert.match(r.output, /\(0 filas\)/);
    });
  });

  describe('Agregados', () => {
    test('COUNT(*) cuenta filas', () => {
      const r = E().ejecutar('SELECT COUNT(*) FROM libros');
      assert.match(r.output, /\n\s*6\n/);
    });

    test('COUNT con WHERE cuenta solo lo filtrado', () => {
      const r = E().ejecutar(
        "SELECT COUNT(*) FROM libros WHERE genero = 'Fantasía'"
      );
      assert.match(r.output, /\n\s*2\n/);
    });

    test('SUM, AVG, MIN y MAX dan valores correctos', () => {
      const suma = E().ejecutar('SELECT SUM(precio) AS s FROM libros');
      assert.match(suma.output, /88\.75/);   // 12.5+18+15.75+14.2+11.9+16.4

      const media = E().ejecutar('SELECT AVG(precio) AS a FROM libros');
      assert.match(media.output, /14\.792/);

      const min = E().ejecutar('SELECT MIN(anio) AS m FROM libros');
      assert.match(min.output, /1937/);

      const max = E().ejecutar('SELECT MAX(anio) AS m FROM libros');
      assert.match(max.output, /2001/);
    });

    test('AVG ignora los NULL', () => {
      const r = E().ejecutar('SELECT AVG(NULL) AS a FROM libros');
      assert.match(r.output, /NULL/);
    });
  });

  describe('GROUP BY y HAVING', () => {
    test('agrupa y cuenta', () => {
      const r = E().ejecutar(
        'SELECT genero, COUNT(*) AS total FROM libros GROUP BY genero'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(4 filas\)/);
      const datos = filas(r.output);
      assert.ok(datos.includes('Fantasía|2'), 'dos libros de fantasía');
      assert.ok(datos.includes('Realismo|2'), 'dos de realismo');
      assert.ok(datos.includes('Infantil|1'));
    });

    test('ordena por un alias del agregado', () => {
      const r = E().ejecutar(
        'SELECT genero, SUM(precio) AS total FROM libros GROUP BY genero ORDER BY total DESC'
      );
      assert.match(r.output, /Fantasía/);
      assert.ok(r.output.indexOf('Fantasía') < r.output.indexOf('Infantil'));
    });

    test('HAVING filtra grupos', () => {
      const r = E().ejecutar(
        'SELECT genero, COUNT(*) AS total FROM libros GROUP BY genero HAVING COUNT(*) > 1'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(2 filas\)/);
      assert.ok(!r.output.includes('Infantil'), 'Infantil tiene un solo libro');
    });

    test('HAVING también acepta el alias del agregado', () => {
      const r = E().ejecutar(
        'SELECT genero, COUNT(*) AS total FROM libros GROUP BY genero HAVING total > 1'
      );
      assert.match(r.output, /\(2 filas\)/);
    });
  });

  describe('JOIN', () => {
    test('INNER JOIN une por la clave foránea', () => {
      const r = E().ejecutar(
        'SELECT l.titulo, a.nombre FROM libros l JOIN autores a ON l.autor_id = a.id'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(6 filas\)/);
      assert.match(r.output, /El Hobbit\s+\| J\. R\. R\. Tolkien/);
    });

    test('el encabezado no lleva el prefijo de tabla', () => {
      const r = E().ejecutar(
        'SELECT l.titulo, a.nombre FROM libros l JOIN autores a ON l.autor_id = a.id'
      );
      assert.match(r.output, /^titulo\s+\| nombre/);
    });

    test('LEFT JOIN conserva las filas sin pareja', () => {
      // Tolkien (id 3) es el único con dos libros; el resto tienen uno
      const r = E().ejecutar(
        'SELECT a.nombre, COUNT(l.id) AS libros FROM autores a ' +
        'LEFT JOIN libros l ON l.autor_id = a.id GROUP BY a.nombre'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(5 filas\)/);
      assert.ok(filas(r.output).includes('J. R. R. Tolkien|2'));
    });

    test('INNER JOIN descarta las filas sin pareja', () => {
      const consulta = "SELECT a.nombre FROM autores a INNER JOIN libros l ON l.autor_id = a.id " +
        "WHERE l.titulo = 'El Hobbit'";
      const r = E().ejecutar(consulta);
      assert.match(r.output, /\(1 fila\)/);
      assert.match(r.output, /Tolkien/);
    });
  });

  describe('DISTINCT y funciones', () => {
    test('DISTINCT quita repetidos', () => {
      const r = E().ejecutar('SELECT DISTINCT genero FROM libros');
      assert.match(r.output, /\(4 filas\)/);
    });

    test('UPPER, LOWER y LENGTH', () => {
      assert.match(E().ejecutar("SELECT UPPER('hola') AS x FROM socios LIMIT 1").output, /HOLA/);
      assert.match(E().ejecutar("SELECT LOWER('HOLA') AS x FROM socios LIMIT 1").output, /hola/);
      // "El principito" son 13 caracteres
      assert.match(E().ejecutar('SELECT LENGTH(titulo) AS x FROM libros LIMIT 1').output, /13/);
    });

    test('expresiones aritméticas', () => {
      const r = E().ejecutar('SELECT precio * 2 AS x FROM libros WHERE id = 1');
      assert.match(r.output, /25/);
    });
  });

  describe('Modificar datos', () => {
    test('INSERT añade filas', () => {
      const base = E().crearBase();
      const r = E().ejecutar(
        "INSERT INTO socios (id, nombre, ciudad, socio_desde) VALUES (5, 'Nuria', 'Vigo', 2025)",
        { base }
      );
      assert.equal(r.error, false);
      assert.equal(base.socios.filas.length, 5);
      assert.match(E().ejecutar('SELECT nombre FROM socios WHERE id = 5', { base }).output, /Nuria/);
    });

    test('INSERT de varias filas a la vez', () => {
      const base = E().crearBase();
      E().ejecutar(
        "INSERT INTO socios (id, nombre) VALUES (5, 'Nuria'), (6, 'Pau')",
        { base }
      );
      assert.equal(base.socios.filas.length, 6);
    });

    test('UPDATE cambia solo lo que cumple el WHERE', () => {
      const base = E().crearBase();
      const r = E().ejecutar("UPDATE libros SET genero = 'Infantil' WHERE anio < 1950", { base });
      assert.equal(r.error, false);
      assert.equal(base.libros.filas.filter(f => f.genero === 'Infantil').length, 2);
      assert.equal(base.libros.filas.length, 6, 'no debe añadir filas');
    });

    test('DELETE borra solo lo que cumple el WHERE', () => {
      const base = E().crearBase();
      E().ejecutar("DELETE FROM libros WHERE genero = 'Realismo'", { base });
      assert.equal(base.libros.filas.length, 4);
    });

    test('CREATE TABLE crea una tabla vacía', () => {
      const base = E().crearBase();
      const r = E().ejecutar('CREATE TABLE notas (id, materia, nota)', { base });
      assert.equal(r.error, false);
      assert.ok(base.notas);
      assert.match(E().ejecutar('SELECT * FROM notas', { base }).output, /\(0 filas\)/);
    });

    test('crear dos veces la misma tabla da error', () => {
      const base = E().crearBase();
      E().ejecutar('CREATE TABLE notas (id)', { base });
      const r = E().ejecutar('CREATE TABLE notas (id)', { base });
      assert.equal(r.error, true);
      assert.match(r.output, /ya existe/);
    });
  });

  describe('Subconsultas', () => {
    test('una subconsulta escalar compara con su valor', () => {
      const r = E().ejecutar(
        'SELECT titulo FROM libros WHERE precio > (SELECT AVG(precio) FROM libros)'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(3 filas\)/);
    });

    test('subconsulta con MAX deja solo el más reciente', () => {
      const r = E().ejecutar(
        'SELECT titulo FROM libros WHERE anio = (SELECT MAX(anio) FROM libros)'
      );
      assert.match(r.output, /\(1 fila\)/);
      assert.match(r.output, /La sombra del viento/);
    });

    test('subconsulta con un id de otra tabla', () => {
      const r = E().ejecutar(
        'SELECT titulo FROM libros WHERE autor_id <> (SELECT id FROM autores WHERE nacio = 1892)'
      );
      // Tolkien escribió 2 de los 6, así que quedan 4
      assert.match(r.output, /\(4 filas\)/);
      assert.ok(!r.output.includes('El Hobbit'));
    });

    test('IN con subconsulta devuelve la lista de valores', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero IN (SELECT genero FROM libros WHERE precio > 16)"
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\(3 filas\)/);
    });

    test('NOT IN con subconsulta', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE autor_id NOT IN (SELECT id FROM autores WHERE pais = 'Colombia')"
      );
      assert.match(r.output, /\(5 filas\)/);
    });

    test('IN con una subconsulta vacía no selecciona nada', () => {
      const r = E().ejecutar(
        "SELECT titulo FROM libros WHERE genero IN (SELECT genero FROM libros WHERE anio < 1900)"
      );
      assert.match(r.output, /\(0 filas\)/);
    });
  });

  describe('Claves primarias', () => {
    test('una clave primaria no se puede repetir', () => {
      const base = E().crearBase();
      E().ejecutar('CREATE TABLE t (id INT PRIMARY KEY, texto TEXT)', { base });
      E().ejecutar("INSERT INTO t (id, texto) VALUES (1, 'a')", { base });
      const r = E().ejecutar("INSERT INTO t (id, texto) VALUES (1, 'b')", { base });
      assert.equal(r.error, true);
      assert.match(r.output, /clave duplicada/);
      assert.equal(base.t.filas.length, 1, 'no debe haberse guardado la segunda');
    });

    test('una clave primaria no puede quedar vacía', () => {
      const base = E().crearBase();
      E().ejecutar('CREATE TABLE t (id INT PRIMARY KEY, texto TEXT)', { base });
      const r = E().ejecutar("INSERT INTO t (id, texto) VALUES (NULL, 'a')", { base });
      assert.equal(r.error, true);
    });

    test('UPDATE no puede crear un id repetido', () => {
      const base = E().crearBase();
      E().ejecutar('CREATE TABLE t (id INT PRIMARY KEY, texto TEXT)', { base });
      E().ejecutar("INSERT INTO t (id, texto) VALUES (1, 'a'), (2, 'b')", { base });
      const r = E().ejecutar('UPDATE t SET id = 1 WHERE id = 2', { base });
      assert.equal(r.error, true);
    });
  });

  describe('Errores y avisos', () => {
    test('tabla inexistente', () => {
      const r = E().ejecutar('SELECT * FROM dragones');
      assert.equal(r.error, true);
      assert.match(r.output, /No existe la tabla "dragones"/);
    });

    test('avisa de las comillas dobles', () => {
      // Sin este aviso la consulta devuelve 0 filas y el alumno no sabe por qué
      const r = E().ejecutar('SELECT titulo FROM libros WHERE genero = "Fantasía"');
      assert.equal(r.error, true);
      assert.match(r.output, /comillas simples/);
    });

    test('comentarios con -- y con /* */ se ignoran', () => {
      const r = E().ejecutar(
        '-- un comentario\nSELECT titulo FROM libros LIMIT 1 /* otro */'
      );
      assert.equal(r.error, false);
      assert.match(r.output, /El principito/);
    });

    test('varias sentencias seguidas se ejecutan todas', () => {
      const base = E().crearBase();
      const r = E().ejecutar(
        "INSERT INTO socios (id, nombre) VALUES (5, 'Nuria'); SELECT COUNT(*) FROM socios",
        { base }
      );
      assert.equal(r.error, false);
      assert.match(r.output, /\n\s*5\n/);
    });

    test('consulta vacía', () => {
      assert.match(E().ejecutar('').output, /vacía/);
      assert.match(E().ejecutar('   ').output, /vacía/);
    });

    test('sentencia no soportada', () => {
      const r = E().ejecutar('DROP TABLE libros');
      assert.equal(r.error, true);
      assert.match(r.output, /no reconocida/);
    });
  });

  describe('Formato de salida', () => {
    test('el texto se alinea a la izquierda y los números a la derecha', () => {
      const r = E().ejecutar('SELECT titulo, anio FROM libros LIMIT 1');
      const lineas = r.output.split('\n');
      assert.ok(lineas[0].indexOf('titulo') < lineas[0].indexOf('anio'));
      // "1943" acaba en la misma columna que la cabecera "anio"
      const lineaFila = lineas[2];
      assert.ok(lineaFila.endsWith('1943'));
    });

    test('indica el número de filas', () => {
      assert.match(E().ejecutar('SELECT * FROM socios').output, /\(4 filas\)/);
      assert.match(E().ejecutar('SELECT * FROM socios LIMIT 1').output, /\(1 fila\)/);
      assert.match(E().ejecutar('SELECT * FROM socios LIMIT 0').output, /\(0 filas\)/);
    });
  });

  describe('Integración con el Engine', () => {
    test('runSql devuelve la salida de la consulta', async () => {
      const r = await window.Engine.runSql('SELECT COUNT(*) FROM libros');
      assert.equal(r.error, false);
      assert.match(r.output, /\(1 fila\)/);
    });

    test('runCode enruta sql al motor correcto', async () => {
      const r = await window.Engine.runCode('sql', 'SELECT titulo FROM libros LIMIT 1');
      assert.equal(r.error, false);
      assert.match(r.output, /El principito/);
      // No debe caer en Python
      assert.ok(!r.output.includes('SyntaxError'));
    });

    test('la base de ejemplo no se modifica entre llamadas', async () => {
      const uno = await window.Engine.runSql("DELETE FROM libros WHERE id = 1");
      assert.equal(uno.error, false);
      const dos = await window.Engine.runSql('SELECT COUNT(*) FROM libros');
      assert.match(dos.output, /\n\s*6\n/, 'la siguiente consulta ve los 6 libros');
    });
  });
});