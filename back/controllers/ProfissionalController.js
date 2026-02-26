const { Profissionais } = require('../models')
const { Op } = require('sequelize');

class ProfissionalController {
    async getAll(req, res) {
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

    async getById(req, res) {
        const id = req.params.id
        try {
            const profissional = await Profissionais.findByPk(id)
            if (profissional) {
                return res.json(profissional)
            }
            return res.status(404).json({ error: 'Profissional não encontrado' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar profissional.' })
        }
    }

    async create(req, res) {
        const profissional = req.body
        try {
            await Profissionais.create(profissional)
            return res.status(201).json(profissional)
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar profissional.' })
        }
    }

    async update(req, res) {
        const idProfissional = req.params.id
        const { nome, telefone, email, horario_inicio, horario_fim, dias_ativos, especialidades } = req.body //5 dados
        try {
            await Profissionais.update(
                { nome, telefone, email, horario_inicio, horario_fim, dias_ativos, especialidades },
                { where: { id: idProfissional } }
            )
            res.json('Profissional atualizado')
        } catch (e) {
            res.json({ error: 'Erro ao atualizar profissional' })
        }
    }

    async delete(req, res) {
        const idProfissional = req.params.id
        try {
            const resultado = await Profissionais.destroy({
                where: {
                    id: idProfissional
                }
            })
            if (resultado > 0) {
                res.json('Profissional deletado')
            } else {
                res.json('Profissional não encontrado ou já deletado')
            }
        } catch (e) {
            res.json({ error: 'Erro ao deletar profissional' })
        }
    }
}

module.exports = new ProfissionalController()