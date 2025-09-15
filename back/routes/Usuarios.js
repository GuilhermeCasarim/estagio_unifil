const express = require('express')
const router = express.Router()
const { Usuarios } = require('../models')
const bcrypt = require('bcrypt')

module.exports = router;

router.post('/', async (req, res) => {
    const {login, senha, tipo_login} = req.body
    bcrypt.hash(senha, 10).then((hash) => {
        Usuarios.create({
            login: login,
            senha: hash,
            tipo_login: tipo_login
        })
        res.json('sucesso ao criar usuario')
    })
})