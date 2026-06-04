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

async function getStates(req, res) {
  try {
    const states = await Catalog.getStates();
    res.json(states);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener estados",
      error: error.message,
    });
  }
}

async function getCities(req, res) {
  try {
    const cities = await Catalog.getCities();
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
  getStates,
  getCities,
  getRoles,
};