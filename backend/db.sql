/* =====================================================
   POTENZIA24 / FACTOR 24
   DATABASE SCHEMA
   MySQL
===================================================== */

CREATE DATABASE IF NOT EXISTS factor24_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE factor24_db;

/* =====================================================
   TABLA PRINCIPAL DE REVISTAS
===================================================== */

CREATE TABLE IF NOT EXISTS magazines (
  id INT AUTO_INCREMENT PRIMARY KEY,

  edition_number VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(120) NOT NULL,
  summary TEXT NOT NULL,
  cover_image VARCHAR(255) NOT NULL,
  publish_date DATE NOT NULL,

  status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* =====================================================
   SECCIONES DE CADA REVISTA
===================================================== */

CREATE TABLE IF NOT EXISTS magazine_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,

  magazine_id INT NOT NULL,
  section_order INT NOT NULL,
  section_key VARCHAR(100) NOT NULL,
  section_name VARCHAR(150) NOT NULL,
  section_title VARCHAR(255) NOT NULL,
  section_content LONGTEXT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (magazine_id) REFERENCES magazines(id)
  ON DELETE CASCADE
);

/* =====================================================
   IMÁGENES ADICIONALES POR REVISTA / SECCIÓN
===================================================== */

CREATE TABLE IF NOT EXISTS magazine_images (
  id INT AUTO_INCREMENT PRIMARY KEY,

  magazine_id INT NOT NULL,
  section_id INT NULL,

  image_url VARCHAR(255) NOT NULL,
  image_alt VARCHAR(255),
  image_caption VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (magazine_id) REFERENCES magazines(id)
  ON DELETE CASCADE,

  FOREIGN KEY (section_id) REFERENCES magazine_sections(id)
  ON DELETE SET NULL
);

/* =====================================================
   CONSULTAS DE VERIFICACIÓN
===================================================== */

SHOW TABLES;

DESCRIBE magazines;
DESCRIBE magazine_sections;
DESCRIBE magazine_images;





create table Users(
Id INT AUTO_INCREMENT PRIMARY KEY,
IdRol BIGINT NOT NULL,
Email VARCHAR(200) NOT NULL UNIQUE,
Password VARCHAR(255) NOT NULL,
Name VARCHAR(200) NOT NULL,
Lastname VARCHAR(200) NOT NULL,
Image VARCHAR(1000) NOT NULL,
Age INT NOT NULL,
IdCity INT NOT NULL,
IdState INT NOT NULL,
IdCountry INT NOT NULL,
RegisterDate DATETIME NOT NULL,
UpdatedDate DATETIME NOT NULL
);

create table Rol(
Id INT PRIMARY KEY,
Name VARCHAR(200) NOT NULL,
RegisterDate DATETIME NOT NULL,
UpdatedDate DATETIME NOT NULL
);

CREATE TABLE Country(
  Id INT PRIMARY KEY,
  Name VARCHAR(200) NOT NULL,
  RegisterDate DATETIME NOT NULL,
  UpdatedDate DATETIME NOT NULL
);

CREATE TABLE State(
  Id INT PRIMARY KEY,
  Id_Country INT NOT NULL,
  Name VARCHAR(200) NOT NULL,
  RegisterDate DATETIME NOT NULL,
  UpdatedDate DATETIME NOT NULL
);

CREATE TABLE City(
  Id INT PRIMARY KEY,
  Id_State INT NOT NULL,
  Name VARCHAR(200) NOT NULL,
  RegisterDate DATETIME NOT NULL,
  UpdatedDate DATETIME NOT NULL
);
