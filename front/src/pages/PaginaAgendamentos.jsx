import React from 'react'
import { CalendarCheck, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const PaginaAgendamentos = () => {
    const navigate = useNavigate()

    return (
        <div className='space-y-8'>
            <div className='header border-b-2 border-gray-400 pb-2'>
                <h1 className='flex gap-4 items-center text-2xl font-bold'>
                    <CalendarCheck /> Agendamentos
                </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className='texto'>
                    <p>Gestão de agendamentos</p>
                    <p>Visualize e gerencie os agendamentos do salão</p>
                </div>
                <button
                    className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer flex items-center gap-2'
                    onClick={() => navigate('/agendamento/novo')}
                >
                    <Plus size={18} /> Novo Agendamento
                </button>
            </div>

            <div className='agendamentosData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4 rounded-xl min-h-[120px]'>
                {/* Cards de agendamentos serão exibidos aqui futuramente */}
                <div className='text-gray-500 col-span-full text-center'>Nenhum agendamento cadastrado.</div>
            </div>
        </div>
    )
}
