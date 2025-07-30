import type { RootState } from 'app/store/store';
import { getPrefixedId } from 'features/controlLayers/konva/util';
import { selectPositivePrompt } from 'features/controlLayers/store/paramsSlice';
import { Graph } from 'features/nodes/util/graph/generation/Graph';

export const buildPromptTraductionGraph = ({
  state,
  prompt,
}: {
  state: RootState;
  prompt?: string;
}): { graph: Graph; outputNodeId: string } => {
  // Use the provided prompt or fall back to the positive prompt from state
  const promptToTranslate = prompt ?? selectPositivePrompt(state);
  
  const graph = new Graph(getPrefixedId('claude-translate-prompt-graph'));
  const outputNode = graph.addNode({
    // @ts-expect-error: These nodes are not available in the OSS application
    type: 'claude_translate_prompt',
    id: getPrefixedId('claude_translate_prompt'),
    prompt: promptToTranslate,
  });
  
  return { graph, outputNodeId: outputNode.id };
};
