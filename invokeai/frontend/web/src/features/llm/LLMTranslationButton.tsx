import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PiTranslateBold } from 'react-icons/pi';

import { IconButton, Tooltip } from '@invoke-ai/ui-library';
import { useAppDispatch, useAppSelector, useAppStore } from 'app/store/storeHooks';
import { positivePromptChanged, selectPositivePrompt } from 'features/controlLayers/store/paramsSlice';
import { useStore } from '@nanostores/react';

import { promptTranslationApi, translatePrompt } from './index';

const LLMTranslationButton = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const prompt = useAppSelector(selectPositivePrompt);
  const translationState = useStore(promptTranslationApi.$state);

  const handleTranslatePrompt = useCallback(() => {
    translatePrompt({ 
      dispatch, 
      getState: store.getState, 
      prompt 
    });
  }, [dispatch, store.getState, prompt]);

  // Effect to handle successful translation
  useEffect(() => {
    if (translationState.isSuccess && translationState.result) {
      dispatch(positivePromptChanged(translationState.result));
      promptTranslationApi.reset();
    }
  }, [dispatch, translationState.isSuccess, translationState.result]);

  return (
    <Tooltip label={t('parameters.translatePrompt')}>
      <IconButton
        size="sm"
        variant="promptOverlay"
        aria-label={t('parameters.translatePrompt')}
        icon={<PiTranslateBold />}
        onClick={handleTranslatePrompt}
        isLoading={translationState.isPending}
        isDisabled={!prompt || translationState.isPending}
      />
    </Tooltip>
  );
});

LLMTranslationButton.displayName = 'LLMTranslationButton';

export default LLMTranslationButton;