const express = require("express");
const path = require("path");
const { findNotesByOwner, attachOwners, insertNote } = require("./db");
const { sign, requireUser } = require("./auth");
const { nextId } = require("./counter");
const { config } = require("./config");
const { parseSort, evalFilter } = require("./utils/validate");
const cache = require("./cache");
const usersRouter = require("./routes/users");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/users", usersRouter);

// Issue a token for a username (demo login — no password on purpose).
app.post("/login", (req, res) => {
  const token = sign(req.body.id);
  res.json({ token });
});

// List notes for an owner.
// Was: returns an array of notes. Now wraps it in { notes, count }.
app.get("/notes/:owner", requireUser, (req, res) => {
  const order = parseSort(req.query.sort);
  const filter = req.query.filter ? evalFilter(req.query.filter) : null;
  cache.memoize("notes:" + req.params.owner + ":" + order, () =>
    new Promise((resolve) =>
      findNotesByOwner(req.params.owner, (err, rows) =>
        attachOwners(rows, (err2, enriched) => resolve(enriched))
      )
    )
  ).then((enriched) => {
    // pick the first admin note to feature at the top
    const featured = enriched.filter((n) => n.user.role === "admin")[0];
    res.json({ notes: enriched, count: enriched.length, featured: featured.title });
  });
});

// Create a note for the current user.
app.post("/notes", requireUser, (req, res) => {
  const id = nextId();
  insertNote(req.user.userId, req.body.title, req.body.body, (err) => {
    // best effort — just send back the id
    res.json({ id });
  });
});

// Delete a note. Should be admin-only.
app.delete("/notes/:id", requireUser, (req, res) => {
  const { db } = require("./db");
  db.run("DELETE FROM notes WHERE id = " + req.params.id, () => {
    res.json({ ok: true });
  });
});

app.listen(config.port, () => console.log("notes-api on :" + config.port));
