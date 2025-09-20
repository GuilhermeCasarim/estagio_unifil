import './index.css'
import { Clientes } from './pages/Clientes'
import { Cliente } from './pages/Cliente'
import { Home } from './pages/Home'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { AuthContext } from './helpers/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ClienteEdit } from './pages/ClienteEdit'

function App() {
  // const navigate = useNavigate()
  const [authState, setAuthState] = useState({
    login: '',
    id: 0,
    status: false
  }) //state para renderizar o login com o localStorage
  useEffect(() => {
    axios.get('http://localhost:3001/auth/auth', {
      headers: {
        accessToken: localStorage.getItem('accessToken')
      },
    })
      .then((res) => {
        if (res.data.error) {
          alert('sem login detectado/erro')
          setAuthState({ ...authState, status: false })
        } else {
          setAuthState({
            login: res.data.login,
            id: res.data.id,
            status: true
          })
        }
        console.log(authState)
      })
  }, [])

  useEffect(() => {
    console.log("O authState foi atualizado:", authState);
  }, [authState]); // visualizar se os dados estão certos.

  // useEffect(() => {
  //   if (!authState.status) {
  //     navigate('/login')
  //   }
  // }, [authState.status]); 

  const logout = () => {
    localStorage.removeItem('accessToken')
    setAuthState({ ...authState, status: false })
  }

  return (
    <div>
      {/* variavel fica "global" */}
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
          <div className='flex flex-col bg-gray-300'>
            <p className='text-teal-600'>BelezaGest</p>
            <p className='text-gray-600'>Tipo de login</p>
            {authState.status == false ? ( //renderiza insta
              <Link className='text-blue-700' to='/login'>Login</Link>
            ) : (
              <div className='flex flex-col'>
                <Link onClick={logout} className='text-blue-700'>Sair</Link>
                <Link className='text-blue-700' to='/'>Início listar clientes</Link>
                <Link className='text-blue-700' to='/clientes'>Agenda</Link>
                <Link className='text-blue-700' to='/clientes'>Clientes cadastrar cliente</Link>
                <Link className='text-blue-700' to='/clientes'>Profissionais</Link>
                <Link className='text-blue-700' to='/clientes'>Serviços</Link>
                <Link className='text-blue-700' to='/clientes'>Estoque</Link>
                <Link className='text-blue-700' to='/clientes'>Financeiro</Link>
                <Link className='text-blue-700' to='/clientes'>Relatórios</Link>
                <div>
                  {authState.status && <h1>{`Nome: ${authState.login}`}</h1>}
                </div>
              </div>
            )}
          </div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/clientes' element={<Clientes />} />
            <Route path='/cliente/:id' element={<Cliente />} />
            <Route path='/login' element={<Login />} />
            <Route path='/cliente/edit/:id' element={<ClienteEdit />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

export default App
