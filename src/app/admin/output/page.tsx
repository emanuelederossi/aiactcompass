import Link from 'next/link';
import './style.css'
import React from 'react'
import { deleteOutput, getCategories, getOutputs } from '~/server/actions';
import DeleteBtn from './deleteBtn';

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

const Outputs = async() => {
    const outputs = await getOutputs()
    const categories = await getCategories()
    const formattedOutputs: Output[] = outputs.map(o => ({
        id: o.id,
        title: o.title,
        content: o.content,
        categories: o.categories as {
            id: number;
            options: {
                name: string;
                value: boolean;
            }[]
        }[]
    }))

    const handleDelete = async(id: number) => {
        const res = await deleteOutput(id)
        if(res.success) {
            location.reload()
        }
    }

  return (
    <div
    className='w-full min-h-screen bg-slate-500 p-6'
    >
         <div className="flex gap-5 items-center justify-center w-full mb-7">
            <Link href='/admin' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Admin
            </Link>
            <h2 className='text-white text-4xl text-center'>New Step</h2>
            <Link href='/admin/output/insert' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Add New
            </Link>
        </div>
        {formattedOutputs.map(output => (
            <div 
            className='bg-slate-400 p-6 rounded-lg mb-5'
            key={output.title}>
                <div className="flex gap-3 mb-5">
                <h1
                className='text-2xl font-bold p-2 rounded-lg bg-slate-300 w-fit me-14'
                >{output.title}</h1>
                {
                    output.categories.map(category => (
                        category.options.some(option => option.value) &&
                        <div
                        key={category.id}
                        className='bg-slate-300 rounded-lg flex items-center'
                        >
                                <p className='font-bold ms-2'>
                                    {
                                    categories.find(c => c.id === category.id)?.nome
                                    } 
                                </p>                   
                            {category.options.map(option => (
                                option.value &&
                                <div
                                key={option.name}
                                className='bg-slate-400 p-2 rounded-lg m-2 flex justify-center items-center gap-2'
                                >                 
                                    <p>{option.name}</p>
                                </div>
                            ))}
                        </div>
                    ))
                }
                </div>
                <div 
                className='tiptap'
                dangerouslySetInnerHTML={{__html: output.content}} />
                <div                 
                className="w-full flex justify-end">
                    <DeleteBtn 
                    id={output.id}
                    />
                </div>
            </div>
        ))}
    </div>
  )
}

export default Outputs
