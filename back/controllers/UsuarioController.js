const { Usuarios } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

class UsuarioController {
    async create(req, res) {
        const { login, senha, tipo_login = 'tipoLogin' } = req.body
        bcrypt.hash(senha, 10).then((hash) => {
            Usuarios.create({
                login,
                senha: hash,
                tipo_login
            })
            res.json('sucesso ao criar usuario')
        })
    }

    async login(req, res) {
        const { login, senha } = req.body
        const usuario = await Usuarios.findOne({ where: { login: login } }) //verif login banco e login recebido aqui/input
        if (!usuario) return res.json({ error: 'usuario nao existe' }) //retorna usuario

        bcrypt.compare(senha, usuario.senha).then((match) => {
            if (!match) return res.json({ error: 'senha errada' }) //se fizer login(info certas), faz o token
            const accessToken = sign({ login: usuario.login, id: usuario.id }, "macaco")
            console.log(accessToken)
            //token -> credencial de login; a funcao sign cria o token
            return res.json({ token: accessToken, login: usuario.login, id: usuario.id })
        })
    }

    loginValidate(req, res) {
        res.json(req.usuario) //autentica o token para login
    }
}

module.exports = new UsuarioController();
