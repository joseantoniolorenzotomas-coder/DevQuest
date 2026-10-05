# AGENTS.md — devquest
es una aplicacion de escritorio la cual esta diseñada para, aprender progrmacion mas concretamente python, desde cero a profesional, parecida a la app mimo.

## Stack y Estructura
- Tecnologías y versiones clave (ej. HTML5, CSS3, JavaScript ES6+, Node.js v20).
- Carpeta `/src` (código fuente), `/docs` (constituciones), `/specs` (especificaciones SDD).

## Comandos
- Ejecutar/Servidor: `npm start` (o abrir `index.html`)
- Tests: `node --test`
- Linter: `npm run lint`

## Convenciones
- Estilo de código, nomenclatura en español/inglés, funciones puras explicadas con JSDoc breve.
- Idioma de comentarios e interfaz: Español.

## Reglas de Dominio y Trampas Conocidas
- [Regla 1 que la IA no pueda deducir leyendo el código]
- [Regla 2 sobre datos sensibles o almacenamiento local]

## Forma de Trabajar
- Lee siempre `docs/constitution.md` y la spec activa en `specs/` antes de modificar código.
- En tareas complejas, usa siempre el Modo Plan antes de escribir código.

## Límites
- ✅ Siempre: actualizar `MEMORY.md` al terminar cada tarea y ejecutar tests.
- ⚠ Pregunta antes: agregar dependencias npm nuevas, crear archivos fuera de la estructura indicada.
- 🚫 Nunca: escribir claves en texto plano, eliminar tests existentes o hacer refactors masivos no solicitados.

## Verificación
- Después de cada cambio, ejecuta `node --test` o verifica la interfaz en navegador mediante MCP.
