import { BrowserRouter } from 'inula-router';
import { createRoot } from 'openinula';

import App from './app/App';
import { startup } from './startup';

startup.then(() => {
  createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
});
