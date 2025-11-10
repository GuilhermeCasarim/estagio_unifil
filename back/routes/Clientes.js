const express = require('express')
const router = express.Router()
const { Clientes } = require('../models')
const ClienteController = require('../controllers/ClienteController')
//rota base: /clientes

module.exports = router;

router.get('/', ClienteController.getAll)

router.get('/byId/:id', ClienteController.getById)

router.post('/', ClienteController.create)

router.patch('/update/:id', ClienteController.update)

router.delete('/delete/:id', ClienteController.delete)
