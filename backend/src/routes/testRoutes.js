const express = require("express");

const router = express.Router();

const { testDatabase } = require("../controllers/testController");

router.get("/test-db", testDatabase);

module.exports = router;