import React from 'react'
import Tiptap from './editor'
import { getCategories, getOutput } from '~/server/actions'

interface Category {
    id: number;
    nome: string;
    options: string[];
  }

  interface Output {
    id: number;
    title: string;
    content: string;
    categories: {
        id: number;
        options: {
            name: string;
            value: boolean;
        }[]
    }[]
}


const Page = async({ params }: { params: { id: string } }) => {
    const output = await getOutput(Number(params.id));
    const categorie = await getCategories()

    const formattedCategorie: Category[] = categorie.map(c => ({
        id: c.id,
        nome: c.nome,
        options: c.options as string[]
    }));

    if(!output) return <div>Output non trovato</div>

    const formattedOutput: Output = {
        id: output.id,
        title: output.title,
        content: output.content,
        categories: output.categories as { id: number; options: { name: string; value: boolean; }[] }[]
    }


  return (
    <div className='w-full min-h-screen bg-slate-500 p-6'>
      <Tiptap
      formattedCategorie={formattedCategorie}
        formattedOutput={formattedOutput}
      />
    </div>
  )
}

export default Page
