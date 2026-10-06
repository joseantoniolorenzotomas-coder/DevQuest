// Tests del intérprete de Go (goengine.js)
//
// No hay Go en el navegador, así que cada expectativa se comprueba contra la
// semántica real de Go. Lo que más se aparta de los otros cursos está
// cubierto uno a uno: := contra =, el tipado estático que no convierte nada
// solo, la división entera que trunca, el switch sin fallthrough, el paso por
// valor de los structs y el error en lugar de las excepciones.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../goengine.js');
syncGlobals();

const E = () => global.window.GO_ENGINE;

/** Envuelve un cuerpo en el armazón mínimo de un programa Go. */
const prog = (cuerpo, extra = '') => [
  'package main',
  'import "fmt"',
  '',
  extra,
  '',
  'func main() {',
  cuerpo,
  '}'
].join('\n');

/** Ejecuta un cuerpo de main y devuelve las líneas escritas. */
function ejecutar(cuerpo, extra) {
  const r = E().ejecutar(prog(cuerpo, extra));
  assert.equal(r.error, false, 'la solución no debe dar error: ' + r.output);
  return r.output.replace(/\n$/, '').split('\n');
}

describe('Go: el programa y su salida', () => {
  test('un programa mínimo imprime su texto', () => {
    assert.deepEqual(ejecutar('fmt.Println("Hola, Go!")'), ['Hola, Go!']);
  });

  test('sin package ni import también funciona', () => {
    // El curso los enseña, pero el alumno a veces escribe solo el cuerpo
    const r = E().ejecutar('func main() { fmt.Println("Hola") }');
    assert.equal(r.output, 'Hola\n');
  });

  test('Println mete un espacio entre cada valor y salta de línea', () => {
    // Detalle de Go que en otros lenguajes no pasa
    assert.deepEqual(ejecutar('fmt.Println(1, 2, 3)'), ['1 2 3']);
    assert.deepEqual(ejecutar('fmt.Println("Hola", "Mundo")'), ['Hola Mundo']);
  });

  test('Print no mete espacios ni salta de línea', () => {
    // La salida de un ejercicio siempre acaba en salto de línea, pero lo que
    // importa aquí es que Print no mete el espacio que sí pone Println
    const r = E().ejecutar(prog('fmt.Print("a"); fmt.Print("b")'));
    assert.equal(r.output, 'ab\n');
    assert.equal(E().ejecutar(prog('fmt.Println("a", "b")')).output, 'a b\n');
  });

  test('los verbos de Printf', () => {
    assert.deepEqual(ejecutar('fmt.Printf("%d\\n", 42)'), ['42']);
    assert.deepEqual(ejecutar('fmt.Printf("%s\\n", "hola")'), ['hola']);
    assert.deepEqual(ejecutar('fmt.Printf("%v\\n", 42)'), ['42']);
    assert.deepEqual(ejecutar('fmt.Printf("%t\\n", true)'), ['true']);
    assert.deepEqual(ejecutar('fmt.Printf("%.2f\\n", 3.14159)'), ['3.14']);
    assert.deepEqual(ejecutar('fmt.Printf("%T\\n", 42)'), ['int']);
    assert.deepEqual(ejecutar('fmt.Printf("%T\\n", "hola")'), ['string']);
    assert.deepEqual(ejecutar('fmt.Printf("%.1f\\n", 2.55)'), ['2.5']);
  });

  test('%% escribe un % literal', () => {
    assert.deepEqual(ejecutar('fmt.Printf("100%%\\n")'), ['100%']);
  });

  test('los anchos alinean a la derecha por defecto', () => {
    assert.deepEqual(ejecutar('fmt.Printf("[%6s]\\n", "ab")'), ['[    ab]']);
    assert.deepEqual(ejecutar('fmt.Printf("[%-6s]\\n", "ab")'), ['[ab    ]']);
  });

  test('un programa que no imprime nada lo dice', () => {
    assert.match(E().ejecutar(prog('x := 1')).output, /no imprime nada/);
  });
});

describe('Go: variables y :=', () => {
  test(':= declara y asigna a la vez', () => {
    assert.deepEqual(ejecutar('edad := 30; fmt.Println(edad)'), ['30']);
  });

  test(':= dos veces seguidas es un error que explica el porqué', () => {
    // El error nº1 al escribir Go: := declara, = reasigna
    const r = E().ejecutar(prog('x := 1; x := 2'));
    assert.equal(r.error, true);
    assert.match(r.output, /ya está declarado/);
    assert.match(r.output, /usa = y no :=/, 'debe decir cuál es el correcto');
  });

  test('= reasigna sin declarar de nuevo', () => {
    assert.deepEqual(ejecutar('x := 1; x = 2; fmt.Println(x)'), ['2']);
  });

  test('el valor cero de cada tipo', () => {
    assert.deepEqual(ejecutar('var n int; fmt.Println(n)'), ['0']);
    assert.deepEqual(ejecutar('var n float64; fmt.Println(n)'), ['0']);
    assert.deepEqual(ejecutar('var s string; fmt.Printf("[%s]\\n", s)'), ['[]']);
    assert.deepEqual(ejecutar('var b bool; fmt.Println(b)'), ['false']);
  });

  test('a, b := 1, 2 declara las dos', () => {
    assert.deepEqual(ejecutar('a, b := 1, 2; fmt.Println(a, b)'), ['1 2']);
  });

  test('el intercambio a, b = b, a', () => {
    // Sin comas sería imposible: los dos lados se calculan antes de asignar
    assert.deepEqual(ejecutar('a, b := 1, 2; a, b = b, a; fmt.Println(a, b)'), ['2 1']);
  });

  test('una variable de un bucle es distinta en cada vuelta', () => {
    // Por eso x := dentro del bucle no da error en la segunda vuelta
    assert.deepEqual(ejecutar('for i := 0; i < 2; i++ { x := i * 10; fmt.Println(x) }'), ['0', '10']);
  });

  test('const guarda un valor fijo', () => {
    const r = E().ejecutar('package main\nimport "fmt"\n\nconst Pi = 3.14\n\nfunc main() {\n  fmt.Println(Pi * 2)\n}');
    assert.equal(r.output, '6.28\n');
  });

  test('una constante no se puede reasignar', () => {
    const r = E().ejecutar(prog('x := 1; x = 2; fmt.Println(x)'));
    assert.equal(r.error, false);
    // pero una variable normal sí, que es la diferencia
    assert.equal(r.output, '2\n');
  });
});

describe('Go: el tipado estático', () => {
  test('un float64 no vale donde se espera un int', () => {
    // Go no convierte nada solo: hay que decirlo con float64(x)
    const r = E().ejecutar(prog('var x int = 3.5; fmt.Println(x)'));
    assert.equal(r.error, true);
    assert.match(r.output, /no se puede usar un valor de tipo float64/);
    assert.match(r.output, /conviértelo/, 'debe decir cómo arreglarlo');
  });

  test('un string no se puede sumar con un número', () => {
    const r = E().ejecutar(prog('x := "5"; y := x + 1; fmt.Println(y)'));
    assert.equal(r.error, true);
    assert.match(r.output, /no se puede usar \+ entre string y int/);
  });

  test('el + solo pega dos textos', () => {
    assert.deepEqual(ejecutar('nombre := "Ana"; fmt.Println("Hola, " + nombre)'), ['Hola, Ana']);
  });

  test('convertir tipos a propósito', () => {
    assert.deepEqual(ejecutar('x := 7; y := float64(x) / 2; fmt.Println(y)'), ['3.5']);
    assert.deepEqual(ejecutar('x := 3.9; fmt.Println(int(x))'), ['3']);
    assert.deepEqual(ejecutar('fmt.Println(string(65))'), ['A']);
  });

  test('la división entre enteros TRUNCA, y no hacia arriba', () => {
    // Lo que más sorprende al venir de Python o JavaScript
    assert.deepEqual(ejecutar('fmt.Println(7 / 2)'), ['3']);
    assert.deepEqual(ejecutar('fmt.Println(7.0 / 2)'), ['3.5']);
    assert.deepEqual(ejecutar('fmt.Println(-7 / 2)'), ['-3']);
  });

  test('un float se escribe sin el .0', () => {
    // Go usa la representación más corta: 5.0 sale 5
    assert.deepEqual(ejecutar('var x float64 = 5; fmt.Println(x)'), ['5']);
    assert.deepEqual(ejecutar('fmt.Println(1.0 / 2.0)'), ['0.5']);
  });

  test('el módulo', () => {
    assert.deepEqual(ejecutar('fmt.Println(17 % 5)'), ['2']);
  });
});

describe('Go: condicionales', () => {
  test('if / else if / else', () => {
    const cuerpo = `
    n := 7
    if n >= 9 {
      fmt.Println("Sobresaliente")
    } else if n >= 5 {
      fmt.Println("Bien")
    } else {
      fmt.Println("Regular")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['Bien']);
  });

  test('el if con inicialización declara solo dentro', () => {
    // if v, ok := m["k"]; ok es el patrón idiomático de Go
    const cuerpo = `
    m := map[string]int{"a": 1}
    if v, ok := m["a"]; ok {
      fmt.Println(v)
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['1']);
  });

  test('el if con inicialización no deja la variable suelta', () => {
    const r = E().ejecutar(prog('m := map[string]int{"a": 1}\nif v, ok := m["a"]; ok {\n  fmt.Println(v)\n}\nfmt.Println(v)'));
    assert.equal(r.error, true);
    assert.match(r.output, /no está declarada/, 'el error debe decirlo claro');
  });
});

describe('Go: switch sin fallthrough', () => {
  test('solo se ejecuta el case que coincide', () => {
    const cuerpo = `
    d := 3
    switch d {
    case 1:
      fmt.Println("Lunes")
    case 3:
      fmt.Println("Miercoles")
    default:
      fmt.Println("Otro")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['Miercoles']);
  });

  test('NO hay fallthrough: un case no cae en el siguiente', () => {
    // La diferencia más importante con C, Java o JavaScript
    const cuerpo = `
    d := 1
    switch d {
    case 1:
      fmt.Println("uno")
    case 2:
      fmt.Println("dos")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['uno']);
  });

  test('varios valores en un mismo case', () => {
    const cuerpo = `
    d := 0
    switch d {
    case 1, 2, 3:
      fmt.Println("de dia")
    default:
      fmt.Println("de noche")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['de noche']);
  });

  test('switch sin expresión: compara lo que sea', () => {
    const cuerpo = `
    n := 12
    switch {
    case n > 10:
      fmt.Println("grande")
    default:
      fmt.Println("pequeno")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['grande']);
  });

  test('default se ejecuta si nada coincide', () => {
    const cuerpo = `
    switch 99 {
    case 1:
      fmt.Println("uno")
    default:
      fmt.Println("otro")
    }`;
    assert.deepEqual(ejecutar(cuerpo), ['otro']);
  });
});

describe('Go: los tres bucles', () => {
  test('for clásico con las tres partes', () => {
    assert.deepEqual(ejecutar('for i := 0; i < 4; i++ { fmt.Println(i) }'), ['0', '1', '2', '3']);
  });

  test('for con solo la condición', () => {
    assert.deepEqual(ejecutar('i := 1; for i <= 3 { fmt.Println(i); i++ }'), ['1', '2', '3']);
  });

  test('for sin condición, con break', () => {
    assert.deepEqual(
      ejecutar('i := 0; for { i++; if i > 3 { break }; fmt.Println(i) }'),
      ['1', '2', '3']
    );
  });

  test('continue salta a la siguiente vuelta', () => {
    assert.deepEqual(
      ejecutar('for i := 0; i < 5; i++ { if i == 2 { continue }; fmt.Println(i) }'),
      ['0', '1', '3', '4']
    );
  });

  test('for range sobre un slice da el índice y el valor', () => {
    assert.deepEqual(
      ejecutar('for i, v := range []int{10, 20, 30} { fmt.Println(i, v) }'),
      ['0 10', '1 20', '2 30']
    );
  });

  test('for range ignorando el índice', () => {
    assert.deepEqual(
      ejecutar('for _, v := range []string{"a", "b"} { fmt.Println(v) }'),
      ['a', 'b']
    );
  });

  test('for range sobre un mapa', () => {
    // El orden de un mapa no está garantizado en Go, así que el motor ordena
    // las claves para que un ejercicio dé siempre el mismo resultado
    assert.deepEqual(
      ejecutar('m := map[string]int{"b": 2, "a": 1}; for k, v := range m { fmt.Println(k, v) }'),
      ['a 1', 'b 2']
    );
  });

  test('el bucle infinito se detecta', () => {
    const r = E().ejecutar(prog('for { x := 1 }'));
    assert.equal(r.error, true);
    assert.match(r.output, /no termina/);
  });
});

describe('Go: funciones', () => {
  test('función con parámetros y retorno', () => {
    const r = E().ejecutar(prog('fmt.Println(sumar(3, 4))', 'func sumar(a, b int) int {\n  return a + b\n}'));
    assert.equal(r.output, '7\n');
  });

  test('a, b int son dos parámetros de tipo int', () => {
    const r = E().ejecutar(prog(
      'fmt.Println(sumar(3, 4))',
      'func sumar(a, b int) int { return a + b }'
    ));
    assert.equal(r.output, '7\n');
  });

  test('varios valores de retorno', () => {
    const r = E().ejecutar(prog(
      'q, r := divide(10, 3)\n  fmt.Println(q, r)',
      'func divide(a, b int) (int, int) {\n  return a / b, a % b\n}'
    ));
    assert.equal(r.output, '3 1\n');
  });

  test('los parámetros son copias: no se tocan fuera', () => {
    // Go pasa por valor, siempre. No hay referencias como en PHP
    const r = E().ejecutar(prog(
      'x := 5\n  subir(x)\n  fmt.Println(x)',
      'func subir(n int) { n = n + 1 }'
    ));
    assert.equal(r.output, '5\n');
  });

  test('defer se ejecuta al salir de la función', () => {
    const r = E().ejecutar(prog('saludar()', `
func saludar() {
  defer fmt.Println("adios")
  fmt.Println("hola")
}`));
    assert.equal(r.output, 'hola\nadios\n');
  });

  test('defer se ejecuta aunque haya return', () => {
    const r = E().ejecutar(prog('saludar()', `
func saludar() int {
  defer fmt.Println("se ejecuta igual")
  return 42
}`));
    assert.equal(r.output, 'se ejecuta igual\n');
  });

  test('los defer se ejecutan en orden inverso', () => {
    const r = E().ejecutar(prog('saludar()', `
func saludar() {
  defer fmt.Println("primero declarado, ultimo ejecutado")
  defer fmt.Println("ultimo declarado, primero ejecutado")
}`));
    assert.equal(r.output, 'ultimo declarado, primero ejecutado\nprimero declarado, ultimo ejecutado\n');
  });

  test('una función que no existe avisa de cómo se declara', () => {
    const r = E().ejecutar(prog('inventada()'));
    assert.equal(r.error, true);
    assert.match(r.output, /no está declarado/);
    assert.match(r.output, /func inventada/, 'debe decir cómo se escribe');
  });
});

describe('Go: errores en lugar de excepciones', () => {
  test('una función devuelve valor y error', () => {
    const r = E().ejecutar(prog(
      'v, err := dividir(10, 2)\n  fmt.Println(v, err)',
      'func dividir(a, b int) (int, error) {\n  if b == 0 {\n    return 0, errors.New("division por cero")\n  }\n  return a / b, nil\n}'
    ));
    assert.equal(r.output, '5 <nil>\n');
  });

  test('nil se escribe como <nil>', () => {
    assert.deepEqual(ejecutar('var e error; fmt.Println(e)'), ['<nil>']);
  });

  test('el error se comprueba con != nil', () => {
    const r = E().ejecutar(prog(
      'v, err := dividir(10, 0)\n  if err != nil {\n    fmt.Println("error:", err)\n  }\n  fmt.Println(v)',
      'func dividir(a, b int) (int, error) {\n  if b == 0 {\n    return 0, errors.New("no se puede dividir por cero")\n  }\n  return a / b, nil\n}'
    ));
    assert.equal(r.output, 'error: no se puede dividir por cero\n0\n');
  });
});

describe('Go: slices', () => {
  test('crear un slice literal', () => {
    assert.deepEqual(ejecutar('s := []int{1, 2, 3}; fmt.Println(s)'), ['[1 2 3]']);
  });

  test('len de un slice y de un texto', () => {
    assert.deepEqual(ejecutar('fmt.Println(len([]int{1, 2, 3}))'), ['3']);
    assert.deepEqual(ejecutar('fmt.Println(len("Hola"))'), ['4']);
  });

  test('append amplía el slice', () => {
    assert.deepEqual(ejecutar('s := []int{1}; s = append(s, 2, 3); fmt.Println(s)'), ['[1 2 3]']);
  });

  test('make crea un slice con los valores a cero', () => {
    assert.deepEqual(ejecutar('s := make([]int, 3); fmt.Println(s, len(s))'), ['[0 0 0] 3']);
  });

  test('indexar y asignar', () => {
    assert.deepEqual(ejecutar('s := []int{1, 2, 3}; s[1] = 99; fmt.Println(s)'), ['[1 99 3]']);
  });

  test('un sub-slice', () => {
    assert.deepEqual(ejecutar('s := []int{1, 2, 3, 4, 5}; fmt.Println(s[1:3])'), ['[2 3]']);
    assert.deepEqual(ejecutar('s := []int{1, 2, 3, 4, 5}; fmt.Println(s[:2])'), ['[1 2]']);
    assert.deepEqual(ejecutar('s := []int{1, 2, 3, 4, 5}; fmt.Println(s[3:])'), ['[4 5]']);
  });

  test('un índice fuera de rango avisa con los límites', () => {
    const r = E().ejecutar(prog('s := []int{1, 2}; fmt.Println(s[5])'));
    assert.equal(r.error, true);
    assert.match(r.output, /fuera de rango/);
    assert.match(r.output, /0 al 1/, 'debe decir hasta dónde llega');
  });

  test('el + entre slices los une', () => {
    assert.deepEqual(ejecutar('a := []int{1}; b := []int{2}; fmt.Println(a + b)'), ['[1 2]']);
  });
});

describe('Go: mapas', () => {
  test('literal de mapa', () => {
    assert.deepEqual(ejecutar('m := map[string]int{"a": 1, "b": 2}; fmt.Println(m["a"])'), ['1']);
  });

  test('leer una clave que no existe da el valor cero', () => {
    assert.deepEqual(ejecutar('m := map[string]int{}; fmt.Println(m["nada"])'), ['0']);
  });

  test('v, ok := m[k] dice si la clave estaba', () => {
    assert.deepEqual(ejecutar('m := map[string]int{"a": 1}; v, ok := m["a"]; fmt.Println(v, ok)'), ['1 true']);
    assert.deepEqual(ejecutar('m := map[string]int{}; v, ok := m["x"]; fmt.Println(v, ok)'), ['0 false']);
  });

  test('len y delete', () => {
    assert.deepEqual(ejecutar('m := map[string]int{"a": 1, "b": 2}; fmt.Println(len(m))'), ['2']);
    assert.deepEqual(ejecutar('m := map[string]int{"a": 1}; delete(m, "a"); fmt.Println(len(m))'), ['0']);
  });

  test('añadir una clave nueva', () => {
    assert.deepEqual(ejecutar('m := map[string]int{}; m["a"] = 1; fmt.Println(m["a"])'), ['1']);
  });

  test('make crea un mapa vacío', () => {
    assert.deepEqual(ejecutar('m := make(map[string]int); m["a"] = 1; fmt.Println(len(m))'), ['1']);
  });
});

describe('Go: structs y métodos', () => {
  test('crear un struct con campos', () => {
    const r = E().ejecutar(prog(
      'p := Punto{x: 3, y: 4}\n  fmt.Println(p.x, p.y)',
      'type Punto struct {\n  x int\n  y int\n}'
    ));
    assert.equal(r.output, '3 4\n');
  });

  test('un struct con el valor cero', () => {
    const r = E().ejecutar(prog(
      'var p Punto\n  fmt.Println(p.x)',
      'type Punto struct {\n  x int\n}'
    ));
    assert.equal(r.output, '0\n');
  });

  test('varios campos en una línea', () => {
    const r = E().ejecutar(prog(
      'r := Rect{base: 3, alto: 4}\n  fmt.Println(r.base, r.alto)',
      'type Rect struct {\n  base, alto int\n}'
    ));
    assert.equal(r.output, '3 4\n');
  });

  test('método con receptor de valor', () => {
    const r = E().ejecutar(prog(
      'r := Rect{base: 3, alto: 4}\n  fmt.Println(r.Area())',
      'type Rect struct {\n  base, alto int\n}\n\nfunc (r Rect) Area() int {\n  return r.base * r.alto\n}'
    ));
    assert.equal(r.output, '12\n');
  });

  test('método con receptor de puntero sí modifica', () => {
    // Con receptor de valor Go recibe una copia y no puede cambiar el struct
    const r = E().ejecutar(prog(
      'c := &Contador{}\n  c.Suma()\n  c.Suma()\n  fmt.Println(c.n)',
      'type Contador struct {\n  n int\n}\n\nfunc (c *Contador) Suma() {\n  c.n++\n}'
    ));
    assert.equal(r.output, '2\n');
  });

  test('un método de puntero se puede llamar sobre una variable', () => {
    // Go toma la dirección automáticamente, así que r.Area() funciona aunque
    // Area tenga receptor puntero. Con un &r también, y da lo mismo.
    const extra = 'type Rect struct {\n  base, alto int\n}\n\nfunc (r *Rect) Area() int {\n  return r.base * r.alto\n}';
    assert.equal(
      E().ejecutar(prog('r := Rect{base: 3, alto: 4}\n  fmt.Println(r.Area())', extra)).output,
      '12\n'
    );
    assert.equal(
      E().ejecutar(prog('r := &Rect{base: 3, alto: 4}\n  fmt.Println(r.Area())', extra)).output,
      '12\n'
    );
  });

  test('un campo inexistente dice cuáles hay', () => {
    const r = E().ejecutar(prog(
      'p := Punto{x: 1}\n  fmt.Println(p.z)',
      'type Punto struct {\n  x int\n  y int\n}'
    ));
    assert.equal(r.error, true);
    assert.match(r.output, /no tiene ningún campo "z"/);
    assert.match(r.output, /tiene: x, y/, 'debe listar los que sí existen');
  });

  test('punteros: & toma la dirección y * la lee', () => {
    assert.deepEqual(ejecutar('x := 5; p := &x; *p = 10; fmt.Println(x)'), ['10']);
  });

  test('un puntero nil avisa al desreferenciarlo', () => {
    const r = E().ejecutar(prog('var p *int; fmt.Println(*p)'));
    assert.equal(r.error, true);
    assert.match(r.output, /puntero nil/);
  });
});

describe('Go: errores y límites', () => {
  test('división por cero avisa', () => {
    const r = E().ejecutar(prog('fmt.Println(1 / 0)'));
    assert.equal(r.error, true);
    assert.match(r.output, /división por cero/);
  });

  test('las goroutines no se ejecutan, y se dice por qué', () => {
    // El temario las explica como concepto sin pedir código que dependa de ellas
    const r = E().ejecutar(prog('go saludar()', 'func saludar() {}'));
    assert.equal(r.error, true);
    assert.match(r.output, /goroutines/);
  });

  test('el motor nunca revienta con código basura', () => {
    ['', 'func', 'func main(', 'func main() {', '{', '}', '(((', 'x := ',
      'for', 'switch {', 'if {', 'var', 'fmt.Println(', 'package main'
    ].forEach(src => {
      const r = E().ejecutar(src);
      assert.equal(typeof r.output, 'string', 'debe devolver salida para: ' + src);
      assert.equal(typeof r.error, 'boolean');
    });
  });

  test('los comentarios se ignoran', () => {
    assert.deepEqual(ejecutar('// uno\n  /* dos */\n  fmt.Println("ok")'), ['ok']);
  });

  test('cada ejecución arranca de cero', () => {
    assert.equal(E().ejecutar(prog('x := 1; fmt.Println(x)')).output, '1\n');
    assert.equal(E().ejecutar(prog('fmt.Println("otra")')).output, 'otra\n');
  });
});

describe('Go: integración con el Engine', () => {
  test('runGo devuelve la salida del programa', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runGo('func main() { fmt.Println("Hola") }');
    assert.equal(r.error, false);
    assert.equal(r.output, 'Hola\n');
  });

  test('runCode enruta go al motor correcto', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCode('go', 'func main() { fmt.Println(1 + 1) }');
    assert.equal(r.error, false);
    assert.equal(r.output, '2\n');
  });
});