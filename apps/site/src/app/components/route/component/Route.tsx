import type { ComponentRouteProps } from './ComponentRoute';
import type { Lang } from '@inula-ui/components/types';

import { createElement } from 'openinula';

import { ComponentRoute } from './ComponentRoute';
import { useStorage } from '../../../hooks';

export function Route(props: { 'en-US': ComponentRouteProps; 'zh-CN': ComponentRouteProps }): JSX.Element | null {
  const languageStorage = useStorage<Lang>('language');

  return createElement(ComponentRoute, props[languageStorage.value]);
}
