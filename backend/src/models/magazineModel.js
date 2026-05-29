const pool = require("../config/db");

async function getPublishedMagazines() {
  const [rows] = await pool.query(`
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

  return rows;
}

async function getPublishedMagazineBySlug(slug) {
  const [rows] = await pool.query(
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

  return rows[0] || null;
}

async function getAdminMagazines() {
  const [rows] = await pool.query(`
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

  return rows;
}

async function getMagazineById(id) {
  const [rows] = await pool.query(
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

  return rows[0] || null;
}

async function createMagazine(connection, magazine) {
  const {
    editionNumber,
    title,
    slug,
    category,
    summary,
    coverImage,
    publishDate,
    status,
  } = magazine;

  const [result] = await connection.query(
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
      coverImage,
      publishDate,
      status,
    ]
  );

  return result.insertId;
}

async function updateMagazine(connection, id, magazine) {
  const {
    editionNumber,
    title,
    slug,
    category,
    summary,
    coverImage,
    publishDate,
    status,
  } = magazine;

  const [result] = await connection.query(
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
      coverImage,
      publishDate,
      status,
      id,
    ]
  );

  return result;
}

async function updateMagazineStatus(id, status) {
  const [result] = await pool.query(
    `
    UPDATE magazines
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  return result;
}

async function deleteMagazine(id) {
  const [result] = await pool.query(
    `
    DELETE FROM magazines
    WHERE id = ?
    `,
    [id]
  );

  return result;
}

module.exports = {
  getPublishedMagazines,
  getPublishedMagazineBySlug,
  getAdminMagazines,
  getMagazineById,
  createMagazine,
  updateMagazine,
  updateMagazineStatus,
  deleteMagazine,
};