const express = require('express');
const router = express.Router();
const AgendamentosController = require('../controllers/AgendamentosController');
module.exports = router;

// rota base: /agendamentos
router.get('/', AgendamentosController.getAll);

router.get('/byId/:id', AgendamentosController.getById);

router.post('/', AgendamentosController.create);

router.patch('/update/:id', AgendamentosController.update);

router.delete('/delete/:id', AgendamentosController.delete);
