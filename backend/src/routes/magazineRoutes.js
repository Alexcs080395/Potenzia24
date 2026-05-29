const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  getPublishedMagazines,
  getPublishedMagazineBySlug,
  createMagazine,
} = require("../controllers/magazineController");

router.get("/", getPublishedMagazines);

router.get("/:slug", getPublishedMagazineBySlug);

router.post("/", upload.single("coverImage"), createMagazine);

module.exports = router;