import { html, render } from 'https://unpkg.com/lit-html/lit-html.js?module';

import '/components/rr-client.mjs';

render(html`
  <rr-client></rr-client>
`, document.body);