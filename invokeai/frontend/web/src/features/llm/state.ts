import { deepClone } from 'common/util/deepClone';
import { atom } from 'nanostores';

type SuccessState = {
  isSuccess: true;
  isError: false;
  isPending: false;
  result: string;
  error: null;
};

type ErrorState = {
  isSuccess: false;
  isError: true;
  isPending: false;
  result: null;
  error: Error;
};

type PendingState = {
  isSuccess: false;
  isError: false;
  isPending: true;
  result: null;
  error: null;
};

type IdleState = {
  isSuccess: false;
  isError: false;
  isPending: false;
  result: null;
  error: null;
};

export type PromptTranslationRequestState = IdleState | PendingState | SuccessState | ErrorState;

const IDLE_STATE: IdleState = {
  isSuccess: false,
  isError: false,
  isPending: false,
  result: null,
  error: null,
};

const $state = atom<PromptTranslationRequestState>(deepClone(IDLE_STATE));

const reset = () => {
  $state.set(deepClone(IDLE_STATE));
};

const setPending = () => {
  $state.set({
    ...$state.get(),
    isSuccess: false,
    isError: false,
    isPending: true,
    result: null,
    error: null,
  });
};

const setSuccess = (result: string) => {
  $state.set({
    ...$state.get(),
    isSuccess: true,
    isError: false,
    isPending: false,
    result,
    error: null,
  });
};

const setError = (error: Error) => {
  $state.set({
    ...$state.get(),
    isSuccess: false,
    isError: true,
    isPending: false,
    result: null,
    error,
  });
};

export const promptTranslationApi = {
  $state,
  reset,
  setPending,
  setSuccess,
  setError,
};
