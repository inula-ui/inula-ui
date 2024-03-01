import { uniqueId } from 'lodash';
import { useMemo } from 'openinula';

export function useId() {
  const id = useMemo(() => uniqueId('inula'), []);

  return id;
}
