const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Model
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json()); 

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

//rota de registro
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send('Usuário criado com sucesso');
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar usuário', error });
  }
});

//rota de login
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }],
    });

    console.log('Tentando encontrar o usuário com:', login);
    console.log('Usuário encontrado:', user);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ success: true, message: 'Login realizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});


//console.log('Comparando senha:', password, 'com:', user.password);
//console.log('Usuário encontrado:', user);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
