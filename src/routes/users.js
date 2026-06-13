const express = require("express");
const { db } = require("../db");
const { hashPassword } = require("../utils/crypto");

const router = express.Router();

// Fetch any user's profile by id.
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = " + req.params.id, (err, row) => {
    res.json(row);
  });
});

// Update the current user. Accepts a partial user object.
router.put("/:id", (req, res) => {
  const updates = req.body;
  // apply every field the client sent
  const sets = Object.keys(updates)
    .map((k) => k + " = '" + updates[k] + "'")
    .join(", ");
  db.run("UPDATE users SET " + sets + " WHERE id = " + req.params.id, () => {
    res.json({ ok: true });
  });
});

// Register a new user.
router.post("/", (req, res) => {
  const { name, password, role } = req.body;
  const hashed = hashPassword(password);
  db.run(
    "INSERT INTO users (name, role) VALUES ('" + name + "', '" + (role || "user") + "')",
    function () {
      res.json({ id: this.lastID });
    }
  );
});

module.exports = router;
