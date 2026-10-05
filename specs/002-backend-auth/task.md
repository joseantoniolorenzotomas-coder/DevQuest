# Tareas 002 — Backend de usuarios

- [x] **T1. Spec y plan.** (toda la spec)
  - Hecho cuando: `specs/002-backend-auth/spec.md` existe en Estado aprobada.
- [x] **T2. Esqueleto + config + db.** (RF-10)
  - Hecho cuando: `server/src/{config,db}.js` crean el schema y `node --test server/test/db.test.js` pasa.
- [x] **T3. Cripto (hash + JWT).** (RF-11)
  - Hecho cuando: `server/test/crypto.test.js` pasa (hash verifica, JWT firma/verifica/caduca).
- [x] **T4. Lógica de usuarios.** (RF-1–RF-9)
  - Hecho cuando: `server/test/users.test.js` pasa (register/login/me/rename/forgot/reset/leaderboard).
- [x] **T5. Servidor HTTP.** (RF-1–RF-10)
  - Hecho cuando: `server/test/server.test.js` pasa y el smoke test con `curl` es verde.
- [x] **T6. Docs.**
  - Hecho cuando: `server/README.md` + `documentacion.md` explican arranque y migración a Postgres.
