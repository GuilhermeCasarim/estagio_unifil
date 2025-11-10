const express = require('express')
const router = express.Router()
const ClienteController = require('../controllers/ClienteController')
module.exports = router;

//rota base: /clientes
router.get('/', ClienteController.getAll)

router.get('/byId/:id', ClienteController.getById)

router.post('/', ClienteController.create)

router.patch('/update/:id', ClienteController.update)

router.delete('/delete/:id', ClienteController.delete)
