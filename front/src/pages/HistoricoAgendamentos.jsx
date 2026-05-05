import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CalendarClock, Filter, User, UserCheck, Scissors, Clock, CheckCircle, XCircle } from 'lucide-react'

export const HistoricoAgendamentos = () => {
  const navigate = useNavigate()
  const [historico, setHistorico] = useState([])
  const [clientes, setClientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [filtros, setFiltros] = useState({
    cliente_id: '',
    profissional_id: '',
    status: '',
    inicio: '',
    fim: ''
  })

  const getStatusColor = (status) => {
    if (status === 'concluido') return 'text-green-600'
    if (status === 'em andamento') return 'text-yellow-600'
    return 'text-blue-600'
  }

  const buildParams = () => {
    const params = {}

    if (filtros.cliente_id) params.cliente_id = filtros.cliente_id
    if (filtros.profissional_id) params.profissional_id = filtros.profissional_id
    if (filtros.status) params.status = filtros.status
    if (filtros.inicio) params.inicio = `${filtros.inicio}T00:00:00`
    if (filtros.fim) params.fim = `${filtros.fim}T23:59:59`

    return params
  }

  const fetchHistorico = () => {
    axios.get('http://localhost:3001/agendamentos/historico', { params: buildParams() })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : []
        setHistorico(data)
      })
      .catch(() => toast.error('Erro ao carregar histórico de agendamentos.'))
  }

  useEffect(() => {
    fetchHistorico()

    axios.get('http://localhost:3001/clientes')
      .then((res) => {
        const data = Array.isArray(res.data?.clientes) ? res.data.clientes : []
        setClientes(data)
      })
      .catch(() => toast.error('Erro ao carregar clientes.'))

    axios.get('http://localhost:3001/profissionais')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || [])
        setProfissionais(data)
      })
      .catch(() => toast.error('Erro ao carregar profissionais.'))
  }, [])

  const onChangeFiltro = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const limparFiltros = () => {
    setFiltros({
      cliente_id: '',
      profissional_id: '',
      status: '',
      inicio: '',
      fim: ''
    })
  }

  useEffect(() => {
    fetchHistorico()
  }, [filtros])

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4 items-center text-2xl font-bold'>
          <CalendarClock /> Histórico de Agendamentos
        </h1>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-gray-600'>Consulte agendamentos finalizados/passados e aplique filtros.</p>
        <button
          className='cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100'
          onClick={() => navigate('/agendamentos')}
        >
          Voltar para agendamentos
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='mb-3 flex items-center gap-2 text-lg font-semibold'>
          <Filter size={18} /> Filtros
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Cliente</label>
            <select name='cliente_id' value={filtros.cliente_id} onChange={onChangeFiltro} className='rounded-md border border-gray-300 p-2'>
              <option value=''>Todos</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Profissional</label>
            <select name='profissional_id' value={filtros.profissional_id} onChange={onChangeFiltro} className='rounded-md border border-gray-300 p-2'>
              <option value=''>Todos</option>
              {profissionais.map((profissional) => (
                <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Status</label>
            <select name='status' value={filtros.status} onChange={onChangeFiltro} className='rounded-md border border-gray-300 p-2'>
              <option value=''>Todos</option>
              <option value='agendado'>Agendado</option>
              <option value='em andamento'>Em andamento</option>
              <option value='concluido'>Concluído</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Data inicial</label>
            <input name='inicio' type='date' value={filtros.inicio} onChange={onChangeFiltro} className='rounded-md border border-gray-300 p-2' />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Data final</label>
            <input name='fim' type='date' value={filtros.fim} onChange={onChangeFiltro} className='rounded-md border border-gray-300 p-2' />
          </div>
        </div>

        <div className='mt-4 flex justify-end'>
          <button className='cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900' onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {historico.length === 0 ? (
          <div className='col-span-full rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500'>
            Nenhum agendamento encontrado no histórico.
          </div>
        ) : (
          historico.map((ag) => {
            const cliente = ag.Cliente?.nome || '-'
            const servico = ag.Servico?.nome_servico?.nome || ag.Servico?.nome || '-'
            const profissional = ag.Profissional?.nome || '-'

            return (
              <div
                key={ag.id}
                className='cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md'
                onClick={() => navigate(`/agendamento/${ag.id}`)}
              >
                <div className='space-y-2'>
                  <p className='flex items-center gap-2 text-lg font-semibold'>
                    <User size={18} className='text-teal-600' /> {cliente}
                  </p>
                  <p className='flex items-center gap-2 text-gray-700'>
                    <Scissors size={16} className='text-indigo-600' /> {servico}
                  </p>
                  <p className='flex items-center gap-2 text-gray-700'>
                    <UserCheck size={16} className='text-amber-600' /> {profissional}
                  </p>
                  <p className='flex items-center gap-2 text-gray-700'>
                    <Clock size={16} className='text-blue-600' />
                    {ag.data_hora ? new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                  </p>

                  <p className={`flex items-center gap-2 font-semibold ${getStatusColor(ag.status)}`}>
                    {ag.status === 'concluido' ? <CheckCircle size={16} /> : ag.status === 'em andamento' ? <Clock size={16} /> : <XCircle size={16} />}
                    {ag.status?.charAt(0).toUpperCase() + ag.status?.slice(1) || '-'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
