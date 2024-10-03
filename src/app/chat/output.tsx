import React, { use, useEffect, useState } from 'react'
import { categorie } from '../categorie'

const initialState = categorie.map(c => {
  const options = c.options.map(o => ({value: o, checked: false}))
  return {...c, options}
})

interface Category {
  nome: string;
  options: { value: string; checked: boolean }[];
}

interface Action {
  category: string;
  value: string;
}

interface OutputProps {
  action: Action[];
  categoriesAndChecks: Category[];
  setCategoriesAndChecks: React.Dispatch<React.SetStateAction<Category[]>>;
}

const output: React.FC<OutputProps> = ({action, categoriesAndChecks, setCategoriesAndChecks}) => {
  



  const updateCategoriesAndChecks = async() => {
    setCategoriesAndChecks(prev => {
      const clone = JSON.parse(JSON.stringify(prev)) as Category[]
      action.forEach(a => {        
        const category = clone.find((c: Category) => c.nome === a.category)
        console.log('category', category)
        if (category) {         
          // PUSH
          if(a.value.slice(0, 5) === 'PUSH(') {
            console.log(a.value)
            const option = category.options.find(o => a.value === `PUSH("${o.value}")`)
            console.log('option', option)
            if (option) {
              option.checked = true
            }
          }
          // CHANGE
          else if(a.value.slice(0, 7) === 'CHANGE(') {
            const toRemove = a.value.split('"')[1]
            const toAdd = a.value.split('"')[3]
            const optionToRemove = category.options.find(o => a.value === toRemove)
            const optionToAdd = category.options.find(o => a.value === toAdd)
            if (optionToRemove) {
              optionToRemove.checked = false
            }
            if (optionToAdd) {
              optionToAdd.checked = true
            }
          }
          // EXIT
          else if(a.value === 'EXIT') {
            const option = category.options.find(o => o.value === 'EXIT')
            if (option) {
              option.checked = true
            }
          }
        }
      })
      return clone
    })
  }

  useEffect(() => {
    updateCategoriesAndChecks()
  }, [action])


  return (
    <div>
      <h1>Output</h1>
      <div>
        {categoriesAndChecks.map((c, i) => (
          <div key={i}>
            <h2 className='font-bold'>{c.nome}</h2>
            <div>
              {c.options.map((o, j) => (
                <div key={j}>
                  <label htmlFor={o.value}>{o.value}</label>
                  <input id={o.value} type='checkbox' checked={o.checked}   
                  readOnly                
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default output
