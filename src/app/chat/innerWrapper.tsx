"use client"

import { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { DomandaDb } from '../domande'
import { useSearchParams } from 'next/navigation'
import Results from './results'

interface Category {
  id: number;
  nome: string;
  options: { value: string; checked: boolean }[];
}

interface CategoryDb {
  id: number;
  nome: string;
  options: string[];
}

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

const InnerWrapper = ({ domande, categorie, outputs }: { domande: DomandaDb[], categorie: CategoryDb[], outputs: Output[] }) => {

  // get search params
  const params = useSearchParams();

  const initialState = categorie.map(c => {
    const options = c.options.map(o => ({ value: o, checked: false }))
    return { ...c, options }
  })

  const [showResults, setShowResults] = useState<boolean>(false)

  const [categoriesAndChecks, setCategoriesAndChecks] = useState<Category[]>(initialState)
  const [currentToolIndex, setCurrentToolIndex] = useState<number>(1);

  const filtretedOutputs = outputs.filter(output => output.categories.every(category => {
    const selectedCategory = categoriesAndChecks.find(c => c.id === category.id)
    return category.options.every(option => {
      if (option.value === false) return true
      const selectedOption = selectedCategory?.options.find(o => o.value === option.name)

      return selectedOption?.checked === option.value
    })
  }))


  return (
    <div className='flex justify-center w-full'>
      {showResults && (
        <Results 
        filtretedOutputs={filtretedOutputs}
        setShowResults={setShowResults}
        />
      )}
      <>
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
          {
            params.get('debug') && (
              <Output
                categoriesAndChecks={categoriesAndChecks}
              />
            )
          }
          <button
            className='bg-blue-500 text-white p-2 rounded-lg mt-5'
            onClick={() => setShowResults(true)}
          >
            See Results
          </button>
        </div>
      </>

    </div>
  )
}

export default InnerWrapper
