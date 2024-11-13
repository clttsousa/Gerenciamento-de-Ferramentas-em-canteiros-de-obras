const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const Work = require('../models/Work');
const Tool = require('../models/Tool');

// Rota de registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Dados recebidos:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, deposito: []});
    await user.save();


    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao criar usuário", error: error.message});
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      userId: user._id,
      username: user.username,
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
});

module.exports = router;