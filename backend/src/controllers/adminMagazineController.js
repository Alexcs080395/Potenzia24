const pool = require("../config/db");

const Magazine = require("../models/magazineModel");
const MagazineSection = require("../models/magazineSectionModel");

async function getAdminMagazines(req, res) {
  try {
    const magazines = await Magazine.getAdminMagazines();

    res.json(magazines);
  } catch (error) {
    console.error("Error al obtener revistas admin:", error);

    res.status(500).json({
      message: "Error al obtener revistas admin",
      error: error.message,
    });
  }
}

async function getAdminMagazineById(req, res) {
  const { id } = req.params;

  try {
    const magazine = await Magazine.getMagazineById(id);

    if (!magazine) {
      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    const sections = await MagazineSection.getSectionsByMagazineId(magazine.id);

    magazine.sections = sections;

    res.json(magazine);
  } catch (error) {
    console.error("Error al obtener revista admin:", error);

    res.status(500).json({
      message: "Error al obtener revista admin",
      error: error.message,
    });
  }
}

async function updateMagazineStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["draft", "published", "scheduled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Estatus no válido",
    });
  }

  try {
    const result = await Magazine.updateMagazineStatus(id, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    res.json({
      message: "Estatus actualizado correctamente",
      id,
      status,
    });
  } catch (error) {
    console.error("Error al actualizar estatus:", error);

    res.status(500).json({
      message: "Error al actualizar estatus",
      error: error.message,
    });
  }
}

async function deleteMagazine(req, res) {
  const { id } = req.params;

  try {
    const result = await Magazine.deleteMagazine(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    res.json({
      message: "Revista eliminada correctamente",
      id,
    });
  } catch (error) {
    console.error("Error al eliminar revista:", error);

    res.status(500).json({
      message: "Error al eliminar revista",
      error: error.message,
    });
  }
}

async function updateMagazine(req, res) {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
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

    if (!editionNumber || !publishDate || !title || !slug || !category || !summary || !status) {
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

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Estatus de revista no válido",
      });
    }

    await connection.beginTransaction();

    const currentMagazine = await Magazine.getMagazineById(id);

    if (!currentMagazine) {
      await connection.rollback();

      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    const coverImagePath = req.file
      ? `/uploads/${req.file.filename}`
      : currentMagazine.cover_image;

    await Magazine.updateMagazine(connection, id, {
      editionNumber,
      title,
      slug,
      category,
      summary,
      coverImage: coverImagePath,
      publishDate,
      status,
    });

    await MagazineSection.deleteSectionsByMagazineId(connection, id);

    for (const section of sections) {
      await MagazineSection.createSection(connection, id, section);
    }

    await connection.commit();

    res.json({
      message: "Revista actualizada correctamente",
      id,
      slug,
      status,
      coverImage: coverImagePath,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Error al editar revista:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Ya existe una revista con ese slug. Usa otro slug.",
      });
    }

    res.status(500).json({
      message: "Error al editar revista",
      error: error.message,
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  getAdminMagazines,
  getAdminMagazineById,
  updateMagazineStatus,
  deleteMagazine,
  updateMagazine,
};