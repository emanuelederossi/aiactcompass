"use client"

import { useSearchParams } from 'next/navigation'
import React from 'react'
import Logo from './logo'

interface MappedMessages {
    content: string;
    role: string;
    id: string;
    system?: boolean;
}

const ChatComponent = ({
    mappedMessages,
    filteredMessages
}: {
    mappedMessages: MappedMessages[],
    filteredMessages: MappedMessages[]
}) => {

    const params = useSearchParams()

    return (
        <div>
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
                        m.content !== "" && (
                            m.role === 'user' ? (
                                <div key={m.id} className="flex justify-end mb-12">
                                <div  className={`p-3 rounded-xl bg-[#F3F3F3BA] text-right whitespace-pre-wrap mb-4 leading-relaxed ${m.system && "text-red-600 font-semibold"}`}>
                                    {m.content === "" ? "...tool invocation..." : m.content}
                                </div>
                                </div>
                            ) : (
                                <div key={m.id} className="flex items-center mb-12">
                                    <div className="flex-none me-5 h-full min-h-max">
                                        <div className='w-12 h-12 border border-[#e0e0e0] rounded-full flex justify-center items-center'>
                                            <Logo />
                                        </div>
                                    </div>
                                    <div className={`whitespace-pre-wrap leading-relaxed ${m.system && "text-red-600 font-semibold"}`}>
                                        {m.content === "" ? "...tool invocation..." : m.content}
                                    </div>
                                </div>
                            )
                        )
                    ))
            }
        </div>
    )
}

export default ChatComponent
