export const FILES = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inula UI</title>
    <link rel="stylesheet" href="/src/styles/vendor/bootstrap.scss" />
    <link rel="stylesheet" href="/src/styles/vendor/inula-ui.scss" />
    <link rel="stylesheet" href="/src/styles/index.scss" />
    <link rel="stylesheet" href="/src/index.scss" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  'src/main.tsx': `import { createRoot } from 'openinula';

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
`,
  'src/App.tsx': `import type { LContextIn } from '@inula-ui/components/context';

import { ConfigProvider, Root } from '@inula-ui/components';
import { useMemo } from 'openinula';

import Demo from './Demo';

export function App() {
  const lContext = useMemo<LContextIn>(
    () => ({
      layoutPageScrollEl: '#app-main',
      layoutContentResizeEl: '#app-content',
    }),
    [],
  );

  return (
    <ConfigProvider context={lContext}>
      <Root>
        <main id="app-main">
          <section id="app-content">
            <Demo />
          </section>
        </main>
      </Root>
    </ConfigProvider>
  );
}

export default App;
`,
  'src/styles/vendor/bootstrap.scss': `/* stylelint-disable no-invalid-position-at-import-rule */
@import 'bootstrap/scss/mixins/banner';
@include bsBanner('');

// scss-docs-start import-stack
// Configuration
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/variables-dark';
@import 'bootstrap/scss/maps';
@import 'bootstrap/scss/mixins';
@import 'bootstrap/scss/utilities';

// Layout & components
@import 'bootstrap/scss/grid';

// Helpers
@import 'bootstrap/scss/helpers';

// Utilities
@import 'bootstrap/scss/utilities/api';
// scss-docs-end import-stack
`,
  'src/styles/vendor/inula-ui.scss': `@use '@inula-ui/themes/index';
`,
  'src/styles/index.scss': `body {
  margin: 0;
}

#app-main {
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow: auto;
}

#app-content {
  height: 200vh;
}
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": ["dom", "es2015"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "jsx": "react-jsx"
  }
}
`,
  'vite.config.ts': `import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  resolve: {
    alias: {
      react: 'openinula',
      'react-dom': 'openinula',
      'react/jsx-dev-runtime': 'openinula/jsx-dev-runtime'
    }
  },
  server: {
    port: 3000
  },
  plugins: [react(), svgr()],
});
`,
};
