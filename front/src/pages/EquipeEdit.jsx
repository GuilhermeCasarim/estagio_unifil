import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const EquipeEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form, setForm] = useState({ login: '', senha: '', tipo_login: 'administrador' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/byId/${id}`)
            .then((res) => {
                setForm({
                    login: res.data.login || '',
                    senha: '',
                    tipo_login: res.data.tipo_login || 'administrador'
                })
            })
            .catch(() => toast.error('Erro ao carregar usuário'))
            .finally(() => setLoading(false))
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            login: form.login,
            tipo_login: form.tipo_login
        }

        if (form.senha.trim()) {
            payload.senha = form.senha
        }

        axios.patch(`http://localhost:3001/auth/update/${id}`, payload)
            .then(() => {
                toast.success('Usuário atualizado com sucesso!')
                navigate('/equipe')
            })
            .catch((error) => {
                console.error(error)
                toast.error(error.response?.data?.error || 'Erro ao atualizar usuário')
            })
    }

    return (
        <div className='flex flex-col gap-8 shadow-md p-6 bg-gray-50 max-w-4xl mx-auto mt-10 rounded-lg'>
            <div className='flex justify-between items-center border-b pb-4'>
                <div>
                    <h1 className='flex gap-2 text-2xl font-bold items-center text-gray-800'>
                        <SquarePen className='text-teal-600' /> Editar Usuário
                    </h1>
                    <p className='text-gray-500'>Atualize login, senha e tipo de acesso</p>
                </div>
                <button
                    className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
                    onClick={() => navigate('/equipe')}
                    type='button'
                >
                    <X size={24} />
                </button>
            </div>

            {loading ? (
                <p className='text-gray-500'>Carregando usuário...</p>
            ) : (
                <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Login</label>
                        <input
                            type='text'
                            className='border p-3 rounded-md outline-none border-gray-300 focus:border-teal-500'
                            value={form.login}
                            onChange={(e) => setForm((prev) => ({ ...prev, login: e.target.value }))}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Nova senha</label>
                        <input
                            type='password'
                            className='border p-3 rounded-md outline-none border-gray-300 focus:border-teal-500'
                            value={form.senha}
                            onChange={(e) => setForm((prev) => ({ ...prev, senha: e.target.value }))}
                            autoComplete='new-password'
                            placeholder='Deixe em branco para manter a senha atual'
                        />
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Tipo de usuário</label>
                        <select
                            className='border p-3 rounded-md outline-none border-gray-300 focus:border-teal-500'
                            value={form.tipo_login}
                            onChange={(e) => setForm((prev) => ({ ...prev, tipo_login: e.target.value }))}
                        >
                            <option value='administrador'>Administrador</option>
                            <option value='secretaria'>Secretária</option>
                            <option value='profissional'>Profissional</option>
                        </select>
                    </div>

                    <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'>
                        Salvar Alterações
                    </button>
                </form>
            )}
        </div>
    )
}