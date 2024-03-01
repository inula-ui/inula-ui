import type { WaveProps, WaveRef } from './types';

import { useEventCallback } from '@inula-ui/hooks';
import { forwardRef, useImperativeHandle, useState } from 'openinula';

import { CLASSES } from './vars';
import { useNamespace, useStyled } from '../../hooks';
import { mergeCS } from '../../utils';

export const Wave = forwardRef<WaveRef, WaveProps>((props, ref): JSX.Element | null => {
  const {
    color,

    ...restProps
  } = props;

  const namespace = useNamespace();
  const styled = useStyled(CLASSES, { wave: undefined });

  const [node, setNode] = useState<JSX.Element | null>(null);

  const wave = useEventCallback(() => {
    setNode(
      <div
        {...restProps}
        {...mergeCS(styled('wave'), {
          className: restProps.className,
          style: {
            ...restProps.style,
            color,
          },
        })}
        key={Math.random()}
        onAnimationEnd={(e) => {
          if (e.animationName === `${namespace}-wave-fade-out`) {
            setNode(null);
          }
        }}
      />,
    );
  });

  useImperativeHandle(ref, () => wave, [wave]);

  return node;
});
