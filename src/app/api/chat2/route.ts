import { ToolInvocation, convertToCoreMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

import { Domanda, domande } from '~/app/domande';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}


export async function POST(req: Request) {
    const { messages }: { messages: Message[] } = await req.json();
    const assistantMessage: Message[] = []
  
    const tools = domande.reduce((acc, domanda: Domanda) => {
        const options = domanda.options.map(option => option.name).filter(option => option !== undefined)
        acc[domanda.toolName] = {
            description: domanda.description,
            parameters: z.object({
                entity: z
                .enum([options[0]?? "Non dovrebbe", ...options.slice(1)])
                .describe(domanda.describe),
            }),
            execute: async ({ entity }: {entity:string}) => {
                return entity
            },
        };
        return acc;
    }, {} as Record<string, any>);

  
    const allMessages = [...messages, ...assistantMessage];
  
    const result = await streamText({
      model: openai('gpt-4o'),
      system: 'Your sole porpuse is to help user understand wich kind of entity is the user organization in, in the context of the AI ACT framework, try to be always concise and clear',
      messages: convertToCoreMessages(allMessages),
      tools
    });
  
    return result.toDataStreamResponse();
  }