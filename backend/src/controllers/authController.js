const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

function createToken(user) {
  return jwt.sign(
    {
      id: user.Id,
      email: user.Email,
      role: user.IdRol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

async function register(req, res) {
  try {
    const {
      IdRol,
      Email,
      Password,
      Name,
      Lastname,
      Age,
      IdCity,
      IdState,
      IdCountry,
    } = req.body;

    if (
      !IdRol ||
      !Email ||
      !Password ||
      !Name ||
      !Lastname ||
      !Age ||
      !IdCity ||
      !IdState ||
      !IdCountry
    ) {
      return res.status(400).json({
        message: "Faltan datos obligatorios",
      });
    }

    const existingUser = await User.findUserByEmail(Email);

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe un usuario con ese correo",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/default-user.png";

    const userId = await User.createUser({
      IdRol,
      Email,
      Password: hashedPassword,
      Name,
      Lastname,
      Image: imagePath,
      Age,
      IdCity,
      IdState,
      IdCountry,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      id: userId,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Correo y contraseña son obligatorios",
      });
    }

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const validPassword = await bcrypt.compare(password, user.Password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const token = createToken(user);

    delete user.Password;

    res.json({
      message: "Inicio de sesión correcto",
      token,
      user,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
}

module.exports = {
  register,
  login,
};