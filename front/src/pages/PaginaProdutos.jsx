import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Tag, Layers, SquarePen, Trash2, Boxes, AlertTriangle, AlertOctagon, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

export const PaginaProdutos = () => {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [showEntradaModal, setShowEntradaModal] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState('')

  const totalProdutos = produtos.length
  const baixoEstoque = produtos.filter((produto) => {
    const estoqueAtual = Number(produto.estoque_atual) || 0
    const estoqueMinimo = Number(produto.estoque_minimo) || 0
    return estoqueAtual > 0 && estoqueAtual < estoqueMinimo
  }).length
  const estoqueCritico = produtos.filter((produto) => {
    const estoqueAtual = Number(produto.estoque_atual) || 0
    return estoqueAtual <= 0
  }).length

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

  const handleOpenEntrada = (produto) => {
    setProdutoSelecionado(produto)
    setQuantidadeAdicionar('')
    setShowEntradaModal(true)
  }

  const handleCloseEntrada = () => {
    setShowEntradaModal(false)
    setProdutoSelecionado(null)
    setQuantidadeAdicionar('')
  }

  const volumeUnidadeSelecionado = Number(produtoSelecionado?.volume_unidade) || 0
  const quantidadeAtualEmUnidades = volumeUnidadeSelecionado
    ? (Number(produtoSelecionado?.estoque_atual) || 0) / volumeUnidadeSelecionado
    : Number(produtoSelecionado?.estoque_atual) || 0
  const quantidadeEntradaEmUnidades = Number(quantidadeAdicionar) || 0
  const novoTotalEmUnidades = quantidadeAtualEmUnidades + quantidadeEntradaEmUnidades
  const quantidadeEntradaEmEstoque = volumeUnidadeSelecionado
    ? quantidadeEntradaEmUnidades * volumeUnidadeSelecionado
    : quantidadeEntradaEmUnidades

  const handleConfirmEntrada = (e) => {
    e.preventDefault()

    if (!produtoSelecionado) return

    if (quantidadeEntradaEmUnidades <= 0) {
      toast.error('Informe uma quantidade válida para adicionar')
      return
    }

    axios.patch(`http://localhost:3001/produtos/update-estoque/${produtoSelecionado.id}`, {
      quantidade: quantidadeEntradaEmEstoque
    })
      .then(() => {
        toast.success('Entrada de estoque realizada com sucesso!')
        fetchProdutos()
        handleCloseEntrada()
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.response?.data?.error || 'Erro ao atualizar estoque')
      })
  }

  const formatQuantidadeEmUnidades = (estoqueTotal, volumeUnidade, unidadeMedida = 'ml') => {
    const volume = Number(volumeUnidade) || 0
    const total = Number(estoqueTotal) || 0

    if (!volume) {
      return `${total}${unidadeMedida}`
    }

    const unidades = total / volume
    return `${unidades.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} un (${total}${unidadeMedida})`
  }

  const getEstoqueAtualClass = (estoqueAtual, estoqueMinimo) => {
    if (estoqueAtual === 0) return 'text-red-600'
    if (estoqueAtual < estoqueMinimo) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-teal-200 pb-2 text-teal-600 text-2xl font-bold'>
        <h1 className='flex gap-4 items-center'> <Package /> Estoque </h1>
      </div>

      <div className='intro flex items-center justify-between'>
        <div className='texto'>
          <p className='text-gray-700'>Gestão de estoque</p>
          <p className='text-gray-500'>Visualize e gerencie o estoque de produtos</p>
        </div>
        <button
          className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer'
          onClick={() => navigate('/produto/novo')}
        >
          Novo Produto
        </button>
      </div>

      <div className='rounded-2xl border border-teal-100 bg-teal-50 p-4 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 rounded-lg bg-sky-200/70 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-sky-700'>
            <Boxes size={18} />
            Total de itens
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-sky-800'>{totalProdutos}</span>
        </div>
        <div className='flex items-center gap-3 rounded-lg bg-yellow-200/80 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-yellow-800'>
            <AlertTriangle size={18} />
            Estoque baixo
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-yellow-900'>{baixoEstoque}</span>
        </div>
        <div className='flex items-center gap-3 rounded-lg bg-red-300/80 px-4 py-2 text-sm'>
          <span className='flex items-center gap-2 font-semibold text-red-800'>
            <AlertOctagon size={18} />
            Critico
          </span>
          <span className='ml-auto rounded-md bg-white/70 px-2 py-0.5 text-red-900'>{estoqueCritico}</span>
        </div>
      </div>

      <div className='produtosData bg-white border border-gray-200 rounded-2xl shadow-sm p-4'>
        {produtos.length === 0 ? (
          <div className='flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500'>
            <p className='text-sm font-medium'>
              Nenhum produto cadastrado no estoque no momento.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {produtos.map((produto, key) => (
              <div
                className='produto-card bg-white cursor-pointer border border-gray-200 hover:border-teal-500 hover:shadow-md transition duration-300 p-4 rounded-2xl flex flex-col gap-8'
                key={key}
                onClick={() => navigate(`/produto/${produto.id}`)}
              >
                <div className='card-header flex justify-between items-center'>
                  <div className='info1 flex flex-col gap-2'>
                    <span className='font-semibold text-gray-800'>{produto.nome}</span>
                    <div className='others-info flex gap-1 items-center'>
                      <p className='flex gap-1 items-center text-gray-600 text-xs'>
                        <Tag size={12} /> {produto.marca}
                      </p>
                    </div>
                  </div>
                  <div className='buttons space-x-2 flex'>
                    <button
                      className='px-2 py-1 rounded text-emerald-500 cursor-pointer hover:text-emerald-700 hover:bg-teal-100 transition'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEntrada(produto)
                      }}
                      title='Adicionar estoque'
                      type='button'
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      className='px-2 py-1 rounded text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-teal-600 transition'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(produto.id)
                      }}
                    >
                      <SquarePen size={20} />
                    </button>
                    <button
                      className='px-2 py-1 rounded text-rose-400 cursor-pointer hover:bg-rose-50 hover:text-rose-600 transition'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(produto.id)
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className='card-bottom info2 space-y-3 text-sm overflow-hidden text-gray-600'>
                  <p className={`flex gap-2 items-center ${getEstoqueAtualClass(produto.estoque_atual, produto.estoque_minimo)}`}>
                    <Boxes size={16} className='text-gray-400' />
                    Estoque atual: {produto.quantidade_formatada || `${produto.estoque_atual}${produto.unidade_medida || 'ml'}`}
                  </p>
                  <p className='flex gap-2 items-center'>
                    <Layers size={16} className='text-teal-500' />
                    Estoque minimo: {formatQuantidadeEmUnidades(produto.estoque_minimo, produto.volume_unidade, produto.unidade_medida)}
                  </p>
                  {produto.observacoes && (
                    <p className='flex gap-2 items-center'>
                      <Package size={16} className='text-teal-500' />
                      {produto.observacoes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEntradaModal && produtoSelecionado && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
            <div className='mb-6 flex items-center justify-between border-b pb-4'>
              <div>
                <h2 className='text-xl font-bold text-gray-800'>Entrada de Estoque - {produtoSelecionado.nome}</h2>
                <p className='text-sm text-gray-500'>Atualize a quantidade do produto selecionado</p>
              </div>
              <button
                type='button'
                onClick={handleCloseEntrada}
                className='rounded-full p-2 text-gray-500 hover:bg-gray-100'
              >
                <Trash2 size={18} className='rotate-45' />
              </button>
            </div>

            <form onSubmit={handleConfirmEntrada} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>Nome do Produto</label>
                <input
                  type='text'
                  value={produtoSelecionado.nome || ''}
                  disabled
                  className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-700'>Quantidade Atual</label>
                  <input
                    type='text'
                    value={`${quantidadeAtualEmUnidades.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} un`}
                    disabled
                    className='w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-700'>Quantidade a Adicionar</label>
                  <input
                    type='number'
                    min='0'
                    step='1'
                    value={quantidadeAdicionar}
                    onChange={(e) => setQuantidadeAdicionar(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500'
                    placeholder='Ex: 5 un'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>Novo Total</label>
                <input
                  type='text'
                  value={`${novoTotalEmUnidades.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} un`}
                  disabled
                  className='w-full rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 font-semibold text-teal-700'
                />
              </div>

              <div className='flex justify-end gap-3 pt-2'>
                <button
                  type='button'
                  onClick={handleCloseEntrada}
                  className='rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300'
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700'
                >
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
