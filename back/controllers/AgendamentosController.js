const { Agendamentos } = require('../models');

class AgendamentosController {
    async getAll(req, res) {
        try {
            const agendamentos = await Agendamentos.findAll({
                order: [['data_hora', 'DESC']]
            });
            if (agendamentos.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum agendamento encontrado.',
                    data: []
                });
            }
            return res.status(200).json(agendamentos);
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            return res.status(500).json({
                error: 'Erro interno no servidor ao tentar buscar os agendamentos.',
                details: error.message
            });
        }
    }

    async getById(req, res) {
        const id = req.params.id;
        try {
            const agendamento = await Agendamentos.findByPk(id);
            if (agendamento) {
                return res.json(agendamento);
            }
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar agendamento.' });
        }
    }

    async create(req, res) {
        const { cliente_id, servico_id, profissional_id, data_hora, status } = req.body;
        try {
            const novoAgendamento = await Agendamentos.create({
                cliente_id,
                servico_id,
                profissional_id,
                data_hora,
                status
            });
            return res.status(201).json(novoAgendamento);
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar agendamento.' });
        }
    }

    async update(req, res) {
        const id = req.params.id;
        const { cliente_id, servico_id, profissional_id, data_hora, status } = req.body;
        try {
            await Agendamentos.update(
                { cliente_id, servico_id, profissional_id, data_hora, status },
                { where: { id } }
            );
            res.json('agendamento atualizado');
        } catch (e) {
            res.status(400).json({ error: 'Erro ao atualizar agendamento.' });
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        try {
            const resultado = await Agendamentos.destroy({ where: { id } });
            if (resultado > 0) {
                res.json('agendamento deletado');
            } else {
                res.status(404).json('agendamento não encontrado ou já deletado');
            }
        } catch (e) {
            res.status(400).json({ error: 'Erro ao deletar agendamento.' });
        }
    }
}

module.exports = new AgendamentosController();
