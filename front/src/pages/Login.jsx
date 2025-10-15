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

    const makeLogin = () => { //manda as credenciais para autenticacao; se fizer login retorna um token
        const data = { login, senha }
        axios.post('http://localhost:3001/auth/login', data).then((res) => {
            if (res.data.error) {
                alert(res.data.error)
            }
            console.log(res.data)
            localStorage.setItem('accessToken', res.data.token) 
            //token no localStorage; o app.jsx é responsavel pelo login automatico
            setAuthState({
                login: res.data.login,
                id: res.data.id,
                status: true,
            });
        })
        navigate('/')
        //user teste: Testosterono senha123
    }
    return (
        <div className='p-2 flex flex-col items-center w-[80%] mx-auto bg-[#EAF3F2]'>
            <div className="infoLogin mb-16 flex flex-col items-center space-y-4">
                <h1 className='text-white bg-emerald-400 px-2 rounded'>BelezaGest</h1>
                <h2 className='text-emerald-400 '>Acesse sua conta</h2>
                <p className='text-emerald-400 '>Utilize suas credenciais para acessar o sistema</p>
            </div>
            <form className='inputs space-y-4 flex flex-col justify-center'>
                <div className="login space-x-4">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name='login' id='login' placeholder='Seu email' onChange={(e) => setLogin(e.target.value)}
                    className='outline-0 border-b px-2 border-b-black'
                    />
                </div>
                <div className="senha space-x-4">
                    <label htmlFor="senha">Senha:</label>
                    <input type="password" name='senha' id='senha' placeholder='Sua senha' onChange={(e) => setSenha(e.target.value)}
                    className='outline-0 border-b px-2 border-b-black'
                    />
                </div>
                <div className="button flex flex-col space-y-2">
                    <button className='bg-green-400 px-2 py-1 rounded cursor-pointer' onClick={makeLogin}>Entrar</button>
                    <p className='text-center'>Esqueceu sua senha?</p>
                </div>
            </form>
        </div>
    )
}
