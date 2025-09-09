const express = require('express')
const db = require('./models')

const app = express()
app.use(express.json())

const clienteRouter = require('./routes/Clientes')
app.use('/clientes', clienteRouter) //caminho padrao começa com /clientes

db.sequelize.sync().then(() => {
    app.listen((3001), () => console.log('server rodando na porta 3001'))
})