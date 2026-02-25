const { Profissionais } = require('../models')
const { Op } = require('sequelize');

const getAll = async (req, res) => {
    try {
        const profissionais = await Profissionais.findAll({
            order: [['nome', 'ASC']]
        });
        if (profissionais.length === 0) {
            return res.status(200).json({
                message: "Nenhum profissional encontrado.",
                data: []
            });
        }
        return res.status(200).json(profissionais);
    } catch (error) {
        console.error("Erro ao buscar profissionais:", error);
        return res.status(500).json({
            error: "Erro interno no servidor ao tentar buscar os profissionais.",
            details: error.message
        });
    }
};

module.exports = {
    getAll
};