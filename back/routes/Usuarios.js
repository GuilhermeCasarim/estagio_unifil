const express = require('express')
const router = express.Router()
const { Usuarios } = require('../models')
const bcrypt = require('bcrypt')
module.exports = router;

const {sign} = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');
//rota base: /auth
router.post('/', async (req, res) => { //cria usuario no banco(nao implementado; apenas no Insomnia/API)
    const {login, senha, tipo_login = 'tipoLogin'} = req.body
    bcrypt.hash(senha, 10).then((hash) => {
        Usuarios.create({
            login,
            senha: hash,
            tipo_login
        })
        res.json('sucesso ao criar usuario')
    })
})

router.post('/login', async (req, res) => { //login forms; autentica; usar insomnia para criar user
    const {login, senha} = req.body
    const usuario = await Usuarios.findOne({where: {login: login}}) //verif login banco e login recebido aqui/input
    if(!usuario) return res.json({error: 'usuario nao existe'}) //retorna usuario
    
    bcrypt.compare(senha, usuario.senha).then((match) => {
        if(!match) return res.json({error: 'senha errada'}) //se fizer login(info certas), faz o token
        const accessToken = sign({login: usuario.login, id: usuario.id}, "macaco")
        console.log(accessToken)
    //token -> credencial de login; a funcao sign cria o token
        return res.json({token: accessToken, login: usuario.login, id: usuario.id})
    })
}) //busca na tabela um usuario daqui

router.get('/auth', validateToken, (req, res) => {
    res.json(req.usuario) //autentica o token para login
})

