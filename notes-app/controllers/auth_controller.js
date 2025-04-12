const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.json("No username or password.");
  }
  hashed_passwd = bcrypt.hashSync(password, 10);

  db.prepare(`INSERT INTO users (username,password) VALUES (?,?)`).run(
    username,
    hashed_passwd
  );
  res.json("user created");
};

const SECRET_KEY = "heheboi";

exports.login = (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
