import { createAI } from 'ai/rsc';
import { submitUserMessage } from './actions';

export const AI = createAI<string[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});