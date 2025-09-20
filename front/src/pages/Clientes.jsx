import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const Clientes = () => { //cadastro/form clientes

    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log(errors)
    const navigate = useNavigate()

    const onSubmit = (data) => {
        axios.post('http://localhost:3001/clientes', data).then((res) => {
            console.log('funcionou')
            console.log(res)
            navigate('/')
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-8 p-2'>
            <h1>Formulário para cadastro de cliente</h1>
            <div className="nome space-x-4">
                <label htmlFor="nome">Nome</label>
                <input type="text" name='nome' id='nome' placeholder='Seu nome(obrigatório)'
                    {...register('nome', { required: true })}
                />
                {errors?.nome?.type == 'required' &&
                    <p className='text-red-500 text-sm'>Nome necessário!</p>}
            </div>

            <div className="telefone space-x-4">
                <label htmlFor="telefone">Telefone</label>
                <input type="text" name='telefone' id='telefone' placeholder='Seu telefone(obrigatório)'
                    {...register('telefone', { required: true, minLength: 11 })}
                />
                {errors?.telefone?.type == 'required' &&
                    <p className='text-red-500 text-sm'>Telefone necessário!</p>}
                {errors?.telefone?.type == 'minLength' &&
                    <p className='text-red-500 text-sm'>Mínimo 11 dígitos</p>}
            </div>

            <div className="email space-x-4">
                <label htmlFor="email">Email</label>
                <input type="email" name='email' id='email' placeholder='Seu email(obrigatório)' {...register('email', {
                    required: true,
                    validate: (value) => validator.isEmail(value)
                })}
                />
                {errors?.email?.type == 'required' &&
                    <p className='text-red-500 text-sm'>Email necessário!</p>}
                {errors?.email?.type == 'validate' &&
                    <p className='text-red-500 text-sm'>Email inválido!</p>}
            </div>

            <div className="cpf space-x-4">
                <label htmlFor="cpf">Cpf</label>
                <input type="text" name='cpf' id='cpf' placeholder='Seu cpf(opcional)'
                    {...register('cpf')}
                />
            </div>

            <div className="data_nascimento space-x-4">
                <label htmlFor="data_nascimento">Data de nascimento</label>
                <input type="text" name='data_nascimento' id='data_nascimento' placeholder='Sua data de nascimento(obrigatório)' {...register('data_nascimento', { required: true })}
                />
                {errors?.data_nascimento?.type == 'required' &&
                    <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
            </div>
            <div className="observacoes space-x-4">
                <label htmlFor="observacoes">Observações</label>
                <input type="text" name='observacoes' id='observacoes' placeholder='Ex: Corte preferido' {...register('observacoes')} />
            </div>
            <div className="botao">
                <button type='submit' className='py-1 px-2 bg-purple-400 rounded cursor-pointer hover:bg-purple-600 transition duration-300'>Cadastrar cliente</button>
            </div>
        </form>
    )
}
