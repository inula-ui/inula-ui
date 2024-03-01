import { createContext } from 'openinula';

export const CLASSES = {
  drawer: '^drawer',
  'drawer--top': '^drawer--top',
  'drawer--right': '^drawer--right',
  'drawer--bottom': '^drawer--bottom',
  'drawer--left': '^drawer--left',
  drawer__content: '^drawer__content',
  drawer__header: '^drawer__header',
  'drawer__header-title': '^drawer__header-title',
  'drawer__header-actions': '^drawer__header-actions',
  drawer__body: '^drawer__body',
  drawer__footer: '^drawer__footer',
  'drawer__footer--left': '^drawer__footer--left',
  'drawer__footer--center': '^drawer__footer--center',
  'drawer__footer--right': '^drawer__footer--right',
};

export const DrawerContext = createContext<
  {
    uniqueId: string;
    placement: 'top' | 'right' | 'bottom' | 'left';
  }[]
>([]);
