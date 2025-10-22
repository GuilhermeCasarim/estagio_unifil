import React from 'react'

export const Agendamento = () => {
  return (
    <div className='flex'>
        <p>Agenda</p>
        <div className="agenda_principal flex justify-between">
            <div className="agenda">
                <h1>Agenda</h1>
                <p>Gerencie agendamentos e horários dos profissionais</p>
            </div>
            <div className="funcoes_agendamento">
                <button>Novo Agendamento</button>
                <button>Registrar agendamento</button>
            </div>
        </div>
    </div>
  )
}
