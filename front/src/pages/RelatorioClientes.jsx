import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react'
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

export const RelatorioClientes = () => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [financeiro, setFinanceiro] = useState([])
  const [carregando, setCarregando] = useState(false)

  const buscarDados = useCallback(async () => {
    try {
      setCarregando(true)

      const [clientesRes, agendamentosRes, financeiroRes] = await Promise.all([
        axios.get('http://localhost:3001/clientes'),
        axios.get('http://localhost:3001/agendamentos/historico'),
        axios.get('http://localhost:3001/financeiro')
      ])

      // O endpoint de clientes retorna { clientes: [...] , currentPage, ... }
      const listaClientes = Array.isArray(clientesRes.data?.clientes)
        ? clientesRes.data.clientes
        : (Array.isArray(clientesRes.data) ? clientesRes.data : [])
      setClientes(listaClientes)
      setAgendamentos(extrairLista(agendamentosRes.data))
      setFinanceiro(extrairLista(financeiroRes.data))
    } catch (erro) {
      toast.error('Erro ao carregar dados de clientes')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscarDados()
  }, [buscarDados])

  const relatorioClientes = useMemo(() => {
    // Mapear clientes por ID
    const mapaClientes = new Map(clientes.map((cliente) => [cliente.id, cliente]))

    // Contar apenas agendamentos concluídos por cliente
    const agendamentosConcluidosPorCliente = new Map()
    agendamentos.forEach((agendamento) => {
      if (agendamento.status !== 'concluido') return

      const clienteId = agendamento.cliente_id || agendamento.Cliente?.id
      if (!clienteId) return

      const contador = agendamentosConcluidosPorCliente.get(clienteId) || 0
      agendamentosConcluidosPorCliente.set(clienteId, contador + 1)
    })

    // Calcular faturamento por cliente (apenas receitas pagas)
    const faturamentoPorCliente = new Map()
    const receitas = financeiro.filter((item) => item.tipo === 'Receita' && item.status === 'Pago')

    receitas.forEach((receita) => {
      // Encontrar o agendamento correspondente
      const agendamento = agendamentos.find((ag) => ag.id === receita.agendamento_id)
      if (!agendamento) return

      const clienteId = agendamento.cliente_id || agendamento.Cliente?.id
      if (!clienteId) return

      const valorAtual = faturamentoPorCliente.get(clienteId) || 0
      faturamentoPorCliente.set(clienteId, valorAtual + Number(receita.valor || 0))
    })

    // Consolidar dados dos clientes com atividade (apenas concluídos)
    const clientesComAtividade = []
    
    mapaClientes.forEach((cliente) => {
      const agendamentosCount = agendamentosConcluidosPorCliente.get(cliente.id) || 0
      const faturamento = faturamentoPorCliente.get(cliente.id) || 0

      if (agendamentosCount > 0 || faturamento > 0) {
        clientesComAtividade.push({
          ...cliente,
          agendamentos: agendamentosCount,
          faturamento,
          faturamentoMedio: agendamentosCount > 0 ? faturamento / agendamentosCount : 0
        })
      }
    })

    // Ordenar por agendamentos
    const top10PorAgendamentos = clientesComAtividade.sort((a, b) => b.agendamentos - a.agendamentos).slice(0, 10)

    // Ordenar por faturamento
    const top10PorFaturamento = [...clientesComAtividade].sort((a, b) => b.faturamento - a.faturamento).slice(0, 10)

    const totalClientes = clientes.length
    const clientesAtivos = clientesComAtividade.length
    const totalAgendamentosConcluidosPorCliente = Array.from(agendamentosConcluidosPorCliente.values()).reduce((sum, val) => sum + val, 0)
    const totalFaturado = Array.from(faturamentoPorCliente.values()).reduce((sum, val) => sum + val, 0)
    const ticketMedio = totalAgendamentosConcluidosPorCliente > 0 ? totalFaturado / totalAgendamentosConcluidosPorCliente : 0

    return {
      totalClientes,
      clientesAtivos,
      totalAgendamentosConcluidosPorCliente,
      totalFaturado,
      ticketMedio,
      top10PorAgendamentos,
      top10PorFaturamento
    }
  }, [clientes, agendamentos, financeiro])

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
        <h1 className='text-2xl font-bold'>Relatório de clientes</h1>
        <button
          onClick={() => navigate('/relatorios')}
          className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50'
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-5'>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Users size={16} /> Total de clientes</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{relatorioClientes.totalClientes}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><TrendingUp size={16} /> Clientes ativos</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{relatorioClientes.clientesAtivos}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Calendar size={16} /> Agendamentos concluídos</p>
          <p className='mt-2 text-3xl font-bold text-gray-800'>{relatorioClientes.totalAgendamentosConcluidosPorCliente}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><DollarSign size={16} /> Total faturado</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{formatoMoeda.format(relatorioClientes.totalFaturado)}</p>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <p className='text-sm text-gray-600'>Ticket médio</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{formatoMoeda.format(relatorioClientes.ticketMedio)}</p>
        </div>
      </div>

      {carregando ? (
        <div className='rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600'>Carregando dados de clientes...</div>
      ) : (
        <div className='grid gap-6 lg:grid-cols-2'>
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
              <Calendar size={18} /> Top 10 - Mais agendamentos
            </h2>
            <div className='space-y-3'>
              {relatorioClientes.top10PorAgendamentos.length === 0 ? (
                <p className='text-sm text-gray-500'>Nenhum cliente com agendamentos encontrado.</p>
              ) : (
                relatorioClientes.top10PorAgendamentos.map((cliente, index) => (
                  <div key={cliente.id} className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white'>
                        {index + 1}
                      </span>
                      <div>
                        <p className='font-medium text-gray-800'>{cliente.nome}</p>
                        <p className='text-xs text-gray-500'>{cliente.telefone || 'Sem telefone'}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-teal-600'>{cliente.agendamentos}</p>
                      <p className='text-xs text-gray-500'>agendamentos</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800'>
              <DollarSign size={18} /> Top 10 - Maior faturamento
            </h2>
            <div className='space-y-3'>
              {relatorioClientes.top10PorFaturamento.length === 0 ? (
                <p className='text-sm text-gray-500'>Nenhum faturamento encontrado.</p>
              ) : (
                relatorioClientes.top10PorFaturamento.map((cliente, index) => (
                  <div key={cliente.id} className='flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:bg-gray-100'>
                    <div className='flex items-center gap-3'>
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white'>
                        {index + 1}
                      </span>
                      <div>
                        <p className='font-medium text-gray-800'>{cliente.nome}</p>
                        <p className='text-xs text-gray-500'>{cliente.agendamentos} agendamento(s)</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-teal-600'>{formatoMoeda.format(cliente.faturamento)}</p>
                      <p className='text-xs text-gray-500'>{formatoMoeda.format(cliente.faturamentoMedio)}/ag</p>
                    </div>
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
