import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

export const Header = () => {
  const { authState, logout } = useContext(AuthContext)

  return (
    <div className='flex flex-col bg-gray-300'>
      <p className='text-teal-600'>BelezaGest</p>
      <p className='text-gray-600'>Tipo de login</p>
      {authState.status == false ? ( //renderiza insta
        <Link className='text-blue-700' to='/login'>Login</Link>
      ) : (
        <div className='flex flex-col'>
          <Link onClick={logout} className='text-blue-700'>Sair</Link>
          <Link className='text-blue-700' to='/'>Início listar clientes</Link>
          <Link className='text-blue-700' to='/clientes'>Agenda</Link>
          <Link className='text-blue-700' to='/clientes'>Clientes cadastrar cliente</Link>
          <Link className='text-blue-700' to='/clientes'>Profissionais</Link>
          <Link className='text-blue-700' to='/clientes'>Serviços</Link>
          <Link className='text-blue-700' to='/clientes'>Estoque</Link>
          <Link className='text-blue-700' to='/clientes'>Financeiro</Link>
          <Link className='text-blue-700' to='/clientes'>Relatórios</Link>
          <div>
            {authState.status && <h1>{`Nome: ${authState.login}`}</h1>}
          </div>
        </div>
      )}
    </div>
  )
}

//authState seria o login, que caso esteja logado aparece as funcoes do sistema, e caso nao esteja logado, precisa fazer para acessar as funcoes do sistema.
