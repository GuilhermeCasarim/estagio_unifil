import React from 'react'
import { Header } from './Header'
import { Home } from '../pages/Home'
import { Clientes } from '../pages/Clientes'
import { Cliente } from '../pages/Cliente'
import { Login } from '../pages/Login'
import { ClienteEdit } from '../pages/ClienteEdit'
import { ListaClientes } from '../pages/ListaClientes'
import { Agendamento } from '../pages/Agendamento'
import { Error } from '../pages/Error'
import { Route, Routes } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className='flex space-x-12 min-h-[100vh]'>

      <aside className='h-full'>
        <Header />
      </aside>

      <main className='mt-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/clientes' element={<Clientes />} />
          <Route path='/cliente/:id' element={<Cliente />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cliente/edit/:id' element={<ClienteEdit />} />
          <Route path='/clientes/lista' element={<ListaClientes />} />
          <Route path='/agendamento' element={<Agendamento />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  )
}
