import { createAI } from 'ai/rsc';
import { submitUserMessage } from './actions';

export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});