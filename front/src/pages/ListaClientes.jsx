import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import { Mail, Phone, SquarePen, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
//listar clientes

export const ListaClientes = () => {
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const [listaClientes, setListaClientes] = useState([])
    const [listaClientesMutavel, setListaClientesMutavel] = useState([])
    const [search, setSearch] = useState('')

    const fetchClientes = () => {
        axios.get('http://localhost:3001/clientes')
            .then((res) => {
                setListaClientes(res.data)
                setListaClientesMutavel(res.data)
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
    }, [authState.status, navigate]);

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

    const onSearch = (search) => {
        const input = search ? search.toLowerCase() : '';
        if (!search) fetchClientes(); // Se o campo de busca estiver vazio, recarrega a lista completa
        let arrayFiltrado = listaClientes.filter((cliente) => { //arr original
            if (cliente.nome.toLowerCase().includes(input.toLowerCase()) ||
                cliente.email.toLowerCase().includes(input.toLowerCase()) ||
                cliente.telefone.toLowerCase().includes(input.toLowerCase())) {
                return cliente
            }
        })
        setListaClientesMutavel(arrayFiltrado)
    }

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

            <div className="totalClientes bg-gray-300 rounded p-2">
                <span className='flex gap-4'><Users /> {listaClientes.length}</span>
                <p>Total de clientes</p>
            </div>

            <div className="searchClientes bg-gray-300 p-2 space-y-4">
                <h1>Pesquisar Clientes</h1>
                <p>Busque os clientes digitando o nome, email ou telefone</p>
                <div className="input flex gap-2 justify-between">
                    <input type="text" placeholder='Pesquisar cliente...' className='px-2 py-1 rounded bg-white outline-0 w-[75%]' value={search} onChange={e => setSearch(e.target.value)} />
                    <button className='bg-teal-400 mr-4 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer w-[20%] text-center' onClick={() => onSearch(search)}
                    >Pesquisar</button>
                </div>
            </div>

            <div className="clientesData flex space-x-8 flex-wrap">
                {listaClientesMutavel.map((cliente, key) => (
                    <div className="cliente-card w-2/5 bg-gray-300 my-8 cursor-pointer
                     hover:bg-gray-400 transiton duration-300 p-2 flex flex-col gap-8" key={key}
                        onClick={() => navigate(`/cliente/${cliente.id}`)}>

                        <div className="card-header flex justify-center space-x-4 items-center">
                            <div className="info1 flex flex-col justify-center gap-2">
                                <span className=''>{cliente.nome}</span>
                                <div className="others-info flex gap-1">
                                    <button className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300'>Ativo</button>
                                    <p className='flex gap-2 items-center'><Star className='text-yellow-500' size={12} /> 4.9</p>
                                </div>
                            </div>
                            <div className="buttons space-x-2">
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
                                }
                                }>
                                    <Trash2 />
                                </button>

                            </div>
                        </div>
                        {/* <Phone /> */}
                        <div className="card-bottom info2 space-y-4">
                            <p className='flex gap-2 items-center'><Mail size={16} />{cliente.email}</p>
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
