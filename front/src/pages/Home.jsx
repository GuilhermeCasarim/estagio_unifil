import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export const Home = () => {

    const [listaClientes, setListaClientes] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3001/clientes').then((res) => setListaClientes(res.data))
    }, [])

    return (
        <div>
            <div className="clientesData">
                {listaClientes.map((cliente, key) => (
                    <div className="cliente bg-gray-400 my-4" key={key}>
                        <p>{cliente.nome}</p>
                        <p>{cliente.telefone}</p>
                        <p>{cliente.email}</p>
                        <p>{cliente.cpf && `${cliente.cpf}`}</p>
                        <p>{cliente.data_nascimento}</p>
                        <p>{cliente.observacoes && `${cliente.observacoes}`}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
