import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const RelatorioAgendamentos = () => {
  const navigate = useNavigate()
  const [profissionais, setProfissionais] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [filtrosAgendamentos, setFiltrosAgendamentos] = useState({
    inicio: '',
    fim: '',
    profissional_id: ''
  })

  const buscarProfissionais = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3001/profissionais')
      setProfissionais(res.data.profissionais || [])
    } catch (erro) {
      toast.error('Erro ao carregar profissionais')
    }
  }, [])

  const buscarAgendamentos = useCallback(async () => {
    try {
      setCarregando(true)
      const params = new URLSearchParams()
      if (filtrosAgendamentos.inicio) params.append('inicio', filtrosAgendamentos.inicio)
      if (filtrosAgendamentos.fim) params.append('fim', filtrosAgendamentos.fim)
      if (filtrosAgendamentos.profissional_id) params.append('profissional_id', filtrosAgendamentos.profissional_id)

      const res = await axios.get(`http://localhost:3001/agendamentos/historico?${params}`)
      setAgendamentos(res.data)
    } catch (erro) {
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setCarregando(false)
    }
  }, [filtrosAgendamentos])

  const getStatusInfo = useMemo(
    () => ({
      agendado: {
        label: 'Agendado',
        classe: 'text-gray-600 bg-gray-50',
        icone: Clock
      },
      confirmado: {
        label: 'Confirmado',
        classe: 'text-blue-600 bg-blue-50',
        icone: Clock
      },
      concluido: {
        label: 'Concluído',
        classe: 'text-green-600 bg-green-50',
        icone: CheckCircle
      },
      cancelado: {
        label: 'Cancelado',
        classe: 'text-red-600 bg-red-50',
        icone: XCircle
      }
    }),
    []
  )

  const relatorioAgendamentos = useMemo(() => {
    const statusCount = {
      total: agendamentos.length,
      agendado: agendamentos.filter((a) => a.status === 'agendado').length,
      confirmado: agendamentos.filter((a) => a.status === 'confirmado').length,
      cancelado: agendamentos.filter((a) => a.status === 'cancelado').length,
      concluido: agendamentos.filter((a) => a.status === 'concluido').length
    }
    return statusCount
  }, [agendamentos])

  useEffect(() => {
    buscarProfissionais()
  }, [buscarProfissionais])

  useEffect(() => {
    buscarAgendamentos()
  }, [buscarAgendamentos])

  const onChangeFiltroAgendamento = (chave, valor) => {
    setFiltrosAgendamentos((prev) => ({ ...prev, [chave]: valor }))
  }

  const limparFiltrosAgendamento = () => {
    setFiltrosAgendamentos({
      inicio: '',
      fim: '',
      profissional_id: ''
    })
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
        <h1 className='text-2xl font-bold'>Agendamentos por período e profissional</h1>
        <button
          onClick={() => navigate('/relatorios')}
          className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50'
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center gap-2'>
          <Filter size={20} className='text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-800'>Filtros</h2>
        </div>
        <div className='grid gap-4 md:grid-cols-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Data inicial</label>
            <input
              type='date'
              value={filtrosAgendamentos.inicio}
              onChange={(e) => onChangeFiltroAgendamento('inicio', e.target.value)}
              className='mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Data final</label>
            <input
              type='date'
              value={filtrosAgendamentos.fim}
              onChange={(e) => onChangeFiltroAgendamento('fim', e.target.value)}
              className='mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Profissional</label>
            <select
              value={filtrosAgendamentos.profissional_id}
              onChange={(e) => onChangeFiltroAgendamento('profissional_id', e.target.value)}
              className='mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none'
            >
              <option value=''>Todos</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>
          <div className='flex items-end'>
            <button
              onClick={limparFiltrosAgendamento}
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50'
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-600'>Total</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{relatorioAgendamentos.total}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-blue-600'>Agendado</p>
          <p className='mt-2 text-3xl font-bold text-blue-600'>{relatorioAgendamentos.agendado}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-blue-600'>Confirmado</p>
          <p className='mt-2 text-3xl font-bold text-blue-600'>{relatorioAgendamentos.confirmado}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-red-600'>Cancelado</p>
          <p className='mt-2 text-3xl font-bold text-red-600'>{relatorioAgendamentos.cancelado}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-green-600'>Concluído</p>
          <p className='mt-2 text-3xl font-bold text-green-600'>{relatorioAgendamentos.concluido}</p>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h2 className='mb-4 text-lg font-semibold text-gray-800'>Agendamentos</h2>
        {carregando ? (
          <p className='text-center text-gray-600'>Carregando...</p>
        ) : agendamentos.length === 0 ? (
          <p className='text-center text-gray-600'>Nenhum agendamento encontrado</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='border-b border-gray-200'>
                <tr>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Cliente</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Serviço</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Profissional</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Data e hora</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Status</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((agendamento) => {
                  const statusInfo = getStatusInfo[agendamento.status] || {}
                  const StatusIcon = statusInfo.icone || Clock

                  return (
                    <tr key={agendamento.id} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='px-4 py-3 text-gray-800'>{agendamento.Cliente?.nome || 'N/A'}</td>
                      <td className='px-4 py-3 text-gray-800'>
                        {agendamento.Servico?.nome_servico?.nome || 'N/A'}
                      </td>
                      <td className='px-4 py-3 text-gray-800'>{agendamento.Profissional?.nome || 'N/A'}</td>
                      <td className='px-4 py-3 text-gray-800'>
                        {new Date(agendamento.data_hora).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className='px-4 py-3'>
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.classe || ''}`}>
                          <StatusIcon size={14} />
                          {statusInfo.label || agendamento.status}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
