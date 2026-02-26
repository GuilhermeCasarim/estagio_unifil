import React from 'react'
import { Header } from './Header'
import { Home } from '../pages/Home'
import { ClienteNovo } from '../pages/ClienteNovo'
import { Cliente } from '../pages/Cliente'
import { Login } from '../pages/Login'
import { ClienteEdit } from '../pages/ClienteEdit'
import { PaginaClientes } from '../pages/PaginaClientes'
import { Agendamento } from '../pages/Agendamento'
import { Error } from '../pages/Error'
import { Route, Routes } from 'react-router-dom'
import { PaginaProfissionais } from '../pages/PaginaProfissionais'

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
          <Route path='/agendamento' element={<Agendamento />} />
          <Route path='/profissionais' element={<PaginaProfissionais />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  )
}
