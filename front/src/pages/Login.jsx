import axios from 'axios'
import React from 'react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext.js'
import { Mail, LockKeyhole } from 'lucide-react';
import { toast } from 'react-toastify';

export const Login = () => {

    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()
    const { setAuthState } = useContext(AuthContext)

    const makeLogin = (e) => {
        e.preventDefault()
        const data = { login, senha }
        axios.post('http://localhost:3001/auth/login', data).then((res) => {
            if (res.data.error) {
                toast.error(res.data.error)
                console.log('erro', res.data)
            } else {
                console.log(res.data)
                localStorage.setItem('accessToken', res.data.token)
                setAuthState({
                    login: res.data.login,
                    id: res.data.id,
                    status: true,
                });
                navigate('/')
            }
        })

    }
    return (
        <div className='flex flex-col items-center  py-10 w-[70%] mx-auto'>
            <div className="infoLogin mb-8 flex flex-col items-center space-y-3">
                <div className='flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-full shadow-md'>
                    <span className='text-xl'>✨</span>
                    <h1 className='font-bold text-lg'>BelezaGest</h1>
                </div>
                <h2 className='text-3xl font-bold text-teal-700'>Acesse sua conta</h2>
                <p className='text-center text-gray-500 max-w-xs'>Entre com suas credenciais para continuar</p>
            </div>

            <div className='bg-white rounded-lg shadow-xl p-8 w-full max-w-md'>
                <form className='inputs space-y-6 flex flex-col' onSubmit={makeLogin} autoComplete='off'>
                    <div className="login flex flex-col space-y-2">
                        <label htmlFor="login" className='text-gray-700 font-medium text-sm'>Email</label>
                        <div className='flex items-center border-b-2 border-gray-300 focus-within:border-teal-500 transition-colors pb-2'>
                            <Mail className='text-gray-400 mr-3 w-5 h-5' />
                            <input
                                type="text"
                                name='login'
                                id='login'
                                placeholder='seu.email@exemplo.com'
                                autoComplete='off'
                                onChange={(e) => setLogin(e.target.value)}
                                className='outline-0 flex-1 bg-transparent text-gray-800 placeholder-gray-400'
                            />
                        </div>
                    </div>

                    <div className="senha flex flex-col space-y-2">
                        <label htmlFor="senha" className='text-gray-700 font-medium text-sm'>Senha</label>
                        <div className='flex items-center border-b-2 border-gray-300 focus-within:border-teal-500 transition-colors pb-2'>
                            <LockKeyhole className='text-gray-400 mr-3 w-5 h-5' />
                            <input
                                type="password"
                                name='senha'
                                id='senha'
                                placeholder='Sua senha'
                                autoComplete='new-password'
                                onChange={(e) => setSenha(e.target.value)}
                                className='outline-0 flex-1 bg-transparent text-gray-800 placeholder-gray-400'
                            />
                        </div>
                    </div>

                    <div className="button flex flex-col space-y-3 pt-2">
                        <button
                            type='submit'
                            className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-colors shadow-md w-full'
                        >
                            Entrar
                        </button>
                        <a onClick={() => toast.info('Envie um email para o admin.lobo@gmail.com')} href="#" className='text-center text-gray-500 hover:text-teal-500 text-sm font-medium transition-colors'>
                            Esqueceu sua senha?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
