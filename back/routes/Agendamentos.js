const express = require('express');
const router = express.Router();
const AgendamentosController = require('../controllers/AgendamentosController');

// feito isso apenas no agnendamento pra garantir que o this fica certo.
const boundController = {
	getAll: AgendamentosController.getAll.bind(AgendamentosController),
	getHistorico: AgendamentosController.getHistorico.bind(AgendamentosController),
	getById: AgendamentosController.getById.bind(AgendamentosController),
	salvarConsumoAgendamento: AgendamentosController.salvarConsumoAgendamento.bind(AgendamentosController),
	create: AgendamentosController.create.bind(AgendamentosController),
	update: AgendamentosController.update.bind(AgendamentosController),
	delete: AgendamentosController.delete.bind(AgendamentosController),
	finalizarAtendimento: AgendamentosController.finalizarAtendimento.bind(AgendamentosController)
};
module.exports = router;

// rota base: /agendamentos
router.get('/', boundController.getAll);

router.get('/historico', boundController.getHistorico);

router.get('/byId/:id', boundController.getById);

router.post('/:id/consumo', boundController.salvarConsumoAgendamento);

router.post('/', boundController.create);

router.patch('/update/:id', boundController.update);

router.post('/:id/finalizar', boundController.finalizarAtendimento);

router.delete('/delete/:id', boundController.delete);
