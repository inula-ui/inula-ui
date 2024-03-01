import type { SidebarProps } from './types';
import type { MenuItem } from '@inula-ui/components/menu/types';
import type { Lang } from '@inula-ui/components/types';

import { Drawer, Icon, Menu } from '@inula-ui/components';
import BookOutlined from '@material-design-icons/svg/outlined/book.svg?react';
import DashboardOutlined from '@material-design-icons/svg/outlined/dashboard.svg?react';
import NavigateNextOutlined from '@material-design-icons/svg/outlined/navigate_next.svg?react';
import { useIntl } from 'inula-intl';
import { Link, useLocation } from 'inula-router';

import menu from '../../../../dist/menu.json';
import { useStorage } from '../../../hooks';

import styles from './Sidebar.module.scss';

export function Sidebar(props: SidebarProps): JSX.Element | null {
  const { route, menuOpen, onMenuOpenChange } = props;

  const intl = useIntl();
  const languageStorage = useStorage<Lang>('language');

  const location = useLocation();
  const active = location.pathname.match(new RegExp(String.raw`^\/${route}\/(.+$)`))?.[1] ?? null;

  const menuNode = (
    <Menu
      className={styles['app-sidebar__menu']}
      list={
        route === 'docs'
          ? ([
              {
                id: 'Overview',
                title: (
                  <Link tabIndex={-1} to="/docs/Overview">
                    {intl.formatMessage({ id: 'docs-menu.Overview' })}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'GettingStarted',
                title: (
                  <Link tabIndex={-1} to="/docs/GettingStarted">
                    {intl.formatMessage({ id: 'docs-menu.Getting Started' })}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'DynamicTheme',
                title: (
                  <Link tabIndex={-1} to="/docs/DynamicTheme">
                    {intl.formatMessage({ id: 'docs-menu.Dynamic Theme' })}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'Internationalization',
                title: (
                  <Link tabIndex={-1} to="/docs/Internationalization">
                    {intl.formatMessage({ id: 'docs-menu.Internationalization' })}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'GlobalConfiguration',
                title: (
                  <Link tabIndex={-1} to="/docs/GlobalConfiguration">
                    {intl.formatMessage({ id: 'docs-menu.GlobalConfiguration' })}
                  </Link>
                ),
                type: 'item',
              },
              {
                id: 'FAQ',
                title: (
                  <Link tabIndex={-1} to="/docs/FAQ">
                    FAQ
                  </Link>
                ),
                type: 'item',
              },
            ] as MenuItem<string>[])
          : menu.map<MenuItem<string>>((group) => ({
              id: group.title,
              title: intl.formatMessage({ id: `menu.components-group.${group.title}` }),
              type: 'group',
              children: (group.title === 'Other'
                ? group.children.concat([{ title: 'Interface', to: '/components/Interface' }])
                : group.children
              ).map<MenuItem<string>>((child) => ({
                id: child.title,
                title: (
                  <Link tabIndex={-1} to={child.to}>
                    {child.title}
                    {languageStorage.value !== 'en-US' && (
                      <span className={styles['app-sidebar__menu-subtitle']}>
                        {intl.formatMessage({ id: `menu.components.${child.title}` })}
                      </span>
                    )}
                  </Link>
                ),
                type: 'item',
              })),
            }))
      }
      active={active}
    />
  );

  return (
    <>
      {route !== 'home' && <div className={styles['app-sidebar']}>{menuNode}</div>}
      <Drawer
        styleOverrides={{ drawer__body: { style: { padding: '12px 0 0 0' } } }}
        visible={menuOpen}
        header={
          <Drawer.Header styleOverrides={{ 'drawer__header-title': { style: { display: 'flex', alignItems: 'center' } } }}>
            <Link className={styles['app-sidebar__header-logo']} to="/">
              <img style={{ marginRight: 4 }} src="/logo.png" alt="Logo" width="24" height="24" />
              <span>Inula UI</span>
            </Link>
          </Drawer.Header>
        }
        width={280}
        onClose={() => {
          onMenuOpenChange(false);
        }}
      >
        <div className={styles['app-sidebar__button-container']}>
          <Link className={styles['app-sidebar__link-button']} to="/docs">
            <Icon>
              <BookOutlined />
            </Icon>
            {intl.formatMessage({ id: 'Docs' })}
            <Icon>
              <NavigateNextOutlined />
            </Icon>
          </Link>
          <Link className={styles['app-sidebar__link-button']} to="/components">
            <Icon>
              <DashboardOutlined />
            </Icon>
            {intl.formatMessage({ id: 'Components' })}
            <Icon>
              <NavigateNextOutlined />
            </Icon>
          </Link>
        </div>
        {menuNode}
      </Drawer>
    </>
  );
}
