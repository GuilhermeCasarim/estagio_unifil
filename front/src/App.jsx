import './index.css'
import axios from 'axios'
import { AuthContext } from './helpers/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from './components/MainLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [authState, setAuthState] = useState({
    login: '',
    id: 0,
    status: false,
    showAdminForm,
    setShowAdminForm
  }) //state para renderizar o login com o localStorage
  useEffect(() => { //caso tenha token no localStorage, faz o login automatico
    axios.get('http://localhost:3001/auth/auth', {
      headers: {
        accessToken: localStorage.getItem('accessToken')
      },
    })
      .then((res) => { //verifica se o token existe
        if (res.data.error) {
          setAuthState((prev) => ({ ...prev, status: false }))
          navigate('/login')
        } else { //caso exista um login digitado seja validado com o token
          setAuthState({
            login: res.data.login,
            id: res.data.id,
            status: true
          })
        }
      })
  }, [navigate])

  useEffect(() => {
    console.log("O authState foi atualizado:", authState);
  }, [authState]); // visualizar se os dados estão certos.

  const logout = () => {
    localStorage.removeItem('accessToken')
    setAuthState({
      login: '',
      id: 0,
      status: false
    })
  }

  return (
    <div className='min-h-screen'>
      <AuthContext.Provider value={{ authState, setAuthState, logout, showAdminForm, setShowAdminForm }}>
        <ToastContainer position='top-center' autoClose={3000} />
        <MainLayout />
      </AuthContext.Provider>
    </div>
  )
}

export default App
