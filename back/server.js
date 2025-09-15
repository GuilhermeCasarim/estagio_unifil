const express = require('express')
const db = require('./models')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const clientesRouter = require('./routes/Clientes')
app.use('/clientes', clientesRouter) //caminho padrao começa com /clientes

const usuariosRouter = require('./routes/Usuarios')
app.use('/auth', usuariosRouter)

db.sequelize.sync({force: true}).then(() => {
    app.listen((3001), () => console.log('server rodando na porta 3001'))
})