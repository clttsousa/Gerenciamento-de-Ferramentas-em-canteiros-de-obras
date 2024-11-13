const mongoose = require('mongoose');
const Work = require('./Work');
const Tool = require('./Tool');



// Definição do esquema para usuários
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Remove espaços em branco no início e no final
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove espaços em branco no início e no final
    lowercase: true // Converte o e-mail para minúsculas
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Define um tamanho mínimo para a senha
  },
  deposito: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tool'}], // Armazena ferramentas do usuário
  obras:[{type: mongoose.Schema.Types.ObjectId, ref: 'Work'}]
});

// Criação de índices para username e email
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

// Modelos para usuário
const User = mongoose.model('User', UserSchema);

module.exports = User;