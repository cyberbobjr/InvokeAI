import { IconButton, Tooltip } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { positivePromptChanged, selectModel, selectPositivePrompt } from 'features/controlLayers/store/paramsSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt } from 'react-icons/fa';
import { useGenerateLLMTextMutation } from 'services/api/endpoints/llm';

const LLMButton = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const prompt = useAppSelector(selectPositivePrompt);
  const model = useAppSelector(selectModel);
  const [generateLLMText, { isLoading }] = useGenerateLLMTextMutation();

  const handleGenerateWithLLM = useCallback(() => {
    generateLLMText({ text: prompt, model: model?.base, model_name : model?.name }).then((response) => {
      if ('data' in response && response.data) {    
        dispatch(positivePromptChanged(response.data.text));
      }
    });
  }, [dispatch, prompt, model, generateLLMText]);

  return (
    <Tooltip label={t('parameters.invokeLLM')}>
      <IconButton
        size="sm"
        variant="promptOverlay"
        aria-label={t('parameters.invokeLLM')}
        icon={<FaBolt />}
        onClick={handleGenerateWithLLM}
        isLoading={isLoading}
      />
    </Tooltip>
  );
});

LLMButton.displayName = 'LLMButton';

export default LLMButton;