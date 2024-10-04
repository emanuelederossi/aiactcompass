import { error } from 'console';
import React, { useEffect } from 'react'
interface Category {
  nome: string;
  options: { value: string; checked: boolean }[];
}

interface Action {
  category: string;
  value: string;
}

interface OutputProps {
  categoriesAndChecks: Category[];
}

const Output: React.FC<OutputProps> = ({ categoriesAndChecks }) => {
  




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

export default Output
