# Documentación de DevQuest

## Descripción

DevQuest es una aplicación web interactiva para aprender programación desde cero hasta nivel profesional. Inspirada en Duolingo, ofrece lecciones interactivas con gamificación, ejercicios de código en tiempo real y un sistema de progreso persistente. El inicio es un hub de lenguajes con progreso, nivel y racha independientes por lenguaje. Hay **10 cursos completos** (Python, JavaScript, HTML, CSS, SQL, Java, C++, PHP, Go y TypeScript: 134 módulos, 272 lecciones y 1.640 ejercicios).

**Listo para producción**: Todos los 10 cursos están completos, 716 tests en verde (frontend + servidor), seguridad revisada (CSP, escape de HTML, JWT obligatorio en producción, CORS restringido), código limpio sin morralla.

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura de la aplicación y pantallas |
| **CSS3** | Diseño oscuro con glassmorphism, animaciones y efectos neon |
| **JavaScript ES6+** | Lógica de la aplicación, estado y navegación |
| **Skulpt** | Ejecución de Python en el navegador (sin servidor) |
| **Motores propios** | `sqlengine.js` (mini motor SQL), `javaengine.js` (Java), `cppengine.js` (C++), `phpengine.js` (PHP) y `goengine.js` (Go): cero dependencias, como el resto del proyecto |
| **localStorage** | Persistencia de progreso del usuario |
| **Node.js** | Tests automatizados y desarrollo |
| **Backend (server/)** | Node 22+ sin dependencias: registro/login/ranking (SQLite, JWT, scrypt) |

## Estructura del Proyecto

```
devquest/
├── index.html          # Estructura principal (7 pantallas)
├── app.js              # Lógica principal, estado y gamificación
├── engine.js           # Motor de ejercicios (render y validación)
├── curriculum.js       # Python: 14 módulos, 40 lecciones, 230 ejercicios
├── curriculums/          # Un fichero por lenguaje
│   ├── javascript.js    # JavaScript: 14 módulos, 43 lecciones, 258 ejercicios
│   ├── html.js          # HTML: 14 módulos, 23 lecciones, 138 ejercicios
│   ├── css.js           # CSS: 14 módulos, 25 lecciones, 150 ejercicios
│   ├── sql.js           # SQL: 14 módulos, 27 lecciones, 162 ejercicios
│   ├── java.js          # Java: 14 módulos, 24 lecciones, 144 ejercicios
│   └── cpp.js           # C++: 14 módulos, 25 lecciones, 150 ejercicios
├── sqlengine.js         # Motor de SQL propio (SELECT, JOIN, GROUP BY, ...)
├── javaengine.js        # Intérprete de Java propio (variables, clases, ...)
├── cppengine.js         # Intérprete de C++ propio (punteros, memoria, ...)|
├── languages.js          # Registro de los 10 lenguajes (hub)
├── assets/img/           # Imágenes (pato-logo.png, pato-logo-128.png)
├── img/                  # Originales que aportó el usuario (sin usar)
├── style.css           # Diseño y animaciones
├── package.json        # Configuración npm y scripts
├── tests/              # Tests automatizados frontend
│   ├── setup.js        # Mocks de window/document
│   ├── engine.test.js  # Tests del motor de ejercicios
│   ├── curriculum.test.js # Tests de integridad de datos
│   ├── curricula.test.js  # Coherencia de los 8 temarios (ejecuta las soluciones)
│   ├── app.test.js     # Tests de lógica principal
│   ├── php.test.js     # Tests del intérprete de PHP (67 tests)
│   ├── go.test.js      # Tests del intérprete de Go (81 tests)
│   └── league.test.js  # Tests de liga con usuarios reales
├── server/             # Backend (cero dependencias)
│   ├── src/config.js   # Config por entorno
│   ├── src/db.js       # SQLite + schema (migrable a Postgres)
│   ├── src/crypto.js   # scrypt + JWT manual
│   ├── src/users.js    # Lógica de usuarios y ranking
│   ├── src/server.js   # HTTP, CORS, rate-limit
│   └── test/           # 17 tests del servidor
├── docs/               # Documentación adicional
├── specs/              # Especificaciones (002-backend-auth aprobada)
├── AGENTS.md           # Instrucciones para agentes
├── MEMORY.md           # Memoria persistente del proyecto
└── documentacion.md    # Este archivo
```

## Backend de usuarios (server/)

Guarda identidad mínima: **nombre + email + hash de contraseña** (+ xp/nivel para el ranking). Rápido y escalable: stateless con JWT (sin sesiones), SQLite en WAL con sentencias preparadas e índices, rate-limit en auth y cero dependencias.

```bash
cd server
npm test          # 17 tests
npm start         # http://localhost:3001
npm run test:all  # desde la raíz: 249 tests (frontend + servidor)
```

Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me`, `PUT /api/me`, `POST /api/auth/forgot`, `POST /api/auth/reset`, `POST /api/progress`, `GET /api/leaderboard`. Detalle en `server/README.md`.

Recuperación de contraseña: `forgot` genera token de un solo uso (1h) y en desarrollo devuelve `devToken`; el envío por email (SMTP) queda pendiente. Migración a Postgres documentada en `server/README.md`.

## Instalación y Ejecución

### Requisitos
- Node.js >= 18.0.0
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Modo desarrollo (recarga automática)
npm run dev

# Servir la aplicación
npm start
```

### Uso sin Node.js
Simplemente abre `index.html` en tu navegador.

## Tests

Estado actual: **716 tests frontend + 37 del servidor = 753 en verde.**

### Ejecutar todos los tests
```bash
npm test              # solo frontend (716)
npm run test:server   # solo servidor (37)
npm run test:all      # frontend + servidor (753)
```

### Tests con watch (recarga automática)
```bash
npm run test:watch
```

### Tests con cobertura
```bash
npm run test:coverage
```

### Estructura de Tests

| Archivo | Descripción |
|---------|-------------|
| `tests/setup.js` | Mocks de window/document para Node.js |
| `tests/engine.test.js` | Tests del motor de ejercicios (render, validación, syntax highlight) |
| `tests/curriculum.test.js` | Tests de integridad de los currículums + ejecución real de las soluciones |
| `tests/app.test.js` | Tests de lógica principal (estado, XP, rachas, logros) |
| `tests/league.test.js` | Tests de la liga (bots y usuarios reales) |
| `tests/contact.test.js` | Tests del formulario de contacto y sus 3 vías de envío |
| `tests/java.test.js` | Tests del intérprete de Java (100 tests) |
| `tests/cpp.test.js` | Tests del intérprete de C++ (100 tests) |
| `tests/sql.test.js` | Tests del motor SQL (100 tests) |
| `tests/php.test.js` | Tests del intérprete de PHP (67 tests) |
| `tests/go.test.js` | Tests del intérprete de Go (81 tests) |
| `tests/typescript.test.js` | Tests del verificador de TypeScript (43 tests) |
| `tests/curricula.test.js` | Coherencia de los 10 temarios (ejecuta todas las soluciones) |

## Secciones de la Aplicación

### Pantallas

1. **Welcome** — Pantalla de bienvenida con input de nombre
2. **Hub de lenguajes** — Página principal: 10 tarjetas (Python, JavaScript, HTML, CSS, SQL, Java, C++, PHP, Go, TypeScript) con progreso y nivel; **todas con contenido completo**
3. **Home del curso** — Dashboard del lenguaje elegido (stats, XP bar, continuar, módulos)
4. **Module Detail** — Lista de lecciones de un módulo
5. **Lesson** — Área de ejercicios interactivos
6. **Complete** — Pantalla de lección completada con stats
7. **Profile** — Perfil con foto, nombre editable, avatar, estadísticas del lenguaje actual y logros
8. **League** — Liga semanal con ranking (del lenguaje actual)

### Tipos de Ejercicios
| Tipo | Descripción |
|------|-------------|
| `multiple-choice` | Seleccionar respuesta correcta |
| `fill-blank` | Completar huecos en el código |
| `reorder` | Ordenar bloques de código (drag & drop) |
| `type-code` | Escribir código con editor |
| `fix-bug` | Identificar código correcto |
| `predict-output` | Predecir la salida de un código |

### Liga (ranking)

La liga combina tres fuentes de jugadores, de más a menos peso real:

1. **El usuario local**, siempre, con su XP real.
2. **Usuarios reales del servidor**, si se configura `window.DEVQUEST_LEADERBOARD_URL` (antiguo: `PYQUEST_LEADERBOARD_URL`) con un endpoint que devuelva `[{ id, name, xp, emoji }]`.
3. **Jugadores de relleno (bots)**, declarados en `LEAGUE_BOTS` dentro de `app.js`.

Los bots existen para que la liga no se vea vacía cuando todavía no hay usuarios reales — como los NPC de una máquina recreativa, dan contexto al ranking. Van de 780 a 12.480 XP para que el podio y la lista parezcan un ranking de verdad, y el usuario siempre aparece entre ellos en su posición real.

**Aviso importante: los bots no son personas.** Por eso se marcan con 🤖 y hay un aviso al final de la lista. Si prefieres una liga solo con gente real (o sin el aviso), basta con poner `LEAGUE_BOTS = []` en `app.js`.

Si algún día un usuario real del servidor se llama igual que un bot, el bot se descarta automáticamente para no duplicar el nombre.

### Contacto (final del perfil)

Al final de la pantalla de **Perfil** hay un botón **"¿Tienes alguna consulta? Contáctanos"**. Al pulsarlo se despliega un formulario con nombre, email, asunto y mensaje. Destino: **duckdev77@gmail.com**.

#### Las vías de envío

**El sitio está en GitHub Pages, que es estático: allí no se ejecuta Node**, así que la carpeta `server/` no puede recibir nada desde la web publicada. El formulario usa FormSubmit de forma predeterminada, igual que el portfolio; también admite un backend propio o un servicio de formularios configurado. Las vías se prueban en orden, parando en la primera que funciona:

| # | Vía | Cuándo se usa | Qué necesita |
|---|-----|---------------|--------------|
| 1 | **API propia** | Si defines `DEVQUEST_API_URL` | Desplegar `server/` y configurar SMTP/Resend |
| 2 | **Servicio alternativo** | Si defines `DEVQUEST_CONTACT_FORM_URL` | Cuenta en Formspree o similar |
| 3 | **FormSubmit** | Por defecto, al buzón `duckdev77@gmail.com` | FormSubmit activado para este sitio con un identificador de formulario |
| 4 | **`mailto:`** | Si fallan las anteriores | El visitante debe pulsar Enviar en su gestor |

FormSubmit envía el formulario automáticamente desde GitHub Pages. Si el proveedor no está disponible o aún requiere activar el buzón, el último recurso es abrir el gestor de correo con un borrador; el formulario se conserva intacto.

Para usar la vía 1 o 2, define la URL correspondiente **antes de `contact.js`** en `index.html`:

```html
<!-- A) Servicio de formularios: llega al buzón sin que nadie abra nada -->
<script>window.DEVQUEST_CONTACT_FORM_URL = 'https://formspree.io/f/TU_ID';</script>

<!-- B) Tu backend Node, si lo despliegas -->
<script>window.DEVQUEST_API_URL = 'https://tu-servidor.com/api/contact';</script>
```

Cada vía usa su propio formato: nuestro backend espera JSON, y los servicios de formularios `application/x-www-form-urlencoded` con campos `_subject` y `_to`.

**Si una vía falla se pasa a la siguiente en lugar de rendirse.** Por ejemplo, si el backend guarda el mensaje pero no puede enviarlo por email (sin SMTP configurado), se ofrece el `mailto:` para que llegue igualmente. El módulo **nunca lanza una excepción**: el peor caso es un aviso con tu dirección para escribir a mano.

#### El backend (opcional)

`POST /api/contact` guarda el mensaje **siempre** en la tabla `contact_messages`. El envío por email es un paso aparte: si falla, responde `201` con `sent: false` y un aviso, y el mensaje sigue guardado. Un formulario que pierde el mensaje de un usuario es peor que uno que avisa de que el email va tardando.

Para activar el envío real define en `server/.env`:

```bash
# Opción A: SMTP (Gmail necesita "aplicaciones con contraseña")
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=la-clave-de-aplicacion
SMTP_TLS=true

# Opción B: API de transactional (más simple que SMTP)
# RESEND_API_KEY=re_xxxxxxxxxxxx
```

Para leer lo recibido: `GET /api/contact` (necesita `ADMIN_IDS`) o consultando la tabla.

El endpoint tiene el **mismo rate-limit que el login** (30 intentos por minuto y IP): es una puerta abierta a tu buzón.

### Modo administrador (el pato de la firma)

Al final de la pantalla de **Perfil**, debajo de los logros, hay una firma con el logo del pato, el nombre "PatoDev" y la frase "Hecho para aprender a programar de verdad". Parece una firma más de la app, pero **el logo es el acceso al modo administrador**: al pulsarlo se abre un modal titulado **administrador** que pide la contraseña. Al introducirla correctamente se activa el modo: **se abren todos los módulos y todas las lecciones de todos los cursos**, sin tocar el progreso ni los logros. Pulsando el logo otra vez se desactiva.

Estaba antes en el pie de la pantalla de bienvenida, pero ahí quedaba raro y, además, quien ya tenía el nombre guardado nunca llegaba a verlo (la app salta directo al hub). En el perfil está siempre a mano.

**Aviso importante:** esto vive en el cliente, así que **no es seguridad real**. Cualquiera que abra la consola del navegador puede calling `App.setAdminMode(true)` saltándose la contraseña, y el hash se puede revertir. La contraseña solo se ofusca para no dejarla escrita en el código que se descarga. Si algún día hace falta proteger contenido de verdad, esto debe ir al servidor.

Contraseña: `patodevpunk`. Para cambiarla, calcula el hash y ponlo en `ADMIN_HASH` (`app.js`):

```bash
node -e "let h=0x811c9dc5;for(const c of 'TU_CONTRASENA'){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}console.log(('0000000'+h.toString(16)).slice(-8))"
```

### Feedback al fallar

Ningún tipo de ejercicio deja al alumno sin saber qué hacer. Al pulsar **Comprobar** y equivocarse, el panel muestra:

1. **El porqué** — la `explanation` del ejercicio. Es obligatoria en los 6 tipos y los tests de integridad la verifican en los 8 cursos, así que no puede faltar en el contenido nuevo.
2. **Cómo se resuelve** — un bloque 💡 con la solución correcta, adaptado al tipo:
   - `type-code` → el código de la solución
   - `multiple-choice` / `fix-bug` → el texto de la opción buena
   - `predict-output` → la salida correcta
   - `fill-blank` → el código con los huecos ya rellenos
   - `reorder` → los bloques en su orden correcto

El texto se escapa al inyectarlo en el HTML, de modo que una solución con `<` o etiquetas no puede romper la interfaz. Mientras el panel está abierto la lección reserva su altura (`--feedback-h`, medida por JS) para que el botón **Ejecutar** nunca quede debajo.

Si el código del alumno ni siquiera compila, también cuenta como fallo: en vez del aviso "ejecuta el código primero" se muestra la explicación del ejercicio **más** el mensaje del intérprete, y la solución completa. Un error de sintaxis es el error más frecuente al aprender, así que ocultarlo sería justo lo contrario de enseñar.

## Cómo se ejecuta cada lenguaje

No todos los lenguajes se ejecutan igual en el navegador. Cada uno tiene su motor, y el temario está escrito para no usar nada que su motor no soporte.

| Lenguaje | Cómo se ejecuta | Limitaciones asumidas por el temario |
|----------|-----------------|----------------------------------------|
| Python | Skulpt (CDN) | Entrada por consola |
| JavaScript | `Function` nativo, capturando `console.log` | — |
| HTML | `DOMParser` y se muestra el texto visible | Sin JS ni CSS |
| CSS | Analizador de reglas propio | Sin JavaScript embebido |
| SQL | `sqlengine.js`, motor propio | Sin funciones de ventana ni CTE |
| Java | `javaengine.js`, intérprete propio | Sin herencia, interfaces, genéricos, excepciones ni hilos |
| C++ | `cppengine.js`, intérprete propio | Sin plantillas, herencia, polimorfismo ni operator overloading |
| PHP | `phpengine.js`, intérprete propio | Sin clases, `require`/`include`, sesiones ni namespaces |
| Go | `goengine.js`, intérprete propio | Sin goroutines reales, canales, generics ni interfaces con métodos |

### El intérprete de Java (javaengine.js)

No hay JVM en el navegador, así que el motor interpreta el subconjunto que se enseña en el curso: léxico, analizador descendente recursivo y un ejecutador con árbol. Cubre variables, operadores, `if/else/switch`, `while/do/for/for-each`, métodos, arrays, `String` y varias clases del mismo fichero con constructores y métodos de instancia.

Respeta la semántica real de Java, que es donde más gente tropieza:

- **División entera**: `7 / 2` es `3`, no `3.5`. Hace falta un `double` o un `(double)`.
- **Concatenación con `+`**: en cuanto aparece un `String`, todo lo demás se convierte a texto.
- **Doubles con decimales**: `5.0` se imprime como `5.0`, y `Math.pow(2, 8)` como `256.0`.
- **Ámbitos**: las llaves de un `if` o un bucle son un ámbito propio. Usar una variable fuera de donde se declaró da un error que explica por qué, en vez de un mensaje seco.
- **Sin variables globales**: lo declarado en un método no se ve desde otro. Los campos `static` sí son globales.
- **Límites**: bucles infinitos y desbordamiento de índices se detectan con un mensaje que explica el fallo, y no con un cuelgue.

Lo que **no** cubre (herencia, interfaces, genéricos, excepciones, hilos, Streams) se explica como concepto teórico en los últimos módulos, sin pedir código que lo use.

### El intérprete de C++ (cppengine.js)

Tampoco hay compilador en el navegador. El motor interpreta el subconjunto del curso y, sobre todo, **modela la memoria con direcciones de verdad**: cada variable ocupa una dirección y un puntero la guarda. Por eso `*p = 10;` cambia la variable original, `p++` avanza al siguiente elemento del array y `delete` libera una dirección concreta. Sin eso, el temario de punteros sería teoría sin nada que ejecutar.

Respeta la semántica real de C++, que es donde más se diferencia de Java:

- **`cout` escribe los `double` como `%g` con 6 dígitos significativos**: `5.0` sale `5` y `0.1 + 0.2` sale `0.3`. Es la diferencia más llamativa con Java, que escribiría `5.0`.
- **`bool` se escribe como `1` o `0`**, no como `true`/`false`.
- **División entera**: `7 / 2` es `3`. Hace falta un `double` o un `(double)`.
- **Referencias no son punteros**: una referencia es un alias y se usa como la variable (`r = 10` cambia `x`), mientras que un puntero guarda una dirección y hay que desreferenciarlo con `*`. Son dos tipos distintos en el motor, porque confundirlos rompe la aritmética.
- **Los arrays caen a puntero**: `int* p = nums;` guarda la dirección del primer elemento, y `p[i]`, `p + 1` y `*(p + 1)` funcionan.
- **No hay recolector de basura**: `new` sin `delete` se acumula, y usar memoria ya liberada (`use after free`) o liberarla dos veces dan error con un mensaje que explica el fallo, en vez de dejar que el programa se comporte de forma impredecible.
- **Los tipos no se mezclan**: guardar un `int` en un puntero, o un puntero en un `int`, avisa con el error que daría el compilador.

Lo que **no** cubre (plantillas, herencia, polimorfismo, `operator overloading`, hilos) se explica como concepto en los módulos finales, sin pedir código que lo use.

### El intérprete de PHP (phpengine.js)

PHP tampoco se ejecuta en el navegador, así que tiene su propio intérprete. Es bastante más sencillo que el de C++ porque no necesita modelar la memoria, pero donde más se parece a PHP de verdad es en las conversiones, que es justo donde más gente tropieza:

- **`echo` no añade salto de línea.** `echo "a"; echo "b";` escribe `ab`. Para bajar de línea hay que poner `\n` dentro del texto. Se enseña en el primer módulo porque es la primera sorpresa de cualquiera.
- **`+` convierte a número y `.` concatena**: `"5" + 3` da `8`, y `"5" . 3` da `"53"`. El punto va **más flojo** que el `+` (como desde PHP 8), así que `"Total: " . 1 + 2` vale `"Total: 3"`.
- **`echo false` no imprime nada.** Sale una cadena vacía, mientras que `echo true` sale `1`. Por eso una comparación falsa no ocupa lugar en pantalla.
- **`echo` de un array escribe `Array`**, y para ver el contenido de verdad hay que usar `var_dump`, que enseña además el tipo: `int(5)`, `string(4) "Hola"`.
- **El tipo se deduce, no se declara**: `$x = 5; $x = "texto";` es perfectly válido, y el tipo se recalcula en cada asignación.
- **`/` devuelve entero solo si la división es exacta**: `6 / 2` es `3`, pero `7 / 2` es `3.5`.
- **`==` convierte tipos y `===` no**: `"5" == 5` es `true`, pero `"5" === 5` es `false`.
- **Una variable que no existe no es `null`: no existe**, y eso se comprueba con `isset`. Además `isset($a)` es `false` si `$a` vale `null`.
- **El paso por referencia es la clave del lenguaje**: `function subir(&$n)` enlaza la variable con la de quien llama, así que al sumarle 1 fuera se ve el cambio. Sin `&` la función recibe una copia. `foreach ($a as &$v)` funciona igual, y también `unset($a)`.
- **Fuera de `<?php ?>` no hay código, hay plantilla**: el HTML se copia tal cual y el navegador recibe la página ya resuelta. El motor reproduce ese HTML con el PHP sustituido, que es lo que hace posible el módulo de "PHP en la web". También admite `<?= $variable ?>`.
- **PHP se come el salto de línea que va justo después de `?>`.** Por eso las plantillas dejan la etiqueta pegada al texto.

Los avisos también son los de PHP: leer una clave que no existe escribe `Warning: Undefined array key 5` y devuelve `null`, en vez de romper el programa.

Lo que **no** cubre (clases y objetos, `require`/`include`, sesiones, namespaces, closures, SQLite) se explica como concepto en los módulos finales, sin pedir código que lo use. Si alguien escribe `->`, el motor avisa de que las clases no entran en el curso y sugiere que igual quería una variable.

### El intérprete de Go (goengine.js)

Go tampoco se ejecuta en el navegador, así que tiene su propio intérprete. Es el que más código ha costado de escribir, porque Go tiene sintaxis que no se parece a nada de los otros cursos del proyecto: `:=`, literales de struct, receivers de valor o de puntero, varios valores de retorno y un `error` en lugar de excepciones. También tiene la única diferencia sintáctica de bucle: **una sola palabra clave, `for`, con tres formas**.

Respeta la semántica real de Go, que es donde más se distingue de los demás:

- **`:=` declara y `=` reasigna**. Escribir `:=` dos veces sobre la misma variable da un error que dice exactamente eso, porque es el error nº1 al empezar y no hay forma de deducirlo solo.
- **El tipado es estático y no convierte nada solo**: `var x int = 3.5` no compila, y el mensaje dice que hay que escribir `int(...)` a propósito. La excepción son las constantes sin tipo: `var x float64 = 5` sí vale, porque un literal numérico se adapta al tipo que le pidan.
- **La división entre enteros trunca**: `7 / 2` es `3` y `-7 / 2` es `-3`, hacia cero y no hacia -infinito. Convierte a `float64` para tener decimales.
- **Los float se escriben en su forma más corta**: `5.0` sale `5` y `0.1+0.2` sale `0.30000000000000004`, tal cual.
- **`Println` mete un espacio entre cada valor y salta de línea; `Print` no hace ninguna de las dos cosas**.
- **El `switch` NO tiene fallthrough**: cada caso termina solo, y no hace falta `break`. Es la diferencia más importante con C, Java o JavaScript. Y sin expresión, lo que hay en cada `case` es una condición y se ejecuta el primer caso cierto.
- **Las llaves del `if` son obligatorias** siempre, incluso con una sola línea.
- **`if v, ok := m["k"]; ok` abre su propio ámbito**: `v` existe dentro del `if` y fuera no. Por eso ese patrón es seguro aunque la clave no exista.
- **No hay `while`**: el equivalente es `for i < 5 { }` y el bucle infinito es `for { }`. Las goroutines y los canales se explican como concepto en un módulo entero, sin pedir código que dependa de ellos.
- **Los parámetros y los receivers de valor reciben una COPIA**. Un método con receptor de valor no puede modificar el struct de fuera, y con receptor de puntero (`func (c *Contador) Suma()`) sí. Esa diferencia se enseña con dos ejercicios que dan lo mismo y producen exactamente el resultado contrario.
- **Un método de puntero se puede llamar sobre una variable normal**: Go le toma la dirección solo. Y un método de valor también se puede llamar sobre un puntero.
- **`for i, v := range x` respeta los nombres que pone el alumno**: `for ciudad, gente := range mapa` también funciona, y con un solo nombre ese nombre es el índice.
- **`var p *int` vale `nil`**, así que desreferenciarlo avisa de que es un puntero nil en vez de dar un 0 cualquiera.
- **El error va en el valor de retorno**: `(int, error)`, y `nil` significa que no ha pasado nada y se imprime como `<nil>`.

Los errores son los de Go: si lees una variable que no declaraste, el índice de un slice que no existe o una función que no existe, avisa con un mensaje que explica el problema y, cuando puede, **cómo se arregla**: "para reasignar usa = y no :=", "conviértelo con float64(...)", "el tipo X no tiene ningún campo Y (tiene: a, b, c)".

Lo que **no** cubre (goroutines reales, canales, `select`, generics, `reflect`, sincronización) se explica como concepto en un módulo entero, sin pedir código que lo use. Si alguien escribe `go f()`, el motor avisa de que las goroutines no se ejecutan aquí en vez de fingir que sí.

### Ejercicios con respuesta libre

Hay ejercicios cuya respuesta correcta depende de una decisión del alumno, como el nombre que pone en su tarjeta de presentación. Esos no pueden llevar la respuesta en el `expected`, porque entonces solo aprobaría quien escribiera lo mismo que el autor.

Para eso, el `expected` admite un comodín `{{algo}}`: vale cualquier texto no vacío de esa línea. Todo lo demás se sigue comparando con exactitud, y también el número de líneas.

```js
// Acepta cualquier nombre, pero las otras dos líneas tienen que ser exactas
tests: [{ expected: 'Nombre: {{tu nombre}}\nLenguaje favorito: Python\nNivel: Principiante\n' }]
```

La app y los tests usan la **misma** función para comparar (`Engine._coincideSalida`). Eso no es un detalle: cuando cada uno comparaba por su cuenta, los tests daban verde y el alumno suspendía.

### El enunciado tiene que decir qué hacer

Un hueco de operador es un acertijo si el enunciado no lo aclara. `while cuenta ___ 5` con opciones `<=`, `<`, `>=` y `==` no dice si el bucle tiene que llegar o no al 5.

Regla práctica: **el enunciado dice qué tiene que hacer el código, no solo qué palabras faltan**. Y cuando el hueco es un operador o un símbolo, tiene que quedar claro cuál es. Hay un test que lo revisa en los 9 cursos.

### Un enunciado no puede mentir

El peor fallo posible en un curso de programación es que el enunciado diga una cosa y el ejercicio compruebe otra. El alumno escribe la solución correcta, la app la marca mal y no encuentra el error: no es que no sepa, es que el curso le mintió. Pierde la confianza en todo lo demás y con razón.

Por eso `tests/curricula.test.js` ejecuta el temario entero y comprueba que **cada solución imprime exactamente lo que su enunciado promete**. No con una comparación suelta, sino con la misma función que usa la app (`Engine._coincideSalida`), para que no pueda pasar lo de antes: tests en verde y alumno suspender.

Lo que se comprueba en los 9 cursos:

| Qué | Por qué importa |
|-----|-----------------|
| Cada `type-code` imprime su `expected` | La solución del autor es la respuesta que el alumno tiene que dar |
| La opción buena de cada `predict-output` es la salida real | Si está mal marcada, el alumno acierta y suspende |
| Ninguna otra opción también sería correcta | Si dos opciones valen lo mismo, no hay forma de saber cuál elegir |
| `correct` apunta a una opción que existe | Un índice fuera de rango hace el ejercicio injugable |
| No hay opciones repetidas | Dos opciones idénticas hacen la respuesta ambigua |
| Un `___` por cada elemento de `blanks` | El renderer sustituye los huecos usando `blanks.length` |
| Cada `blanks` está entre las `options` | Si no, la respuesta buena no está en el banco de palabras |
| Todo ejercicio trae `explanation` | Sin explicación, quien falla no sabe qué hacer |
| Ningún id se repite entre cursos | El progreso se guarda por id: repetirlo aprobaría por error |
| La cifra de la portada cuadra | `index.html` afirma N módulos y N ejercicios; si se queda viejo, la web miente sobre su contenido |

SQL es la excepción en la comparación de `predict-output`: allí las opciones son el **valor** que se quiere saber ("6", "Ana y Luis") y no la tabla que imprimiría `psql` con cabeceras y "(3 filas)". Se comprueba que lo que afirma la opción esté de verdad en la salida, en vez de compararla literalmente.

Esto no sustituye a probar en el navegador, pero es la red que avisa de un enunciado desfasado en cuanto se escribe, no tres cursos después.

## Sistema de Gamificación (independiente por lenguaje)

El nombre del perfil es compartido, pero nivel, XP, racha, vidas, progreso y logros se guardan por separado en cada curso (`courses[lang]` en el estado v3; el estado v2 se migra solo).

### XP y Niveles
- Cada ejercicio otorga XP (10-40 puntos)
- Al alcanzar `xpToNext` se sube de nivel
- `xpToNext` aumenta un 40% cada nivel

### Rachas
- Se incrementa al estudiar días consecutivos
- Se reinicia si pasa más de 1 día sin estudiar

### Vidas
- Empiezas con 5 vidas
- Pierdes 1 vida al fallar un ejercicio
- Se recargan automáticamente cada 30 minutos

### Logros (14 disponibles)
- Primera Lección, En Racha, Semana Perfecta, Imparable
- 500 XP, 2000 XP, Maestro, Perfeccionista
- Primer Módulo, Medio Camino, Velocista
- Nivel 5, Nivel 10, Pythonista

### Liga (ranking en pantalla)
- Tu perfil real siempre aparece, con tu XP real y la marca `(Tú)`
- Se completa con bots de relleno (marcados con 🤖) y, si lo activas, con usuarios reales del servidor
- Cada usuario real tiene un `id` estable generado al iniciar (para el ranking online)
- Ver "Liga (ranking)" arriba para el detalle de los bots y cómo desactivarlos

## Personalización

### Cambiar colores
Edita las variables CSS en `style.css`:
```css
:root {
  --primary: #7C5CFC;
  --cyan: #00D4FF;
  --green: #00E87A;
  /* ... */
}
```

### Añadir ejercicios

Edita el currículum del lenguaje correspondiente (`curriculum.js` para Python, o el fichero en `curriculums/` para el resto) y añade ejercicios a las lecciones existentes o crea módulos nuevos.

**Reglas obligatorias al escribir un ejercicio** (los tests de `tests/curriculum.test.js` las verifican y fallan la build si no se cumplen):

| Regla | Motivo |
|---|---|
| `explanation` en **todos** los tipos | Al fallar es lo primero que ve el alumno |
| `solution` en `type-code` | Es lo que se muestra en el bloque "Cómo se resuelve" |
| `correct` dentro de rango | Índice de la opción buena |
| `correctOutput` dentro de rango | Índice de la salida buena |
| Un `___` por cada `blanks` | Si no, el ejercicio es irresoluble |
| `options.length >= blanks.length` | Faltan opciones para algún hueco |
| Ninguna opción repetida en `choices` u `options` | Si hay dos iguales, el alumno no puede elegir |
| Solo una opción que valga por hueco | Si dos valen, el alumno no sabe qué poner |
| `correctOrder` con todos los índices | Orden de los bloques |
| `tests[0].expected` = salida real de `solution` | Un test que nunca pasa bloquea al alumno |
| `tests[0].contains` si pides estructura | El runner solo mira la salida; `contains` mira el código |
| `expectError: true` si el código falla a propósito | Hay ejercicios que preguntan justo por el error |
| `question` que diga **qué tiene que hacer** el código | Un `100 ___ 37` sin más es una adivinanza: hay que decir "Calcula 100 menos 37" |
| Comodín `{{...}}` si la respuesta depende del alumno | Un ejercicio de tarjeta no puede exigir el nombre del autor |
| Solo español | Hay un test que detecta caracteres de otro alfabeto |

Los runners son puros y deterministas, así que las soluciones se pueden ejecutar en los tests: `runPython` (Skulpt), `runJavaScript` (captura `console.log`), `runHtml` (DOMParser → texto visible), `runCss` (analizador de reglas), `runSql` (`sqlengine.js`) y `runJava` (`javaengine.js`). Ejecutar la solución de un ejercicio nuevo antes de escribir su `expected` evita la mitad de los errores.

Para SQL y Java hay además un test que comprueba que la opción correcta de `predict-output` sea coherente con lo que el motor imprime de verdad, porque la opción es una abreviatura y es fácil que se quede desfasada.

### Cambiar gamificación
Modifica los valores en `app.js`:
- `DEFAULT_STATE.user.xpToNext` — XP necesaria para nivel
- `DEFAULT_STATE.user.maxLives` — Vidas máximas
- `refillLives()` — Tiempo de recarga de vidas

## Responsive Design

- **Móvil**: Diseño optimizado para pantallas < 480px
- **Tablet**: Adaptación automática con grid responsive
- **Escritorio**: Max-width 480px centrado (estilo app móvil)

## Accesibilidad

- Navegación por teclado en ejercicios
- `aria-labels` en botones de iconos
- Colores con contraste adecgado
- Animaciones respetan `prefers-reduced-motion`

## SEO

- Título: "DevQuest — Aprende a programar sin límites"
- Descripción: "Aprende Python, JavaScript, HTML, CSS, SQL, Java, C++, PHP, Go y TypeScript desde cero hasta proyectos reales. Lecciones interactivas estilo Duolingo, sin límites de tiempo."
- Theme color: `#0D0D26`

## Seguridad

### Medidas implementadas

**Frontend (navegador):**
- **Content Security Policy (CSP)** en `index.html`: restringe scripts a `self` y CDN de Skulpt, estilos a `self` con `unsafe-inline` solo para estilos dinámicos, imágenes a `self` y `data:`, fuentes a `self`, conexiones a `self` y `https:`. Previene XSS inyectando scripts desde orígenes no autorizados.
- **Escape de HTML sistemático**: Tanto `Engine._escapeHtml()` como `App._escapeHtml()` escapan `&`, `<`, `>`, `"`, `'` antes de inyectar cualquier dato en `innerHTML`. Todos los puntos de interpolación de datos de usuario (nombres, emojis, textos de ejercicios, mensajes de error) usan estas funciones.
- **Ejecución de código en sandbox**: Los ejercicios `type-code` usan `new Function()` con `"use strict"` y un `console` personalizado que solo captura `log`. El código del usuario no tiene acceso directo a `document`, `window`, `fetch`, `localStorage` ni APIs peligrosas.
- **Validación de JSON del DOM**: Al leer `dataset.filled`, `dataset.blanks`, `dataset.correctOrder`, se usa `JSON.parse` dentro de `try/catch` para que datos corruptos no rompan la app.
- **Sin `eval()` ni `document.write`**: El código no usa patrones peligrosos; solo `new Function()` en los dos motores que lo necesitan (JavaScript y TypeScript), y ambos limitan el scope.

**Backend (Node.js):**
- **JWT_SECRET obligatorio en producción**: `config.js` lanza error si no está definido en `NODE_ENV=production`. En desarrollo usa un valor por defecto solo para facilitar el arranque.
- **CORS restringido en producción**: `CORS_ORIGIN` es obligatorio en producción; en desarrollo permite `*` solo para facilitar desarrollo local.
- **Hash de contraseñas con scrypt**: `crypto.js` usa scrypt con salt aleatorio por usuario (N=16384, r=8, p=1), no MD5/SHA.
- **JWT stateless (HS256)**: Tokens firmados con expiración configurable (7 días por defecto), sin sesiones en servidor.
- **Rate limiting en auth**: 30 peticiones por minuto e IP en endpoints de login/registro/contacto, con limpieza periódica de entradas antiguas.
- **Sentencias preparadas en SQLite**: Todas las queries usan placeholders `?`, sin concatenación → sin inyección SQL.
- **Validación en servidor y cliente**: Email, longitudes y campos requeridos se validan en ambos lados.

### Superficie de ataque reducida
- Archivo `pyquest.db` (base de datos legada) eliminado.
- Funciones duplicadas de validación de email unificadas en comentarios (mismo regex en 3 lugares, mantenido sincronizado intencionadamente).
- No hay código muerto en `app.js` ni `engine.js` que ejecute lógica innecesaria.

## Pendientes

- [ ] `course_id` en el backend para ranking por lenguaje en el servidor
- [ ] Envío real de email desde el sitio publicado (hoy funciona por `mailto:`; ver la sección de Contacto)
- [ ] Modo claro/oscuro (toggle en perfil)
- [ ] Añadir búsqueda de lecciones
- [ ] Mejorar feedback de errores con pistas progresivas
- [ ] Añadir navegación por teclado completa
- [ ] Implementar sistema de repetición espaciada
- [ ] Añadir desafíos diarios

- [x] Curso de TypeScript (10 módulos, 22 lecciones, 127 ejercicios) con verificador de tipos propio (`tsengine.js`)
- [x] Curso de Go (14 módulos, 25 lecciones, 161 ejercicios) con intérprete propio
- [x] Curso de PHP (12 módulos, 20 lecciones, 120 ejercicios) con intérprete propio, arrays y paso por referencia incluidos
- [x] Curso de C++ (14 módulos, 25 lecciones, 150 ejercicios) con intérprete propio, punteros y memoria incluidos
- [x] Curso de Java (14 módulos, 24 lecciones, 144 ejercicios) con intérprete propio
- [x] Curso de SQL (14 módulos, 27 lecciones, 162 ejercicios) con motor propio
- [x] Curso de Python (14 módulos, 40 lecciones, 230 ejercicios) con Skulpt
- [x] Curso de JavaScript (14 módulos, 43 lecciones, 258 ejercicios) nativo
- [x] Curso de HTML (14 módulos, 23 lecciones, 138 ejercicios) con DOMParser
- [x] Curso de CSS (14 módulos, 25 lecciones, 150 ejercicios) con analizador propio
- [x] `curricula.test.js`: ejecuta las soluciones de los 10 temarios y comprueba que cada enunciado dice la verdad
- [x] Seguridad: CSP, escape HTML, JWT obligatorio en producción, CORS restringido
- [x] Código limpio: sin morralla, sin `pyquest.db`, sin código muerto
- [ ] Añadir más tests de integración
- [ ] Implementar modo claro/oscuro
- [ ] Añadir búsqueda de lecciones
- [ ] Mejorar feedback de errores con pistas progresivas
- [ ] Añadir navegación por teclado completa
- [ ] Implementar sistema de repetición espaciada
- [ ] Añadir desafíos diarios

## Historial de Cambios

### v2.22.0 (2026-10-06)
- 🐹 **Curso de Go completo**: 14 módulos, 25 lecciones y 161 ejercicios (`curriculums/go.js`). Con esto son **9 cursos completos: 124 módulos, 252 lecciones y 1.513 ejercicios**, y el último en llegar ha sido TypeScript.
- Nuevo intérprete de Go (`goengine.js`), escrito desde cero y con cero dependencias. Es el que más ha costado de los cinco, porque la sintaxis de Go no se parece a nada de los otros cursos: `:=`, literales de struct, receivers de valor o de puntero, varios valores de retorno y un `error` en lugar de excepciones. También tiene la única diferencia sintáctica de bucle del proyecto: **una sola palabra clave, `for`, con tres formas**.
- **Respeta la semántica real de Go**, que es justo donde se distingue: `:=` declara y `=` reasigna; el tipado es estático y no convierte nada solo (`var x int = 3.5` no compila y el mensaje dice cómo arreglarlo); la división entre enteros trunca hacia cero, así que `-7 / 2` es `-3`; los float se escriben en su forma más corta (`5.0` sale `5`); `Println` mete espacios y `Print` no; y **el switch no tiene fallthrough**, cada caso termina solo.
- **Los receivers de valor reciben una copia de verdad.** Con puntero (`func (c *Contador) Suma()`) el método sí modifica el struct de fuera; con valor no. Eso se enseña con dos ejercicios que dan lo mismo y producen el resultado contrario, y es el error que más caro sale cuando se confunde.
- Las goroutines y los canales tienen **un módulo entero para explicarlos como concepto**, sin pedir código que dependa de ellos. Si alguien escribe `go f()`, el motor avisa de que no se ejecutan aquí en vez de fingir que sí.
- 🐛 **Catorce fallos del intérprete encontrados probándolo**, no con los tests: la lista de palabras clave incluía `make` y `new`, así que `make([]int, 3)` se parseaba como una conversión de tipo; el `switch` sin expresión no consumía la llave y se atragantaba con el primer `case`; `make([]int, 3)` cogía el tipo del slice entero en vez del elemento, así que llenaba la lista de slices vacíos; `var p Punto` no creaba un struct real y `p.x` fallaba; `for i := range x` no definía la variable del índice; `range` ignoraba los nombres que pone el alumno (`for ciudad, gente := range mapa`); `var p *int` apuntaba a ceros en vez de ser `nil`, así que desreferenciarlo daba `0` en vez de avisar; el receptor de valor compartía el struct en vez de copiarlo, así que `cont.n++` sí se veía desde fuera; `buscar` leía la caja y no la memoria, y por eso `p := &x; *p = 10` no cambiaba `x`; `string(65)` devolvía `"65"` en vez de `"A"`; el `if` con inicialización no abría ámbito y dejaba la variable viva fuera; `switch { case n > 10: }` comparaba en vez de tratar el caso como condición; y dos métodos más con el mismo nombre, `escribirEn`, se pisaban entre sí, así que definir una variable escribía en memoria a través de la función que asigna expresiones.
- 🧩 **En una clase los métodos NO se separan con comas.** Es de objetos literales. Intentarlo da `SyntaxError: Unexpected token ','` en el propio motor de JavaScript, y `node --check` lo detecta antes que nada.
- 🧪 **81 tests nuevos** del intérprete de Go, uno a uno por cada cosa que más se aparta de los otros cursos. Total: **666 tests en verde** (629 de frontend + 37 de servidor).
- 🧪 Los seis ejercicios con el enunciado o el `expected` desfasados que sortie el test de coherencia: uno afirmaba que el bucle imprimía "246" pegado cuando son tres líneas, y cuatro `fill-blank` no tenían ningún hueco `___` en el código (el `func` ya venía escrito, o el `:=` ya estaba puesto), así que eran injugables.
- 🔎 Verificado en el navegador con el camino real de la app: los 25 `type-code` de Go se ejecutan desde el editor y su salida valida, los 24 `fill-blank` aceptan la respuesta correcta y **rechazan** una incorrecta, y los 112 de opción múltiple devuelven explicación al fallar.

### v2.21.0 (2026-10-06)
- 🐘 **Curso de PHP completo**: 12 módulos, 20 lecciones y 120 ejercicios (`curriculums/php.js`). Con esto son **8 cursos completos: 110 módulos, 227 lecciones y 1.352 ejercicios**, y el último en llegar ha sido TypeScript.
- Nuevo intérprete de PHP (`phpengine.js`), escrito desde cero y con cero dependencias. Es el subconjunto del curso: variables con `$`, `echo`, arrays con índice o con clave, `foreach`, funciones con paso por valor y **por referencia**, `switch`, `var_dump` y unas 30 funciones de biblioteca de texto y array.
- **La semántica de PHP es lo importante del motor**, porque es donde más se parece a ser PHP y menos a los demás lenguajes del curso. `+` convierte a número y `.` concatena; `echo false` no imprime nada; `echo` de un array escribe `Array`; `/` solo devuelve entero si la división es exacta; `==` convierte tipos y `===` no; y una variable sin crear no es `null`, no existe, y eso se comprueba con `isset`.
- **El paso por referencia funciona de verdad**: `function subir(&$n)` enlaza la variable con la de quien llama, así que al sumarle 1 fuera se ve el cambio. `foreach ($a as &$v)` también. Es el corazón del curso de funciones y es la diferencia que más se echa de menos cuando vienes de otro lenguaje.
- **Modo mixto HTML + PHP**: fuera de `<?php ?>` no hay código, hay plantilla. El motor copia el HTML tal cual y lo devuelve con el PHP ya sustituido, que es lo que hace posible el módulo de "PHP en la web". También admite `<?= $variable ?>` y reproduce el detalle real de que PHP se come el salto de línea que va justo detrás de `?>`.
- 🐛 **El punto tenía la misma precedencia que el `+`.** En PHP 8 el `.` es más flojo, así que `"Total: " . 1 + 2` vale `"Total: 3"`. Con el parser anterior se obtenía un `NaN`, y un ejercicio del módulo 8 lo hacía aparecer. El parser ahora separa `concatenacion()` de `adicion()`.
- 🐛 **Ocho fallos del intérprete encontrados probándolo**, no con los tests: `**` no estaba en el léxico ni en el parser; `elseif` no estaba contemplado porque el `if` restaba una posición y esperaba un `if`; `for ($i = 1; ...)` fallaba porque las asignaciones no se parseaban dentro del `for`; `foreach ($a as $k => $v)` leía las variables al revés; `case 1:` con dos puntos no se aceptaba; `$a[] = "x"` (añadir al final) no estaba; `str_replace` tenía los tres argumentos en orden equivocado, así que `str_replace("-", "+", "a-b")` devolvía `"+"`; las funciones de la biblioteca perdían su tipo al devolver, con lo que `explode` dejaba de ser un array; y `implode` no aceptaba los argumentos en el orden que PHP admite.
- 🐛 **`this.salida += expr` perdía lo que escribiera esa misma expresión.** El motor de JavaScript lee el valor viejo del miembro **antes** de evaluar el lado derecho, así que un `Warning: Undefined array key` emitido al leer `$a[5]` dentro de `var_dump($a[5])` se quedaba con el valor viejo y se perdía. Ahora el texto se calcula antes de tocar la salida.
- 🐛 **`foreach ($a as &$v)` metía un valor dentro de otro** en vez de sustituirlo, y al imprimir el array salía `[object Object]`. Ahora guarda el mapa y la clave, y reemplaza la entrada entera.
- 🧪 **El test que valida los enunciados pasa a ser genérico y cubre los 8 cursos** (`curricula.test.js`, 42 tests). Ejecuta las soluciones de los cuatro cursos con motor y comprueba que **cada una imprime exactamente lo que su enunciado promete**, usando la misma función que la app. Antes solo se validaba PHP a mano.
- 🧪 Ese test destapó **un error de contenido que llevaba tiempo en el temario de SQL**: el ejercicio del `INNER JOIN` afirmaba 3 filas, pero la tabla de préstamos tiene dos de Ana, así que son 4. La explicación además estaba corrupta ("los tres socios queKFHan pedido"). Corregido, y ahora la explicación aprovecha para enseñar que el `JOIN` **no elimina duplicados**.
- 🧪 Other requisitos del renderer que también se comprueban ahora: un `___` por cada elemento de `blanks` (el renderer sustituye los huecos usando `blanks.length`, así que dos `blanks` para un hueco hacían el ejercicio injugable) y que cada `blanks` esté entre las `options`. También que ningún `id` se repita entre cursos: el progreso se guarda por id, así que Repebir uno aprobaría el otro por accidente.
- 🧪 La cifra de la portada (`8 lenguajes · 110 módulos · 227 lecciones · 1.352 ejercicios`) **se comprueba contra los ficheros**. Si se queda vieja, el test falla: la web estaría mintiendo sobre su contenido.
- 🔎 Verificado en el navegador con el camino real de la app: los 20 `type-code` de PHP se ejecutan desde el editor y su salida valida, los 20 `fill-blank` aceptan la respuesta correcta y **rechazan** una incorrecta, y los 80 de opción múltiple devuelven explicación al fallar.
- Total: **578 tests en verde** (541 de frontend + 37 de servidor).

### v2.20.0 (2026-10-06)
- 🐛 **Los 235 ejercicios de `fill-blank` no mostraban su enunciado.** El renderer ponía un texto genérico ("Selecciona las palabras correctas para completar el código") y descartaba la `question` que el ejercicio ya traía escrita. El alumno se encontraba `100 ___ 37` sin saber si tenía que sumar o restar: era una adivinanza. Ahora se ve la pregunta del ejercicio.
- ✏️ **Seis enunciados vagos reescritos** en Python, JavaScript, Java y C++. El más grave era "Completa el contador" sobre un `while cuenta ___ 5`: con cuatro operadores como opciones no había forma de saber si el bucle debía incluir el 5. Ahora dice "para que llegue a imprimir el 5, no solo hasta el 4".
- 🏷️ **Los ejercicios con respuesta personal ya no la fijan.** La tarjeta de presentación de Python y JavaScript y los ejercicios de "imprime tu nombre" de Java y C++ traían el nombre del autor metido en el `expected`, así que un alumno que escribiera el suyo suspendía sin tener nada mal. Ahora el `expected` admite un comodín `{{...}}`: el nombre es libre y todo lo demás sigue siendo exacto.
- 🔗 **La app y los tests comparan la salida con la misma función.** Estaban cada una por su cuenta, y por eso los tests daban verde mientras el alumno suspendía: justo el tipo de fallo que no se ve si no lo pruebas de verdad.
- 🧪 13 tests nuevos: el comodín (acepta nombres, pero no relaja nada más), el renderer del `fill-blank`, y un test que revisa los 235 ejercicios de los 7 cursos buscando huecos de operador sin pista. Total: **469 tests en verde**.

### v2.19.0 (2026-10-06)
- Curso de C++ completo: 14 módulos, 25 lecciones y 150 ejercicios (`curriculums/cpp.js`). Con esto son **7 cursos completos: 98 módulos, 207 lecciones y 1.232 ejercicios**.
- Nuevo intérprete de C++ (`cppengine.js`), escrito desde cero y con cero dependencias, porque no hay compilador en el navegador. **Modela la memoria con direcciones reales**, que es lo que hace falta para que el temario de punteros sea ejecutable: `*p = 10` cambia la original, `p++` avanza al siguiente elemento, y `new`/`delete` gestionan direcciones concretas.
- Respeta la semántica real de C++: `cout` escribe `5.0` como `5` y `0.1 + 0.2` como `0.3` (6 dígitos significativos), los `bool` salen como `1`/`0`, y la división entre enteros trunca. Son justo las diferencias que más sorprenden al venir de Java.
- Referencias y punteros son **dos tipos distintos** en el motor. Al principio se confundían y `int& r` se comportaba como un puntero, así que `r * 2` no funcionaba dentro de una función. Una referencia es un alias transparente; el puntero guarda una dirección y necesita el asterisco. Esa diferencia es el corazón del módulo.
- Ocho fallos del intérprete encontrados probándolo, no con los tests: el `<<` de `cout` se parseaba como desplazamiento de bits y se comía el `endl`; `1.0` perdía el tipo y `7 / 2.0` daba 3; el `;` tras un `struct` se exigía siempre; faltaba la inicialización directa `Punto p(3, 4)`; las referencias creaban una celda nueva en vez de ser un alias; las direcciones de los argumentos por referencia se resolvían ya dentro del nuevo ámbito; `v[i]` no miraba los vectores; y el mapa de campos se guardaba en la clase en vez de en el objeto, así que dos instancias compartían valores.
- La gestión de memoria **avisa en vez de dar sustos**: usar memoria liberada, liberarla dos veces, desreferenciar un `nullptr` o meter un número en un puntero, dan un mensaje que explica el problema.
- Los ejercicios de `new`/`delete` **exigen el `delete`**. Como solo se comparaba la salida, un alumno que se saltaba el borrado aprobaba igual: el ejercicio no enseñaba lo que decía enseñar. Se usa `tests[0].contains` y hay un test que lo comprueba.
- 100 tests del intérprete de C++ y 6 del currículum. Todos los `type-code` se ejecutan de verdad, así que si una solución cambia, `tests[0].expected` se queda desfasado y falla la build. Total: **461 tests en verde**.

### v2.18.0 (2026-10-06)
- ☕ **Curso de Java completo**: 14 módulos, 24 lecciones y 144 ejercicios (`curriculums/java.js`). Con esto son **6 cursos completos: 84 módulos, 182 lecciones y 1.082 ejercicios**.
- ☕ **Nuevo intérprete de Java (`javaengine.js`)**, escrito desde cero y con cero dependencias, porque no hay JVM en el navegador. Cubre variables, operadores, condicionales, bucles, métodos, arrays, `String`, y varias clases en el mismo fichero con constructores, campos y métodos de instancia.
- 🎯 **Respeta la semántica real de Java**, que es donde más se tropieza: la división entre enteros trunca (`7 / 2` es `3`), `+` concatena en cuanto hay un `String`, los `double` se imprimen con decimales (`5.0`) y las llaves de un `if` o un bucle forman un ámbito propio.
- 🐛 **Cuatro fallos del intérprete encontrados probándolo en el navegador, no con los tests**: `print` no compartía línea con el `println` siguiente; al asignar a una posición del array se guardaba el valor ya envuelto y `println` pintaba `[object Object]`; `new Clase()` fallaba porque la rama consumía el paréntesis dos veces; y usar una variable local de un método desde otro no daba error, porque no había separación entre ámbitos.
- 💬 **Los errores explican el porqué, no solo el qué.** Declarar un acumulador dentro de un bucle da un mensaje que explica que las llaves son un ámbito propio. Una clase o un campo inexistente lista los miembros que sí existen. Un bucle infinito y un índice fuera de rango avisan en vez de colgar la pestaña.
- 🐛 **El código que no compila también enseña la solución.** Antes, pulsar Comprobar con un error de sintaxis solo sacaba un aviso de "ejecuta el código primero", que es justo cuando más ayuda hace falta. Ahora se muestra la explicación, el mensaje del intérprete y la solución completa.
- 🧪 **100 tests del intérprete de Java** y 5 del currículum. Todos los `type-code` se ejecutan de verdad en los tests: si una solución cambia, `tests[0].expected` se queda desfasado y falla la build. Total: **355 tests en verde**.
- 📚 Contador de la portada y description actualizados.

### v2.17.0 (2026-10-05)
- 🐛 **El formulario de contacto no funcionaba en el sitio publicado.** `DEVQUEST_API_URL` apuntaba a `localhost:3001`, y GitHub Pages es estático: allí no se ejecuta Node, así que el `fetch` fallaba siempre y el mensaje acababa en `localStorage`. Lo comprobé contra la URL real.
- 📬 **Nuevo `contact.js` con tres vías de envío** que se prueban en orden: API propia → servicio de formularios → **`mailto:`**. La última **siempre funciona sin configurar nada**, así que el contacto ya no está roto. Si una vía falla se pasa a la siguiente; el módulo nunca lanza.
- 🧹 La lógica del contacto sale de `app.js` (que ya iba muy largo) a un módulo aparte, testeable y con la validación compartida con el servidor.
- 💬 Texto de bienvenida actualizado: "Aprende Python, JS, SQL y muchos más... desde cero hasta proyectos reales. Sin límites de tiempo." También la meta descripción y el contador de contenido (5 lenguajes · 70 módulos · 158 lecciones · 938 ejercicios, que ya era solo de Python).
- 🧪 25 tests del módulo de contacto: validación, construcción del enlace `mailto:`, recorte de mensajes largos, las tres vías, el orden de preferencia y la garantía de que nunca lanza.

### v2.16.0 (2026-10-05)
- 📬 **Formulario de contacto** al final de la pantalla de Perfil: botón "¿Tienes alguna consulta? Contáctanos" que despliega un formulario (nombre, email, asunto, mensaje). Envía a `duckdev77@gmail.com`.
- ✅ `POST /api/contact` en el servidor + tabla `contact_messages`. El mensaje **se guarda siempre**, aunque el envío por email falle: perder el mensaje de un usuario es peor que avisarle de que el email va tardando.
- 📧 `server/src/mailer.js`: envío por SMTP (con STARTTLS y AUTH LOGIN) o por API de transactional (Resend), sin dependencias. `enviarEmail` nunca lanza; devuelve `{ ok, via, error }`.
- 🔒 El endpoint de contacto tiene el mismo rate-limit que el login, y valida los campos en cliente y en servidor.
- 🧪 20 tests del contacto: persistencia, validación, envío fallido sin perder nada, orden de la lista, endpoints y rate-limit.
- 🐛 Corregido un fallo silencioso en `engine.js`: al validar opciones se usaba `??`, que descarta el `0` (un índice válido). Ahora la opción correcta de un ejercicio se detecta bien aunque sea la primera.

### v2.15.0 (2026-10-05)
- 🦆 **El pato se mueve al final de la pantalla de Perfil**, debajo de los logros. Ahora forma parte de una firma (logo + "PatoDev" + "Hecho para aprender a programar de verdad"), así que parece un elemento de la app y no un botón suelto. Sigue abriendo el modal del modo administrador.
- 🗑️ Fuera el pie flotante de bienvenida/hub con el pato (`welcome-footer`), y con él el arreglo de `position: fixed` dentro de pantallas transformadas que ya hacía falta.
- 🧪 El test del pato ahora valida el `index.html` real (posición dentro de la pantalla de perfil, un solo botón admin, sin restos del pie). El mock del DOM es genérico y no reproduce la estructura, así que daría falsos positivos.

### v2.14.0 (2026-10-05)
- 🐛 **El pato no se veía.** Estaba en el pie de la pantalla de bienvenida, pero `init()` salta directo al hub cuando el usuario ya tiene nombre guardado, así que quien ya se había registrado nunca llegaba a verlo. Ahora el botón aparece en **bienvenida y hub** (`ADMIN_SCREENS`), sube en el hub para no tapar la barra de navegación y se sube la opacidad del 50% al 75%.
- 🏆 **Liga con jugadores de relleno** (`LEAGUE_BOTS`): 12 bots de 780 a 12.480 XP para que el ranking no se vea vacío. El usuario se coloca en su posición real por XP, los bots se marcan con 🤖 y hay un aviso al pie de la lista. Si un usuario real del servidor se llama igual que un bot, el bot se descarta.
- 🧪 `tests/league.test.js` reescrito: los tests antiguos afirmaban que la liga solo debía mostrar al usuario real, así que fallaban con los bots.
- 🧪 Corregido el mock de `classList.toggle` en `tests/setup.js`: ignoraba el segundo argumento (fuerza), que el DOM real sí acepta. Esto ocultaba errores reales.
- 🧪 8 tests de liga + 1 del pie del pato.

### v2.13.0 (2026-10-05)
- 🦆 **PatoDev en el pie de la pantalla de inicio**: botón con el logo que abre un modal con la contraseña `administrador`. Al entrar bien se activa el **modo administrador** y se abren todos los módulos y lecciones de todos los cursos para poder testear el contenido.
- 🖼️ El logo se ha copiado a `assets/img/pato-logo.png` (512px, original) y `assets/img/pato-logo-128.png` (el que usa el botón). **Se eligió el PNG porque tiene fondo transparente** (49,6% de píxeles con alfa 0); el WebP se deja sin usar.
- 🔐 La contraseña no está en claro en el código: se compara con su hash FNV-1a (`ADMIN_HASH`). **Ofusca, no cifra** — el modo administrador es una puerta para testear, no seguridad real.
- 🐛 **Arreglo de layout**: el pie iba dentro de `#screen-welcome`, que tiene un `transform` de animación. Eso hace que el navegador trate sus descendientes `position: fixed` como `absolute`, y el pato acababa fuera de pantalla. El pie es ahora hermano de las pantallas, dentro de `#app`.
- 🧪 8 tests nuevos del modo administrador: contraseña correcta/incorrecta, la contraseña no está en el código, encendido y apagado, módulos abiertos, lecciones abiertas, el progreso no se toca, estados antiguos y visibilidad del pie.

### v2.12.0 (2026-10-05)
- 🐛 **Al fallar un ejercicio de escribir código solo salía "Incorrecto", sin explicar nada.** Los 116 ejercicios `type-code` de los 4 cursos carecían de `explanation` (era el único tipo sin ella).
- ✅ `_correctAnswerHtml(exercise)`: al fallar se muestra la **solución correcta** según el tipo — el código en `type-code`, la opción buena en `multiple-choice`/`fix-bug`/`predict-output`, el código relleno en `fill-blank` y el orden en `reorder`. El HTML va escapado.
- ✅ Escritas las 116 explicaciones que faltaban (por qué funciona, no solo qué escribir).
- 🧪 La explicación pasa a ser **obligatoria en todos los tipos**; los tests de integridad lo comprueban en los 4 cursos.
- 🧪 7 tests nuevos: cobertura de la solución por tipo, escapado de HTML, relleno de `fill-blank`, orden de `reorder`, tipo desconocido y detector de caracteres de otro alfabeto.
- 🎨 Con el feedback abierto, la lección reserva su altura (`--feedback-h`) para que el botón **Ejecutar** no quede debajo del panel.

### v2.11.0 (2026-10-05)
- ✅ CSS cerrado: 14 módulos · 25 lecciones · 150 ejercicios (Grid, selectores/especificidad, pseudo-clases y elementos, responsive/unidades, variables, transiciones/animaciones y 2 proyectos)
- ✅ El analizador de CSS ahora entiende bloques anidados (`@keyframes`, `@media`) con tests propios

### v2.10.0 (2026-10-04)
- ✅ CSS creado: 6 módulos · 12 lecciones · 72 ejercicios (primer estilo, colores/fondos, tipografía, modelo de caja, display/position, Flexbox)
- ✅ Ejecutor CSS en el motor: analiza las reglas y devuelve "selector { propiedad: valor }", verificable también en Node
- ✅ Tests del analizador de CSS + verificación de que cada solución produce exactamente la regla esperada

### v2.9.0 (2026-10-04)
- ✅ JavaScript cerrado: 14 módulos · 43 lecciones · 258 ejercicios (Clases/POO, Math+JSON+Date, y los 2 proyectos finales: Calculadora y Gestor de Tareas)

### v2.8.0 (2026-10-04)
- ✅ HTML cerrado: 14 módulos · 23 lecciones · 138 ejercicios (comentarios/entidades, multimedia, accesibilidad, estilos en línea y 2 proyectos finales)

### v2.7.0 (2026-10-04)
- ✅ HTML creado: 8 módulos · 14 lecciones · 84 ejercicios (documento, texto, enlaces/imágenes, listas, tablas, formularios, div/clases/ids, semántica)
- ✅ Ejecutor HTML en el motor (`DOMParser`): devuelve el texto visible y permite validar estructura con `contains`
- ✅ Corregido bug: el editor decía siempre "Python" y la pista "Tab = 4" en cualquier lenguaje
- ✅ Tests que verifican el texto visible real de cada solución HTML (detectaron 2 ejercicios mal planteados)

### v2.6.0 (2026-10-04)
- ✅ Manifiesto en el hub: por qué existe DevQuest (aprender a pensar los problemas, no solo la sintaxis), gratuito, sin anuncios y sin límites de tiempo
- ✅ Perfil editable: subir foto (recortada a 256px para no llenar `localStorage`), cambiar nombre y elegir emoji de avatar
- ✅ La foto se refleja en hub, inicio del curso y perfil
- ✅ 108/108 tests en verde

### v2.5.0 (2026-10-04)
- ✅ JavaScript Módulos 8–10 (Objetos con `this`/`Object.keys`/desestructuración · Funciones con **arrow functions** · `try/catch`/`finally`/`throw`): 8 lecciones · 48 ejercicios
- ✅ El test de validación profunda detectó 2 errores reales de contenido y los corrigió (índice de respuesta en jse200, hueco inconsistente en jse191)
- ✅ 103/103 tests en verde · JS: 10 módulos · 35 lecciones · 210 ejercicios

### v2.4.1 (2026-10-04)
- ✅ Hub reordenado con lógica natural: Python, HTML, CSS, JavaScript, SQL, Java, C++, PHP, Go, Rust (TypeScript añadido tras JavaScript)
- ✅ Cada lenguaje tiene su resumen `about` visible en su página de inicio
- ✅ 103/103 tests en verde

### v2.4.0 (2026-10-04)
- ✅ Renombrado a **DevQuest** (título, bienvenida, paquetes, servidor, docs); "pythonista" se mantiene como homenaje al origen
- ✅ Sin pérdida de progreso: la clave `pyquest-state-v2` y la URL antigua del ranking siguen funcionando
- ✅ JavaScript Módulos 5–7 (Condicionales con `switch`/ternario · Bucles `while`/`for...of`/`for`/`break` · Arrays con `map`/`filter`): 10 lecciones · 60 ejercicios
- ✅ Carpeta del proyecto renombrada a `DevQuest`
- ✅ 101/101 tests en verde

### v2.3.0 (2026-10-04)
- ✅ Renombrado a **DevQuest** (título, bienvenida, paquetes, servidor, docs); "pythonista" se mantiene como homenaje al origen
- ✅ Sin pérdida de progreso: la clave `pyquest-state-v2` y la URL antigua del ranking siguen funcionando
- ✅ JavaScript Módulos 5–7 (Condicionales · Bucles · Arrays)

### v2.2.0 (2026-10-04)
- ✅ JavaScript Módulos 2–4 (Variables y Tipos · Operaciones con `==` vs `===` · Strings con template literals): 13 lecciones · 78 ejercicios
- ✅ Validación profunda de todo el contenido JS + ejecución real de sus 9 soluciones type-code en tests
- ✅ 101/101 tests en verde

### v2.1.1 (2026-10-04)
- ✅ Corregido el arrastre en "Ordena el código": cada bloque guardaba su propio origen y soltar no hacía nada; ahora el origen es compartido y soltar reordena (también vale soltar al final de la lista)
- ✅ Añadido intercambio por toques (tocar un bloque y luego otro) para móvil y accesibilidad
- ✅ `touch-action:none` en los bloques para que el dedo arrastre en vez de hacer scroll
- ✅ 3 tests nuevos de reordenamiento + mock de `className`/`insertBefore` fieles al DOM
- ✅ 99/99 tests en verde

### v2.1.0 (2026-10-04)
- ✅ Hub de lenguajes como página principal (10 tarjetas: Python, JavaScript, Java, HTML, CSS, SQL, C++, PHP, Go, TypeScript)
- ✅ JavaScript Módulo 1 completo (4 lecciones · 24 ejercicios, réplica del Módulo 1 de Python)
- ✅ Estado v3 con curso independiente por lenguaje (nivel, XP, racha, vidas, progreso, logros); migración automática v2→v3
- ✅ Motor ejecuta JS (`console.log` capturado) además de Python (Skulpt)
- ✅ 96/96 tests en verde (frontend + servidor)
- ✅ Spec `003-multilenguaje` aprobada (arquitectura + JS Módulo 1)

### v2.0.1 (2026-10-04)
- ✅ Corregidas las cifras de contenido: eran "56 lecciones · 336+ ejercicios" en cabecera, web y docs; lo real es 14 módulos · 40 lecciones · 230 ejercicios
- ✅ Nuevo test que fija esas cifras para que no vuelva a desincronizarse
- ✅ 86/86 tests en verde

### v2.0.0 (2026-10-02)
- ✅ Backend `server/` creado: registro, login, perfil, rename, forgot/reset, progress y leaderboard
- ✅ Cero dependencias (Node 22+: `node:sqlite`, `node:crypto` con scrypt + JWT manual)
- ✅ Solo identidad mínima: nombre + email + hash (xp/nivel solo para el ranking)
- ✅ 17 tests del servidor + 68 del frontend = **85/85 en verde** (`npm run test:all`)
- ✅ Smoke test con `curl` verificado
- ✅ Spec `002-backend-auth` aprobada e implementada

### v1.3.0 (2026-10-02)
- ✅ Eliminados los 10 usuarios falsos de la liga (`FAKE_PLAYERS`)
- ✅ La liga ahora solo muestra usuarios reales
- ✅ Cada usuario real tiene un `id` estable (migración automática de `localStorage`)
- ✅ Soporte opcional de ranking online vía `window.DEVQUEST_LEADERBOARD_URL` (acepta la antigua `window.PYQUEST_LEADERBOARD_URL`)
- ✅ Nuevos tests en `tests/league.test.js` (68/68 tests pasan)

### v1.2.7 (2026-10-02)
- ✅ Corregido bug crítico de CSS: `#screen-welcome`, `#screen-lesson` y `#screen-complete` usaban `display:flex` siempre, tapando el `display:none` de `.screen` y mostrando todas las pantallas apiladas (obligaba a hacer scroll)
- ✅ Ahora solo se muestra una pantalla a la vez (`display:flex` solo con `.active`)
- ✅ Botón "Comprobar" → valida, muestra feedback, se oculta y aparece "Siguiente lección →" abajo
- ✅ Botón "Siguiente lección →" (abajo, en action-bar) → refresca la siguiente lección con `nextExercise()` y sube arriba dejando "Comprobar" visible
- ✅ Botón "Siguiente lección →" (pantalla completada) → inicia la siguiente lección con `startLesson()` y sube arriba
- ✅ Eliminado código muerto `setupFeedbackPanel()` (referenciaba botón inexistente)
- ✅ Mock `window.scrollTo` añadido a los tests

### v1.2.6 (2026-10-02)
- ✅ Eliminado botón "Siguiente lección" del feedback panel (no debe aparecer arriba)
- ✅ Botón "Comprobar" cambia a "Continuar →" después de comprobar y funciona para avanzar
- ✅ Al pulsar "Continuar →" sube al botón de comprobar y refresca la siguiente lección

### v1.2.5 (2026-10-02)
- ✅ Botón "Comprobar" valida y muestra feedback (no cambia de texto)
- ✅ Botón "Siguiente lección" en el feedback panel sube al botón "Comprobar" y refresca la siguiente lección
- ✅ Eliminado botón duplicado del HTML (se renderiza dinámicamente)

### v1.2.4 (2026-10-02)
- ✅ Botón "Comprobar" ya no cambia a "Continuar" — se queda como está
- ✅ Botón "Siguiente lección" añadido al feedback panel con función de continuar
- ✅ Al pulsar "Siguiente lección" te devuelve al botón de comprobar para continuar

### v1.2.3 (2026-10-02)
- ✅ Botón "Siguiente lección" ahora inicia directamente la siguiente lección (sin doble clic)
- ✅ Scroll automático al inicio de la nueva lección

### v1.2.2 (2026-10-02)
- ✅ Botones de la pantalla de completado configurados en `setupCompleteScreen()` durante `init()`
- ✅ Corregido: los botones ahora se configuran una sola vez al iniciar la app

### v1.2.1 (2026-10-02)
- ✅ Botón "Siguiente lección" → lleva a la lista de lecciones y hace scroll a la lección específica
- ✅ Botón "Volver al inicio" → lleva al home y sube arriba del todo

### v1.2.0 (2026-10-02)
- ✅ Scroll automático al pulsar "Empezar a aprender" → lleva al contenido de aprendizaje
- ✅ Scroll automático al pulsar "Comprobar" → lleva al feedback y botón "Continuar"
- ✅ Scroll automático al pulsar "Siguiente lección" → sube al inicio del ejercicio
- ✅ Helpers de scroll añadidos: `scrollToElement()`, `scrollToBottom()`, `scrollToTop()`

### v1.1.0 (2026-10-02)
- ✅ Tests automatizados configurados (engine, curriculum, app)
- ✅ `package.json` creado con scripts de test y desarrollo
- ✅ Mocks de window/document para tests en Node.js
- ✅ Documentación completa creada
- ✅ Tests para motor de ejercicios (render, validación, syntax highlight)
- ✅ Tests para integridad de datos del currículum
- ✅ Tests para lógica principal (estado, XP, rachas, logros, vidas)
- ✅ 64 tests pasando (100% cobertura de los módulos principales)
- ✅ Mock de canvas para animaciones de confetti
- ✅ Mock de document.querySelector mejorado para búsquedas recursivas
- ✅ Variables globales sincronizadas (CURRICULUM, Engine, App)
