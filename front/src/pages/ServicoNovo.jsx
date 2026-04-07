import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Scissors, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ServicoNovo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = (data) => {
    const payload = {
      ...data,
      preco: Number(data.preco),
      duracao: Number(data.duracao)
    }

    axios.post('http://localhost:3001/servicos', payload)
      .then(() => {
        toast.success('Serviço cadastrado com sucesso!')
        navigate('/servicos')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao cadastrar serviço.')
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
          <Scissors className='text-teal-600' /> Novo Serviço
        </h1>
        <button onClick={() => navigate('/servicos')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome</label>
          <input
            type='text'
            placeholder='Nome do serviço (obrigatorio)'
            {...register('nome', { required: true })}
          />
          {errors?.nome?.type == 'required' && <p className='text-red-500 text-sm'>Nome obrigatorio!</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Categoria</label>
            <input
              type='text'
              placeholder='Categoria do serviço (obrigatorio)'
              {...register('categoria', { required: true })}
            />
            {errors?.categoria?.type == 'required' && <p className='text-red-500 text-sm'>Categoria obrigatoria!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Preco</label>
            <input
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              {...register('preco', { required: true, min: 0 })}
            />
            {errors?.preco?.type == 'required' && <p className='text-red-500 text-sm'>Preco obrigatorio!</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Duracao (min)</label>
            <input
              type='number'
              min='1'
              placeholder='30'
              {...register('duracao', { required: true, min: 1 })}
            />
            {errors?.duracao?.type == 'required' && <p className='text-red-500 text-sm'>Duracao obrigatoria!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Profissionais ativos</label>
            <input
              type='text'
              placeholder='Ex: Joao, Maria'
              {...register('profissionais_ativos', { required: true })}
            />
            {errors?.profissionais_ativos?.type == 'required' && <p className='text-red-500 text-sm'>Campo obrigatorio!</p>}
          </div>
        </div>

        <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
          CADASTRAR SERVIÇO
        </button>
      </form>
    </div>
  )
}
