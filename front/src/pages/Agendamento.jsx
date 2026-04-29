import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CalendarCheck, User, Scissors, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react'

export const Agendamento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [agendamento, setAgendamento] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:3001/agendamentos/byId/${id}`)
      .then(res => setAgendamento(res.data))
      .catch(() => toast.error('Erro ao buscar agendamento.'))
  }, [id])

  const getStatusColor = (status) => {
    if (status === 'concluido') return 'text-green-600'
    if (status === 'em andamento') return 'text-yellow-600'
    return 'text-blue-600'
  }

  if (!agendamento) return <div className='p-8 text-center'>Carregando...</div>

  return (
    <div className='agendamento bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-2xl mx-auto rounded-lg'>
      <div className='header flex justify-between items-center border-b border-gray-200 p-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <CalendarCheck className='text-teal-600' /> Detalhes do Agendamento
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/agendamentos')}
        >
          Voltar
        </button>
      </div>
      <div className='info p-6 space-y-6 text-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <p className='flex items-center gap-2'><strong>ID:</strong> {agendamento.id}</p>
          <p className='flex items-center gap-2'><strong>Cliente:</strong> {agendamento.Cliente?.nome || '-'}</p>
          <p className='flex items-center gap-2'><strong>Serviço:</strong> {agendamento.Servico?.nome_servico?.nome || '-'}</p>
          <p className='flex items-center gap-2'><strong>Profissional:</strong> {agendamento.Profissional?.nome || '-'}</p>
          <p className='flex items-center gap-2'><strong>Data/Hora:</strong> {agendamento.data_hora ? new Date(agendamento.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</p>
          <p className={`flex items-center gap-2 font-semibold ${getStatusColor(agendamento.status)}`}>
            <span>Status:</span>
            {agendamento.status === 'concluido' ? <CheckCircle size={16} /> : agendamento.status === 'em andamento' ? <Clock size={16} /> : <XCircle size={16} />}
            {agendamento.status?.charAt(0).toUpperCase() + agendamento.status?.slice(1) || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
