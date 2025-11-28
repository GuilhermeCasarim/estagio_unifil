import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import { Mail, Phone, Search, SquarePen, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
//listar clientes
//comeca a desformatar em < 1500px

export const ListaClientes = () => {
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    // const [listaClientes, setListaClientes] = useState([])
    const [listaClientesMutavel, setListaClientesMutavel] = useState([])
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1); // pagina atual inicio 1
    const [limit] = useState(12); // items por pagina
    const [totalPages, setTotalPages] = useState(0); //qnt paginas totais
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

    useEffect(() => { //solucao temporaria para nao pegar o authState no estado inicial
        const timer = setTimeout(() => {
            if (authState.status === false) {
                navigate('/login');
            } else {
                fetchClientes()
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [authState.status, navigate, currentPage, search]); 
    //funciona como filtro em tempo real

    useEffect(() => {
        if (location.state?.refetch) { //busca os dados novamente caso seja feito alguma acao em alguma rota (ex: deletar cliente na rota clientes/delete/id)
            fetchClientes();
        }
    }, [location.state]);


    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/clientes/delete/${id}`).then(() => {
            toast.success('Cliente deletado com sucesso!')
            navigate('/clientes/lista', { state: { refetch: true } })
        })
            .catch((e) => toast.error(e, 'Erro ao deletar cliente!'))
    }

    const handleEdit = (id) => {
        navigate(`/cliente/edit/${id}`)
    }

    // const onSearch = (termoBusca) => {
        // Reseta para a primeira página ao realizar uma nova busca
        // const input = search ? search.toLowerCase() : '';
        // if (!search) fetchClientes(); // Se o campo de busca estiver vazio, recarrega a lista completa
        // let arrayFiltrado = listaClientes.filter((cliente) => { //arr original
        //     if (cliente.nome.toLowerCase().includes(input.toLowerCase()) ||
        //         cliente.email.toLowerCase().includes(input.toLowerCase()) ||
        //         cliente.telefone.toLowerCase().includes(input.toLowerCase())) {
        //         return cliente
        //     }
        // })
        // setListaClientesMutavel(arrayFiltrado)
    // }

    return (
        <div className='space-y-8'>
            <div className="header border-b-2 border-gray-400 pb-2">
                <h1 className='flex gap-4'> <Users /> Clientes </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className="texto">
                    <p>Gestão de clientes</p>
                    <p>Pesquise e gerencie os clientes</p>
                </div>
                <button className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
                    onClick={() => navigate('/clientes')}
                >Novo Cliente</button>
            </div>

            <div className="totalClientes bg-blue-200 p-2 rounded space-y-4 flex justify-between">
                <div className="clientesPagina">
                    <span className='flex gap-4'><Users /> {listaClientesMutavel.length}</span>
                    <p>Total de clientes na página</p>
                </div>
                <div className="clientesTotal">
                    <span className='flex gap-4'><Users /> {totalClientes}</span>
                    <p>Total de clientes no salão</p>
                </div>
            </div>

            <div className="searchClientes bg-white p-2 space-y-4 rounded flex flex-col">
                <h1 className='flex gap-2'><Search /> Pesquisar Clientes</h1>
                <p className='text-gray-400'>Busque os clientes digitando o nome, email ou telefone</p>
                <div className="input flex flex-col gap-2 lg:flex-row items-center ">
                    <input type="text" placeholder='Pesquisar cliente...' className='px-2 py-1 rounded bg-rose-100 outline-0 w-[80%]' value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="pages w-[20%] flex flex-col items-center">
                        <p className=''>Página {currentPage} de {totalPages} </p>
                        <div className="buttons flex justify-center space-x-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1} // desabilitar na pagina 1 pra nao ir para a pagina 0 ou crashar
                                className='bg-teal-400 text-white px-3 py-1 rounded hover:bg-teal-500 disabled:bg-gray-400 transition duration-300'
                            >
                                Anterior
                            </button>
                           
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages} // desabilita se estiver na última página
                                className='bg-teal-400 text-white px-3 py-1 rounded hover:bg-teal-500 disabled:bg-gray-400 transition duration-300'
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clientesData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4">
                {listaClientesMutavel.map((cliente, key) => (
                    <div className="cliente-card  bg-white  cursor-pointer
                     hover:bg-gray-200 transiton duration-300 p-2 flex flex-col gap-8" key={key}
                        onClick={() => navigate(`/cliente/${cliente.id}`)}>

                        <div className="card-header flex justify-between items-center">
                            <div className="info1 flex flex-col gap-2">
                                <span className=''>{cliente.nome}</span>
                                <div className="others-info flex gap-1">
                                    <button className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300'>Ativo</button>
                                    <p className='flex gap-2 items-center'><Star className='text-yellow-500' size={12} /> 4.9</p>
                                </div>
                            </div>
                            <div className="buttons space-x-2 flex">
                                <button className='px-2 py-1 rounded text-gray-500 cursor-pointer'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEdit(cliente.id)
                                    }}
                                >
                                    <SquarePen />
                                </button>
                                <button className='px-2 py-1 rounded text-red-500 cursor-pointer' onClick={(e) => {
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
                        <div className="card-bottom info2 space-y-4 text-sm overflow-hidden">
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
        </div>
    )
}

//1 - o fluxo começa com o uso do navigate, que manda um id para a rota /cliente/:id que é capturado com o hook useParams
//2 - o id recebido na rota faz um getbyid e retorna o cliente que possui esse id
