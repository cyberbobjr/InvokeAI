import { IconButton, Tooltip } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { positivePromptChanged, selectPositivePrompt } from 'features/controlLayers/store/paramsSlice';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PiTranslateBold } from 'react-icons/pi'; // Using a different icon for translation
import { useTranslateLLMTextMutation } from 'services/api/endpoints/llm';

const LLMTranslationButton = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const prompt = useAppSelector(selectPositivePrompt);
  const [translateLLMText, { isLoading }] = useTranslateLLMTextMutation();

  const handleTranslatePrompt = useCallback(() => {
    // You might want to add a way to select the target language, for now, let's default to English
    const targetLanguage = 'English'; 
    translateLLMText({ text: prompt, target_language: targetLanguage }).then((response) => {
      if ('data' in response && response.data) {
        dispatch(positivePromptChanged(response.data.text));
      }
    });
  }, [dispatch, prompt, translateLLMText]);

  return (
    <Tooltip label={t('parameters.translatePrompt')}>
      <IconButton
        size="sm"
        variant="promptOverlay"
        aria-label={t('parameters.translatePrompt')}
        icon={<PiTranslateBold />}
        onClick={handleTranslatePrompt}
        isLoading={isLoading}
      />
    </Tooltip>
  );
});

LLMTranslationButton.displayName = 'LLMTranslationButton';

export default LLMTranslationButton;