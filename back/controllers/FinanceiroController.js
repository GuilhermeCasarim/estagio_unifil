const { Financeiro } = require('../models');

class FinanceiroController {
    async getAll(req, res) {
        try {
            const transacoes = await Financeiro.findAll({
                order: [['data_pagamento', 'DESC']]
            });
            if (transacoes.length === 0) {
                return res.status(200).json({
                    message: 'Nenhuma transacao encontrada.',
                    data: []
                });
            }
            return res.status(200).json(transacoes);
        } catch (error) {
            console.error('Erro ao buscar transacoes:', error);
            return res.status(500).json({
                error: 'Erro interno no servidor ao tentar buscar as transacoes.',
                details: error.message
            });
        }
    }

    async getById(req, res) {
        const id = req.params.id;
        try {
            const transacao = await Financeiro.findByPk(id);
            if (transacao) {
                return res.json(transacao);
            }
            return res.status(404).json({ error: 'Transacao nao encontrada' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar transacao.' });
        }
    }

    async create(req, res) {
        const {
            tipo,
            valor,
            descricao,
            forma_pagamento,
            categoria,
            status,
            data_pagamento
        } = req.body;

        try {
            const novaTransacao = await Financeiro.create({
                tipo,
                valor,
                descricao,
                forma_pagamento,
                categoria,
                status,
                data_pagamento
            });
            return res.status(201).json(novaTransacao);
        } catch (e) {
            return res.status(400).json({
                error: 'Erro ao criar transacao.',
                details: e?.message,
                fields: Array.isArray(e?.errors) ? e.errors.map((err) => ({
                    field: err.path,
                    message: err.message
                })) : []
            });
        }
    }

    async update(req, res) {
        const idTransacao = req.params.id;
        const {
            tipo,
            valor,
            descricao,
            forma_pagamento,
            categoria,
            status,
            data_pagamento
        } = req.body;

        try {
            const [updated] = await Financeiro.update(
                {
                    tipo,
                    valor,
                    descricao,
                    forma_pagamento,
                    categoria,
                    status,
                    data_pagamento
                },
                { where: { id: idTransacao } }
            );

            if (updated) {
                return res.json('Transacao atualizada');
            }
            return res.status(404).json({ error: 'Transacao nao encontrada' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar transacao' });
        }
    }

    async delete(req, res) {
        const idTransacao = req.params.id;
        try {
            const resultado = await Financeiro.destroy({
                where: {
                    id: idTransacao
                }
            });
            if (resultado > 0) {
                return res.json('Transacao deletada');
            }
            return res.json('Transacao nao encontrada ou ja deletada');
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao deletar transacao' });
        }
    }
}

module.exports = new FinanceiroController();
