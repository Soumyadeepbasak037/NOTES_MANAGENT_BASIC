const path = require("path");

const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "..", "NOTES.db");
const db = new Database(dbPath);

module.exports = db;
