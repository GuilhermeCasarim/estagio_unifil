import React from 'react'
import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'
import { Mail, Phone, Search, SquarePen, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'

export const ListaProfissionais = () => {

    const navigate = useNavigate();


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
                >Novo Cliente</button>
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
                <div className='profissional'>
                    <p>nome</p>
                    <p>email</p>
                    <p>telefone</p>
                    <p>horario</p>
                </div>
                <div className='profissional'>
                    <p>Ana costa</p>
                    <p>ana.costa@email.com</p>
                    <p>(11) 99999-9999</p>
                    <p>08:00 às 18:00</p>
                </div>
            </div>
        </div>
    )
}
