# DevQuest Server — Backend de usuarios

Registro, login y ranking con **cero dependencias** (solo Node 22+).
Guarda identidad mínima: **nombre + email + hash de contraseña** (+ xp/nivel para el ranking).

## Arranque

```bash
cd server
npm test     # 17 tests
npm start    # http://localhost:3001
```

Variables (ver `.env.example`):
- `PORT` (3001), `SQLITE_PATH` (ruta del `.db`; `:memory:` para pruebas)
- `JWT_SECRET` (**obligatorio en producción**), `JWT_EXPIRES_SECONDS`
- `CORS_ORIGIN`, `RATE_LIMIT_MAX`, `SMTP_*` (pendiente, ver abajo)

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | no | Estado del servicio |
| POST | `/api/auth/register` | no | `{name, email, password}` → 201 `{user, token}` |
| POST | `/api/auth/login` | no | `{email, password}` → 200 `{user, token}` |
| POST | `/api/auth/forgot` | no | `{email}` → siempre 200 (no revela si existe) |
| POST | `/api/auth/reset` | no | `{token, password}` → 200 |
| GET | `/api/me` | Bearer | Perfil (sin hash) |
| PUT | `/api/me` | Bearer | `{name}` → perfil actualizado |
| POST | `/api/progress` | Bearer | `{xp, level}` → perfil actualizado (para el ranking) |
| GET | `/api/leaderboard?limit=20` | no | Top por xp (sin emails ni hashes) |

Ejemplo:

```bash
curl -X POST localhost:3001/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@test.com","password":"secreta123"}'
```

## Recuperación de contraseña (estado actual)

`POST /api/auth/forgot` genera un token de un solo uso (1h, guardado con hash) y responde 200 siempre. En desarrollo devuelve `devToken` para probar el flujo sin SMTP. El envío real por email queda pendiente: configura `SMTP_HOST` y completa el TODO en `src/users.js`.

## Por qué es rápido y escalable

- **Stateless**: JWT sin sesiones → puedes lanzar N instancias detrás de un balanceador.
- **SQLite en WAL** (`journal_mode=WAL`, `busy_timeout`, sentencias preparadas, índices en `email` y `xp`).
- **Rate-limit** en memoria solo en `/api/auth/*` (con varias instancias, pasar a Redis).
- **Cero dependencias**: menos superficie de ataque y arranque instantáneo.

## Migrar a Postgres (cuando crezca)

1. Levanta Postgres (Docker) y define `DATABASE_URL`.
2. Sustituye `server/src/db.js` por un pool (`pg`) manteniendo los mismos nombres de funciones.
3. Ajustes SQL: `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL`, `?` → `$1..$n`.
4. Migra los datos de `devquest.db` y elimina el archivo local.
5. Mueve el rate-limit a Redis si usas varias réplicas.
