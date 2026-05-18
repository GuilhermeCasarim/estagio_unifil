import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Clock, Mail, Phone, Calendar, Briefcase, SquarePen, Trash2 } from 'lucide-react';

export const PaginaProfissionais = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [profissionais, setProfissionais] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProfissionais, setTotalProfissionais] = useState(0);

    const getEspecialidadesLabel = (profissional) => {
        const nomes = Array.isArray(profissional.NomesServicos)
            ? profissional.NomesServicos.map((nome) => nome?.nome).filter(Boolean)
            : []
        const unicos = [...new Set(nomes)]
        if (unicos.length > 0) {
            return unicos.join(', ')
        }
        return profissional.especialidades || 'Sem especialidades'
    }

    const fetchProfissionais = () => {
        axios.get(`http://localhost:3001/profissionais?page=${currentPage}&limit=${limit}&search=${search}`)
            .then((res) => {
                setProfissionais(res.data.profissionais || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalProfissionais(res.data.totalProfissionais || 0);
            })
    }

    useEffect(() => {
        fetchProfissionais();
    }, [currentPage, search])

    useEffect(() => {
        if (location.state?.refetch) {
            fetchProfissionais();
        }
    }, [location.state])

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6', 
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((res) => {
            if (res.isConfirmed) {
                axios.delete(`http://localhost:3001/profissionais/delete/${id}`).then(() => {
                    toast.success('Profissional deletado com sucesso!')
                    fetchProfissionais();
                    navigate('/profissionais', { state: { refetch: true } })
                })
            }
        })
            .catch((e) => toast.error(e, 'Erro ao deletar profissional!'))
    }

    const handleEdit = (id) => {
        navigate(`/profissional/edit/${id}`)
    }

    return (
        <div className='space-y-8'>
            <div className="header border-b-2 border-teal-200 pb-2">
                <h1 className='flex gap-4 text-gray-800'> <Users /> Profissionais </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className="texto">
                    <p className='text-gray-700'>Gestão de profissionais</p>
                    <p className='text-gray-500'>Pesquise e gerencie informações sobre os profissionais, especialidades e seus horários</p>
                </div>
                <button className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer'
                    onClick={() => navigate('/profissional/novo')}
                >Novo Profissional</button>
            </div>

            <div className="totalProf bg-teal-50 p-4 rounded-2xl border border-teal-100 shadow-sm space-y-4 flex justify-between">
                <div className="clientesTotal">
                    <span className='flex gap-4 text-teal-600'><Users /> {totalProfissionais}</span>
                    <p className='text-gray-600'>Total de profissionais no salão</p>
                </div>
            </div>

            <div className="searchProf bg-white/80 p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4 flex flex-col backdrop-blur-sm">
                <h1 className='flex gap-2 text-teal-500'><Search /> Pesquisar Profissionais</h1>
                <p className='text-gray-500'>Busque os profissionais digitando o nome, email ou telefone</p>
                <div className="input flex flex-col gap-2 lg:flex-row items-center ">
                    <input
                        type="text"
                        placeholder='Pesquisar profissional...'
                        className='px-3 py-2 rounded-full bg-white border-b-2 border-gray-300 text-gray-600 outline-0 w-[80%] placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-colors'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                    <div className="pages w-[20%] flex flex-col items-center">
                        <p className='text-sm text-gray-600'>Página {currentPage} de {totalPages} </p>
                        <div className="buttons flex justify-center space-x-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className='rounded-full bg-teal-500 text-white px-3 py-1 hover:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300'
                            >
                                Anterior
                            </button>

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className='rounded-full bg-teal-500 text-white px-3 py-1 hover:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-500 transition duration-300'
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profissionaisData bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                {profissionais.length === 0 ? (
                    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                        <p className="text-sm font-medium">
                            {search ? 'Nenhum profissional encontrado com este filtro.' : 'Nenhum profissional cadastrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {profissionais.map((profissional, key) => (
                            <div className="profissional-card bg-white cursor-pointer border border-gray-200 hover:border-teal-500 hover:shadow-md transition duration-300 p-4 flex flex-col gap-8 rounded-2xl shadow-sm"
                                key={key}
                                onClick={() => navigate(`/profissional/${profissional.id}`)}>

                                <div className="card-header flex justify-between items-center">
                                    <div className="info1 flex flex-col gap-2">
                                        <span className='font-semibold text-gray-800'>{profissional.nome}</span>
                                        <div className="others-info flex gap-1 items-center">
                                            <button className='bg-teal-50 border border-teal-100 text-teal-700 px-3 py-0.5 rounded-full hover:bg-teal-100 transition duration-300 text-xs'>
                                                {getEspecialidadesLabel(profissional).split(',')[0]}
                                            </button>
                                            <p className='flex gap-1 items-center text-gray-600 text-xs'>
                                                <Clock size={12} /> {profissional.horario_inicio} - {profissional.horario_fim}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="buttons space-x-2 flex">
                                        <button className='px-2 py-1 rounded text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-teal-600 transition'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(profissional.id)
                                            }}
                                        >
                                            <SquarePen size={20} />
                                        </button>
                                        <button className='px-2 py-1 rounded text-rose-400 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelete(profissional.id)
                                            }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="card-bottom info2 space-y-3 text-sm overflow-hidden">
                                    <p className='flex gap-2 items-center flex-wrap text-gray-600'>
                                        <Mail size={16} className="text-gray-400" />
                                        {profissional.email}
                                    </p>
                                    <p className='flex gap-2 items-center text-gray-600'>
                                        <Phone size={16} className="text-gray-400" />
                                        {profissional.telefone}
                                    </p>
                                    <div className="bg-teal-50 p-2 rounded-lg border-l-4 border-teal-500">
                                        <p className='flex gap-2 items-center text-xs font-semibold text-teal-700 mb-1'>
                                            <Calendar size={14} /> {profissional.dias_ativos}
                                        </p>
                                        <p className='flex gap-2 items-center text-xs text-gray-600 italic'>
                                            <Briefcase size={14} /> {getEspecialidadesLabel(profissional)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
