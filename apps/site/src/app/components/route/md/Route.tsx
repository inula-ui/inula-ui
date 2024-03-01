import type { MdRouteProps } from './MdRoute';
import type { Lang } from '@inula-ui/components/types';

import { createElement } from 'openinula';

import { MdRoute } from './MdRoute';
import { useStorage } from '../../../hooks';

export function Route(props: { 'en-US': MdRouteProps; 'zh-CN': MdRouteProps }): JSX.Element | null {
  const languageStorage = useStorage<Lang>('language');

  return createElement(MdRoute, props[languageStorage.value]);
}
