import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserPlus, X } from 'lucide-react'
import { toast } from 'react-toastify';


//cadastro/form clientes

export const Clientes = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log(errors)
    const navigate = useNavigate()

    const onSubmit = (data) => {
        axios.post('http://localhost:3001/clientes', data).then((res) => {
            toast.success('Cliente cadastrado com sucesso!')
            console.log(res)
            navigate('/clientes/lista', { state: { refetch: true } })
        })
        // .catch((e) => toast.error('Erro ao cadastrar cliente'))
    }

    const onInvalid = (errors) => {
        // Log para depuração
        console.log("Erros de validação do formulário:", errors);
        
        // Toast de erro para alertar o usuário sobre campos obrigatórios/inválidos
        toast.error('ERRO. Revise os dados e tente novamente.')
    }

    return (
        <div className='form-cadastro flex flex-col gap-8 shadow-md p-2'>
            {/* <ToastContainer/> */}
            <div className="header flex justify-between">
                <div className="text">
                    <h1 className='flex gap-2'> <UserPlus className='text-teal-600' /> Cadastrar Novo Cliente</h1>
                    <p className='text-gray-500'>Preencha as informações do cliente abaixo</p>
                </div>
                <button className='cursor-pointer hover:bg-gray-200 rounded-full px-2 py-1 transition duration-300' onClick={() => navigate('/clientes/lista')}>
                    <X />
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-8 p-2'>
                <div className="c_nome space-x-4 flex">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" name='nome' id='nome' placeholder='Nome do cliente(obrigatório)'
                        {...register('nome', { required: true })}
                    />
                    {errors?.nome?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Nome necessário!</p>}
                </div>
                <div className="c_telefone space-x-4">
                    <label htmlFor="telefone">Telefone</label>
                    <input type="text" name='telefone' id='telefone' placeholder='Telefone do cliente(obrigatório)'
                        {...register('telefone', { required: true, minLength: 11 })}
                    />
                    {errors?.telefone?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Telefone necessário!</p>}
                    {errors?.telefone?.type == 'minLength' &&
                        <p className='text-red-500 text-sm'>Mínimo 11 dígitos</p>}
                </div>
                <div className="c_email space-x-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' placeholder='Email do cliente(obrigatório)' {...register('email', {
                        required: true,
                        validate: (value) => validator.isEmail(value)
                    })}
                    />
                    {errors?.email?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Email necessário!</p>}
                    {errors?.email?.type == 'validate' &&
                        <p className='text-red-500 text-sm'>Email inválido!</p>}
                </div>
                <div className="c_cpf space-x-4">
                    <label htmlFor="cpf">Cpf</label>
                    <input type="text" name='cpf' id='cpf' placeholder='Cpf do cliente(opcional)'
                        {...register('cpf')}
                    />
                </div>
                <div className="c_data_nascimento space-x-4">
                    <label htmlFor="data_nascimento">Data de nascimento(obrigatório)</label>
                    <input type="date" name='data_nascimento' id='data_nascimento' placeholder='Sua data de nascimento(obrigatório)' {...register('data_nascimento', { required: true })}
                    />
                    {errors?.data_nascimento?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
                </div>
                <div className="c_observacoes space-x-4">
                    <label htmlFor="observacoes">Observações</label>
                    <input type="text" name='observacoes' id='observacoes' placeholder='Ex: Corte preferido' {...register('observacoes')} />
                </div>
                <div className="botao">
                    <button type='submit' className='py-1 px-2 bg-purple-400 rounded cursor-pointer hover:bg-purple-600 transition duration-300'>Cadastrar cliente</button>
                </div>
            </form>
        </div>
    )
}
