import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, DollarSign, BadgeDollarSign, Users, Scissors, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const formatoMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

const extrairLista = (resposta) => {
  if (Array.isArray(resposta)) {
    return resposta
  }

  if (Array.isArray(resposta?.data)) {
    return resposta.data
  }

  return []
}

export const RelatorioFaturamentos = () => {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState([])
  const [financeiro, setFinanceiro] = useState([])
  const [carregando, setCarregando] = useState(false)

  const buscarDados = useCallback(async () => {
    try {
      setCarregando(true)

      const [agendamentosRes, financeiroRes] = await Promise.all([
        axios.get('http://localhost:3001/agendamentos/historico'),
        axios.get('http://localhost:3001/financeiro?status=Pago')
      ])

      setAgendamentos(extrairLista(agendamentosRes.data))
      setFinanceiro(extrairLista(financeiroRes.data))
    } catch (erro) {
      toast.error('Erro ao carregar dados de faturamento')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscarDados()
  }, [buscarDados])

  const faturamentoConsolidado = useMemo(() => {
    const agendamentosPorId = new Map(agendamentos.map((agendamento) => [agendamento.id, agendamento]))
    const receitas = financeiro.filter((item) => item.tipo === 'Receita' && item.status === 'Pago')
    const receitasVinculadas = receitas.filter((receita) => {
      const agendamentoId = Number(receita.agendamento_id)

      if (!agendamentoId) {
        return false
      }

      return agendamentosPorId.has(agendamentoId)
    })

    const totalFaturado = receitasVinculadas.reduce((total, item) => total + Number(item.valor || 0), 0)

    const agregar = (chaveFn) => {
      const mapa = new Map()

      receitasVinculadas.forEach((receita) => {
        const agendamento = agendamentosPorId.get(Number(receita.agendamento_id))
        if (!agendamento) {
          return
        }

        const chave = chaveFn(agendamento)
        if (!chave) {
          return
        }

        const valorAtual = mapa.get(chave) || 0
        mapa.set(chave, valorAtual + Number(receita.valor || 0))
      })

      return Array.from(mapa.entries())
        .map(([nome, total]) => ({ nome, total }))
        .sort((a, b) => b.total - a.total)
    }

    return {
      totalFaturado,
      receitasVinculadas,
      porServico: agregar((agendamento) => agendamento.Servico?.nome_servico?.nome || 'Serviço não informado'),
      porProfissional: agregar((agendamento) => agendamento.Profissional?.nome || 'Profissional não informado'),
      porCliente: agregar((agendamento) => agendamento.Cliente?.nome || 'Cliente não informado')
    }
  }, [agendamentos, financeiro])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
        <h1 className='text-2xl font-bold'>Faturamento por serviço, profissional e cliente</h1>
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
          <p className='flex items-center gap-2 text-sm text-gray-600'><DollarSign size={16} /> Total faturado</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{formatoMoeda.format(faturamentoConsolidado.totalFaturado)}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><BadgeDollarSign size={16} /> Receitas válidas</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{faturamentoConsolidado.receitasVinculadas.length}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Users size={16} /> Clientes com faturamento</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{faturamentoConsolidado.porCliente.length}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Scissors size={16} /> Serviços faturados</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{faturamentoConsolidado.porServico.length}</p>
        </div>
      </div>

      {carregando ? (
        <div className='rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600'>Carregando dados de faturamento...</div>
      ) : (
        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
              <Scissors size={18} /> Por serviço
            </h2>
            <div className='space-y-3'>
              {faturamentoConsolidado.porServico.length === 0 ? (
                <p className='text-sm text-gray-500'>Nenhum faturamento encontrado.</p>
              ) : (
                faturamentoConsolidado.porServico.slice(0, 5).map((item, index) => (
                  <div key={item.nome} className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700'>{index + 1}</span>
                      <span className='text-sm font-medium text-gray-800'>{item.nome}</span>
                    </div>
                    <span className='text-sm font-semibold text-gray-700'>{formatoMoeda.format(item.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
              <Users size={18} /> Por profissional
            </h2>
            <div className='space-y-3'>
              {faturamentoConsolidado.porProfissional.length === 0 ? (
                <p className='text-sm text-gray-500'>Nenhum faturamento encontrado.</p>
              ) : (
                faturamentoConsolidado.porProfissional.slice(0, 5).map((item, index) => (
                  <div key={item.nome} className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700'>{index + 1}</span>
                      <span className='text-sm font-medium text-gray-800'>{item.nome}</span>
                    </div>
                    <span className='text-sm font-semibold text-gray-700'>{formatoMoeda.format(item.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
              <CreditCard size={18} /> Por cliente
            </h2>
            <div className='space-y-3'>
              {faturamentoConsolidado.porCliente.length === 0 ? (
                <p className='text-sm text-gray-500'>Nenhum faturamento encontrado.</p>
              ) : (
                faturamentoConsolidado.porCliente.slice(0, 5).map((item, index) => (
                  <div key={item.nome} className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700'>{index + 1}</span>
                      <span className='text-sm font-medium text-gray-800'>{item.nome}</span>
                    </div>
                    <span className='text-sm font-semibold text-gray-700'>{formatoMoeda.format(item.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}