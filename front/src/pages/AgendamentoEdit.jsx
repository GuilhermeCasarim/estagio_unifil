import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AgendamentoEdit = () => {
  const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors, reset } = useForm()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3001/agendamentos/byId/${id}`)
      .then(res => {
        reset(res.data)
      })
      .catch(() => toast.error('Erro ao carregar agendamento.'))
  }, [id, reset])

  const onSubmit = (data) => {
    axios.put(`http://localhost:3001/agendamentos/edit/${id}`, data)
      .then(() => {
        toast.success('Agendamento atualizado com sucesso!')
        navigate('/agendamentos')
      })
      .catch((err) => {
        toast.error('Erro ao atualizar agendamento.')
        if (err.response?.data?.error) setError('root', { message: err.response.data.error })
      })
  }

  return (
    <div className='flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='flex gap-2 text-2xl font-bold items-center'>Editar Agendamento</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-6 rounded-lg shadow-md space-y-6 max-w-xl mx-auto'>
        {/* Adicione campos conforme necessário */}
        <div>
          <label>Data e Hora</label>
          <input type='datetime-local' {...register('data_hora', { required: 'Campo obrigatório' })} className='input' />
          {errors.data_hora && <span className='text-red-500'>{errors.data_hora.message}</span>}
        </div>
        <div>
          <label>Status</label>
          <select {...register('status', { required: 'Campo obrigatório' })} className='input'>
            <option value=''>Selecione</option>
            <option value='pendente'>Pendente</option>
            <option value='em andamento'>Em andamento</option>
            <option value='concluido'>Concluído</option>
          </select>
          {errors.status && <span className='text-red-500'>{errors.status.message}</span>}
        </div>
        <button type='submit' className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600'>Salvar</button>
        <button type='button' className='ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400' onClick={() => navigate('/agendamentos')}>Cancelar</button>
      </form>
    </div>
  )
}
