"use client"

import { useEffect, useState } from 'react'
import Chat from './chat'
import Output from './output'
import { DomandaDb } from '../domande'
import { useSearchParams } from 'next/navigation'
import Results from './results'
import Status from './status'
import ResultIcon from './resultIcon'
import Sidebar from './sidebar'
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

 

  
  const filteredOutputsIfExit = categoriesAndChecks.filter(output => output.options.find(category => category.value === "EXIT")?.checked === true)
  const filteredOutputsIfProihbited = categoriesAndChecks.filter(output => output.options.find(category => category.value === "prohibited")?.checked === true)



  const [realOutputs, setRealOutputs] = useState<Output[]>([])

  useEffect(() => {

    const filtretedOutputs = outputs.filter(output => output.categories.every(category => {
      const selectedCategory = categoriesAndChecks.find(c => c.id === category.id)
      return category.options.every(option => {
        if (option.value === false) return true
        const selectedOption = selectedCategory?.options.find(o => o.value === option.name)
        return selectedOption?.checked === option.value
      })
    }))

    if (filteredOutputsIfExit.length > 0) {
      setShowResults(true)
      setRealOutputs(filtretedOutputs.filter(output => output.categories.find(category => category.id === 3)?.options.find(option => option.name === "EXIT")?.value === true))
    } else if (filteredOutputsIfProihbited.length > 0) {
      setShowResults(true)
      setRealOutputs(filtretedOutputs.filter(output => output.categories.find(category => category.id === 5)?.options.find(option => option.name === "prohibited")?.value === true))
    } else {
      setRealOutputs(filtretedOutputs)
    }
  }, [categoriesAndChecks])
  

  const currentStatusText = `${currentToolIndex}/${domande.length}`

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true)

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
      <div className={`flex-none ${sideBarOpen ? "w-64" : "w-20"} transition-all overflow-hidden ps-6`}>
        <Sidebar 
        sideBarOpen={sideBarOpen}
        />
      </div>
      <div className='w-full min-h-full flex-1 p-5'>
        <div className='bg-white rounded-lg min-h-full border border-[#e0e0e0] flex relative overflow-hidden'>
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
          </div>          
            <Results
              filtretedOutputs={realOutputs}
              setShowResults={setShowResults}
              showResults={showResults}
              />
        </div>
      </div>
      {
        params.get('debug') && (
          <div className='fixed bottom-0 left-0 p-6 bg-white shadow'>
            <Output
              categoriesAndChecks={categoriesAndChecks}
            />
          </div>
        )
      }

    </div>
  )
}

export default InnerWrapper
