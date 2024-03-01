import type { ModalFooterProps } from './types';
import type { ButtonProps } from '../button';

import { Children } from 'openinula';

import { CLASSES } from './vars';
import { Button } from '../button';
import { useComponentProps, useControlled, useStyled, useTranslation } from '../hooks';
import { mergeCS } from '../utils';

export function ModalFooter(props: ModalFooterProps): JSX.Element | null {
  const {
    styleOverrides,
    styleProvider,
    align = 'right',
    actions = ['cancel', 'ok'],
    cancelProps: cancelPropsProp,
    okProps: okPropsProp,
    onCancelClick,
    onOkClick,

    _onClose,

    ...restProps
  } = useComponentProps(
    'ModalFooter',
    props as ModalFooterProps & {
      _onClose: () => void;
    },
  );

  const styled = useStyled(CLASSES, { modal: styleProvider?.modal }, styleOverrides);

  const { t } = useTranslation();

  const [cancelLoading, changeCancelLoading] = useControlled<boolean>(false, cancelPropsProp?.loading);
  const [okLoading, changeOkLoading] = useControlled<boolean>(false, okPropsProp?.loading);

  const cancelProps: ButtonProps = {
    ...cancelPropsProp,
    loading: cancelLoading,
    onClick: () => {
      const shouldClose = onCancelClick?.();
      if (shouldClose instanceof Promise) {
        changeCancelLoading(true);
        shouldClose.then((val) => {
          changeCancelLoading(false);
          if (val !== false) {
            _onClose?.();
          }
        });
      } else if (shouldClose !== false) {
        _onClose?.();
      }
    },
  };

  const okProps: ButtonProps = {
    ...okPropsProp,
    loading: okLoading,
    onClick: () => {
      const shouldClose = onOkClick?.();
      if (shouldClose instanceof Promise) {
        changeOkLoading(true);
        shouldClose.then((val) => {
          changeOkLoading(false);
          if (val !== false) {
            _onClose?.();
          }
        });
      } else if (shouldClose !== false) {
        _onClose?.();
      }
    },
  };

  return (
    <div
      {...restProps}
      {...mergeCS(styled('modal__footer', `modal__footer--${align}`), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {Children.map(actions, (action) =>
        action === 'cancel' ? (
          <Button {...cancelProps} pattern={cancelProps.pattern ?? 'secondary'}>
            {cancelProps.children ?? t('Footer', 'Cancel')}
          </Button>
        ) : action === 'ok' ? (
          <Button {...okProps}>{okProps.children ?? t('Footer', 'OK')}</Button>
        ) : (
          action
        ),
      )}
    </div>
  );
}
