const express = require('express')
const router = express.Router()
module.exports = router;
const { validateToken } = require('../middlewares/AuthMiddleware');
const UsuarioController = require('../controllers/UsuarioController')

//rota base: /auth
router.post('/', UsuarioController.create)

router.post('/login', UsuarioController.login)

router.get('/auth', validateToken, UsuarioController.loginValidate)

