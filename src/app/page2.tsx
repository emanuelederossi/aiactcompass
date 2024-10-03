'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    state: string;
    result?: {
        content: string;
        result: string | number | boolean;
    };
}

interface ToolDb {
    index: number;
    toolName: string;
    informed: boolean;
    alreadyAsked: boolean;
    skip: { tool: string, exclude: string[] }[];
}

interface Domanda {
    index: number;
    toolName: string;
    question: string;
}


export default function Chat() {

    const initalState: ToolDb[] = [
        { index: 1, toolName: 'getEntityType', informed: false, alreadyAsked: true, skip: [] },
        { index: 2, toolName: 'systemModifications', informed: false, alreadyAsked: false, skip: [{ tool: "getEntityType", exclude: ["Provider"] }] },
        { index: 3, toolName: 'checkTerritorialScope', informed: false, alreadyAsked: false, skip: [] },
        { index: 4, toolName: 'checkExludedSystems', informed: false, alreadyAsked: false, skip: [] },
    ]

    const scrollContRef = useRef<HTMLDivElement>(null);
    const [completitionFinished, setCompletitionFinished] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const { messages, input, setInput, append } = useChat({
        api: '/api/chat',
        onFinish: () => setCompletitionFinished(!completitionFinished),
        initialMessages: [
          { role: 'assistant', content: 'Hello! How can I help you today?', id: '1' },
        ]
      });
      

    return (
        <div ref={scrollContRef} className="flex flex-col w-full max-w-md py-24 h-[90vh] mx-auto stretch overflow-y-scroll">
            {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap mb-4 leading-relaxed">
                    <span className="bg-blue-200 p-2 rounded me-2">
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                    </span>
                    {m.content === "" ? "...tool invocation..." : m.content}
                </div>
            ))}            

            <form onSubmit={async (e) => {
                e.preventDefault()
                setInput("")
                await append({ content: input, role: "user" })
            }}>
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={event => setInput(event.target.value)}
                />
            </form>
        </div>
    );
}