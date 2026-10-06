// Tests del verificador de TypeScript (tsengine.js)
//
// TypeScript no tiene intérprete: el motor comprueba los tipos y quita las
// anotaciones para ejecutar el JavaScript que queda. Aquí se comprueban las dos
// mitades, que es donde está lo importante:
//
//   · los ERRORES que debe encontrar (sin ellos el curso no enseña nada)
//   · que el JavaScript que sale sea VÁLIDO, porque si el recorte falla el
//     alumno ve un error de sintaxis que no ha escrito
//
// Lo que más se aparta de los otros cursos: los tipos no se convierten solos,
// los objetos necesitan la forma exacta, un campo que no existe es error, y
// lo que no se sabe no es error (para no dar avisos falsos).
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../tsengine.js');
syncGlobals();

const E = () => global.window.TS_ENGINE;

/** Ejecuta y devuelve { salida, error }. */
function correr(src) {
  return E().ejecutar(src);
}

/** El JavaScript que queda tras quitar las anotaciones. */
function aJs(src) {
  const A = E().Analizador;
  return E().recortar(src, new A(E().tokenizar(src)).analizar());
}

/** Los mensajes de error de una ejecución. */
function errores(src) {
  const r = E().ejecutar(src);
  return r.output;
}

// ════════════════════════════════════════════════
// RECORTE: lo que sale tiene que ser JavaScript válido
// ════════════════════════════════════════════════

describe('TypeScript: quitar las anotaciones', () => {
  test('una anotación de variable desaparece', () => {
    assert.equal(aJs('const edad: number = 5;'), 'const edad = 5;');
    assert.equal(aJs('let s: string;'), 'let s;');
  });

  test('una anotación de array', () => {
    assert.equal(aJs('const nums: number[] = [1, 2];'), 'const nums = [1, 2];');
  });

  test('una anotación de unión', () => {
    assert.equal(aJs('const e: string | number = 1;'), 'const e = 1;');
  });

  test('los parámetros y el retorno de una función', () => {
    assert.equal(
      aJs('function sumar(a: number, b: number): number { return a + b; }'),
      'function sumar(a, b) { return a + b; }'
    );
  });

  test('una interface desaparece entera', () => {
    const js = aJs('interface Persona { nombre: string; edad: number }\nconst p = 1;');
    assert.ok(!js.includes('interface'), 'no debe quedar la interface');
    assert.ok(!js.includes('nombre'), 'no debe quedar ningún tipo');
    assert.ok(js.includes('const p = 1;'), 'el resto del código se conserva');
  });

  test('un alias de tipo desaparece entero', () => {
    const js = aJs('type Estado = "a" | "b";\nconst e = 1;');
    assert.ok(!js.includes('type Estado'));
    assert.ok(js.includes('const e = 1;'));
  });

  test('una clase sin tipos dentro', () => {
    assert.equal(
      aJs('class Punto {\n  x: number = 0;\n  constructor(x: number) { this.x = x; }\n  ver(): number { return this.x; }\n}'),
      'class Punto {\n  x = 0;\n  constructor(x) { this.x = x; }\n  ver() { return this.x; }\n}'
    );
  });

  test('una función flecha con tipos', () => {
    assert.equal(
      aJs('const doble = (n: number): number => n * 2;'),
      'const doble = (n) => n * 2;'
    );
  });

  test('un enum se convierte en el objeto que genera el compilador', () => {
    // No es una copia: el enum no existe en JavaScript y hay que crearlo
    const js = aJs('enum Color { Rojo, Verde }');
    assert.ok(!js.includes('enum'), 'la palabra enum no debe quedar');
    assert.ok(js.includes('Color'), 'debe quedar el objeto');
  });

  test('una llamada normal NO se confunde con una flecha', () => {
    // El error sería tratar (1+2) como una lista de parámetros tipados
    assert.equal(correr('console.log((1 + 2).toString());').output, '3\n');
    assert.equal(correr('const n = 5;\nconsole.log(n.toString());').output, '5\n');
  });

  test('los modificadores y readonly desaparecen', () => {
    const js = aJs('class C {\n  private x: number = 1;\n  readonly y: string = "a";\n}');
    assert.ok(!js.includes('private'), 'private no debe quedar');
    assert.ok(!js.includes('readonly'), 'readonly no debe quedar');
  });
});

// ════════════════════════════════════════════════
// ERRORES: es lo que el curso enseña
// ════════════════════════════════════════════════

describe('TypeScript: encuentra los errores', () => {
  test('un texto donde se espera un número', () => {
    const msg = errores('const edad: number = "treinta";');
    assert.match(msg, /no es asignable/);
    assert.match(msg, /number/, 'el mensaje debe decir el tipo que se esperaba');
  });

  test('un número donde se espera un texto', () => {
    assert.match(errores('const nombre: string = 42;'), /no es asignable/);
  });

  test('devuelve el mensaje tal como lo escribe el compilador', () => {
    // El enunciado enseña este texto, así que tiene que ser el de verdad
    const msg = errores('const edad: number = "treinta";');
    assert.ok(msg.includes("El tipo '\"treinta\"' no es asignable al tipo 'number'."),
      'debe usar el formato del compilador real, no una versión propia');
  });

  test('un array del tipo equivocado', () => {
    assert.match(errores('const nums: number[] = ["a", "b"];'), /no es asignable/);
  });

  test('un objeto al que le falta un campo', () => {
    const msg = errores('interface Persona { nombre: string; edad: number }\nconst p: Persona = { nombre: "Ana" };');
    assert.match(msg, /no es asignable/);
  });

  test('un objeto con un campo de más', () => {
    // TypeScript es structural: un campo de más no se considera error
    const r = correr('interface Persona { nombre: string }\nconst p: Persona = { nombre: "Ana", edad: 3 };\nconsole.log(p.nombre);');
    assert.equal(r.error, false, 'un campo de más no es error, es structural typing');
  });

  test('un campo que no existe en el tipo', () => {
    const msg = errores('interface Persona { nombre: string }\nconst p: Persona = { nombre: "Ana" };\nconsole.log(p.apellido);');
    assert.match(msg, /no existe/);
    assert.match(msg, /Hay:/, 'el mensaje debe decir qué campos sí hay');
  });

  test('un argumento del tipo que no es', () => {
    const msg = errores('function saludar(nombre: string): void { console.log(nombre); }\nsaludar(5);');
    assert.match(msg, /no es asignable/);
  });

  test('devolver algo que no encaja con lo declarado', () => {
    const msg = errores('function DameEdad(): number { return "treinta"; }');
    assert.match(msg, /no es asignable/);
  });

  test('un valor de una unión que no está en la unión', () => {
    const msg = errores('type Estado = "pendiente" | "listo";\nconst e: Estado = "cancelado";');
    assert.match(msg, /no es asignable/);
  });

  test('un alias que apunta a otro tipo', () => {
    // Si el alias no se resolviera, la comprobación se saltaría entera
    const msg = errores('type Edad = number;\nconst e: Edad = "treinta";');
    assert.match(msg, /no es asignable/);
  });

  test('comparar cosas que no se pueden comparar', () => {
    // En TypeScript comparar un número con un texto es un error
    assert.match(errores('const a: number = 1;\nconst b: string = "x";\nconst c = a < b;'), /No se pueden comparar/);
  });

  test('una función void que devuelve un valor', () => {
    assert.match(
      errores('function avisar(): void { return 5; }'),
      /void/
    );
  });

  test('una función que promete un tipo y no devuelve nada', () => {
    // Con la redacción del compilador de verdad, porque el enunciado la enseña
    assert.match(
      errores('function dame(): number { }'),
      /Una función cuyo tipo de retorno declarado es 'number' debe devolver un valor/
    );
  });

  test('se pueden tener varios errores a la vez', () => {
    const msg = errores('const a: number = "x";\nconst b: string = 5;');
    assert.match(msg, /Errores de tipos \(2\)/, 'debe contarlos');
  });

  test('cuando hay un error no se ejecuta nada', () => {
    // Es justo lo que aporta TypeScript: el fallo se ve antes de correr
    const r = correr('const edad: number = "treinta";\nconsole.log("esto no sale");');
    assert.equal(r.error, true);
    assert.ok(!r.output.includes('esto no sale'), 'no debe ejecutar el programa');
  });
});

// ════════════════════════════════════════════════
// LO QUE NO DEBE DAR FALSA ALARMA
// ════════════════════════════════════════════════

describe('TypeScript: no inventa errores', () => {
  test('un tipo sin anotar se deduce solo', () => {
    assert.equal(correr('const n = 5;\nconsole.log(n + 1);').output, '6\n');
  });

  test('any y unknown dejan pasar cualquier cosa', () => {
    assert.equal(correr('const a: any = 5;\nconsole.log(a);').error, false);
    assert.equal(correr('const a: unknown = 5;\nconsole.log(typeof a);').error, false);
  });

  test('un literal es asignable a su tipo', () => {
    assert.equal(correr('const n: number = 5;\nconsole.log(n);').error, false);
    assert.equal(correr('const s: string = "a";\nconsole.log(s);').error, false);
  });

  test('null y undefined solo encajan si se admiten', () => {
    assert.equal(correr('const n: number = null;').error, true);
    assert.equal(correr('const s: string | null = null;\nconsole.log(s === null);').error, false);
  });

  test('lo que no se reconoce se queda en any', () => {
    // Math.floor existe pero el motor no conoce su firma: no debe inventarse
    // un error. Es preferible callar que avisar de más, porque un error falso
    // rompe la confianza del alumno en el compilador entero
    assert.equal(correr('const x = Math.floor(1.7);\nconsole.log(x);').output, '1\n');
    assert.equal(correr('const f = (a, b) => a + b;\nconsole.log(f(1, 2));').error, false);
  });

  test('el código normal sin tipos sigue funcionando', () => {
    assert.equal(
      correr('function suma(a, b) { return a + b; }\nconsole.log(suma(2, 3));').output,
      '5\n'
    );
  });

  test('un programa sin imprimir avisa de eso', () => {
    assert.match(correr('const x: number = 1;').output, /no imprime nada/);
  });

  test('los operadores knows de arrays y textos', () => {
    assert.equal(correr('const ns: number[] = [1,2,3];\nconsole.log(ns.length);').output, '3\n');
    assert.equal(correr('const s: string = "hola";\nconsole.log(s.length);').output, '4\n');
    assert.equal(correr('const ns: number[] = [1,2,3];\nconsole.log(ns.map(n => n * 2));').error, false);
    assert.equal(correr('const ns: number[] = [1,2];\nconsole.log(ns.join("-"));').output, '1-2\n');
  });
});

// ════════════════════════════════════════════════
// EJECUCIÓN
// ════════════════════════════════════════════════

describe('TypeScript: ejecuta lo que queda', () => {
  test('un programa completo', () => {
    const r = correr(`
interface Producto {
  nombre: string;
  precio: number;
  unidades: number;
}

const pan: Producto = { nombre: "Pan", precio: 1.5, unidades: 4 };
const total: number = pan.precio * pan.unidades;
console.log(pan.nombre, total);
    `);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, 'Pan 6\n');
  });

  test('console.log separa con espacios', () => {
    assert.equal(correr('console.log("a", 1, true);').output, 'a 1 true\n');
  });

  test('las clases funcionan en ejecución', () => {
    const r = correr(`
class Contador {
  private n: number = 0;
  suma(): void { this.n++; }
  valor(): number { return this.n; }
}
const c = new Contador();
c.suma();
c.suma();
console.log(c.valor());
    `);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, '2\n');
  });

  test('los enum se pueden usar como valores', () => {
    const r = correr('enum Color { Rojo, Verde }\nconsole.log(Color.Rojo, Color.Verde, Color[1]);');
    assert.equal(r.output, '0 1 Verde\n');
  });

  test('cada ejecución arranca de cero', () => {
    assert.equal(correr('const x: number = 1;\nconsole.log(x);').output, '1\n');
    assert.equal(correr('console.log("otra");').output, 'otra\n');
  });

  test('el motor nunca revienta con código basura', () => {
    ['', 'const', 'interface', 'interface {', 'const x:', 'function f(',
      'type', 'enum', 'class', 'const a: number = ;', '{{{{', '}}}'
    ].forEach(src => {
      const r = E().ejecutar(src);
      assert.equal(typeof r.output, 'string', 'debe devolver salida para: ' + src);
      assert.equal(typeof r.error, 'boolean');
    });
  });
});

describe('TypeScript: integración con el Engine', () => {
  test('runTypeScript devuelve la salida', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runTypeScript('const a: number = 1;\nconsole.log(a + 1);');
    assert.equal(r.error, false);
    assert.equal(r.output, '2\n');
  });

  test('runCode enruta typescript al motor correcto', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCode('typescript', 'const a: string = "hola";\nconsole.log(a);');
    assert.equal(r.error, false);
    assert.equal(r.output, 'hola\n');
  });
});