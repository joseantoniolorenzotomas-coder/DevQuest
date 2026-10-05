# Plan Técnico 002 — Backend de usuarios

## Archivos a Modificar / Crear
- `server/package.json`: scripts `start` y `test`, sin dependencias.
- `server/src/config.js`: puerto, JWT secret/expiración, ruta SQLite, `DATABASE_URL` (futuro Postgres), SMTP stub.
- `server/src/db.js`: conexión SQLite (`node:sqlite`, WAL), schema `users` + `password_resets`, sentencias preparadas, índices.
- `server/src/crypto.js`: hash/verificación con `scrypt` + salt, JWT HS256 manual, tokens aleatorios.
- `server/src/users.js`: lógica pura de negocio (validar email/nombre/password, registrar, login, perfil, rename, forgot/reset, leaderboard).
- `server/src/server.js`: capa HTTP fina (router, JSON body, CORS, rate-limit en memoria, JWT en `Authorization: Bearer`).
- `server/test/*.test.js`: tests con `node --test` (usan DB temporal por test).
- `server/README.md`, `server/.env.example`, `server/.gitignore`: arranque, endpoints y ruta a Postgres.

## Funciones Puras
- `validateName(name)`, `validateEmail(email)`, `validatePassword(pw)`: devuelven string limpio o lanzan `ValidationError`.
- `hashPassword(pw)`, `verifyPassword(hash, pw)`: scrypt + `timingSafeEqual`.
- `signToken(payload)`, `verifyToken(token)`: JWT HS256 con `exp`.
- `registerUser(db, {name, email, password})`, `loginUser(db, {email, password})`, `getProfile`, `renameUser`, `requestPasswordReset`, `resetPassword`, `getLeaderboard`: solo hablan con `db.js`.

## Algoritmo / Pseudocódigo
1. HTTP parsea JSON y aplica rate-limit solo en `/api/auth/*`.
2. Llama a la función pura de `users.js` con el `db` inyectado.
3. `users.js` valida → consulta preparada → hash/compara → firma JWT o genera token de reset.
4. `server.js` mapea `ValidationError→400`, `AuthError→401`, `ConflictError→409`, resto→500 genérico.

## Estrategia de Tests (`node --test`)
- Registro OK + duplicado 409 + email inválido 400 + password corta 400.
- Login OK + password mala 401 + usuario inexistente 401.
- `me` con JWT válido/ausente/caducado.
- Rename válido/inválido.
- Forgot siempre 200 + reset con token válido/inválido/reutilizado.
- Leaderboard ordenado por xp sin exponer emails ni hashes.
- Rate-limit: tras N intentos 429 (test con límite bajo inyectado).
