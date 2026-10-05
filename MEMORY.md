# MEMORY.md — Memoria Persistente del Proyecto

## Estado Actual
- v2.16.0. Cursos completos: **Python · JavaScript · HTML · CSS · SQL**. Quedan Java, C++, PHP, Go y Rust (uno por sesión).
- Volumen: Python 14m/40l/230e · JS 14m/43l/258e · HTML 14m/23l/138e · CSS 14m/25l/150e · SQL 14m/27l/162e.
- Frontend: 187 tests en verde. Servidor: 37 tests en verde. Total 224/224.
- Formulario de contacto en el perfil → `POST /api/contact`, a duckdev77@gmail.com.
- **Modo administrador**: el logo del pato al final de la pantalla de Perfil (debajo de los logros), dentro de una firma con el nombre "PatoDev". Parece un logo de la app, pero abre el modal de la contraseña y activa el modo que abre todos los ejercicios para testear. No es seguridad: vive en el cliente y cualquiera puede llamar `App.setAdminMode(true)` desde la consola.
- Liga con 12 bots de relleno (`LEAGUE_BOTS`), marcados con 🤖 y con aviso al pie.
- Backend con cuenta real funcionando (registro, login, perfil, progreso, liga, recuperación de contraseña).

## Decisiones Clave (y por qué)
- Backend en Node sin dependencias (node:sqlite + scrypt + JWT manual): respeta "Simplicidad del Stack" y evita añadir dependencias npm; rápido y stateless para escalar horizontalmente.
- SQLite (WAL) ahora, Postgres documentado después: cero configuración hoy, migración aislada en `server/src/db.js`.
- Solo identidad mínima (nombre + email + hash; xp/nivel para ranking): lo pedido por el usuario, sin exponer emails ni hashes en el leaderboard.
- Recuperación con token de un solo uso (1h); envío SMTP pendiente como TODO explícito.
- Estado v3 con `courses[lang]`: el progreso de cada lenguaje es independiente y el nombre del perfil es compartido. Se conserva la clave `pyquest-state-v2` en localStorage para no perder el progreso de quien ya usaba la app.
- Runners por lenguaje en `Engine.runCode(lang, code)`, puros y deterministas (Skulpt, `Function` con `console.log` capturado, `DOMParser`, analizador de reglas CSS): permiten ejecutar las soluciones de los ejercicios dentro de los tests de Node.
- **Todo ejercicio debe tener `explanation` y su solución debe poder mostrarse.** Es una decisión de producto, no un detalle: al fallar, el alumno ve el porqué y el bloque "Cómo se resuelve". Los tests lo obligan en los 6 tipos y en los 4 cursos, así que los próximos cursos lo cumplen desde el principio.
- **La liga lleva bots de relleno** (`LEAGUE_BOTS` en `app.js`), como los NPC de una máquina recreativa: para que el ranking no se vea vacío antes de que haya usuarios reales. Van marcados con 🤖 y con un aviso al pie. Poner `LEAGUE_BOTS = []` para volver a la liga solo-real. El usuario siempre entra en su posición real por XP.
- **El contacto guarda antes de enviar**: `contact_messages` es la fuente de verdad y el email es un extra. Si el envío falla se responde 201 con `sent: false` y un aviso. Regla general: nunca perder el dato de un usuario por depender de un servicio externo.
- **SQL tiene motor propio** (`sqlengine.js`, cero dependencias) para que las soluciones de los ejercicios se puedan ejecutar también en los tests de Node. El motor es puro y determinista, como los runners de CSS y HTML.
- **Modo administrador** (botón del pato en el pie de inicio, contraseña hasheada): abre todos los módulos y lecciones para testear contenido. Es una ayuda de desarrollo, **no seguridad** — vive en el cliente y cualquiera puede llamar `App.setAdminMode(true)` desde la consola. La contraseña se compara con un hash FNV-1a solo para no dejarla en claro en el código que se descarga.

## Aprendizajes y Errores a Evitar
- `#screen-*` con `display:flex` tapaba el `display:none` de `.screen`: usar siempre `.active` en selectores por id.
- **`position: fixed` no funciona dentro de las pantallas**: todas llevan un `transform` de animación, y cualquier ancestro con transform crea un bloque contenedor, así que el navegador trata los hijos fijos como `absolute`. Si algún día hace falta un elemento fijo dentro de una pantalla, hay que ponerlo fuera de ella.
- **El mock del DOM de `tests/setup.js` es genérico**: `getElementById` crea cualquier elemento bajo demanda y no reproduce la estructura real de `index.html`. Para comprobar que algo está en su sitio de verdad, hay que leer el `index.html` con `fs` en el test, no preguntar al mock.
- Al medir geometría en el navegador automatizado hay dos trampas: las animaciones se quedan **congeladas** en su fotograma 0 (así `getBoundingClientRect()` devuelve tamaños a escala 0.5), y hay que descontar la barra de scroll al comprobar el centrado. Conviene desactivar animaciones antes de medir.
- `node --test <dir>` falla en este Node; usar `node --test <dir>/*.test.js`.
- **El mock de `classList.toggle` de `tests/setup.js` ignoraba el segundo argumento** (el de "forzar"), que el DOM real sí acepta. Cuidado con los mocks: si no reproducen la API completa, ocultan bugs. Lo mismo pasó con `style.setProperty`.
- Los imports ES se evalúan antes que los hooks: no fiar configuración en `process.env` fijado dentro de `before()`; inyectar dependencias (DB `:memory:`) en `createApp(db)`.
- Tras editar `app.js`/`index.html` a la vez que el usuario, releer el archivo antes de suponer su contenido.
- Al validar contenido nuevo, escribir primero el `expected` **ejecutando** la solución: así los tests de integridad no fallan y el alumno nunca se atasca en un test imposible.
- Fallos de autoría que los tests ahora cazan solos: `explanation` ausente, `___` que no coinciden con `blanks`, `correct`/`correctOutput` fuera de rango, `expected` con un `\n` de más o de menos, solución que depende de `starter`, y caracteres de otro alfabeto colados en el español.
- Los tests de `tests/curriculum.test.js` necesitan `await import('../app.js')` para poder usar `App._correctAnswerHtml`.
- **`??` descarta el `0`**, que en un índice de opciones es un valor válido. Al leer `dataset.correct` hay que mirar `!== undefined` antes que `exercise.correct`. Este bug llevaba tiempo oculto porque casi todas las opciones correctas no eran la primera.
- **Los tests de servidor que usan `createApp` deben cerrar el servidor** (`afterEach` con `app.close()`); si no, `node --test` se queda colgado para siempre esperando.
- Al escribir las salidas `expected` a mano se cuelan errores de espacios de relleno: es mejor **ejecutar la solución y copiar la salida real** (el motor ya está validado contra SQL real con sus propios tests). Si se hace con un script, cuidado con no comerse el cierre `}]` de la línea.
- Cuidado con el paréntesis final en los `forEach` anidados de los tests: cuatro niveles son `}))));`, no `})))`.

## Próximos Pasos
- Configurar `SMTP_HOST`/`RESEND_API_KEY` en `server/.env` para que los mensajes del formulario lleguen de verdad al buzón (ahora se guardan pero no se envían).
- Java, C++, PHP, Go y Rust (un lenguaje por sesión, siguiendo las reglas de autoría de `documentacion.md`).
- Conectar el frontend al backend (pantalla de registro/login, guardar JWT, `PUT /api/me` para cambiar nombre, `POST /api/progress` para subir xp, leaderboard remoto).
- Envío real de emails de recuperación (SMTP).
- Migración a Postgres + rate-limit en Redis cuando haya varias réplicas.
- `course_id` en el backend para ranking por lenguaje en el servidor.