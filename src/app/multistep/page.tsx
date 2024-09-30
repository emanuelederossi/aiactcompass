'use client';

import { useState } from 'react';
import { AI } from '../ai';
import { useActions, useUIState } from 'ai/rsc';

export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div><span className="p-2 rounded bg-green-200">TU: </span> {input}</div>,
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };

  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            className='fixed left-[50%] translate-x-[-50%] bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl'
            id='input'
            type="text"
            value={input}
            placeholder='Say something...'
            onChange={e => setInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}