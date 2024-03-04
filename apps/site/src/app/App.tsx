import type { Theme } from '../types';
import type { LContextIn } from '@inula-ui/components/context';
import type { Lang } from '@inula-ui/components/types';

import { ConfigProvider, Root } from '@inula-ui/components';
import highlightDarkStyles from 'highlight.js/styles/github-dark.css?inline';
import highlightStyles from 'highlight.js/styles/github.css?inline';
import { IntlProvider } from 'inula-intl';
import { Redirect, Route, Switch } from 'inula-router';
import { Suspense, createElement, useEffect, useMemo } from 'openinula';

import { FCPLoader } from './components';
import { useStorage } from './hooks';
import HomeRoute from './routes/home/Home';
import IframeLayout from './routes/layout/IframeLayout';
import Layout from './routes/layout/Layout';
import resources from '../dist/resources.json';
import routes from '../dist/routes';

export function App() {
  const languageStorage = useStorage<Lang>('language');
  const themeStorage = useStorage<Theme>('theme');

  useEffect(() => {
    document.documentElement.lang = languageStorage.value;
  }, [languageStorage.value]);

  useEffect(() => {
    let style = document.querySelector('[data-app-style-id="highlight"]') as HTMLStyleElement;
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.dataset['appStyleId'] = 'highlight';
      document.head.appendChild(style);
    }
    style.innerHTML = themeStorage.value === 'light' ? highlightStyles : highlightDarkStyles;

    for (const t of ['light', 'dark']) {
      document.body.classList.toggle(t, themeStorage.value === t);
    }
    const colorScheme = document.documentElement.style.colorScheme;
    document.documentElement.style.colorScheme = themeStorage.value;
    return () => {
      document.documentElement.style.colorScheme = colorScheme;
    };
  }, [themeStorage.value]);

  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );
  const rootContext = useMemo(() => ({ i18n: { lang: languageStorage.value } }), [languageStorage.value]);

  return (
    <IntlProvider locale={languageStorage.value} messages={resources[languageStorage.value]}>
      <ConfigProvider context={lContext}>
        <Root context={rootContext}>
          <Switch>
            <Route exact path={['/'].concat(routes.filter(({ path }) => !path.startsWith('/iframe')).map(({ path }) => path))}>
              <Layout>
                <Switch>
                  <Route exact path="/" component={HomeRoute} />
                  {routes
                    .filter(({ path }) => !path.startsWith('/iframe'))
                    .map(({ path, component }) => (
                      <Route
                        key={path}
                        exact
                        path={path}
                        component={() => <Suspense fallback={<FCPLoader />}>{createElement(component, {})}</Suspense>}
                      />
                    ))}
                </Switch>
              </Layout>
            </Route>
            <Route exact path={routes.filter(({ path }) => path.startsWith('/iframe')).map(({ path }) => path)}>
              <IframeLayout>
                <Switch>
                  {routes
                    .filter(({ path }) => path.startsWith('/iframe'))
                    .map(({ path, component }) => (
                      <Route
                        key={path}
                        exact
                        path={path}
                        component={() => <Suspense fallback={<FCPLoader />}>{createElement(component, {})}</Suspense>}
                      />
                    ))}
                </Switch>
              </IframeLayout>
            </Route>
            <Redirect exact path="/docs" to="/docs/Overview" />
            <Redirect exact path="/components" to="/components/Button" />
            <Redirect path="*" to="/" />
          </Switch>
        </Root>
      </ConfigProvider>
    </IntlProvider>
  );
}

export default App;
