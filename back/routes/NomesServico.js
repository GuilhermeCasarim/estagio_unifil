const express = require('express')
const router = express.Router()
const NomesServicoController = require('../controllers/NomesServicoController')
module.exports = router

// rota base: /nomes-servico
router.get('/', NomesServicoController.getAll)

router.get('/byId/:id', NomesServicoController.getById)

router.post('/', NomesServicoController.create)

router.patch('/update/:id', NomesServicoController.update)

router.delete('/delete/:id', NomesServicoController.delete)
