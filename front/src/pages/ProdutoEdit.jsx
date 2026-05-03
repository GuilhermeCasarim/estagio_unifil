import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ProdutoEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()
  let { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3001/produtos/byId/${id}`)
      .then((res) => {
        const p = res.data || {}
        const volume = Number(p.volume_unidade) || 0

        const formValues = {
          ...p,
          estoque_atual: volume && p.estoque_atual ? (Number(p.estoque_atual) / volume) : (p.estoque_atual || 0),
          estoque_minimo: volume && p.estoque_minimo ? (Number(p.estoque_minimo) / volume) : (p.estoque_minimo || 0),
          volume_unidade: Math.trunc(Number(p.volume_unidade) || 0),
          unidade_medida: p.unidade_medida || 'ml'
        }

        reset(formValues)
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do produto:', error)
        toast.error('Erro ao carregar dados.')
      })
  }, [id, reset])

  const onSubmit = (data) => {
    const unidadesMinimo = Number(data.estoque_minimo || 0)
    const unidadesAtual = Number(data.estoque_atual || 0)
    const volume = Number(data.volume_unidade) || 1

    const payload = {
      ...data,
      estoque_minimo: unidadesMinimo * volume,
      estoque_atual: unidadesAtual * volume,
      volume_unidade: Number(data.volume_unidade || 0),
      unidade_medida: data.unidade_medida || 'ml'
    }

    axios.patch(`http://localhost:3001/produtos/update/${id}`, payload)
      .then(() => {
        toast.success('Produto atualizado com sucesso!')
        navigate('/produtos', { state: { refetch: true } })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao atualizar produto.')
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
            <SquarePen className='text-teal-600' /> Editar Produto
          </h1>
          <p className='text-gray-500'>Atualize as informacoes do produto</p>
        </div>
        <button
          className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
          onClick={() => navigate('/produtos')}
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
            <label className='font-semibold'>Marca</label>
            <input
              type='text'
              className={`border p-3 rounded-md outline-none ${errors.marca ? 'border-red-500' : 'border-gray-300'}`}
              {...register('marca', { required: 'Marca obrigatoria' })}
            />
            {errors.marca && <p className='text-red-500 text-sm'>{errors.marca.message}</p>}
          </div>

        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Estoque minimo</label>
            <input
              type='number'
              min='0'
              className={`border p-3 rounded-md outline-none ${errors.estoque_minimo ? 'border-red-500' : 'border-gray-300'}`}
              {...register('estoque_minimo', { required: 'Estoque minimo obrigatorio', min: 0 })}
            />
            {errors.estoque_minimo && <p className='text-red-500 text-sm'>{errors.estoque_minimo.message}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Estoque atual</label>
            <input
              type='number'
              min='0'
              className={`border p-3 rounded-md outline-none ${errors.estoque_atual ? 'border-red-500' : 'border-gray-300'}`}
              {...register('estoque_atual', { required: 'Estoque atual obrigatorio', min: 0 })}
            />
            {errors.estoque_atual && <p className='text-red-500 text-sm'>{errors.estoque_atual.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Volume por unidade</label>
            <input
              type='number'
              step='1'
              min='0'
              className='border p-3 rounded-md outline-none border-gray-300'
              {...register('volume_unidade')}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Unidade de medida</label>
            <input
              type='text'
              className='border p-3 rounded-md outline-none border-gray-300'
              {...register('unidade_medida')}
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Observacoes</label>
          <input
            type='text'
            className='border p-3 rounded-md border-gray-300 outline-none focus:border-teal-500'
            {...register('observacoes')}
          />
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
