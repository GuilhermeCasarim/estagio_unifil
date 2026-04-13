const express = require('express')
const router = express.Router()
const CategoriasServicoController = require('../controllers/CategoriasServicoController')
module.exports = router

// rota base: /categorias-servico
router.get('/', CategoriasServicoController.getAll)

router.get('/byId/:id', CategoriasServicoController.getById)

router.post('/', CategoriasServicoController.create)

router.patch('/update/:id', CategoriasServicoController.update)

router.delete('/delete/:id', CategoriasServicoController.delete)
