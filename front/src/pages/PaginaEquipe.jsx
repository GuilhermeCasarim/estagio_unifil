import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Users, UserPlus, SquarePen, Trash2, Scissors, UserCog } from 'lucide-react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { AuthContext } from '../helpers/AuthContext'

export const PaginaEquipe = () => {
    const navigate = useNavigate()
    const [usuarios, setUsuarios] = useState([])
    const [filter, setFilter] = useState('todos')
    const { setShowAdminForm, showAdminForm } = useContext(AuthContext);
    const [form, setForm] = useState({ login: '', senha: '', tipo_usuario: 'administrador' })

    const fetchUsuarios = () => {
        axios.get('http://localhost:3001/auth/list')
            .then(res => setUsuarios(res.data.usuarios || []))
            .catch(() => toast.error('Erro ao buscar usuários'))
    }

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const handleCreateAdmin = (e) => {
        e.preventDefault()
        const payload = {
            login: form.login,
            senha: form.senha,
            tipo_login: form.tipo_usuario
        }
        axios.post('http://localhost:3001/auth', payload)
                .then(() => {
                toast.success('Usuário administrativo criado')
                setShowAdminForm(false)
                setForm({ login: '', senha: '', tipo_usuario: 'administrador' })
                fetchUsuarios()
            })
            .catch(() => toast.error('Erro ao criar usuário'))
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((res) => {
            if (res.isConfirmed) {
                axios.delete(`http://localhost:3001/auth/delete/${id}`)
                    .then(() => {
                        toast.success('Usuário deletado com sucesso!')
                        fetchUsuarios()
                    })
                    .catch(() => toast.error('Erro ao deletar usuário!'))
            }
        })
    }

    const handleEdit = (id) => {
        navigate(`/equipe/edit/${id}`)
    }

    const filtered = usuarios.filter(u => {
        if (filter === 'todos') return true
        if (filter === 'administrador') return u.tipo_login === 'administrador'
        if (filter === 'secretaria') return u.tipo_login === 'secretaria'
        if (filter === 'profissional') return u.tipo_login === 'profissional'
        return true
    })

    const getTipoLabel = (tipo) => {
        if (tipo === 'secretaria') return 'Secretária'
        if (tipo === 'administrador') return 'Administrador'
        if (tipo === 'profissional') return 'Profissional'
        return tipo
    }

    return (
        <div className='space-y-8'>
            <div className="header border-b-2 border-gray-400 pb-2">
                <h1 className='flex gap-4'> <Users /> Equipe </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className="texto">
                    <p>Gestão de usuários do sistema</p>
                    <p>Liste, filtre e cadastre membros da equipe (Administradores, Secretárias e Profissionais)</p>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 flex items-center gap-2'
                        onClick={() => navigate('/profissional/novo')}>
                        <Scissors size={16} />
                        <span>Cadastro Profissional</span>
                    </button>
                    <button className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 flex items-center gap-2'
                        onClick={() => setShowAdminForm(true)}>
                        <UserCog size={16} />
                        <span>Cadastro Administrativo</span>
                    </button>
                </div>
            </div>

            <div className='filters flex gap-2'>
                <button onClick={() => setFilter('todos')} className={`px-3 py-1 rounded ${filter==='todos' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>Todos</button>
                <button onClick={() => setFilter('administrador')} className={`px-3 py-1 rounded ${filter==='administrador' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>Administradores</button>
                <button onClick={() => setFilter('secretaria')} className={`px-3 py-1 rounded ${filter==='secretaria' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>Secretárias</button>
                <button onClick={() => setFilter('profissional')} className={`px-3 py-1 rounded ${filter==='profissional' ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>Profissionais</button>
            </div>

            <div className='table bg-white p-6 rounded'>
                <table className='w-full table-auto'>
                    <thead>
                        <tr className='text-left border-b-2 border-gray-300'>
                            <th className='pb-4 px-4'>Login</th>
                            <th className='pb-4 px-4'>Tipo</th>
                            <th className='pb-4 px-4'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u.id} className='border-t hover:bg-gray-50' >
                                <td className='py-4 px-4'>{u.login}</td>
                                <td className='py-4 px-4'>{getTipoLabel(u.tipo_login)}</td>
                                <td className='py-4 px-4'>
                                    <button
                                        className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                                        title='Editar usuário'
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(u.id)
                                        }}
                                    >
                                        <SquarePen size={20} />
                                    </button>
                                    <button
                                        className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600 ml-2'
                                        onClick={() => handleDelete(u.id)}
                                        title='Excluir usuário'
                                        type='button'
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAdminForm && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded w-full max-w-md'>
                        <h2 className='flex gap-2 items-center mb-4'><UserPlus /> Novo Usuário Administrativo</h2>
                        <form onSubmit={handleCreateAdmin} className='space-y-3'>
                            {/* Nome não é persistido em Usuarios - omitido */}
                            <div className='flex flex-col'>
                                <label>Login</label>
                                <input value={form.login} onChange={e => setForm({...form, login: e.target.value})} className='border px-2 py-1 rounded' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Senha</label>
                                <input type='password' value={form.senha}  onChange={e => setForm({...form, senha: e.target.value})} className='border px-2 py-1 rounded' required />
                            </div>
                            <div className='flex flex-col'>
                                <label>Tipo de usuário</label>
                                <select value={form.tipo_usuario} onChange={e => setForm({...form, tipo_usuario: e.target.value})} className='border px-2 py-1 rounded'>
                                    <option value='administrador'>Administrador</option>
                                    <option value='secretaria'>Secretária</option>
                                </select>
                            </div>

                            <div className='flex justify-end gap-2'>
                                <button type='button' className='px-4 py-1 bg-gray-200 rounded' onClick={() => setShowAdminForm(false)}>Cancelar</button>
                                <button type='submit' className='px-4 py-1 bg-teal-500 text-white rounded'>Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
