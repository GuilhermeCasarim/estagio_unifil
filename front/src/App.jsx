import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from './helpers/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { Container } from './components/Container'

import { MainLayout } from './components/MainLayout'

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
    <div className='bg-gray-300 h-screen'>
      <AuthContext.Provider value={{ authState, setAuthState, logout }}>
        <BrowserRouter>
          <Container>
            <MainLayout />
          </Container>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  )
}

export default App
