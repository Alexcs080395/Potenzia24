const pool = require("../config/db");

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `
    SELECT 
      Id,
      IdRol,
      Email,
      Password,
      Name,
      Lastname,
      Image,
      Age,
      IdCity,
      IdState,
      IdCountry
    FROM Users
    WHERE Email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

async function createUser(user) {
  const {
    IdRol,
    Email,
    Password,
    Name,
    Lastname,
    Image,
    Age,
    IdCity,
    IdState,
    IdCountry,
  } = user;

  const [result] = await pool.query(
    `
    INSERT INTO Users (
      IdRol,
      Email,
      Password,
      Name,
      Lastname,
      Image,
      Age,
      IdCity,
      IdState,
      IdCountry,
      RegisterDate,
      UpdatedDate
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `,
    [
      IdRol,
      Email,
      Password,
      Name,
      Lastname,
      Image,
      Age,
      IdCity,
      IdState,
      IdCountry,
    ]
  );

  return result.insertId;
}

module.exports = {
  findUserByEmail,
  createUser,
};