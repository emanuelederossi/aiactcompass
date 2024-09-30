'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, input, setInput, append, handleSubmit } = useChat({
    api: '/api/chat',
  });
  const toolInvocations = messages.flatMap(m => m.toolInvocations ?? []);
  console.log(toolInvocations)
  const hasSystemModifications = toolInvocations.some(
    invocation => invocation.toolName === 'systemModifications' && invocation.state === 'result'
  );
  const hasGetEntityType = toolInvocations.some(
    invocation => invocation.toolName === 'getEntityType' && invocation.state === 'result'
  );

  const [sysInformed, setSysInformed] = useState(false);

  const sendItData = async () => {
    try {
    await append({ content: 'ask me about system modifications', role: 'user' });      
    } catch (error) {
      console.error(error)
    }
  }

  if (hasSystemModifications && hasGetEntityType) {
    console.log('Both systemModifications and getEntityType are present');
  } else if(!hasSystemModifications && hasGetEntityType && !sysInformed) {
    setSysInformed(true);
    sendItData().catch(console.error);
  }
  return (
    <div className="flex flex-col w-full max-w-md py-24 h-[90vh] mx-auto stretch overflow-y-scroll">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
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