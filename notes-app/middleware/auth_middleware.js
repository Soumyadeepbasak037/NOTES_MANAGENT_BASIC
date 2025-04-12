// const jwt = require("jsonwebtoken");
// const path = require("path");

// function auth_middleware(req, res, next) {
//   const token = req.headers["authorization"].split(" ")[1];

//   if (!token) {
//     return false;
//   }
//   try {
//     const status = jwt.verify(token, SECRET_KEY);
//     return true;
//   } catch (err) {
//     return false;
//   }
// }
// module.exports = auth_middleware;

// middleware/auth_middleware.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "heheboi";
function auth_middleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = auth_middleware;
