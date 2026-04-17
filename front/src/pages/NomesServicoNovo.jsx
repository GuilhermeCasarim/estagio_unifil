import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { List, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const NomesServicoNovo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = (data) => {
    axios.post('http://localhost:3001/nomes-servico', data)
      .then(() => {
        toast.success('Nome de servico cadastrado com sucesso!')
        navigate('/nomes-servico')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao cadastrar nome de servico.')
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
          <List className='text-teal-600' /> Novo Nome de Servico
        </h1>
        <button onClick={() => navigate('/nomes-servico')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome</label>
          <input
            type='text'
            placeholder='Nome do servico'
            {...register('nome', { required: true })}
          />
          {errors?.nome?.type == 'required' && <p className='text-red-500 text-sm'>Nome obrigatorio!</p>}
        </div>

        <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
          CADASTRAR NOME
        </button>
      </form>
    </div>
  )
}
