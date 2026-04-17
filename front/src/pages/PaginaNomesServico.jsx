import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, SquarePen, Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaNomesServico = () => {
  const navigate = useNavigate()
  const [nomes, setNomes] = useState([])

  const totalNomes = nomes.length

  const fetchNomes = () => {
    axios.get('http://localhost:3001/nomes-servico')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setNomes(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar nomes de servico:', error)
      })
  }

  useEffect(() => {
    fetchNomes()
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
        axios.delete(`http://localhost:3001/nomes-servico/delete/${id}`).then(() => {
          toast.success('Nome de servico deletado com sucesso!')
          fetchNomes()
          navigate('/nomes-servico', { state: { refetch: true } })
        })
      }
    })
      .catch((e) => toast.error(e, 'Erro ao deletar nome de servico!'))
  }

  const handleEdit = (id) => {
    navigate(`/nome-servico/edit/${id}`)
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4'> <List /> Nomes de Servico </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p>Gestao de nomes de servico</p>
          <p>Visualize e gerencie os nomes dos servicos</p>
        </div>
        <button
          className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
          onClick={() => navigate('/nome-servico/novo')}
        >
          Novo Nome
        </button>
      </div>

      <div className='bg-gray-200 rounded-xl p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 rounded-lg bg-sky-200/70 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-sky-700'>
            <List size={18} />
            Total de nomes
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-sky-800'>{totalNomes}</span>
        </div>
      </div>

      <div className='nomesData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4'>
        {nomes.map((nome) => (
          <div
            className='nome-card bg-white cursor-pointer hover:bg-gray-200 transition duration-300 p-3 flex flex-col gap-6'
            key={nome.id}
            onClick={() => navigate(`/nome-servico/${nome.id}`)}
          >
            <div className='card-header flex justify-between items-center'>
              <div className='info1 flex flex-col gap-2'>
                <span className='font-bold'>{nome.nome}</span>
              </div>
              <div className='buttons space-x-2 flex'>
                <button
                  className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(nome.id)
                  }}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(nome.id)
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
