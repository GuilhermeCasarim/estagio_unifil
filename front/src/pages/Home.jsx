import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

export const Home = () => { //tela inicial/listar clientes por enquanto
    const { authState } = useContext(AuthContext)
    const navigate = useNavigate();
    const [listaClientes, setListaClientes] = useState([])
    // useEffect(() => {
    //     axios.get('http://localhost:3001/clientes').then((res) => setListaClientes(res.data))
    // }, [])
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


    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/clientes/delete/${id}`).then(() => {
            fetchClientes()
        })
            .catch((e) => alert(e, 'erro ao deletar cliente'))
    }

    const handleEdit = (id) => {
        console.log(id)
    }

    return (
        <div>
            <div className="clientesData">
                {listaClientes.map((cliente, key) => (
                    <div className="cliente bg-gray-400 my-4 cursor-pointer
                     hover:bg-gray-600 transiton duration-300" key={key}
                        onClick={() => navigate(`/cliente/${cliente.id}`)}>
                        <p>{cliente.nome}</p>
                        <p>{cliente.telefone}</p>
                        <p>{cliente.email}</p>
                        {/* <p>{cliente.cpf && `${cliente.cpf}`}</p> */}
                        {/* <p>{cliente.data_nascimento}</p> */}
                        <p>{cliente.observacoes && `${cliente.observacoes}`}</p>
                        <button className='px-2 py-1 rounded bg-red-500 cursor-pointer' onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(cliente.id)
                        }
                        }>Excluir</button>
                        <button className='px-2 py-1 rounded bg-gray-500 cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(cliente.id)
                        }}
                        >Editar</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

//1 - o fluxo começa com o uso do navigate, que manda um id para a rota /cliente/:id que é capturado com o hook useParams
//2 - o id recebido na rota faz um getbyid e retorna o cliente que possui esse id
