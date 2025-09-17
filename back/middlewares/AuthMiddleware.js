const { verify } = require('jsonwebtoken')
module.exports = {validateToken}

const validateToken = (req, res, next) => {
    const accessToken = req.header('')
    if (!accessToken) return res.json({ error: 'usuario deve realizar login' })
    try {
        const validToken = () => verify(accessToken, 'macaco')
        if (validToken) return next();
    } catch (e) {
        return res.json({error: 'erro', e})
    }
}