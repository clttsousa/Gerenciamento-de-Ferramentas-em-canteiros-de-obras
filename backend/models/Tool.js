// Tool.js
const mongoose = require('mongoose');

// Definição do esquema para ferramentas
const ToolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true }
});

// Criação do modelo para ferramentas
const Tool = mongoose.model('Tool', ToolSchema);

module.exports = Tool;