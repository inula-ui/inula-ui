import { useRefExtra } from '@inula-ui/hooks';
import { useContext } from 'openinula';

import { LContext } from '../context';

export function useLayout() {
  const context = useContext(LContext);

  const pageScrollRef = useRefExtra(context.layoutPageScrollEl ?? (() => null));
  const contentResizeRef = useRefExtra(context.layoutContentResizeEl ?? (() => null));

  return { pageScrollRef, contentResizeRef };
}
