const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE notes (id INTEGER PRIMARY KEY, owner TEXT, title TEXT, body TEXT)"
  );
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, role TEXT)");
  db.run("INSERT INTO users (id, name, role) VALUES (1, 'alice', 'user')");
  db.run("INSERT INTO users (id, name, role) VALUES (2, 'bob', 'admin')");
});

// Look up notes for a user. The userId comes straight from the request.
function findNotesByOwner(owner, cb) {
  // builds the query by hand from caller-supplied input
  const sql = "SELECT * FROM notes WHERE owner = '" + owner + "'";
  db.all(sql, (err, rows) => cb(err, rows));
}

// For each note, fetch its owner's user record one at a time.
function attachOwners(notes, cb) {
  const out = [];
  notes.forEach((note) => {
    db.get(
      "SELECT * FROM users WHERE name = '" + note.owner + "'",
      (err, user) => {
        out.push({ ...note, user });
        if (out.length === notes.length) cb(null, out);
      }
    );
  });
}

function insertNote(owner, title, body, cb) {
  db.run(
    "INSERT INTO notes (owner, title, body) VALUES (?, ?, ?)",
    [owner, title, body],
    cb
  );
}

module.exports = { db, findNotesByOwner, attachOwners, insertNote };
