import React from 'react'
import { useForm } from 'react-hook-form'
import validator from 'validator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserPlus, X } from 'lucide-react'
import { toast } from 'react-toastify';
import { maskCPF, maskPhone, maskName, validatePastDate } from '../utils/masks.js';

//cadastro/form clientes

export const Clientes = () => {

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
        <div className='form-cadastro flex flex-col gap-8 p-2 bg-gray-50'>
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
                    {/* {errors?.nome?.type == 'pattern' && <p className='text-red-500 text-sm'>O nome não pode conter números ou caracteres especiais</p>} */}
                </div>

                <div className="c_telefone space-x-4">
                    <label htmlFor="telefone">Telefone</label>
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

                <div className="c_email space-x-4">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' placeholder='Email do cliente (obrigatório)' {...register('email', {
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
                    <input type="text" name='cpf' id='cpf' placeholder='Cpf do cliente (opcional)' value={cpfValue || ''}
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

                <div className="c_data_nascimento space-x-4">
                    <label htmlFor="data_nascimento">Data de nascimento (obrigatório)</label>
                    <input type="date" name='data_nascimento' id='data_nascimento' placeholder='Sua data de nascimento (obrigatório)' {...register('data_nascimento', { required: true , validate: validatePastDate})}
                    />
                    {errors?.data_nascimento?.type == 'required' &&
                        <p className='text-red-500 text-sm'>Data de nascimento necessária!</p>}
                    {errors?.data_nascimento?.type == 'validate' &&
                        <p className='text-red-500 text-sm'>Data de nascimento deve ser maior que o dia atual!</p>}
                </div>

                <div className="c_observacoes space-x-4">
                    <label htmlFor="observacoes">Observações</label>
                    <input type="text" name='observacoes' id='observacoes' placeholder='Ex: Corte preferido (opcional)' {...register('observacoes')} />
                </div>
                
                <div className="botao">
                    <button type='submit' className='py-1 px-2 bg-purple-400 rounded cursor-pointer hover:bg-purple-600 transition duration-300'>Cadastrar cliente</button>
                </div>
            </form>
        </div>
    )
}
