import type { ImageProps } from './types';

import { useForceUpdate } from '@inula-ui/hooks';
import { checkNodeExist } from '@inula-ui/utils';
import { Children, useRef } from 'openinula';

import { ImageAction } from './ImageAction';
import { ImagePreview } from './ImagePreview';
import { CLASSES } from './vars';
import { useComponentProps, useStyled } from '../hooks';
import { mergeCS } from '../utils';

export const Image: {
  (props: ImageProps): JSX.Element | null;
  Action: typeof ImageAction;
  Preview: typeof ImagePreview;
} = (props) => {
  const {
    styleOverrides,
    styleProvider,
    loading,
    error,
    actions,
    imgProps,

    ...restProps
  } = useComponentProps('Image', props);

  const styled = useStyled(CLASSES, { image: styleProvider?.image }, styleOverrides);

  const forceUpdate = useForceUpdate();

  const dataRef = useRef<{
    prevSrc?: string;
    isLoading: boolean;
    isError: boolean;
  }>({
    isLoading: true,
    isError: false,
  });

  if (imgProps.src !== dataRef.current.prevSrc) {
    dataRef.current.prevSrc = imgProps.src;
    dataRef.current.isLoading = true;
    dataRef.current.isError = false;
  }

  return (
    <div
      {...restProps}
      {...mergeCS(styled('image'), {
        className: restProps.className,
        style: restProps.style,
      })}
    >
      {dataRef.current.isLoading && checkNodeExist(loading) && loading}
      {dataRef.current.isError && checkNodeExist(error) && error}
      {actions && <div {...styled('image__actions')}>{Children.map(actions, (action) => action)}</div>}
      <img
        {...imgProps}
        {...mergeCS(styled('image__img'), {
          className: imgProps?.className,
          style: {
            ...imgProps?.style,
            display: (dataRef.current.isLoading && loading) || (dataRef.current.isError && error) ? 'none' : undefined,
          },
        })}
        onLoadStart={(e) => {
          // https://bugs.chromium.org/p/chromium/issues/detail?id=458851
          imgProps?.onLoadStart?.(e);

          dataRef.current.isLoading = true;
          forceUpdate();
        }}
        onLoad={(e) => {
          imgProps?.onLoad?.(e);

          dataRef.current.isLoading = false;
          forceUpdate();
        }}
        onError={(e) => {
          imgProps?.onError?.(e);

          dataRef.current.isLoading = false;
          dataRef.current.isError = true;
          forceUpdate();
        }}
      />
    </div>
  );
};

Image.Action = ImageAction;
Image.Preview = ImagePreview;
