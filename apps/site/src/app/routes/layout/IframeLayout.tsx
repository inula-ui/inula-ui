import styles from './IframeLayout.module.scss';

export function IframeLayout(props: { children: React.ReactNode }): JSX.Element | null {
  return (
    <main id="app-main" className={styles['app-layout']}>
      <section id="app-content">{props.children}</section>
    </main>
  );
}

export default IframeLayout;
