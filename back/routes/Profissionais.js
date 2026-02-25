const express = require('express')
const router = express.Router()
const ProfissionalController = require('../controllers/ProfissionalController')
module.exports = router;

//rota base: /profissionais
router.get('/', ProfissionalController.getAll)

// router.get('/byId/:id', ProfissionalController.getById)

// router.post('/', ProfissionalController.create)

// router.patch('/update/:id', ProfissionalController.update)

// router.delete('/delete/:id', ProfissionalController.delete)
