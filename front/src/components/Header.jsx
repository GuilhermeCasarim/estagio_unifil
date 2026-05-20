import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'
import { ChartColumnIncreasing, DollarSign, Home, KeyRound, LogIn, LogOut, NotebookText, Package, Scissors, Star, Users, UserStar } from 'lucide-react'

export const Header = () => {
  const { authState, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  //text black ou slate-100 
  return (
    <div className='flex flex-col text-slate-400
    space-y-2 p-2 h-full'>
      <p className='text-teal-600 flex gap-2'>  <Star /> BelezaGest</p>
      <p className='text-gray-400 flex gap-2'> <KeyRound /> {authState.tipo_login || 'Usuário não logado'}</p>
      {authState.status == false ? (
        <Link className='text-blue-700 flex gap-2 hover:bg-blue-700/50 py-2  rounded-md cursor-pointer hover:text-blue-500/90 transition duration-300' to='/login'> <LogIn /> Login</Link>
      ) : (
        <nav className='navigation flex flex-col space-y-4 [&>*]:transition-all [&>*]:duration-300 
                [&>*:not(.ignore-hover)]:hover:bg-teal-500/10 [&>*:not(.ignore-hover)]:hover:text-slate-200
                 [&>*:not(.ignore-hover)]:cursor-pointer [&>*]:rounded-md [&>*]:py-2'>
          <button
            type='button'
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className='text-blue-700 flex gap-2 ignore-hover hover:bg-blue-700/50 cursor-pointer hover:text-blue-500/90 transition duration-300'
          >
            <LogOut /> Sair
          </button>
          <Link className='flex gap-2' to='/'> <Home /> Início</Link>
          <Link className='flex gap-2' to='/clientes'> <Users /> Clientes</Link>
          <Link className='flex gap-2' to='/agendamentos'> <NotebookText />Agendamentos</Link>
          <Link className='flex gap-2' to='/profissionais'> <UserStar /> Profissionais</Link>
          <Link className='flex gap-2' to='/servicos'> <Scissors /> Serviços</Link>
          <Link className='flex gap-2' to='/produtos'> <Package /> Estoque</Link>
          <Link className='flex gap-2' to='/financeiro'> <DollarSign /> Financeiro</Link>
          <Link className='flex gap-2' to='/relatorios'> <ChartColumnIncreasing /> Relatórios</Link>
          <Link className='flex gap-2' to='/equipe'> <Users /> Equipe</Link>
          <div className='ignore-hover cursor-default'>
            {authState.status && <h1 className='text-xs text-slate-200'>{`Usuário atual: ${authState.login}`}</h1>}
          </div>
        </nav>
      )}
    </div>
  )
}

//authState seria o login, que caso esteja logado aparece as funcoes do sistema, e caso nao esteja logado, precisa fazer para acessar as funcoes do sistema.
