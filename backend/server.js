const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const toolRoutes = require("./routes/tools");
const worksRoutes = require("./routes/works")

const app = express();

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// RotasA
app.use("/api", authRoutes);
app.use("/api/users", toolRoutes);
app.use("/api/works", worksRoutes)

app.use((req, res, next) => {
  console.log(`Rota acessada: ${req.method} ${req.url}`);
  next();
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});