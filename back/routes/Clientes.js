const express = require('express')
const router = express.Router()
const { Clientes } = require('../models')

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

// router.patch('/', async (req, res) => { //edita cliente
//     const cliente = req.body //5 dados
//     await Clientes.create(cliente)
//     res.json(cliente)
// })

router.delete('/delete/:id', async (req, res) => { //exclui cliente
    const idCliente = req.params.id

    await Clientes.destroy({
        where: {
            id: idCliente
        }
    })
    res.json('usuario deletado')
})