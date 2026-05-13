const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken')
    if (!accessToken) return res.status(401).json({ error: 'usuario deve realizar login' })

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET)
        req.usuario = validToken
        if (validToken) return next();
    } catch (e) {
        return res.status(401).json({ error: 'erroToken', e })
    }

    return res.status(401).json({ error: 'Token inválido' })
}

const isAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.tipo_login === 'administrador') {
        return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem fazer isso.' });
}

module.exports = { validateToken, isAdmin }
