import React from 'react'
import { Book } from 'lucide-react';


export const PaginaAgendamentos = () => {
    return (
        <div className='space-y-8'>
            <div className="header border-b-2 border-gray-400 pb-2">
                <h1 className='flex gap-4'> <Book /> Agendamentos </h1>
            </div>

            <div className="agenda_principal flex justify-between items-center">
                <div className="agenda flex flex-col gap-4">
                    <h1>Agendamento de serviços</h1>
                    <p>Gerencie agendamentos e horários dos profissionais</p>
                    <div className="totalClientes bg-blue-200 p-2 rounded space-y-4 flex justify-between">
                        <div className="clientesPagina">
                            <span className='flex gap-4'><Book /> 2</span>
                            <p>Total de agendamentos hoje:</p>
                        </div>

                    </div>
                </div>

                <div className="funcoes_agendamento flex flex-col gap-8">
                    <button className="bg-purple-600 text-white p-2 rounded cursor-pointer hover:bg-purple-800 transition duration-300">Novo Agendamento</button>
                    <button className='bg-green-600 text-white p-2 rounded cursor-pointer hover:bg-green-800 transition duration-300'>Registrar atendimento</button>
                </div>
            </div>
        </div>
    )
}
