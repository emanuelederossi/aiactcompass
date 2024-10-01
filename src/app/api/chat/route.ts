import { ToolInvocation, convertToCoreMessages, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  const assistantMessage: Message[] = []

  const tools = {
    getEntityType: {
      description: 'Get the type of entity the user organization is in',
      parameters: z.object({
        entity: z
          .enum(['Provider', 'Deployer', 'Distributor', 'Importer', 'Product Manufacturer', 'Authorised Representative'])
          .describe(`
          the entity type the user organization is in based on these descriptions: 
              - Provider: a natural or legal person, public authority, agency or other body that develops an AI system or a general purpose AI model (or that has an AI system or a general purpose AI model developed) and places them on the market or puts the system into service under its own name or trademark, whether for payment or free of charge;
              - Deployer: any natural or legal person, public authority, agency or other body using an AI system under its authority except where the AI system is used in the course of a personal non-professional activity;
              - Distributor: any natural or legal person in the supply chain, other than the provider or the importer, that makes an AI system available on the Union market;
              - Importer: any natural or legal person located or established in the Union that places on the market an AI system that bears the name or trademark of a natural or legal person established outside the Union;
              - Authorised representative: any natural or legal person located or established in the Union who has received and accepted a written mandate from a provider of an AI system or a general purpose AI model to, respectively, perform and carry out on its behalf the obligations and procedures established by this Regulation.
              - Product manufacturer: places on the market or puts into service an AI system together with their product and under their own name or trademark;            
          `),
      }),
      execute: async ({ entity }: {entity:string}) => {
        if (!entity) {
          return {content: 'No entity provided', result: 'No entity provided'};
        }                
        return {content: `The user organization is a ${entity}`, result: entity};
      },
    },
    systemModifications: {
      description: `
        Possible shift of entity type to Provider if the user organization does one of those actions;
        Evaluate TRUE if the user organization does one of those actions, FALSE if not, or No action provided as a default value
      `,
      parameters: z.object({
        action: z
          .enum(['true', 'false', 'No action provided'])
          .describe(`
                  the action the user organization does that may shift their entity type to Provider:
                  - Puts their name on an existing system, 
                  - Makes significant changes to a system (so that it differs form the original version in a relevant way), 
                  - Modifies the intended purpose of a system.                    
                  `)
      }),
      execute: async ({ action }: {action:string}) => {
        console.log('EXECUTING')
        if (action === 'true') {
          return {content: 'The user organization is now a Provider', result: action};
        }
        if (action === 'false') {
          return {content: 'SAFE, unchanged entity type', result: action};
        }
        return {content: 'No edit provided', result: action};
      },
    },
    checkTerritorialScope: {
      description: 'Check if the user organization is within the territorial scope of the AI ACT',
      parameters: z.object({
        scope: z
          .enum(['INSIDE', 'OUTSIDE', 'No scope provided'])
          .describe(`
                  the territorial scope the user organization is in based on these descriptions: 
                  1- I am established or located within the EU;
                  2- My AI system's output is used in the EU;
                  3- My AI system is located in a non-EU country where 'EU Member State Law' applies by virtue of public international law; 
                  4- No scope provided: if the user organization is not in any of the above territories.

                  evaluate INSIDE if the user organization is within the territorial scope of the AI ACT (1, 2 or 3), OUTSIDE if not (4), or No scope provided as a default value
                  `),
      }),
      execute: async ({ scope }: {scope: string}) => {
        if (!scope) {
          return {content: 'No scope provided', result: 'No scope provided'};
        }
        return {content: `territorial scope: ${scope}`, result: scope};
      },
    },
    checkExludedSystems: {
      description: 'Check if the user organization system is excluded from the AI ACT',
      parameters: z.object({
        excluded: z
          .enum(['true', 'false', 'No exclusion provided'])
          .describe(`
                  If ANY of the following apply to the user organization's AI system, evaluate TRUE, otherwise FALSE:
                  - The AI systems developed and used exclusively for military purposes
                  - AI systems used by public authorities or international organisations in third countries for law enforcement and judicial cooperation
                  - AI research and development activity
                  - AI components provided under free and open-source licences
                  - People using AI systems for purely personal, nonprofessional activity
                `),
      }),
      execute: async ({ excluded }: {excluded: string}) => {
        if (excluded === 'true') {
          return {content: 'The AI system is excluded from the AI ACT', result: excluded};
        }
        if (excluded === 'false') {
          return {content: 'The AI system is not excluded from the AI ACT', result: excluded};
        }
        return {content: 'No exclusion provided', result: excluded};
      },
    },
  };

  const allMessages = [...messages, ...assistantMessage];

  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'Your sole porpuse is to help user understand wich kind of entity is the user organization in, in the context of the AI ACT framework, try to be always concise and clear',
    messages: convertToCoreMessages(allMessages),
    tools
  });

  return result.toDataStreamResponse();
}