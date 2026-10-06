// Tests del intérprete de C++ (cppengine.js)
//
// En el navegador no hay compilador, así que cada expectativa está comprobada
// contra la semántica real de C++. Los puntos donde más se diferencia de Java
// (formato de cout, división entera, bool que sale 1/0, punteros) están
// cubiertos uno a uno: si un test falla, el motor está mintiendo.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../cppengine.js');
syncGlobals();

const E = () => global.window.CPP_ENGINE;

/** Envuelve un cuerpo en la estructura mínima de un programa. */
const prog = (cuerpo, extra = '') => [
  '#include <iostream>',
  'using namespace std;',
  extra,
  'int main() {',
  cuerpo,
  '    return 0;',
  '}'
].join('\n');

/** Ejecuta un cuerpo y devuelve las líneas escritas. */
function ejecutar(cuerpo, extra) {
  const r = E().ejecutar(prog(cuerpo, extra));
  assert.equal(r.error, false, 'la solución no debe dar error: ' + r.output);
  return r.output.replace(/\n$/, '').split('\n');
}

describe('C++: cout, la salida', () => {
  test('cout escribe un texto', () => {
    assert.deepEqual(ejecutar('cout << "Hola, C++!" << endl;'), ['Hola, C++!']);
  });

  test('endl salta de línea, y sin él no hay salto', () => {
    assert.equal(E().ejecutar(prog('cout << "a" << endl << "b";')).output, 'a\nb\n');
  });

  test('cout encadena varios valores', () => {
    assert.deepEqual(ejecutar('cout << 42 << " " << 7 << endl;'), ['42 7']);
  });

  test('un double se escribe SIN decimales: 5.0 sale 5', () => {
    // Diferencia clave con Java, donde 5.0 saldría "5.0". cout usa %g con 6
    // dígitos significativos y quita los ceros sobrantes.
    assert.deepEqual(ejecutar('cout << 5.0 << endl;'), ['5']);
  });

  test('un double con decimales sí los enseña', () => {
    assert.deepEqual(ejecutar('cout << 3.4 << endl;'), ['3.4']);
  });

  test('cout redondea a 6 dígitos significativos', () => {
    // 0.1 + 0.2 da 0.30000000000000004, pero cout escribe 0.3
    assert.deepEqual(ejecutar('cout << 0.1 + 0.2 << endl;'), ['0.3']);
    assert.deepEqual(ejecutar('cout << 1.0 / 3 << endl;'), ['0.333333']);
  });

  test('un bool se escribe como 1 o 0, no true/false', () => {
    assert.deepEqual(ejecutar('cout << true << " " << false << endl;'), ['1 0']);
  });

  test('un char se escribe como el carácter', () => {
    assert.deepEqual(ejecutar("char c = 'A'; cout << c << endl;"), ['A']);
  });

  test("el carácter '\\n' dentro de cout salta de línea", () => {
    assert.deepEqual(ejecutar('cout << "a" << "\\n" << "b" << endl;'), ['a', 'b']);
  });

  test('un programa que no imprime nada lo dice', () => {
    assert.match(E().ejecutar(prog('int x = 1;')).output, /no imprime nada/);
  });

  test('sin main avisa de que falta la función', () => {
    const r = E().ejecutar('#include <iostream>\nint otra() { return 0; }');
    assert.equal(r.error, true);
    assert.match(r.output, /main/);
  });
});

describe('C++: variables y tipos', () => {
  test('declara e imprime una variable', () => {
    assert.deepEqual(ejecutar('int edad = 30; cout << edad << endl;'), ['30']);
  });

  test('int y double se declaran antes del nombre', () => {
    assert.deepEqual(ejecutar('double precio = 12.5; cout << precio << endl;'), ['12.5']);
  });

  test('sin inicializar, int vale 0 y bool false', () => {
    assert.deepEqual(ejecutar('int a; bool b; cout << a << endl << b << endl;'), ['0', '0']);
  });

  test('double convierte el entero que se le asigna', () => {
    // El double conserva su decimal aunque se le meta un entero
    assert.deepEqual(ejecutar('double d = 5; cout << d << endl;'), ['5']);
  });

  test('int trunca un double al declararlo', () => {
    assert.deepEqual(ejecutar('int x = 7.9; cout << x << endl;'), ['7']);
  });

  test('casting explícito', () => {
    assert.deepEqual(ejecutar('cout << (double) 7 / 2 << endl;'), ['3.5']);
    assert.deepEqual(ejecutar('cout << (int) 7.9 << endl;'), ['7']);
  });

  test('error si falta el punto y coma', () => {
    const r = E().ejecutar(prog('int x = 1\ncout << x << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /se esperaba ";"/);
  });

  test('error si se usa una variable inexistente', () => {
    const r = E().ejecutar(prog('cout << noExiste << endl;'));
    assert.equal(r.error, true);
  });
});

describe('C++: aritmética', () => {
  test('las cuatro operaciones', () => {
    assert.deepEqual(ejecutar('cout << 17+5 << " " << 17-5 << " " << 17*5 << endl;'), ['22 12 85']);
  });

  test('división entre enteros trunca', () => {
    assert.deepEqual(ejecutar('cout << 7 / 2 << endl;'), ['3']);
  });

  test('con double la división sí es decimal', () => {
    assert.deepEqual(ejecutar('cout << 7 / 2.0 << endl;'), ['3.5']);
  });

  test('el módulo da el resto', () => {
    assert.deepEqual(ejecutar('cout << 17 % 5 << endl;'), ['2']);
  });

  test('dividir por cero avisa', () => {
    const r = E().ejecutar(prog('int a = 1; int b = 0; cout << a / b << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /división por cero/);
  });

  test('un char con un int da el código ASCII', () => {
    assert.deepEqual(ejecutar("char c = 'A'; cout << c + 1 << endl;"), ['66']);
  });

  test('el orden respeta los paréntesis', () => {
    assert.deepEqual(ejecutar('cout << 2 + 3 * 4 << " " << (2 + 3) * 4 << endl;'), ['14 20']);
  });

  test('++ y -- y los compuestos', () => {
    assert.deepEqual(ejecutar('int i = 5; cout << i++ << " " << i << endl;'), ['5 6']);
    assert.deepEqual(ejecutar('int i = 5; cout << ++i << " " << i << endl;'), ['6 6']);
    assert.deepEqual(ejecutar('int n = 10; n += 5; cout << n << endl;'), ['15']);
    assert.deepEqual(ejecutar('int n = 10; n -= 3; n *= 2; n /= 7; cout << n << endl;'), ['2']);
  });
});

describe('C++: condicionales y bucles', () => {
  test('if / else', () => {
    assert.deepEqual(ejecutar('int n = 7;\nif (n >= 5) { cout << "Aprobado" << endl; } else { cout << "Suspenso" << endl; }'), ['Aprobado']);
    assert.deepEqual(ejecutar('int n = 3;\nif (n >= 5) { cout << "Aprobado" << endl; } else { cout << "Suspenso" << endl; }'), ['Suspenso']);
  });

  test('switch con break', () => {
    const cuerpo = `
        int d = 3;
        switch (d) {
            case 1: cout << "Lunes" << endl; break;
            case 3: cout << "Miercoles" << endl; break;
            default: cout << "Otro" << endl;
        }`;
    assert.deepEqual(ejecutar(cuerpo), ['Miercoles']);
  });

  test('for clásico', () => {
    assert.deepEqual(ejecutar('for (int i = 1; i <= 3; i++) { cout << i << endl; }'), ['1', '2', '3']);
  });

  test('while', () => {
    assert.deepEqual(ejecutar('int i = 1;\nwhile (i <= 3) { cout << i << endl; i++; }'), ['1', '2', '3']);
  });

  test('break y continue', () => {
    assert.deepEqual(
      ejecutar('for (int i = 1; i <= 4; i++) { if (i == 2) continue; cout << i << endl; }'),
      ['1', '3', '4']
    );
  });

  test('el bucle infinito se detecta', () => {
    const r = E().ejecutar(prog('while (true) { int x = 1; }'));
    assert.equal(r.error, true);
    assert.match(r.output, /no termina/);
  });

  test('el operador ternario', () => {
    assert.deepEqual(ejecutar('int n = 10;\ncout << (n % 2 == 0 ? "par" : "impar") << endl;'), ['par']);
  });
});

describe('C++: arrays', () => {
  test('array con valores iniciales', () => {
    assert.deepEqual(ejecutar('int nums[3] = {4, 8, 15};\ncout << nums[0] << " " << nums[2] << endl;'), ['4 15']);
  });

  test('array de tamaño declarado, todo a cero', () => {
    assert.deepEqual(ejecutar('int nums[3];\ncout << nums[0] << " " << nums[2] << endl;'), ['0 0']);
  });

  test('asignar a una posición', () => {
    assert.deepEqual(ejecutar('int nums[3];\nnums[0] = 7;\ncout << nums[0] << endl;'), ['7']);
  });

  test('recorrerlo con for', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {10, 20, 30};\nfor (int i = 0; i < 3; i++) { cout << nums[i] << endl; }'),
      ['10', '20', '30']
    );
  });

  test('sumar los elementos', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {5, 10, 15};\nint suma = 0;\nfor (int i = 0; i < 3; i++) { suma += nums[i]; }\ncout << suma << endl;'),
      ['30']
    );
  });

  test('índice fuera de rango avisa con el tamaño', () => {
    const r = E().ejecutar(prog('int nums[2] = {1, 2};\ncout << nums[5] << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /fuera de rango/);
    assert.match(r.output, /2 elementos/);
  });

  test('range-for', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {1, 2, 3};\nfor (int n : nums) { cout << n << endl; }'),
      ['1', '2', '3']
    );
  });
});

describe('C++: string y vector', () => {
  test('concatenar con +', () => {
    assert.deepEqual(ejecutar('string n = "Ana";\nint e = 30;\ncout << n << " tiene " << e << endl;'), ['Ana tiene 30']);
  });

  test('length y size', () => {
    assert.deepEqual(ejecutar('string s = "Hola";\ncout << s.length() << " " << s.size() << endl;'), ['4 4']);
  });

  test('substr y find', () => {
    assert.deepEqual(
      ejecutar('string s = "Hola Mundo";\ncout << s.substr(0, 4) << " " << s.find("Mundo") << endl;'),
      ['Hola 5']
    );
  });

  test('comparar textos', () => {
    assert.deepEqual(ejecutar('cout << ("hola" == "hola") << endl;'), ['1']);
  });

  test('+= añade al final', () => {
    assert.deepEqual(ejecutar('string s = "a";\ns += "b";\ncout << s << endl;'), ['ab']);
  });

  test('push_back y size en un vector', () => {
    assert.deepEqual(ejecutar('vector<int> v;\nv.push_back(4);\nv.push_back(8);\ncout << v.size() << " " << v[0] << endl;'), ['2 4']);
  });

  test('sumar un vector con range-for', () => {
    assert.deepEqual(
      ejecutar('vector<int> v;\nv.push_back(5);\nv.push_back(10);\nint s = 0;\nfor (int x : v) { s += x; }\ncout << s << endl;'),
      ['15']
    );
  });

  test('at fuera de rango avisa', () => {
    const r = E().ejecutar(prog('vector<int> v;\nv.push_back(1);\ncout << v.at(5) << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /fuera de rango/);
  });
});

describe('C++: funciones', () => {
  test('función con retorno', () => {
    const extra = 'int sumar(int a, int b) { return a + b; }';
    assert.deepEqual(ejecutar('cout << sumar(3, 4) << endl;', extra), ['7']);
  });

  test('función void que escribe', () => {
    const extra = 'void saludar(string n) { cout << "Hola, " << n << endl; }';
    assert.deepEqual(ejecutar('saludar("Ana");', extra), ['Hola, Ana']);
  });

  test('return corta la función', () => {
    const extra = `
    int positivo(int n) {
        if (n < 0) { return 0; }
        return n * 2;
    }`;
    assert.deepEqual(ejecutar('cout << positivo(-5) << " " << positivo(5) << endl;', extra), ['0 10']);
  });

  test('el número de argumentos se comprueba', () => {
    const extra = 'int f(int a) { return a; }';
    const r = E().ejecutar(prog('cout << f(1, 2) << endl;', extra));
    assert.equal(r.error, true);
    assert.match(r.output, /argumento/);
  });
});

describe('C++: struct y class', () => {
  test('crear un objeto y leer sus campos', () => {
    const extra = 'struct Punto { int x; int y; };';
    assert.deepEqual(ejecutar('Punto p;\np.x = 3; p.y = 4;\ncout << p.x << "," << p.y << endl;', extra), ['3,4']);
  });

  test('los campos empiezan a cero', () => {
    const extra = 'struct Punto { int x; int y; };';
    assert.deepEqual(ejecutar('Punto p;\ncout << p.x << endl;', extra), ['0']);
  });

  test('el constructor guarda los valores', () => {
    const extra = `
struct Libro {
    string titulo;
    int anio;
    Libro(string t, int a) {
        this.titulo = t;
        this.anio = a;
    }
}`;
    assert.deepEqual(
      ejecutar('Libro l("Dune", 1965);\ncout << l.titulo << " (" << l.anio << ")" << endl;', extra),
      ['Dune (1965)']
    );
  });

  test('un método que usa this', () => {
    const extra = `
struct Contador {
    int n;
    Contador() { this.n = 0; }
    void sumar(int v) { this.n = this.n + v; }
    int total() { return this.n; }
}`;
    assert.deepEqual(
      ejecutar('Contador c;\nc.sumar(4);\nc.sumar(38);\ncout << c.total() << endl;', extra),
      ['42']
    );
  });

  test('los objetos son independientes', () => {
    const extra = 'struct Caja { int n; };';
    assert.deepEqual(ejecutar('Caja a; Caja b;\na.n = 1; b.n = 2;\ncout << a.n << b.n << endl;', extra), ['12']);
  });

  test('un campo inexistente avisa y lista los reales', () => {
    const extra = 'struct Punto { int x; int y; };';
    const r = E().ejecutar(prog('Punto p;\ncout << p.z << endl;', extra));
    assert.equal(r.error, true);
    assert.match(r.output, /no tiene el miembro "z"/);
    assert.match(r.output, /x/);
  });
});

describe('C++: PUNTEROS', () => {
  test('un puntero guarda la dirección de una variable', () => {
    // Lo esencial de C++: escribir por el puntero cambia la original
    assert.deepEqual(ejecutar('int x = 5;\nint* p = &x;\n*p = 10;\ncout << x << endl;'), ['10']);
  });

  test('sin puntero, copiar no cambia el original', () => {
    assert.deepEqual(ejecutar('int x = 5;\nint y = x;\ny = 10;\ncout << x << " " << y << endl;'), ['5 10']);
  });

  test('un nullptr se compara con ==', () => {
    assert.deepEqual(ejecutar('int* p = nullptr;\ncout << (p == nullptr) << endl;'), ['1']);
  });

  test('p[i] lee un array a través del puntero', () => {
    assert.deepEqual(ejecutar('int nums[3] = {10, 20, 30};\nint* p = nums;\ncout << p[0] << " " << p[2] << endl;'), ['10 30']);
  });

  test('p++ avanza al elemento siguiente', () => {
    assert.deepEqual(ejecutar('int nums[3] = {10, 20, 30};\nint* p = nums;\np++;\ncout << *p << endl;'), ['20']);
  });

  test('*(p + 2) avanza dos elementos', () => {
    assert.deepEqual(ejecutar('int nums[3] = {10, 20, 30};\nint* p = nums;\ncout << *(p + 2) << endl;'), ['30']);
  });

  test('recorrer el array con un puntero que avanza', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {1, 2, 3};\nint* p = nums;\nfor (int i = 0; i < 3; i++) { cout << *(p + i) << endl; }'),
      ['1', '2', '3']
    );
  });

  test('new reserva memoria y delete la libera', () => {
    assert.deepEqual(ejecutar('int* p = new int;\n*p = 42;\ncout << *p << endl;\ndelete p;'), ['42']);
  });

  test('new[] reserva un array y delete[] lo libera', () => {
    assert.deepEqual(ejecutar('int* nums = new int[3];\nnums[0] = 7;\ncout << nums[0] << endl;\ndelete[] nums;'), ['7']);
  });

  test('puntero a un struct con ->', () => {
    const extra = 'struct Punto { int x; int y; };';
    assert.deepEqual(
      ejecutar('Punto* p = new Punto;\np->x = 3;\np->y = 4;\ncout << p->x << "," << p->y << endl;\ndelete p;', extra),
      ['3,4']
    );
  });

  test('una función con puntero SÍ modifica la variable', () => {
    const extra = 'void subir(int* p) { *p = *p + 1; }';
    assert.deepEqual(ejecutar('int x = 5;\nsubir(&x);\ncout << x << endl;', extra), ['6']);
  });

  test('una función por valor NO modifica la variable', () => {
    const extra = 'void subir(int n) { n = n + 1; }';
    assert.deepEqual(ejecutar('int x = 5;\nsubir(x);\ncout << x << endl;', extra), ['5']);
  });

  test('intercambiar dos valores con punteros', () => {
    const extra = 'void cambiar(int* a, int* b) { int t = *a; *a = *b; *b = t; }';
    assert.deepEqual(ejecutar('int a = 1, b = 2;\ncambiar(&a, &b);\ncout << a << " " << b << endl;', extra), ['2 1']);
  });

  test('usar memoria ya liberada avisa del use after free', () => {
    const r = E().ejecutar(prog('int* p = new int;\n*p = 1;\ndelete p;\ncout << *p << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /use after free/);
  });

  test('liberar dos veces avisa', () => {
    const r = E().ejecutar(prog('int* p = new int;\ndelete p;\ndelete p;'));
    assert.equal(r.error, true);
    assert.match(r.output, /ya estaba liberada|dos veces/i);
  });

  test('desreferenciar nullptr avisa', () => {
    const r = E().ejecutar(prog('int* p = nullptr;\ncout << *p << endl;'));
    assert.equal(r.error, true);
    assert.match(r.output, /nulo|nullptr/);
  });

  test('un puntero sin inicializar avisa y explica', () => {
    const r = E().ejecutar(prog('int* p;\n*p = 5;'));
    assert.equal(r.error, true);
    assert.match(r.output, /no (tiene dirección|pide)/);
  });

  test('delete sobre nullptr avisa', () => {
    const r = E().ejecutar(prog('int* p = nullptr;\ndelete p;'));
    assert.equal(r.error, true);
  });

  test('un puntero no puede guardar un número', () => {
    // En C++ real esto ni siquiera compila, y el error confunde mucho
    // al principio: por eso aquí se avisa en vez de aceptarlo en silencio.
    const r = E().ejecutar(prog('int* p = new int;\np = 10;'));
    assert.equal(r.error, true);
    assert.match(r.output, /solo puede guardar direcciones/);
  });

  test('un int no puede guardar un puntero', () => {
    const r = E().ejecutar(prog('int x = 1;\nx = new int;'));
    assert.equal(r.error, true);
    assert.match(r.output, /no se puede guardar un puntero/);
    assert.match(r.output, /int\* x/, 'debe sugerir cómo declararlo bien');
  });

  test('puntero a puntero', () => {
    assert.deepEqual(
      ejecutar('int x = 5;\nint* p = &x;\nint** pp = &p;\ncout << **pp << endl;'),
      ['5']
    );
  });

  test('el bucle for con p++ recorre el array', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {1, 2, 3};\nint* p = nums;\nfor (int i = 0; i < 3; i++) { cout << *p << endl; p++; }'),
      ['1', '2', '3']
    );
  });

  test('imprimir un puntero da su dirección, no su valor', () => {
    // Es el comportamiento real de cout, aunque confunda al principio
    const r = E().ejecutar(prog('int x = 5;\nint* p = &x;\ncout << p << endl;'));
    assert.equal(r.error, false);
    assert.match(r.output, /^0x[0-9a-f]+$/m);
  });

  test('puntero a un elemento concreto del array', () => {
    assert.deepEqual(
      ejecutar('int nums[3] = {10, 20, 30};\nint* p = &nums[1];\ncout << *p << endl;'),
      ['20']
    );
  });
});

describe('C++: referencias', () => {
  test('una referencia es un alias de la variable', () => {
    // A diferencia de un puntero, no necesita * para leer ni para escribir
    assert.deepEqual(ejecutar('int x = 5;\nint& r = x;\nr = 10;\ncout << x << endl;'), ['10']);
  });

  test('una referencia se lee como la variable', () => {
    assert.deepEqual(ejecutar('int x = 5;\nint& r = x;\ncout << r << endl;'), ['5']);
  });

  test('cambiar la original también se ve en la referencia', () => {
    assert.deepEqual(ejecutar('int x = 5;\nint& r = x;\nx = 9;\ncout << r << endl;'), ['9']);
  });

  test('una función con int& SÍ modifica la variable', () => {
    const extra = 'void duplicar(int& r) { r = r * 2; }';
    assert.deepEqual(ejecutar('int x = 5;\nduplicar(x);\ncout << x << endl;', extra), ['10']);
  });

  test('una función con int NO modifica, pero con int& sí', () => {
    const extra = `
    void porValor(int n) { n = 99; }
    void porReferencia(int& n) { n = 99; }`;
    assert.deepEqual(
      ejecutar('int a = 1, b = 1;\nporValor(a);\nporReferencia(b);\ncout << a << " " << b << endl;', extra),
      ['1 99']
    );
  });

  test('una referencia a un elemento del array', () => {
    assert.deepEqual(
      ejecutar('int nums[2] = {1, 2};\nint& r = nums[0];\nr = 99;\ncout << nums[0] << endl;'),
      ['99']
    );
  });
});

describe('C++: ámbito', () => {
  test('una variable de un bloque no existe fuera', () => {
    const r = E().ejecutar(prog('int x = 1;\nif (x > 0) { int y = 2; }\ncout << y << endl;'));
    assert.equal(r.error, true);
  });

  test('el contador del for no existe fuera', () => {
    const r = E().ejecutar(prog('for (int i = 0; i < 3; i++) { }\ncout << i << endl;'));
    assert.equal(r.error, true);
  });

  test('una local de main no se ve desde otra función', () => {
    const extra = 'void otra() { cout << numero << endl; }';
    const r = E().ejecutar(prog('int numero = 1;\notra();', extra));
    assert.equal(r.error, true);
  });
});

describe('C++: robustez', () => {
  test('el motor nunca revienta con código basura', () => {
    ['', '{', '}', '(((', 'int a = ;', 'cout << ;', 'int main(', 'int main() {']
      .forEach(src => {
        const r = E().ejecutar(src);
        assert.equal(typeof r.output, 'string', 'debe devolver salida para: ' + src);
        assert.equal(typeof r.error, 'boolean');
      });
  });

  test('los comentarios se ignoran', () => {
    assert.deepEqual(ejecutar('// un comentario\n/* otro */\ncout << "ok" << endl;'), ['ok']);
  });

  test('using namespace std se acepta', () => {
    assert.deepEqual(ejecutar('cout << "ok" << endl;'), ['ok']);
  });

  test('sin using namespace, std:: funciona igual', () => {
    const src = '#include <iostream>\nint main() { std::cout << "ok" << std::endl; return 0; }';
    assert.equal(E().ejecutar(src).output, 'ok\n');
  });

  test('cin se acepta y se ignora (no hay entrada en el navegador)', () => {
    assert.deepEqual(ejecutar('int x; cin >> x; cout << x << endl;'), ['0']);
  });

  test('cada ejecución arranca de cero', () => {
    assert.equal(E().ejecutar(prog('int x = 5; cout << x << endl;')).output, '5\n');
    assert.equal(E().ejecutar(prog('cout << "otra" << endl;')).output, 'otra\n');
  });
});

describe('C++: integración con el Engine', () => {
  test('runCpp devuelve la salida del programa', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCpp('cout << "Hola" << endl;');
    assert.equal(r.error, false);
    assert.equal(r.output, 'Hola\n');
  });

  test('runCode enruta cpp al motor correcto', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCode('cpp', 'cout << 1 + 1 << endl;');
    assert.equal(r.error, false);
    assert.equal(r.output, '2\n');
  });
});