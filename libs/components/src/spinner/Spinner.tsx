import type { SpinnerProps } from './types';
import type { TransitionState } from '../internal/transition/types';

import { useAsync, useForceUpdate } from '@inula-ui/hooks';
import { checkNodeExist } from '@inula-ui/utils';
import { isNumber, isUndefined } from 'lodash';
import { useEffect, useRef } from 'openinula';

import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { Icon } from '../icon';
import { CircularProgress } from '../internal/circular-progress';
import { Transition } from '../internal/transition';
import { mergeCS } from '../utils';
import { TTANSITION_DURING_BASE } from '../vars';

export function Spinner(props: SpinnerProps): JSX.Element | null {
  const {
    children,
    styleOverrides,
    styleProvider,
    visible: visibleProp,
    text,
    size = 28,
    delay,
    alone = false,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('Spinner', props);

  const styled = useStyled(CLASSES, { spinner: styleProvider?.spinner }, styleOverrides);

  const async = useAsync();
  const forceUpdate = useForceUpdate();

  const spinnerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dataRef = useRef<{
    delayVisible: boolean;
  }>({
    delayVisible: false,
  });

  if (visibleProp === false) {
    dataRef.current.delayVisible = false;
  }
  const visible = isUndefined(delay) ? visibleProp : dataRef.current.delayVisible;

  useEffect(() => {
    if (isNumber(delay) && visibleProp) {
      const clearTid = async.setTimeout(() => {
        dataRef.current.delayVisible = true;
        forceUpdate();
      }, delay);

      return () => {
        clearTid();
      };
    }
  }, [async, delay, forceUpdate, visibleProp]);

  const transitionStyles: Partial<Record<TransitionState, React.CSSProperties>> = {
    enter: { opacity: 0 },
    entering: {
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms linear`).join(', '),
    },
    leaving: {
      opacity: 0,
      transition: ['opacity'].map((attr) => `${attr} ${TTANSITION_DURING_BASE}ms linear`).join(', '),
    },
    leaved: { display: 'none' },
  };

  return (
    <Transition
      enter={visible}
      during={TTANSITION_DURING_BASE}
      afterRender={() => {
        if (!alone && spinnerRef.current && containerRef.current) {
          containerRef.current.style.height = `${spinnerRef.current.offsetHeight}px`;
        }
      }}
      destroyWhenLeaved
      afterEnter={() => {
        afterVisibleChange?.(true);
      }}
      afterLeave={() => {
        afterVisibleChange?.(false);
      }}
    >
      {(state) => (
        <div
          {...restProps}
          {...mergeCS(
            styled('spinner', {
              'spinner--alone': alone,
            }),
            {
              className: restProps.className,
              style: {
                ...restProps.style,
                ...transitionStyles[state],
              },
            },
          )}
          ref={spinnerRef}
        >
          <div {...styled('spinner__container')} ref={containerRef}>
            {children !== false && (
              <div
                {...mergeCS(styled('spinner__icon'), {
                  style: { fontSize: size },
                })}
              >
                {checkNodeExist(children) ? (
                  children
                ) : (
                  <Icon>
                    <CircularProgress />
                  </Icon>
                )}
              </div>
            )}
            {checkNodeExist(text) && <div {...styled('spinner__text')}>{text}</div>}
          </div>
        </div>
      )}
    </Transition>
  );
}
