const express = require('express')
const router = express.Router()
const ProfissionalController = require('../controllers/ProfissionalController')
const { validateToken, isAdmin } = require('../middlewares/AuthMiddleware');

//rota base: /profissionais
router.get('/', ProfissionalController.getAll)

router.get('/byId/:id', ProfissionalController.getById)

router.post('/', validateToken, isAdmin, ProfissionalController.create)

router.patch('/update/:id', ProfissionalController.update)

router.delete('/delete/:id', ProfissionalController.delete)

module.exports = router;
