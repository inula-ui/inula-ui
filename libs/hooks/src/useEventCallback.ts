import { useCallback, useRef } from 'openinula';

export function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback((...args: any[]) => ref.current(...args), []) as T;
}
