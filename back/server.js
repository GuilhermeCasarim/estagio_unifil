require('dotenv').config()
const express = require('express')
const cors = require('cors')
const registerRoutesExplorer = require('./routes.js')

const app = express()
app.use(express.json())
app.use(cors())

const registeredRouters = []

const registerRouter = (basePath, router) => {
	registeredRouters.push({ basePath, router })
	app.use(basePath, router)
}

const clientesRouter = require('./routes/Clientes')
registerRouter('/clientes', clientesRouter) //caminho padrao começa com /clientes

const profissionaisRouter = require('./routes/Profissionais')
registerRouter('/profissionais', profissionaisRouter) //caminho padrao começa com/profissionais

const usuariosRouter = require('./routes/Usuarios')
registerRouter('/auth', usuariosRouter)

const produtosRouter = require('./routes/Produtos')
registerRouter('/produtos', produtosRouter) //caminho padrao começa com /produtos

const servicosRouter = require('./routes/Servicos')
registerRouter('/servicos', servicosRouter) //caminho padrao começa com /servicos

const categoriasServicoRouter = require('./routes/CategoriasServico')
registerRouter('/categorias-servico', categoriasServicoRouter)

const nomesServicoRouter = require('./routes/NomesServico')
registerRouter('/nomes-servico', nomesServicoRouter)

const financeiroRouter = require('./routes/Financeiro')
registerRouter('/financeiro', financeiroRouter) //caminho padrao começa com /financeiro

const agendamentosRouter = require('./routes/Agendamentos')
registerRouter('/agendamentos', agendamentosRouter) //caminho padrao começa com /agendamentos

registerRoutesExplorer(app, registeredRouters, {
	environment: process.env.NODE_ENV || 'development'
})

app.listen((3001), () => {
	console.log('server rodando na porta 3001')
})