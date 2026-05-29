const pool = require("../config/db");

async function getSectionsByMagazineId(magazineId) {
  const [rows] = await pool.query(
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
    [magazineId]
  );

  return rows;
}

async function createSection(connection, magazineId, section) {
  const [result] = await connection.query(
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

  return result.insertId;
}

async function deleteSectionsByMagazineId(connection, magazineId) {
  const [result] = await connection.query(
    `
    DELETE FROM magazine_sections
    WHERE magazine_id = ?
    `,
    [magazineId]
  );

  return result;
}

module.exports = {
  getSectionsByMagazineId,
  createSection,
  deleteSectionsByMagazineId,
};