const multer = require("multer");

function errorMiddleware(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Error al subir archivo",
      error: error.message,
    });
  }

  if (error.message === "Solo se permiten imágenes JPG, PNG o WEBP") {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: "Error interno del servidor",
    error: error.message,
  });
}

module.exports = errorMiddleware;