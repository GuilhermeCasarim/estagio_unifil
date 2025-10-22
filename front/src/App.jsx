import './index.css'
import { Clientes } from './pages/Clientes'
import { Cliente } from './pages/Cliente'
import { Home } from './pages/Home'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Login } from './pages/Login'
import { AuthContext } from './helpers/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ClienteEdit } from './pages/ClienteEdit'
import { Error } from './pages/Error'
import { Header } from './components/Header'
import { Container } from './components/Container'
import { ListaClientes } from './pages/ListaClientes'
import { Agendamento } from './pages/Agendamento'

function App() {
  const [authState, setAuthState] = useState({
    login: '',
    id: 0,
    status: false
  }) //state para renderizar o login com o localStorage
  useEffect(() => { //caso tenha token no localStorage, faz o login automatico
    axios.get('http://localhost:3001/auth/auth', {
      headers: {
        accessToken: localStorage.getItem('accessToken')
      },
    })
      .then((res) => { //verifica se o token existe
        if (res.data.error) {
          alert('sem login detectado/erro')
          setAuthState({ ...authState, status: false })
        } else { //caso exista um login digitado seja validado com o token
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

  const logout = () => {
    localStorage.removeItem('accessToken')
    setAuthState({ ...authState, status: false })
  }

  return (
    <div>
      {/* variavel fica "global" */}
      <AuthContext.Provider value={{ authState, setAuthState, logout }}>
        <BrowserRouter>
          <Header/>
          <Container>
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
          </Container>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

export default App
