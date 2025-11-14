import React from 'react'
//pagina inicio/Home

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
            <div className="inicio border-b-2 border-gray-400">
                <h1>Início</h1>
                <p>Bem vindo ao BelezaGest</p>
            </div>
            <div className='dia'>
                <p>Hoje é {diaSemana}, {dia} de {mes} de {diaAno} </p>
                <p>Possui 2 agendamentos hoje</p>
            </div>
            <div className="clientesHoje flex flex-col space-y-4">

                <div className="cliente flex flex-col space-y-4 bg-blue-300 rounded p-2">
                    <div className='flex justify-center space-x-8'>
                        <p>Roberto Carlos</p>
                        <p>09:00</p>
                        <p className=''>Status: Confirmado</p>
                    </div>
                    <p>Barba | Carlos Gaiva</p>
                </div>

                <div className="cliente flex flex-col space-y-4 bg-blue-300 rounded p-2">
                    <div className='flex justify-center space-x-8'>
                        <p>Roberto Carlos</p>
                        <p>09:00</p>
                        <p className=''>Status: Confirmado</p>
                    </div>
                    <p>Barba | Carlos Gaiva</p>
                </div>

            </div>
        </div>
    )
}
