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
            className='w-full bg-white/90 p-6 absolute min-h-full max-h-full top-0 left-0 z-50 overflow-y-scroll rounded-lg'
        >
            <div className='pt-14'>
                <div className="p-3  w-full h-16 flex items-center justify-end pe-14 gap-3 fixed top-6 right-0">
                    <div className="p-2 rounded-lg border-2 border-blue-900 text-blue-900 bg-blue-100 flex items-center cursor-pointer hover:bg-[#f1f1f1]"
                        onClick={() => setShowResults(false)}>
                        Close
                    </div>
                </div>
                {filtretedOutputs.map(output => (
                    <div key={output.id} className="block bg-white border border-blue-900/30 rounded-lg shadow mb-6">
                        <div className="p-4 bg-blue-900/10 border-b border-blue-900/30">
                            <h5 className="text-2xl font-bold tracking-tight text-blue-900">{output.title}</h5>
                        </div>
                        <div
                            className='tiptap font-normal text-gray-700 p-6'
                            dangerouslySetInnerHTML={{ __html: output.content }} />
                    </div>

                ))}
            </div>
        </div>
    )
}

export default Results
