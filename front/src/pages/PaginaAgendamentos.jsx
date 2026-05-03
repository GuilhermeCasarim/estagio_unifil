import React, { useEffect, useState } from 'react'
import { CalendarCheck, User, Scissors, UserCheck, Clock, CheckCircle, XCircle, SquarePen, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { FinanceiroNovo } from './FinanceiroNovo'

export const PaginaAgendamentos = () => {
    const navigate = useNavigate()
    const [agendamentos, setAgendamentos] = useState([])
    const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false)
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)

    const fetchAgendamentos = () => {
        axios.get('http://localhost:3001/agendamentos')
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data.data || [])
                setAgendamentos(data)
            })
            .catch(() => toast.error('Erro ao carregar agendamentos.'))
    }

    useEffect(() => {
        fetchAgendamentos()
    }, [])

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then((res) => {
            if (res.isConfirmed) {
                axios.delete(`http://localhost:3001/agendamentos/delete/${id}`).then(() => {
                    toast.success('Agendamento deletado com sucesso!')
                    fetchAgendamentos()
                    navigate('/agendamentos', { state: { refetch: true } })
                })
            }
        })
            .catch((e) => toast.error(e, 'Erro ao deletar agendamento!'))
    }

    const handleEdit = (id) => {
        navigate(`/agendamento/edit/${id}`)
    }

    const handleFinalizar = (agendamento) => {
        setAgendamentoSelecionado({
            agendamento_id: agendamento.id,
            cliente_id: agendamento.cliente_id,
            descricao: `${agendamento.Servico?.nome_servico?.nome || agendamento.Servico?.nome || '-'} - ${agendamento.Cliente?.nome || '-'}`,
            valor: Number(agendamento.Servico?.preco) || 0,
            tipo: 'Receita',
            categoria: 'Serviços',
            forma_pagamento: '',
            status: 'Pago',
            data_pagamento: new Date().toISOString().slice(0, 10)
        })
        setIsFinanceiroOpen(true)
    }

    const handleFinalizarSuccess = () => {
        setIsFinanceiroOpen(false)
        setAgendamentoSelecionado(null)
        fetchAgendamentos()
    }

    const getStatusColor = (status) => {
        if (status === 'concluido') return 'text-green-600'
        if (status === 'em andamento') return 'text-yellow-600'
        return 'text-blue-600'
    }

    return (
        <div className='space-y-8'>
            <div className='header border-b-2 border-gray-400 pb-2'>
                <h1 className='flex gap-4 items-center text-2xl font-bold'>
                    <CalendarCheck /> Agendamentos
                </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className='texto'>
                    <p>Gestão de agendamentos</p>
                    <p>Visualize e gerencie os agendamentos do salão</p>
                </div>
                <button
                    className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer flex items-center gap-2'
                    onClick={() => navigate('/agendamento/novo')}
                >
                    <CalendarCheck size={18} /> Novo Agendamento
                </button>
            </div>

            <div className='agendamentosData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4 rounded-xl min-h-30'>
                {agendamentos.length === 0 ? (
                    <div className='text-gray-500 col-span-full text-center'>Nenhum agendamento cadastrado.</div>
                ) : (
                    agendamentos.map((ag, key) => {
                        // Corrigir nomes dos campos para garantir que sempre pega o certo
                        const cliente = ag.Cliente?.nome || ag.cliente?.nome || ag.cliente_nome || '-';
                        const servico = ag.Servico?.nome_servico?.nome || ag.Servico?.nome || ag.servico?.nome_servico?.nome || ag.servico?.nome || ag.servico_nome || '-';
                        const profissional = ag.Profissional?.nome || ag.Profissionai?.nome || ag.profissional?.nome || ag.profissional_nome || '-';
                        return (
                            <div
                                className='agendamento-card bg-white hover:bg-gray-200 transition duration-300 p-3 flex flex-col gap-4 rounded-lg shadow-sm relative'
                                key={key}
                                onClick={() => navigate(`/agendamento/${ag.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className='absolute top-2 right-2 flex gap-2'>
                                    <button
                                        className='px-2 py-1 rounded text-gray-400 cursor-pointer hover:text-teal-600'
                                        onClick={(e) => { e.stopPropagation(); handleEdit(ag.id) }}
                                    >
                                        <SquarePen size={20} />
                                    </button>
                                    <button
                                        className='px-2 py-1 rounded text-red-400 cursor-pointer hover:text-red-600'
                                        onClick={(e) => { e.stopPropagation(); handleDelete(ag.id) }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-bold flex items-center gap-2 text-lg'>
                                        <User className='text-teal-600' size={18} />
                                        {cliente}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-700'>
                                        <Scissors size={16} className='text-indigo-600' />
                                        {servico}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-700'>
                                        <UserCheck size={16} className='text-amber-600' />
                                        {profissional}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-700'>
                                        <Clock size={16} className='text-blue-600' />
                                        {ag.data_hora ? new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                    </span>
                                    <div className='flex items-center justify-between gap-3 pt-1'>
                                        <span className={`flex items-center gap-2 font-semibold ${getStatusColor(ag.status)}`}>
                                            {ag.status === 'concluido' ? <CheckCircle size={16} /> : ag.status === 'em andamento' ? <Clock size={16} /> : <XCircle size={16} />}
                                            {ag.status?.charAt(0).toUpperCase() + ag.status?.slice(1) || '-'}
                                        </span>

                                        {ag.status !== 'concluido' && (
                                            <button
                                                className='rounded-md bg-teal-500 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-600 transition duration-300 cursor-pointer'
                                                onClick={(e) => { e.stopPropagation(); handleFinalizar(ag) }}
                                            >
                                                Finalizar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {isFinanceiroOpen && agendamentoSelecionado && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl'>
                        <FinanceiroNovo
                            isModal
                            title='Finalizar Atendimento'
                            submitLabel='CADASTRAR TRANSAÇÃO'
                            successMessage='Transação cadastrada e agendamento concluído com sucesso!'
                            initialValues={agendamentoSelecionado}
                            onCancel={() => {
                                setIsFinanceiroOpen(false)
                                setAgendamentoSelecionado(null)
                            }}
                            onSubmitFinanceiro={(payload) => axios.post(`http://localhost:3001/agendamentos/${agendamentoSelecionado.agendamento_id}/finalizar`, payload)}
                            onSuccess={handleFinalizarSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
