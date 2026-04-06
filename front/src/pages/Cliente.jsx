import axios from 'axios';
import { X, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
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
    <div className='cliente bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      <div className="header flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <User className='text-teal-600' /> Detalhes do Cliente
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/clientes')}
        >
          <X />
        </button>
      </div>
      <div className="info p-6 space-y-6 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="flex items-center gap-2"><strong>ID:</strong> {clienteInfo.id}</p>
          <p className="flex items-center gap-2"><strong>Nome:</strong> {clienteInfo.nome}</p>
          <p className="flex items-center gap-2">
            <Phone size={18} className="text-gray-400" />
            <strong>Telefone:</strong> {clienteInfo.telefone}
          </p>
          <p className="flex items-center gap-2">
            <Mail size={18} className="text-gray-400" />
            <strong>Email:</strong> {clienteInfo.email}
          </p>
          {clienteInfo.cpf && (
            <p className="flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              <strong>CPF:</strong> {clienteInfo.cpf}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Calendar size={18} className="text-teal-600" />
            <strong>Data de nascimento:</strong> {clienteInfo.data_nascimento}
          </p>
        </div>
        {clienteInfo.observacoes && (
          <div className="border-t pt-4">
            <p className="flex items-center gap-2">
              <FileText size={18} className="text-teal-600" />
              <strong>Observacoes:</strong> {clienteInfo.observacoes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
