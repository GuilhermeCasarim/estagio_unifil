const express = require('express');
const router = express.Router();
const FinanceiroController = require('../controllers/FinanceiroController');
module.exports = router;

// rota base: /financeiro
router.get('/', FinanceiroController.getAll);

router.get('/byId/:id', FinanceiroController.getById);

router.post('/', FinanceiroController.create);

router.patch('/update/:id', FinanceiroController.update);

router.delete('/delete/:id', FinanceiroController.delete);
