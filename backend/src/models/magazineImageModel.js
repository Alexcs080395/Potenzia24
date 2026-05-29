const pool = require("../config/db");

async function getImagesByMagazineId(magazineId) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      magazine_id,
      section_id,
      image_url,
      image_alt,
      image_caption,
      created_at
    FROM magazine_images
    WHERE magazine_id = ?
    ORDER BY id ASC
    `,
    [magazineId]
  );

  return rows;
}

async function createImage(connection, image) {
  const {
    magazineId,
    sectionId,
    imageUrl,
    imageAlt,
    imageCaption,
  } = image;

  const [result] = await connection.query(
    `
    INSERT INTO magazine_images (
      magazine_id,
      section_id,
      image_url,
      image_alt,
      image_caption
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      magazineId,
      sectionId || null,
      imageUrl,
      imageAlt || null,
      imageCaption || null,
    ]
  );

  return result.insertId;
}

async function deleteImagesByMagazineId(connection, magazineId) {
  const [result] = await connection.query(
    `
    DELETE FROM magazine_images
    WHERE magazine_id = ?
    `,
    [magazineId]
  );

  return result;
}

module.exports = {
  getImagesByMagazineId,
  createImage,
  deleteImagesByMagazineId,
};