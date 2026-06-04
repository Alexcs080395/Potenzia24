const pool = require("../config/db");

async function getCountries() {
  const [rows] = await pool.query(`
    SELECT Id, Name
    FROM Country
    ORDER BY Name ASC
  `);

  return rows;
}

async function getStates() {
  const [rows] = await pool.query(`
    SELECT Id, Name
    FROM State
    ORDER BY Name ASC
  `);

  return rows;
}

async function getCities() {
  const [rows] = await pool.query(`
    SELECT Id, Name
    FROM City
    ORDER BY Name ASC
  `);

  return rows;
}

async function getRoles() {
  const [rows] = await pool.query(`
    SELECT Id, Name
    FROM Rol
    ORDER BY Id ASC
  `);

  return rows;
}

module.exports = {
  getCountries,
  getStates,
  getCities,
  getRoles,
};