'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {

  const scrollContRef = useRef<HTMLDivElement>(null);
  const [completitionFinished, setCompletitionFinished] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);


  const [toolCalled, setToolCalled] = useState<{toolName:string, informed: boolean, alreadyAsked: boolean}[]>([
    { toolName: 'getEntityType', informed: false, alreadyAsked: true },
    { toolName: 'systemModifications', informed: false, alreadyAsked: false },
    { toolName: 'checkTerritorialScope', informed: false, alreadyAsked: false },
    { toolName: 'checkExludedSystems', informed: false, alreadyAsked: false },
  ]);  

  const { messages, input, setInput, append } = useChat({
    api: '/api/chat',
    onFinish: () => setCompletitionFinished(!completitionFinished),
    initialMessages: [
      { role: 'assistant', content: 'Hello! How can I help you today?', id: '1' },
    ]
  });
  

  const toolInvocations = messages.flatMap(m => m.toolInvocations ?? []);

  const sendItData = async (toolname: string) => {
    try {
    await append({ content: `ask me about ${toolname}`, role: 'user' });      
    } catch (error) {
      console.error(error)
    }
  }
  
  useEffect(() => {
    for(const invocation of toolInvocations){
      if(invocation.state === 'result'){
        setToolCalled(prevTools => prevTools.map(tool => tool.toolName === invocation.toolName ? {toolName: tool.toolName, alreadyAsked: tool.alreadyAsked, informed: true} : tool))
      }
    }   
  }, [completitionFinished])

  useEffect(() => {
    const firstUninformedTool = toolCalled.find(tool => !tool.informed);

    if(!firstUninformedTool){
      setHasFinished(true)
    }

    if(firstUninformedTool && !firstUninformedTool.alreadyAsked){
      setToolCalled(prevTools => prevTools.map(tool => tool.toolName === firstUninformedTool.toolName ? {toolName: tool.toolName, alreadyAsked: true, informed: tool.informed} : tool))
      sendItData(firstUninformedTool.toolName).catch(console.error);
    }
  }, [toolCalled])

  useEffect(() => {
    const invocations = messages.flatMap(m => m.toolInvocations ?? []);
    const allToolsCalled = invocations.every(i => i.state === 'result');
    const allToolsPresent = toolCalled.every(tool => invocations.some(invocation => invocation.toolName === tool.toolName));
    console.log(allToolsCalled, allToolsPresent, invocations)
    if(allToolsCalled && allToolsPresent){
      setHasFinished(true)
    }
  }, [messages])
  
  useEffect(() => {
    scrollContRef.current?.scrollTo({ top: scrollContRef.current?.scrollHeight, behavior: 'smooth' });    
  }, [messages]);

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

      <div className="fixed top-0 right-0 flex flex-col gap-2">
        {toolInvocations.map((invocation, i) => (
          'result' in invocation && invocation.result !== 'No edit provided' && ( 
          <div key={invocation.toolCallId} className="whitespace-pre-wrap bg-red-600 p-2 text-white uppercase">
            {'result' in invocation ? invocation.result : 'No result available'}
          </div>
          )
        ))}
        {hasFinished && <div className="whitespace-pre-wrap bg-green-600 p-2 text-white uppercase">All tools have been called</div>}
      </div>

      <form onSubmit={async(e) => {
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