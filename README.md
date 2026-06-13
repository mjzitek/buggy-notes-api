# notes-api

A tiny Express + SQLite notes API. **Demo target** for [deep-code-review](https://github.com/dennisonbertram/deep-claude) fan-out reviews — it intentionally contains a spread of realistic problems for the reviewer to find.

## Run

```bash
npm install
npm start        # http://localhost:7493
```

## Endpoints

- `POST /login` — `{ "id": 1 }` → `{ token }`
- `GET  /notes/:owner` — list notes (header `x-token`)
- `POST /notes` — create a note (header `x-token`)
- `DELETE /notes/:id` — delete a note
