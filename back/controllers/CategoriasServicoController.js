const { CategoriasServico } = require('../models')

class CategoriasServicoController {
    async getAll(req, res) {
        try {
            const categorias = await CategoriasServico.findAll({
                order: [['nome', 'ASC']]
            })

            if (categorias.length === 0) {
                return res.status(200).json({
                    message: 'Nenhuma categoria encontrada.',
                    data: []
                })
            }

            return res.status(200).json(categorias)
        } catch (error) {
            console.error('Erro ao buscar categorias de servico:', error)
            return res.status(500).json({
                error: 'Erro interno no servidor ao tentar buscar as categorias.',
                details: error.message
            })
        }
    }

    async getById(req, res) {
        const id = req.params.id
        try {
            const categoria = await CategoriasServico.findByPk(id)
            if (categoria) {
                return res.json(categoria)
            }
            return res.status(404).json({ error: 'Categoria nao encontrada' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar categoria.' })
        }
    }

    async create(req, res) {
        const categoria = req.body
        try {
            const novaCategoria = await CategoriasServico.create(categoria)
            return res.status(201).json(novaCategoria)
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar categoria.' })
        }
    }

    async update(req, res) {
        const idCategoria = req.params.id
        const { nome } = req.body
        try {
            const [updated] = await CategoriasServico.update(
                { nome },
                { where: { id: idCategoria } }
            )

            if (updated) {
                return res.json('Categoria atualizada')
            }
            return res.status(404).json({ error: 'Categoria nao encontrada' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar categoria' })
        }
    }

    async delete(req, res) {
        const idCategoria = req.params.id
        try {
            const resultado = await CategoriasServico.destroy({
                where: {
                    id: idCategoria
                }
            })
            if (resultado > 0) {
                return res.json('Categoria deletada')
            }
            return res.json('Categoria nao encontrada ou ja deletada')
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao deletar categoria' })
        }
    }
}

module.exports = new CategoriasServicoController()
