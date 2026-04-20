const { Profissionais, Servicos, ProfissionaisServico, NomesServico } = require('../models')
const { Op } = require('sequelize');

class ProfissionalController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;
            let whereCondition = {};

            if (search) {
                const searchTerm = `%${search}%`;
                whereCondition = {
                    [Op.or]: [
                        { nome: { [Op.like]: searchTerm } },
                        { email: { [Op.like]: searchTerm } },
                        { telefone: { [Op.like]: searchTerm } },
                        { especialidades: { [Op.like]: searchTerm } }
                    ]
                };
            }

            const totalProfissionais = await Profissionais.count();
            const listaProfissionais = await Profissionais.findAll({
                where: whereCondition,
                limit: limit,
                offset: offset,
                distinct: true,
                include: [
                    {
                        model: Servicos,
                        through: { attributes: [] },
                        include: [
                            {
                                model: NomesServico,
                                as: 'nome_servico',
                                attributes: ['id', 'nome']
                            }
                        ]
                    }
                ],
                order: [['nome', 'ASC']]
            });
            const totalPages = Math.ceil(totalProfissionais / limit);

            return res.status(200).json({
                profissionais: listaProfissionais,
                currentPage: page,
                totalPages: totalPages,
                totalProfissionais: totalProfissionais
            });
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
            const profissional = await Profissionais.findByPk(id, {
                include: [
                    {
                        model: Servicos,
                        through: { attributes: [] },
                        include: [
                            {
                                model: NomesServico,
                                as: 'nome_servico',
                                attributes: ['id', 'nome']
                            }
                        ]
                    }
                ]
            })
            if (profissional) {
                return res.json(profissional)
            }
            return res.status(404).json({ error: 'Profissional não encontrado' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar profissional.' })
        }
    }

    async create(req, res) {
        const { nomes_servico_ids, ...profissional } = req.body
        const nomesIds = Array.isArray(nomes_servico_ids)
            ? nomes_servico_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
            : []
        try {
            if (nomesIds.length === 0) {
                return res.status(400).json({ error: 'Selecione ao menos um nome de servico.' })
            }

            const nomesUnicos = [...new Set(nomesIds)]
            const nomes = await NomesServico.findAll({
                where: { id: { [Op.in]: nomesUnicos } },
                order: [['nome', 'ASC']]
            })

            if (nomes.length !== nomesUnicos.length) {
                return res.status(400).json({ error: 'Alguns nomes de servico nao foram encontrados.' })
            }

            const servicos = await Servicos.findAll({
                where: { nome_servico_id: { [Op.in]: nomesUnicos } },
                attributes: ['id', 'nome_servico_id']
            })

            const nomesSemServico = nomesUnicos.filter((id) => !servicos.some((servico) => servico.nome_servico_id === id))
            if (nomesSemServico.length > 0) {
                return res.status(400).json({
                    error: 'Crie um servico para todos os nomes selecionados antes de vincular ao profissional.'
                })
            }

            const transaction = await Profissionais.sequelize.transaction()
            try {
                const especialidades = nomes.map((nome) => nome.nome).join(', ')
                const novoProfissional = await Profissionais.create(
                    { ...profissional, especialidades },
                    { transaction }
                )

                const vinculos = servicos.map((servico) => ({
                    servico_id: servico.id,
                    profissional_id: novoProfissional.id
                }))
                await ProfissionaisServico.bulkCreate(vinculos, { transaction })

                await transaction.commit()

                const profissionalCriado = await Profissionais.findByPk(novoProfissional.id, {
                    include: [
                        {
                            model: Servicos,
                            through: { attributes: [] },
                            include: [
                                {
                                    model: NomesServico,
                                    as: 'nome_servico',
                                    attributes: ['id', 'nome']
                                }
                            ]
                        }
                    ]
                })

                return res.status(201).json(profissionalCriado)
            } catch (error) {
                await transaction.rollback()
                throw error
            }
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar profissional.' })
        }
    }

    async update(req, res) {
        const idProfissional = req.params.id
        const { nome, telefone, email, horario_inicio, horario_fim, dias_ativos, nomes_servico_ids } = req.body
        const nomesIds = Array.isArray(nomes_servico_ids)
            ? nomes_servico_ids.map((id) => Number(id)).filter((id) => Number.isInteger(id))
            : []
        try {
            if (nomesIds.length === 0) {
                return res.status(400).json({ error: 'Selecione ao menos um nome de servico.' })
            }

            const nomesUnicos = [...new Set(nomesIds)]
            const nomes = await NomesServico.findAll({
                where: { id: { [Op.in]: nomesUnicos } },
                order: [['nome', 'ASC']]
            })

            if (nomes.length !== nomesUnicos.length) {
                return res.status(400).json({ error: 'Alguns nomes de servico nao foram encontrados.' })
            }

            const servicos = await Servicos.findAll({
                where: { nome_servico_id: { [Op.in]: nomesUnicos } },
                attributes: ['id', 'nome_servico_id']
            })

            const nomesSemServico = nomesUnicos.filter((id) => !servicos.some((servico) => servico.nome_servico_id === id))
            if (nomesSemServico.length > 0) {
                return res.status(400).json({
                    error: 'Crie um servico para todos os nomes selecionados antes de vincular ao profissional.'
                })
            }

            const transaction = await Profissionais.sequelize.transaction()
            try {
                const especialidades = nomes.map((nome) => nome.nome).join(', ')
                await Profissionais.update(
                    { nome, telefone, email, horario_inicio, horario_fim, dias_ativos, especialidades },
                    { where: { id: idProfissional }, transaction }
                )

                await ProfissionaisServico.destroy({ where: { profissional_id: idProfissional }, transaction })

                const vinculos = servicos.map((servico) => ({
                    servico_id: servico.id,
                    profissional_id: idProfissional
                }))
                await ProfissionaisServico.bulkCreate(vinculos, { transaction })

                await transaction.commit()
                res.json('Profissional atualizado')
            } catch (error) {
                await transaction.rollback()
                throw error
            }
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