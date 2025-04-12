const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const auth_routes = require("./routes/auth.js");
const notes_routes = require("./routes/notes.js");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/upload", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", auth_routes);
app.use("/api/notes", notes_routes);

app.get("/", (req, res) => {
  res.send("Welcome to the Notes Sharing App API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
