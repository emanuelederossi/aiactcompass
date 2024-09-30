'use client';

import { useChat } from 'ai/react';
 
export default function Chat() {
  const { messages, input, setInput, append, handleSubmit } = useChat({
    api: '/api/chat',
  });
  const toolInvocations = messages.flatMap(m => m.toolInvocations || []);  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {toolInvocations.map((invocation, i) => (
        <div key={invocation.toolCallId} className="whitespace-pre-wrap bg-red-600 p-2 text-white uppercase">
          {'result' in invocation ? invocation.result : 'No result available'}
        </div>
      ))}
 
      <form onSubmit={(e)=> {
        e.preventDefault()
        append({content: input, role: "user"})
        setInput("")
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