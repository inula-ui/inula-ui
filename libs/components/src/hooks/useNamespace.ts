import { useContext } from 'openinula';

import { LContext } from '../context';

export function useNamespace() {
  const context = useContext(LContext);

  return context.namespace;
}
