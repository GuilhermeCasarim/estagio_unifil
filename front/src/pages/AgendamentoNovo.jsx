import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CalendarPlus, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const AgendamentoNovo = () => {
  const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm()
  const navigate = useNavigate()
  const [servicos, setServicos] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [clientes, setClientes] = useState([])
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([])
  const [servicoSelecionado, setServicoSelecionado] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/servicos')
      .then(res => setServicos(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(() => toast.error('Erro ao carregar serviços.'))
    axios.get('http://localhost:3001/clientes')
      .then(res => setClientes(Array.isArray(res.data.clientes) ? res.data.clientes : []))
      .catch(() => toast.error('Erro ao carregar clientes.'))
    axios.get('http://localhost:3001/profissionais')
      .then(res => setProfissionais(Array.isArray(res.data) ? res.data : (res.data.data || [])))
      .catch(() => toast.error('Erro ao carregar profissionais.'))
  }, [])

  useEffect(() => {
    if (!servicoSelecionado) {
      setProfissionaisFiltrados([])
      setValue('profissional_id', '')
      return
    }
    const servico = servicos.find(s => String(s.id) === String(servicoSelecionado))
    if (servico && Array.isArray(servico.Profissionais)) {
      setProfissionaisFiltrados(servico.Profissionais)
    } else {
      setProfissionaisFiltrados([])
    }
    setValue('profissional_id', '')
  }, [servicoSelecionado, servicos, setValue])

  const onSubmit = (data) => {
    axios.post('http://localhost:3001/agendamentos', data)
      .then(() => {
        toast.success('Agendamento criado com sucesso!')
        navigate('/agendamentos')
      })
      .catch((err) => {
        toast.error('Erro ao criar agendamento.')
        if (err.response?.data?.error) setError('root', { message: err.response.data.error })
      })
  }

  return (
    <div className='flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='flex gap-2 text-2xl font-bold items-center'>
          <CalendarPlus className='text-teal-600' /> Novo Agendamento
        </h1>
        <button onClick={() => navigate('/agendamentos')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Cliente</label>
          <select {...register('cliente_id', { required: true })} defaultValue=''>
            <option value='' disabled>Selecione</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
            ))}
          </select>
          {errors?.cliente_id && <p className='text-red-500 text-sm'>Cliente obrigatório!</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Serviço</label>
          <select
            {...register('servico_id', { required: true, onChange: e => setServicoSelecionado(e.target.value) })}
            defaultValue=''
          >
            <option value='' disabled>Selecione</option>
            {servicos.map(servico => (
              <option key={servico.id} value={servico.id}>{servico.nome_servico?.nome || '-'}</option>
            ))}
          </select>
          {errors?.servico_id && <p className='text-red-500 text-sm'>Serviço obrigatório!</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Profissional</label>
          <select {...register('profissional_id', { required: true })} defaultValue='' disabled={!servicoSelecionado}>
            <option value='' disabled>Selecione</option>
            {profissionaisFiltrados.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.nome}</option>
            ))}
          </select>
          {errors?.profissional_id && <p className='text-red-500 text-sm'>Profissional obrigatório!</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Data e Hora</label>
          <input type='datetime-local' {...register('data_hora', { required: true })} />
          {errors?.data_hora && <p className='text-red-500 text-sm'>{errors.data_hora.message || 'Data e hora obrigatória!'}</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Status</label>
          <select {...register('status', { required: true })} defaultValue='agendado'>
            <option value='agendado'>Agendado</option>
            <option value='em andamento'>Em andamento</option>
            <option value='concluido'>Concluído</option>
          </select>
        </div>
        {errors?.root && <p className='text-red-500 text-sm'>{errors.root.message}</p>}
        <button type='submit' className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition'>Salvar Agendamento</button>
      </form>
    </div>
  )
}
