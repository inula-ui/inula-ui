import { useReducer } from 'openinula';

export function useForceUpdate() {
  const [, forceUpdate] = useReducer((n) => n + 1, 0);
  return forceUpdate;
}
