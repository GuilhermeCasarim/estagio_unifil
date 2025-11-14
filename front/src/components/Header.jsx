import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'
import { ChartColumnIncreasing, DollarSign, Home, KeyRound, LogIn, LogOut, NotebookText, Package, Scissors, Star, Users, UserStar } from 'lucide-react'

export const Header = () => {
  const { authState, logout } = useContext(AuthContext)

  return (
    <div className='flex flex-col bg-white text-black space-y-2'>
      <p className='text-teal-600 flex gap-2'>  <Star /> BelezaGest</p>
      <p className='text-gray-400 flex gap-2'> <KeyRound /> Tipo de login</p>
      {authState.status == false ? ( //renderiza insta
        <Link className='text-blue-700 flex gap-2' to='/login'> <LogIn /> Login</Link>
      ) : (
        <nav className='navigation flex flex-col space-y-4'>
          <Link onClick={logout} className='text-blue-700 flex gap-2'> <LogOut /> Sair</Link>
          <Link className='flex gap-2' to='/'> <Home size={24} /> Início</Link>
          <Link className='flex gap-2' to='/clientes/lista'> <Users /> Clientes</Link>
          <Link className='flex gap-2' to='/agendamento'> <NotebookText />Agenda</Link>
          {/* <Link className='flex gap-2' to='/clientes'> <Scissors /> Cadastrar cliente</Link> */}
          <Link className='flex gap-2' to='/clientes'> <UserStar /> Profissionais</Link>
          <Link className='flex gap-2' to='/clientes'> <Scissors /> Serviços</Link>
          <Link className='flex gap-2' to='/clientes'> <Package /> Estoque</Link>
          <Link className='flex gap-2' to='/clientes'> <DollarSign /> Financeiro</Link>
          <Link className='flex gap-2' to='/clientes'> <ChartColumnIncreasing /> Relatórios</Link>
          <div>
            {authState.status && <h1>{`Usuário atual: ${authState.login}`}</h1>}
          </div>
        </nav>
      )}
    </div>
  )
}

//authState seria o login, que caso esteja logado aparece as funcoes do sistema, e caso nao esteja logado, precisa fazer para acessar as funcoes do sistema.
