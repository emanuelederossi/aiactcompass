"use client"

import React from 'react'
import { deleteDomanda } from '~/server/actions'

const DeleteBtn = ({id}:{id:number}) => {
    const handleDelete = async () => {
        const result = await deleteDomanda(id)
        if(result) {
            alert('Domanda eliminata con successo')
            location.reload()
        } else {
            alert('Errore durante l\'eliminazione della domanda')
        }
    }
    return (
        <button
            onDoubleClick={handleDelete}
            className='text-sm p-2 rounded-lg border border-red-800 hover:bg-red-800/50 text-white font-bold'>
            Delete
        </button>
    )
}

export default DeleteBtn
