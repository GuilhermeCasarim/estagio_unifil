const { Agendamentos, Clientes, Servicos, Profissionais } = require('../models');

class AgendamentosController {
    async getAll(req, res) {
        try {
            const agendamentos = await Agendamentos.findAll({
                order: [['data_hora', 'DESC']],
                include: [
                    { model: Clientes },
                    { 
                        model: Servicos,
                        include: [
                            { association: 'nome_servico' }
                        ]
                    },
                    { model: Profissionais }
                ]
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
            const agendamento = await Agendamentos.findByPk(id, {
                include: [
                    { model: Clientes },
                    { model: Servicos },
                    { model: Profissionais }
                ]
            });
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
            // Validação de existência das entidades relacionadas
            const cliente = await Clientes.findByPk(cliente_id);
            if (!cliente) {
                return res.status(400).json({ error: 'Cliente não encontrado.' });
            }
            const servico = await Servicos.findByPk(servico_id);
            if (!servico) {
                return res.status(400).json({ error: 'Serviço não encontrado.' });
            }
            const profissional = await Profissionais.findByPk(profissional_id);
            if (!profissional) {
                return res.status(400).json({ error: 'Profissional não encontrado.' });
            }

            const novoAgendamento = await Agendamentos.create({
                cliente_id,
                servico_id,
                profissional_id,
                data_hora,
                status
            });

            // Retornar o agendamento com os dados relacionados
            const agendamentoCriado = await Agendamentos.findByPk(novoAgendamento.id, {
                include: [
                    { model: Clientes },
                    { model: Servicos },
                    { model: Profissionais }
                ]
            });
            return res.status(201).json(agendamentoCriado);
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar agendamento.', details: e.message });
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
