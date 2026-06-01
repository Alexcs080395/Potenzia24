require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD_LOADED: process.env.DB_PASSWORD ? "YES" : "NO",
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor POTENZIA 24 corriendo en puerto ${PORT}`);
});