import { api, buildV1Url } from '..';

export type LLMRequest = { text: string, model?: string, model_name? : string };
export type LLMResponse = { text: string };

export type TranslationRequest = { text: string, target_language?: string };
export type TranslationResponse = { text: string };

export const llmApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateLLMText: build.mutation<LLMResponse, LLMRequest>({
      query: (request) => ({
        url: buildV1Url('llm/generate'),
        method: 'POST',
        body: request,
      }),
    }),
    translateLLMText: build.mutation<TranslationResponse, TranslationRequest>({
      query: (request) => ({
        url: buildV1Url('llm/translate'),
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useGenerateLLMTextMutation, useTranslateLLMTextMutation } = llmApi;
