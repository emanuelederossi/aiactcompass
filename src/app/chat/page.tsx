"use client";

import React, { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { categorie } from '../categorie'

const initialState = categorie.map(c => {
  const options = c.options.map(o => ({value: o, checked: false}))
  return {...c, options}
})
interface Category {
    nome: string;
    options: { value: string; checked: boolean }[];
  }

const page = () => {

    const [categoriesAndChecks, setCategoriesAndChecks] = useState<Category[]>(initialState)
    const [action, setAction] = useState<{category: string, value: string}[]>([]);

  return (
    <div className='flex justify-center'>
    <div className='w-1/3'></div>
    <div className='w-full'>
      <Chat setAction={setAction} categoriesAndChecks={categoriesAndChecks} />
    </div>
    <div className='w-1/3'>
    <Output 
    categoriesAndChecks={categoriesAndChecks}
    setCategoriesAndChecks={setCategoriesAndChecks}
    action={action} />
    </div>
    </div>
  )
}

export default page
