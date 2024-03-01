import type { Styled } from '../../hooks/useStyled';
import type { VirtualScrollOptimization } from '../../virtual-scroll/types';
import type { TransferItem } from '../types';

import { useId } from '@inula-ui/hooks';
import { checkNodeExist } from '@inula-ui/utils';
import SearchOutlined from '@material-design-icons/svg/outlined/search.svg?react';
import { isNumber } from 'lodash';
import { useCallback, useMemo, useRef } from 'openinula';

import { Checkbox } from '../../checkbox';
import { Empty } from '../../empty';
import { useTranslation } from '../../hooks';
import { Icon } from '../../icon';
import { Input } from '../../input';
import { CircularProgress } from '../../internal/circular-progress';
import { VirtualScroll, type VirtualScrollRef } from '../../virtual-scroll';
import { IS_SELECTED, type CLASSES } from '../vars';

export interface TransferPanelProps<V extends React.Key, T extends TransferItem<V>> {
  namespace: string;
  styled: Styled<typeof CLASSES>;
  list: T[];
  selectedCount: number;
  state: boolean | 'mixed';
  title: React.ReactNode;
  loading: boolean;
  searchable: boolean;
  virtual: boolean | number;
  customItem: ((item: T) => React.ReactNode) | undefined;
  onSelectedChange: (value: V) => void;
  onAllSelectedChange: (selected: boolean) => void;
  onSearch: (value: string) => void;
  onScrollBottom: () => void;
}

export function TransferPanel<V extends React.Key, T extends TransferItem<V>>(props: TransferPanelProps<V, T>): JSX.Element | null {
  const {
    namespace,
    styled,
    list,
    selectedCount,
    state,
    title,
    loading,
    searchable,
    virtual,
    customItem,
    onSelectedChange,
    onAllSelectedChange,
    onSearch,
    onScrollBottom,
  } = props;

  const { t } = useTranslation();

  const vsRef = useRef<VirtualScrollRef<T>>(null);

  const uniqueId = useId();
  const getItemId = (val: V) => `${namespace}-transfer-item-${val}-${uniqueId}`;

  const canSelectedItem = useCallback((item: T) => !item.disabled, []);

  const vsProps = useMemo<VirtualScrollOptimization<T>>(
    () => ({
      list,
      itemKey: (item) => item.value,
      itemSize: isNumber(virtual) ? virtual : 32,
      itemFocusable: canSelectedItem,
    }),
    [canSelectedItem, list, virtual],
  );

  return (
    <div {...styled('transfer__panel')}>
      <div {...styled('transfer__header')}>
        <Checkbox
          model={state === true}
          indeterminate={state === 'mixed'}
          disabled={list.length === 0}
          onModelChange={(checked) => {
            onAllSelectedChange(checked);
          }}
        >
          {selectedCount}/{list.length}
        </Checkbox>
        {checkNodeExist(title) && <div {...styled('transfer__header-title')}>{title}</div>}
      </div>
      {searchable && (
        <div {...styled('transfer__search')}>
          <Input
            style={{ display: 'flex' }}
            placeholder={t('Search')}
            prefix={
              <Icon>
                <SearchOutlined />
              </Icon>
            }
            clearable
            onModelChange={onSearch}
          />
        </div>
      )}
      <div {...styled('transfer__list-container')}>
        {loading && (
          <div {...styled('transfer__loading')}>
            <Icon>
              <CircularProgress />
            </Icon>
          </div>
        )}
        <VirtualScroll
          {...vsProps}
          ref={vsRef}
          enable={virtual !== false}
          listSize={192}
          listPadding={0}
          itemRender={(item, index, props) => {
            const { label: itemLabel, value: itemValue, disabled: itemDisabled } = item;

            return (
              <li
                {...styled('transfer__option', {
                  'transfer__option.is-disabled': itemDisabled,
                })}
                {...props}
                key={itemValue}
                id={getItemId(itemValue)}
                title={itemLabel}
                onClick={() => {
                  if (!itemDisabled) {
                    onSelectedChange?.(itemValue);
                  }
                }}
              >
                <div {...styled('transfer__option-prefix')}>
                  <Checkbox model={(item as any)[IS_SELECTED]} disabled={itemDisabled} />
                </div>
                <div {...styled('transfer__option-content')}>{customItem ? customItem(item) : itemLabel}</div>
              </li>
            );
          }}
          placeholder="li"
          onScrollEnd={onScrollBottom}
        >
          {(vsList, onScroll) => (
            <ul {...styled('transfer__list')} onScroll={onScroll}>
              {list.length === 0 ? <Empty style={{ marginTop: 32 }} image={Empty.SIMPLE_IMG} /> : vsList}
            </ul>
          )}
        </VirtualScroll>
      </div>
    </div>
  );
}
