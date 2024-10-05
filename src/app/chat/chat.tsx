'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { DomandaDb } from '../domande';
import { ToolInvocation } from 'ai';
import { useSearchParams } from 'next/navigation';
import ChatComponent from './chatComponent';

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
    setCategoriesAndChecks
}: {
    categoriesAndChecks: { nome: string, options: { value: string, checked: boolean }[] }[],
    domande: DomandaDb[],
    currentToolIndex: number,
    setCurrentToolIndex: (index: number) => void,
    setCategoriesAndChecks: React.Dispatch<React.SetStateAction<Category[]>>
}) {

    // get search params
    const params = useSearchParams();

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
    // VAI ALLA PROSSIMA DOMANDA
    useEffect(() => {
        const invocations = messages.flatMap(m => m.toolInvocations ?? []);
        if (invocations.length > currentInvocationsNumber) {
            const lastInvocation = invocations[invocations.length - 1];
            if (lastInvocation && lastInvocation.state === 'result') {
                const returedOutputState = executeActions(lastInvocation);
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
                            sendItData(nextnextTool.toolName, nextnextTool.index).catch(error => console.error(error));
                        }
                    } else {
                        setCurrentToolIndex(nextTool.index);
                        sendItData(nextTool.toolName, nextTool.index).catch(error => console.error(error));
                    }
                } else if (nextTool) {
                    setCurrentToolIndex(nextTool.index);
                    sendItData(nextTool.toolName, nextTool.index).catch(error => console.error(error));
                }
            }
        }
    }, [completitionFinished])



    const scrollContRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollContRef.current?.scrollTo({ top: scrollContRef.current?.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    return (
        <div  className=" relative flex flex-col w-full pb-28 min-h-full ">
            <div className="border-b p-3 border-[#e0e0e0]">
                AI Legal Checker
            </div>
            <div ref={scrollContRef} className='p-5 h-[67vh] overflow-y-scroll hidden-scrollbar'>
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[800px]">
                        <ChatComponent
                        mappedMessages={mappedMessages}
                        filteredMessages={filteredMessages}
                        />
                    </div>
                </div>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    setInput("")
                    await append({ content: input, role: "user" }, { data: { toolIndex: currentToolIndex } })
                }}>
                    <div
                        className='absolute bottom-0 w-full left-0 px-5 pb-10 flex justify-center'
                    >
                        <textarea
                            className="w-full max-w-[800px] p-2 border border-[#e0e0e0] rounded shadow-lg overflow-hidden outline-none resize-none"
                            value={input}
                            placeholder="Say something..."
                            onChange={event => setInput(event.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    append({ content: input, role: "user" }, { data: { toolIndex: currentToolIndex } })
                                    setInput("")
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
                    </div>
                </form>
            </div>
        </div>
    );
}