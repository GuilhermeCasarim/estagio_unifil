import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
//listar clientes

export const ListaClientes = () => {
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();
    const [listaClientes, setListaClientes] = useState([])

    const fetchClientes = () => {
        axios.get('http://localhost:3001/clientes')
            .then((res) => setListaClientes(res.data))
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
            fetchClientes()
        })
            .catch((e) => alert(e, 'erro ao deletar cliente'))
    }

    const handleEdit = (id) => {
        navigate(`/cliente/edit/${id}`)
    }

    return (
        <div>
            <div className="clientesData">
                {listaClientes.map((cliente, key) => (
                    <div className="cliente bg-gray-400 my-4 cursor-pointer
                     hover:bg-gray-600 transiton duration-300" key={key}
                        onClick={() => navigate(`/cliente/${cliente.id}`)}>
                        <div className="card-header flex flex-col">
                            <div className="card-body1 flex">
                                <span className='mr-6'>{`Nome: ${cliente.nome}`}</span>
                                <button className='px-2 py-1 rounded bg-gray-500 cursor-pointer'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEdit(cliente.id)
                                    }}
                                >Editar</button>
                                <button className='px-2 py-1 rounded bg-red-500 cursor-pointer' onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(cliente.id)
                                }
                                }>Excluir</button>
                            </div>
                            <div className="card-body2">
                                <button className='px-2 py-1'>Ativo</button>
                                <p>Estrelas</p>
                            </div>
                        </div>

                        <div className="card-info mt-4">
                            <p>{`Email: ${cliente.email}`}</p>
                            <p>{`Telefone: ${cliente.telefone}`}</p>
                            <p>{cliente.observacoes && `${cliente.observacoes}`}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

//1 - o fluxo começa com o uso do navigate, que manda um id para a rota /cliente/:id que é capturado com o hook useParams
//2 - o id recebido na rota faz um getbyid e retorna o cliente que possui esse id
