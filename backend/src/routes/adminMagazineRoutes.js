const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  getAdminMagazines,
  getAdminMagazineById,
  updateMagazineStatus,
  deleteMagazine,
  updateMagazine,
} = require("../controllers/adminMagazineController");

router.get("/", getAdminMagazines);

router.get("/:id", getAdminMagazineById);

router.patch("/:id/status", updateMagazineStatus);

router.delete("/:id", deleteMagazine);

router.put("/:id", upload.single("coverImage"), updateMagazine);

module.exports = router;