import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, CalendarRange, DollarSign, Users, Package2, Package, ArrowRight } from 'lucide-react'

const relatorios = [
  {
    titulo: 'Agendamentos por período e profissional',
    descricao: 'Resumo dos agendamentos filtrados por intervalo de datas e profissional responsável.',
    icone: CalendarRange,
    destaque: 'Agenda',
    rota: '/relatorios/agendamentos'
  },
  {
    titulo: 'Faturamento por serviço, profissional e cliente',
    descricao: 'Visão consolidada do faturamento por serviço prestado, profissional atendente e cliente.',
    icone: DollarSign,
    destaque: 'Financeiro',
    rota: '/relatorios/faturamento'
  },
  {
    titulo: 'Movimentações financeiras e saldo',
    descricao: 'Histórico de entradas e saídas com saldo diário, semanal e mensal para acompanhar o caixa.',
    icone: DollarSign,
    destaque: 'Caixa',
    rota: '/relatorios/financeiro'
  },
  {
    titulo: 'Materiais mais usados',
    descricao: 'Ranking dos materiais com maior consumo para apoiar reposição e controle de estoque.',
    icone: Package2,
    destaque: 'Estoque',
    rota: '/relatorios/materiais'
  },
  {
    titulo: 'Clientes mais ativos',
    descricao: 'Lista dos clientes com maior volume de atendimentos e recorrência.',
    icone: Users,
    destaque: 'Clientes',
    rota: '/relatorios/clientes'
  },
  {
    titulo: 'Consumo de produtos por serviço e profissional',
    descricao: 'Análise do consumo de materiais agregado por serviço e profissional para identificar os maiores consumidores.',
    icone: Package,
    destaque: 'Produtos',
    rota: '/relatorios/produtos'
  }
]

export const PaginaRelatorios = () => {
  const navigate = useNavigate()
  return (
    <div className='space-y-8'>
      <div className='header border-b-2 border-gray-400 pb-2'>
        <h1 className='flex gap-4 items-center text-2xl font-bold'>
          <BarChart3 /> Relatórios
        </h1>
      </div>

      <div className='intro flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div className='texto space-y-1'>
          <p>Central de relatórios do sistema</p>
          <p>Selecione o relatório que deseja acompanhar e, nas próximas etapas, vamos ligar cada consulta.</p>
        </div>
        <div className='inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-700'>
          <ArrowRight size={16} />
          Base pronta para os 6 relatórios
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {relatorios.map((relatorio) => {
          const Icone = relatorio.icone

          return (
            <div
              key={relatorio.titulo}
              onClick={() => navigate(relatorio.rota)}
              className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='space-y-3'>
                  <span className='inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700'>
                    {relatorio.destaque}
                  </span>
                  <div className='flex items-center gap-3'>
                    <div className='rounded-2xl bg-teal-500 p-3 text-white'>
                      <Icone size={22} />
                    </div>
                    <h2 className='text-lg font-semibold text-gray-800'>{relatorio.titulo}</h2>
                  </div>
                </div>
              </div>
              <p className='mt-4 text-sm leading-6 text-gray-600'>{relatorio.descricao}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}