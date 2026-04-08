import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Calendar, CreditCard, Tag, SquarePen, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaFinanceiro = () => {
  const navigate = useNavigate()
  const [transacoes, setTransacoes] = useState([])

  const entradasTotal = transacoes
    .filter((transacao) => transacao.tipo === 'Receita')
    .reduce((acc, transacao) => acc + (Number(transacao.valor) || 0), 0)

  const saidasTotal = transacoes
    .filter((transacao) => transacao.tipo === 'Despesa')
    .reduce((acc, transacao) => acc + (Number(transacao.valor) || 0), 0)

  const fetchTransacoes = () => {
    axios.get('http://localhost:3001/financeiro')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setTransacoes(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar transacoes:', error)
      })
  }

  useEffect(() => {
    fetchTransacoes()
  }, [])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Voce nao podera reverter esta acao!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`http://localhost:3001/financeiro/delete/${id}`).then(() => {
          toast.success('Transacao deletada com sucesso!')
          fetchTransacoes()
          navigate('/financeiro', { state: { refetch: true } })
        })
      }
    })
      .catch((e) => toast.error(e, 'Erro ao deletar transacao!'))
  }

  const handleEdit = (id) => {
    navigate(`/financeiro/edit/${id}`)
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4'> <DollarSign /> Financeiro </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p>Gestão financeira</p>
          <p>Registre entradas e saidas do caixa</p>
        </div>
        <button
          className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
          onClick={() => navigate('/financeiro/novo')}
        >
          Nova Transacao
        </button>
      </div>

      <div className='bg-gray-200 rounded-xl p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 rounded-lg bg-green-200/80 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-green-800'>
            <ArrowUpCircle size={18} />
            Entradas
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-green-900'>R$ {entradasTotal.toFixed(2)}</span>
        </div>
        <div className='flex items-center gap-3 rounded-lg bg-red-200/80 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-red-800'>
            <ArrowDownCircle size={18} />
            Saidas
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-red-900'>R$ {saidasTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className='financeiroData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4'>
        {transacoes.map((transacao, key) => (
          <div
            className='financeiro-card bg-white cursor-pointer hover:bg-gray-200 transition duration-300 p-2 flex flex-col gap-6'
            key={key}
            onClick={() => navigate(`/financeiro/${transacao.id}`)}
          >
            <div className='card-header flex justify-between items-center'>
              <div className='info1 flex flex-col gap-2'>
                <span className='font-bold'>{transacao.descricao}</span>
                <div className='others-info flex gap-2 items-center text-xs text-gray-500'>
                  <span className={`font-semibold ${transacao.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                    {transacao.tipo}
                  </span>
                  <span>R$ {transacao.valor}</span>
                </div>
              </div>
              <div className='buttons space-x-2 flex'>
                <button
                  className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(transacao.id)
                  }}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(transacao.id)
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className='card-bottom info2 space-y-2 text-sm overflow-hidden'>
              <p className='flex gap-2 items-center'>
                <Tag size={16} className='text-gray-400' />
                {transacao.categoria}
              </p>
              <p className='flex gap-2 items-center'>
                <CreditCard size={16} className='text-gray-400' />
                {transacao.forma_pagamento}
              </p>
              <p className='flex gap-2 items-center'>
                <Calendar size={16} className='text-gray-400' />
                {transacao.data_pagamento ? String(transacao.data_pagamento).slice(0, 10) : 'Sem data'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
