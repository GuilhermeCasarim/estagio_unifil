const express = require('express')
const router = express.Router()
const ProdutoController = require('../controllers/ProdutoController')
module.exports = router;

//rota base: /produtos
router.get('/', ProdutoController.getAll)

router.get('/byId/:id', ProdutoController.getById)

router.post('/', ProdutoController.create)

router.patch('/update/:id', ProdutoController.update)

router.patch('/update-estoque/:id', ProdutoController.updateEstoque)

router.delete('/delete/:id', ProdutoController.delete)
