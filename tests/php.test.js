// Tests del intérprete de PHP (phpengine.js)
//
// No hay PHP en el navegador, así que cada expectativa está comprobada contra
// la semántica real de PHP. Lo que más se aparta de otros lenguajes son las
// conversiones: el + convierte a número y el punto concatena, y los bool se
// imprimen como 1 o como nada. Todo eso está cubierto uno a uno.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../phpengine.js');
syncGlobals();

const E = () => global.window.PHP_ENGINE;

/** Envuelve un cuerpo en el armazón mínimo de un fichero PHP. */
const prog = (cuerpo) => '<?php\n' + cuerpo;

/** Ejecuta un cuerpo y devuelve las líneas escritas. */
function ejecutar(cuerpo) {
  const r = E().ejecutar(prog(cuerpo));
  assert.equal(r.error, false, 'la solución no debe dar error: ' + r.output);
  return r.output.replace(/\n$/, '').split('\n');
}

describe('PHP: echo y el formato', () => {
  test('echo escribe un texto', () => {
    assert.deepEqual(ejecutar('echo "Hola, PHP!";'), ['Hola, PHP!']);
  });

  test('sin punto y coma también funciona', () => {
    // En PHP el ; es opcional
    assert.deepEqual(ejecutar('echo "uno"'), ['uno']);
  });

  test('echo false NO imprime nada, solo true da 1', () => {
    // Uno de los detalles que más confunde: false es cadena vacía
    assert.equal(E().ejecutar(prog('echo false;')).output, '\n');
    assert.equal(E().ejecutar(prog('echo true;')).output, '1\n');
  });

  test('un array con echo sale como la palabra Array', () => {
    assert.deepEqual(ejecutar('$a = [1, 2]; echo $a;'), ['Array']);
  });

  test('un float sale sin ceros de más', () => {
    assert.deepEqual(ejecutar('echo 5.0;'), ['5']);
    assert.deepEqual(ejecutar('echo 0.1 + 0.2;'), ['0.3']);
    assert.deepEqual(ejecutar('echo 1 / 3;'), ['0.33333333333333']);
  });

  test('echo admite varios valores separados por comas', () => {
    assert.deepEqual(ejecutar('echo "a", "b", "c";'), ['abc']);
  });

  test('print también imprime', () => {
    assert.deepEqual(ejecutar('print "hola";'), ['hola']);
  });

  test('un programa que no imprime nada lo dice', () => {
    assert.match(E().ejecutar(prog('$x = 1;')).output, /no imprime nada/);
  });
});

describe('PHP: var_dump', () => {
  test('muestra el tipo de cada valor', () => {
    // Es la herramienta para ver de verdad qué hay dentro de una variable
    assert.deepEqual(ejecutar('var_dump(5);'), ['int(5)']);
    assert.deepEqual(ejecutar('var_dump(1.5);'), ['float(1.5)']);
    assert.deepEqual(ejecutar('var_dump("hola");'), ['string(4) "hola"']);
    assert.deepEqual(ejecutar('var_dump(true);'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(null);'), ['NULL']);
  });

  test('un array se ve con su contenido', () => {
    assert.deepEqual(ejecutar('var_dump(["a", "b"]);'), [
      'array(2) {',
      '  [0]=>',
      '  string(1) "a"',
      '  [1]=>',
      '  string(1) "b"',
      '}'
    ]);
  });
});

describe('PHP: variables', () => {
  test('las variables llevan $ delante', () => {
    assert.deepEqual(ejecutar('$nombre = "Ana"; echo $nombre;'), ['Ana']);
  });

  test('una variable sin valor no es null: no existe', () => {
    // Comportamiento propio de PHP, muy distinto de otros lenguajes
    assert.deepEqual(ejecutar('var_dump(isset($noExiste));'), ['bool(false)']);
    assert.deepEqual(ejecutar('$noExiste = 1; var_dump(isset($noExiste));'), ['bool(true)']);
  });

  test('una variable sin crear se imprime como cadena vacía', () => {
    assert.deepEqual(ejecutar('$noExiste = 1; echo $noExiste;'), ['1']);
  });

  test('interpolación de variables en comillas dobles', () => {
    assert.deepEqual(ejecutar('$n = "Ana"; echo "Hola $n!";'), ['Hola Ana!']);
  });

  test('las comillas simples no interpolan', () => {
    assert.deepEqual(ejecutar('$n = "Ana"; echo \'Hola $n\';'), ['Hola $n']);
  });

  test('se puede reasignar con otro tipo', () => {
    // PHP es de tipado dinámico
    assert.deepEqual(ejecutar('$x = 5; $x = "texto"; echo $x;'), ['texto']);
  });

  test('el += y el .= acumulan', () => {
    assert.deepEqual(ejecutar('$n = 10; $n += 5; echo $n;'), ['15']);
    assert.deepEqual(ejecutar('$t = "a"; $t .= "b"; echo $t;'), ['ab']);
  });

  test('++ y --', () => {
    assert.deepEqual(ejecutar('$i = 5; echo $i++;'), ['5']);
    assert.deepEqual(ejecutar('$i = 5; echo $i; $i++; echo $i;'), ['56']);
  });
});

describe('PHP: operadores', () => {
  test('el punto concatena', () => {
    assert.deepEqual(ejecutar('echo "a" . "b" . 1;'), ['ab1']);
    assert.deepEqual(ejecutar('echo "Resultado: " . (10 + 5);'), ['Resultado: 15']);
  });

  test('el + convierte a número', () => {
    // Lo más importante de PHP: "5" + 3 da 8, no "53"
    assert.deepEqual(ejecutar('echo "5" + 3;'), ['8']);
    assert.deepEqual(ejecutar('echo "10" - 4;'), ['6']);
  });

  test('la división da decimal salvo que sea exacta', () => {
    assert.deepEqual(ejecutar('echo 7 / 2;'), ['3.5']);
    assert.deepEqual(ejecutar('echo 6 / 2;'), ['3']);
  });

  test('el módulo y la potencia', () => {
    assert.deepEqual(ejecutar('echo 17 % 5;'), ['2']);
    assert.deepEqual(ejecutar('echo 2 ** 10;'), ['1024']);
  });

  test('comparar == convierte tipos, === no', () => {
    assert.deepEqual(ejecutar('var_dump("5" == 5);'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump("5" === 5);'), ['bool(false)']);
  });

  test('operadores lógicos y de comparación', () => {
    assert.deepEqual(ejecutar('var_dump(true && false);'), ['bool(false)']);
    assert.deepEqual(ejecutar('var_dump(true || false);'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(!true);'), ['bool(false)']);
    assert.deepEqual(ejecutar('var_dump(5 > 3);'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(5 <> 3);'), ['bool(true)']);
  });

  test('el operador ternario', () => {
    assert.deepEqual(ejecutar('$n = 10; echo $n % 2 == 0 ? "par" : "impar";'), ['par']);
  });

  test('comparar con == usa el valor de la cadena vacía', () => {
    // empty("") y false valen lo mismo para PHP
    assert.deepEqual(ejecutar('var_dump("" == false);'), ['bool(true)']);
  });
});

describe('PHP: condicionales', () => {
  test('if / else', () => {
    assert.deepEqual(ejecutar('$n = 7; if ($n >= 5) { echo "Aprobado"; } else { echo "Suspenso"; }'), ['Aprobado']);
    assert.deepEqual(ejecutar('$n = 3; if ($n >= 5) { echo "Aprobado"; } else { echo "Suspenso"; }'), ['Suspenso']);
  });

  test('elseif encadena condiciones', () => {
    const cuerpo = `
        $n = 7;
        if ($n >= 9) { echo "Sobresaliente"; }
        elseif ($n >= 5) { echo "Bien"; }
        else { echo "Regular"; }`;
    assert.deepEqual(ejecutar(cuerpo), ['Bien']);
  });

  test('switch con break', () => {
    const cuerpo = `
        $d = 3;
        switch ($d) {
            case 1: echo "Lunes"; break;
            case 3: echo "Miercoles"; break;
            default: echo "Otro";
        }`;
    assert.deepEqual(ejecutar(cuerpo), ['Miercoles']);
  });
});

describe('PHP: bucles', () => {
  test('for clásico', () => {
    assert.deepEqual(ejecutar('for ($i = 1; $i <= 3; $i++) { echo $i; }'), ['123']);
  });

  test('while', () => {
    assert.deepEqual(ejecutar('$i = 1; while ($i <= 3) { echo $i; $i++; }'), ['123']);
  });

  test('foreach sobre un array numerado', () => {
    assert.deepEqual(ejecutar('foreach ([10, 20, 30] as $x) { echo $x; }'), ['102030']);
  });

  test('foreach con clave y valor', () => {
    assert.deepEqual(
      ejecutar('foreach (["a" => 1, "b" => 2] as $k => $v) { echo $k . $v; }'),
      ['a1b2']
    );
  });

  test('break y continue', () => {
    assert.deepEqual(
      ejecutar('for ($i = 1; $i <= 4; $i++) { if ($i == 2) continue; echo $i; }'),
      ['134']
    );
  });

  test('el bucle infinito se detecta', () => {
    const r = E().ejecutar(prog('while (true) { $x = 1; }'));
    assert.equal(r.error, true);
    assert.match(r.output, /no termina/);
  });
});

describe('PHP: arrays', () => {
  test('array con corchetes', () => {
    assert.deepEqual(ejecutar('$a = [10, 20, 30]; echo $a[0] . $a[2];'), ['1030']);
  });

  test('array() es la forma antigua y sigue valiendo', () => {
    assert.deepEqual(ejecutar('$a = array(10, 20); echo $a[1];'), ['20']);
  });

  test('array con claves =>', () => {
    assert.deepEqual(
      ejecutar('$p = ["nombre" => "Ana", "edad" => 30]; echo $p["nombre"] . " " . $p["edad"];'),
      ['Ana 30']
    );
  });

  test('count', () => {
    assert.deepEqual(ejecutar('echo count([1, 2, 3]);'), ['3']);
    assert.deepEqual(ejecutar('echo count(["a" => 1, "b" => 2]);'), ['2']);
  });

  test('asignar a una posición nueva amplía el array', () => {
    assert.deepEqual(ejecutar('$a = []; $a[] = "uno"; $a[] = "dos"; echo count($a) . $a[1];'), ['2dos']);
  });

  test('leer una clave que no existe avisa y da null', () => {
    const r = E().ejecutar(prog('$a = [1]; var_dump($a[5]);'));
    assert.equal(r.error, false);
    assert.match(r.output, /Warning: Undefined array key 5/);
    assert.match(r.output, /NULL/);
  });

  test('array_sum e in_array', () => {
    assert.deepEqual(ejecutar('echo array_sum([5, 10, 15]);'), ['30']);
    assert.deepEqual(ejecutar('var_dump(in_array(10, [5, 10]));'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(in_array(7, [5, 10]));'), ['bool(false)']);
  });

  test('array_keys y array_values', () => {
    assert.deepEqual(ejecutar('echo implode(",", array_keys(["a" => 1, "b" => 2]));'), ['a,b']);
    assert.deepEqual(ejecutar('echo implode(",", array_values(["a" => 1, "b" => 2]));'), ['1,2']);
  });

  test('implode y explode', () => {
    assert.deepEqual(ejecutar('echo implode(", ", ["a", "b"]);'), ['a, b']);
    assert.deepEqual(ejecutar('$p = explode("-", "a-b-c"); echo count($p) . $p[1];'), ['3b']);
  });
});

describe('PHP: funciones', () => {
  test('función con retorno', () => {
    const r = E().ejecutar(prog('function sumar($a, $b) { return $a + $b; } echo sumar(3, 4);'));
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, '7\n');
  });

  test('una función por valor NO cambia la variable original', () => {
    const r = E().ejecutar(prog('function subir($n) { $n = $n + 1; } $x = 5; subir($x); echo $x;'));
    assert.equal(r.output, '5\n');
  });

  test('una función por referencia SÍ cambia la variable', () => {
    // La diferencia entre &n y n, que es el corazón de PHP
    const r = E().ejecutar(prog('function subir(&$n) { $n = $n + 1; } $x = 5; subir($x); echo $x;'));
    assert.equal(r.output, '6\n');
  });

  test('intercambiar dos valores con referencias', () => {
    const r = E().ejecutar(prog(
      'function swap(&$a, &$b) { $t = $a; $a = $b; $b = $t; } $x = 1; $y = 2; swap($x, $y); echo $x . $y;'
    ));
    assert.equal(r.output, '21\n');
  });

  test('los valores por defecto', () => {
    const r = E().ejecutar(prog('function saluda($n = "Anonimo") { echo "Hola $n"; } saluda(); saluda("Ana");'));
    assert.equal(r.output, 'Hola AnonimoHola Ana\n');
  });

  test('return corta la función', () => {
    const r = E().ejecutar(prog(
      'function positivo($n) { if ($n < 0) { return 0; } return $n * 2; } echo positivo(-5) . positivo(5);'
    ));
    assert.equal(r.output, '010\n');
  });

  test('foreach con & modifica el array original', () => {
    const r = E().ejecutar(prog(
      '$n = [1, 2, 3]; foreach ($n as &$x) { $x = $x * 10; } echo implode(",", $n);'
    ));
    assert.equal(r.output, '10,20,30\n');
  });
});

describe('PHP: biblioteca de texto', () => {
  test('strlen y strtoupper', () => {
    assert.deepEqual(ejecutar('echo strlen("Hola");'), ['4']);
    assert.deepEqual(ejecutar('echo strtoupper("hola");'), ['HOLA']);
    assert.deepEqual(ejecutar('echo strtolower("HOLA");'), ['hola']);
  });

  test('substr y strpos', () => {
    assert.deepEqual(ejecutar('echo substr("Hola Mundo", 0, 4);'), ['Hola']);
    assert.deepEqual(ejecutar('echo substr("Hola Mundo", 5);'), ['Mundo']);
    assert.deepEqual(ejecutar('echo strpos("Hola Mundo", "Mundo");'), ['5']);
  });

  test('str_replace cambia todas las apariciones', () => {
    assert.deepEqual(ejecutar('echo str_replace("-", "+", "a-b-c");'), ['a+b+c']);
  });

  test('trim y ucfirst', () => {
    assert.deepEqual(ejecutar('echo "[" . trim("  hola  ") . "]";'), ['[hola]']);
    assert.deepEqual(ejecutar('echo ucfirst("hola");'), ['Hola']);
  });

  test('number_format', () => {
    assert.deepEqual(ejecutar('echo number_format(1234.5, 2);'), ['1,234.50']);
  });
});

describe('PHP: isset y empty', () => {
  test('isset dice si está definido', () => {
    assert.deepEqual(ejecutar('$a = 1; var_dump(isset($a));'), ['bool(true)']);
    assert.deepEqual(ejecutar('$a = null; var_dump(isset($a));'), ['bool(false)']);
    assert.deepEqual(ejecutar('var_dump(isset($nunca));'), ['bool(false)']);
  });

  test('empty dice si está vacío', () => {
    assert.deepEqual(ejecutar('var_dump(empty([]));'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(empty(""));'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(empty(""));'), ['bool(true)']);
    assert.deepEqual(ejecutar('var_dump(empty([1]));'), ['bool(false)']);
    assert.deepEqual(ejecutar('var_dump(empty(0));'), ['bool(true)']);
  });
});

describe('PHP: errores', () => {
  test('una función inexistente lista las que sí hay', () => {
    const r = E().ejecutar(prog('inventada();'));
    assert.equal(r.error, true);
    assert.match(r.output, /no existe/);
    assert.match(r.output, /count/, 'debe sugerir las funciones disponibles');
  });

  test('división por cero avisa', () => {
    const r = E().ejecutar(prog('echo 1 / 0;'));
    assert.equal(r.error, true);
    assert.match(r.output, /división por cero/);
  });

  test('leer un índice de algo que no es array avisa', () => {
    const r = E().ejecutar(prog('$n = 5; echo $n[0];'));
    assert.equal(r.error, true);
  });

  test('las clases no entran en este curso y se avisa', () => {
    const r = E().ejecutar(prog('class Libro {} $l = new Libro();'));
    assert.equal(r.error, true);
  });

  test('el motor nunca revienta con código basura', () => {
    ['', '{', '}', '(((', '$x = ;', 'echo ;', '<?php', 'foreach ($a) {}', 'if {}']
      .forEach(src => {
        const r = E().ejecutar(src);
        assert.equal(typeof r.output, 'string', 'debe devolver salida para: ' + src);
        assert.equal(typeof r.error, 'boolean');
      });
  });

  test('los comentarios se ignoran', () => {
    assert.deepEqual(ejecutar('// uno\n# dos\n/* tres */ echo "ok";'), ['ok']);
  });

  test('cada ejecución arranca de cero', () => {
    assert.equal(E().ejecutar(prog('$x = 5; echo $x;')).output, '5\n');
    assert.equal(E().ejecutar(prog('echo "otra";')).output, 'otra\n');
  });
});

describe('PHP: integración con el Engine', () => {
  test('runPhp devuelve la salida del programa', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runPhp('echo "Hola";');
    assert.equal(r.error, false);
    assert.equal(r.output, 'Hola\n');
  });

  test('runCode enruta php al motor correcto', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCode('php', 'echo 1 + 1;');
    assert.equal(r.error, false);
    assert.equal(r.output, '2\n');
  });
});