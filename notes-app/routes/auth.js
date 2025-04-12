const express = require("express");
const router = express.Router();

const auth_controller = require("../controllers/auth_controller");

router.post("/register", auth_controller.register);

router.post("/login", auth_controller.login);

module.exports = router;
