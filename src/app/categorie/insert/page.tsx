import React from 'react'
import Form from './form'

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
  }

const page = async() => {

  return (
    <div>
      <Form/>
    </div>
  )
}

export default page
