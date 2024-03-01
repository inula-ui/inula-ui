import { useLayoutEffect, useEffect } from 'openinula';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
