import React from 'react'
import { Link } from 'react-router-dom'

export const Error = () => {
    return ( //precisa arrumar para id inexistente
        <div>
            <p>Endereço errado ou não existente</p>
            <Link to={'/'}>Voltar para página inicial</Link>
        </div>
    )
}
