const path = require("path");
const db = require("../config/db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS note_tags (
    note_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
  );
`
).run();

const fixedTags = [
  { id: 1, name: "math" },
  { id: 2, name: "physics" },
  { id: 3, name: "chemistry" },
  { id: 4, name: "cs" },
  { id: 5, name: "english" },
];
const insertTag = db.prepare(
  "INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)"
);
for (const tag of fixedTags) {
  insertTag.run(tag.id, tag.name);
}

console.log("Database initialized.");
