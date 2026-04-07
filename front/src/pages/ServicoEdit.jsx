import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ServicoEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()
  let { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3001/servicos/byId/${id}`)
      .then((res) => {
        reset(res.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do servico:', error)
        toast.error('Erro ao carregar dados.')
      })
  }, [id, reset])

  const onSubmit = (data) => {
    const payload = {
      ...data,
      preco: Number(data.preco),
      duracao: Number(data.duracao)
    }

    axios.patch(`http://localhost:3001/servicos/update/${id}`, payload)
      .then(() => {
        toast.success('Servico atualizado com sucesso!')
        navigate('/servicos', { state: { refetch: true } })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao atualizar servico.')
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
            <SquarePen className='text-teal-600' /> Editar Servico
          </h1>
          <p className='text-gray-500'>Atualize as informacoes do servico</p>
        </div>
        <button
          className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
          onClick={() => navigate('/servicos')}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome</label>
          <input
            type='text'
            className={`border p-3 rounded-md outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
            {...register('nome', { required: 'Nome obrigatorio' })}
          />
          {errors.nome && <p className='text-red-500 text-sm'>{errors.nome.message}</p>}
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
            <label className='font-semibold'>Preco</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className={`border p-3 rounded-md outline-none ${errors.preco ? 'border-red-500' : 'border-gray-300'}`}
              {...register('preco', { required: 'Preco obrigatorio', min: 0 })}
            />
            {errors.preco && <p className='text-red-500 text-sm'>{errors.preco.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Duracao (min)</label>
            <input
              type='number'
              min='1'
              className={`border p-3 rounded-md outline-none ${errors.duracao ? 'border-red-500' : 'border-gray-300'}`}
              {...register('duracao', { required: 'Duracao obrigatoria', min: 1 })}
            />
            {errors.duracao && <p className='text-red-500 text-sm'>{errors.duracao.message}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Profissionais ativos</label>
            <input
              type='text'
              className={`border p-3 rounded-md outline-none ${errors.profissionais_ativos ? 'border-red-500' : 'border-gray-300'}`}
              {...register('profissionais_ativos', { required: 'Campo obrigatorio' })}
            />
            {errors.profissionais_ativos && <p className='text-red-500 text-sm'>{errors.profissionais_ativos.message}</p>}
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
