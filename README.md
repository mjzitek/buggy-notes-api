# buggy-notes-api

A deliberately-flawed Express + SQLite notes app, used as a **demo target** for
[deep-code-review](https://github.com/dennisonbertram/deep-claude) fan-out reviews.
It spans several languages and layers on purpose, so a multi-dimensional reviewer
has real breadth to chew on: backend JS, a browser front-end, a shell script, and
a Python analytics module — each seeded with realistic issues across correctness,
security, error-handling, concurrency, API-contract, and performance.

## Run

```bash
npm install
npm start        # http://localhost:7493
```

## Layout

```
src/
  server.js          # routes + app wiring
  db.js              # sqlite access
  auth.js            # tokens + middleware
  counter.js         # id sequence (file-backed)
  cache.js           # in-process cache
  config.js          # configuration + defaults
  payments.js        # tiny in-memory wallet
  routes/users.js    # user CRUD
  utils/crypto.js    # hashing / tokens / encryption
  utils/validate.js  # input validation
public/
  index.html, app.js # browser front-end
scripts/
  backup.sh          # db backup
analytics/
  report.py          # usage report
```

## Endpoints

- `POST /login` — `{ "id": 1 }` → `{ token }`
- `GET  /notes/:owner` — list notes (header `x-token`, `?sort=`, `?filter=`)
- `POST /notes` — create a note
- `DELETE /notes/:id` — delete a note
- `GET/PUT/POST /users` — user CRUD
