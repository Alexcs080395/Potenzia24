const express = require("express");
const cors = require("cors");
const path = require("path");

const magazineRoutes = require("./routes/magazineRoutes");
const adminMagazineRoutes = require("./routes/adminMagazineRoutes");
const testRoutes = require("./routes/testRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Servidor FACTOR 24 funcionando correctamente",
  });
});

app.use("/api", testRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/admin/magazines", adminMagazineRoutes);

app.use(errorMiddleware);

module.exports = app;