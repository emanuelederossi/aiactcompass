import React from 'react'
import { getDomande } from '~/server/actions';
import { DomandaDb } from '../domande';
import Link from 'next/link';
import DeleteButton from './deleteBtn';

interface Action {
    category: string;
    value: string;
}

const Page = async () => {
    const domande = await getDomande();
    const formattedDomande: DomandaDb[] = domande.map(d => ({
        ...d,
        dependencies: d.dependencies as { category: string; value: string[]; }[],
        options: d.options as { name: string; actions?: Action[] | undefined; }[]
    }));
    const maxChar = (str: string, max: number) => str.length > max ? str.slice(0, max) + '...' : str;
    return (
        <div className='bg-slate-700 min-w-full min-h-screen flex flex-col justify-center p-7'>
            <div className="flex gap-5 items-center justify-center w-full mb-7">
            <Link href='/admin' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Admin
            </Link>
            <h2 className='text-white text-4xl text-center'>Steps</h2>
            <Link href='/domande/insert' className='text-sm p-2 rounded-lg border border-blue-500 hover:bg-blue-600/50 text-white font-bold'>
                Add new
            </Link>
            </div>
            <div className='text-white text-4xl mx-auto flex w-full flex-wrap'>
                {
                    formattedDomande.map((domanda, index) => (
                        <div key={index} className='w-1/2 p-3'>
                            <div className='bg-slate-800 p-5 rounded-lg w-full'>
                                <div className='flex gap-5 justify-start items-end pb-3'>                                    
                                    <h3 className='text-slate-400 underline text-2xl font-bold'><span className='text-white'>{domanda.index}.</span> {domanda.toolName}</h3>
                                    <Link href={`/domande/${domanda.id}`} className='text-sm p-2 rounded-lg border border-blue-800 hover:bg-blue-800/50 text-white font-bold'>
                                        Edit
                                    </Link>
                                    <DeleteButton id={domanda.id} />
                                </div>
                            <h4 className='text-slate-500 text-lg font-mono'>question</h4>                            
                            <div className='p-3 mb-5 rounded-lg bg-slate-700/50 text-sm  '>
                                {domanda.question}
                            </div>
                            <h4 className='text-slate-500 text-lg font-mono'>options</h4>
                            <div className='text-white text-sm font-normal   p-5 mb-5 rounded-lg bg-slate-700/50'>
                                {
                                        domanda.options.map((option, index) => (
                                            <div key={index}>
                                                <div
                                                    className=''
                                                >{index+1}. {option.name}</div>
                                                {
                                                        option.actions?.map((action, index) => (
                                                            <div key={index} className='text-xs text-slate-300 mb-1 ms-5 p-1'>
                                                                <span className='p-1 rounded-md border border-green-900 text-green-600 font-bold'>{action.category}</span>
                                                                <span className='p-1 rounded-md border border-blue-900 text-blue-800 font-bold ms-2'>{action.value}</span>
                                                            </div>
                                                        ))
                                                    
                                                }
                                            </div>
                                        ))                                    
                                }
                            </div>
                            <h4 className='text-slate-500 text-lg font-mono'>describe options</h4>
                            <div className='p-3 mb-5 rounded-lg bg-slate-700/50 text-sm '>
                                {maxChar(domanda.describe, 300)}
                            </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Page
