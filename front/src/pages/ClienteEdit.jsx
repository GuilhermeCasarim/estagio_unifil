import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
//edicao/form clientes edit

export const ClienteEdit = () => { 

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    console.log(errors)
    const navigate = useNavigate()
    let { id } = useParams(); //pega id pela url com o clique do usenavigate

    useEffect(() => {
        //busca dados do cliente editado para preencher o form atual
        axios.get(`http://localhost:3001/clientes/byId/${id}`)
            .then((res) => {
                reset(res.data); //preenche o forms com os dados dele.
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do cliente:", error);
            });
    }, [id, reset]);

    const onSubmit = (data) => {
        axios.patch(`http://localhost:3001/clientes/update/${id}`, data).then((res) => {
            console.log(res)
            navigate('/clientes/lista', { state: { refetch: true } })
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-8 p-2'>
            <h1>Formulario de edição de cliente</h1>
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
                <input type="date" name='data_nascimento' id='data_nascimento' placeholder='Sua data de nascimento(obrigatório)' {...register('data_nascimento', { required: true })}
                />
                {errors?.data_nascimento?.type == 'required' &&
                    <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
            </div>
            <div className="observacoes space-x-4">
                <label htmlFor="observacoes">Observações</label>
                <input type="text" name='observacoes' id='observacoes' placeholder='Ex: Corte preferido' {...register('observacoes')} />
            </div>
            <div className="botao">
                <button type='submit' className='py-1 px-2 bg-purple-400 rounded cursor-pointer hover:bg-purple-600 transition duration-300'>Finalizar edição de cliente</button>
            </div>
        </form>
    )
}
