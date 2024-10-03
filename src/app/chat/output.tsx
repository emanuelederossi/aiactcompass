import React from 'react'

const output = ({action}: {action: {category: string, value: string}[]}) => {
  console.log(action)
  return (
    <div>
      <h1>Output</h1>
      <div>
        {action.map((a, i) => (
          <div key={i}>
            <p>{a.category}</p>
            <p>{a.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default output
