# Plan Técnico 003 — Hub multilenguaje

## Archivos a Modificar / Crear
- `languages.js` (nuevo): registro `window.LANGUAGES` (meta + módulos + `comingSoon`).
- `curriculums/javascript.js` (nuevo): Módulo 1 de JS (4 lecciones × 6 ejercicios).
- `index.html`: pantalla `screen-languages`, scripts de nuevos ficheros, botón volver en course-home.
- `style.css`: tarjetas del hub.
- `app.js`: estado v3 por curso, `course()`/`currentModules()`, hub, migración v2→v3, motor con idioma.
- `engine.js`: `runCode(lang, code)` (python=Skulpt, javascript=Function+console).
- `tests/`: adaptar a estado por curso + tests de hub, migración y runner JS.

## Funciones Puras
- `ensureCourse(state, langId)`, `migrateV2toV3(flatState)`: solo datos, testeables.
- `courseProgress(course)`: { hechas, totales, % } para el hub.

## Algoritmo / Pseudocódigo
1. `loadState`: si v2 → migrar a courses.python; garantizar curso del idioma actual.
2. Inicio → `renderLanguages()` (hub). Tocar tarjeta → `currentLanguageId`, `renderHome()`.
3. Todo lo existente (`renderHome`, lecciones, XP, logros, liga) opera sobre `course()`.
4. `renderExercise` pasa `langId` a `Engine.render`; `type-code` ejecuta según idioma.

## Estrategia de Tests (`node --test`)
- Migración v2→v3 conserva nombre, xp, progreso y logros.
- Hub: 10 idiomas, 8 bloqueados, progreso calculado.
- Runner JS: `console.log` capturado, errores reportados.
- Volumen Python intacto (14/40/230); JS Módulo 1 (1/4/24).
