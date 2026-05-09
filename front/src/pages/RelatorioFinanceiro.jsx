import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, Calendar, DollarSign, Filter, User, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
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

const obterChaveData = (valor) => {
  if (!valor) {
    return ''
  }

  return String(valor).slice(0, 10)
}

const obterDataLocal = () => {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

const obterInicioSemana = () => {
  const agora = new Date()
  const diaSemana = agora.getDay()
  const deslocamento = diaSemana === 0 ? 6 : diaSemana - 1
  agora.setDate(agora.getDate() - deslocamento)

  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

const obterInicioMes = () => {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')

  return `${ano}-${mes}-01`
}

export const RelatorioFinanceiro = () => {
  const navigate = useNavigate()
  const [financeiro, setFinanceiro] = useState([])
  const [historico, setHistorico] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [filtros, setFiltros] = useState({
    inicio: '',
    fim: ''
  })

  const buscarResumo = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3001/financeiro')
      setFinanceiro(extrairLista(res.data))
    } catch (erro) {
      toast.error('Erro ao carregar resumo financeiro')
    }
  }, [])

  const buscarHistorico = useCallback(async (filtrosAtuais) => {
    try {
      setCarregando(true)

      const params = new URLSearchParams()
      if (filtrosAtuais?.inicio) params.append('inicio', `${filtrosAtuais.inicio}T00:00:00`)
      if (filtrosAtuais?.fim) params.append('fim', `${filtrosAtuais.fim}T23:59:59`)

      const url = params.toString()
        ? `http://localhost:3001/financeiro/historico?${params.toString()}`
        : 'http://localhost:3001/financeiro/historico'

      const res = await axios.get(url)
      setHistorico(extrairLista(res.data))
    } catch (erro) {
      toast.error('Erro ao carregar histórico financeiro')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscarResumo()
    buscarHistorico({ inicio: '', fim: '' })
  }, [buscarResumo, buscarHistorico])

  const resumoSaldo = useMemo(() => {
    const hoje = obterDataLocal()
    const inicioSemana = obterInicioSemana()
    const inicioMes = obterInicioMes()

    const calcularSaldo = (inicio, fim) => {
      return financeiro
        .filter((item) => {
          const chave = obterChaveData(item.data_pagamento)
          if (!chave) return false

          if (inicio && chave < inicio) return false
          if (fim && chave > fim) return false
          return true
        })
        .reduce((acc, item) => {
          const valor = Number(item.valor || 0)
          return item.tipo === 'Receita' ? acc + valor : acc - valor
        }, 0)
    }

    return {
      diario: calcularSaldo(hoje, hoje),
      semanal: calcularSaldo(inicioSemana, hoje),
      mensal: calcularSaldo(inicioMes, hoje)
    }
  }, [financeiro])

  const totais = useMemo(() => {
    return historico.reduce((acc, item) => {
      const valor = Number(item.valor || 0)
      if (item.tipo === 'Receita') {
        acc.receitas += valor
      } else {
        acc.despesas += valor
      }
      return acc
    }, { receitas: 0, despesas: 0 })
  }, [historico])

  const onChangeFiltro = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({ ...prev, [name]: value }))
  }

  const aplicarFiltros = (e) => {
    e.preventDefault()
    buscarHistorico(filtros)
  }

  const limparFiltros = () => {
    const filtrosLimpos = { inicio: '', fim: '' }
    setFiltros(filtrosLimpos)
    buscarHistorico(filtrosLimpos)
  }

  const formatarResponsavel = (item) => {
    return item.Responsavel?.login || item.Responsavel?.tipo_login || (item.usuario_id ? `Usuário ${item.usuario_id}` : 'Não informado')
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
        <h1 className='text-2xl font-bold'>Relatório financeiro</h1>
        <button
          onClick={() => navigate('/relatorios')}
          className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50'
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><DollarSign size={16} /> Saldo diário</p>
          <p className={`mt-2 text-3xl font-bold ${resumoSaldo.diario >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatoMoeda.format(resumoSaldo.diario)}
          </p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Calendar size={16} /> Saldo semanal</p>
          <p className={`mt-2 text-3xl font-bold ${resumoSaldo.semanal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatoMoeda.format(resumoSaldo.semanal)}
          </p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><Calendar size={16} /> Saldo mensal</p>
          <p className={`mt-2 text-3xl font-bold ${resumoSaldo.mensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatoMoeda.format(resumoSaldo.mensal)}
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><ArrowUpCircle size={16} className='text-green-600' /> Receitas no histórico</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{formatoMoeda.format(totais.receitas)}</p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><ArrowDownCircle size={16} className='text-red-600' /> Despesas no histórico</p>
          <p className='mt-2 text-2xl font-bold text-gray-800'>{formatoMoeda.format(totais.despesas)}</p>
        </div>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <p className='flex items-center gap-2 text-sm text-gray-600'><DollarSign size={16} /> Saldo do período</p>
          <p className={`mt-2 text-2xl font-bold ${(totais.receitas - totais.despesas) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatoMoeda.format(totais.receitas - totais.despesas)}
          </p>
        </div>
      </div>

      <form onSubmit={aplicarFiltros} className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center gap-2'>
          <Filter size={18} className='text-gray-600' />
          <h2 className='text-lg font-semibold text-gray-800'>Filtro por data</h2>
        </div>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Data inicial</label>
            <input
              type='date'
              name='inicio'
              value={filtros.inicio}
              onChange={onChangeFiltro}
              className='rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Data final</label>
            <input
              type='date'
              name='fim'
              value={filtros.fim}
              onChange={onChangeFiltro}
              className='rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none'
            />
          </div>
          <div className='flex items-end gap-3'>
            <button
              type='submit'
              className='flex-1 rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white hover:bg-teal-700'
            >
              Buscar período
            </button>
            <button
              type='button'
              onClick={limparFiltros}
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50'
            >
              Limpar
            </button>
          </div>
        </div>
      </form>

      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-4 flex items-center justify-between gap-4'>
          <h2 className='text-lg font-semibold text-gray-800'>Histórico de movimentações</h2>
          <span className='text-sm text-gray-500'>{historico.length} movimentação(ões)</span>
        </div>

        {carregando ? (
          <div className='rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-600'>Carregando histórico financeiro...</div>
        ) : historico.length === 0 ? (
          <div className='rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-600'>Nenhuma movimentação encontrada no período.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='border-b border-gray-200 bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Data</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Descrição</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Valor</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Categoria</th>
                  <th className='px-4 py-3 text-left font-semibold text-gray-700'>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item) => {
                  const valor = Number(item.valor || 0)
                  const isReceita = item.tipo === 'Receita'

                  return (
                    <tr key={item.id} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='px-4 py-3 text-gray-800'>
                        {item.data_pagamento ? new Date(item.data_pagamento).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className='px-4 py-3 text-gray-800'>{item.descricao || '-'}</td>
                      <td className={`px-4 py-3 font-semibold ${isReceita ? 'text-green-600' : 'text-red-600'}`}>
                        {isReceita ? '+' : '-'}{formatoMoeda.format(valor)}
                      </td>
                      <td className='px-4 py-3 text-gray-800'>{item.categoria || '-'}</td>
                      <td className='px-4 py-3 text-gray-800'>
                        <span className='inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1'>
                          <User size={14} />
                          {formatarResponsavel(item)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
