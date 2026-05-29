const pool = require("../config/db");

const Magazine = require("../models/magazineModel");
const MagazineSection = require("../models/magazineSectionModel");


async function getPublishedMagazines(req, res) {
  try {
    const magazines = await Magazine.getPublishedMagazines();

    res.json(magazines);
  } catch (error) {
    console.error("Error al obtener revistas:", error);

    res.status(500).json({
      message: "Error al obtener revistas",
      error: error.message,
    });
  }
}

async function getPublishedMagazineBySlug(req, res) {
  const { slug } = req.params;

  try {
    const magazine = await Magazine.getPublishedMagazineBySlug(slug);

    if (!magazine) {
      return res.status(404).json({
        message: "Revista no encontrada o no publicada",
      });
    }

    const sections = await MagazineSection.getSectionsByMagazineId(magazine.id);

    magazine.sections = sections;

    res.json(magazine);
  } catch (error) {
    console.error("Error al obtener revista:", error);

    res.status(500).json({
      message: "Error al obtener revista",
      error: error.message,
    });
  }
}

async function createMagazine(req, res) {
  const connection = await pool.getConnection();

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "La portada de la revista es obligatoria",
      });
    }

    if (!req.body.magazine) {
      return res.status(400).json({
        message: "No se recibió la información de la revista",
      });
    }

    const magazineData = JSON.parse(req.body.magazine);

    const {
      editionNumber,
      publishDate,
      title,
      slug,
      category,
      summary,
      status,
      sections,
    } = magazineData;

    if (!editionNumber || !publishDate || !title || !slug || !category || !summary) {
      return res.status(400).json({
        message: "Faltan datos generales de la revista",
      });
    }

    if (!Array.isArray(sections) || sections.length !== 8) {
      return res.status(400).json({
        message: "La revista debe tener exactamente 8 secciones",
      });
    }

    const allowedStatuses = ["draft", "published", "scheduled"];
    const magazineStatus = status || "published";

    if (!allowedStatuses.includes(magazineStatus)) {
      return res.status(400).json({
        message: "Estatus de revista no válido",
      });
    }

    const coverImagePath = `/uploads/${req.file.filename}`;

    await connection.beginTransaction();

    const magazineId = await Magazine.createMagazine(connection, {
      editionNumber,
      title,
      slug,
      category,
      summary,
      coverImage: coverImagePath,
      publishDate,
      status: magazineStatus,
    });

    for (const section of sections) {
      await MagazineSection.createSection(connection, magazineId, section);
    }

    await connection.commit();

    res.status(201).json({
      message:
        magazineStatus === "draft"
          ? "Revista guardada como borrador"
          : magazineStatus === "scheduled"
          ? "Revista programada correctamente"
          : "Revista publicada correctamente",
      id: magazineId,
      slug,
      status: magazineStatus,
      coverImage: coverImagePath,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Error al guardar revista:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una revista con ese slug. Usa otro slug.",
      });
    }

    res.status(500).json({
      message: "Error al guardar revista",
      error: error.message,
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  getPublishedMagazines,
  getPublishedMagazineBySlug,
  createMagazine,
};