const express = require("express");
const User = require("../models/User");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();
const Work = require("../models/Work");
const Tool = require("../models/Tool");
// Middleware de autenticação
router.use(authenticateJWT);

// Rota para listar todas as obras do usuário autenticado
router.get("/obras", authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('obras'); // Usar req.userId diretamente
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.status(200).json(user.obras); // Envia todas as obras
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar obras", error });
    }
});

// Rota para adicionar uma nova obra
router.post('/obras', authenticateJWT, async (req, res) => {
    try {
        const { name, address } = req.body;
        console.log("Dados recebidos para nova obra:", { name, address });
        console.log("userId:", req.userId);

        if (!req.userId) {
            return res.status(400).json({ error: 'userId não encontrado' });
        }

        const newWork = new Work({ name, address, user: req.userId });
        await newWork.save();

        await User.findByIdAndUpdate(req.userId, { $push: { obras: newWork._id } });
        res.status(201).json(newWork);
    } catch (error) {
        console.error("Erro ao adicionar obra:", error);
        res.status(500).json({ error: 'Erro ao adicionar obra' });
    }
});

// Rota para atualizar uma obra
router.put("/:userId/obras/:obraId", async (req, res) => {
    const { userId, obraId } = req.params;
    const { name, address } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const obra = user.obras.id(obraId);
        if (!obra) {
            return res.status(404).json({ message: "Obra não encontrada" });
        }

        if (name) obra.name = name;
        if (address) obra.address = address;

        await user.save();
        res.status(200).json({ message: "Obra atualizada com sucesso", obras: user.obras });
    } catch (error) {
        console.error("Erro ao atualizar obra:", error);
        res.status(500).json({ message: "Erro ao atualizar obra", error });
    }
});

// Rota para deletar uma obra do usuário
router.delete("/obras/:obraId", authenticateJWT, async (req, res) => {
    const { obraId } = req.params;
    const userId = req.userId; // Pegando o userId do token

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const obraIndex = user.obras.findIndex(obra => obra._id.toString() === obraId);
        if (obraIndex === -1) {
            return res.status(404).json({ message: "Obra não encontrada" });
        }

        user.obras.splice(obraIndex, 1);
        await user.save();
        return res.status(200).json({ message: "Obra removida com sucesso" });
    } catch (error) {
        console.error("Erro ao remover obra:", error);
        return res.status(500).json({ message: "Erro ao remover obra", error: error.message });
    }
});


// Rota para obter ferramentas de uma obra específica
router.get('/obras/:obraId/tools', authenticateJWT, async (req, res) => {
    try {
        const obraId = req.params.obraId; // Obtendo o ID da obra da URL
        const obra = await Work.findById(obraId).populate('tools'); // Assumindo que você tem um campo tools no seu modelo Work
        if (!obra) {
            return res.status(404).json({ message: 'Obra não encontrada' });
        }
        res.json(obra.tools); // Retornando as ferramentas da obra
    } catch (error) {
        console.error(`Erro ao buscar ferramentas da obra com ID ${obraId}:`, error);
        res.status(500).json({ message: 'Erro ao buscar ferramentas da obra' });
    }
});

// Rota para adicionar uma ferramenta a uma obra específica
router.post("/obras/:obraId/tools", authenticateJWT, async (req, res) => {
    const { obraId } = req.params;
    const { name, description, quantity } = req.body;

    try {
        const obra = await Work.findById(obraId);
        if (!obra) {
            return res.status(404).json({ message: "Obra não encontrada" });
        }

        const newTool = new Tool({ name, description, quantity }); // Crie uma nova ferramenta
        await newTool.save(); // Salve a ferramenta no banco de dados

        obra.tools.push(newTool._id); // Adicione o ID da nova ferramenta à obra
        await obra.save();

        res.status(201).json(newTool); // Envia a ferramenta adicionada
    } catch (error) {
        res.status(500).json({ message: "Erro ao adicionar ferramenta à obra", error });
    }
});

// Rota para excluir uma ferramenta de uma obra específica
router.delete("/:obraId/tools/:toolId", async (req, res) => {
    const { obraId, toolId } = req.params;

    try {
        const obra = await Work.findById(obraId);
        if (!obra) {
            return res.status(404).json({ message: "Obra não encontrada" });
        }

        const toolIndex = obra.tools.findIndex(tool => tool._id.toString() === toolId);
        if (toolIndex === -1) {
            return res.status(404).json({ message: "Ferramenta não encontrada" });
        }

        obra.tools.splice(toolIndex, 1); // Remove a ferramenta da obra
        await obra.save();

        res.status(200).json({ message: "Ferramenta removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover ferramenta da obra", error });
    }
});

module.exports = router;