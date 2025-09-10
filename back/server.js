const express = require('express')
const db = require('./models')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const clienteRouter = require('./routes/Clientes')
app.use('/clientes', clienteRouter) //caminho padrao começa com /clientes

db.sequelize.sync().then(() => {
    app.listen((3001), () => console.log('server rodando na porta 3001'))
})