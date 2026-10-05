# Spec 003 — Hub multilenguaje
Estado: aprobada

## Contexto y Objetivo
DevQuest (antes PyQuest, solo Python) necesita una página principal donde elegir qué estudiar (Python, JavaScript, Java, HTML, CSS, SQL, C++, PHP, Go, Rust) replicando la misma estructura (módulos → lecciones → 6 tipos de ejercicio). Contenido completo por lenguaje en varias sesiones; esta spec cubre arquitectura + hub + JavaScript Módulo 1.

## Historias de Usuario
- HU-1: Como estudiante, quiero ver un hub de lenguajes con mi progreso en cada uno para elegir qué estudiar.
- HU-2: Como estudiante de JS, quiero el Módulo 1 real para empezar como en Python.
- HU-3: Como usuario existente de Python, quiero conservar mi progreso, XP y racha tras la migración.
- HU-4: Como estudiante, quiero que nivel, racha, vidas, logros y liga sean independientes por lenguaje.

## Requisitos Funcionales (Notación EARS)
- RF-1: CUANDO se abre Inicio, EL SISTEMA muestra el hub con los 10 lenguajes (icono, descripción, % completado, nivel).
- RF-2: SI un lenguaje no tiene contenido (`comingSoon`), ENTONCES se muestra bloqueado con "Próximamente" y no entra.
- RF-3: CUANDO se elige un lenguaje con contenido, EL SISTEMA entra a su home (stats, continuar, módulos) con datos de ese curso.
- RF-4: EL SISTEMA guarda por curso: stats (nivel/xp/racha/vidas), progreso y logros; el nombre del perfil es compartido.
- RF-5: CUANDO se detecta estado v2 (plano, solo Python), EL SISTEMA lo migra a v3 dentro de `courses.python` sin perder datos.
- RF-6: EL SISTEMA ejecuta código JS (`type-code`) capturando `console.log`; Python sigue usando Skulpt.
- RF-7: EL SISTEMA mantiene 64+ tests frontend en verde adaptados al estado por curso.

## Casos Límite y Fuera de Alcance
- Límite: estado corrupto → curso fresco; cambiar de lenguaje a mitad de lección → la sesión se descarta.
- Fuera de Alcance (esta sesión): Módulos 2–14 de JS y contenido de los otros 8 lenguajes; `course_id` en el backend; ranking por lenguaje en el servidor.

## Criterios de Finalización
- Hub visible con 10 tarjetas (1 completa Python, 1 parcial JS, 8 próximamente).
- Migración v2→v3 probada con test; `npm run test:all` en verde.
