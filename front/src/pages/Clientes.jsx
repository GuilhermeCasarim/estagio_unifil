import React from 'react'
import { useForm } from 'react-hook-form'

export const Clientes = () => {

    const *methods = useForm();

    const onSubmit = () => {

    }

    return (
        <div>
            <div className="nome">
                <label htmlFor="nome">Nome</label>
                <input type="text" name='nome' id='nome' placeholder='Seu nome(obrigatório)' />
            </div>

            <div className="telefone">
                <label htmlFor="telefone">Telefone</label>
                <input type="text" name='telefone' id='telefone' placeholder='Seu telefone(obrigatório)' />
            </div>

            <div className="email">
                <label htmlFor="email">Email</label>
                <input type="text" name='email' id='email' placeholder='Seu email(obrigatório)' />
            </div>

            <div className="cpf">
                <label htmlFor="cpf">Cpf</label>
                <input type="text" name='cpf' id='cpf' placeholder='Seu cpf(opcional)' />
            </div>

            <div className="data_nascimento">
                <label htmlFor="data_nascimento">Data de nascimento</label>
                <input type="text" name='data_nascimento' id='data_nascimento' placeholder='Sua data de nascimento(obrigatório)' />
            </div>
            <div className="botao">
                <button onClick={onSubmit}>Cadastrar cliente</button>
            </div>
        </div>
    )
}
