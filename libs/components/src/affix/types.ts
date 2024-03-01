import type { CloneHTMLElement } from '../types';
import type { RefExtra } from '@inula-ui/hooks/useRefExtra';

export {};

export interface AffixRef {
  sticky: boolean;
  updatePosition: () => void;
}

export interface AffixProps {
  children: React.ReactElement | ((render: CloneHTMLElement) => JSX.Element | null);
  top?: number | string;
  target?: RefExtra;
  zIndex?: number | string;
}
