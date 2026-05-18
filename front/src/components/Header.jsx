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
      <p className='text-gray-400 flex gap-2'> <KeyRound /> {authState.tipo_login}</p>
      {authState.status == false ? ( //renderiza insta
        <Link className='text-blue-700 flex gap-2' to='/login'> <LogIn /> Login</Link>
      ) : (
        <nav className='navigation flex flex-col space-y-4'>
          <button
            type='button'
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className='text-blue-700 flex gap-2'
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
          <div>
            {authState.status && <h1>{`Usuário atual: ${authState.login}`}</h1>}
          </div>
        </nav>
      )}
    </div>
  )
}

//authState seria o login, que caso esteja logado aparece as funcoes do sistema, e caso nao esteja logado, precisa fazer para acessar as funcoes do sistema.
