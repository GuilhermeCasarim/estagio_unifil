import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const RelatorioProdutos = () => {
	const navigate = useNavigate()
	const [carregando, setCarregando] = useState(false)
	const [itensServico, setItensServico] = useState([])
	const [itensProfissional, setItensProfissional] = useState([])

	const buscarDados = useCallback(async () => {
		try {
			setCarregando(true)

			const resAg = await axios.get('http://localhost:3001/agendamentos/historico?status=concluido')
			const agendamentos = Array.isArray(resAg.data) ? resAg.data : (resAg.data.data || [])

			const mapaServicos = new Map()
			const mapaProfissionais = new Map()

			agendamentos.forEach((ag) => {
				const servicoId = ag.servico_id || ag.Servico?.id
				if (!servicoId) return

				const chave = servicoId
				if (!mapaServicos.has(chave)) {
					mapaServicos.set(chave, {
						id: chave,
						nome: ag.Servico?.nome_servico?.nome || ag.Servico?.nome || 'Servico sem nome',
						Produtos: []
					})
				}

				// identificar profissional deste agendamento (para agregar por profissional)
				const profissionalId = ag.profissional_id || ag.Profissional?.id
				if (profissionalId) {
					if (!mapaProfissionais.has(profissionalId)) {
						mapaProfissionais.set(profissionalId, {
							id: profissionalId,
							nome: ag.Profissional?.nome || `Profissional ${profissionalId}`,
							Produtos: []
						})
					}
				}

				const consumosSalvos = Array.isArray(ag.ConsumoAgendamentos) && ag.ConsumoAgendamentos.length > 0
					? ag.ConsumoAgendamentos.map((consumo) => ({
						id: consumo.id_produto || consumo.Produto?.id,
						nome: consumo.Produto?.nome || 'Produto sem nome',
						quantidade_bruta: Number(consumo.quantidade_utilizada) || 0,
						volume_unidade: Number(consumo.Produto?.volume_unidade) || 0,
						unidade_medida: (consumo.Produto?.unidade_medida || '').toLowerCase()
					}))
					: (ag.Servico?.Produtos || []).map((p) => ({
						id: p.id,
						nome: p.nome || p.nome_produto || 'Produto sem nome',
						quantidade_bruta: Number(p.ServicosProduto?.quantidade_gasta) || 0,
						volume_unidade: Number(p.volume_unidade) || 0,
						unidade_medida: (p.unidade_medida || '').toLowerCase()
					}))

				consumosSalvos.forEach((p) => {
					const quantidadeBruta = Number(p.quantidade_bruta) || 0
					const volume_unidade = Number(p.volume_unidade) || 0
					const unidade_medida = p.unidade_medida || ''

					let valorEmMlOuG = null
					if (unidade_medida === 'ml' || unidade_medida === 'g') {
						valorEmMlOuG = Math.round(quantidadeBruta)
					} else if (unidade_medida === 'un' && volume_unidade) {
						valorEmMlOuG = Math.round(quantidadeBruta * volume_unidade)
					} else if (volume_unidade) {
						valorEmMlOuG = Math.round(quantidadeBruta)
					}

					const prod = {
						id: p.id,
						nome: p.nome,
						quantidade_bruta: quantidadeBruta,
						volume_unidade,
						unidade_medida,
						valorEmMlOuG
					}

					const entry = mapaServicos.get(chave)
					entry.Produtos.push(prod)

					if (profissionalId) {
						const profEntry = mapaProfissionais.get(profissionalId)
						profEntry.Produtos.push(prod)
					}
				})
			})

			const listaServicos = Array.from(mapaServicos.values()).map((s) => ({ ...s }))
			const listaProfissionais = Array.from(mapaProfissionais.values()).map((p) => ({ ...p }))
			setItensServico(listaServicos)
			setItensProfissional(listaProfissionais)

		} catch (erro) {
			toast.error('Erro ao carregar relatório de produtos')
		} finally {
			setCarregando(false)
		}
	}, [])

	useEffect(() => {
		buscarDados()
	}, [buscarDados])

	const contarProdutosDistintos = (produtos = []) => {
		return new Set(
			produtos
				.map((p) => Number(p.id))
				.filter((id) => Number.isInteger(id) && id > 0)
		).size
	}

	const maxTotalServico = useMemo(() => {
		return Math.max(...itensServico.map((it) => contarProdutosDistintos(it.Produtos)), 1)
	}, [itensServico])

	const maxTotalProfissional = useMemo(() => {
		return Math.max(...itensProfissional.map((it) => contarProdutosDistintos(it.Produtos)), 1)
	}, [itensProfissional])

	const renderTagsProdutos = (produtos) => {
		if (!Array.isArray(produtos) || produtos.length === 0) return null

		const mapaProdutos = new Map()

		produtos.forEach((p) => {
			const id = Number(p.id)
			if (!Number.isInteger(id) || id <= 0) return

			const quantidade = Number(p.quantidade_bruta) || 0
			const unidade = (p.unidade_medida || 'un').toLowerCase()

			if (mapaProdutos.has(id)) {
				const existente = mapaProdutos.get(id)
				mapaProdutos.set(id, {
					...existente,
					quantidade_bruta: existente.quantidade_bruta + quantidade
				})
			} else {
				mapaProdutos.set(id, {
					id,
					nome: p.nome,
					quantidade_bruta: quantidade,
					unidade_medida: unidade
				})
			}
		})

		const produtosConsolidados = Array.from(mapaProdutos.values())

		return (
			<div className='mt-2 flex flex-wrap gap-2'>
				{produtosConsolidados.map((p) => {
					const unidade = (p.unidade_medida || 'un').toLowerCase()
					const quantidade = Number(p.quantidade_bruta) || 0
					const valorFormatado = Number.isInteger(quantidade)
						? String(quantidade)
						: quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
					const textoValor = ` ${valorFormatado}${unidade}`

					return (
						<span
							key={p.id}
							className='bg-gray-100 text-gray-800 rounded-full px-2 py-1 text-sm'
							title={p.nome}
						>
							{p.nome}{textoValor}
						</span>
					)
				})}
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between border-b-2 border-gray-400 pb-4'>
				<h1 className='text-2xl font-bold'>Consumo de produtos por serviço</h1>
				<button
					onClick={() => navigate('/relatorios')}
					className='flex itens-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50'
				>
					<ArrowLeft size={18} />
					Voltar
				</button>
			</div>

			<div className='rounded-lg border border-gray-200 bg-white p-6'>
				{carregando ? (
					<div className='text-center text-gray-600'>Carregando...</div>
				) : itensServico.length === 0 ? (
					<div className='text-center text-gray-600'>Nenhum dado encontrado.</div>
				) : (
						<div className='grid gap-6 md:grid-cols-2'>
							{/* Por Serviço */}
							<div className='rounded-lg border border-gray-200 bg-white p-6'>
								<h2 className='mb-4 text-lg font-semibold text-gray-800'>Consumo por serviço</h2>
								{itensServico.length === 0 ? (
									<div className='text-center text-gray-600'>Nenhum serviço encontrado.</div>
								) : (
									<div className='space-y-3'>
										{itensServico.map((item, idx) => {
											const totalProdutosDistintos = contarProdutosDistintos(item.Produtos)
											const largura = ((totalProdutosDistintos / maxTotalServico) * 100)

											return (
												<div key={item.id || idx} className='rounded-lg border border-gray-100 bg-gray-50 px-4 py-3'>
													<div className='flex items-center justify-between'>
														<div className='flex items-center gap-4'>
															<span className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white'>{idx + 1}</span>
															<span className='font-medium text-gray-800'>{item.nome}</span>
														</div>
														<div className='flex items-center gap-4'>
															<div className='text-right'>
																<p className='text-lg font-bold text-indigo-600'>{totalProdutosDistintos} produtos</p>
																<p className='text-xs text-gray-500'>consumidos</p>
															</div>
														</div>
													</div>

													<div className='mt-3 h-2 w-full rounded-full bg-gray-200'>
														<div className='h-full rounded-full bg-indigo-500' style={{ width: `${largura}%` }} />
													</div>

													{renderTagsProdutos(item.Produtos)}
												</div>
											)
										})}
									</div>
								)}
							</div>

							{/* Por Profissional */}
							<div className='rounded-lg border border-gray-200 bg-white p-6'>
								<h2 className='mb-4 text-lg font-semibold text-gray-800'>Consumo por profissional</h2>
								{itensProfissional.length === 0 ? (
									<div className='text-center text-gray-600'>Nenhum profissional encontrado.</div>
								) : (
									<div className='space-y-3'>
										{itensProfissional.map((item, idx) => {
											const totalProdutosDistintos = contarProdutosDistintos(item.Produtos)
											const largura = ((totalProdutosDistintos / maxTotalProfissional) * 100)

											return (
												<div key={item.id || idx} className='rounded-lg border border-gray-100 bg-gray-50 px-4 py-3'>
													<div className='flex items-center justify-between'>
														<div className='flex items-center gap-4'>
															<span className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white'>{idx + 1}</span>
															<span className='font-medium text-gray-800'>{item.nome}</span>
														</div>
														<div className='flex items-center gap-4'>
															<div className='text-right'>
																<p className='text-lg font-bold text-emerald-600'>{totalProdutosDistintos} produtos</p>
																<p className='text-xs text-gray-500'>consumidos</p>
															</div>
														</div>
													</div>

													<div className='mt-3 h-2 w-full rounded-full bg-gray-200'>
														<div className='h-full rounded-full bg-emerald-500' style={{ width: `${largura}%` }} />
													</div>

													{renderTagsProdutos(item.Produtos)}
												</div>
											)
										})}
									</div>
								)}
							</div>
						</div>
				)}
			</div>
		</div>
	)
}


