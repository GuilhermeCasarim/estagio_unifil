import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const Cliente = () => { //pagina crud cliente

  let { id } = useParams(); //pega id pela url com o clique do usenavigate
  const [clienteInfo, setClienteInfo] = useState([]);


  useEffect(() => { //manda o id pra pegar o cliente
    axios.get(`http://localhost:3001/clientes/byId/${id}`).then((res) => { //
      setClienteInfo(res.data)
    })
  }, [])

  return (
    <div className='cliente bg-gray-400 my-4 cursor-pointer
                     hover:bg-gray-600 transiton duration-300 mt-12'>
      <p>Id: {clienteInfo.id}</p>
      <p>Nome: {clienteInfo.nome}</p>
      <p>Telefone: {clienteInfo.telefone}</p>
      <p>Email: {clienteInfo.email}</p>
      <p>{clienteInfo.cpf && `CPF: ${clienteInfo.cpf}`}</p>
      <p>Data de nascimento: {clienteInfo.data_nascimento}</p>
      <p>{clienteInfo.observacoes && `Observações: ${clienteInfo.observacoes}`}</p>
      {/* <button className='px-2 py-1 rounded bg-red-500 cursor-pointer'>Excluir</button>
      <button className='px-2 py-1 rounded bg-gray-500 cursor-pointer'>Editar</button> */}
    </div>
  )
}
