const pool = require("../config/db");

async function testDatabase(req, res) {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");

    res.json({
      message: "Conexión a MySQL correcta",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);

    res.status(500).json({
      message: "Error al conectar con MySQL",
      error: error.message,
    });
  }
}

module.exports = {
  testDatabase,
};