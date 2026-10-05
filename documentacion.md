# Documentación de DevQuest

## Descripción

DevQuest es una aplicación web interactiva para aprender programación desde cero hasta nivel profesional. Inspirada en Duolingo, ofrece lecciones interactivas con gamificación, ejercicios de código en tiempo real y un sistema de progreso persistente. El inicio es un hub de lenguajes (Python completo, JavaScript en curso, 8 más próximamente) con progreso, nivel y racha independientes por lenguaje.

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura de la aplicación y pantallas |
| **CSS3** | Diseño oscuro con glassmorphism, animaciones y efectos neon |
| **JavaScript ES6+** | Lógica de la aplicación, estado y navegación |
| **Skulpt** | Ejecución de Python en el navegador (sin servidor) |
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
├── curriculums/          # Otros lenguajes (javascript.js, html.js, css.js)
├── languages.js          # Registro de los 10 lenguajes (hub)
├── assets/img/           # Imágenes (pato-logo.png, pato-logo-128.png)
├── img/                  # Originales que aportó el usuario (sin usar)
├── style.css           # Diseño y animaciones
├── package.json        # Configuración npm y scripts
├── tests/              # Tests automatizados frontend
│   ├── setup.js        # Mocks de window/document
│   ├── engine.test.js  # Tests del motor de ejercicios
│   ├── curriculum.test.js # Tests de integridad de datos
│   ├── app.test.js     # Tests de lógica principal
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
npm run test:all  # desde la raíz: 224 tests (frontend + servidor)
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

Estado actual: **187 tests frontend + 37 del servidor = 224 en verde.**

### Ejecutar todos los tests
```bash
npm test              # solo frontend (187)
npm run test:server   # solo servidor (37)
npm run test:all      # frontend + servidor (224)
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
| `tests/curriculum.test.js` | Tests de integridad de los 4 currículums + ejecución real de las soluciones |
| `tests/app.test.js` | Tests de lógica principal (estado, XP, rachas, logros) |

## Secciones de la Aplicación

### Pantallas

1. **Welcome** — Pantalla de bienvenida con input de nombre
2. **Hub de lenguajes** — Página principal: 10 tarjetas (Python, JavaScript, Java, HTML, CSS, SQL, C++, PHP, Go, Rust) con progreso y nivel; las sin contenido salen bloqueadas
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

Al final de la pantalla de **Perfil** hay un botón **"¿Tienes alguna consulta? Contáctanos"**. Al pulsarlo se despliega un formulario con nombre, email, asunto y mensaje.

Endpoint: `POST /api/contact` con `{ name, email, subject, message }`. Los mensajes llegan a **duckdev77@gmail.com** (`CONTACT_TO`).

**Cómo funciona el envío, y por qué no depende de nada:**

1. El mensaje **se guarda siempre** en la tabla `contact_messages` de la base de datos. Eso no falla nunca.
2. Después se intenta enviar por email. Si funciona, el mensaje llega a tu buzón.
3. Si el envío falla (o no hay servicio configurado), el endpoint responde `201` con `sent: false` y un aviso. **El mensaje sigue guardado.**

Esto se hizo así a propósito: un formulario de contacto que pierde el mensaje si el email falla es peor que uno que avisa. Puedes leer lo recibido con `GET /api/contact` (necesita `ADMIN_IDS` configurado) o consultando la tabla directamente.

Para activar el envío real, define en `server/.env`:

```bash
# Opción A: SMTP (Gmail necesita "aplicaciones con contraseña")
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=la-clave-de-aplicacion
SMTP_TLS=true

# Opción B: API de transactional (más simple)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

Si el servidor no está en marcha, el frontend guarda el mensaje en `localStorage` (`devquest-contact-buzon`) y avisa de que se enviará más tarde. Sin email configurado se ve un aviso, nunca un error rojo.

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

1. **El porqué** — la `explanation` del ejercicio. Es obligatoria en los 6 tipos y los tests de integridad la verifican en los 4 cursos, así que no puede faltar en el contenido nuevo.
2. **Cómo se resuelve** — un bloque 💡 con la solución correcta, adaptado al tipo:
   - `type-code` → el código de la solución
   - `multiple-choice` / `fix-bug` → el texto de la opción buena
   - `predict-output` → la salida correcta
   - `fill-blank` → el código con los huecos ya rellenos
   - `reorder` → los bloques en su orden correcto

El texto se escapa al inyectarlo en el HTML, de modo que una solución con `<` o etiquetas no puede romper la interfaz. Mientras el panel está abierto la lección reserva su altura (`--feedback-h`, medida por JS) para que el botón **Ejecutar** nunca quede debajo.

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

Edita el currículum del lenguaje correspondiente (`curriculum.js` para Python, `curriculums/javascript.js`, `curriculums/html.js`, `curriculums/css.js`) y añade ejercicios a las lecciones existentes o crea módulos nuevos.

**Reglas obligatorias al escribir un ejercicio** (los tests de `tests/curriculum.test.js` las verifican y fallan la build si no se cumplen):

| Regla | Motivo |
|---|---|
| `explanation` en **todos** los tipos | Al fallar es lo primero que ve el alumno |
| `solution` en `type-code` | Es lo que se muestra en el bloque "Cómo se resuelve" |
| `correct` dentro de rango | Índice de la opción buena |
| `correctOutput` dentro de rango | Índice de la salida buena |
| Un `___` por cada `blanks` | Si no, el ejercicio es irresoluble |
| `options.length >= blanks.length` | Faltan opciones para algún hueco |
| `correctOrder` con todos los índices | Orden de los bloques |
| `tests[0].expected` = salida real de `solution` | Un test que nunca pasa bloquea al alumno |
| `tests[0].contains` si pides estructura | El runner solo mira la salida; `contains` mira el código |
| Solo español | Hay un test que detecta caracteres de otro alfabeto |

Los runners son puros y deterministas, así que las soluciones se pueden ejecutar en los tests: `runPython` (Skulpt), `runJavaScript` (captura `console.log`), `runHtml` (DOMParser → texto visible) y `runCss` (analizador de reglas). Ejecutar la solución de un ejercicio nuevo antes de escribir su `expected` evita la mitad de los errores.

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
- Descripción: "Aprende Python desde cero hasta proyectos reales. Lecciones interactivas estilo Duolingo, sin límites de tiempo."
- Theme color: `#0D0D26`

## Pendientes

- [ ] Java, SQL, C++, PHP, Go y Rust (un lenguaje por sesión)
- [ ] `course_id` en el backend para ranking por lenguaje en el servidor

- [x] Verificar `curriculum.js` (era un error de lectura: está completo con 14 módulos, 40 lecciones y 230 ejercicios)
- [ ] Añadir más tests de integración
- [ ] Implementar modo claro/oscuro
- [ ] Añadir búsqueda de lecciones
- [ ] Mejorar feedback de errores con pistas progresivas
- [ ] Añadir navegación por teclado completa
- [ ] Implementar sistema de repetición espaciada
- [ ] Añadir desafíos diarios

## Historial de Cambios

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
- ✅ Hub reordenado con lógica natural: Python, HTML, CSS, JavaScript, SQL, Java, C++, PHP, Go, Rust (Java separado de JavaScript por SQL)
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
- ✅ Hub de lenguajes como página principal (10 tarjetas: Python, JavaScript, Java, HTML, CSS, SQL, C++, PHP, Go, Rust)
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
