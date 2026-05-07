import { House, Clock, User, Scissors, UserCheck, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const Home = () => {
    const [agendamentos, setAgendamentos] = useState([])
    const [financeiro, setFinanceiro] = useState([])
    const [carregando, setCarregando] = useState(true)

    const dataAtual = new Date()
    const semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
    const diaSemanaIndex = dataAtual.getDay()
    const diaSemana = semana[diaSemanaIndex]
    const diaAno = dataAtual.getFullYear()
    const dia = dataAtual.getDate()
    const mes = dataAtual.toLocaleDateString('pt-BR', { month: 'long' })

    const normalizarChaveData = (valor) => {
        if (!valor) return ''
        if (typeof valor === 'string') return valor.slice(0, 10)

        const data = new Date(valor)
        if (Number.isNaN(data.getTime())) return ''

        return data.toISOString().slice(0, 10)
    }

    const hojeChave = `${String(dataAtual.getFullYear())}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}-${String(dataAtual.getDate()).padStart(2, '0')}`

    // Função para verificar se um agendamento é do dia atual
    const ehAgendamentoHoje = (dataHora) => {
        return normalizarChaveData(dataHora) === hojeChave
    }

    // Função para verificar se uma transação é do dia atual
    const ehTransacaoHoje = (dataPagamento) => {
        return normalizarChaveData(dataPagamento) === hojeChave
    }

    // Calcula métricas financeiras do dia
    const calcularMetricasHoje = (dados) => {
        const hoje = dados.filter(t => ehTransacaoHoje(t.data_pagamento))
        const receitas = hoje
            .filter(t => t.tipo === 'Receita')
            .reduce((sum, t) => sum + parseFloat(t.valor || 0), 0)
        const despesas = hoje
            .filter(t => t.tipo === 'Despesa')
            .reduce((sum, t) => sum + parseFloat(t.valor || 0), 0)
        return { receitas, despesas, saldo: receitas - despesas }
    }

    useEffect(() => {
        const fetchDados = async () => {
            try {
                setCarregando(true)
                
                // Buscar agendamentos
                const resAgendamentos = await axios.get('http://localhost:3001/agendamentos')
                const dataAg = Array.isArray(resAgendamentos.data) ? resAgendamentos.data : (resAgendamentos.data.data || [])
                const agendamentosHoje = dataAg
                    .filter(ag => ehAgendamentoHoje(ag.data_hora))
                    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora))
                
                setAgendamentos(agendamentosHoje)

                // Buscar financeiro
                const resFinanceiro = await axios.get('http://localhost:3001/financeiro')
                const dataFin = Array.isArray(resFinanceiro.data) ? resFinanceiro.data : (resFinanceiro.data.data || [])
                setFinanceiro(dataFin)
            } catch (error) {
                toast.error('Erro ao carregar dados')
            } finally {
                setCarregando(false)
            }
        }

        fetchDados()
    }, [])

    return (
        <div className='space-y-8'>
            <div className="inicio border-b-2 border-gray-400 flex items-center gap-4">
                <House />
                <div>
                    <h1>Início</h1>
                    <p>Bem-vindo ao BelezaGest</p>
                </div>
            </div>

            <div className='dia space-y-2'>
                <p className='text-lg font-semibold'>Hoje é {diaSemana}, {dia} de {mes} de {diaAno}</p>
            </div>

            {/* SEÇÃO FATURAMENTO */}
            <div className='faturamento-hoje'>
                <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <Wallet className='text-teal-600' size={24} />
                    Faturamento Hoje
                </h2>

                {carregando ? (
                    <div className='text-center text-gray-500 py-8'>Carregando dados financeiros...</div>
                ) : (
                    <>
                        {(() => {
                            const { receitas, despesas, saldo } = calcularMetricasHoje(financeiro)
                            return (
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                                    {/* Card Receitas */}
                                    <div className='bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-gray-600 text-sm font-medium'>Receitas</p>
                                                <p className='text-2xl font-bold text-green-600'>R$ {receitas.toFixed(2).replace('.', ',')}</p>
                                            </div>
                                            <TrendingUp className='text-green-600' size={32} />
                                        </div>
                                    </div>

                                    {/* Card Despesas */}
                                    <div className='bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 shadow-sm'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-gray-600 text-sm font-medium'>Despesas</p>
                                                <p className='text-2xl font-bold text-red-600'>R$ {despesas.toFixed(2).replace('.', ',')}</p>
                                            </div>
                                            <TrendingDown className='text-red-600' size={32} />
                                        </div>
                                    </div>

                                    {/* Card Saldo */}
                                    <div className={`bg-gradient-to-br border rounded-lg p-4 shadow-sm ${
                                        saldo >= 0 
                                            ? 'from-blue-50 to-cyan-50 border-blue-200' 
                                            : 'from-slate-50 to-gray-50 border-gray-300'
                                    }`}>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-gray-600 text-sm font-medium'>Saldo</p>
                                                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-gray-600'}`}>
                                                    R$ {saldo.toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                            <Wallet className={saldo >= 0 ? 'text-blue-600' : 'text-gray-600'} size={32} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </>
                )}
            </div>

            <div className='agendamentos-header space-y-2 border-b-2 border-gray-300 pb-3'>
                <p className='text-lg font-semibold text-gray-800'>
                    {carregando ? 'Carregando...' : `${agendamentos.length} agendamento${agendamentos.length !== 1 ? 's' : ''} hoje`}
                </p>
            </div>

            <div className="clientesHoje">
                {carregando ? (
                    <div className='text-center text-gray-500 py-8'>Carregando agendamentos...</div>
                ) : agendamentos.length === 0 ? (
                    <div className='text-center text-gray-500 py-8'>Nenhum agendamento para hoje</div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {agendamentos.map((ag) => {
                            const cliente = ag.Cliente?.nome || '-'
                            const servico = ag.Servico?.nome_servico?.nome || ag.Servico?.nome || '-'
                            const profissional = ag.Profissional?.nome || '-'
                            const hora = new Date(ag.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                            
                            return (
                                <div
                                    key={ag.id}
                                    className='bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300'
                                >
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-bold text-lg text-gray-800 flex items-center gap-2'>
                                                <User size={18} className='text-teal-600' />
                                                {cliente}
                                            </span>
                                            <span className='bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                                                <Clock size={16} />
                                                {hora}
                                            </span>
                                        </div>

                                        <div className='space-y-2 pt-2 border-t border-teal-200'>
                                            <div className='flex items-center gap-2 text-gray-700'>
                                                <Scissors size={16} className='text-indigo-600' />
                                                <span className='text-sm'>{servico}</span>
                                            </div>
                                            <div className='flex items-center gap-2 text-gray-700'>
                                                <UserCheck size={16} className='text-amber-600' />
                                                <span className='text-sm'>{profissional}</span>
                                            </div>
                                        </div>

                                        <div className='pt-2'>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                ag.status === 'concluido' 
                                                    ? 'bg-green-100 text-green-700'
                                                    : ag.status === 'em andamento'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
