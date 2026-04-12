import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const CategoriasServicoEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const navigate = useNavigate()
  let { id } = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3001/categorias-servico/byId/${id}`)
      .then((res) => {
        reset(res.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar dados da categoria:', error)
        toast.error('Erro ao carregar dados.')
      })
  }, [id, reset])

  const onSubmit = (data) => {
    axios.patch(`http://localhost:3001/categorias-servico/update/${id}`, data)
      .then(() => {
        toast.success('Categoria atualizada com sucesso!')
        navigate('/categorias-servico', { state: { refetch: true } })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao atualizar categoria.')
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
            <SquarePen className='text-teal-600' /> Editar Categoria
          </h1>
          <p className='text-gray-500'>Atualize as informacoes da categoria</p>
        </div>
        <button
          className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
          onClick={() => navigate('/categorias-servico')}
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

        <div className='pt-4'>
          <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'>
            Salvar Alteracoes
          </button>
        </div>
      </form>
    </div>
  )
}
