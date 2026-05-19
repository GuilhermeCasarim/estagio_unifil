import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import { Mail, Phone, Search, SquarePen, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'

export const PaginaClientes = () => {
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const [listaClientesMutavel, setListaClientesMutavel] = useState([])
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalClientes, setTotalClientes] = useState(0);

    const fetchClientes = () => {
        axios.get(`http://localhost:3001/clientes?page=${currentPage}&limit=${limit}&search=${search}`)
            .then((res) => {
                setListaClientesMutavel(res.data.clientes);
                setTotalPages(res.data.totalPages);
                setTotalClientes(res.data.totalClientes);
            })
            .catch((error) => {
                console.error("Erro ao buscar clientes:", error);
            });
    }

    useEffect(() => {
        fetchClientes()
    }, [authState.status, navigate, currentPage, search]);
    //funciona como filtro em tempo real

    useEffect(() => {
        if (location.state?.refetch) { //busca os dados novamente caso seja feito alguma acao em alguma rota (ex: deletar cliente na rota clientes/delete/id)
            fetchClientes();
        }
    }, [location.state]);


    const handleDelete = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Cor do botão de confirmar (vermelho)
            cancelButtonColor: '#3085d6', // Cor do botão de cancelar (azul)
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((res) => {
            if (res.isConfirmed) {
                axios.delete(`http://localhost:3001/clientes/delete/${id}`).then(() => {
                    toast.success('Cliente deletado com sucesso!')
                    navigate('/clientes', { state: { refetch: true } })
                })
            }
        })
            .catch((e) => toast.error(e, 'Erro ao deletar cliente!'))
    }

    const handleEdit = (id) => {
        navigate(`/cliente/edit/${id}`)
    }


    return (
        <div className='space-y-8 '>
            <div className="header border-b-2 border-teal-200 pb-2 text-teal-600 text-2xl font-bold">
                <h1 className='flex gap-4 items-center'> <Users /> Clientes </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className="texto">
                    <p className='text-gray-700'>Gestão de clientes</p>
                    <p className='text-gray-500'>Pesquise e gerencie os clientes</p>
                </div>
                <button className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer'
                    onClick={() => navigate('/cliente/novo')}
                >Novo Cliente</button>
            </div>

            <div className="totalClientes flex justify-between rounded-2xl border border-teal-100 bg-teal-50 p-4 shadow-sm space-y-4 ">
                <div className="clientesTotal">
                    <span className='flex gap-4 text-teal-500'><Users /> {totalClientes}</span>
                    <p className='text-gray-500'>Total de clientes no salão</p>
                </div>
            </div>

            <div className="searchClientes flex flex-col rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm space-y-4 backdrop-blur-sm">
                <h1 className='flex gap-2 text-teal-500'><Search /> Pesquisar Clientes</h1>
                <p className='text-gray-500'>Busque os clientes digitando o nome, email ou telefone</p>
                <div className="input flex flex-col gap-2 lg:flex-row items-center ">
                    <input type="text" placeholder='Pesquisar cliente...' className='w-[80%] rounded-full border-2 border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 outline-0 placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-colors' value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="pages w-[20%] flex flex-col items-center">
                        <p className=''>Página {totalPages === 0 ? 0 : currentPage} de {totalPages} </p>
                        <div className="buttons flex justify-center space-x-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || totalPages === 0} // desabilitar na pagina 1 pra nao ir para a pagina 0 ou crashar, ou quando nao ha clientes
                                className='rounded-full bg-gray-300 text-gray-500 px-3 py-1 transition duration-300 hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400'
                            >
                                Anterior
                            </button>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0} // desabilita se estiver na última página ou quando nao ha clientes
                                className='rounded-full bg-gray-300 text-gray-500 px-3 py-1 transition duration-300 hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-400'
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clientesData rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                {listaClientesMutavel.length === 0 ? (
                    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
                        <p className="text-sm font-medium">
                            {search ? 'Nenhum cliente encontrado com este filtro.' : 'Nenhum cliente cadastrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {listaClientesMutavel.map((cliente, key) => (
                            <div className="cliente-card cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:border-teal-500 hover:shadow-md flex flex-col gap-8" key={key}
                                onClick={() => navigate(`/cliente/${cliente.id}`)}>

                                <div className="card-header flex justify-between items-center">
                                    <div className="info1 flex flex-col gap-2">
                                        <span className='text-gray-800 font-medium'>{cliente.nome}</span>
                                        <div className="others-info flex gap-1">
                                            <button className='rounded-full border border-teal-100 bg-teal-50 px-4 py-1 text-teal-700 transition duration-300 hover:bg-teal-100'>Ativo</button>
                                            <p className='flex items-center gap-2 text-gray-600'><Star className='text-teal-400' size={12} /> 4.9</p>
                                        </div>
                                    </div>
                                    <div className="buttons space-x-2 flex">
                                        <button className='cursor-pointer rounded p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEdit(cliente.id)
                                            }}
                                        >
                                            <SquarePen />
                                        </button>
                                        <button className='cursor-pointer rounded p-1 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600' onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(cliente.id)
                                            setCurrentPage(1) //volta pra pagina 1 apos deletar
                                        }
                                        }>
                                            <Trash2 />
                                        </button>

                                    </div>
                                </div>
                                {/* <Phone /> */}
                                <div className="card-bottom info2 space-y-4 overflow-hidden text-sm text-gray-600">
                                    <p className='flex gap-2 items-center flex-wrap'><Mail size={16} />{cliente.email}</p>
                                    <p className='flex gap-2 items-center'><Phone size={16} />{cliente.telefone}</p>
                                    <p className='flex gap-2 items-center'>{cliente.observacoes && (
                                        <>
                                            <Star size={16} />
                                            {cliente.observacoes}
                                        </>
                                    )}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

//1 - o fluxo começa com o uso do navigate, que manda um id para a rota /cliente/:id que é capturado com o hook useParams
//2 - o id recebido na rota faz um getbyid e retorna o cliente que possui esse id
