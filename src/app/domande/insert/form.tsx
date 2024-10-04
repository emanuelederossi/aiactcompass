"use client"

import React, { useEffect, useState } from 'react';
import { DomandaDb } from '../../domande';
import { postDomanda } from '~/server/actions';

export interface DomandaDbForm {
    id: number;
    index: number;
    toolName: string;
    question: string;
    dependencies: { category: string, value: string }[];
    options: { name: string, category?: string, value?: string }[];
    describe: string;
}

export interface DomandaDbDc {
    id?: number;
    index: number;
    toolName: string;
    question: string;
    dependencies: { category: string, value: string[] }[];
    options: { name: string, category?: string, value?: string }[];
    describe: string;
}

interface Action {
    category: string;
    value: string;
}

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
}

interface OptionsDb {
    name: string;
    actions: Action[];
}

const TextInput = ({ name, type, required, handleChange, value }: { name: string, type?: string, required?: boolean, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, value?: string | number }) => {
    return (
        <div className="mb-5">
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
            <input
                value={value}
                onChange={handleChange}
                type={type ?? "text"} id={name} name={name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={required} />
        </div>
    )
}

const TextArea = ({ name, required, handleChange, value }: { name: string, required?: boolean, handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, value?: string }) => {
    return (
        <div className="mb-5">
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
            <textarea
                onChange={handleChange}
                value={value}
                required={required} id={name} name={name} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>
    )
}

const Page = ({ categories }: { categories: CategoryDb[] }) => {
    const [formData, setFormData] = useState<DomandaDbForm>({
        id: 0,
        index: 0,
        toolName: "",
        question: "",
        describe: "",
        dependencies: [] as { category: string, value: string }[],
        options: [] as { name: string; category?: string; value?: string }[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    };


    const handleChangeOptions = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) => {
        const { name, value } = e.target;
        const fuckingname = name as string
        setFormData((prevState) => {
            const options = [...prevState.options];
            const option = options[i];
            if (option && (name in option)) {
                (option as any)[name] = value;
            } else {
                options[i] = { ...option, [fuckingname]: value ?? "" } as { name: string; category?: string, value?: string }
            }
            return { ...prevState, options }
        })
    };
    const handleChangeDependencies = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number) => {
        const { name, value } = e.target;
        const fuckingname = name as string
        setFormData((prevState) => {
            const dependencies = [...prevState.dependencies];
            const dependency = dependencies[i];
            if (dependency && (name in dependency)) {
                (dependency as any)[name] = value;
            } else {
                dependencies[i] = { ...dependency, [fuckingname]: value ?? "" } as { category: string, value: string }
            }
            return { ...prevState, dependencies }
        })
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const filterDep = formData.dependencies.filter((porco) => (porco.category.length && porco.value.length && porco.category !== "none"))
        const newDep = filterDep.map((porco) => ({...porco, value: [porco.value]}))
        
        
        const filterOptions = formData.options
            .filter((porco) => !porco.category || !porco.value);
        const toMapOptions = formData.options
        .filter((porco) => porco.category && porco.value);
        const newOptions: OptionsDb[] = toMapOptions
        .map((porco) => ({
            name: porco.name,
            actions: [{ category: porco.category ?? "", value: `PUSH("${porco.value}")` }]
        }));
        const modifiedFormData:DomandaDbDc = {
            ...formData,
            dependencies: newDep,
            options: [...newOptions, ...filterOptions],
        }
        console.log(formData);
        console.log(modifiedFormData);
        // remove id from modifiedFormData
        delete modifiedFormData.id;
        const result = await postDomanda(modifiedFormData);
        if(result.success){
            setFormData({
                id: 0,
                index: 0,
                toolName: "",
                question: "",
                describe: "",
                dependencies: [],
                options: []
            })
            alert('question added successfully')
            setOptionCount(0)
            setDependenciesCount(0)
        }else{
            console.log(result.error)
            alert('An error occurred')
        }
    }

    const [optionCount, setOptionCount] = useState(0);
    const [dependenciesCount, setDependenciesCount] = useState(0);

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-slate-800 p-5 rounded-2xl">
                <TextInput handleChange={handleChange} value={formData.index} type='number' name="index" required />
                <TextInput handleChange={handleChange} value={formData.toolName} name="toolName" required />
                <TextArea handleChange={handleChange} value={formData.question} name="question" required />
                {/* DEPENDENCIES */}
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dependencies</label>
                <div className="flex gap-3 items-center mb-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            if (dependenciesCount === 0) return
                            setDependenciesCount(optionCount => optionCount - 1)
                            // delete last dependency
                            setFormData((prevState) => {
                                const dependencies = [...prevState.dependencies];
                                dependencies.pop();
                                return { ...prevState, dependencies }
                            })
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">-</button>
                    <p className='text-white'>{dependenciesCount}</p>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setDependenciesCount(optionCount => optionCount + 1)
                            // add new dependency
                            setFormData((prevState) => {
                                const dependencies = [...prevState.dependencies];
                                dependencies.push({ category: 'none', value: 'none' });
                                return { ...prevState, dependencies }
                            })
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+</button>
                </div>
                {
                    Array.from({ length: dependenciesCount }).map((_, i) => (
                        <div key={i} className='mb-7'>
                            <div className="mb-4 p-2 border border-gray-600 rounded-xl">
                                <label htmlFor="countries4" className="mb-2 text-sm font-medium text-gray-900 dark:text-white flex items-center">What is gonna effect
                                    {
                                        formData.dependencies[i]?.category !== 'none' && formData.dependencies[i]?.value !== 'none' ? (
                                            <span className='ms-3'>
                                                <svg className="w-6 h-6 text-gray-900 dark:text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        ) : (
                                            <span className='ms-3'>
                                                <svg className="w-6 h-6 text-gray-900 dark:text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>

                                            </span>
                                        )
                                    }
                                </label>
                                <select
                                    name={`category`}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeDependencies(e, i)}
                                    id="countries4" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {[{ nome: "none" }, ...categories].map((option, i) => (
                                        <option key={i} value={option.nome}>{option.nome}</option>
                                    ))}
                                </select>

                                <label htmlFor="countries5" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What is gonna be added</label>
                                <select
                                    name={`value`}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeDependencies(e, i)}
                                    id="countries5" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="none">select</option>
                                    {categories.find(c => c.nome === formData.dependencies[i]?.category)?.options.map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                    {categories.find(c => c.nome === formData.dependencies[i]?.category)?.options.map((option, i) => (
                                        <option key={i} value={`!${option}`}>{`! ${option}`}</option>
                                    ))}
                                </select>
                            </div>
                            {
                                formData.dependencies[i]?.category && formData.dependencies[i]?.category !== 'none' && formData.dependencies[i]?.value !== 'none' && (
                                    formData.dependencies[i]?.value && formData.dependencies[i]?.value.startsWith('!') ? (
                                        <p className='text-white p-2 rounded-md bg-slate-600'>
                                            This question will be shown ONLY if the user is <span className='uppercase font-bold'>NOT</span> already a <span className='uppercase font-bold'>{formData.dependencies[i]?.value.slice(1)}</span>
                                        </p>
                                    ) : (
                                        <p className='text-white p-2 rounded-md bg-slate-600'>
                                            This question will be shown ONLY if the user is already a <span className='uppercase font-bold'>{formData.dependencies[i]?.value}</span>
                                        </p>
                                    )
                                )
                            }
                        </div>
                    ))
                }


                {/* OPTIONS */}
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Options</label>
                <div className="flex gap-3 items-center mb-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            if (optionCount === 0) return
                            setOptionCount(optionCount => optionCount - 1)
                            // delete last option
                            setFormData((prevState) => {
                                const options = [...prevState.options];
                                options.pop();
                                return { ...prevState, options }
                            })
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">-</button>
                    <p className='text-white'>{optionCount}</p>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setOptionCount(optionCount => optionCount + 1)
                            // add new option
                            setFormData((prevState) => {
                                const options = [...prevState.options];
                                options.push({ name: '' });
                                return { ...prevState, options }
                            })
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">+</button>
                </div>
                {
                    Array.from({ length: optionCount }).map((_, i) => (
                        <div key={i} className='mb-4 p-2 border border-gray-600 rounded-xl'>
                        <div className="mb-4 p-2 border border-gray-600 rounded-xl">
                            <TextInput handleChange={(e) => handleChangeOptions(e, i)} name={`name`} required />
                            <label className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Action
                                {
                                    formData.options[i]?.category && formData.options[i]?.value ? (
                                        <span className='ms-3'>
                                            <svg className="w-6 h-6 text-gray-900 dark:text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    ) : (
                                        <span className="ms-3 rounded-md bg-slate-600 text-white p-2">
                                            no action
                                        </span>
                                    )
                                }
                            </label>
                            <div className="mb-4 p-2 border border-gray-600 rounded-xl">
                                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What is gonna effect</label>
                                <select
                                    name={`category`}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeOptions(e, i)}
                                    id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {[{ nome: "none" }, ...categories].map((option, i) => (
                                        <option key={i} value={option.nome}>{option.nome}</option>
                                    ))}
                                </select>

                                <label htmlFor="countries2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What is gonna be added</label>
                                <select
                                    name={`value`}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeOptions(e, i)}
                                    id="countries2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="">select</option>
                                    {categories.find(c => c.nome === formData.options[i]?.category)?.options.map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            
                        </div>
                        {
                                formData.options[i]?.category && formData.options[i]?.value && (
                                    <p className='text-white p-2 rounded-md bg-slate-600'>
                                        if this option is selected, 
                                        <span className='uppercase font-bold'> {formData.options[i]?.value} </span>
                                        will be <span className='font-bold'>added</span> to the list of <span className='uppercase font-bold'>{formData.options[i]?.category}</span>
                                    </p>
                                )
                            }
                        </div>
                    ))
                }

                <TextArea handleChange={handleChange} value={formData.describe} name="describe" required />

                {/* <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div> */}
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </>
    );
};

export default Page;