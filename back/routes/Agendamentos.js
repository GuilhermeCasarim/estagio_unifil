const express = require('express');
const router = express.Router();
const AgendamentosController = require('../controllers/AgendamentosController');

// Garante que o contexto do this está correto para métodos que usam this
const boundController = {
	getAll: AgendamentosController.getAll.bind(AgendamentosController),
	getById: AgendamentosController.getById.bind(AgendamentosController),
	create: AgendamentosController.create.bind(AgendamentosController),
	update: AgendamentosController.update.bind(AgendamentosController),
	delete: AgendamentosController.delete.bind(AgendamentosController)
};
module.exports = router;

// rota base: /agendamentos
router.get('/', boundController.getAll);

router.get('/byId/:id', boundController.getById);

router.post('/', boundController.create);

router.patch('/update/:id', boundController.update);

router.delete('/delete/:id', boundController.delete);
