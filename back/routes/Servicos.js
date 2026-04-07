const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/ServicoController');
module.exports = router;

// rota base: /servicos
router.get('/', ServicoController.getAll);

router.get('/byId/:id', ServicoController.getById);

router.post('/', ServicoController.create);

router.patch('/update/:id', ServicoController.update);

router.delete('/delete/:id', ServicoController.delete);
