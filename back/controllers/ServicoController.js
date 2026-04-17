const { Servicos, Produtos, ServicosProduto, CategoriasServico, NomesServico, Profissionais, ProfissionaisServico } = require('../models');

class ServicoController {
    async getAll(req, res) {
        try {
            const servicos = await Servicos.findAll({
                include: [{
                    model: NomesServico,
                    as: 'nome_servico',
                    attributes: ['id', 'nome']
                },
                {
                    model: CategoriasServico,
                    as: 'categoria',
                    attributes: ['id', 'nome']
                },
                {
                    model: Profissionais,
                    through: {
                        attributes: []
                    }
                }],
                order: [[{ model: NomesServico, as: 'nome_servico' }, 'nome', 'ASC']]
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
            const servico = await Servicos.findByPk(id, {
                include: [
                    {
                        model: NomesServico,
                        as: 'nome_servico',
                        attributes: ['id', 'nome']
                    },
                    {
                        model: CategoriasServico,
                        as: 'categoria',
                        attributes: ['id', 'nome']
                    },
                    {
                        model: Produtos,
                        through: {
                            attributes: ['quant', 'data_hora']
                        }
                    },
                    {
                        model: Profissionais,
                        through: {
                            attributes: []
                        }
                    }
                ]
            });
            if (servico) {
                return res.json(servico);
            }
            return res.status(404).json({ error: 'Servico nao encontrado' });
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar servico.' });
        }
    }

    async create(req, res) {
        const { produtos_utilizados, profissionais_ids, ...servico } = req.body;
        if (servico.nome_servico_id !== undefined) {
            servico.nome_servico_id = Number(servico.nome_servico_id) || null;
        }
        if (!Array.isArray(produtos_utilizados) || produtos_utilizados.length === 0) {
            return res.status(400).json({
                error: 'Selecione ao menos um produto utilizado.'
            });
        }
        const profissionaisIds = Array.isArray(profissionais_ids)
            ? profissionais_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
            : [];
        try {
            const transaction = await Servicos.sequelize.transaction();
            try {
                const novoServico = await Servicos.create(servico, { transaction });

                if (Array.isArray(produtos_utilizados) && produtos_utilizados.length > 0) {
                    const itens = produtos_utilizados.map((item) => ({
                        servico_id: novoServico.id,
                        produto_id: item.produto_id,
                        quant: item.quant ?? 1,
                        data_hora: item.data_hora ?? new Date()
                    }));

                    await ServicosProduto.bulkCreate(itens, { transaction });
                }

                if (profissionaisIds.length > 0) {
                    const vinculos = profissionaisIds.map((profissionalId) => ({
                        servico_id: novoServico.id,
                        profissional_id: profissionalId
                    }));
                    await ProfissionaisServico.bulkCreate(vinculos, { transaction });
                }

                await transaction.commit();

                const servicoCriado = await Servicos.findByPk(novoServico.id, {
                    include: [
                        {
                            model: NomesServico,
                            as: 'nome_servico',
                            attributes: ['id', 'nome']
                        },
                        {
                            model: CategoriasServico,
                            as: 'categoria',
                            attributes: ['id', 'nome']
                        },
                        {
                            model: Produtos,
                            through: {
                                attributes: ['quant', 'data_hora']
                            }
                        },
                        {
                            model: Profissionais,
                            through: {
                                attributes: []
                            }
                        }
                    ]
                });

                return res.status(201).json(servicoCriado);
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (e) {
            console.error('Erro ao criar servico:', e);
            return res.status(400).json({
                error: 'Erro ao criar servico.',
                details: e.message
            });
        }
    }

    async update(req, res) {
        const idServico = req.params.id;
        const { nome_servico_id, preco, duracao, categoria_servico_id, produtos_utilizados, profissionais_ids } = req.body;
        const profissionaisIds = Array.isArray(profissionais_ids)
            ? profissionais_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
            : null;
        try {
            const transaction = await Servicos.sequelize.transaction();
            try {
                const [updated] = await Servicos.update(
                    {
                        nome_servico_id: nome_servico_id !== undefined ? Number(nome_servico_id) || null : null,
                        preco,
                        duracao,
                        categoria_servico_id
                    },
                    { where: { id: idServico }, transaction }
                );

                if (!updated) {
                    await transaction.rollback();
                    return res.status(404).json({ error: 'Servico nao encontrado' });
                }

                if (Array.isArray(produtos_utilizados)) {
                    await ServicosProduto.destroy({ where: { servico_id: idServico }, transaction });

                    if (produtos_utilizados.length > 0) {
                        const itens = produtos_utilizados.map((item) => ({
                            servico_id: idServico,
                            produto_id: item.produto_id,
                            quant: item.quant ?? 1,
                            data_hora: item.data_hora ?? new Date()
                        }));

                        await ServicosProduto.bulkCreate(itens, { transaction });
                    }
                }

                if (Array.isArray(profissionaisIds)) {
                    await ProfissionaisServico.destroy({ where: { servico_id: idServico }, transaction });

                    if (profissionaisIds.length > 0) {
                        const vinculos = profissionaisIds.map((profissionalId) => ({
                            servico_id: idServico,
                            profissional_id: profissionalId
                        }));
                        await ProfissionaisServico.bulkCreate(vinculos, { transaction });
                    }
                }

                await transaction.commit();
                return res.json('Servico atualizado');
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } catch (e) {
            console.error('Erro ao atualizar servico:', e);
            return res.status(500).json({
                error: 'Erro ao atualizar servico',
                details: e.message
            });
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
