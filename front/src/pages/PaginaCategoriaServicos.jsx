import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, SquarePen, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaCategoriaServicos = () => {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])

  const totalCategorias = categorias.length

  const fetchCategorias = () => {
    axios.get('http://localhost:3001/categorias-servico')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setCategorias(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error)
      })
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Voce nao podera reverter esta acao!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed) {
        axios.delete(`http://localhost:3001/categorias-servico/delete/${id}`).then(() => {
          toast.success('Categoria deletada com sucesso!')
          fetchCategorias()
          navigate('/categorias-servico', { state: { refetch: true } })
        })
      }
    })
      .catch((e) => toast.error(e, 'Erro ao deletar categoria!'))
  }

  const handleEdit = (id) => {
    navigate(`/categoria-servico/edit/${id}`)
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4'> <Tag /> Categorias </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p>Gestão de categorias</p>
          <p>Visualize e gerencie as categorias de serviço</p>
        </div>
        <button
          className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
          onClick={() => navigate('/categoria-servico/novo')}
        >
          Nova Categoria
        </button>
      </div>

      <div className='bg-gray-200 rounded-xl p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 rounded-lg bg-sky-200/70 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-sky-700'>
            <Tag size={18} />
            Total de categorias
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-sky-800'>{totalCategorias}</span>
        </div>
      </div>

      <div className='categoriasData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4'>
        {categorias.map((categoria) => (
          <div
            className='categoria-card bg-white cursor-pointer hover:bg-gray-200 transition duration-300 p-3 flex flex-col gap-6'
            key={categoria.id}
            onClick={() => navigate(`/categoria-servico/${categoria.id}`)}
          >
            <div className='card-header flex justify-between items-center'>
              <div className='info1 flex flex-col gap-2'>
                <span className='font-bold'>{categoria.nome}</span>
              </div>
              <div className='buttons space-x-2 flex'>
                <button
                  className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(categoria.id)
                  }}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(categoria.id)
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
