const { Usuarios, Profissionais } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

class UsuarioController {
    async create(req, res) {
        const { login, senha, tipo_login } = req.body;
        await Usuarios.create({
            login,
            senha,
            tipo_login
        });
        res.json('Sucesso ao criar usuário!');
    }

    async login(req, res) {
        const { login, senha } = req.body
        const usuario = await Usuarios.findOne({ where: { login: login } }) //verif login banco e login recebido aqui/input
        if (!usuario) return res.json({ error: 'usuario nao existe' }) //retorna usuario

        bcrypt.compare(senha, usuario.senha).then((match) => {
            if (!match) return res.json({ error: 'senha errada' }) 
                //erro se login errado
            const accessToken = sign({ login: usuario.login, id: usuario.id, tipo_login: usuario.tipo_login }, process.env.JWT_SECRET)
            console.log(accessToken)
            //token -> credencial de login; a funcao sign cria o token
            return res.json({ token: accessToken, login: usuario.login, id: usuario.id, tipo_login: usuario.tipo_login })
        })
    }

    async list(req, res) {
        try {
            const usuarios = await Usuarios.findAll({
                attributes: ['id', 'login', 'tipo_login']
            })
            return res.json({ usuarios })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao listar usuários' })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            const usuario = await Usuarios.findByPk(id)

            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' })
            }

            await Usuarios.destroy({ where: { id } })
            return res.json({ message: 'Usuário deletado com sucesso' })
        } catch (e) {
            return res.status(500).json({ error: 'Erro ao deletar usuário' })
        }
    }

    loginValidate(req, res) {
        res.json(req.usuario) //autentica o token para login
    }
}

module.exports = new UsuarioController();
