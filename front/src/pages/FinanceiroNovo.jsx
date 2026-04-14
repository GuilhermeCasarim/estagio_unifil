import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { DollarSign, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const FinanceiroNovo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = (data) => {
    const payload = {
      ...data,
      valor: Number(data.valor)
    }

    axios.post('http://localhost:3001/financeiro', payload)
      .then(() => {
        toast.success('Transação cadastrada com sucesso!')
        navigate('/financeiro')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao cadastrar transação.')
      })
  }

  const onInvalid = (formErrors) => {
    console.log('Erros de validacao do formulario:', formErrors)
    toast.error('ERRO. Revise os dados e tente novamente.')
  }

  return (
    <div className='flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='flex gap-2 text-2xl font-bold items-center'>
          <DollarSign className='text-teal-600' /> Nova Transação
        </h1>
        <button onClick={() => navigate('/financeiro')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Descricao</label>
          <input
            type='text'
            placeholder='Descricao da transação'
            {...register('descricao', { required: true })}
          />
          {errors?.descricao?.type == 'required' && <p className='text-red-500 text-sm'>Descricao obrigatoria!</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Tipo</label>
            <select className='border p-3 rounded-md' {...register('tipo', { required: true })}>
              <option value=''>Selecione</option>
              <option value='Receita'>Receita</option>
              <option value='Despesa'>Despesa</option>
            </select>
            {errors?.tipo?.type == 'required' && <p className='text-red-500 text-sm'>Tipo obrigatorio!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Valor</label>
            <input
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              {...register('valor', { required: true, min: 0 })}
            />
            {errors?.valor?.type == 'required' && <p className='text-red-500 text-sm'>Valor obrigatorio!</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Categoria</label>
            <input
              type='text'
              placeholder='Categoria'
              {...register('categoria', { required: true })}
            />
            {errors?.categoria?.type == 'required' && <p className='text-red-500 text-sm'>Categoria obrigatoria!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Forma de pagamento</label>
            <select className='border p-3 rounded-md' {...register('forma_pagamento', { required: true })}>
              <option value=''>Selecione</option>
              <option value='Dinheiro'>Dinheiro</option>
              <option value='Debito'>Debito</option>
              <option value='Credito'>Credito</option>
              <option value='Pix'>Pix</option>
            </select>
            {errors?.forma_pagamento?.type == 'required' && <p className='text-red-500 text-sm'>Forma obrigatoria!</p>}
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
            <input
              type='date'
              {...register('data_pagamento')}
            />
          </div>
        </div>

        <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
          CADASTRAR TRANSAÇÃO
        </button>
      </form>
    </div>
  )
}
