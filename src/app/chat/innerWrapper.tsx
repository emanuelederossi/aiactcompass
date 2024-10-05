"use client"

import { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { DomandaDb } from '../domande'
import { useSearchParams } from 'next/navigation'
import Results from './results'
import Status from './status'
import ResultIcon from './resultIcon'
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

  const currentStatusText = `${currentToolIndex}/${domande.length}`

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false)

  const [currentTaskStaus, setCurrentTaskStatus] = useState<{
    currentTask: string;
    taskIndex: number;
    status: "null" | "success" | "pending"
  }>({
    currentTask: "",
    taskIndex: 0,
    status: "null"
  })

  return (
    <div className='flex justify-center w-full'>
      <div className={`flex-none ${sideBarOpen ? "w-52" : "w-12"} transition-all`}>
        {/* sidebar */}
      </div>
      <div className='w-full min-h-full flex-1 p-5'>
        <div className='bg-white rounded-lg min-h-full border border-[#e0e0e0] flex'>
          <Chat
            setCategoriesAndChecks={setCategoriesAndChecks}
            currentToolIndex={currentToolIndex}
            setCurrentToolIndex={setCurrentToolIndex}
            domande={domande} categoriesAndChecks={categoriesAndChecks} 
            sideBarOpen={sideBarOpen}
            setSideBarOpen={setSideBarOpen}    
            setCurrentTaskStatus={setCurrentTaskStatus}        
          />

          <div className='flex-none w-64 border-l border-[#e0e0e0] relative'>
            <Status 
            domande={domande}
            currentTaskStatus={currentTaskStaus}
            currentToolIndex={currentToolIndex}
            currentStatusText={currentStatusText}
            />
            <div className="absolute bottom-0 w-full border-t bprder-t-[#e0e0e0] p-3 flex gap-3">
              <button
                className='w-full p-2 flex-auto border border-[#e0e0e0] rounded-lg flex gap-4 justify-center items-center'
                onClick={() => setShowResults(true)}
              >
                <ResultIcon />
                See Results
              </button>              
            </div>
            <div className='relative'>
              {
                params.get('debug') && (
                  <Output
                    categoriesAndChecks={categoriesAndChecks}
                  />
                )
              }
              {/* <button
                className='bg-blue-500 text-white p-2 rounded-lg'
                onClick={() => setShowResults(true)}
              >
                See Results
              </button> */}
            </div>
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
