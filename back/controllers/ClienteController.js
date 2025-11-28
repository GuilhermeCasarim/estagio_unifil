const { Clientes } = require('../models')
const { Op } = require('sequelize');

class ClienteController {
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1; //pagina atual
            const limit = parseInt(req.query.limit) || 12; //qnts registro
            const search = req.query.search || '';
            const offset = (page - 1) * limit; //qnt de pagina pra pular
            let whereCondition = {}
            if (search) {
                const searchTerm = `%${search}%`; //filtro
                whereCondition = {
                    [Op.or]: [
                        { nome: { [Op.like]: searchTerm } },
                        { email: { [Op.like]: searchTerm } },
                        { telefone: { [Op.like]: searchTerm } }
                    ]
                };
            }
            
            const totalClientes = await Clientes.count();

            const listaClientes = await Clientes.findAll({
                where: whereCondition,
                limit: limit,
                offset: offset,
                order: [['nome', 'ASC']]
            });
            const totalPages = Math.ceil(totalClientes / limit);
            return res.json({
                clientes: listaClientes,
                currentPage: page,
                totalPages: totalPages,
                totalClientes: totalClientes
            });
            // const listaClientes = await Clientes.findAll()
            // return res.json(listaClientes)
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar clientes.' })
        }
    }

    async getById(req, res) {
        const id = req.params.id
        try {
            const cliente = await Clientes.findByPk(id)
            if (cliente) {
                return res.json(cliente)
            }
            return res.status(404).json({ error: 'Cliente não encontrado' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar cliente.' })
        }
    }

    async create(req, res) {
        const cliente = req.body
        try {
            await Clientes.create(cliente)
            return res.status(201).json(cliente)
        } catch (e) {
            return res.status(400).json({ error: 'Erro ao criar cliente.' })
        }
    }

    async update(req, res) {
        const idCliente = req.params.id
        const { nome, telefone, email, cpf, data_nascimento, observacoes } = req.body //5 dados
        try {
            await Clientes.update(
                { nome, telefone, email, cpf, data_nascimento, observacoes },
                { where: { id: idCliente } }
            )
            res.json('cliente atualizado')
        } catch (e) {
            res.json({ error: 'erro ao atualizar cliente' })
        }
    }

    async delete(req, res) {
        const idCliente = req.params.id
        try {
            await Clientes.destroy({
                where: {
                    id: idCliente
                }
            })
            res.json('usuario deletado')
        } catch (e) {
            res.json({ error: 'erro ao deletar cliente' })
        }
    }
}

module.exports = new ClienteController()