const { Agendamentos, Clientes, Servicos, Profissionais, Financeiro } = require('../models');
const { Op } = require('sequelize');


class AgendamentosController {
    // Método auxiliar para verificar sobreposição de horários (corrigido)
    async verificarHorario(profissional_id, dataInicio, dataFim) {
        // 1. Criar objetos Date limpos para o início e fim do dia
        const inicioDia = new Date(dataInicio);
        inicioDia.setHours(0, 0, 0, 0);
        
        const fimDia = new Date(dataInicio);
        fimDia.setHours(23, 59, 59, 999);

        console.log(`--- DEBUG: Buscando agendamentos entre ${inicioDia.toISOString()} e ${fimDia.toISOString()}`);

        const agendamentosNoMesmoDia = await Agendamentos.findAll({
            where: {
                profissional_id,
                data_hora: {
                    [Op.between]: [inicioDia, fimDia]
                }
            },
            include: [{ model: Servicos }]
        });

        for (const existente of agendamentosNoMesmoDia) {
            const inicioExistente = new Date(existente.data_hora);
            // Garante que pegamos a duração independente de como o Sequelize nomeou a associação
            const servicoData = existente.Servico || existente.Servicos || {};
            const duracao = servicoData.duracao || 30; // 30min padrão caso falhe
            
            const fimExistente = new Date(inicioExistente.getTime() + duracao * 60000);

            console.log(`Checando contra ID ${existente.id}: ${inicioExistente.toISOString()} - ${fimExistente.toISOString()}`);

            // Regra de Overlap correta
            if (dataInicio < fimExistente && dataFim > inicioExistente) {
                return true; 
            }
        }
        return false;
    }

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
                    { model: Profissionais, as: 'Profissional' }
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
                    { 
                        model: Servicos,
                        include: [
                            { association: 'nome_servico' }
                        ]
                    },
                    { model: Profissionais, as: 'Profissional' }
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
            console.log('--- DEBUG CREATE AGENDAMENTO ---');
            console.log('Payload recebido:', req.body);

            // Validação de existência das entidades relacionadas
            const cliente = await Clientes.findByPk(cliente_id);
            if (!cliente) {
                console.log('Cliente não encontrado:', cliente_id);
                return res.status(400).json({ error: 'Cliente não encontrado.' });
            }
            const servico = await Servicos.findByPk(servico_id);
            if (!servico) {
                console.log('Serviço não encontrado:', servico_id);
                return res.status(400).json({ error: 'Serviço não encontrado.' });
            }
            const profissional = await Profissionais.findByPk(profissional_id);
            if (!profissional) {
                console.log('Profissional não encontrado:', profissional_id);
                return res.status(400).json({ error: 'Profissional não encontrado.' });
            }

            // Calcular data_fim usando a duração do serviço
            const dataInicio = new Date(data_hora);
            const dataFim = new Date(dataInicio.getTime() + servico.duracao * 60000); // minutos para ms
            console.log('Data início:', dataInicio.toISOString(), 'Data fim:', dataFim.toISOString(), 'Duração:', servico.duracao);

            // Verificar sobreposição de horário
            const ocupado = await this.verificarHorario(profissional_id, dataInicio, dataFim);
            if (ocupado) {
                console.log('Conflito detectado, não pode criar agendamento!');
                return res.status(400).json({ error: 'Este profissional já possui um agendamento neste horário' });
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
                    { model: Profissionais, as: 'Profissional' }
                ]
            });
            console.log('Agendamento criado com sucesso:', agendamentoCriado);
            return res.status(201).json(agendamentoCriado);
        } catch (e) {
            console.log('Erro ao criar agendamento:', e);
            return res.status(400).json({ error: 'Erro ao criar agendamento.', details: e.message });
        }
    }

    async update(req, res) {
        const id = req.params.id;
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

            // Calcular data_fim usando a duração do serviço
            const dataInicio = new Date(data_hora);
            const dataFim = new Date(dataInicio.getTime() + servico.duracao * 60000);

            // Verificar sobreposição de horário ignorando o próprio agendamento
            const inicioDia = new Date(dataInicio);
            inicioDia.setHours(0, 0, 0, 0);
            const fimDia = new Date(dataInicio);
            fimDia.setHours(23, 59, 59, 999);
            const agendamentosNoMesmoDia = await Agendamentos.findAll({
                where: {
                    profissional_id,
                    data_hora: {
                        [Op.between]: [inicioDia, fimDia]
                    },
                    id: { [Op.ne]: id }
                },
                include: [{ model: Servicos }]
            });
            for (const existente of agendamentosNoMesmoDia) {
                const inicioExistente = new Date(existente.data_hora);
                const servicoData = existente.Servico || existente.Servicos || {};
                const duracaoExistente = servicoData.duracao || 30;
                const fimExistente = new Date(inicioExistente.getTime() + duracaoExistente * 60000);
                if (dataInicio < fimExistente && dataFim > inicioExistente) {
                    return res.status(400).json({ error: 'Este profissional já possui um agendamento neste horário' });
                }
            }

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

    async finalizarAtendimento(req, res) {
        const id = req.params.id;
        const { cliente_id, ...dadosFinanceiro } = req.body;

        try {
            const agendamento = await Agendamentos.findByPk(id, {
                include: [
                    { model: Clientes },
                    {
                        model: Servicos,
                        include: [{ association: 'nome_servico' }]
                    },
                    { model: Profissionais, as: 'Profissional' }
                ]
            });

            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }

            const transaction = await Agendamentos.sequelize.transaction();

            try {
                const financeiroCriado = await Financeiro.create(
                    {
                        ...dadosFinanceiro,
                        agendamento_id: id
                    },
                    { transaction }
                );

                await Agendamentos.update(
                    { status: 'concluido' },
                    { where: { id }, transaction }
                );

                await transaction.commit();

                return res.status(201).json({
                    message: 'Agendamento finalizado com sucesso.',
                    financeiro: financeiroCriado,
                    agendamento: {
                        ...agendamento.toJSON(),
                        status: 'concluido'
                    }
                });
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (error) {
            console.error('Erro ao finalizar agendamento:', error);
            return res.status(400).json({
                error: 'Erro ao finalizar atendimento.',
                details: error.message
            });
        }
    }
}

module.exports = new AgendamentosController();
