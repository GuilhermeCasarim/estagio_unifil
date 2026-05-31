import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Calendar, CreditCard, Tag, SquarePen, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { AuthContext } from '../helpers/AuthContext'

const getHojeInput = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

const getDataLocal = (value) => {
  if (!value) return ''

  const data = new Date(value)
  if (Number.isNaN(data.getTime())) return ''

  const offset = data.getTimezoneOffset() * 60000
  return new Date(data.getTime() - offset).toISOString().slice(0, 10)
}

export const PaginaFinanceiro = () => {
  const navigate = useNavigate()
  const { authState } = useContext(AuthContext)
  const [transacoes, setTransacoes] = useState([])
  const [abaAtiva, setAbaAtiva] = useState('todos')
  const [filtroInicio, setFiltroInicio] = useState(getHojeInput())
  const [filtroFim, setFiltroFim] = useState(getHojeInput())
  const isSecretaria = authState?.tipo_login === 'secretaria'

  useEffect(() => {
    if (filtroInicio && filtroFim && filtroFim < filtroInicio) {
      setFiltroFim(filtroInicio)
    }
  }, [filtroInicio, filtroFim])

  const tabs = [
    { key: 'todos', label: 'Todos' },
    { key: 'pago', label: 'Pago' },
    { key: 'pendente', label: 'Pendente' }
  ]

  const transacoesFiltradas = transacoes.filter((transacao) => {
    const statusNormalizado = String(transacao.status || '').toLowerCase()
    const dataTransacao = getDataLocal(transacao.data_pagamento)
    const inicio = filtroInicio || ''
    const fim = filtroFim || ''

    const correspondeStatus = abaAtiva === 'todos'
      ? true
      : abaAtiva === 'pago'
        ? statusNormalizado === 'pago'
        : statusNormalizado !== 'pago'

    const dentroDoPeriodo = (!inicio || dataTransacao >= inicio) && (!fim || dataTransacao <= fim)

    return correspondeStatus && dentroDoPeriodo
  })

  const transacoesPagas = transacoesFiltradas.filter((transacao) => String(transacao.status || '').toLowerCase() === 'pago')

  const entradasTotal = transacoesPagas
    .filter((transacao) => transacao.tipo === 'Receita')
    .reduce((acc, transacao) => acc + (Number(transacao.valor) || 0), 0)

  const saidasTotal = transacoesPagas
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

  const handleDelete = (transacao) => {
    if (transacao?.agendamento_id) {
      toast.error('Nao e permitido excluir uma transacao vinculada a agendamento.')
      return
    }

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Voce não podera reverter esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`http://localhost:3001/financeiro/delete/${transacao.id}`)
          .then(() => {
            toast.success('Transação deletada com sucesso!')
            fetchTransacoes()
            navigate('/financeiro', { state: { refetch: true } })
          })
          .catch((error) => {
            const mensagem = error.response?.data?.error || 'Erro ao deletar transação!'
            toast.error(mensagem)
          })
      }
    })
  }

  const handleEdit = (id) => {
    navigate(`/financeiro/edit/${id}`)
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-teal-200 pb-2 text-teal-600 text-2xl font-bold'>
        <h1 className='flex gap-4 items-center'> <DollarSign /> Financeiro </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p className='text-gray-700'>Gestão financeira</p>
          <p className='text-gray-500'>Registre entradas e saidas do caixa</p>
        </div>
        <button
          className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer'
          onClick={() => navigate('/financeiro/novo')}
        >
          Nova Transação
        </button>
      </div>

      <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-wrap gap-2'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type='button'
                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${abaAtiva === tab.key
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setAbaAtiva(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='flex items-end gap-3'>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700'>De</label>
              <input
                type='date'
                className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-teal-500 focus:outline-none'
                value={filtroInicio}
                onChange={(e) => setFiltroInicio(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-1'>
              <label className='text-sm font-medium text-gray-700'>Até</label>
              <input
                type='date'
                className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-teal-500 focus:outline-none'
                value={filtroFim}
                onChange={(e) => setFiltroFim(e.target.value)}
                min={filtroInicio || undefined}
              />
            </div>
          </div>
        </div>
        <p className='mt-3 text-sm text-gray-500'>
          {filtroInicio || filtroFim
            ? `Mostrando transações de ${filtroInicio ? new Date(`${filtroInicio}T12:00:00`).toLocaleDateString('pt-BR') : 'qualquer data'} até ${filtroFim ? new Date(`${filtroFim}T12:00:00`).toLocaleDateString('pt-BR') : 'qualquer data'}.`
            : 'Mostrando todas as transações. Se quiser, selecione um período.'}
        </p>
      </div>

      <div className='rounded-2xl border border-teal-100 bg-teal-50 p-4 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
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

      <div className='financeiroData rounded-2xl bg-white border border-gray-200 shadow-sm p-4'>
        {transacoesFiltradas.length === 0 ? (
          <div className='flex min-h-55 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-600'>
            <div className='space-y-2'>
              <p className='text-lg font-semibold text-gray-800'>Nenhuma transação encontrada</p>
              <p className='text-sm text-gray-500'>Quando houver entradas ou saídas registradas, elas vão aparecer aqui.</p>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4'>
            {transacoesFiltradas.map((transacao, key) => (
              (() => {
                const statusNormalizado = String(transacao.status || '').toLowerCase()
                const ehPago = statusNormalizado === 'pago'

                return (
              <div
                className='financeiro-card bg-white cursor-pointer border border-gray-200 hover:border-teal-500 hover:shadow-md transition duration-300 p-4 rounded-2xl flex flex-col gap-6'
                key={key}
                onClick={() => navigate(`/financeiro/${transacao.id}`)}
              >
                <div className='card-header flex justify-between items-center'>
                  <div className='info1 flex flex-col gap-2'>
                    <span className='font-semibold text-gray-800'>{transacao.descricao}</span>
                    <div className='others-info flex gap-2 items-center text-xs text-gray-600'>
                      <span className={`font-semibold ${transacao.tipo === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                        {transacao.tipo}
                      </span>
                      <span>R$ {transacao.valor}</span>
                    </div>
                  </div>
                  {!ehPago && (
                    <div className='buttons space-x-2 flex'>
                      <button
                        className='px-2 py-1 rounded text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-teal-600 transition'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(transacao.id)
                        }}
                      >
                        <SquarePen size={20} />
                      </button>
                      {!isSecretaria && (
                        <button
                          className='px-2 py-1 rounded text-rose-400 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(transacao)
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className='card-bottom info2 space-y-2 text-sm overflow-hidden text-gray-600'>
                  <p className='flex gap-2 items-center'>
                    <Tag size={16} className='text-teal-500' />
                    {transacao.categoria}
                  </p>
                  <p className='flex gap-2 items-center'>
                    <CreditCard size={16} className='text-teal-500' />
                    {transacao.forma_pagamento}
                  </p>
                  <p className='flex gap-2 items-center'>
                    <Calendar size={16} className='text-teal-500' />
                    {transacao.data_pagamento ? String(transacao.data_pagamento).slice(0, 10) : 'Sem data'}
                  </p>
                  <div className='pt-2 flex items-center gap-2'>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${transacao.status === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {transacao.status || 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
                )
              })()
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
