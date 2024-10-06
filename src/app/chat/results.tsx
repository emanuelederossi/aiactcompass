import React from 'react'

const Results = ({
    filtretedOutputs,
    setShowResults,
    showResults
}: {
    filtretedOutputs: {
        id: number;
        title: string;
        content: string;
    }[];
    setShowResults: (showResults: boolean) => void;
    showResults: boolean;
}) => {
    return (
        <div
            className={`w-full bg-white/90 p-6 pt-0 absolute min-h-full max-h-full top-0 left-0 z-50 overflow-y-scroll rounded-lg transition-all transform ease-out ${showResults ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className='pt-20'>
                <div className="p-3  w-full h-16 flex items-center justify-start ps-[0.9rem] gap-3 fixed top-0 right-0">
                    <div className="p-2 rounded-full border-2 border-[#7a7a7a] h-[30px] w-[30px] flex items-center cursor-pointer"
                        onClick={() => setShowResults(false)}>
                        <div className="relative h-[24px] transform translate-x-[2px]">
                        <span
                        className='bg-[#7a7a7a] w-[1px] h-[20px] absolute top-[2px] left-[2px] transform translate-x-[50%] rotate-[45deg]'
                        ></span>
                        <span
                        className='bg-[#7a7a7a] w-[1px] h-[20px] absolute top-[2px] left-[2px] transform translate-x-[50%] rotate-[-45deg]'
                        ></span>
                        </div>
                        
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
