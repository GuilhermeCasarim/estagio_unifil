import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { DollarSign, X } from 'lucide-react'
import { toast } from 'react-toastify'

const defaultValues = {
  descricao: '',
  tipo: 'Receita',
  valor: '',
  categoria: 'Serviços',
  forma_pagamento: '',
  status: 'Pago',
  data_pagamento: new Date().toISOString().slice(0, 10),
  agendamento_id: '',
  cliente_id: ''
}

export const FinanceiroNovo = ({
  initialValues = {},
  onSubmitFinanceiro,
  onSuccess,
  onCancel,
  title = 'Nova Transação',
  submitLabel = 'CADASTRAR TRANSAÇÃO',
  successMessage = 'Transação cadastrada com sucesso!',
  isModal = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues })

  const navigate = useNavigate()

  useEffect(() => {
    const payload = {
      ...defaultValues,
      ...initialValues,
      data_pagamento: initialValues.data_pagamento
        ? String(initialValues.data_pagamento).slice(0, 10)
        : defaultValues.data_pagamento
    }

    reset(payload)
  }, [initialValues, reset])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      valor: Number(data.valor),
      cliente_id: data.cliente_id ? Number(data.cliente_id) : undefined,
      agendamento_id: data.agendamento_id ? Number(data.agendamento_id) : undefined
    }

    try {
      if (onSubmitFinanceiro) {
        await onSubmitFinanceiro(payload)
      } else {
        await axios.post('http://localhost:3001/financeiro', payload)
      }

      toast.success(successMessage)

      if (onSuccess) {
        onSuccess(payload)
        return
      }

      navigate('/financeiro')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao cadastrar transação.')
    }
  }

  const onInvalid = (formErrors) => {
    console.log('Erros de validacao do formulario:', formErrors)
    toast.error('ERRO. Revise os dados e tente novamente.')
  }

  return (
    <div className={isModal ? 'flex flex-col gap-6' : 'flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'}>
      <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='flex gap-2 text-2xl font-bold items-center'>
          <DollarSign className='text-teal-600' /> {title}
        </h1>
        <button
          onClick={onCancel || (() => navigate('/financeiro'))}
          className='p-2 hover:bg-gray-100 rounded-full cursor-pointer'
          type='button'
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <input type='hidden' {...register('agendamento_id')} />
        <input type='hidden' {...register('cliente_id')} />

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
          {submitLabel}
        </button>
      </form>
    </div>
  )
}
