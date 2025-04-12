const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes_controller");
const upload = require("../middleware/upload_middleware.js");
const auth_middleware = require("../middleware/auth_middleware.js");

router.post(
  "/upload",
  auth_middleware,
  upload.single("file"),
  notesController.upload_note
);

router.get("/", notesController.get_all_notes);

router.post("/download", notesController.download_note);

module.exports = router;
