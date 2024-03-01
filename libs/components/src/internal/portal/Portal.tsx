import type { PortalProps } from './types';

import { useIsomorphicLayoutEffect } from '@inula-ui/hooks';
import { isString } from 'lodash';
import { createPortal, forwardRef, useImperativeHandle, useState } from 'openinula';

export const Portal = forwardRef<HTMLElement, PortalProps>((props, ref): JSX.Element | null => {
  const { children, selector } = props;

  const [container, setContainer] = useState<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useIsomorphicLayoutEffect(() => {
    setContainer(isString(selector) ? document.querySelector(selector) : selector());
  });

  useImperativeHandle(ref, () => container, [container]);

  return container && createPortal(children, container);
});
