import React from 'react'
import Form from './form'
import { getCategories } from '~/server/actions';
import Link from 'next/link';

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
  }

const Page = async() => {
    const categories = await getCategories();
    // ensure categories is of type CategoryDb[]
    const formattedCategories: CategoryDb[] = categories.map(c => ({
        id: c.id,
        nome: c.nome,
        options: c.options as string[]
    }));


  return (
    <div className='bg-slate-700 min-w-full min-h-screen pt-14'>
      <div className="flex gap-5 items-center justify-center w-full mb-7">
            <Link href='/domande' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Go Back
            </Link>
            <h2 className='text-white text-4xl text-center'>New Step</h2>
            </div>
      <Form categories={formattedCategories} />
    </div>
  )
}

export default Page
