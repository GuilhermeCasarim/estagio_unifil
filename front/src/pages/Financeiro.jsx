import axios from 'axios'
import { X, DollarSign, ArrowDownCircle, ArrowUpCircle, Tag, CreditCard, Calendar, CheckCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const Financeiro = () => {
  let { id } = useParams()
  const [transacaoInfo, setTransacaoInfo] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/financeiro/byId/${id}`).then((res) => {
      setTransacaoInfo(res.data)
    }).catch((err) => {
      console.error('Erro ao buscar transacao', err)
    })
  }, [id])

  const tipoIcon = transacaoInfo.tipo === 'Despesa' ? <ArrowDownCircle className='text-red-600' /> : <ArrowUpCircle className='text-green-600' />

  return (
    <div className='financeiro bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      <div className='header flex justify-between items-center border-b border-gray-200 p-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <DollarSign className='text-teal-600' /> Detalhes da Transacao
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/financeiro')}
        >
          <X />
        </button>
      </div>

      <div className='info p-6 space-y-6 text-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <p className='flex items-center gap-2'><strong>ID:</strong> {transacaoInfo.id}</p>
          <p className='flex items-center gap-2'><strong>Descricao:</strong> {transacaoInfo.descricao}</p>

          <p className='flex items-center gap-2'>
            {tipoIcon}
            <strong>Tipo:</strong> {transacaoInfo.tipo}
          </p>

          <p className='flex items-center gap-2'>
            <DollarSign size={18} className='text-teal-600' />
            <strong>Valor:</strong> R$ {transacaoInfo.valor}
          </p>
        </div>

        <div className='border-t pt-4 space-y-2'>
          <p className='flex items-center gap-2'>
            <Tag size={18} className='text-teal-600' />
            <strong>Categoria:</strong> {transacaoInfo.categoria}
          </p>
          <p className='flex items-center gap-2'>
            <CreditCard size={18} className='text-teal-600' />
            <strong>Forma de pagamento:</strong> {transacaoInfo.forma_pagamento}
          </p>
          <p className='flex items-center gap-2'>
            <CheckCircle size={18} className='text-teal-600' />
            <strong>Status:</strong> {transacaoInfo.status}
          </p>
          <p className='flex items-center gap-2'>
            <Calendar size={18} className='text-teal-600' />
            <strong>Data:</strong> {transacaoInfo.data_pagamento ? String(transacaoInfo.data_pagamento).slice(0, 10) : 'Sem data'}
          </p>
        </div>
      </div>
    </div>
  )
}
