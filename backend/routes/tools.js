const express = require("express");
const User = require("../models/User");
const Tool = require("../models/Tool");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();
const Obra = require('../models/Work');

// Middleware de autenticação
router.use(authenticateJWT);

// Rota para listar todas as ferramentas do depósito do usuário autenticado
router.get("/:userId/tools", async (req, res) => {
    const { userId } = req.params;
    try {
        // Encontra o usuário e popula o depósito com os dados completos das ferramentas
        const user = await User.findById(userId).populate('deposito'); // Assume que 'deposito' está referenciando 'Tool' no esquema

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Envia os dados completos das ferramentas no depósito
        res.status(200).json(user.deposito);
    } catch (error) {
        console.error("Erro ao buscar ferramentas:", error);
        res.status(500).json({ message: "Erro ao buscar ferramentas", error });
    }
});

// Rota para adicionar ferramenta
router.post("/:userId/tools", authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    const { name, description, quantity } = req.body;

    // Verifique se os campos necessários estão definidos
    if (!name || !description || quantity === undefined) {
        return res.status(400).json({ message: "Nome, descrição e quantidade são obrigatórios." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const newTool = new Tool({ name, description, quantity });
        await newTool.save();
        user.deposito.push(newTool._id);
        await user.save();

        res.status(201).json({ success: true, tool: newTool });
    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ success: false, message: "Erro ao adicionar ferramenta", error });
    }
});

// Rota para atualizar uma ferramenta
router.put("/:userId/tools/:toolId", authenticateJWT, async (req, res) => {
    const { userId, toolId } = req.params;
    const { name, description } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const tool = user.deposito.id(toolId);
        if (!tool) {
            return res.status(404).json({ message: "Ferramenta não encontrada" });
        }

        if (name) tool.name = name;
        if (description) tool.description = description;

        await user.save();
        res.status(200).json({
            message: "Ferramenta atualizada com sucesso",
            deposito: user.deposito,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar ferramenta", error });
    }
});

// Rota para deletar ferramenta do usuario
router.delete("/:userId/tools/:toolId", authenticateJWT, async (req, res) => {
    const { userId, toolId } = req.params;
    const { quantityToDelete } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Localiza a ferramenta
        const toolIndex = user.deposito.findIndex(tool => tool._id.toString() === toolId);
        if (toolIndex === -1) {
            return res.status(404).json({ message: "Ferramenta não encontrada no depósito" });
        }

        const tool = user.deposito[toolIndex];
        if (quantityToDelete >= tool.quantity) {
            user.deposito.splice(toolIndex, 1);
        } else {
            tool.quantity -= quantityToDelete;
        }

        // Salva o usuário atualizado
        await user.save();
        return res.status(200).json({ message: "Quantidade da ferramenta atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao remover ferramenta:", error);
        return res.status(500).json({ message: "Erro ao remover ferramenta", error: error.message });
    }
});


module.exports = router;
