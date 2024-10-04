import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

import { DomandaDb } from '~/app/domande';
import { NextRequest, NextResponse } from 'next/server';
import { getDomande } from '~/server/actions';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

interface Action {
  category: string;
  value: string;
}



export async function POST(req: NextRequest) {

    const domande = await getDomande();
    const formattedDomande: DomandaDb[] = domande.map(d => ({
        ...d,
        dependencies: d.dependencies as { category: string; value: string[]; }[],
        options: d.options as { name: string; actions?: Action[] | undefined; }[]
    }));

    const { messages, data }: { messages: Message[], data: {toolIndex: number}} = await req.json();

    const tool = formattedDomande.find((domanda) => domanda.index === data.toolIndex)
    if(!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    const tools = {
      [tool.toolName]: {
          description: tool.question,
          parameters: z.object({
            entity: z
              .enum([tool.options?.[0]?.name ?? "Non dovrebbe", ...(tool.options?.slice(1) ?? []).map(option => option.name)])
              .describe(tool.describe),
          }),
          execute: async ({ entity }: {entity:string}) => {
            return entity
          },
        },
      };
  
    const result = await streamText({
      model: openai('gpt-4o'),
      system: 'Your sole porpuse is to help user understand wich kind of entity is the user organization in, in the context of the AI ACT framework, try to be always concise and clear',
      messages: messages,
      tools,
      maxSteps: 10
    });
  
    return result.toDataStreamResponse();
  }