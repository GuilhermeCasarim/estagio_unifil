import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Tag, Layers, SquarePen, Trash2, Boxes } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaProdutos = () => {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])

  const fetchProdutos = () => {
    axios.get('http://localhost:3001/produtos')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setProdutos(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error)
      })
  }

  useEffect(() => {
    fetchProdutos()
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
        axios.delete(`http://localhost:3001/produtos/delete/${id}`).then(() => {
          toast.success('Produto deletado com sucesso!')
          fetchProdutos()
          navigate('/produtos', { state: { refetch: true } })
        })
      }
    })
      .catch((e) => toast.error(e, 'Erro ao deletar produto!'))
  }

  const handleEdit = (id) => {
    navigate(`/produto/edit/${id}`)
  }

  const handleRemoveUnidade = (id) => {
    axios.patch(`http://localhost:3001/produtos/update-estoque/${id}`, { quantidade: -1 })
      .then(() => {
        fetchProdutos()
      })
      .catch((error) => {
        console.error('Erro ao atualizar estoque:', error)
        toast.error('Erro ao remover unidade do estoque.')
      })
  }

  const getEstoqueAtualClass = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual > estoqueMinimo) return 'text-green-600'
    if (estoqueAtual === estoqueMinimo) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4'> <Package /> Produtos </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p>Gestao de produtos</p>
          <p>Visualize e gerencie o estoque de produtos</p>
        </div>
        <button
          className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
          onClick={() => navigate('/produto/novo')}
        >
          Novo Produto
        </button>
      </div>

      <div className='produtosData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4'>
        {produtos.map((produto, key) => (
          <div
            className='produto-card bg-white cursor-pointer hover:bg-gray-200 transition duration-300 p-2 flex flex-col gap-8'
            key={key}
            onClick={() => navigate(`/produto/${produto.id}`)}
          >
            <div className='card-header flex justify-between items-center'>
              <div className='info1 flex flex-col gap-2'>
                <span className='font-bold'>{produto.nome}</span>
                <div className='others-info flex gap-1 items-center'>
                  <button className='bg-teal-400 text-white px-3 py-0.5 rounded-full hover:bg-teal-500 transition duration-300 text-xs'>
                    {produto.categoria}
                  </button>
                  <p className='flex gap-1 items-center text-gray-500 text-xs'>
                    <Tag size={12} /> {produto.marca}
                  </p>
                </div>
              </div>
              <div className='buttons space-x-2 flex'>
                <button
                  className='px-2 py-1 rounded text-gray-500 cursor-pointer hover:text-red-600 bg-red-300 transition duration-300 text-xs'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveUnidade(produto.id)
                  }}
                >
                  -1
                </button>
                <button
                  className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(produto.id)
                  }}
                >
                  <SquarePen size={20} />
                </button>
                <button
                  className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(produto.id)
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className='card-bottom info2 space-y-3 text-sm overflow-hidden'>
              <p className={`flex gap-2 items-center ${getEstoqueAtualClass(produto.estoque_atual, produto.estoque_minimo)}`}>
                <Boxes size={16} className='text-gray-400' />
                Estoque atual: {produto.estoque_atual}
              </p>
              <p className='flex gap-2 items-center'>
                <Layers size={16} className='text-gray-400' />
                Estoque minimo: {produto.estoque_minimo}
              </p>
              {produto.observacoes && (
                <p className='flex gap-2 items-center'>
                  <Package size={16} className='text-gray-400' />
                  {produto.observacoes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
