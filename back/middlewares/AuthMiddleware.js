const { verify } = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken')
    if (!accessToken) return res.json({ error: 'usuario deve realizar login' })

    try {
        const validToken = verify(accessToken, 'macaco')
        req.usuario = validToken
        if (validToken) return next();
    } catch (e) {
        return res.json({ error: 'erro', e })
    }
}
module.exports = { validateToken }
