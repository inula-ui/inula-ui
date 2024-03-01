import { isString, isUndefined } from 'lodash';
import { useRef } from 'openinula';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type RefExtra<T = HTMLElement> = (() => T | null) | string;

export function useRefExtra(refExtra?: string): React.RefObject<HTMLElement>;
export function useRefExtra<T = HTMLElement>(refExtra?: () => T | null): React.RefObject<T>;
export function useRefExtra<T = HTMLElement>(refExtra?: RefExtra<T>): React.RefObject<T | HTMLElement>;
export function useRefExtra(refExtra?: RefExtra<any>): React.RefObject<any> {
  const ref = useRef<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(() => {
    if (!isUndefined(refExtra)) {
      ref.current = isString(refExtra) ? document.querySelector(refExtra) : refExtra();
    }
  });

  return ref;
}
