import './index.css'
import { Clientes } from './pages/Clientes'
import { Cliente } from './pages/Cliente'
import { Home } from './pages/Home'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {

  return (
    <div>
      <BrowserRouter>
        <div className='flex flex-col bg-gray-300'>
          <p className='text-teal-600'>BelezaGest</p>
          <p className='text-gray-600'>Tipo de login</p>
          <Link className='text-blue-700' to='/'>Início listar clientes</Link>
          <Link className='text-blue-700' to='/clientes'>Agenda</Link>
          <Link className='text-blue-700' to='/clientes'>Clientes cadastrar cliente</Link>
          <Link className='text-blue-700' to='/clientes'>Profissionais</Link>
          <Link className='text-blue-700' to='/clientes'>Serviços</Link>
          <Link className='text-blue-700' to='/clientes'>Estoque</Link>
          <Link className='text-blue-700' to='/clientes'>Financeiro</Link>
          <Link className='text-blue-700' to='/clientes'>Relatórios</Link>
        </div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/clientes' element={<Clientes />} />
          <Route path='/cliente/:id' element={<Cliente />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
