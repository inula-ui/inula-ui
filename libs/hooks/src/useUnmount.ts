import { useEffect, useRef } from 'openinula';

export function useUnmount(fn: () => any): void {
  const ref = useRef(fn);

  ref.current = fn;

  useEffect(() => () => ref.current(), []);
}
