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
  skip: {tool: string, exclude: string[]}[];
}


export default function Chat() {
  
  const initalState:ToolDb[] = [
    {index: 1, toolName: 'getEntityType', informed: false, alreadyAsked: true, skip: []},
    {index: 2, toolName: 'systemModifications', informed: false, alreadyAsked: false, skip: [{tool: "getEntityType", exclude: ["Provider"]}]},
    {index: 3, toolName: 'checkTerritorialScope', informed: false, alreadyAsked: false, skip: []},
    {index: 4, toolName: 'checkExludedSystems', informed: false, alreadyAsked: false, skip: []},
  ]

  const scrollContRef = useRef<HTMLDivElement>(null);
  const [completitionFinished, setCompletitionFinished] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);


  const [toolCalled, setToolCalled] = useState<ToolDb[]>(initalState); 

  const { messages, input, setInput, append } = useChat({
    api: '/api/chat',
    onFinish: () => setCompletitionFinished(!completitionFinished),
    initialMessages: [
      { role: 'assistant', content: 'Hello! How can I help you today?', id: '1' },
    ]
  });
  

  const toolInvocations: ToolInvocation[] = messages.flatMap(m => m.toolInvocations ?? []);
  const toolInvocationsCopy: ToolInvocation[] = [...toolInvocations];
  const lastToolInvocationForCategory = (toolName: string) => toolInvocationsCopy.filter(tool => tool.toolName === toolName).pop();
  const lastToolInvocationForCategoryFromArray = (toolName: string, invocationArray: ToolInvocation[]) => invocationArray.filter(tool => tool.toolName === toolName).pop();

  const [domToolInvocations, setDomToolInvocations] = useState<ToolInvocation[]>([]);

    // REINSERT SKIPPED TOOLS IF SECOND REQUEST (PER TONRARE INDIETRO INSOMMA AD ALTRO QUESTO USEFFECT NON SERVE)
    useEffect(() => {
      // loop through all tools and check if they have been called
      toolCalled.forEach(tool => {
        // get the last invocation for the tool
        const lastInvocation = lastToolInvocationForCategory(tool.toolName);
        // check if the last invocation was a result
        if(lastInvocation && lastInvocation.state === 'result' && !domToolInvocations.some(invocation => invocation.toolCallId === lastInvocation.toolCallId)){
          // check if the tool has already been called before, searching for the toolName in the domToolInvocations
          if(domToolInvocations.some(invocation => invocation.toolName === tool.toolName)){            
            // if the tool has already been called, update the related DOM element
            setDomToolInvocations(prev => prev.map(invocation => invocation.toolName === lastInvocation.toolName ? lastInvocation : invocation))
            // reinsert skipped tools in toolCalled
            const skipTool = initalState.filter(skipTool => skipTool.skip.some(skip => skip.tool === tool.toolName));
            console.log("skip", skipTool)
            if(skipTool){
              skipTool.forEach(skipTool => {
                setToolCalled(prevTools => [
                  ...prevTools.map(tool => tool.index > (initalState.find(tool => tool.toolName === skipTool.toolName)?.index ?? (toolCalled.length + 1)) ? {...tool, alreadyAsked: false, informed: false} : 
                  tool.alreadyAsked !== tool.informed ? {...tool, alreadyAsked: false} : tool
                ),
                  { 
                    index: initalState.find(tool => tool.toolName === skipTool.toolName)?.index ?? toolCalled.length + 1,
                    toolName: skipTool.toolName, informed: false, alreadyAsked: false, skip: initalState.find(tool => tool.toolName === skipTool.toolName)?.skip ?? []}])
              })
            }
          }else{
            setDomToolInvocations(prev => [...prev, lastInvocation])
          }
        }
      })      
    }, [toolCalled])

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
        setToolCalled(prevTools => prevTools.map(tool => tool.toolName === invocation.toolName ? {...tool, informed: true} : tool))
      }
    }   
  }, [completitionFinished])  

  // GET THE CHAT TO ASK FOR TOOL OR SKIP
  useEffect(() => {
    const firstUninformedTool = toolCalled.sort((a, b) => a.index - b.index).find(tool => !tool.informed);    
    if(firstUninformedTool && !firstUninformedTool.alreadyAsked){
      // check fpr skip
      const skip = firstUninformedTool.skip;
      // get all tools that are closed and have a result
      const toolInvocationsClosed = toolInvocations.filter(tool => tool.state === 'result' && 'result' in tool);     
      // get all different toolsnames
      const toolNames = toolInvocationsClosed.map(tool => tool.toolName);
      // remove duplicates
      const uniqueToolNames = [...new Set(toolNames)]; 
      // check if there are any exclusions
      const lastInvocationsFiltered: ToolInvocation[] = []
      uniqueToolNames.forEach(tool => {
        const lastTool = lastToolInvocationForCategoryFromArray(tool, toolInvocationsClosed)
        if(lastTool)
        lastInvocationsFiltered.push(lastTool)
      })
      const areThereExclusions = lastInvocationsFiltered.filter(tool => skip.some(skipTool => skipTool.tool === tool.toolName && skipTool.exclude.includes(tool.result?.result as string))).map(
        tool => tool.result?.result
      );          
      if(areThereExclusions.length > 0){
        // remove the tool from the list and remove it from the dom
        setDomToolInvocations(prev => prev.filter(invocation => invocation.toolName !== firstUninformedTool.toolName))
        setToolCalled(prevTools => prevTools.filter(tool => tool.toolName !== firstUninformedTool.toolName));
        return;
      }else{        
        setToolCalled(prevTools => prevTools.map(tool => tool.toolName === firstUninformedTool.toolName ? {...tool, alreadyAsked: true} : tool))
        sendItData(firstUninformedTool.toolName).catch(console.error);
      }
    }
  }, [toolCalled])

  useEffect(() => {
    if(toolCalled.every(tool => tool.informed)){
      setHasFinished(true);
    }
  }, [toolCalled])
  
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
        {domToolInvocations.map((invocation, i) => (
          'result' in invocation && invocation.result?.content !== 'No edit provided' && ( 
          <div key={invocation.toolCallId} className="whitespace-pre-wrap bg-red-600 p-2 text-white uppercase">
            {invocation.result!.content || 'No result available'}
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