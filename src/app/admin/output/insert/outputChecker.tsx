"use client"

import React from 'react'
interface Category {
    id: number;
    nome: string;
    options: string[];
  }

interface FormData {
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

const OutputChecker = ({
    categories,
    formData,
    setFormData
}: {
    categories: Category[],
    formData: FormData,
    setFormData: (data: FormData) => void
}) => {



  return (
    <div
    className='rounded-lg bg-slate-400 p-6 mt-5'
    >
      {
        categories.map((category) => (
          <div
          key={category.id}
            className='mb-5'
            >
            <h2
            className='text-xl font-bold'
            >
              {category.nome}
            </h2>
            <ul
            className='flex flex-wrap'
            >
              {
                category.options.map((option, i) => (
                  <li
                  key={option}
                  className='bg-slate-300 rounded-lg p-2 mr-2 mb-2 flex items-center'
                  >
                    <label 
                    className='cursor-pointer'
                    htmlFor={`${category.id}-${option}-${i}`}>
                    {option}
                    </label>
                    <input id={`${category.id}-${option}-${i}`} type="checkbox" 
                    checked={formData.categories.find(c => c.id === category.id)?.options.find(o => o.name === option)?.value}
                    onChange={(e) => {
                        const newFormData = {...formData}
                        const categoryIndex = newFormData.categories.findIndex(c => c.id === category.id)
                        if (categoryIndex !== -1) {
                          const optionIndex = newFormData.categories[categoryIndex]?.options.findIndex(o => o.name === option)
                          if (optionIndex !== undefined && optionIndex !== -1) {
                            if (newFormData.categories[categoryIndex]?.options[optionIndex]) {
                              newFormData.categories[categoryIndex].options[optionIndex].value = e.target.checked;
                            }
                          }
                        }
                        setFormData(newFormData)
                    }}
                    className='ml-2 cursor-pointer'
                    />
                  </li>
                ))
              }
            </ul>
            </div>
        ))
      }
    </div>
  )
}

export default OutputChecker
