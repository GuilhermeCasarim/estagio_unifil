import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const FinanceiroEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()
  let { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3001/financeiro/byId/${id}`)
      .then((res) => {
        const payload = { ...res.data }
        if (payload.data_pagamento) {
          payload.data_pagamento = String(payload.data_pagamento).slice(0, 10)
        }
        reset(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da transação:', error)
        toast.error('Erro ao carregar dados.')
      })
  }, [id, reset])

  const onSubmit = (data) => {
    const payload = {
      ...data,
      valor: Number(data.valor)
    }

    axios.patch(`http://localhost:3001/financeiro/update/${id}`, payload)
      .then(() => {
        toast.success('Transação atualizada com sucesso!')
        navigate('/financeiro', { state: { refetch: true } })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao atualizar transação.')
      })
  }

  const onInvalid = () => {
    toast.error('Revise os dados e tente novamente.')
  }

  return (
    <div className='form-edit flex flex-col gap-8 shadow-md p-4 bg-gray-50 max-w-4xl mx-auto mt-10 rounded-lg'>
      <div className='header flex justify-between items-center border-b pb-4'>
        <div className='text'>
          <h1 className='flex gap-2 text-2xl font-bold items-center text-gray-800'>
            <SquarePen className='text-teal-600' /> Editar Transação
          </h1>
          <p className='text-gray-500'>Atualize as informacoes financeiras</p>
        </div>
        <button
          className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
          onClick={() => navigate('/financeiro')}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Descricao</label>
          <input
            type='text'
            className={`border p-3 rounded-md outline-none ${errors.descricao ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
            {...register('descricao', { required: 'Descricao obrigatoria' })}
          />
          {errors.descricao && <p className='text-red-500 text-sm'>{errors.descricao.message}</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Tipo</label>
            <select className='border p-3 rounded-md' {...register('tipo', { required: 'Tipo obrigatorio' })}>
              <option value='Receita'>Receita</option>
              <option value='Despesa'>Despesa</option>
            </select>
            {errors.tipo && <p className='text-red-500 text-sm'>{errors.tipo.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Valor</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className={`border p-3 rounded-md outline-none ${errors.valor ? 'border-red-500' : 'border-gray-300'}`}
              {...register('valor', { required: 'Valor obrigatorio', min: 0 })}
            />
            {errors.valor && <p className='text-red-500 text-sm'>{errors.valor.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Categoria</label>
            <input
              type='text'
              className={`border p-3 rounded-md outline-none ${errors.categoria ? 'border-red-500' : 'border-gray-300'}`}
              {...register('categoria', { required: 'Categoria obrigatoria' })}
            />
            {errors.categoria && <p className='text-red-500 text-sm'>{errors.categoria.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Forma de pagamento</label>
            <input
              type='text'
              className={`border p-3 rounded-md outline-none ${errors.forma_pagamento ? 'border-red-500' : 'border-gray-300'}`}
              {...register('forma_pagamento', { required: 'Forma obrigatoria' })}
            />
            {errors.forma_pagamento && <p className='text-red-500 text-sm'>{errors.forma_pagamento.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Status</label>
            <select className='border p-3 rounded-md' {...register('status')}>
              <option value='Pago'>Pago</option>
              <option value='Pendente'>Pendente</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Data do pagamento</label>
            <input type='date' {...register('data_pagamento')} />
          </div>
        </div>

        <div className='pt-4'>
          <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'>
            Salvar Alteracoes
          </button>
        </div>
      </form>
    </div>
  )
}
