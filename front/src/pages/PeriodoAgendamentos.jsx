import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../helpers/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Calendar } from 'lucide-react'

export const PeriodoAgendamentos = () => {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState([])
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { authState } = useContext(AuthContext)

  const STATUS_COLORS = {
    concluido: '#16a34a',
    cancelado: '#dc2626',
    confirmado: '#0ea5e9',
    agendado: '#6b7280'
  }

  const fetchAgendamentos = async () => {
    try {
      setCarregando(true)
      const res = await axios.get('http://localhost:3001/agendamentos')
      const dados = Array.isArray(res.data) ? res.data : (res.data.data || [])
      setAgendamentos(dados)
      return dados
    } catch (err) {
      toast.error('Erro ao carregar agendamentos')
      return []
    } finally {
      setCarregando(false)
    }
  }

  const mapToEvents = (dados) => {
    return dados
      .filter((ag) => ag.data_hora)
      .map((ag) => {
        const inicio = new Date(ag.data_hora)
        const duracao = Number(ag.Servico?.duracao) || Number(ag.servico?.duracao) || 30
        const fim = new Date(inicio.getTime() + duracao * 60000)
        const statusKey = (String(ag.status || '')).toLowerCase()
        const color = STATUS_COLORS[statusKey] || STATUS_COLORS.agendado

        return {
          id: String(ag.id),
          title: `${ag.Cliente?.nome || '-'} — ${ag.Servico?.nome_servico?.nome || ag.Servico?.nome || '-'}`,
          start: inicio.toISOString(),
          end: fim.toISOString(),
          backgroundColor: color,
          borderColor: color,
          textColor: '#fff',
          extendedProps: {
            status: ag.status,
            profissional: ag.Profissional?.nome
          }
        }
      })
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const dados = await fetchAgendamentos()
      if (!mounted) return

      // se tipo_login for profissional, filtra apenas seus agendamentos
      let dadosFiltrados = dados
      if (authState?.tipo_login === 'profissional') {
        dadosFiltrados = dados.filter((ag) => {
          const usuarioProfissional = ag.Profissional?.usuario_id || ag.Profissional?.Usuario?.id
          return usuarioProfissional && Number(usuarioProfissional) === Number(authState.id)
        })
      }

      const ev = mapToEvents(dadosFiltrados)
      setEventos(ev)
    })()
    return () => { mounted = false }
  }, [authState])

  const handleEventClick = (info) => {
    navigate(`/agendamento/${info.event.id}`)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-2'>
        <div className='flex items-center gap-3'>
          <Calendar className='text-teal-600' size={28} />
          <h1 className='text-2xl font-bold'>Agenda</h1>
        </div>
        <button
          type='button'
          className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition duration-300'
          onClick={() => navigate('/agendamentos')}
        >
          Voltar para agendamentos
        </button>
      </div>

      <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
        {carregando ? (
          <div className='py-20 text-center text-gray-500'>Carregando agenda...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='timeGridDay'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth'
            }}
            buttonText={{ today: 'Hoje', day: 'Dia', week: 'Semana', month: 'Mês' }}
            locale={ptBrLocale}
            events={eventos}
            eventClick={handleEventClick}
            nowIndicator={true}
            allDaySlot={false}
            slotMinTime='08:00:00'
            slotMaxTime='18:00:00'
            height='auto'
          />
        )}
      </div>
    </div>
  )
}
