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

  const currentStatusText = `Current status: ${currentToolIndex}/${domande.length}`


  return (
    <div className='flex justify-center w-full'>
      <div className="flex-none w-52">
        {/* sidebar */}
      </div>
      <div className='w-full min-h-full flex-1 p-5'>
        <div className='bg-white rounded-lg min-h-full border border-[#e0e0e0] flex'>
          <Chat
            setCategoriesAndChecks={setCategoriesAndChecks}
            currentToolIndex={currentToolIndex}
            setCurrentToolIndex={setCurrentToolIndex}
            domande={domande} categoriesAndChecks={categoriesAndChecks} />

          <div className='flex-none w-52'>
            <div className="border-b p-3 border-[#e0e0e0]">
                Status
            </div>
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
        </div>
      </div>


      {showResults && (
        <Results
          filtretedOutputs={filtretedOutputs}
          setShowResults={setShowResults}
        />
      )}
    </div>
  )
}

export default InnerWrapper
