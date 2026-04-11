import axios from 'axios'
import { X, Scissors, Tag, Clock, Users, DollarSign, Package } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const Servico = () => {
  let { id } = useParams()
  const [servicoInfo, setServicoInfo] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/servicos/byId/${id}`).then((res) => {
      setServicoInfo(res.data)
    }).catch((err) => {
      console.error('Erro ao buscar servico', err)
    })
  }, [id])

  return (
    <div className='servico bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      <div className='header flex justify-between items-center border-b border-gray-200 p-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <Scissors className='text-teal-600' /> Detalhes do Servico
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/servicos')}
        >
          <X />
        </button>
      </div>

      <div className='info p-6 space-y-6 text-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <p className='flex items-center gap-2'><strong>ID:</strong> {servicoInfo.id}</p>
          <p className='flex items-center gap-2'><strong>Nome:</strong> {servicoInfo.nome}</p>

          <p className='flex items-center gap-2'>
            <DollarSign size={18} className='text-teal-600' />
            <strong>Preco:</strong> R$ {servicoInfo.preco}
          </p>
        </div>

        <div className='border-t pt-4 space-y-2'>
          <p className='flex items-center gap-2'>
            <Clock size={18} className='text-teal-600' />
            <strong>Duracao:</strong> {servicoInfo.duracao} min
          </p>
          <p className='flex items-center gap-2'>
            <Users size={18} className='text-teal-600' />
            <strong>Profissionais ativos:</strong> {servicoInfo.profissionais_ativos}
          </p>
        </div>

        <div className='border-t pt-4 space-y-2'>
          <p className='flex items-center gap-2'>
            <Package size={18} className='text-teal-600' />
            <strong>Produtos utilizados:</strong>
          </p>
          {Array.isArray(servicoInfo.Produtos) && servicoInfo.Produtos.length > 0 ? (
            <ul className='space-y-1 pl-6 list-disc'>
              {servicoInfo.Produtos.map((produto) => (
                <li key={produto.id}>
                  {produto.nome} (x{produto.ServicoProduto?.quant ?? 1})
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-gray-500'>Nenhum produto informado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
