import { createStore } from 'openinula';

import { STRING_PARSER, type AbstractParserOptions } from './parser';

const STATE = {
  language: 'en-US',
  theme: 'light',
};

const StorageStore = createStore({
  id: 'Storage',
  state: {
    language: localStorage.getItem('language') ?? STATE.language,
    theme: localStorage.getItem('theme') ?? STATE.theme,
  },
  actions: {
    setItem(state, key, value) {
      localStorage.setItem(key, value);
      (state as any)[key] = value;
    },
    removeItem(state, key) {
      localStorage.removeItem(key);
      (state as any)[key] = (STATE as any)[key];
    },
    clear(state) {
      localStorage.clear();
      for (const key of Object.keys(STATE)) {
        (state as any)[key] = (STATE as any)[key];
      }
    },
  },
});

interface UseStorageMethod<V> {
  set: (value: V) => void;
  remove: () => void;
}

export function useStorage<V>(
  key: keyof typeof STATE,
  parser: keyof AbstractParserOptions<any> = 'plain',
): { readonly value: V } & UseStorageMethod<V> {
  const { PARSER } = useStorage;

  const { serializer, deserializer } = PARSER[parser] as any;

  const store = StorageStore();

  return {
    value: deserializer(store[key]),
    set: (value) => {
      const originValue = serializer(value);
      store.setItem(key, originValue);
    },
    remove: () => {
      store.removeItem(key);
    },
  };
}

useStorage.PARSER = STRING_PARSER as AbstractParserOptions<any>;
