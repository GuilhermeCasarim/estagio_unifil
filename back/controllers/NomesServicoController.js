const { NomesServico } = require('../models')

class NomesServicoController {
    async getAll(req, res) {
        try {
            const nomes = await NomesServico.findAll({
                order: [['nome', 'ASC']]
            })

            if (nomes.length === 0) {
                return res.status(200).json({
                    message: 'Nenhum nome de servico encontrado.',
                    data: []
                })
            }

            return res.status(200).json(nomes)
        } catch (error) {
            console.error('Erro ao buscar nomes de servico:', error)
            return res.status(500).json({
                error: 'Erro interno no servidor ao tentar buscar os nomes.',
                details: error.message
            })
        }
    }

    async getById(req, res) {
        const id = req.params.id
        try {
            const nome = await NomesServico.findByPk(id)
            if (nome) {
                return res.json(nome)
            }
            return res.status(404).json({ error: 'Nome de servico nao encontrado' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar nome de servico.' })
        }
    }

    async create(req, res) {
        const nomeServico = req.body
        try {
            const novoNome = await NomesServico.create(nomeServico)
            return res.status(201).json(novoNome)
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar nome de servico.' })
        }
    }

    async update(req, res) {
        const idNome = req.params.id
        const { nome } = req.body
        try {
            const [updated] = await NomesServico.update(
                { nome },
                { where: { id: idNome } }
            )

            if (updated) {
                return res.json('Nome de servico atualizado')
            }
            return res.status(404).json({ error: 'Nome de servico nao encontrado' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar nome de servico' })
        }
    }

    async delete(req, res) {
        const idNome = req.params.id
        try {
            const resultado = await NomesServico.destroy({
                where: {
                    id: idNome
                }
            })
            if (resultado > 0) {
                return res.json('Nome de servico deletado')
            }
            return res.json('Nome de servico nao encontrado ou ja deletado')
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao deletar nome de servico' })
        }
    }
}

module.exports = new NomesServicoController()
