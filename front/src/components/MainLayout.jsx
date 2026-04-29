import React from 'react'
import { Header } from './Header'
import { Home } from '../pages/Home'
import { ClienteNovo } from '../pages/ClienteNovo'
import { Cliente } from '../pages/Cliente'
import { Login } from '../pages/Login'
import { ClienteEdit } from '../pages/ClienteEdit'
import { PaginaClientes } from '../pages/PaginaClientes'
import { PaginaAgendamentos } from '../pages/PaginaAgendamentos'
import { AgendamentoNovo } from '../pages/AgendamentoNovo'
import { Agendamento } from '../pages/Agendamento'
import { AgendamentoEdit } from '../pages/AgendamentoEdit'
import { Error } from '../pages/Error'
import { Route, Routes } from 'react-router-dom'
import { PaginaProfissionais } from '../pages/PaginaProfissionais'
import { ProfissionalNovo } from '../pages/ProfissionalNovo'
import { Profissional } from '../pages/Profissional'
import { ProfissionalEdit } from '../pages/ProfissionalEdit'
import { PaginaProdutos } from '../pages/PaginaProdutos'
import { ProdutoNovo } from '../pages/ProdutoNovo'
import { Produto } from '../pages/Produto'
import { ProdutoEdit } from '../pages/ProdutoEdit'
import { PaginaServicos } from '../pages/PaginaServicos'
import { ServicoNovo } from '../pages/ServicoNovo'
import { Servico } from '../pages/Servico'
import { ServicoEdit } from '../pages/ServicoEdit'
import { PaginaCategoriasServico } from '../pages/PaginaCategoriasServico'
import { CategoriasServicoNovo } from '../pages/CategoriasServicoNovo'
import { CategoriasServico } from '../pages/CategoriasServico'
import { CategoriasServicoEdit } from '../pages/CategoriasServicoEdit'
import { PaginaNomesServico } from '../pages/PaginaNomesServico'
import { NomesServicoNovo } from '../pages/NomesServicoNovo'
import { NomesServico } from '../pages/NomesServico'
import { NomesServicoEdit } from '../pages/NomesServicoEdit'
import { FinanceiroEdit } from '../pages/FinanceiroEdit'
import { PaginaFinanceiro } from '../pages/PaginaFinanceiro'
import { FinanceiroNovo } from '../pages/FinanceiroNovo'
import { Financeiro } from '../pages/Financeiro'

export const MainLayout = () => {
  return (
    <div className='flex min-h-screen h-full bg-neutral-100'>

      <aside className='w-1/5 fixed h-screen top-0 left-0 bg-neutral-100 z-50'>
        <Header />
      </aside>

      <main className='my-8 px-8 w-4/5 ml-[20%] '>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/cliente/novo' element={<ClienteNovo />} />
          <Route path='/cliente/:id' element={<Cliente />} />
          <Route path='/cliente/edit/:id' element={<ClienteEdit />} />
          <Route path='/clientes' element={<PaginaClientes />} />
          <Route path='/agendamentos' element={<PaginaAgendamentos />} />
          <Route path='/agendamento/novo' element={<AgendamentoNovo />} />
          <Route path='/agendamento/:id' element={<Agendamento />} />
          <Route path='/agendamento/edit/:id' element={<AgendamentoEdit />} />
          <Route path='/profissionais' element={<PaginaProfissionais />} />
          <Route path='/profissional/novo' element={<ProfissionalNovo />} />
          <Route path='/profissional/:id' element={<Profissional />} />
          <Route path='/profissional/edit/:id' element={<ProfissionalEdit />} />
          <Route path='/produtos' element={<PaginaProdutos />} />
          <Route path='/produto/novo' element={<ProdutoNovo />} />
          <Route path='/produto/:id' element={<Produto />} />
          <Route path='/produto/edit/:id' element={<ProdutoEdit />} />
          <Route path='/servicos' element={<PaginaServicos />} />
          <Route path='/servico/novo' element={<ServicoNovo />} />
          <Route path='/servico/:id' element={<Servico />} />
          <Route path='/servico/edit/:id' element={<ServicoEdit />} />
          <Route path='/categorias-servico' element={<PaginaCategoriasServico />} />
          <Route path='/categoria-servico/novo' element={<CategoriasServicoNovo />} />
          <Route path='/categoria-servico/:id' element={<CategoriasServico />} />
          <Route path='/categoria-servico/edit/:id' element={<CategoriasServicoEdit />} />
          <Route path='/nomes-servico' element={<PaginaNomesServico />} />
          <Route path='/nome-servico/novo' element={<NomesServicoNovo />} />
          <Route path='/nome-servico/:id' element={<NomesServico />} />
          <Route path='/nome-servico/edit/:id' element={<NomesServicoEdit />} />
          <Route path='/financeiro' element={<PaginaFinanceiro />} />
          <Route path='/financeiro/novo' element={<FinanceiroNovo />} />
          <Route path='/financeiro/:id' element={<Financeiro />} />
          <Route path='/financeiro/edit/:id' element={<FinanceiroEdit />} />

          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  )
}
