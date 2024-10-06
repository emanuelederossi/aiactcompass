'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { DomandaDb } from '../domande';
import { ToolInvocation } from 'ai';
import ChatComponent from './chatComponent';
import SideBtn from './openSideBtn';
import Arrow from './arrow';

interface MappedMessages {
    content: string;
    role: string;
    id: string;
    system?: boolean;
}

interface Action {
    value: string;
}

interface Category {
    id: number;
    nome: string;
    options: { value: string; checked: boolean }[];
}


export default function Chat({
    categoriesAndChecks,
    domande,
    currentToolIndex,
    setCurrentToolIndex,
    setCategoriesAndChecks,
    setSideBarOpen,
    sideBarOpen,
    setCurrentTaskStatus
}: {
    categoriesAndChecks: { nome: string, options: { value: string, checked: boolean }[] }[],
    domande: DomandaDb[],
    currentToolIndex: number,
    setCurrentToolIndex: (index: number) => void,
    setCategoriesAndChecks: React.Dispatch<React.SetStateAction<Category[]>>,
    setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    sideBarOpen: boolean,
    setCurrentTaskStatus: React.Dispatch<React.SetStateAction<{
        currentTask: string;
        taskIndex: number;
        status: "null" | "success" | "pending"
      }>>
}) {


    const [completitionFinished, setCompletitionFinished] = useState(false);



    const { messages, input, setInput, append } = useChat({
        api: `/api/chat2`,
        onFinish: () => setCompletitionFinished(!completitionFinished),
        initialMessages: [
            { role: 'assistant', content: 'Hello! How can I help you today?', id: '1' },
        ],
    });

    const filteredMessages: MappedMessages[] = messages.filter(m => !m.content.startsWith("__Please review my previous messages"));
    const mappedMessages: MappedMessages[] = messages.map(m => {
        if (m.content.startsWith("__Please review my previous messages")) {
            return { ...m, system: true }
        }
        return m;
    });

    const sendItData = async (toolname: string, toolIndex: number) => {
        console.log('CALLING', toolname, toolIndex)
        setCurrentTaskStatus({ currentTask: toolname, taskIndex: toolIndex, status: "pending" })
        try {
            await append({ content: `__Please review my previous messages to find any information needed to invoke ${toolname}. If the information is sufficient, proceed to invoke ${toolname}. If not, kindly ask me explicitly for the missing details before invoking the tool.`, role: 'user' }, {
                data: {
                    toolIndex: toolIndex
                },
            });
        } catch (error) {
            console.error(error)
        }
    }

    // UPDATE CATEGORIES AND CHECKS
    const updateCategoriesAndChecks = (act: { category: string, value: string }[]) => {
        const prev = categoriesAndChecks;
        const clone = JSON.parse(JSON.stringify(prev)) as Category[]
        act.forEach(a => {
            const category = clone.find((c: Category) => c.nome === a.category)

            if (category && a.value) {
                // PUSH
                if (a.value.startsWith('PUSH(')) {

                    const option = category.options.find(o => a.value === `PUSH("${o.value}")`)

                    if (option) {
                        option.checked = true
                    }
                }
                // CHANGE
                else if (a.value.startsWith('CHANGE(')) {
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
            }
        })
        setCategoriesAndChecks(clone)
        return clone
    }

    // ESEGUI LE AZIONI AL TOOL INVOCATION
    const executeActions = (invocation?: ToolInvocation) => {
        if (!invocation) return null;
        const toolName = invocation?.toolName;
        const invocationResult = 'result' in invocation && invocation.result;
        const domanda = domande.find(d => d.toolName === toolName);
        const option = domanda?.options.find(o => o.name === invocationResult);
        // INVIA LE AZIONI AL COMPONENTE PADRE
        if (option?.actions) {
            return updateCategoriesAndChecks(option.actions);
        }
        return null
    }

    const skipTool = (tool: DomandaDb, returedOutputState: Category[]) => {
        const dependenciesTOOL = tool.dependencies;
        if (dependenciesTOOL.length === 0) return false;
        let skip = false;
        dependenciesTOOL.forEach(dep => {
            const categoryOUT = returedOutputState.find(c => c.nome === dep.category);
            if (categoryOUT) {
                dep.value.forEach(v => {
                    const option = categoryOUT.options.find(o => o.value === v);
                    const optionNegative = categoryOUT.options.find(o => `!${o.value}` === v);
                    if (option && !option.checked) {
                        skip = true;
                    }
                    if (optionNegative?.checked) {
                        skip = true;
                    }
                })
            }
        })
        return skip;
    }

    const [currentInvocationsNumber, setCurrentInvocationsNumber] = useState<number>(0);
    const [noInvocationsCount, setNoInvocationsCount] = useState<number>(-1)

    // VAI ALLA PROSSIMA DOMANDA
    useEffect(() => {
        const invocations = messages.flatMap(m => m.toolInvocations ?? []);
        if (invocations.length > currentInvocationsNumber) {
            const lastInvocation = invocations[invocations.length - 1];
            if (lastInvocation && lastInvocation.state === 'result') {
                console.log('CALLING RESUILT', lastInvocation)
                setCurrentTaskStatus(prev => ({...prev,  status: "success" }))
                const returedOutputState = executeActions(lastInvocation);
                setNoInvocationsCount(0)
                setCurrentInvocationsNumber(invocations.length);
                const nextTool = domande.find(tool => tool.index === currentToolIndex + 1);
                console.log('nextTool', nextTool);
                if (nextTool && returedOutputState) {
                    // CHECK IF NEXT TOOL IS A TOOL TO SKIP
                    const skip = skipTool(nextTool, returedOutputState);
                    console.log('skip', skip);
                    if (skip) {
                        const nextnextTool = domande.find(tool => tool.index === currentToolIndex + 2);
                        if (nextnextTool) {
                            setCurrentToolIndex(nextnextTool.index);
                            console.log('nextnextTool1') 
                            sendItData(nextnextTool.toolName, nextnextTool.index).catch(error => console.error(error));
                        }
                    } else {
                        setCurrentToolIndex(nextTool.index);
                        console.log('nextnextTool2') 
                        sendItData(nextTool.toolName, nextTool.index).catch(error => console.error(error));
                    }
                } else if (nextTool) {
                    setCurrentToolIndex(nextTool.index);
                    console.log('nextnextTool3') 
                    sendItData(nextTool.toolName, nextTool.index).catch(error => console.error(error));
                }
            }
        }else{
            console.log('no invocations')
            setNoInvocationsCount(prev => prev + 1)
        }
    }, [completitionFinished])

        // VAI ALLA PROSSIMA DOMANDA BOTTONE SE NON SI MUOVE DA SOLO



    const scrollContRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollContRef.current?.scrollTo({ top: scrollContRef.current?.scrollHeight, behavior: 'smooth' });
    }, [messages]);



    return (
        <div className=" relative flex flex-col w-full min-h-full ">
            <div className="border-b p-3 border-[#e0e0e0] h-16 flex items-center justify-start gap-3">
                <div className="p-2 rounded-md border-2 border-[#7a7a7a] aspect-square flex items-center cursor-pointer hover:bg-[#f1f1f1]"
                    onClick={() => setSideBarOpen(prev => !prev)}>
                    <div
                    className={`${sideBarOpen && "transform rotate-180"} transition-transform`}
                    >
                        <SideBtn />
                    </div>
                </div>
                <p>
                    AI Legal Checker
                </p>
            </div>
            <div ref={scrollContRef} className='p-5 h-[69vh] overflow-y-scroll hidden-scrollbar'>
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[800px] pb-7">
                        <ChatComponent
                            mappedMessages={mappedMessages}
                            filteredMessages={filteredMessages}
                        />
                    </div>
                </div>
              <div className="bg-gradient-to-t from-white from-[50%] absolute bottom-6 left-0 to-transparent h-44 w-full"></div>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    setInput("")
                    await append({ content: input, role: "user" }, { data: { toolIndex: currentToolIndex } })
                }}
                className='absolute bottom-0 w-full left-0'                
                >
                    <div
                        className=' bottom-0 w-full left-0 px-5 pb-10 flex justify-center gap-2'
                    >
                        <div className="flex justify-between items-end w-full max-w-[800px] gap-3"> 
                            <div className="relative w-full flex justify-between items-end border border-[#e0e0e0] rounded-lg shadow-lg ">
                        <textarea
                            className="w-full p-2 transition-width rounded-lg overflow-hidden outline-none resize-none"
                            value={input}
                            placeholder="Say something..."
                            onChange={event => setInput(event.target.value)}
                            onKeyDown={async (e) => {
                                const target = e.target as HTMLTextAreaElement;                                
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    setInput("")              
                                    target.style.height = 'auto';
                                    await append({ content: input, role: "user" }, { data: { toolIndex: currentToolIndex } })
                                }
                            }
                            }
                            style={{ height: 'auto', minHeight: '20px' }}
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                        <button
                            aria-label='Send'
                            type="submit"
                            className="bg-blue-900 border-2 text-sm border-blue-200 text-blue-900 p-2 rounded-lg me-1 mb-1"
                        >
                            <Arrow />
                        </button>
                        </div>                      
                        
                                <div
                                className={`w-0 ${noInvocationsCount > 2 ? "w-16" : ""} transition-all`}
                                >                        
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        const currentTool = domande.find(d => d.index === currentToolIndex);
                                        console.log('currentTool', currentTool)
                                        if(currentTool){
                                            setNoInvocationsCount(0)
                                            sendItData(currentTool.toolName, currentToolIndex).catch(error => console.error(error));
                                        }
                                    }}
                                    className={`bg-blue-900/20 border-2 border-blue-900 text-blue-900 p-2 rounded-lg transform scale-0 ${noInvocationsCount > 2 ? "scale-100 opacity-100" : "opacity-0"} transition-all delay-100`}
                                >
                                    Next
                                </button>
                                </div>    
                        
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}