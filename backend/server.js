const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para imágenes subidas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   CONFIGURACIÓN DE SUBIDA DE PORTADAS
===================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPG, PNG o WEBP"));
    }
  },
});

/* =====================================================
   RUTAS DE PRUEBA
===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "Servidor FACTOR 24 funcionando correctamente",
  });
});

app.get("/api/test-db", async (req, res) => {
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
});

/* =====================================================
   RUTAS PÚBLICAS
   Estas alimentan index.html, revistas.html y revista.html
===================================================== */

// Obtener SOLO revistas publicadas para la web pública
app.get("/api/magazines", async (req, res) => {
  try {
    const [magazines] = await pool.query(`
      SELECT 
        id,
        edition_number,
        title,
        slug,
        category,
        summary,
        cover_image,
        publish_date,
        status,
        created_at
      FROM magazines
      WHERE status = 'published'
      ORDER BY publish_date DESC, id DESC
    `);

    res.json(magazines);
  } catch (error) {
    console.error("Error al obtener revistas:", error);

    res.status(500).json({
      message: "Error al obtener revistas",
      error: error.message,
    });
  }
});

// Obtener una revista publicada por slug con sus secciones
app.get("/api/magazines/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const [magazineRows] = await pool.query(
      `
      SELECT 
        id,
        edition_number,
        title,
        slug,
        category,
        summary,
        cover_image,
        publish_date,
        status,
        created_at
      FROM magazines
      WHERE slug = ?
        AND status = 'published'
      LIMIT 1
      `,
      [slug]
    );

    if (magazineRows.length === 0) {
      return res.status(404).json({
        message: "Revista no encontrada o no publicada",
      });
    }

    const magazine = magazineRows[0];

    const [sections] = await pool.query(
      `
      SELECT 
        id,
        section_order,
        section_key,
        section_name,
        section_title,
        section_content
      FROM magazine_sections
      WHERE magazine_id = ?
      ORDER BY section_order ASC
      `,
      [magazine.id]
    );

    magazine.sections = sections;

    res.json(magazine);
  } catch (error) {
    console.error("Error al obtener revista:", error);

    res.status(500).json({
      message: "Error al obtener revista",
      error: error.message,
    });
  }
});

/* =====================================================
   RUTAS ADMIN
   Estas alimentan admin-revista.html y admin-control-revistas.html
===================================================== */

// Obtener TODAS las revistas para el panel admin
app.get("/api/admin/magazines", async (req, res) => {
  try {
    const [magazines] = await pool.query(`
      SELECT 
        id,
        edition_number,
        title,
        slug,
        category,
        summary,
        cover_image,
        publish_date,
        status,
        created_at,
        updated_at
      FROM magazines
      ORDER BY created_at DESC, id DESC
    `);

    res.json(magazines);
  } catch (error) {
    console.error("Error al obtener revistas admin:", error);

    res.status(500).json({
      message: "Error al obtener revistas admin",
      error: error.message,
    });
  }
});

// Obtener una revista admin por ID, incluyendo borradores y programadas
app.get("/api/admin/magazines/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [magazineRows] = await pool.query(
      `
      SELECT 
        id,
        edition_number,
        title,
        slug,
        category,
        summary,
        cover_image,
        publish_date,
        status,
        created_at,
        updated_at
      FROM magazines
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (magazineRows.length === 0) {
      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    const magazine = magazineRows[0];

    const [sections] = await pool.query(
      `
      SELECT 
        id,
        section_order,
        section_key,
        section_name,
        section_title,
        section_content
      FROM magazine_sections
      WHERE magazine_id = ?
      ORDER BY section_order ASC
      `,
      [magazine.id]
    );

    magazine.sections = sections;

    res.json(magazine);
  } catch (error) {
    console.error("Error al obtener revista admin:", error);

    res.status(500).json({
      message: "Error al obtener revista admin",
      error: error.message,
    });
  }
});

// Publicar / guardar borrador / programar revista
app.post("/api/magazines", upload.single("coverImage"), async (req, res) => {
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

    const [magazineResult] = await connection.query(
      `
      INSERT INTO magazines (
        edition_number,
        title,
        slug,
        category,
        summary,
        cover_image,
        publish_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        editionNumber,
        title,
        slug,
        category,
        summary,
        coverImagePath,
        publishDate,
        magazineStatus,
      ]
    );

    const magazineId = magazineResult.insertId;

    for (const section of sections) {
      await connection.query(
        `
        INSERT INTO magazine_sections (
          magazine_id,
          section_order,
          section_key,
          section_name,
          section_title,
          section_content
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          magazineId,
          section.order,
          section.key,
          section.name,
          section.title,
          section.content,
        ]
      );
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
});

// Cambiar estatus de revista
app.patch("/api/admin/magazines/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["draft", "published", "scheduled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Estatus no válido",
    });
  }

  try {
    const [result] = await pool.query(
      `
      UPDATE magazines
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

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
});

// Eliminar revista
app.delete("/api/admin/magazines/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `
      DELETE FROM magazines
      WHERE id = ?
      `,
      [id]
    );

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
});

// Editar revista existente
app.put("/api/admin/magazines/:id", upload.single("coverImage"), async (req, res) => {
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

    const [currentRows] = await connection.query(
      `
      SELECT cover_image
      FROM magazines
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (currentRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Revista no encontrada",
      });
    }

    const currentCoverImage = currentRows[0].cover_image;
    const coverImagePath = req.file
      ? `/uploads/${req.file.filename}`
      : currentCoverImage;

    await connection.query(
      `
      UPDATE magazines
      SET
        edition_number = ?,
        title = ?,
        slug = ?,
        category = ?,
        summary = ?,
        cover_image = ?,
        publish_date = ?,
        status = ?
      WHERE id = ?
      `,
      [
        editionNumber,
        title,
        slug,
        category,
        summary,
        coverImagePath,
        publishDate,
        status,
        id,
      ]
    );

    // Borramos secciones anteriores y volvemos a insertar las 8 actualizadas
    await connection.query(
      `
      DELETE FROM magazine_sections
      WHERE magazine_id = ?
      `,
      [id]
    );

    for (const section of sections) {
      await connection.query(
        `
        INSERT INTO magazine_sections (
          magazine_id,
          section_order,
          section_key,
          section_name,
          section_title,
          section_content
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          section.order,
          section.key,
          section.name,
          section.title,
          section.content,
        ]
      );
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
});
/* =====================================================
   MANEJO DE ERRORES DE MULTER
===================================================== */

app.use((error, req, res, next) => {
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

  next(error);
});

/* =====================================================
   INICIAR SERVIDOR
===================================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor FACTOR 24 corriendo en http://localhost:${PORT}`);
});