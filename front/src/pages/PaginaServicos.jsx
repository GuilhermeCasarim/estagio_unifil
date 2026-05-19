import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, Clock, Users, SquarePen, Trash2, DollarSign, Tag } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaServicos = () => {
  const navigate = useNavigate()
  const [servicos, setServicos] = useState([])

  const totalServicos = servicos.length

  const fetchServicos = () => {
    axios.get('http://localhost:3001/servicos')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setServicos(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar servicos:', error)
      })
  }

  useEffect(() => {
    fetchServicos()
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
        axios.delete(`http://localhost:3001/servicos/delete/${id}`).then(() => {
          toast.success('Serviço deletado com sucesso!')
          fetchServicos()
          navigate('/servicos', { state: { refetch: true } })
        })
      }
    })
      .catch((e) => toast.error(e, 'Erro ao deletar serviço!'))
  }

  const handleEdit = (id) => {
    navigate(`/servico/edit/${id}`)
  }

  const getProfissionaisLabel = (servico) => {
    const nomes = Array.isArray(servico.Profissionais)
      ? servico.Profissionais.map((profissional) => profissional.nome).filter(Boolean)
      : []
    return nomes.length > 0 ? nomes.join(', ') : '-'
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-teal-200 pb-2 text-teal-600 text-2xl font-bold'>
        <h1 className='flex gap-4 items-center'> <Scissors /> Serviços </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p className='text-gray-700'>Gestão de serviços</p>
          <p className='text-gray-500'>Visualize e gerencie os serviços disponiveis</p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            className='cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-gray-700 hover:bg-gray-100 transition duration-300'
            onClick={() => navigate('/categorias-servico')}
          >
            Categorias
          </button>
            <button
              className='cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-gray-700 hover:bg-gray-100 transition duration-300'
              onClick={() => navigate('/nomes-servico')}
            >
              Nome do serviço
            </button>
          <button
            className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer'
            onClick={() => navigate('/servico/novo')}
          >
            Novo Serviço
          </button>
        </div>
      </div>

      <div className='rounded-2xl border border-teal-100 bg-teal-50 p-4 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 rounded-lg bg-white/70 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-teal-700'>
            <Scissors size={18} />
            Total de serviços
          </span>
          <span className='ml-auto rounded-md bg-teal-100 px-2 py-0.5 text-teal-700'>{totalServicos}</span>
        </div>
      </div>

      <div className='servicosData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-4'>
        {servicos.map((servico, key) => (
          <div
            className='servico-card bg-white cursor-pointer border border-gray-200 hover:border-teal-500 hover:shadow-md transition duration-300 p-4 rounded-2xl flex flex-col gap-8'
            key={key}
            onClick={() => navigate(`/servico/${servico.id}`)}
          >
            <div className='card-header flex justify-between items-center'>
              <div className='info1 flex flex-col gap-2'>
                <span className='font-semibold text-gray-800'>{servico.nome_servico?.nome || '-'}</span>
                <div className='others-info flex gap-1 items-center'>
                  <p className='flex gap-1 items-center text-gray-600 text-xs'>
                    <DollarSign size={12} /> R$ {servico.preco}
                  </p>
                  {servico.categoria?.nome && (
                    <p className='flex gap-1 items-center text-gray-600 text-xs'>
                      <Tag size={12} /> {servico.categoria.nome}
                    </p>
                  )}
                </div>
              </div>
              <div className='buttons space-x-2 flex'>
                <button
                  className='px-2 py-1 rounded text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-teal-600 transition'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(servico.id)
                  }}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className='px-2 py-1 rounded text-rose-400 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(servico.id)
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className='card-bottom info2 space-y-3 text-sm overflow-hidden text-gray-600'>
              <p className='flex gap-2 items-center'>
                <Clock size={16} className='text-gray-400' />
                Duracao: {servico.duracao} min
              </p>
              <p className='flex gap-2 items-center'>
                <Users size={16} className='text-teal-500' />
                Profissionais: {getProfissionaisLabel(servico)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
