const express = require('express')
const router = express.Router()
const { Clientes } = require('../models')
//rota base: /clientes

module.exports = router;

router.get('/', async (req, res) => { //getall
    const listaClientes = await Clientes.findAll()
    res.json(listaClientes)
})

router.get('/byId/:id', async (req, res) => { //getbyid
    const id = req.params.id
    const cliente = await Clientes.findByPk(id)
    res.json(cliente)
})

router.post('/', async (req, res) => { //cria cliente
    const cliente = req.body //5 dados
    await Clientes.create(cliente)
    res.json(cliente)
})

router.patch('/update/:id', async (req, res) => { //edita cliente
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
})

router.delete('/delete/:id', async (req, res) => { //exclui cliente
    const idCliente = req.params.id

    await Clientes.destroy({
        where: {
            id: idCliente
        }
    })
    res.json('usuario deletado')
})