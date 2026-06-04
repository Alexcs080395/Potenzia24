const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");

router.post("/register", upload.single("Image"), register);

router.post("/login", login);

module.exports = router;