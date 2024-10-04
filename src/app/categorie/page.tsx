import Link from 'next/link';
import React from 'react'
import { getCategories } from '~/server/actions';

interface Category {
    id: number;
    nome: string;
    options?: string[];
}

const Page = async () => {
    const categories: Category[] = (await getCategories()).map(category => ({
        ...category,
        options: category.options as string[] | undefined
    }));
    return (
        <div className='bg-slate-700 min-w-full min-h-screen flex flex-col justify-center'>
            <div className="flex gap-5 items-center justify-center w-full mb-7">
                <Link href='/admin' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                    Admin
                </Link>
                <h2 className='text-white text-4xl text-center'>New Step</h2>
                <Link href='/categorie/insert' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                    Add New
                </Link>
            </div>
            <div className='text-white text-4xl mx-auto flex gap-3 w-full overflow-x-scroll'>
                {
                    categories.map((category, index) => (
                        <div key={index} className='bg-slate-800 p-5 rounded-lg'>
                            <h3 className='text-slate-500 text-2xl uppercase'>{category.nome}</h3>
                            <ul className='text-white text-sm'>
                                {
                                    category.options?.map((option, index) => (
                                        <li key={index}>- {option}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Page
