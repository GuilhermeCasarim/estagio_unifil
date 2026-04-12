const express = require('express')
const router = express.Router()
const CategoriaServicoController = require('../controllers/CategoriaServicoController')
module.exports = router

// rota base: /categorias-servico
router.get('/', CategoriaServicoController.getAll)

router.get('/byId/:id', CategoriaServicoController.getById)

router.post('/', CategoriaServicoController.create)

router.patch('/update/:id', CategoriaServicoController.update)

router.delete('/delete/:id', CategoriaServicoController.delete)
