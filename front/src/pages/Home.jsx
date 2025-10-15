import React from 'react'

export const Home = () => {


    const dataAtual = new Date();
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    const diaSemanaIndex = dataAtual.getDay()
    const diaSemana = semana[diaSemanaIndex]
    const diaAno = dataAtual.getFullYear()
    const dia = dataAtual.getDate()
    const mes = dataAtual.toLocaleDateString('pt-BR', { month: 'long' });
    return (
        <div className='space-y-8'>
            <div className="inicio">
                <h1>Início</h1>
                <p>Bem vindo ao BelezaGest</p>
            </div>
            <div className='dia'>
                <p>Hoje é {diaSemana}, {dia} de {mes} de {diaAno} </p>
                <p>Possui 5 agendamentos hoje</p>
            </div>
            <div className="clientesHoje flex flex-col space-y-4">
                <div className="cliente flex space-x-4">
                    <p>09:00</p>
                    <div className='flex flex-col justify-center space-y-5'>
                        <p>Roberto Carlos</p>
                        <p>Barba | Carlos Gaiva</p>
                    </div>
                    <p className=''>Status: Confirmado</p>

                </div>
                <div className="cliente">
                    <p>09:00</p>
                    <p>Roberto Carlos</p>
                    <p>Status: Confirmado</p>
                    <p>Barba | Carlos Gaiva</p>
                </div>
            </div>
        </div>
    )
}
