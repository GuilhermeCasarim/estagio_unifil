import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, Package, TrendingUp, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const RelatorioMateriais = () => {
  const navigate = useNavigate()
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [materiaisMaisUsados, setMateriaisMaisUsados] = useState([])
  const [estatisticas, setEstatisticas] = useState({ totalMateriais: 0, totalConsumido: 0, materiaisSemConsumo: 0 })

  const buscarDados = useCallback(async () => {
    try {
      setCarregando(true)

      // buscar todos os produtos cadastrados (para garantir inclusão dos não utilizados)
      const resProdutos = await axios.get('http://localhost:3001/produtos')
      const listaProdutos = Array.isArray(resProdutos.data) ? resProdutos.data : (resProdutos.data.data || [])

      // buscar agendamentos concluídos (histórico)
      const resAg = await axios.get('http://localhost:3001/agendamentos/historico?status=concluido')
      const agendamentos = Array.isArray(resAg.data) ? resAg.data : (resAg.data.data || [])

      // Para cada agendamento, buscar o serviço completo (com produtos) e agregar consumo
      const mapa = new Map()
      // Criar mapa de volume_unidade dos produtos para referência rápida
      const mapaProdutos = new Map()
      listaProdutos.forEach((p) => {
        mapaProdutos.set(p.id, { volume_unidade: p.volume_unidade, unidade_medida: p.unidade_medida })
      })

      await Promise.all(agendamentos.map(async (ag) => {
        const servicoId = ag.servico_id || ag.Servico?.id
        if (!servicoId) return
        try {
          const detalheRes = await axios.get(`http://localhost:3001/servicos/byId/${servicoId}`)
          const servicoDetalhe = detalheRes.data
          if (servicoDetalhe && Array.isArray(servicoDetalhe.Produtos)) {
            servicoDetalhe.Produtos.forEach((produto) => {
              const quantidade = Number(produto.ServicosProduto?.quantidade_gasta) || 0
              const id = produto.id
              const nome = produto.nome || 'Produto sem nome'
              const volumeInfo = mapaProdutos.get(id) || {}

              if (mapa.has(id)) {
                const existente = mapa.get(id)
                mapa.set(id, { ...existente, quantidade_total: existente.quantidade_total + quantidade })
              } else {
                mapa.set(id, { id, nome, quantidade_total: quantidade, volume_unidade: volumeInfo.volume_unidade, unidade_medida: volumeInfo.unidade_medida })
              }
            })
          }
        } catch (e) {
          // falha ao buscar detalhe do serviço: ignorar e continuar
          return
        }
      }))

      // garantir que produtos cadastrados mas não usados apareçam com quantidade 0
      listaProdutos.forEach((p) => {
        if (!mapa.has(p.id)) {
          mapa.set(p.id, { id: p.id, nome: p.nome || 'Produto sem nome', quantidade_total: 0, volume_unidade: p.volume_unidade, unidade_medida: p.unidade_medida })
        }
      })

      const listaMateriais = Array.from(mapa.values()).sort((a, b) => b.quantidade_total - a.quantidade_total)

      const totalConsumido = listaMateriais.reduce((total, item) => total + (Number(item.quantidade_total) || 0), 0)

      setMateriaisMaisUsados(listaMateriais)
      setEstatisticas({
        totalMateriais: listaMateriais.length,
        totalConsumido,
        materiaisSemConsumo: listaMateriais.filter((it) => Number(it.quantidade_total) === 0).length
      })

    } catch (erro) {
      toast.error('Erro ao carregar dados de materiais')
    } finally {
      setCarregando(false)
    }
  }, [])

  const formatQuantidadeConsumida = (quantidadeTotal, volumeUnidade) => {
    const volume = Number(volumeUnidade) || 0
    const total = Number(quantidadeTotal) || 0

    if (!volume) {
      return `${total}ml`
    }

    const unidades = total / volume
    return `${unidades.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} un (${total}ml)`
  }

  useEffect(() => {
    buscarDados()
  }, [buscarDados])


  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
        <h1 className='text-2xl font-bold'>Materiais mais usados</h1>
        <button
          onClick={() => navigate('/relatorios')}
          className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50'
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Package size={16} /> Total de materiais</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{estatisticas.totalMateriais}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><TrendingUp size={16} /> Total consumido</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{estatisticas.totalConsumido}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><AlertCircle size={16} /> Sem consumo</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{estatisticas.materiaisSemConsumo}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-600'>Consumo médio por material</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>
            {estatisticas.totalMateriais > 0 
              ? (estatisticas.totalConsumido / estatisticas.totalMateriais).toFixed(2)
              : 0}
          </p>
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h2 className='mb-6 flex items-center gap-2 text-lg font-semibold text-gray-800'>
          <Package size={20} /> Ranking de materiais
        </h2>

        {carregando ? (
          <div className='text-center text-gray-600'>Carregando dados de materiais...</div>
        ) : materiaisMaisUsados.length === 0 ? (
          <div className='text-center text-gray-600'>Nenhum material registrado.</div>
        ) : (
          <div className='space-y-2'>
            {materiaisMaisUsados.slice(0, 10).map((item, index) => (
              <div
                key={item.id}
                className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100'
              >
                <div className='flex items-center gap-4'>
                  <span className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white'>
                    {index + 1}
                  </span>
                  <span className='font-medium text-gray-800'>{item.nome}</span>
                </div>
                <div className='flex items-center gap-8'>
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-teal-600'>{formatQuantidadeConsumida(item.quantidade_total, item.volume_unidade)}</p>
                    <p className='text-xs text-gray-500'>consumido</p>
                  </div>
                  <div className='h-2 w-24 rounded-full bg-gray-200'>
                    <div
                      className='h-full rounded-full bg-teal-500'
                      style={{
                        width: `${(item.quantidade_total / Math.max(...materiaisMaisUsados.map((m) => m.quantidade_total), 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
