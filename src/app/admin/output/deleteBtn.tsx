"use client"

import { deleteOutput } from "~/server/actions"

const DeleteBtn = ({
    id
}: {
    id: number

}) => {

    const handleDelete = async () => {
        const res = await deleteOutput(id)
        if(res.success) {
            location.reload()
        }
    }

  return (
    <button
    className='bg-red-500 p-2 rounded-lg text-white hover:bg-red-600'
    onClick={handleDelete}
    >
        delete
    </button>
  )
}

export default DeleteBtn
