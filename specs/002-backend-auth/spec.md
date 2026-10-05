# Spec 002 — Backend de usuarios (auth + ranking)
Estado: aprobada

## Contexto y Objetivo
La liga mostraba usuarios falsos y cada navegador guardaba un perfil aislado. Para admitir usuarios reales con nombres reales en el ranking hace falta un backend propio que guarde identidad (nombre + email + contraseña con hash) y deje preparada la recuperación de contraseña. SQLite ahora (cero configuración), Postgres documentado para cuando crezca.

## Historias de Usuario
- HU-1: Como estudiante, quiero registrarme con nombre, email y contraseña para tener mi perfil real.
- HU-2: Como estudiante, quiero entrar con email y contraseña para recuperar mi perfil.
- HU-3: Como estudiante, quiero que mi nombre real aparezca en el ranking.
- HU-4: Como estudiante, quiero pedir restablecer mi contraseña si la pierdo.

## Requisitos Funcionales (Notación EARS)
- RF-1: CUANDO se pida `POST /api/auth/register` con nombre, email y contraseña válidos, EL SISTEMA crea el usuario y devuelve JWT + perfil.
- RF-2: SI el email ya existe, ENTONCES EL SISTEMA responde 409 sin revelar datos.
- RF-3: CUANDO se pida `POST /api/auth/login` con email y contraseña correctos, EL SISTEMA devuelve JWT + perfil.
- RF-4: SI las credenciales son incorrectas, ENTONCES EL SISTEMA responde 401 genérico.
- RF-5: CUANDO se pida `GET /api/me` con JWT válido, EL SISTEMA devuelve el perfil (id, nombre, email, xp, nivel).
- RF-6: CUANDO se pida `PUT /api/me` con nombre válido y JWT válido, EL SISTEMA actualiza el nombre.
- RF-7: CUANDO se pida `POST /api/auth/forgot` con un email, EL SISTEMA responde 200 siempre y genera un token de un solo uso (1h). En desarrollo lo devuelve/loguea; el envío por email queda como TODO con SMTP.
- RF-8: CUANDO se pida `POST /api/auth/reset` con token válido y contraseña nueva válida, EL SISTEMA cambia el hash e invalida el token.
- RF-9: CUANDO se pida `GET /api/leaderboard`, EL SISTEMA devuelve el top por xp (solo id, nombre, xp, nivel; nunca emails ni hashes).
- RF-10: MIENTRAS no haya `DATABASE_URL`, EL SISTEMA usa SQLite local (WAL). La capa de acceso a datos queda aislada en `db.js` para migrar a Postgres.
- RF-11: EL SISTEMA nunca guarda contraseñas en claro (scrypt + salt) ni las devuelve en ninguna respuesta.

## Casos Límite y Fuera de Alcance
- Casos Límite: email duplicado, JWT caducado, token de reset reutilizado o caducado, payloads malformados, rate-limit en auth.
- Fuera de Alcance: envío real de emails (queda stub + `SMTP_*` en `.env.example`), OAuth social, refresh tokens rotativos, panel admin.

## Criterios de Finalización
- `npm test --workspace=server` o `node --test server/test/` en verde (registro, login, me, rename, forgot/reset, leaderboard).
- Smoke test con `curl` de register → login → me → leaderboard en verde.
- `documentacion.md` actualizada con cómo arrancar el servidor y la ruta de migración a Postgres.
