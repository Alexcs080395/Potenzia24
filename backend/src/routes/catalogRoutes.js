const express = require("express");

const router = express.Router();

const {
  getCountries,
  getStates,
  getCities,
  getRoles,
} = require("../controllers/catalogController");

router.get("/countries", getCountries);

router.get("/states", getStates);

router.get("/cities", getCities);

router.get("/roles", getRoles);

module.exports = router;