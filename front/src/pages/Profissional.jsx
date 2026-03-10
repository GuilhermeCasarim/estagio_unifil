import axios from 'axios';
import { X, Clock, Calendar, Briefcase, Mail, Phone, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// Página Profissional (quando clicado a partir da lista)

export const Profissional = () => {

  let { id } = useParams(); // Pega o id pela URL
  const [profissionalInfo, setProfissionalInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => { 
    // Manda o id para buscar os dados do profissional
    axios.get(`http://localhost:3001/profissionais/byId/${id}`).then((res) => {
      setProfissionalInfo(res.data)
    }).catch(err => {
      console.error("Erro ao buscar profissional", err);
    })
  }, [id])

  return (
    <div className='profissional bg-gray-50 shadow-md mt-12 space-y-4 flex flex-col max-w-4xl mx-auto rounded-lg'>
      
      <div className="header flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <User className="text-teal-600" /> Detalhes do Profissional
        </h2>
        <button 
          className='cursor-pointer rounded-full px-2 py-1 hover:bg-gray-300 transition duration-300' 
          onClick={() => navigate('/profissionais')}
        >
          <X />
        </button>
      </div>

      <div className="info p-6 space-y-6 text-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p className="flex items-center gap-2"><strong>ID:</strong> {profissionalInfo.id}</p>
          <p className="flex items-center gap-2"><strong>Nome:</strong> {profissionalInfo.nome}</p>
          
          <p className="flex items-center gap-2">
            <Phone size={18} className="text-gray-400" /> 
            <strong>Telefone:</strong> {profissionalInfo.telefone}
          </p>
          
          <p className="flex items-center gap-2">
            <Mail size={18} className="text-gray-400" /> 
            <strong>Email:</strong> {profissionalInfo.email}
          </p>

          <p className="flex items-center gap-2">
            <Clock size={18} className="text-teal-600" /> 
            <strong>Horário:</strong> {profissionalInfo.horario_inicio} às {profissionalInfo.horario_fim}
          </p>

          <p className="flex items-center gap-2">
            <Calendar size={18} className="text-teal-600" /> 
            <strong>Dias Ativos:</strong> {profissionalInfo.dias_ativos}
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="flex items-center gap-2">
            <Briefcase size={18} className="text-teal-600" /> 
            <strong>Especialidades:</strong> {profissionalInfo.especialidades}
          </p>
        </div>
      </div>

    </div>
  )
}