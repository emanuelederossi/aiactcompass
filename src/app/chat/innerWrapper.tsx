"use client"

import { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { categorie } from '../categorie'
import { DomandaDb } from '../domande'
const initialState = categorie.map(c => {
  const options = c.options.map(o => ({ value: o, checked: false }))
  return { ...c, options }
})
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

  const [categoriesAndChecks, setCategoriesAndChecks] = useState<Category[]>(initialState)
  const [action, setAction] = useState<{ category: string, value: string }[]>([]);
  const [currentToolIndex, setCurrentToolIndex] = useState<number>(1);

  return (
    <div className='flex justify-center'>
      <div className='w-1/3'>
        <h1 className='text-2xl font-bold'>{currentToolIndex}/{domande.length}</h1>
      </div>
      <div className='w-full'>
        <Chat 
        currentToolIndex={currentToolIndex}
        setCurrentToolIndex={setCurrentToolIndex}
        setAction={setAction} domande={domande} categoriesAndChecks={categoriesAndChecks} />
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

export default InnerWrapper
