import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const Cliente = () => { //pagina crud cliente

  let { id } = useParams(); //pega id pela url com o clique do usenavigate
  const [clienteInfo, setClienteInfo] = useState([]);


  useEffect(() => { //manda o id pra pegar o cliente
    axios.get(`http://localhost:3001/clientes/byId/${id}`).then((res) => { //
      setClienteInfo(res.data)
    })
  }, [])

  return (
    <div>
      <p>{clienteInfo.nome}</p>
    </div>
  )
}
