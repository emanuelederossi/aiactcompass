import React from 'react'
import Tiptap from './editor'
import { getCategories } from '~/server/actions'

interface Category {
    id: number;
    nome: string;
    options: string[];
  }

const Page = async() => {
    const categorie = await getCategories()

    const formattedCategorie: Category[] = categorie.map(c => ({
        id: c.id,
        nome: c.nome,
        options: c.options as string[]
    }));


  return (
    <div className='w-full min-h-screen bg-slate-500 p-6'>
      <Tiptap
      formattedCategorie={formattedCategorie}
      />
    </div>
  )
}

export default Page
