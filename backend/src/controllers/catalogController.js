const Catalog = require("../models/catalogModel");

async function getCountries(req, res) {
  try {
    const countries = await Catalog.getCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener países",
      error: error.message,
    });
  }
}

async function getStatesByCountry(req, res) {
  const { idCountry } = req.params;

  try {
    const states = await Catalog.getStatesByCountry(idCountry);
    res.json(states);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener estados",
      error: error.message,
    });
  }
}

async function getCitiesByState(req, res) {
  const { idState } = req.params;

  try {
    const cities = await Catalog.getCitiesByState(idState);
    res.json(cities);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener ciudades",
      error: error.message,
    });
  }
}

async function getRoles(req, res) {
  try {
    const roles = await Catalog.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener roles",
      error: error.message,
    });
  }
}

module.exports = {
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  getRoles,
};