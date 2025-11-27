import axios from 'axios';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
//pagina cliente(quando clicado a partir da lista)

export const Cliente = () => {

  let { id } = useParams(); //pega id pela url com o clique do usenavigate
  const [clienteInfo, setClienteInfo] = useState([]);
  useEffect(() => { //manda o id pra pegar o cliente
    axios.get(`http://localhost:3001/clientes/byId/${id}`).then((res) => { //
      setClienteInfo(res.data)
    })
  }, [])
  const navigate = useNavigate()

  return (

    <div className='cliente bg-gray-50 cursor-pointer shadow-md 
    mt-12 space-y-4 hover:bg-gray-300 transition duration-300 flex flex-col'>
      <div className="header flex justify-between items-center border-b border-gray-200 p-2">
        <h2 className='text-xl mb-4'>Detalhes do cliente</h2>
        <button className='cursor-pointer  rounded-full px-2 py-1 ' onClick={() => navigate('/clientes/lista')}>
          <X />
        </button>
      </div>
      <div className="info p-2 space-y-6">
        <p>Id: {clienteInfo.id}</p>
        <p>Nome: {clienteInfo.nome}</p>
        <p>Telefone: {clienteInfo.telefone}</p>
        <p>Email: {clienteInfo.email}</p>
        <p>{clienteInfo.cpf && `CPF: ${clienteInfo.cpf}`}</p>
        <p>Data de nascimento: {clienteInfo.data_nascimento}</p>
        <p>{clienteInfo.observacoes && `Observações: ${clienteInfo.observacoes}`}</p>
      </div>
    </div>
  )
}
