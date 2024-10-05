import React from 'react'

const Results = ({
    filtretedOutputs,
    setShowResults
    }: {
    filtretedOutputs: {
        id: number;
        title: string;
        content: string;
    }[];
    setShowResults: (showResults: boolean) => void;
}) => {
  return (
    <div
          className='w-full bg-slate-400/90 min-h-screen max-h-screen p-6 fixed top-0 left-0 z-50 overflow-y-scroll'
        >
          <div>
            <button
              className='bg-blue-500 text-white p-2 rounded-lg mt-5 mb-5'
              onClick={() => setShowResults(false)}
            >back</button>
            {filtretedOutputs.map(output => (
              <div key={output.id} className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{output.title}</h5>
                <div
                  className='tiptap font-normal text-gray-700 dark:text-gray-400'
                  dangerouslySetInnerHTML={{ __html: output.content }} />
              </div>

            ))}
          </div>
        </div>
  )
}

export default Results
