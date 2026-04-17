import axios from 'axios'
import { X, List } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const NomesServico = () => {
  let { id } = useParams()
  const [nomeInfo, setNomeInfo] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/nomes-servico/byId/${id}`).then((res) => {
      setNomeInfo(res.data)
    }).catch((err) => {
      console.error('Erro ao buscar nome de servico', err)
    })
  }, [id])

  return (
    <div className='nome-servico bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      <div className='header flex justify-between items-center border-b border-gray-200 p-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <List className='text-teal-600' /> Detalhes do Nome de Servico
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/nomes-servico')}
        >
          <X />
        </button>
      </div>

      <div className='info p-6 space-y-6 text-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <p className='flex items-center gap-2'><strong>ID:</strong> {nomeInfo.id}</p>
          <p className='flex items-center gap-2'><strong>Nome:</strong> {nomeInfo.nome}</p>
        </div>
      </div>
    </div>
  )
}
