import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { PackagePlus, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ProdutoNovo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = (data) => {
    const payload = {
      ...data,
      estoque_minimo: Number(data.estoque_minimo),
      estoque_atual: Number(data.estoque_atual)
    }

    axios.post('http://localhost:3001/produtos', payload)
      .then(() => {
        toast.success('Produto cadastrado com sucesso!')
        navigate('/produtos')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao cadastrar produto.')
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
          <PackagePlus className='text-teal-600' /> Novo Produto
        </h1>
        <button onClick={() => navigate('/produtos')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome</label>
          <input
            type='text'
            placeholder='Nome do produto'
            {...register('nome', { required: true })}
          />
          {errors?.nome?.type == 'required' && <p className='text-red-500 text-sm'>Nome obrigatorio!</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Marca</label>
            <input
              type='text'
              placeholder='Marca do produto'
              {...register('marca', { required: true })}
            />
            {errors?.marca?.type == 'required' && <p className='text-red-500 text-sm'>Marca obrigatoria!</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Estoque minimo</label>
            <input
              type='number'
              min='0'
              placeholder='0'
              {...register('estoque_minimo', { required: true, min: 0 })}
            />
            {errors?.estoque_minimo?.type == 'required' && <p className='text-red-500 text-sm'>Estoque minimo obrigatorio!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Estoque atual</label>
            <input
              type='number'
              min='0'
              placeholder='0'
              {...register('estoque_atual', { required: true, min: 0 })}
            />
            {errors?.estoque_atual?.type == 'required' && <p className='text-red-500 text-sm'>Estoque atual obrigatorio!</p>}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Observacoes</label>
          <input
            type='text'
            placeholder='Ex: Uso profissional (opcional)'
            {...register('observacoes')}
          />
        </div>

        <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
          CADASTRAR PRODUTO
        </button>
      </form>
    </div>
  )
}
