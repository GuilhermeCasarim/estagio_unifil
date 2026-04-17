import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Scissors, X } from 'lucide-react'
import { toast } from 'react-toastify'

export const ServicoNovo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors
  } = useForm()

  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [produtosSelecionados, setProdutosSelecionados] = useState({})
  const [categorias, setCategorias] = useState([])
  const [nomesServico, setNomesServico] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [profissionaisSelecionados, setProfissionaisSelecionados] = useState({})

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
      const next = {
        ...prev,
        [produtoId]: {
          checked,
          quant: prev[produtoId]?.quant ?? 1
        }
      }
      const totalSelecionados = Object.values(next).filter((item) => item?.checked).length
      setValue('produtos_utilizados', totalSelecionados, { shouldValidate: true })
      if (totalSelecionados > 0) {
        clearErrors('produtos_utilizados')
      }
      return next
    })
  }

  const handleProdutoQuant = (produtoId, quant) => {
    setProdutosSelecionados((prev) => ({
      ...prev,
      [produtoId]: {
        checked: prev[produtoId]?.checked ?? false,
        quant
      }
    }))
  }

  const buildProfissionaisIds = (selecionados) => Object.entries(selecionados)
    .filter(([, checked]) => checked)
    .map(([profissionalId]) => Number(profissionalId))
    .filter((id) => Number.isInteger(id))

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

  const buildProdutosPayload = () => Object.entries(produtosSelecionados)
    .filter(([, item]) => item.checked)
    .map(([produtoId, item]) => ({
      produto_id: Number(produtoId),
      quant: Number(item.quant) || 1
    }))

  const onSubmit = (data) => {
    const payload = {
      ...data,
      categoria_servico_id: Number(data.categoria_servico_id),
      preco: Number(data.preco),
      duracao: Number(data.duracao),
      produtos_utilizados: buildProdutosPayload(),
      profissionais_ids: buildProfissionaisIds(profissionaisSelecionados)
    }

    if (payload.produtos_utilizados.length === 0) {
      setError('produtos_utilizados', {
        type: 'validate',
        message: 'Selecione pelo menos um produto'
      })
      return
    }

    axios.post('http://localhost:3001/servicos', payload)
      .then(() => {
        toast.success('Serviço cadastrado com sucesso!')
        navigate('/servicos')
      })
      .catch((err) => {
        console.error(err)
        toast.error('Erro ao cadastrar serviço.')
      })
  }

  const onInvalid = (formErrors) => {
    console.log('Erros de validacao do formulario:', formErrors)
    toast.error('ERRO. Revise os dados e tente novamente.')
  }

  return (
    <div className='flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-sm'>
        <h1 className='flex gap-2 text-2xl font-bold items-center'>
          <Scissors className='text-teal-600' /> Novo Serviço
        </h1>
        <button onClick={() => navigate('/servicos')} className='p-2 hover:bg-gray-100 rounded-full'>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
        <div className='flex flex-col gap-2'>
          <label className='font-semibold'>Nome do servico</label>
          <select
            {...register('nome_servico_id', { required: true })}
            defaultValue=''
          >
            <option value='' disabled>Selecione</option>
            {nomesServico.map((nome) => (
              <option key={nome.id} value={nome.id}>{nome.nome}</option>
            ))}
          </select>
          {errors?.nome_servico_id?.type == 'required' && <p className='text-red-500 text-sm'>Nome obrigatorio!</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Preco</label>
            <input
              type='number'
              step='0.01'
              min='0'
              placeholder='0.00'
              {...register('preco', { required: true, min: 0 })}
            />
            {errors?.preco?.type == 'required' && <p className='text-red-500 text-sm'>Preco obrigatorio!</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Categoria</label>
            <select
              {...register('categoria_servico_id', { required: true })}
              defaultValue=''
            >
              <option value='' disabled>Selecione</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
              ))}
            </select>
            {errors?.categoria_servico_id?.type == 'required' && <p className='text-red-500 text-sm'>Categoria obrigatoria!</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='font-semibold'>Duracao (min)</label>
            <input
              type='number'
              min='1'
              placeholder='30'
              {...register('duracao', { required: true, min: 1 })}
            />
            {errors?.duracao?.type == 'required' && <p className='text-red-500 text-sm'>Duracao obrigatoria!</p>}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <label className='font-semibold'>Profissionais ativos</label>
          <input
            type='hidden'
            {...register('profissionais_ativos', {
              validate: (value) => (value && value.split(',').filter(Boolean).length > 0) || 'Selecione pelo menos um profissional'
            })}
          />
          {errors?.profissionais_ativos && <p className='text-red-500 text-sm'>{errors.profissionais_ativos.message}</p>}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {profissionais.map((profissional) => {
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
            {...register('produtos_utilizados', {
              validate: (value) => Number(value) > 0 || 'Selecione pelo menos um produto'
            })}
          />
          {errors?.produtos_utilizados && <p className='text-red-500 text-sm'>{errors.produtos_utilizados.message}</p>}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {produtos.map((produto) => {
              const selecionado = produtosSelecionados[produto.id]?.checked ?? false
              const quant = produtosSelecionados[produto.id]?.quant ?? 1
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
                  <input
                    type='number'
                    min='1'
                    className='w-20'
                    value={quant}
                    disabled={!selecionado}
                    onChange={(e) => handleProdutoQuant(produto.id, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
          CADASTRAR SERVIÇO
        </button>
      </form>
    </div>
  )
}
