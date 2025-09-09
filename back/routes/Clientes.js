const express = require('express')
const router = express.Router()
const { Clientes } = require('../models')

module.exports = router;

router.get('/', async (req, res) => { //rota get/clientes
    const listaClientes = await Clientes.findAll()
    res.json(listaClientes)
})

router.post('/', async (req, res) => { //rota get/clientes
    const cliente = req.body //5 dados
    await Clientes.create(cliente)
    res.json(cliente)
})