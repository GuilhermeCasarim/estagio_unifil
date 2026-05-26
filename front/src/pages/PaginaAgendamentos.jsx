import React, { useContext, useEffect, useState } from 'react'
import { CalendarCheck, User, Scissors, UserCheck, Clock, CheckCircle, XCircle, SquarePen, Trash2, BellRing, ClipboardCheck, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { FinanceiroNovo } from './FinanceiroNovo'
import { AuthContext } from '../helpers/AuthContext'

const getHojeInput = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000
    return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

const getDataLocal = (value) => {
    if (!value) return ''

    const data = new Date(value)
    if (Number.isNaN(data.getTime())) return ''

    const offset = data.getTimezoneOffset() * 60000
    return new Date(data.getTime() - offset).toISOString().slice(0, 10)
}

export const PaginaAgendamentos = () => {
    const navigate = useNavigate()
    const { authState } = useContext(AuthContext)
    const [agendamentos, setAgendamentos] = useState([])
    const [abaAtiva, setAbaAtiva] = useState('pendentes')
    const [filtroInicio, setFiltroInicio] = useState(getHojeInput())
    const [filtroFim, setFiltroFim] = useState(getHojeInput())
    const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false)
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
    const [isConsumoOpen, setIsConsumoOpen] = useState(false)
    const [agendamentoConsumo, setAgendamentoConsumo] = useState(null)
    const [produtosConsumo, setProdutosConsumo] = useState([])
    const [produtosMarcados, setProdutosMarcados] = useState([])
    const [carregandoConsumo, setCarregandoConsumo] = useState(false)
    const [salvandoConsumo, setSalvandoConsumo] = useState(false)

    useEffect(() => {
        if (filtroInicio && filtroFim && filtroFim < filtroInicio) {
            setFiltroFim(filtroInicio)
        }
    }, [filtroInicio, filtroFim])

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

    const abrirValidacaoConsumo = async (agendamento) => {
        try {
            setCarregandoConsumo(true)
            const resposta = await axios.get(`http://localhost:3001/agendamentos/byId/${agendamento.id}`)
            const dados = resposta.data
            const produtosServico = dados.Servico?.Produtos || dados.Servicos?.Produtos || []
            const consumosExistentes = Array.isArray(dados.ConsumoAgendamentos) ? dados.ConsumoAgendamentos : []
            const consumosMarcados = new Set(consumosExistentes.map((item) => Number(item.id_produto)))

            const itens = produtosServico
                .map((produto) => {
                    const quantidadeDefault = Number(produto.ServicosProduto?.quantidade_gasta) || 0

                    if (quantidadeDefault <= 0) {
                        return null
                    }

                    const idProduto = Number(produto.id)

                    return {
                        id: idProduto,
                        nome: produto.nome || 'Produto sem nome',
                        quantidadeDefault,
                        marcado: consumosExistentes.length > 0 ? consumosMarcados.has(idProduto) : true
                    }
                })
                .filter(Boolean)

            if (itens.length === 0) {
                toast.error('Este serviço não possui produtos para validar.')
                return
            }

            setAgendamentoConsumo(dados)
            setProdutosConsumo(itens)
            setProdutosMarcados(itens.filter((item) => item.marcado).map((item) => item.id))
            setIsConsumoOpen(true)
        } catch {
            toast.error('Erro ao carregar consumo do agendamento.')
        } finally {
            setCarregandoConsumo(false)
        }
    }

    const alternarProdutoConsumo = (idProduto) => {
        setProdutosMarcados((prev) => (
            prev.includes(idProduto)
                ? prev.filter((item) => item !== idProduto)
                : [...prev, idProduto]
        ))
    }

    const salvarValidacaoConsumo = async () => {
        if (!agendamentoConsumo) {
            return
        }

        if (produtosMarcados.length === 0) {
            toast.error('Selecione ao menos um produto para validar o consumo.')
            return
        }

        try {
            setSalvandoConsumo(true)
            await axios.post(`http://localhost:3001/agendamentos/${agendamentoConsumo.id}/consumo`, {
                produtosSelecionados: produtosMarcados
            })
            toast.success('Consumo validado com sucesso!')
            setIsConsumoOpen(false)
            setAgendamentoConsumo(null)
            setProdutosConsumo([])
            setProdutosMarcados([])
            fetchAgendamentos()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao salvar consumo.')
        } finally {
            setSalvandoConsumo(false)
        }
    }

    const handleFinalizar = (agendamento) => {
        const dataAgendamento = agendamento.data_hora
            ? String(agendamento.data_hora).slice(0, 10)
            : new Date().toISOString().slice(0, 10)

        setAgendamentoSelecionado({
            agendamento_id: agendamento.id,
            cliente_id: agendamento.cliente_id,
            usuario_id: authState?.id || '',
            descricao: `${agendamento.Servico?.nome_servico?.nome || agendamento.Servico?.nome || '-'} - ${agendamento.Cliente?.nome || '-'}`,
            valor: Number(agendamento.Servico?.preco) || 0,
            tipo: 'Receita',
            categoria: 'Serviços',
            forma_pagamento: '',
            status: 'Pago',
            data_pagamento: dataAgendamento
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
        if (status === 'cancelado') return 'text-red-600'
        if (status === 'confirmado') return 'text-blue-600'
        return 'text-gray-600'
    }

    const enviarNotificacaoZap = (agendamento) => {
        const telefone = agendamento.Cliente.telefone
        const nomeCliente = agendamento.Cliente.nome

        const servico = agendamento.Servico.nome_servico.nome
        const profissional = agendamento.Profissional.nome

        let data = '-'
        let horario = '-'
        if (agendamento.data_hora) {
            const dataObj = new Date(agendamento.data_hora)
            data = dataObj.toLocaleDateString('pt-BR')
            horario = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }

        const telefoneLimpo = telefone.replace(/\D/g, '')
        const saudacao = "Olá *" + nomeCliente + "*! 👋"
        const corpo = "\nPassando para confirmar seu horário de *" + servico + "* com o profissional *" + profissional + "*.\n"
        const detalhes = "\n📅 *Data:* " + data + "\n⏰ *Hora:* " + horario
        const mensagemFinal = saudacao + corpo + detalhes
        const url = "https://api.whatsapp.com/send?phone=55" + telefoneLimpo + "&text=" + encodeURIComponent(mensagemFinal)

        window.open(url, '_blank')
    }

    const tabs = [
        { key: 'todos', label: 'Todos' },
        { key: 'pendentes', label: 'Pendentes' },
        { key: 'concluidos', label: 'Concluídos' },
        { key: 'cancelados', label: 'Cancelados' }
    ]

    const agendamentosFiltrados = agendamentos.filter((ag) => {
        const status = ag.status
        const dataAgendamento = getDataLocal(ag.data_hora)
        const inicio = filtroInicio || ''
        const fim = filtroFim || ''

        const correspondeAba = abaAtiva === 'todos'
            ? true
            : abaAtiva === 'pendentes'
            ? ['agendado', 'confirmado'].includes(status)
            : abaAtiva === 'concluidos'
                ? status === 'concluido'
                : status === 'cancelado'

        const dentroDoPeriodo = (!inicio || dataAgendamento >= inicio) && (!fim || dataAgendamento <= fim)

        return correspondeAba && dentroDoPeriodo
    })

    return (
        <div className='space-y-8'>
            <div className='header border-b-2 border-teal-200 pb-2 text-teal-600 text-2xl font-bold'>
                <h1 className='flex gap-4 items-center'>
                    <CalendarCheck /> Agendamentos
                </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className='texto'>
                    <p className='text-gray-700'>Gestão de agendamentos</p>
                    <p className='text-gray-500'>Visualize e gerencie os agendamentos do salão</p>
                </div>
                <div className='flex items-center gap-2'>
                    <button
                        className='cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-gray-700 hover:bg-gray-100 transition duration-300'
                        onClick={() => navigate('/agendamentos/periodo')}
                    >
                        Período
                    </button>
                    <button
                        className='bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 transition duration-300 cursor-pointer flex items-center gap-2'
                        onClick={() => navigate('/agendamento/novo')}
                    >
                        Novo Agendamento
                    </button>
                </div>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex flex-wrap gap-2'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                type='button'
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${abaAtiva === tab.key
                                    ? 'bg-teal-500 text-white shadow-sm'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                onClick={() => setAbaAtiva(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className='flex items-end gap-3'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-700'>De</label>
                            <input
                                type='date'
                                className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-teal-500 focus:outline-none'
                                value={filtroInicio}
                                onChange={(e) => setFiltroInicio(e.target.value)}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-700'>Até</label>
                            <input
                                type='date'
                                className='rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-teal-500 focus:outline-none'
                                value={filtroFim}
                                onChange={(e) => setFiltroFim(e.target.value)}
                                min={filtroInicio || undefined}
                            />
                        </div>
                    </div>
                </div>
                <p className='mt-3 text-sm text-gray-500'>Mostrando agendamentos de {filtroInicio ? new Date(`${filtroInicio}T12:00:00`).toLocaleDateString('pt-BR') : 'hoje'} até {filtroFim ? new Date(`${filtroFim}T12:00:00`).toLocaleDateString('pt-BR') : 'hoje'}.</p>
            </div>

            <div className='agendamentosData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm min-h-30'>
                {agendamentosFiltrados.length === 0 ? (
                    <div className='text-gray-500 col-span-full text-center font-medium'>Nenhum agendamento cadastrado.</div>
                ) : (
                    agendamentosFiltrados.map((ag, key) => {
                        const cliente = ag.Cliente?.nome || ag.cliente?.nome || ag.cliente_nome || '-';
                        const servico = ag.Servico?.nome_servico?.nome || ag.Servico?.nome || ag.servico?.nome_servico?.nome || ag.servico?.nome || ag.servico_nome || '-';
                        const profissional = ag.Profissional?.nome || ag.Profissionai?.nome || ag.profissional?.nome || ag.profissional_nome || '-';
                        const dataHoraAgendamento = ag.data_hora ? new Date(ag.data_hora) : null
                        const podeFinalizar = dataHoraAgendamento instanceof Date && !Number.isNaN(dataHoraAgendamento.getTime())
                            ? new Date() >= dataHoraAgendamento
                            : false
                        const ehPendentes = abaAtiva === 'pendentes'
                        const ehTodos = abaAtiva === 'todos'
                        return (
                            <div
                                className='agendamento-card bg-white border border-gray-200 hover:border-teal-500 hover:shadow-md transition duration-300 p-4 flex flex-col gap-4 rounded-2xl shadow-sm relative cursor-pointer'
                                key={key}
                                onClick={() => navigate(`/agendamento/${ag.id}`)}
                            >
                                <div className='absolute top-2 right-2 flex gap-2'>
                                    {(ehPendentes || ehTodos) && ag.status !== 'cancelado' && (
                                        <button 
                                            className='px-2 py-1 text-green-500 cursor-pointer hover:text-green-600 transition duration-300'
                                            onClick={(e) => { e.stopPropagation(); enviarNotificacaoZap(ag) }}
                                        >
                                            <BellRing size={20} />
                                        </button>
                                    )}
                                    {ehPendentes || ehTodos ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <button
                                            className='rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100'
                                            onClick={(e) => { e.stopPropagation(); navigate(`/agendamento/${ag.id}`) }}
                                        >
                                            Ver Resumo
                                        </button>
                                    )}
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='font-semibold flex items-center gap-2 text-lg text-gray-800'>
                                        <User className='text-teal-600' size={18} />
                                        {cliente}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-600'>
                                        <Scissors size={16} className='text-teal-500' />
                                        {servico}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-600'>
                                        <UserCheck size={16} className='text-teal-500' />
                                        {profissional}
                                    </span>
                                    <span className='flex items-center gap-2 text-gray-600'>
                                        <Clock size={16} className='text-teal-500' />
                                        {ag.data_hora ? new Date(ag.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                    </span>
                                    <div className='flex items-center justify-between gap-3 pt-1'>
                                        <span className={`flex items-center gap-2 font-semibold text-sm ${getStatusColor(ag.status)}`}>
                                            {ag.status === 'concluido' ? <CheckCircle size={16} /> : ag.status === 'cancelado' ? <XCircle size={16} /> : ag.status === 'confirmado' ? <Clock size={16} /> : <Clock size={16} />}
                                            {ag.status?.charAt(0).toUpperCase() + ag.status?.slice(1) || '-'}
                                        </span>

                                        {(ehPendentes || ehTodos) && (
                                            <div className='flex flex-col items-end gap-2'>
                                                    <button
                                                        className='rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition duration-300 cursor-pointer flex items-center gap-1.5 whitespace-nowrap'
                                                        onClick={(e) => { e.stopPropagation(); abrirValidacaoConsumo(ag) }}
                                                    >
                                                        <ClipboardCheck size={14} />
                                                        Validar Consumo
                                                    </button>
                                                    <button
                                                        className='rounded-full bg-teal-500 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-600 transition duration-300 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-400'
                                                        onClick={(e) => { e.stopPropagation(); handleFinalizar(ag) }}
                                                        disabled={!podeFinalizar}
                                                        title={!podeFinalizar ? 'Disponível apenas no horário do agendamento' : 'Finalizar atendimento'}
                                                    >
                                                        Finalizar
                                                    </button>
                                                </div>
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

            {isConsumoOpen && agendamentoConsumo && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
                        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
                            <div>
                                <h2 className='flex items-center gap-2 text-xl font-bold text-gray-800'>
                                    <ClipboardCheck className='text-teal-600' size={22} />
                                    Validar Consumo
                                </h2>
                                <p className='mt-1 text-sm text-gray-500'>
                                    Confirme os produtos usados no atendimento antes da finalização.
                                </p>
                            </div>
                            <button
                                className='rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                onClick={() => {
                                    setIsConsumoOpen(false)
                                    setAgendamentoConsumo(null)
                                    setProdutosConsumo([])
                                    setProdutosMarcados([])
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className='space-y-4 px-6 py-5'>
                            <div className='rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600'>
                                <p className='font-semibold text-gray-800'>
                                    {agendamentoConsumo.Servico?.nome_servico?.nome || agendamentoConsumo.Servico?.nome || 'Serviço'}
                                </p>
                                <p className='mt-1'>Marque apenas os produtos realmente utilizados. Os itens marcados serão salvos com a quantidade padrão do serviço.</p>
                            </div>

                            {carregandoConsumo ? (
                                <div className='py-10 text-center text-gray-500'>Carregando consumo...</div>
                            ) : (
                                <div className='space-y-3'>
                                    {produtosConsumo.map((produto) => (
                                        <label key={produto.id} className='flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-teal-400 hover:bg-teal-50'>
                                            <div>
                                                <p className='font-semibold text-gray-800'>{produto.nome}</p>
                                                <p className='text-xs text-gray-500'>Quantidade padrão: {produto.quantidadeDefault}</p>
                                            </div>
                                            <input
                                                type='checkbox'
                                                className='h-5 w-5 accent-teal-600'
                                                checked={produtosMarcados.includes(produto.id)}
                                                onChange={() => alternarProdutoConsumo(produto.id)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4'>
                            <button
                                className='rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
                                onClick={() => {
                                    setIsConsumoOpen(false)
                                    setAgendamentoConsumo(null)
                                    setProdutosConsumo([])
                                    setProdutosMarcados([])
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className='rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-teal-300'
                                onClick={salvarValidacaoConsumo}
                                disabled={salvandoConsumo || carregandoConsumo}
                            >
                                {salvandoConsumo ? 'Salvando...' : 'Salvar consumo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
