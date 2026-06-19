import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { SquarePen, X, Phone, Mail, Calendar, FileText, User } from 'lucide-react'
import { toast } from 'react-toastify';
import { maskCPF, maskPhone, maskName, validatePastDate } from '../utils/masks.js'

export const ClienteEdit = () => {

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    console.log(errors)
    const navigate = useNavigate()
    let { id } = useParams();
    const nomeValue = watch('nome')
    const telefoneValue = watch('telefone')
    const cpfValue = watch('cpf')

    useEffect(() => {
        axios.get(`http://localhost:3001/clientes/byId/${id}`)
            .then((res) => {
                const data = res.data
                if (data.telefone) data.telefone = maskPhone(data.telefone)
                if (data.cpf) data.cpf = maskCPF(data.cpf)
                reset(data); //preenche o forms com os dados dele.
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do cliente:", error);
            });
    }, [id, reset]);

    const onSubmit = (data) => {
        const cleanData = {
            ...data,
            telefone: data.telefone ? data.telefone.replace(/\D/g, '') : '',
            cpf: data.cpf ? data.cpf.replace(/\D/g, '') : ''
        }

        axios.patch(`http://localhost:3001/clientes/update/${id}`, cleanData).then((res) => {
            toast.success('Cliente atualizado com sucesso!')
            console.log(res)
            navigate('/clientes', { state: { refetch: true } })
        })
    }

    const onInvalid = (errors) => {
        console.log("Erros de validação do formulário:", errors);
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
                        value={nomeValue || ''}
                        {...register('nome', { required: true })}
                        onChange={(e) => {
                            const masked = maskName(e.target.value)
                            setValue('nome', masked, { shouldValidate: true, shouldTouch: true })
                        }}
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
                            value={telefoneValue || ''}
                            {...register('telefone', { required: true, minLength: 15, maxLength: 15 })}
                            onChange={(e) => {
                                const masked = maskPhone(e.target.value)
                                setValue('telefone', masked, { shouldValidate: true, shouldTouch: true })
                            }}
                        />
                        {errors?.telefone?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Telefone necessário!</p>}
                        {errors?.telefone?.type == 'minLength' &&
                            <p className='text-red-500 text-sm'>Digite o telefone no formato correto (XX) XXXXX-XXXX</p>}
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
                            value={cpfValue || ''}
                            {...register('cpf', {
                                minLength: cpfValue ? 14 : 0
                            })}
                            onChange={(e) => {
                                const maskedValue = maskCPF(e.target.value)
                                setValue('cpf', maskedValue, { shouldValidate: true, shouldTouch: true })
                            }}
                        />
                        {errors?.cpf?.type == 'minLength' &&
                            <p className='text-red-500 text-sm'>Caso for colocar CPF, digite no formato correto (000.000.000-00)</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Calendar size={18} /> Data de nascimento</label>
                        <input
                            type="date"
                            name='data_nascimento'
                            id='data_nascimento'
                            className={`border p-3 rounded-md outline-none ${errors.data_nascimento ? 'border-red-500' : 'border-gray-300'}`}
                            {...register('data_nascimento', { required: true, validate: validatePastDate })}
                        />
                        {errors?.data_nascimento?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
                        {errors?.data_nascimento?.type == 'validate' &&
                            <p className='text-red-500 text-sm'>Data de nascimento deve ser maior que o dia atual!</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className='font-semibold flex items-center gap-2'><FileText size={18} /> Observações</label>
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
