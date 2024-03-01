import type { CascaderSearchPanelItem } from './types';
import type { Styled } from '../../hooks/useStyled';
import type { VirtualScrollOptimization } from '../../virtual-scroll/types';
import type { CascaderItem } from '../types';
import type { CLASSES } from '../vars';

import { useEventCallback } from '@inula-ui/hooks';
import { scrollIntoViewIfNeeded } from '@inula-ui/utils';
import { isNumber, isUndefined } from 'lodash';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'openinula';

import { Checkbox } from '../../checkbox';
import { Empty } from '../../empty';
import { getTreeNodeLabel } from '../../tree/utils';
import { TREE_NODE_KEY } from '../../tree/vars';
import { VirtualScroll, type VirtualScrollRef } from '../../virtual-scroll';

interface CascaderSearchPanelProps<V extends React.Key, T extends CascaderItem<V>> {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  id: string;
  list: CascaderSearchPanelItem<V, T>[];
  customItem: ((item: T) => React.ReactNode) | undefined;
  itemId: (value: V) => string;
  itemFocused: CascaderSearchPanelItem<V, T> | undefined;
  multiple: boolean;
  onlyLeafSelectable: boolean;
  virtual: boolean | number;
  focusVisible: boolean;
  onClick: (item: CascaderSearchPanelItem<V, T>) => void;
}

function CascaderSearchPanelFC<V extends React.Key, T extends CascaderItem<V>>(
  props: CascaderSearchPanelProps<V, T>,
  ref: React.ForwardedRef<any>,
): JSX.Element | null {
  const { namespace, styled, id, list, customItem, itemId, itemFocused, multiple, onlyLeafSelectable, virtual, focusVisible, onClick } =
    props;

  const listRef = useRef<HTMLUListElement>(null);
  const vsRef = useRef<VirtualScrollRef<CascaderSearchPanelItem<V, T>>>(null);

  const handleKeyDown = useEventCallback((code: any) => {
    if (listRef.current) {
      let item: CascaderSearchPanelItem<V, T> | undefined;
      switch (code) {
        case 'next':
          item = vsRef.current?.scrollToStep(listRef.current, 1);
          break;

        case 'prev':
          item = vsRef.current?.scrollToStep(listRef.current, -1);
          break;

        case 'first':
          item = vsRef.current?.scrollToStart(listRef.current);
          break;

        case 'last':
          item = vsRef.current?.scrollToEnd(listRef.current);
          break;

        default:
          if (code instanceof HTMLElement && listRef.current) {
            scrollIntoViewIfNeeded(code, listRef.current);
          }
          break;
      }
      return item;
    }
  });

  useImperativeHandle(ref, () => handleKeyDown, [handleKeyDown]);

  const vsProps = useMemo<VirtualScrollOptimization<CascaderSearchPanelItem<V, T>>>(
    () => ({
      list,
      itemKey: (item) => item.value,
      itemSize: isNumber(virtual) ? virtual : 32,
      itemFocusable: (item) => item[TREE_NODE_KEY].enabled,
    }),
    [list, virtual],
  );

  return (
    <VirtualScroll
      {...vsProps}
      ref={vsRef}
      enable={virtual !== false}
      listSize={264}
      listPadding={4}
      itemRender={(item, index, props) => {
        const node = item[TREE_NODE_KEY];
        let inSelected = node.checked;
        if (!onlyLeafSelectable) {
          let n = node;
          while (n.parent) {
            n = n.parent;
            if (n.id === item.value) {
              inSelected = true;
              break;
            }
          }
        }

        return (
          <li
            {...styled('cascader__option', {
              'cascader__option.is-selected': !multiple && inSelected,
              'cascader__option.is-disabled': node.disabled,
            })}
            {...props}
            key={item.value}
            id={itemId(item.value)}
            title={item.label}
            role="option"
            aria-selected={node.checked}
            aria-disabled={node.disabled}
            onClick={() => {
              onClick(item);
            }}
          >
            {focusVisible && itemFocused?.value === item.value && <div className={`${namespace}-focus-outline`} />}
            {multiple && (
              <div {...styled('cascader__option-prefix')}>
                <Checkbox model={node.checked} disabled={node.disabled} />
              </div>
            )}
            <div {...styled('cascader__option-content')}>{customItem ? customItem(node.origin) : getTreeNodeLabel(node)}</div>
          </li>
        );
      }}
      itemFocused={itemFocused?.value}
      placeholder="li"
    >
      {(vsList, onScroll) => (
        <ul
          {...styled('cascader__list')}
          ref={listRef}
          id={id}
          tabIndex={-1}
          role="listbox"
          aria-multiselectable={multiple}
          aria-activedescendant={isUndefined(itemFocused) ? undefined : itemId(itemFocused.value)}
          onScroll={onScroll}
        >
          {list.length === 0 ? <Empty style={{ padding: '12px 28px' }} image={Empty.SIMPLE_IMG} /> : vsList}
        </ul>
      )}
    </VirtualScroll>
  );
}

export const CascaderSearchPanel: <V extends React.Key, T extends CascaderItem<V>>(
  props: CascaderSearchPanelProps<V, T> & React.RefAttributes<any>,
) => ReturnType<typeof CascaderSearchPanelFC> = forwardRef(CascaderSearchPanelFC) as any;
