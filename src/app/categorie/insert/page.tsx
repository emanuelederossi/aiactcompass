import React from 'react'
import Form from './form'
import Link from 'next/link';

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
  }

const page = async() => {

  return (
    <div className='bg-slate-700 min-w-full min-h-screen pt-14'>
      <div className="flex gap-5 items-center justify-center w-full mb-7">
            <Link href='/categorie' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Go Back
            </Link>
            <h2 className='text-white text-4xl text-center'>New Category</h2>
            </div>
      <Form/>
    </div>
  )
}

export default page
