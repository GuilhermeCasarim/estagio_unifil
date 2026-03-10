import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { SquarePen, X, Clock, Calendar, Briefcase } from 'lucide-react'
import { toast } from 'react-toastify'
import { maskPhone, maskName, validateTimeRange } from '../utils/masks.js'

export const ProfissionalEdit = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset, 
        setValue, 
        watch 
    } = useForm();
    
    const navigate = useNavigate();
    let { id } = useParams();

    // Observa os valores para máscaras e validações
    const nomeValue = watch('nome');
    const telefoneValue = watch('telefone');
    const horarioInicio = watch('horario_inicio');

    useEffect(() => {
        // Busca dados do profissional para preencher o formulário
        axios.get(`http://localhost:3001/profissionais/byId/${id}`)
            .then((res) => {
                // Aplica a máscara no telefone que vem do banco (sem máscara) antes de resetar o form
                const data = res.data;
                if (data.telefone) data.telefone = maskPhone(data.telefone);
                reset(data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do profissional:", error);
                toast.error("Erro ao carregar dados.");
            });
    }, [id, reset]);

    const handleNameChange = (e) => {
        setValue('nome', maskName(e.target.value), { shouldValidate: true });
    };

    const handlePhoneChange = (e) => {
        setValue('telefone', maskPhone(e.target.value), { shouldValidate: true });
    };

    const onSubmit = (data) => {
        const payload = {
            ...data,
            telefone: data.telefone.replace(/\D/g, '') // Remove máscara antes de enviar
        };

        axios.patch(`http://localhost:3001/profissionais/update/${id}`, payload)
            .then(() => {
                toast.success('Profissional atualizado com sucesso!');
                navigate('/profissionais', { state: { refetch: true } });
            })
            .catch((err) => {
                console.error(err);
                toast.error('Erro ao atualizar profissional.');
            });
    };

    const onInvalid = () => {
        toast.error('Revise os dados e tente novamente.');
    };

    return (
        <div className='form-edit flex flex-col gap-8 shadow-md p-4 bg-gray-50 max-w-4xl mx-auto mt-10 rounded-lg'>
            <div className="header flex justify-between items-center border-b pb-4">
                <div className="text">
                    <h1 className='flex gap-2 text-2xl font-bold items-center text-gray-800'> 
                        <SquarePen className='text-teal-600' /> Editar Profissional
                    </h1>
                    <p className='text-gray-500'>Atualize as informações de jornada e especialidades</p>
                </div>
                <button 
                    className='cursor-pointer hover:bg-gray-200 rounded-full p-2 transition duration-300' 
                    onClick={() => navigate('/profissionais')}
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className='flex flex-col space-y-6'>
                {/* Nome */}
                <div className="flex flex-col gap-2">
                    <label className='font-semibold'>Nome</label>
                    <input 
                        type="text" 
                        className={`border p-3 rounded-md outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'}`}
                        value={nomeValue || ''}
                        onChange={handleNameChange}
                        {...register('nome', { required: 'Nome obrigatório' })}
                    />
                    {errors.nome && <p className='text-red-500 text-sm'>{errors.nome.message}</p>}
                </div>

                {/* Telefone e Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold'>Telefone</label>
                        <input 
                            type="text" 
                            className={`border p-3 rounded-md outline-none ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                            value={telefoneValue || ''}
                            onChange={handlePhoneChange}
                            {...register('telefone', { required: true, minLength: 15 })}
                        />
                        {errors.telefone && <p className='text-red-500 text-sm'>Telefone inválido</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className='font-semibold'>Email</label>
                        <input 
                            type="email" 
                            className='border p-3 rounded-md border-gray-300 outline-none focus:border-teal-500'
                            {...register('email', { required: true })}
                        />
                    </div>
                </div>

                {/* Horários */}
                <div className="bg-teal-50 p-6 rounded-lg grid grid-cols-2 gap-6 border border-teal-100">
                    <div className="flex flex-col gap-2">
                        <label className='font-medium flex items-center gap-1'><Clock size={16}/> Início</label>
                        <input 
                            className='border p-3 rounded-md border-gray-300' 
                            type="time" 
                            {...register('horario_inicio', { required: true })} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-medium flex items-center gap-1'><Clock size={16}/> Fim</label>
                        <input 
                            className={`border p-3 rounded-md ${errors.horario_fim ? 'border-red-500' : 'border-gray-300'}`} 
                            type="time" 
                            {...register('horario_fim', { 
                                required: true,
                                validate: (v) => validateTimeRange(horarioInicio, v)
                            })} 
                        />
                        {errors.horario_fim && <p className='text-red-500 text-sm'>{errors.horario_fim.message}</p>}
                    </div>
                </div>

                {/* Dias e Especialidade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Calendar size={18}/> Dias Ativos</label>
                        <input 
                            className='border p-3 rounded-md border-gray-300' 
                            placeholder='Seg a Sex'
                            {...register('dias_ativos', { required: true })} 
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className='font-semibold flex items-center gap-2'><Briefcase size={18}/> Especialidades</label>
                        <input 
                            className='border p-3 rounded-md border-gray-300' 
                            placeholder='Corte, Barba'
                            {...register('especialidades', { required: true })} 
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button type='submit' className='w-full py-4 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 transition shadow-md uppercase tracking-wider cursor-pointer duration-300'>
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    )
}