import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const Home = () => {
    const navigate = useNavigate();
    const [listaClientes, setListaClientes] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3001/clientes').then((res) => setListaClientes(res.data))
    }, [])

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
                    </div>
                ))}
            </div>
        </div>
    )
}

//1 - o fluxo começa com o uso do navigate, que manda um id para a rota /cliente/:id que é capturado com o hook useParams
//2 - o id recebido na rota faz um getbyid e retorna o cliente que possui esse id
