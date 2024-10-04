"use client";

import React, { useState } from 'react'
import { set } from 'zod';
import { postCategory } from '~/server/actions';

interface CategoryDb {
  nome: string;
  options: string[];
}

const TextInput = ({ name, type, required, handleChange, onKeyDown, value }: { name: string, type?: string, required?: boolean, handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void, value?: string}) => {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{name}</label>
      <input
        value={value}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        type={type ?? "text"} id={name} name={name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={required} />
    </div>
  )
}

const form = () => {
  const [formData, setFormData] = useState<CategoryDb>({
    nome: '',
    options: []
  })
  const [optionInput, setOptionInput] = useState('')

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, nome: e.target.value })
  }

  const handleChangeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionInput(e.target.value)
  }

  const handleOptionsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    setFormData(prev => ({ ...prev, options: [...prev.options, optionInput] }))
    setOptionInput('')
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = await postCategory(formData)
    if(result.success){
      setFormData({ nome: '', options: [] })
      setOptionInput('')
      alert('Category added successfully')
    }else{
      alert('An error occurred')
    }
  }

  return (
    <form 
    onSubmit={handleSubmit}
    className='max-w-lg mx-auto bg-slate-800 p-5 rounded-2xl'>
      <TextInput handleChange={handleChangeName} value={formData.nome} name="nome" required/>
      <TextInput onKeyDown={handleOptionsChange} handleChange={handleChangeOption} value={optionInput} name="opzioni" />
      <div className="flex flex-wrap gap-3">
        {formData.options.map((option, index) => (
          <div key={index} className="bg-gray-100 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white flex items-center">
            {option}
            <span className='ms-3'
            onClick={() => setFormData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }))}
            >
            <svg className="cursor-pointer w-6 h-6 text-gray-900 dark:text-red-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>

            </span>
          </div>
        ))}
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5">Invia</button>
    </form>
  )
}

export default form
