const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); 

// Rota de registro
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send("Usuário criado com sucesso");
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar usuário", error });
  }
});

// Rota de login
app.post("/api/login", async (req, res) => {
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

    // Retornar o ID do usuário, nome de usuário e a imagem de perfil
    res.json({
      success: true,
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage, // Adicionando a imagem de perfil
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login" });
  }
});

// Rota para atualizar a imagem do perfil
app.post("/updateProfileImage", async (req, res) => {
  const { userId, profileImage } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Imagem de perfil atualizada com sucesso!", user });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar a imagem de perfil" });
  }
});

// Rota para buscar a imagem do perfil
app.get("/getProfileImage/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !user.profileImage) {
      return res
        .status(404)
        .json({ message: "Imagem de perfil não encontrada" });
    }
    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar a imagem de perfil" });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
