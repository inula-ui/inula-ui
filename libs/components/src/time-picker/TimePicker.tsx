import type { TimePickerProps, TimePickerRef } from './types';

import { useAsync, useEvent, useEventCallback, useForceUpdate, useForkRef, useImmer, useResize } from '@inula-ui/hooks';
import CancelFilled from '@material-design-icons/svg/filled/cancel.svg?react';
import AccessTimeOutlined from '@material-design-icons/svg/outlined/access_time.svg?react';
import SwapHorizOutlined from '@material-design-icons/svg/outlined/swap_horiz.svg?react';
import { isNull, isUndefined } from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'openinula';

import { TimePickerPanel } from './internal/TimePickerPanel';
import { deepCompareDate, orderTime } from './utils';
import { CLASSES } from './vars';
import { Button } from '../button';
import dayjs from '../dayjs';
import {
  useComponentProps,
  useControlled,
  useDesign,
  useJSS,
  useLayout,
  useListenGlobalScrolling,
  useMaxIndex,
  useNamespace,
  useScopedProps,
  useStyled,
  useTranslation,
} from '../hooks';
import { Icon } from '../icon';
import { Portal } from '../internal/portal';
import { Transition } from '../internal/transition';
import { ROOT_DATA } from '../root/vars';
import { getVerticalSidePosition, mergeCS } from '../utils';
import { TTANSITION_DURING_POPUP, WINDOW_SPACE } from '../vars';

export const TimePicker = forwardRef<TimePickerRef, TimePickerProps>((props, ref): JSX.Element | null => {
  const {
    styleOverrides,
    styleProvider,
    formControl,
    model,
    defaultModel,
    visible: visibleProp,
    defaultVisible,
    placeholder,
    range = false,
    format = 'HH:mm:ss',
    order: orderProp = 'ascend',
    clearable: clearableProp = false,
    size: sizeProp,
    disabled: disabledProp = false,
    config,
    escClosable = true,
    inputRef,
    inputRender,
    onModelChange,
    onVisibleChange,
    onClear,
    afterVisibleChange,

    ...restProps
  } = useComponentProps('TimePicker', props);

  const namespace = useNamespace();
  const styled = useStyled(
    CLASSES,
    { 'time-picker': styleProvider?.['time-picker'], 'time-picker-popup': styleProvider?.['time-picker-popup'] },
    styleOverrides,
  );
  const sheet = useJSS<'position'>();

  const { t } = useTranslation();
  const forceUpdate = useForceUpdate();
  const async = useAsync();

  const { pageScrollRef, contentResizeRef } = useLayout();

  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputLeftRef = useRef<HTMLInputElement>(null);
  const inputRightRef = useRef<HTMLInputElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const combineInputLeftRef = useForkRef(inputLeftRef, inputRef?.[0]);
  const combineInputRightRef = useForkRef(inputRightRef, inputRef?.[1]);
  const panelRef = useRef<(date: Date) => void>(null);

  const dataRef = useRef<{
    clearTid?: () => void;
    latestFocused: 'start' | 'end';
    onceVisible: boolean;
    focusAnother: boolean;
    inputValue: [string?, string?];
    rangeDate: [Date | null, Date | null];
  }>({
    latestFocused: 'start',
    onceVisible: false,
    focusAnother: false,
    inputValue: [undefined, undefined],
    rangeDate: [null, null],
  });

  const order = (date: [Date, Date]) => orderTime(date, orderProp);

  const [visible, changeVisible] = useControlled<boolean>(defaultVisible ?? false, visibleProp, onVisibleChange);

  const [focused, setFocused] = useImmer<[boolean, boolean]>([false, false]);
  if (focused[0]) {
    dataRef.current.latestFocused = 'start';
  }
  if (focused[1]) {
    dataRef.current.latestFocused = 'end';
  }

  const [_value, _changeValue] = useControlled<Date | [Date, Date] | null>(
    defaultModel ?? null,
    model,
    onModelChange,
    (a, b) => deepCompareDate(a, b, format),
    formControl?.control,
  );
  let [valueLeft, valueRight = null] = range ? (_value as [Date, Date] | null) ?? [null, null] : [_value as Date | null, null];
  if (range) {
    if (isNull(_value)) {
      [valueLeft, valueRight] = dataRef.current.rangeDate;
    } else {
      dataRef.current.rangeDate = [null, null];
    }
  }
  const inputValue = [0, 1].map((index) =>
    focused[index] && !isUndefined(dataRef.current.inputValue[index])
      ? (dataRef.current.inputValue[index] as string)
      : (() => {
          const value = index === 0 ? valueLeft : valueRight;
          return isNull(value) ? '' : dayjs(value).format(format);
        })(),
  );
  const changeValue = (date: Date) => {
    const index = focused.findIndex((f) => f);
    if (range) {
      if (isNull(_value)) {
        dataRef.current.rangeDate[index] = date;
        if (dataRef.current.rangeDate.every((v) => !isNull(v))) {
          dataRef.current.focusAnother = order(dataRef.current.rangeDate as [Date, Date]);
          if (dataRef.current.focusAnother) {
            dataRef.current.rangeDate.reverse();
          }
          dataRef.current.inputValue = [undefined, undefined];
          _changeValue(dataRef.current.rangeDate as [Date, Date]);
        }
      } else {
        dataRef.current.inputValue = [undefined, undefined];
        _changeValue((draft) => {
          (draft as [Date, Date])[index] = date;
          dataRef.current.focusAnother = order(draft as [Date, Date]);
          if (dataRef.current.focusAnother) {
            (draft as [Date, Date]).reverse();
          }
        });
      }
    } else {
      dataRef.current.inputValue = [undefined, undefined];
      _changeValue(date);
    }
    forceUpdate();
  };

  const [placeholderLeft = t('TimePicker', range ? 'Start time' : 'Select time'), placeholderRight = t('TimePicker', 'End time')] = range
    ? (placeholder as [string?, string?] | undefined) ?? []
    : [placeholder as string | undefined];

  const { size, disabled } = useScopedProps({ size: sizeProp, disabled: disabledProp || formControl?.control.disabled });

  const maxZIndex = useMaxIndex(visible);
  const zIndex = `calc(var(--${namespace}-zindex-fixed) + ${maxZIndex})`;

  const transformOrigin = useRef<string>();
  const updatePosition = useEventCallback(() => {
    if (visible && boxRef.current && popupRef.current) {
      const height = popupRef.current.offsetHeight;
      const maxWidth = ROOT_DATA.windowSize.width - WINDOW_SPACE * 2;
      const width = Math.min(popupRef.current.scrollWidth, maxWidth);
      const position = getVerticalSidePosition(
        boxRef.current,
        { width, height },
        {
          placement: 'bottom-left',
          inWindow: WINDOW_SPACE,
        },
      );
      transformOrigin.current = position.transformOrigin;
      if (sheet.classes.position) {
        popupRef.current.classList.toggle(sheet.classes.position, false);
      }
      sheet.replaceRule('position', {
        top: position.top,
        left: position.left,
        maxWidth,
      });
      popupRef.current.classList.toggle(sheet.classes.position, true);
    }
  });

  const listenGlobalScrolling = useListenGlobalScrolling(updatePosition, !visible);
  useEvent(pageScrollRef, 'scroll', updatePosition, { passive: true }, !visible || listenGlobalScrolling);

  useResize(boxRef, updatePosition, undefined, !visible);
  useResize(popupRef, updatePosition, undefined, !visible);
  useResize(contentResizeRef, updatePosition, undefined, !visible);

  useImperativeHandle(
    ref,
    () => ({
      updatePosition,
    }),
    [updatePosition],
  );

  useEffect(() => {
    if (boxRef.current && indicatorRef.current) {
      let focus = false;
      const boxRect = boxRef.current.getBoundingClientRect();
      if (inputLeftRef.current && document.activeElement === inputLeftRef.current) {
        const rect = inputLeftRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (inputRightRef.current && document.activeElement === inputRightRef.current) {
        const rect = inputRightRef.current.getBoundingClientRect();
        indicatorRef.current.style.cssText = `left:${rect.left - boxRect.left}px;width:${rect.width}px;opacity:1;`;
        focus = true;
      }
      if (!focus) {
        indicatorRef.current.style.cssText += 'opacity:0;';
      }
    }
  });

  useEffect(() => {
    if (dataRef.current.focusAnother && document.activeElement) {
      const el = document.activeElement.parentElement as HTMLElement;
      for (let index = 0; index < el.childElementCount; index++) {
        const element = el.children.item(index) as HTMLElement;
        if (element.tagName.toLowerCase() === 'input' && element !== document.activeElement) {
          element.focus({ preventScroll: true });
          break;
        }
      }
    }
    dataRef.current.focusAnother = false;
  });

  const handleEnter = (time: Date) => {
    if (range) {
      const index = focused.findIndex((f) => f);
      if (isNull(index === 0 ? valueRight : valueLeft)) {
        dataRef.current.focusAnother = true;
        forceUpdate();
      } else {
        changeVisible(false);
      }
    } else {
      changeVisible(false);
    }
    if (!dataRef.current.focusAnother) {
      panelRef.current?.(time);
    }
  };

  const clearable = clearableProp && !isNull(_value) && !visible && !disabled;
  const inputNode = (isLeft: boolean) => {
    const index = isLeft ? 0 : 1;
    const value = isLeft ? valueLeft : valueRight;
    const render = inputRender?.[index];
    const node = (
      <input
        {...styled('time-picker__input')}
        {...formControl?.inputAria}
        ref={isLeft ? combineInputLeftRef : combineInputRightRef}
        type="text"
        autoComplete="off"
        value={inputValue[index]}
        size={10}
        placeholder={isLeft ? placeholderLeft : placeholderRight}
        disabled={disabled}
        onChange={(e) => {
          forceUpdate();
          dataRef.current.inputValue[index] = e.currentTarget.value;

          if (dayjs(e.currentTarget.value, format, true).isValid()) {
            const date = dayjs(e.currentTarget.value, format).toDate();
            changeValue(date);
            panelRef.current?.(date);
          }
        }}
        onKeyDown={(e) => {
          if (e.code === 'Escape') {
            if (visible && escClosable) {
              e.stopPropagation();
              e.preventDefault();
              changeVisible(false);
            }
          } else if (e.code === 'Enter' && inputValue[index] && dayjs(inputValue[index], format, true).isValid()) {
            e.preventDefault();
            const time = dayjs(inputValue[index], format).toDate();
            handleEnter(time);
          }
        }}
        onFocus={() => {
          dataRef.current.clearTid?.();
          setFocused((draft) => {
            draft.fill(false);
            draft[isLeft ? 0 : 1] = true;
          });
          dataRef.current.inputValue = [undefined, undefined];

          if (visible && range && value) {
            panelRef.current?.(value);
          }
        }}
        onBlur={() => {
          dataRef.current.clearTid = async.setTimeout(() => {
            setFocused([false, false]);
            changeVisible(false);
          }, 20);
        }}
      />
    );

    return render ? render(node) : node;
  };

  const preventBlur: React.MouseEventHandler = (e) => {
    if (
      (document.activeElement === inputLeftRef.current || document.activeElement === inputRightRef.current) &&
      e.target !== inputLeftRef.current &&
      e.target !== inputRightRef.current &&
      e.button === 0
    ) {
      e.preventDefault();
    }
  };

  const designProps = useDesign({ compose: { disabled }, form: formControl });

  return (
    <>
      <div
        {...restProps}
        {...mergeCS(
          styled('time-picker', `time-picker--${size}`, {
            'time-picker.is-disabled': disabled,
          }),
          {
            className: restProps.className,
            style: restProps.style,
          },
        )}
        {...designProps}
        ref={boxRef}
        onMouseDown={(e) => {
          restProps.onMouseDown?.(e);

          preventBlur(e);
        }}
        onMouseUp={(e) => {
          restProps.onMouseUp?.(e);

          preventBlur(e);
        }}
        onClick={(e) => {
          restProps.onClick?.(e);

          if (!focused.some((f) => f)) {
            inputLeftRef.current?.focus({ preventScroll: true });
          }
          changeVisible(true);
        }}
      >
        {inputNode(true)}
        {range && (
          <>
            <div {...styled('time-picker__indicator')} ref={indicatorRef} />
            <div {...styled('time-picker__separator')}>
              <Icon>
                <SwapHorizOutlined />
              </Icon>
            </div>
            {inputNode(false)}
          </>
        )}
        {clearable && (
          <div
            {...styled('time-picker__clear')}
            role="button"
            aria-label={t('Clear')}
            onClick={(e) => {
              e.stopPropagation();

              dataRef.current.inputValue = [undefined, undefined];
              _changeValue(null);
              onClear?.();
            }}
          >
            <Icon>
              <CancelFilled />
            </Icon>
          </div>
        )}
        <div
          {...mergeCS(styled('time-picker__icon'), {
            style: { visibility: clearable ? 'hidden' : undefined },
          })}
        >
          <Icon>
            <AccessTimeOutlined />
          </Icon>
        </div>
      </div>
      <Portal
        selector={() => {
          let el = document.getElementById(`${namespace}-time-picker-root`);
          if (!el) {
            el = document.createElement('div');
            el.id = `${namespace}-time-picker-root`;
            document.body.appendChild(el);
          }
          return el;
        }}
      >
        <Transition
          enter={visible}
          during={TTANSITION_DURING_POPUP}
          afterRender={() => {
            updatePosition();

            const cb = () => {
              const value = focused[0] ? valueLeft : valueRight;
              if (value) {
                panelRef.current?.(value);
              }
            };
            if (range) {
              cb();
            } else if (!dataRef.current.onceVisible) {
              dataRef.current.onceVisible = true;
              cb();
            }
          }}
          afterEnter={() => {
            afterVisibleChange?.(true);
          }}
          afterLeave={() => {
            afterVisibleChange?.(false);
          }}
        >
          {(state) => {
            let transitionStyle: React.CSSProperties = {};
            switch (state) {
              case 'enter':
                transitionStyle = { transform: 'scaleY(0.7)', opacity: 0 };
                break;

              case 'entering':
                transitionStyle = {
                  transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-out`).join(', '),
                  transformOrigin: transformOrigin.current,
                };
                break;

              case 'leaving':
                transitionStyle = {
                  transform: 'scaleY(0.7)',
                  opacity: 0,
                  transition: ['transform', 'opacity'].map((attr) => `${attr} ${TTANSITION_DURING_POPUP}ms ease-in`).join(', '),
                  transformOrigin: transformOrigin.current,
                };
                break;

              case 'leaved':
                transitionStyle = { display: 'none' };
                break;

              default:
                break;
            }

            return (
              <div
                {...mergeCS(styled('time-picker-popup'), {
                  style: {
                    zIndex,
                    ...transitionStyle,
                  },
                })}
                ref={popupRef}
                onMouseDown={(e) => {
                  preventBlur(e);
                }}
                onMouseUp={(e) => {
                  preventBlur(e);
                }}
              >
                <TimePickerPanel
                  ref={panelRef}
                  styled={styled}
                  time={dataRef.current.latestFocused === 'start' ? valueLeft : valueRight}
                  format={format}
                  config={config ? (...args) => config(...args, dataRef.current.latestFocused, [valueLeft, valueRight]) : undefined}
                  onTimeChange={(time) => {
                    changeValue(time);
                  }}
                />
                <div {...styled('time-picker__footer')}>
                  <Button
                    pattern="link"
                    onClick={() => {
                      const now = new Date();
                      changeValue(now);
                      handleEnter(now);
                    }}
                  >
                    {t('TimePicker', 'Now')}
                  </Button>
                </div>
              </div>
            );
          }}
        </Transition>
      </Portal>
    </>
  );
});
