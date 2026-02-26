import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react';
import axios from 'axios';

export const PaginaProfissionais = () => {

    const navigate = useNavigate();
    const [profissionais, setProfissionais] = useState([]);

    const fetchProfissionais = () => {
        axios.get('http://localhost:3001/profissionais', {
        })
            .then((res) => {
                console.log(res.data);
                setProfissionais(res.data);
            })
    }

    useEffect(() => {
        fetchProfissionais();
    }, [])

    return (
        <div className='space-y-8'>
            <div className="header border-b-2 border-gray-400 pb-2">
                <h1 className='flex gap-4'> <Users /> Profissionais </h1>
            </div>

            <div className='intro flex items-center justify-between'>
                <div className="texto">
                    <p>Gestão de profissionais</p>
                    <p>Pesquise e gerencie informações sobre os profissionais, especialidades e seus horários</p>
                </div>
                <button className='bg-teal-400 text-white px-4 py-1 rounded-full hover:bg-teal-500 transition duration-300 cursor-pointer'
                    onClick={() => navigate('/')}
                >Novo Profissional</button>
            </div>

            <div className="totalProf bg-blue-200 p-2 rounded space-y-4 flex justify-between">
                <div className="clientesPagina">
                    <span className='flex gap-4'><Users /> 5</span>
                    <p>Total de profissionais na página</p>
                </div>
                <div className="clientesTotal">
                    <span className='flex gap-4'><Users /> 5</span>
                    <p>Total de profissionais no salão</p>
                </div>
            </div>

            <div className="searchProf bg-white p-2 space-y-4 rounded flex flex-col">
                <h1 className='flex gap-2'><Search /> Pesquisar Profissionais</h1>
                <p className='text-gray-400'>Busque os profissionais digitando o nome, email ou telefone</p>
                <div className="input flex flex-col gap-2 lg:flex-row items-center ">
                    <input type="text" placeholder='Pesquisar profissional...' className='px-2 py-1 rounded bg-rose-100 outline-0 w-[80%]' />
                    <div className="pages w-[20%] flex flex-col items-center">
                        <p className=''>Página </p>
                        <div className="buttons flex justify-center space-x-4">
                            <button
                                // desabilitar na pagina 1 pra nao ir para a pagina 0 ou crashar
                                className='bg-teal-400 text-white px-3 py-1 rounded hover:bg-teal-500 disabled:bg-gray-400 transition duration-300'
                            >
                                Anterior
                            </button>

                            <button
                                // desabilita se estiver na última página
                                className='bg-teal-400 text-white px-3 py-1 rounded hover:bg-teal-500 disabled:bg-gray-400 transition duration-300'
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="clientesData grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-blue-200 p-4">
                {profissionais.map(profissional => (
                    <div className='profissional'>
                        <p>{profissional.nome}</p>
                        <p>{profissional.telefone}</p>
                        <p>{profissional.email}</p>
                        <p>{profissional.horario_inicio}</p>
                        <p>{profissional.horario_fim}</p>
                        <p>{profissional.dias_ativos}</p>
                        <p>{profissional.especialidades}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
