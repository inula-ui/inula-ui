import type { Lang } from '@inula-ui/components/types';

import { Icon } from '@inula-ui/components';
import WarningAmberOutlined from '@material-design-icons/svg/outlined/warning_amber.svg?react';
import parse from 'html-react-parser';
import { useIntl } from 'inula-intl';
import { Link } from 'inula-router';
import { useEffect } from 'openinula';

import composeUrl from '../../../../assets/compose.png';
import virtualScrollUrl from '../../../../assets/virtual-scroll.png';
import { useStorage } from '../../../hooks';
import marked from '../marked';
import { MdRoute } from '../md/MdRoute';
import { decode } from '../utils';

export interface ComponentRouteProps {
  title: string;
  subtitle: string;
  description: number[];
  aria: string;
  compose: string;
  virtualScroll: string;
  api: number[];
  demos: React.ReactNode;
  links: { href: string; title: string }[];
}

export function ComponentRoute(props: ComponentRouteProps): JSX.Element | null {
  const { title, subtitle, description: descriptionProp, aria: ariaProp, compose, virtualScroll, api: apiProp, demos, links } = props;

  const description = marked(decode(descriptionProp));
  const api = marked(decode(apiProp));
  const [aria, ariaWarning] = (() => {
    if (ariaProp) {
      let aria = ariaProp;
      const ariaWarning = ariaProp.endsWith('!');
      if (ariaWarning) {
        aria = aria.slice(0, -1);
      }
      aria = aria.startsWith('http') ? aria : `https://www.w3.org/WAI/ARIA/apg/patterns/${aria}/`;
      return [aria, ariaWarning] as const;
    }
    return [];
  })();

  const intl = useIntl();
  const languageStorage = useStorage<Lang>('language');

  useEffect(() => {
    document.title = title + (languageStorage.value !== 'en-US' ? ` ${subtitle}` : '') + ' - Inula UI';
  }, [languageStorage.value, subtitle, title]);

  return (
    <MdRoute links={links}>
      <h1 id="component-route-title" className="app-h app-h--1">
        {title}
        {languageStorage.value !== 'en-US' && <span className="app-component-route__subtitle">{subtitle}</span>}
      </h1>
      <ul className="app-component-route__tag-list">
        {aria && (
          <li>
            <a className="app-component-route__tag-link" href={aria} target="_blank" rel="noreferrer">
              <Icon size={24}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path
                      d="M6.92 6.1l2.33 7.99 2.32-8h6.3v.8l-2.37 4.14c.83.27 1.46.76 1.89 1.47.43.71.64 1.55.64 2.51 0 1.2-.31 2.2-.94 3a2.93 2.93 0 01-2.42 1.22 2.9 2.9 0 01-1.96-.72 4.25 4.25 0 01-1.23-1.96l1.31-.55c.2.5.45.9.76 1.18.32.28.69.43 1.12.43.44 0 .82-.26 1.13-.76.31-.51.47-1.12.47-1.84 0-.79-.17-1.4-.5-1.83-.38-.5-.99-.76-1.81-.76h-.64v-.78l2.24-3.92h-2.7l-.16.26-3.3 11.25h-.15l-2.4-8.14-2.41 8.14h-.16L.43 6.1H2.1l2.33 7.99L6 8.71 5.24 6.1h1.68z"
                      fill="#005A9C"
                    />
                    <g>
                      <path d="M23.52 6.25l.28 1.62-.98 1.8s-.38-.76-1.01-1.19c-.53-.35-.87-.43-1.41-.33-.7.14-1.48.93-1.82 1.9-.41 1.18-.42 1.74-.43 2.26a4.9 4.9 0 00.11 1.33s-.6-1.06-.59-2.61c0-1.1.19-2.11.72-3.1.47-.87 1.17-1.4 1.8-1.45.63-.07 1.14.23 1.53.55.42.33.83 1.07.83 1.07l.97-1.85zM23.64 15.4s-.43.75-.7 1.04c-.27.28-.76.79-1.36 1.04-.6.25-.91.3-1.5.25a3.03 3.03 0 01-1.34-.52 5.08 5.08 0 01-1.67-2.04s.24.75.39 1.07c.09.18.36.74.74 1.23a3.5 3.5 0 002.1 1.42c1.04.18 1.76-.27 1.94-.38a5.32 5.32 0 001.4-1.43c.1-.14.25-.43.25-.43l-.25-1.25z" />
                    </g>
                  </g>
                </svg>
              </Icon>
              <span>WAI-ARIA</span>
              {ariaWarning && (
                <Icon theme="warning">
                  <WarningAmberOutlined />
                </Icon>
              )}
            </a>
          </li>
        )}
        {compose && (
          <li>
            <Link className="app-component-route__tag-link" to="/components/Compose">
              <img src={composeUrl} alt="Compose" width={20} height={20} />
              <span>Compose</span>
            </Link>
          </li>
        )}
        {virtualScroll && (
          <li>
            <Link className="app-component-route__tag-link" to="/components/VirtualScroll">
              <img src={virtualScrollUrl} alt="VirtualScroll" width={16} height={16} />
              <span>VirtualScroll</span>
            </Link>
          </li>
        )}
      </ul>
      <section>{parse(description)}</section>
      <h2 id="component-route-examples" className="app-h app-h--2">
        {intl.formatMessage({ id: 'Examples' })}
      </h2>
      <section data-demo={title}>{demos}</section>
      <section>{parse(api)}</section>
    </MdRoute>
  );
}
