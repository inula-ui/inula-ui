import { useEvent, useRefExtra } from '@inula-ui/hooks';
import { useContext } from 'openinula';

import { LContext } from '../context';

export function useListenGlobalScrolling(callback?: () => void, disabled = false) {
  const context = useContext(LContext);
  const windowRef = useRefExtra(() => window);

  useEvent(windowRef, 'scroll', callback, { passive: true, capture: true }, !context.listenGlobalScrolling || disabled);

  return context.listenGlobalScrolling;
}
