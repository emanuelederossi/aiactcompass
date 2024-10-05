"use client"

import { useState } from 'react'
import Chat from './chat'
import Output from './output'
import { DomandaDb } from '../domande'
import { useSearchParams } from 'next/navigation'
import Results from './results'
import Status from './status'
import Logo from './logo'
import ResultIcon from './resultIcon'
import FaqIcon from './faqIcon'
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
        {/* sidebar */}
        <div>
          <div className="flex h-[20vh] items-end">
            <div className="flex items-center flex-none text-2xl">
              <div className="w-14 flex-none flex justify-center items-center">
                <Logo
                  className='trasform scale-150'
                />
              </div>
              Ai-ware
            </div>
          </div>
          <div className={`flex w-60 max-w-60 overflow-hidden ${sideBarOpen ? "opacity-1" : "opacity-0"} transition-opacity`}>
            <div className='flex-none w-60 max-w-60 overflow-hidden'>
              <div className="flex-none mt-14">
                <h2 className='text-3xl'>EU AI Act Compliance Checker</h2>
              </div>
              <p className="mt-4 text-sm flex-none">
                The EU AI Act introduces new obligations to entities located within the EU and elsewhere. Use our interactive tool to determine whether or not your AI system will be subject to these.
              </p>
              <p className="mt-4 text-sm flex-none">
                For further clarity, we recommend that you seek professional legal advice and follow national guidance. More information about EU AI Act enforcement in your country will likely be provided in 2024.
              </p>
            </div>
          </div>
          <div className="flex mt-6">
            <div className="w-14 flex-none flex justify-center items-center">
              <FaqIcon
              />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full min-h-full flex-1 p-5'>
        <div className='bg-white rounded-lg min-h-full border border-[#e0e0e0] flex relative'>
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
          {showResults && (
            <Results
              filtretedOutputs={filtretedOutputs}
              setShowResults={setShowResults}
            />
          )}
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
