import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserPlus, X, Phone, Mail, Calendar, FileText, User } from 'lucide-react'
import { toast } from 'react-toastify';
import { maskCPF, maskPhone, maskName, validatePastDate } from '../utils/masks.js';

//cadastro/form clientes

export const ClienteNovo = () => {

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const navigate = useNavigate()
    //os watchs renderizam apos receberem o setValue
    const nomeValue = watch('nome');
    const telefoneValue = watch('telefone');
    const cpfValue = watch('cpf');
    // faz replace no telefone e cpf pra remover a formatacao e enviar apenas string pro banco
    const onSubmit = (data) => {
        const cleanData = {
            ...data,
            telefone: data.telefone ? data.telefone.replace(/\D/g, '') : '',
            cpf: data.cpf ? data.cpf.replace(/\D/g, '') : '',
        };
        axios.post('http://localhost:3001/clientes', cleanData).then((res) => {
            toast.success('Cliente cadastrado com sucesso!')
            console.log(res)
            navigate('/clientes', { state: { refetch: true } })
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
        <div className='flex flex-col gap-8 p-4 bg-gray-50 min-h-screen'>
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className='flex gap-2 text-2xl font-bold items-center'>
                    <UserPlus className='text-teal-600' /> Novo Cliente
                </h1>
                <button onClick={() => navigate('/clientes')} className='p-2 hover:bg-gray-100 rounded-full'>
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
                <div className="flex flex-col gap-2">
                    <label className='font-semibold flex items-center gap-2'><User size={18} /> Nome</label>
                    <input
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Nome do cliente'
                        className={`border p-3 rounded-md outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
                        value={nomeValue || ''}
                        {...register('nome', {
                            required: true,
                        })}
                        onChange={(e) => {
                            const masked = maskName(e.target.value);
                            setValue("nome", masked, { shouldValidate: true, shouldTouch: true });
                        }}
                    />
                    {errors?.nome?.type == 'required' && <p className='text-red-500 text-sm'>Nome obrigatório!</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Phone size={18} /> Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            id="telefone"
                            placeholder="Telefone do cliente"
                            className={`border p-3 rounded-md outline-none ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                            {...register("telefone", {
                                required: true,
                                minLength: 15,
                                maxLength: 15,
                            })}
                            value={telefoneValue || ""}
                            onChange={(e) => {
                                const masked = maskPhone(e.target.value);
                                setValue("telefone", masked, { shouldValidate: true, shouldTouch: true });
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
                            placeholder='Email do cliente'
                            className={`border p-3 rounded-md outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
                            {...register('email', {
                                required: true,
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
                            placeholder='Cpf do cliente (opcional)'
                            className='border p-3 rounded-md border-gray-300 outline-none'
                            value={cpfValue || ''}
                            {...register("cpf", {
                                required: false,
                                minLength: cpfValue ? 14 : 0,
                            })}
                            onChange={(e) => {
                                const maskedValue = maskCPF(e.target.value);
                                setValue('cpf', maskedValue, { shouldValidate: true, shouldTouch: true });
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
                    <label className='font-semibold flex items-center gap-2'><FileText size={18} /> Observacoes</label>
                    <input
                        type="text"
                        name='observacoes'
                        id='observacoes'
                        placeholder='Ex: Corte preferido (opcional)'
                        className='border p-3 rounded-md border-gray-300 outline-none'
                        {...register('observacoes')}
                    />
                </div>

                <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
                    CADASTRAR CLIENTE
                </button>
            </form>
        </div>
    )
}
