import type { AppDispatch, AppGetState } from 'app/store/store';
import { toast } from 'features/toast/toast';
import { t } from 'i18next';
import { buildRunGraphDependencies, runGraph } from 'services/api/run-graph';
import { $socket } from 'services/events/stores';
import { assert } from 'tsafe';

import { buildPromptTraductionGraph } from './graph';
import { promptTranslationApi } from './state';

export const translatePrompt = async (arg: { 
  dispatch: AppDispatch; 
  getState: AppGetState; 
  prompt?: string;
}) => {
  const { dispatch, getState, prompt } = arg;
  const socket = $socket.get();
  if (!socket) {
    return;
  }
  
  const { graph, outputNodeId } = buildPromptTraductionGraph({
    state: getState(),
    prompt,
  });
  
  const dependencies = buildRunGraphDependencies(dispatch, socket);
  
  try {
    promptTranslationApi.setPending();
    
    const { output } = await runGraph({
      graph,
      outputNodeId,
      dependencies,
      options: {
        prepend: true,
      },
    });
    
    assert(output.type === 'string_output');
    promptTranslationApi.setSuccess(output.value);
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error('Unknown error during prompt translation');
    promptTranslationApi.setError(errorObj);
    toast({
      id: 'PROMPT_TRANSLATION_FAILED',
      title: t('toast.promptTranslationFailed'),
      status: 'error',
    });
  }
};
