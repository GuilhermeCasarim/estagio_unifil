import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserPlus, X, Clock, Calendar, Briefcase } from 'lucide-react'
import { toast } from 'react-toastify'
import { maskPhone, maskName, validateTimeRange } from '../utils/masks.js'

export const ProfissionalNovo = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm();

    const navigate = useNavigate();
    const nomeValue = watch('nome');
    const telefoneValue = watch('telefone');
    const horarioInicio = watch('horario_inicio');

    const onSubmit = (data) => {
        const cleanData = {
            ...data,
            telefone: data.telefone.replace(/\D/g, '')
        };

        axios.post('http://localhost:3001/profissionais', cleanData)
            .then(() => {
                toast.success('Profissional cadastrado com sucesso!');
                navigate('/profissionais');
            })
            .catch((err) => {
                console.error(err);
                toast.error('Erro ao cadastrar profissional.');
            });
    };

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
                    <UserPlus className='text-teal-600' /> Novo Profissional
                </h1>
                <button onClick={() => navigate(-1)} className='p-2 hover:bg-gray-100 rounded-full'>
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6 max-w-4xl bg-white p-8 rounded-lg shadow-sm mx-auto w-full'>
                <div className="flex flex-col gap-2">
                    <label className='font-semibold'>Nome Completo</label>
                    <input
                        type="text"
                        name='nome'
                        id='nome'
                        placeholder='Nome do cliente (obrigatório)'
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
                        <label className='font-semibold'>Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            id="telefone"
                            placeholder="Telefone do cliente (obrigatório)"
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
                        <label className='font-semibold'>Email</label>
                        <input type="email" name='email' id='email' placeholder='Email do cliente (obrigatório)' {...register('email', {
                            required: true,

                        })}
                        />
                        {errors?.email?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Email necessário!</p>}
                        {errors?.email?.type == 'validate' &&
                            <p className='text-red-500 text-sm'>Email inválido!</p>}
                    </div>
                </div>

                <div className="bg-teal-50 p-6 rounded-lg border border-teal-100 grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-medium flex items-center gap-1'><Clock size={16} /> Início</label>
                        <input className='border p-3 rounded' type="time" {...register('horario_inicio', { required: true })} />
                        {errors?.horario_inicio?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Horário necessário!</p>}

                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-medium flex items-center gap-1'><Clock size={16} /> Fim</label>
                        <input
                            className={`border p-3 rounded ${errors.horario_fim ? 'border-red-500' : 'border-gray-300'}`}
                            type="time"
                            {...register('horario_fim', {
                                required: true,
                                validate: (v) => validateTimeRange(horarioInicio, v)
                            })}
                        />
                        {errors?.horario_fim?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Horário necessário!</p>}
                            {errors?.horario_fim?.type == 'validate' &&
                            <p className='text-red-500 text-sm'>O horário inicial deve ser anterior ao final!</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold'>Dias Ativos</label>
                        <input className='border p-3 rounded' placeholder='Seg a Sex' {...register('dias_ativos', { required: true })} />
                        {errors?.dias_ativos?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Dias ativos necessário!</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold'>Especialidades</label>
                        <input className='border p-3 rounded' placeholder='Corte, Barba' {...register('especialidades', { required: true })} />
                        {errors?.especialidades?.type == 'required' &&
                            <p className='text-red-500 text-sm'>Especialidades necessário!</p>}
                    </div>
                </div>

                <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition duration-300 cursor-pointer'>
                    CADASTRAR PROFISSIONAL
                </button>
            </form>
        </div>
    );
};