"use client"

import { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { DomandaDb } from '../domande'

interface Category {
  nome: string;
  options: { value: string; checked: boolean }[];
}

interface CategoryDb {
  id: number;
  nome: string;
  options: string[];
}

const InnerWrapper = ({ domande, categorie }: { domande: DomandaDb[], categorie: CategoryDb[] }) => {

  const initialState = categorie.map(c => {
    const options = c.options.map(o => ({ value: o, checked: false }))
    return { ...c, options }
  })

  const [categoriesAndChecks, setCategoriesAndChecks] = useState<Category[]>(initialState)
  const [currentToolIndex, setCurrentToolIndex] = useState<number>(1);

  return (
    <div className='flex justify-center'>
      <div className='w-1/3'>
        <h1 className='text-2xl font-bold'>{currentToolIndex}/{domande.length}</h1>
      </div>
      <div className='w-full'>
        <Chat 
          setCategoriesAndChecks={setCategoriesAndChecks}
        currentToolIndex={currentToolIndex}
        setCurrentToolIndex={setCurrentToolIndex}        
        domande={domande} categoriesAndChecks={categoriesAndChecks} />
      </div>
      <div className='w-1/3'>
        <Output
          categoriesAndChecks={categoriesAndChecks}
          />
      </div>
    </div>
  )
}

export default InnerWrapper
