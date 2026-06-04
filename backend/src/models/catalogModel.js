const pool = require("../config/db");

async function getCountries() {
  const [rows] = await pool.query(`
    SELECT Id, Name
    FROM Country
    ORDER BY Name ASC
  `);

  return rows;
}

async function getStatesByCountry(idCountry) {
  const [rows] = await pool.query(
    `
    SELECT Id, Id_Country, Name
    FROM State
    WHERE Id_Country = ?
    ORDER BY Name ASC
    `,
    [idCountry]
  );

  return rows;
}

async function getCitiesByState(idState) {
  const [rows] = await pool.query(
    `
    SELECT Id, Id_State, Name
    FROM City
    WHERE Id_State = ?
    ORDER BY Name ASC
    `,
    [idState]
  );

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
  getStatesByCountry,
  getCitiesByState,
  getRoles,
};