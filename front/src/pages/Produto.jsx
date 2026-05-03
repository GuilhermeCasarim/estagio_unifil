import axios from 'axios'
import { X, Package, Tag, Layers, Boxes } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export const Produto = () => {
  let { id } = useParams()
  const [produtoInfo, setProdutoInfo] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:3001/produtos/byId/${id}`).then((res) => {
      setProdutoInfo(res.data)
    }).catch((err) => {
      console.error('Erro ao buscar produto', err)
    })
  }, [id])

  return (
    <div className='produto bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      <div className='header flex justify-between items-center border-b border-gray-200 p-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <Package className='text-teal-600' /> Detalhes do Produto
        </h2>
        <button
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300'
          onClick={() => navigate('/produtos')}
        >
          <X />
        </button>
      </div>

      <div className='info p-6 space-y-6 text-gray-700'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <p className='flex items-center gap-2'><strong>ID:</strong> {produtoInfo.id}</p>
          <p className='flex items-center gap-2'><strong>Nome:</strong> {produtoInfo.nome}</p>

          <p className='flex items-center gap-2'>
            <Tag size={18} className='text-gray-400' />
            <strong>Marca:</strong> {produtoInfo.marca}
          </p>

          <p className='flex items-center gap-2'>
            <strong>Volume por unidade:</strong> {produtoInfo.volume_unidade ?? 0}
          </p>

          <p className='flex items-center gap-2'>
            <strong>Unidade de medida:</strong> {produtoInfo.unidade_medida ?? 'ml'}
          </p>

        </div>

        <div className='border-t pt-4 space-y-2'>
          <p className='flex items-center gap-2'>
            <Boxes size={18} className='text-teal-600' />
            <strong>Estoque atual:</strong> {produtoInfo.estoque_atual}
          </p>
          <p className='flex items-center gap-2'>
            <Layers size={18} className='text-teal-600' />
            <strong>Estoque minimo:</strong> {produtoInfo.estoque_minimo}
          </p>
          {produtoInfo.observacoes && (
            <p className='flex items-center gap-2'>
              <Package size={18} className='text-gray-400' />
              <strong>Observacoes:</strong> {produtoInfo.observacoes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
