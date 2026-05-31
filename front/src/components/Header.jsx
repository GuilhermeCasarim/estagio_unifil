import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'
import { ChartColumnIncreasing, DollarSign, Home, KeyRound, LogIn, LogOut, NotebookText, Package, Scissors, Star, Users, UserStar } from 'lucide-react'

export const Header = () => {
  const { authState, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const tipoUsuario = authState.tipo_login

  const menuItems = [
    { nome: 'Início', rota: '/', icone: Home, permissao: ['administrador', 'secretaria', 'profissional'] },
    { nome: 'Clientes', rota: '/clientes', icone: Users, permissao: ['administrador', 'secretaria'] },
    { nome: 'Agendamentos', rota: '/agendamentos', icone: NotebookText, permissao: ['administrador', 'secretaria', 'profissional'] },
    { nome: 'Profissionais', rota: '/profissionais', icone: UserStar, permissao: ['administrador'] },
    { nome: 'Serviços', rota: '/servicos', icone: Scissors, permissao: ['administrador'] },
    { nome: 'Estoque', rota: '/produtos', icone: Package, permissao: ['administrador'] },
    { nome: 'Financeiro', rota: '/financeiro', icone: DollarSign, permissao: ['administrador'] },
    { nome: 'Relatórios', rota: '/relatorios', icone: ChartColumnIncreasing, permissao: ['administrador'] },
    { nome: 'Equipe', rota: '/equipe', icone: Users, permissao: ['administrador'] },
  ]
  //text black ou slate-100 
  return (
    <div className='flex flex-col text-slate-400
    space-y-2 p-2 h-full'>
      <p className='text-teal-600 flex gap-2'>  <Star /> BelezaGest</p>
      <p className='text-gray-400 flex gap-2'> <KeyRound /> {authState.tipo_login || 'Usuário não logado'}</p>
      {authState.status == false ? (
        <Link className='text-blue-700 flex gap-2 hover:bg-blue-700/50 py-2  rounded-md cursor-pointer hover:text-blue-500/90 transition duration-300' to='/login'> <LogIn /> Login</Link>
      ) : (
        <nav className='navigation flex flex-col space-y-4 *:transition-all *:duration-300 
          [&>*:not(.ignore-hover)]:hover:bg-teal-500/10 [&>*:not(.ignore-hover)]:hover:text-slate-200
           [&>*:not(.ignore-hover)]:cursor-pointer *:rounded-md *:py-2'>
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
          {menuItems
            .filter((item) => item.permissao.includes(tipoUsuario))
            .map((item) => {
              const Icone = item.icone

              return (
                <Link className='flex gap-2' to={item.rota} key={item.rota}>
                  <Icone /> {item.nome}
                </Link>
              )
            })}
          <div className='ignore-hover cursor-default'>
            {authState.status && <h1 className='text-xs text-slate-200'>{`Usuário atual: ${authState.login}`}</h1>}
          </div>
        </nav>
      )}
    </div>
  )
}

//authState seria o login, que caso esteja logado aparece as funcoes do sistema, e caso nao esteja logado, precisa fazer para acessar as funcoes do sistema.
