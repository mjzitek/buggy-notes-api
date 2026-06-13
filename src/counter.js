const fs = require("fs");

const FILE = "/tmp/notes-counter.txt";

// Returns the next sequence number, persisted to disk.
// Called concurrently from request handlers.
function nextId() {
  let current = 0;
  if (fs.existsSync(FILE)) {
    current = parseInt(fs.readFileSync(FILE, "utf8"), 10);
  }
  const next = current + 1;
  fs.writeFileSync(FILE, String(next));
  return next;
}

module.exports = { nextId };
