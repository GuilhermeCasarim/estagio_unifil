import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ServicoEdit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm()

  const navigate = useNavigate()
  let { id } = useParams()
  const [produtos, setProdutos] = useState([])
  const [produtosSelecionados, setProdutosSelecionados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [nomesServico, setNomesServico] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [profissionaisSelecionados, setProfissionaisSelecionados] = useState({})
  const [nomeServicoSelecionado, setNomeServicoSelecionado] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:3001/servicos/byId/${id}`)
      .then((res) => {
        reset(res.data)
        setNomeServicoSelecionado(String(res.data?.nome_servico_id ?? ''))
        const selecionados = []
        if (Array.isArray(res.data.Produtos)) {
          res.data.Produtos.forEach((produto) => {
            const through = produto.ServicosProduto || produto.ServicoProduto || produto.servicosproduto || {}
            selecionados.push({
              produto_id: produto.id,
              quantidade_gasta: through.quantidade_gasta ?? through.quant ?? 1
            })
          })
        }
        setProdutosSelecionados(selecionados)
        const profissionaisSelecionados = {}
        if (Array.isArray(res.data.Profissionais)) {
          res.data.Profissionais.forEach((profissional) => {
            profissionaisSelecionados[profissional.id] = true
          })
        }
        setProfissionaisSelecionados(profissionaisSelecionados)
        setValue('profissionais_ativos', Object.keys(profissionaisSelecionados).join(','), { shouldValidate: true })
        setValue('produtos', selecionados, { shouldValidate: true })
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do serviço:', error)
        toast.error('Erro ao carregar dados.')
      })
  }, [id, reset, setValue])

  useEffect(() => {
    axios.get('http://localhost:3001/produtos')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setProdutos(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos:', error)
        toast.error('Erro ao carregar produtos.')
      })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:3001/categorias-servico')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setCategorias(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error)
        toast.error('Erro ao carregar categorias.')
      })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:3001/nomes-servico')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.data || [])
        setNomesServico(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar nomes de servico:', error)
        toast.error('Erro ao carregar nomes de servico.')
      })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:3001/profissionais?limit=1000')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : (res.data.profissionais || res.data.data || [])
        setProfissionais(payload)
      })
      .catch((error) => {
        console.error('Erro ao buscar profissionais:', error)
        toast.error('Erro ao carregar profissionais.')
      })
  }, [])

  const handleProdutoToggle = (produtoId, checked) => {
    setProdutosSelecionados((prev) => {
      const existe = prev.some((item) => Number(item.produto_id) === Number(produtoId))
      let next = prev

      if (checked && !existe) {
        next = [...prev, { produto_id: Number(produtoId), quantidade_gasta: 1 }]
      }

      if (!checked && existe) {
        next = prev.filter((item) => Number(item.produto_id) !== Number(produtoId))
      }

      setValue('produtos', next, { shouldValidate: true })
      return next
    })
  }

  const handleProdutoQuant = (produtoId, quantidade_gasta) => {
    setProdutosSelecionados((prev) => {
      const next = prev.map((item) => (
        Number(item.produto_id) === Number(produtoId)
          ? { ...item, quantidade_gasta }
          : item
      ))
      setValue('produtos', next, { shouldValidate: true })
      return next
    })
  }

  const buildProfissionaisIds = (selecionados) => Object.entries(selecionados)
    .filter(([, checked]) => checked)
    .map(([profissionalId]) => Number(profissionalId))
    .filter((id) => Number.isInteger(id))

  const profissionalTemEspecialidade = (profissional, nomeId) => {
    const id = Number(nomeId)
    if (!id) return false
    return Array.isArray(profissional.NomesServicos) && profissional.NomesServicos.some((nome) => {
      return Number(nome?.id) === id
    })
  }

  const profissionaisFiltrados = useMemo(() => (
    nomeServicoSelecionado
      ? profissionais.filter((profissional) => profissionalTemEspecialidade(profissional, nomeServicoSelecionado))
      : []
  ), [nomeServicoSelecionado, profissionais])

  useEffect(() => {
    if (!nomeServicoSelecionado) {
      setProfissionaisSelecionados({})
      setValue('profissionais_ativos', '', { shouldValidate: false })
      return
    }

    const permitidos = new Set(profissionaisFiltrados.map((profissional) => profissional.id))
    setProfissionaisSelecionados((prev) => {
      const next = {}
      Object.entries(prev).forEach(([profissionalId, checked]) => {
        if (checked && permitidos.has(Number(profissionalId))) {
          next[profissionalId] = true
        }
      })
      const nextKeys = Object.keys(next)
      const prevKeys = Object.entries(prev)
        .filter(([, checked]) => checked)
        .map(([profissionalId]) => profissionalId)
        .filter((profissionalId) => permitidos.has(Number(profissionalId)))
      if (nextKeys.length === prevKeys.length && nextKeys.every((key) => prevKeys.includes(key))) {
        return prev
      }
      setValue('profissionais_ativos', nextKeys.join(','), { shouldValidate: false })
      return next
    })
  }, [nomeServicoSelecionado, profissionaisFiltrados, setValue])

  const handleProfissionalToggle = (profissionalId, checked) => {
    setProfissionaisSelecionados((prev) => {
      const next = {
        ...prev,
        [profissionalId]: checked
      }
      const ids = buildProfissionaisIds(next)
      setValue('profissionais_ativos', ids.join(','), { shouldValidate: true })
      return next
    })
  }

  const buildProdutosPayload = () => produtosSelecionados.map((item) => ({
    produto_id: Number(item.produto_id),
    quantidade_gasta: Number(item.quantidade_gasta) || 1
  }))

  const onSubmit = (data) => {
    const payload = {
      ...data,
      categoria_servico_id: Number(data.categoria_servico_id),
      preco: Number(data.preco),
      duracao: Number(data.duracao),
      produtos: buildProdutosPayload(),
      profissionais_ids: buildProfissionaisIds(profissionaisSelecionados)
    }

    axios.patch(`http://localhost:3001/servicos/update/${id}`, payload)
      .then(() => {
        toast.success('Serviço atualizado com sucesso!')
        navigate('/servicos', { state: { refetch: true } })
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao atualizar serviço.')
      })
  }

  const onInvalid = () => {
    toast.error('Revise os dados e tente novamente.')
  }

  return (
    <div className='form-edit flex flex-col gap-8 shadow-md p-4 bg-gray-50 max-w-4xl mx-auto mt-10 rounded-lg'>
      <div className='header flex justify-between items-center border-b pb-4'>
        <div className='text'>
          <h1 className='flex gap-2 text-2xl font-bold items-center text-gray-800'>
            <SquarePen className='text-teal-600' /> Editar Serviço
          </h1>
          <p className='text-gray-500'>Atualize as informacoes do serviço</p>
        </div>
        <button
          className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
          onClick={() => navigate('/servicos')}
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome do servico</label>
          <select
            className={`border p-3 rounded-md outline-none ${errors.nome_servico_id ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
            {...register('nome_servico_id', {
              required: 'Nome obrigatorio',
              onChange: (event) => {
                setNomeServicoSelecionado(event.target.value)
              }
            })}
          >
            <option value=''>Selecione</option>
            {nomesServico.map((nome) => (
              <option key={nome.id} value={nome.id}>{nome.nome}</option>
            ))}
          </select>
          {errors.nome_servico_id && <p className='text-red-500 text-sm'>{errors.nome_servico_id.message}</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Preco</label>
            <input
              type='number'
              step='0.01'
              min='0'
              className={`border p-3 rounded-md outline-none ${errors.preco ? 'border-red-500' : 'border-gray-300'}`}
              {...register('preco', { required: 'Preco obrigatorio', min: 0 })}
            />
            {errors.preco && <p className='text-red-500 text-sm'>{errors.preco.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Categoria</label>
            <select
              className={`border p-3 rounded-md outline-none ${errors.categoria_servico_id ? 'border-red-500' : 'border-gray-300'}`}
              {...register('categoria_servico_id', { required: 'Categoria obrigatoria' })}
            >
              <option value=''>Selecione</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
            {errors.categoria_servico_id && <p className='text-red-500 text-sm'>{errors.categoria_servico_id.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Duracao (min)</label>
            <input
              type='number'
              min='1'
              className={`border p-3 rounded-md outline-none ${errors.duracao ? 'border-red-500' : 'border-gray-300'}`}
              {...register('duracao', { required: 'Duracao obrigatoria', min: 1 })}
            />
            {errors.duracao && <p className='text-red-500 text-sm'>{errors.duracao.message}</p>}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <label className='font-semibold'>Profissionais ativos</label>
          <input type='hidden' {...register('profissionais_ativos')} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {profissionaisFiltrados.length === 0 && (
              <p className='text-gray-500 text-sm'>
                {nomeServicoSelecionado
                  ? 'Nenhum profissional com essa especialidade.'
                  : 'Selecione um nome de servico para ver profissionais disponiveis.'}
              </p>
            )}
            {profissionaisFiltrados.map((profissional) => {
              const selecionado = profissionaisSelecionados[profissional.id] ?? false
              return (
                <label key={profissional.id} className='flex items-center gap-2 border rounded-md p-3'>
                  <input
                    type='checkbox'
                    checked={selecionado}
                    onChange={(e) => handleProfissionalToggle(profissional.id, e.target.checked)}
                  />
                  <span>{profissional.nome}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <label className='font-semibold'>Produtos utilizados</label>
          <input
            type='hidden'
            {...register('produtos', {
              validate: (value) => (Array.isArray(value) && value.length > 0) || 'Selecione pelo menos um produto'
            })}
          />
          {errors.produtos && <p className='text-red-500 text-sm'>{errors.produtos.message}</p>}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {produtos.map((produto) => {
              const selecionado = produtosSelecionados.some((item) => Number(item.produto_id) === Number(produto.id))
              const quant = produtosSelecionados.find((item) => Number(item.produto_id) === Number(produto.id))?.quantidade_gasta ?? 1
              return (
                <div key={produto.id} className='flex items-center justify-between gap-3 border rounded-md p-3'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={selecionado}
                      onChange={(e) => handleProdutoToggle(produto.id, e.target.checked)}
                    />
                    <span>{produto.nome}</span>
                  </label>
                  <div className='flex items-center gap-1'>
                    <input
                      type='number'
                      min='1'
                      step='1'
                      className='w-20'
                      value={quant}
                      disabled={!selecionado}
                      onChange={(e) => handleProdutoQuant(produto.id, e.target.value)}
                    />
                    <span className='text-sm text-gray-500'>ml</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='pt-4'>
          <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'>
            Salvar Alteracoes
          </button>
        </div>
      </form>
    </div>
  )
}
