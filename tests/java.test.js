// Tests del intérprete de Java (javaengine.js)
//
// Aquí no hay JVM, así que cada expectativa está comprobada contra la
// semántica real de Java: división entera, concatenación con +, los métodos
// de String, los límites de un array, etc. Si un test falla, el motor está
// mintiendo en algún punto y hay que arreglar el motor, no el test.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { syncGlobals } from './setup.js';

await import('../javaengine.js');
syncGlobals();

const E = () => global.window.JAVA_ENGINE;

/** Envuelve un cuerpo en la estructura mínima de una clase Java. */
const prog = (cuerpo, extra = '') => `
public class Main {
    public static void main(String[] args) {
${cuerpo}
    }${extra}
}`;

/** Ejecuta un cuerpo y devuelve las líneas impresas. */
function ejecutar(cuerpo, extra) {
  const r = E().ejecutar(prog(cuerpo, extra));
  assert.equal(r.error, false, 'la solución no debe dar error: ' + r.output);
  return r.output.replace(/\n$/, '').split('\n');
}

describe('Java: PRINT y literales', () => {
  test('imprime un texto', () => {
    assert.deepEqual(ejecutar('System.out.println("Hola");'), ['Hola']);
  });

  test('imprime un número entero', () => {
    assert.deepEqual(ejecutar('System.out.println(42);'), ['42']);
  });

  test('imprime un double sin decimales', () => {
    // En Java 5.0 se imprime "5.0", no "5"
    assert.deepEqual(ejecutar('System.out.println(5.0);'), ['5.0']);
  });

  test('println() sin argumentos imprime una línea vacía', () => {
    const r = E().ejecutar(prog('System.out.println("a"); System.out.println(); System.out.println("b");'));
    assert.equal(r.output, 'a\n\nb\n');
  });

  test('imprime booleanos en minúscula, no TRUE', () => {
    assert.deepEqual(ejecutar('System.out.println(true); System.out.println(false);'), ['true', 'false']);
  });

  test('el carácter se imprime como texto', () => {
    assert.deepEqual(ejecutar("char c = 'A'; System.out.println(c);"), ['A']);
  });
});

describe('Java: variables y tipos', () => {
  test('declara e imprime una variable', () => {
    assert.deepEqual(ejecutar('int edad = 30; System.out.println(edad);'), ['30']);
  });

  test('las variables de texto van entre comillas dobles', () => {
    assert.deepEqual(ejecutar('String n = "Ana"; System.out.println(n);'), ['Ana']);
  });

  test('sin inicializar, int vale 0 y boolean false', () => {
    assert.deepEqual(
      ejecutar('int a; boolean b; System.out.println(a); System.out.println(b);'),
      ['0', 'false']
    );
  });

  test('una variable sin tipo se deduce con var', () => {
    assert.deepEqual(ejecutar('var x = 7; System.out.println(x);'), ['7']);
  });

  test('asignar int con un decimal trunca, como en Java', () => {
    assert.deepEqual(ejecutar('int x = 7.9; System.out.println(x);'), ['7']);
  });

  test('rechaza usar una variable que no existe', () => {
    const r = E().ejecutar(prog('System.out.println(noExiste);'));
    assert.equal(r.error, true);
    assert.match(r.output, /no está declarada/);
  });

  test('error de compilación si falta el punto y coma', () => {
    const r = E().ejecutar(prog('int x = 1 System.out.println(x);'));
    assert.equal(r.error, true);
    assert.match(r.output, /se esperaba ";"/);
  });
});

describe('Java: aritmética', () => {
  test('las cuatro operaciones básicas', () => {
    assert.deepEqual(
      ejecutar('System.out.println(17+5); System.out.println(17-5); System.out.println(17*5);'),
      ['22', '12', '85']
    );
  });

  test('división entre enteros trunca, no redondea', () => {
    // Este es el error típico: 7/2 en Java es 3, en Python 3.5
    assert.deepEqual(ejecutar('System.out.println(7/2);'), ['3']);
  });

  test('con un double la división sí es decimal', () => {
    assert.deepEqual(ejecutar('System.out.println(7/2.0); System.out.println(7.0/2);'), ['3.5', '3.5']);
  });

  test('el casting a double recupera los decimales', () => {
    assert.deepEqual(ejecutar('int a = 17; int b = 5; System.out.println((double)a / b);'), ['3.4']);
  });

  test('el módulo da el resto', () => {
    assert.deepEqual(ejecutar('System.out.println(17 % 5); System.out.println(7 % 2);'), ['2', '1']);
  });

  test('dividir por cero avisa en vez de dar NaN', () => {
    const r = E().ejecutar(prog('int a = 1; int b = 0; System.out.println(a / b);'));
    assert.equal(r.error, true);
    assert.match(r.output, /división por cero/);
  });

  test('el orden de los operadores respeta los paréntesis', () => {
    assert.deepEqual(ejecutar('System.out.println(2 + 3 * 4); System.out.println((2 + 3) * 4);'), ['14', '20']);
  });
});

describe('Java: comparaciones y lógica', () => {
  test('comparaciones numéricas', () => {
    assert.deepEqual(
      ejecutar('int a = 5; System.out.println(a > 3); System.out.println(a < 3); System.out.println(a == 5); System.out.println(a != 5);'),
      ['true', 'false', 'true', 'false']
    );
  });

  test('&& y || funcionan como se espera', () => {
    assert.deepEqual(
      ejecutar('boolean a = true; boolean b = false; System.out.println(a && b); System.out.println(a || b); System.out.println(!a);'),
      ['false', 'true', 'false']
    );
  });

  test('el operador ternario elige una de dos ramas', () => {
    assert.deepEqual(
      ejecutar('int n = 10; System.out.println(n % 2 == 0 ? "par" : "impar");'),
      ['par']
    );
  });
});

describe('Java: incremento y asignación compuesta', () => {
  test('++ y -- antes y después de la variable', () => {
    assert.deepEqual(ejecutar('int i = 5; System.out.println(i++); System.out.println(i);'), ['5', '6']);
    assert.deepEqual(ejecutar('int i = 5; System.out.println(++i); System.out.println(i);'), ['6', '6']);
  });

  test('los operadores += -= *= /=', () => {
    assert.deepEqual(
      ejecutar('int n = 10; n += 5; System.out.println(n); n -= 3; System.out.println(n); n *= 2; System.out.println(n); n /= 7; System.out.println(n);'),
      ['15', '12', '24', '3']
    );
  });
});

describe('Java: condicionales', () => {
  test('if / else', () => {
    assert.deepEqual(ejecutar('int n = 7; if (n >= 5) { System.out.println("Aprobado"); } else { System.out.println("Suspenso"); }'), ['Aprobado']);
    assert.deepEqual(ejecutar('int n = 3; if (n >= 5) { System.out.println("Aprobado"); } else { System.out.println("Suspenso"); }'), ['Suspenso']);
  });

  test('else if en cadena', () => {
    const cuerpo = `
        int n = 7;
        if (n >= 9) { System.out.println("Sobresaliente"); }
        else if (n >= 5) { System.out.println("Bien"); }
        else { System.out.println("Regular"); }`;
    assert.deepEqual(ejecutar(cuerpo), ['Bien']);
  });

  test('switch con break', () => {
    const cuerpo = `
        int d = 3;
        switch (d) {
            case 1: System.out.println("Lunes"); break;
            case 3: System.out.println("Miercoles"); break;
            default: System.out.println("Otro");
        }`;
    assert.deepEqual(ejecutar(cuerpo), ['Miercoles']);
  });

  test('switch cae al default si no hay coincidencia', () => {
    const cuerpo = `
        int d = 9;
        switch (d) {
            case 1: System.out.println("Uno"); break;
            default: System.out.println("Default");
        }`;
    assert.deepEqual(ejecutar(cuerpo), ['Default']);
  });
});

describe('Java: bucles', () => {
  test('for clásico', () => {
    assert.deepEqual(
      ejecutar('for (int i = 1; i <= 3; i++) { System.out.println(i); }'),
      ['1', '2', '3']
    );
  });

  test('for clásico que no entra', () => {
    assert.deepEqual(ejecutar('for (int i = 5; i <= 3; i++) { System.out.println(i); }'), ['(el programa no imprime nada)']);
  });

  test('while', () => {
    assert.deepEqual(ejecutar('int i = 1; while (i <= 3) { System.out.println(i); i++; }'), ['1', '2', '3']);
  });

  test('do-while ejecuta al menos una vez', () => {
    assert.deepEqual(ejecutar('int i = 10; do { System.out.println(i); i++; } while (i <= 3);'), ['10']);
  });

  test('break corta el bucle', () => {
    assert.deepEqual(ejecutar('for (int i = 1; i <= 9; i++) { if (i == 3) break; System.out.println(i); }'), ['1', '2']);
  });

  test('continue salta a la siguiente vuelta', () => {
    assert.deepEqual(ejecutar('for (int i = 1; i <= 4; i++) { if (i == 2) continue; System.out.println(i); }'), ['1', '3', '4']);
  });

  test('for-each recorre un array', () => {
    assert.deepEqual(
      ejecutar('String[] frutas = {"mango", "kiwi"}; for (String f : frutas) { System.out.println(f); }'),
      ['mango', 'kiwi']
    );
  });

  test('el bucle infinito se detecta y avisa', () => {
    const r = E().ejecutar(prog('while (true) { int x = 1; }'));
    assert.equal(r.error, true);
    assert.match(r.output, /no termina/);
  });
});

describe('Java: arrays', () => {
  test('crear un array con valores iniciales', () => {
    assert.deepEqual(ejecutar('int[] n = {4, 8, 15}; System.out.println(n[0] + " " + n[2]);'), ['4 15']);
  });

  test('length da el número de elementos', () => {
    assert.deepEqual(ejecutar('int[] n = {4, 8, 15}; System.out.println(n.length);'), ['3']);
  });

  test('declarar con new y tamaño', () => {
    assert.deepEqual(ejecutar('int[] n = new int[3]; System.out.println(n.length + " " + n[0]);'), ['3 0']);
  });

  test('recorrer un array con un for clásico', () => {
    assert.deepEqual(
      ejecutar('int[] n = {10, 20, 30}; for (int i = 0; i < n.length; i++) { System.out.println(n[i]); }'),
      ['10', '20', '30']
    );
  });

  test('un índice fuera de rango avisa con el tamaño del array', () => {
    const r = E().ejecutar(prog('int[] n = {1, 2}; System.out.println(n[5]);'));
    assert.equal(r.error, true);
    assert.match(r.output, /fuera de rango/);
    assert.match(r.output, /2/);
  });

  test('un array de Strings', () => {
    assert.deepEqual(ejecutar('String[] n = {"a", "b"}; System.out.println(n[1] + n[0]);'), ['ba']);
  });
});

describe('Java: métodos', () => {
  test('método void que imprime', () => {
    const extra = `
    static void saludar(String nombre) {
        System.out.println("Hola, " + nombre);
    }`;
    assert.deepEqual(ejecutar('saludar("Ana");', extra), ['Hola, Ana']);
  });

  test('método con retorno', () => {
    const extra = `
    static int sumar(int a, int b) {
        return a + b;
    }`;
    assert.deepEqual(ejecutar('System.out.println(sumar(3, 4));', extra), ['7']);
  });

  test('return corta el método', () => {
    const extra = `
    static int positivo(int n) {
        if (n < 0) { return 0; }
        return n * 2;
    }`;
    assert.deepEqual(ejecutar('System.out.println(positivo(-5)); System.out.println(positivo(5));', extra), ['0', '10']);
  });

  test('return dentro de un bucle', () => {
    const extra = `
    static int buscar(int[] n, int objetivo) {
        for (int i = 0; i < n.length; i++) {
            if (n[i] == objetivo) { return i; }
        }
        return -1;
    }`;
    assert.deepEqual(ejecutar('int[] n = {5, 9, 2}; System.out.println(buscar(n, 2)); System.out.println(buscar(n, 7));', extra), ['2', '-1']);
  });

  test('el número de argumentos se comprueba', () => {
    const extra = `
    static int f(int a) { return a; }`;
    const r = E().ejecutar(prog('System.out.println(f(1, 2));', extra));
    assert.equal(r.error, true);
    assert.match(r.output, /argumento/);
  });

  test('main puede llamar a otro método estático', () => {
    const extra = `
    static void fin() { System.out.println("fin"); }`;
    assert.deepEqual(ejecutar('System.out.println("medio"); fin();', extra), ['medio', 'fin']);
  });
});

describe('Java: concatenación de textos', () => {
  test('el + pega texto y números', () => {
    assert.deepEqual(
      ejecutar('String n = "Ana"; int e = 30; System.out.println(n + " tiene " + e + " años");'),
      ['Ana tiene 30 años']
    );
  });

  test('sumar dos números no concatena', () => {
    assert.deepEqual(ejecutar('int a = 1; int b = 2; System.out.println(a + b);'), ['3']);
  });

  test('el primer + con un texto convierte el resto en texto', () => {
    assert.deepEqual(ejecutar('System.out.println("Total: " + 1 + 2);'), ['Total: 12']);
  });
});

describe('Java: métodos de String', () => {
  test('length, toUpperCase, toLowerCase', () => {
    assert.deepEqual(
      ejecutar('String s = "Hola"; System.out.println(s.length()); System.out.println(s.toUpperCase()); System.out.println(s.toLowerCase());'),
      ['4', 'HOLA', 'hola']
    );
  });

  test('substring con un límite y con dos', () => {
    assert.deepEqual(
      ejecutar('String s = "Hola Mundo"; System.out.println(s.substring(5)); System.out.println(s.substring(0, 4));'),
      ['Mundo', 'Hola']
    );
  });

  test('indexOf devuelve -1 si no aparece', () => {
    assert.deepEqual(
      ejecutar('String s = "Hola Mundo"; System.out.println(s.indexOf("Mundo")); System.out.println(s.indexOf("xyz"));'),
      ['5', '-1']
    );
  });

  test('charAt devuelve el carácter de una posición', () => {
    assert.deepEqual(ejecutar('String s = "Hola"; System.out.println(s.charAt(1));'), ['o']);
  });

  test('trim quita los espacios de los extremos', () => {
    assert.deepEqual(ejecutar('String s = "  hola  "; System.out.println("[" + s.trim() + "]");'), ['[hola]']);
  });

  test('replace cambia TODAS las apariciones, como String.replace', () => {
    // Ojo: replace(CharSequence, CharSequence) de Java sustituye todas,
    // a diferencia de replace(char, char) que solo cambia la primera
    assert.deepEqual(ejecutar('String s = "a-b-c"; System.out.println(s.replace("-", "+"));'), ['a+b+c']);
  });

  test('equals y contains devuelven booleanos', () => {
    assert.deepEqual(
      ejecutar('String s = "Hola"; System.out.println(s.equals("Hola")); System.out.println(s.equals("hola")); System.out.println(s.contains("ol"));'),
      ['true', 'false', 'true']
    );
  });

  test('un substring fuera de rango avisa', () => {
    const r = E().ejecutar(prog('String s = "ab"; System.out.println(s.substring(0, 99));'));
    assert.equal(r.error, true);
    assert.match(r.output, /fuera de rango/);
  });
});

describe('Java: clases auxiliares', () => {
  test('Math.max y Math.min', () => {
    assert.deepEqual(ejecutar('System.out.println(Math.max(3, 9)); System.out.println(Math.min(3, 9));'), ['9', '3']);
  });

  test('Math.abs quita el signo', () => {
    assert.deepEqual(ejecutar('System.out.println(Math.abs(-7)); System.out.println(Math.abs(7));'), ['7', '7']);
  });

  test('Math.pow y Math.sqrt devuelven double, como en Java', () => {
    // pow y sqrt dan double, así que Java imprime 256.0 y 9.0 con decimales
    assert.deepEqual(ejecutar('System.out.println(Math.pow(2, 8)); System.out.println(Math.sqrt(81));'), ['256.0', '9.0']);
  });

  test('Integer.parseInt convierte texto en número', () => {
    assert.deepEqual(ejecutar('int n = Integer.parseInt("42"); System.out.println(n + 1);'), ['43']);
  });

  test('String.valueOf convierte a texto', () => {
    assert.deepEqual(ejecutar('System.out.println("[" + String.valueOf(123) + "]");'), ['[123]']);
  });
});

describe('Java: errores', () => {
  test('sin main avisa de que falta el método', () => {
    const r = E().ejecutar('public class Main { }');
    assert.equal(r.error, true);
    assert.match(r.output, /main/);
  });

  test('llamar a un método inexistente avisa', () => {
    const r = E().ejecutar(prog('inventado();'));
    assert.equal(r.error, true);
    assert.match(r.output, /no existe/);
  });

  test('un programa vacío no imprime nada', () => {
    assert.match(E().ejecutar(prog('')).output, /no imprime nada/);
  });

  test('el motor nunca revienta con código basura', () => {
    ['', 'class', '{', '}', '(((', 'int a = ;', 'System.out.println();'].forEach(src => {
      const r = E().ejecutar(src);
      assert.equal(typeof r.output, 'string', 'debe devolver salida para: ' + src);
      assert.equal(typeof r.error, 'boolean');
    });
  });

  test('los comentarios se ignoran', () => {
    assert.deepEqual(ejecutar('// un comentario\n/* otro */\nSystem.out.println("ok");'), ['ok']);
  });
});

describe('Java: programa completo del temario', () => {
  test('tabla de multiplicar con todo lo aprendido', () => {
    const cuerpo = `
        for (int i = 1; i <= 3; i++) {
            int resultado = i * 3;
            System.out.println(i + " x 3 = " + resultado);
        }`;
    assert.deepEqual(ejecutar(cuerpo), ['1 x 3 = 3', '2 x 3 = 6', '3 x 3 = 9']);
  });

  test('acumular la suma de un array con total +=', () => {
    const cuerpo = `
        int[] notas = {7, 8, 9};
        int total = 0;
        for (int nota : notas) {
            total += nota;
        }
        System.out.println(total);`;
    assert.deepEqual(ejecutar(cuerpo), ['24']);
  });

  test('contar las vocales de una palabra con un método', () => {
    const extra = `
    static int contarVocales(String texto) {
        int total = 0;
        for (int i = 0; i < texto.length(); i++) {
            char c = texto.charAt(i);
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                total++;
            }
        }
        return total;
    }`;
    assert.deepEqual(ejecutar('System.out.println(contarVocales("devquest"));', extra), ['3']);
  });
});

describe('Java: clases y objetos', () => {
  test('crea un objeto y lee sus campos', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro();
        l.titulo = "Dune";
        l.anio = 1965;
        System.out.println(l.titulo + " " + l.anio);
    }
}
class Libro {
    String titulo;
    int anio;
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, 'Dune 1965\n');
  });

  test('el constructor guarda los valores en los campos', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro("Dune", 1965);
        System.out.println(l.titulo + " (" + l.anio + ")");
    }
}
class Libro {
    String titulo;
    int anio;
    Libro(String t, int a) {
        this.titulo = t;
        this.anio = a;
    }
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, 'Dune (1965)\n');
  });

  test('los métodos de instancia usan this', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Temperatura t = new Temperatura();
        t.setCelsius(21);
        System.out.println(t.getCelsius());
    }
}
class Temperatura {
    private int celsius;
    public void setCelsius(int c) {
        this.celsius = c;
    }
    public int getCelsius() {
        return this.celsius;
    }
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, '21\n');
  });

  test('los objetos son independientes entre sí', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro a = new Libro("A", 1);
        Libro b = new Libro("B", 2);
        System.out.println(a.titulo + b.titulo);
    }
}
class Libro {
    String titulo;
    int anio;
    Libro(String t, int an) {
        this.titulo = t;
        this.anio = an;
    }
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, 'AB\n', 'tocar un objeto no debe tocar el otro');
  });

  test('un campo inexistente avisa y lista los que sí hay', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro();
        System.out.println(l.precio);
    }
}
class Libro {
    String titulo;
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, true);
    assert.match(r.output, /no tiene el campo "precio"/);
    assert.match(r.output, /titulo/, 'debe.listar los campos reales');
  });

  test('un método inexistente avisa y lista los reales', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro();
        l.vender();
    }
}
class Libro {
    String titulo;
    void abrir() {
        System.out.println("abierta");
    }
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, true);
    assert.match(r.output, /no tiene el método "vender"/);
    assert.match(r.output, /abrir/);
  });

  test('una clase sin declarar avisa con el nombre de la clase', () => {
    const r = E().ejecutar(prog('Perro p = new Perro();'));
    assert.equal(r.error, true);
    assert.match(r.output, /no se encuentra la clase "Perro"/);
  });

  test('new guarda el valor por defecto de cada tipo', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro();
        System.out.println(l.anio);
        System.out.println(l.titulo + "|");
        l.titulo = "x";
        System.out.println(l.titulo + "|");
    }
}
class Libro {
    int anio;
    String titulo;
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, '0\n|\nx|\n');
  });

  test('el constructor con un número de argumentos equivocado avisa', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Libro l = new Libro("Dune");
        System.out.println(l.titulo);
    }
}
class Libro {
    String titulo;
    Libro(String t, int a) {
        this.titulo = t;
    }
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, true);
    assert.match(r.output, /argumento/);
  });
});

describe('Java: salida por pantalla', () => {
  test('print y println comparten la línea', () => {
    assert.deepEqual(
      ejecutar('System.out.print("Hola "); System.out.println("Mundo");'),
      ['Hola Mundo']
    );
  });

  test('varios print seguidos se acumulan en la misma línea', () => {
    assert.deepEqual(
      ejecutar('System.out.print("a"); System.out.print("b"); System.out.print("c"); System.out.println("");'),
      ['abc']
    );
  });

  test('un print sin cerrar al final también se ve', () => {
    assert.deepEqual(ejecutar('System.out.print("sin salto");'), ['sin salto']);
  });
});

describe('Java: asignación', () => {
  test('asigna a una variable ya declarada', () => {
    assert.deepEqual(ejecutar('int n = 1; n = 7; System.out.println(n);'), ['7']);
  });

  test('asigna dentro de un array', () => {
    assert.deepEqual(
      ejecutar('int[] n = new int[3]; n[0] = 7; n[2] = 9; System.out.println(n[0] + " " + n[1] + " " + n[2]);'),
      ['7 0 9']
    );
  });

  test('++ sobre una posición del array', () => {
    assert.deepEqual(ejecutar('int[] n = {1, 2}; n[0]++; System.out.println(n[0]);'), ['2']);
  });

  test('un double conserva su tipo al reasignar un entero', () => {
    // Es la diferencia con los enteros "planos" de JavaScript
    assert.deepEqual(ejecutar('double d = 1; d = 5; System.out.println(d);'), ['5.0']);
    assert.deepEqual(ejecutar('int i = 1; i = 5; System.out.println(i);'), ['5']);
  });

  test('asigna a un campo de un objeto', () => {
    const src = `
public class Main {
    public static void main(String[] args) {
        Contador c = new Contador();
        c.n = 1;
        c.n = c.n + 41;
        System.out.println(c.n);
    }
}
class Contador {
    int n;
}`;
    const r = E().ejecutar(src);
    assert.equal(r.error, false, r.output);
    assert.equal(r.output, '42\n');
  });
});

describe('Java: ámbito de las variables', () => {
  test('una variable de un if no existe fuera', () => {
    // Las llaves de Java son un ámbito propio. Es el fallo más común al
    // empezar, y el que más confunde al pasar de otros lenguajes.
    const r = E().ejecutar(prog(
      'int x = 1;\n'
      + 'if (x > 0) {\n'
      + '    int y = 2;\n'
      + '    System.out.println(y);\n'
      + '}\n'
      + 'System.out.println(y);'
    ));
    assert.equal(r.error, true);
    assert.match(r.output, /ámbito propio|ambito propio/);
    assert.match(r.output, /"y"/);
  });

  test('un acumulador dentro del bucle se pierde al salir', () => {
    const r = E().ejecutar(prog(
      'int[] nums = {5, 10, 15};\n'
      + 'for (int i = 0; i < nums.length; i++) {\n'
      + '    int suma = 0;\n'
      + '    suma += nums[i];\n'
      + '}\n'
      + 'System.out.println(suma);'
    ));
    assert.equal(r.error, true, 'debe avisar de que suma no existe fuera del bucle');
  });

  test('declarado antes del bucle sí funciona', () => {
    assert.deepEqual(
      ejecutar(
        'int[] nums = {5, 10, 15};\n'
        + 'int suma = 0;\n'
        + 'for (int i = 0; i < nums.length; i++) {\n'
        + '    suma += nums[i];\n'
        + '}\n'
        + 'System.out.println(suma);'
      ),
      ['30']
    );
  });

  test('el contador del for no existe fuera del bucle', () => {
    const r = E().ejecutar(prog('for (int i = 0; i < 3; i++) {\n}\nSystem.out.println(i);'));
    assert.equal(r.error, true);
  });

  test('la variable del for-each sí está dentro', () => {
    assert.deepEqual(
      ejecutar('String[] n = {"a", "b"};\nfor (String s : n) {\n    System.out.println(s);\n}'),
      ['a', 'b']
    );
  });

  test('una variable nunca declarada da un mensaje distinto', () => {
    const r = E().ejecutar(prog('System.out.println(nombre);'));
    assert.equal(r.error, true);
    assert.doesNotMatch(r.output, /ámbito/, 'no es un problema de ámbito');
    assert.match(r.output, /no existe|no está declarada/);
  });

  test('el cuerpo de un método no ve las variables de otro', () => {
    const extra = `
    static void otro(int n) {
        System.out.println(numero);
    }`;
    const r = E().ejecutar(prog('int numero = 1;\notro(5);', extra));
    assert.equal(r.error, true);
  });
});

describe('Java: integración con el Engine', () => {
  test('runJava devuelve la salida del programa', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runJava('System.out.println("Hola");');
    assert.equal(r.error, false);
    assert.equal(r.output, 'Hola\n');
  });

  test('runCode enruta java al motor correcto', async () => {
    await import('../engine.js');
    const r = await global.window.Engine.runCode('java', 'System.out.println(1 + 1);');
    assert.equal(r.error, false);
    assert.equal(r.output, '2\n');
    // No debe caer en Python ni en Skulpt
    assert.ok(!r.output.includes('SyntaxError'));
  });

  test('cada ejecución arranca de cero (no guarda estado)', async () => {
    await import('../engine.js');
    const uno = await global.window.Engine.runJava('int a = 5; System.out.println(a);');
    const dos = await global.window.Engine.runJava('System.out.println("otra vez");');
    assert.equal(uno.output, '5\n');
    assert.equal(dos.output, 'otra vez\n');
  });
});