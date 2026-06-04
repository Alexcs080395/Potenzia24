const express = require("express");

const router = express.Router();

const {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  getRoles,
} = require("../controllers/catalogController");

router.get("/countries", getCountries);

router.get("/countries/:idCountry/states", getStatesByCountry);

router.get("/states/:idState/cities", getCitiesByState);

router.get("/roles", getRoles);

module.exports = router;