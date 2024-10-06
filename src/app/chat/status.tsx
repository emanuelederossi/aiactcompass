"use client";

import React, { useEffect, useRef } from 'react'
import { DomandaDb } from '../domande';

const Status = ({
    currentStatusText,
    currentTaskStatus,
    currentToolIndex,
    domande
}: {
    currentStatusText: string,
    currentTaskStatus: {
        currentTask: string;
        taskIndex: number;
        status: "null" | "success" | "pending"
    },
    currentToolIndex: number,
    domande: DomandaDb[]
}) => {


    const tasksRef = useRef<(HTMLDivElement | null)[]>([]);

    const scrollIntoView = (index: number) => {
        const element = tasksRef.current[index - 2];
        if (!element) return;
        console.log("DC", element);
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        setTimeout(() => {
            scrollIntoView(currentToolIndex);
        }, 0);
    }, [currentToolIndex, currentTaskStatus]);

    return (
        <div className='relative'>
            <div className="border-b p-3 border-[#e0e0e0] flex justify-between items-center h-16">
                <p>Tasks</p>
                <p
                    className='bg-gray-300 px-2 py-1 text-sm text-gray-700 font-bold rounded-full h-min'
                >{currentStatusText}</p>
            </div>
            <div className="px-3 flex flex-col overflow-y-scroll max-h-[67vh] hidden-scrollbar relative pb-48">
                {
                    domande.map((d, i) => (

                        <div ref={el => { tasksRef.current[i] = el; }} key={d.id} id={`domanda-${d.index}`} className='pt-2'>
                            <div className="flex items-center gap-2 p-2 text-blue-900 rounded-md bg-blue-900/10">
                                {
                                    currentTaskStatus.taskIndex === d.index ? (
                                        <>
                                            <div>
                                                {currentTaskStatus.status === "pending" ? (
                                                    <div role="status">
                                                        <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-200 fill-blue-900" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`w-4 h-4 rounded-full min-w-4 bg-blue-500`}
                                                    >
                                                    </div>
                                                )}
                                            </div>
                                            <p
                                                className='text-sm break-all'
                                            >{d.toolName}</p>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={`w-4 h-4 rounded-full min-w-4 ${currentToolIndex > d.index ? "bg-blue-500" : "bg-gray-300"}`}
                                            >
                                            </div>
                                            <p
                                                className='text-sm break-all'
                                            >{d.toolName}</p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="bg-gradient-to-t from-white absolute bottom-0 left-0 to-transparent h-32 w-full"></div>
        </div>
    )
}

export default Status
