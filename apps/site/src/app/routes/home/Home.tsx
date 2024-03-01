import { Button, Icon } from '@inula-ui/components';
import KeyboardArrowRightOutlined from '@material-design-icons/svg/outlined/keyboard_arrow_right.svg?react';
import { useIntl } from 'inula-intl';
import { Link } from 'inula-router';
import { useEffect } from 'openinula';

import styles from './Home.module.scss';

export function HomeRoute(): JSX.Element | null {
  const intl = useIntl();

  useEffect(() => {
    document.title = 'Inula UI';
  }, []);

  return (
    <main className={styles['app-home-route']}>
      <section className={styles['app-home-route__container']}>
        <img className={styles['app-home-route__logo']} src="/logo.png" alt="Logo" width="128" height="128" />
        <section className={styles['app-home-route__main']}>
          <h1 className={styles['app-home-route__title']}>Inula UI</h1>
          <p className={styles['app-home-route__description']}>{intl.formatMessage({ id: 'home.Title' })}</p>
          <Link className={styles['app-home-route__link']} to="/components">
            <Button
              icon={
                <Icon>
                  <KeyboardArrowRightOutlined />
                </Icon>
              }
              iconRight
            >
              {intl.formatMessage({ id: 'home.Getting Started' })}
            </Button>
          </Link>
        </section>
      </section>
      <div className={styles['app-home-route__footer']}>
        <section>
          © {new Date().getFullYear()} made with ❤ by{' '}
          <a className={styles['app-home-route__footer-link']} href="//github.com/xiejay97">
            Xie Jay
          </a>
        </section>
      </div>
    </main>
  );
}

export default HomeRoute;
