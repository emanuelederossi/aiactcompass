'use client';

import { Message, useChat } from 'ai/react';
import { use, useEffect, useRef, useState } from 'react';
import { Domanda, domande } from '../domande';
import { ToolInvocation } from 'ai';
import { useSearchParams } from 'next/navigation';

interface MappedMessages {
    content: string;
    role: string;
    id: string;
    system?: boolean;
}

export default function Chat({setAction}: {setAction: (action: {category: string, value: string}[]) => void}) {

    // get search params
    const params = useSearchParams();

    const [completitionFinished, setCompletitionFinished] = useState(false);
    const [currentToolIndex, setCurrentToolIndex] = useState<number>(1);


    const { messages, input, setInput, append } = useChat({
        api: `/api/chat2`,
        onFinish: () => setCompletitionFinished(!completitionFinished),
        initialMessages: [
            { role: 'assistant', content: 'Hello! How can I help you today?', id: '1' },
        ],
        initialInput: 'ask me about getEntityType'
    });

    const filteredMessages: MappedMessages[] = messages.filter(m => m.content.slice(0, 36) !== "__Please review my previous messages");
    const mappedMessages: MappedMessages[] = messages.map(m => {
        if (m.content.slice(0, 36) === "__Please review my previous messages") {
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

    // ESEGUI LE AZIONI AL TOOL INVOCATION
    const executeActions = (invocation?: ToolInvocation) => {
        if (!invocation) return;
        const toolName = invocation?.toolName;
        const invocationResult = 'result' in invocation && invocation.result;
        const domanda = domande.find(d => d.toolName === toolName);
        const option = domanda?.options.find(o => o.name === invocationResult);
        // INVIA LE AZIONI AL COMPONENTE PADRE
        if (option?.actions) {
            setAction(option.actions);
            console.log('Tool:', option?.actions)
        }
    }

    const [currentInvocationsNumber, setCurrentInvocationsNumber] = useState<number>(0);
    // VAI ALLA PROSSIMA DOMANDA
    useEffect(() => {
        const invocations = messages.flatMap(m => m.toolInvocations ?? []);
        if (invocations.length > currentInvocationsNumber) {
            const lastInvocation = invocations[invocations.length - 1];
            if (lastInvocation && lastInvocation.state === 'result') executeActions(lastInvocation);
            setCurrentInvocationsNumber(invocations.length);
            const nextTool = domande.find(tool => tool.index === currentToolIndex + 1);
            if (nextTool) {
                setCurrentToolIndex(nextTool.index);
                sendItData(nextTool.toolName, nextTool.index);
            }
        }
    }, [completitionFinished])



    const scrollContRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        scrollContRef.current?.scrollTo({ top: scrollContRef.current?.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    return (
        <div ref={scrollContRef} className="flex flex-col w-full py-24 h-[90vh] mx-auto stretch overflow-y-scroll">
            {
             params.get('debug') ?
             mappedMessages.map(m => (
                m.content !== "" &&
                <div key={m.id} className={`whitespace-pre-wrap mb-4 leading-relaxed ${m.system && "text-red-600 font-semibold"}`}>
                    <span className={`bg-blue-200 p-2 rounded me-2`}>
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                    </span>
                    {m.content === "" ? "...tool invocation..." : m.content}
                </div>
            ))
            :
            filteredMessages.map(m => (
                m.content !== "" &&
                <div key={m.id} className={`whitespace-pre-wrap mb-4 leading-relaxed ${m.system && "text-red-600 font-semibold"}`}>
                    <span className={`bg-blue-200 p-2 rounded me-2`}>
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                    </span>
                    {m.content === "" ? "...tool invocation..." : m.content}
                </div>
            ))    
        }

            <form onSubmit={async (e) => {
                e.preventDefault()
                setInput("")
                await append({ content: input, role: "user" }, { data: { toolIndex: currentToolIndex } })
            }}>
                <div
                    className='fixed bottom-0 w-full max-w-[900px] left-[50%] translate-x-[-50%] p-2 mb-8'
                >
                    <input
                        className="w-full p-2 border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="Say something..."
                        onChange={event => setInput(event.target.value)}
                    />
                </div>
            </form>
        </div>
    );
}