import type { ConfigProviderProps } from './types';

import { useContext, useMemo } from 'openinula';

import { LContextManager } from '../context';
import { LContext } from '../context';

export function ConfigProvider(props: ConfigProviderProps): JSX.Element | null {
  const { children, context: contextProp } = props;

  const parent = useContext(LContext);

  const context = useMemo<LContextManager>(() => {
    const context = new LContextManager(parent.derive(contextProp ?? {}));
    context.setParent(parent);
    return context;
  }, [contextProp, parent]);

  return <LContext.Provider value={context}>{children}</LContext.Provider>;
}
