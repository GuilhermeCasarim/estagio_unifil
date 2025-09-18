const express = require('express')
const router = express.Router()
const { Usuarios } = require('../models')
const bcrypt = require('bcrypt')
module.exports = router;

const {sign} = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');
//rota base: path
router.post('/', async (req, res) => { //cria
    const {login, senha, tipo_login} = req.body
    bcrypt.hash(senha, 10).then((hash) => {
        Usuarios.create({
            login: login,
            senha: hash,
            tipo_login: 'tipo_login'
        })
        res.json('sucesso ao criar usuario')
    })
})

router.post('/login', async (req, res) => { //autentica
    const {login, senha} = req.body
    const usuario = await Usuarios.findOne({where: {login: login}}) //verif login banco e login recebido aqui/input
    if(!usuario) return res.json({error: 'usuario nao existe'}) //retorna usuario
    
    bcrypt.compare(senha, usuario.senha).then((match) => {
        if(!match) return res.json({error: 'senha errada'}) //se fizer login(info certas), faz o token
        const accessToken = sign({login: usuario.login, id: usuario.id}, "macaco")
    //token -> credencial de login
        return res.json(accessToken)
    })
}) //busca na tabela um usuario = usuario daqui

router.get('/auth', validateToken, (req, res) => { //cria
    res.json(req.usuario)
})

