const mongoose = require('mongoose');

// Definição do esquema para obras
const WorkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    tools: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tool'
        }
    ], // Lista de ferramentas associadas à obra
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } // ID do usuário que criou a obra
});


// Modelo para obras
const Work = mongoose.model('Work', WorkSchema);

module.exports = Work;