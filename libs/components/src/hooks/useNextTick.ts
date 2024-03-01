import { useMount } from '@inula-ui/hooks';
import { useRef } from 'openinula';

export function useNextTick() {
  const nextTick = useRef(false);

  useMount(() => {
    nextTick.current = true;
  });

  return nextTick;
}
