import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { SquarePen, X, Phone, Mail, Calendar, FileText, User } from 'lucide-react'
import { toast } from 'react-toastify';
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
            toast.success('Cliente atualizado com sucesso!')
            console.log(res)
            navigate('/clientes', { state: { refetch: true } })
        })
    }

    const onInvalid = (errors) => {
        // Log para depuração
        console.log("Erros de validação do formulário:", errors);

        // Toast de erro para alertar o usuário sobre campos obrigatórios/inválidos
        toast.error('ERRO. Revise os dados e tente novamente.')
    }

    return (
        <div className='form-edit flex flex-col gap-8 shadow-md p-4 bg-gray-50 max-w-4xl mx-auto mt-10 rounded-lg'>
            <div className="header flex justify-between items-center border-b pb-4">
                <div className="text">
                    <h1 className='flex gap-2 text-2xl font-bold items-center text-gray-800'>
                        <SquarePen className='text-teal-600' /> Editar Cliente
                    </h1>
                    <p className='text-gray-500'>Atualize os dados do cliente</p>
                </div>
                <button
                    className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300'
                    onClick={() => navigate('/clientes')}
                >
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6'>
                <div className="flex flex-col gap-2">
                    <label className='font-semibold flex items-center gap-2'><User size={18} /> Nome</label>
                    <input
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Seu nome'
                        className={`border p-3 rounded-md outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
                        {...register('nome', { required: true })}
                    />
                    {errors?.nome?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Nome necessário!</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Phone size={18} /> Telefone</label>
                        <input
                            type="text"
                            name='telefone'
                            id='telefone'
                            placeholder='Seu telefone'
                            className={`border p-3 rounded-md outline-none ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('telefone', { required: true, minLength: 11 })}
                        />
                        {errors?.telefone?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Telefone necessário!</p>}
                        {errors?.telefone?.type == 'minLength' &&
                            <p className='text-red-500 text-sm'>Mínimo 11 dígitos</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Mail size={18} /> Email</label>
                        <input
                            type="email"
                            name='email'
                            id='email'
                            placeholder='Seu email'
                            className={`border p-3 rounded-md outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
                            {...register('email', {
                                required: true,
                                validate: (value) => validator.isEmail(value)
                            })}
                        />
                        {errors?.email?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Email necessário!</p>}
                        {errors?.email?.type == 'validate' &&
                            <p className='text-red-500 text-sm'>Email inválido!</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><FileText size={18} /> CPF</label>
                        <input
                            type="text"
                            name='cpf'
                            id='cpf'
                            placeholder='Seu CPF (opcional)'
                            className='border p-3 rounded-md border-gray-300 outline-none'
                            {...register('cpf')}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Calendar size={18} /> Data de nascimento</label>
                        <input
                            type="date"
                            name='data_nascimento'
                            id='data_nascimento'
                            className={`border p-3 rounded-md outline-none ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('data_nascimento', { required: true })}
                        />
                        {errors?.data_nascimento?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className='font-semibold flex items-center gap-2'><FileText size={18} /> Observacoes</label>
                    <input
                        type="text"
                        name='observacoes'
                        id='observacoes'
                        placeholder='Ex: Corte preferido'
                        className='border p-3 rounded-md border-gray-300 outline-none'
                        {...register('observacoes')}
                    />
                </div>

                <div className="pt-4">
                    <button
                        type='submit'
                        className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'
                    >
                        Salvar Alteracoes
                    </button>
                </div>
            </form>
        </div>
    )
}
