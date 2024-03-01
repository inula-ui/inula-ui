import { createStore } from 'openinula';

let _key = 0;

const Store = createStore({
  id: 'inula-ui-dialogs',
  state: {
    data: [] as { type: any; key: string | number; props: any }[],
  },
  actions: {
    open(state, type, props, key) {
      state.data = [
        {
          key,
          type,
          props: {
            ...props,
            visible: true,
            skipFirstTransition: false,
            onClose: () => {
              (props as any).onClose?.();

              DialogService.close(key);
            },
            afterVisibleChange: (visible: boolean) => {
              (props as any).afterVisibleChange?.(visible);

              if (!visible) {
                const index = state.data.findIndex((dialog) => dialog.key === key);
                if (index !== -1) {
                  state.data.splice(index, 1);
                  state.data = ([] as any[]).concat(state.data);
                }
              }
            },
          },
        },
      ].concat(state.data);
    },
    close(state, key) {
      const index = state.data.findIndex((dialog) => dialog.key === key);
      if (index !== -1) {
        state.data[index].props.visible = false;
        state.data = ([] as any[]).concat(state.data);
      }
    },
    rerender(state, key, type, props) {
      const index = state.data.findIndex((dialog) => dialog.key === key);
      if (index !== -1) {
        state.data.splice(index, 1, { key, type, props: Object.assign(state.data[index].props, props) });
        state.data = ([] as any[]).concat(state.data);
      }
    },
    closeAll(state, animation) {
      if (animation) {
        state.data.forEach((dialog) => {
          dialog.props.visible = false;
        });
        state.data = ([] as any[]).concat(state.data);
      } else {
        state.data = [];
      }
    },
  },
});
export const DialogStore = Store as any;

export interface DialogInstance<P extends object> {
  key: string | number;
  close: () => void;
  rerender: (props: P) => void;
}

export class DialogService {
  static open<P extends object>(type: React.FC<P>, props: Omit<P, 'visible'>, key?: string | number): DialogInstance<P> {
    const dialogKey = key ?? ++_key;

    const store = Store();
    store.open(type, props, dialogKey);

    return {
      key: dialogKey,
      close: () => {
        DialogService.close(dialogKey);
      },
      rerender: (props) => {
        DialogService.rerender(dialogKey, type, props);
      },
    };
  }

  static close(key: string | number) {
    const store = Store();
    store.close(key);
  }

  static rerender(key: string | number, type: any, props: any) {
    const store = Store();
    store.rerender(key, type, props);
  }

  static closeAll(animation = true) {
    const store = Store();
    store.closeAll(animation);
  }
}
