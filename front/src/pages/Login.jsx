import axios from 'axios'
import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext.js'

export const Login = () => {

    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()
    const { setAuthState } = useContext(AuthContext) //var global p mudar estado

    const makeLogin = () => { //manda as credenciais para autenticacao
        const data = { login, senha }
        axios.post('http://localhost:3001/auth/login', data).then((res) => {
            if (res.data.error) return alert(res.data.error)
            console.log(res.data)
            localStorage.setItem('accessToken', res.data)
            setAuthState(true)
        })
        navigate('/')

        //user teste: Testosterono senha123
    }
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IlRlc3Rvc3Rlcm9ubyIsImlkIjoxLCJpYXQiOjE3NTgxMTg4MDV9.QuTOf9-IOJzJZ5W7WZq53c98Xs6vpNXxFoT8aN-3Ktk
    return (
        <div>
            <div className="login space-x-4">
                <label htmlFor="login">login</label>
                <input type="text" name='login' id='login' placeholder='Seu email' onChange={(e) => setLogin(e.target.value)}
                />
            </div>

            <div className="senha space-x-4">
                <label htmlFor="senha">senha</label>
                <input type="password" name='senha' id='senha' placeholder='Sua senha' onChange={(e) => setSenha(e.target.value)}
                />
            </div>

            <div className="button">
                <button className='bg-green-400 px-2 py-1 rounded cursor-pointer' onClick={makeLogin}>Entrar</button>
            </div>
        </div>
    )
}
