import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
//pagina cliente(quando clicado a partir da lista)

export const Cliente = () => { 

  let { id } = useParams(); //pega id pela url com o clique do usenavigate
  const [clienteInfo, setClienteInfo] = useState([]);
  useEffect(() => { //manda o id pra pegar o cliente
    axios.get(`http://localhost:3001/clientes/byId/${id}`).then((res) => { //
      setClienteInfo(res.data)
    })
  }, [])

  return (
    
    <div className='cliente bg-gray-300 my-4 cursor-pointer hover:bg-gray-400 transiton duration-300 mt-12 space-y-4 p-2'>
      <h2 className='text-xl mb-4 border-b pb-2 border-gray-200'>Detalhes do cliente</h2>
      <p>Id: {clienteInfo.id}</p>
      <p>Nome: {clienteInfo.nome}</p>
      <p>Telefone: {clienteInfo.telefone}</p>
      <p>Email: {clienteInfo.email}</p>
      <p>{clienteInfo.cpf && `CPF: ${clienteInfo.cpf}`}</p>
      <p>Data de nascimento: {clienteInfo.data_nascimento}</p>
      <p>{clienteInfo.observacoes && `Observações: ${clienteInfo.observacoes}`}</p>
    </div>
  )
}
