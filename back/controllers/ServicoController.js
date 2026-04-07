const { Servicos } = require('../models');

class ServicoController {
    async getAll(req, res) {
        try {
            const servicos = await Servicos.findAll({
                order: [['nome', 'ASC']]
            });

            if (servicos.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum servico encontrado.',
                    data: []
                });
            }

            return res.status(200).json(servicos);
        } catch (error) {
            console.error('Erro ao buscar servicos:', error);
            return res.status(500).json({
                error: 'Erro interno no servidor ao tentar buscar os servicos.',
                details: error.message
            });
        }
    }

    async getById(req, res) {
        const id = req.params.id;
        try {
            const servico = await Servicos.findByPk(id);
            if (servico) {
                return res.json(servico);
            }
            return res.status(404).json({ error: 'Servico nao encontrado' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar servico.' });
        }
    }

    async create(req, res) {
        const servico = req.body;
        try {
            const novoServico = await Servicos.create(servico);
            return res.status(201).json(novoServico);
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar servico.' });
        }
    }

    async update(req, res) {
        const idServico = req.params.id;
        const { nome, categoria, preco, profissionais_ativos, duracao } = req.body;
        try {
            const [updated] = await Servicos.update(
                { nome, categoria, preco, profissionais_ativos, duracao },
                { where: { id: idServico } }
            );

            if (updated) {
                return res.json('Servico atualizado');
            }

            return res.status(404).json({ error: 'Servico nao encontrado' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar servico' });
        }
    }

    async delete(req, res) {
        const idServico = req.params.id;
        try {
            const resultado = await Servicos.destroy({
                where: {
                    id: idServico
                }
            });
            if (resultado > 0) {
                return res.json('Servico deletado');
            }
            return res.json('Servico nao encontrado ou ja deletado');
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao deletar servico' });
        }
    }
}

module.exports = new ServicoController();
