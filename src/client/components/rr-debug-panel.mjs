import { html, LitElement } from 'https://unpkg.com/lit-element/lit-element.js?module';

class RRDebugPanelElement extends LitElement {
  static get properties() {
    return {
      stats: { type: Object }
    };
  }

  render() {
    if (!this.stats) {
      return;
    }

    return html`
      ${ JSON.stringify(stats) }
    `;
  }
}

customElements.define('rr-debug-panel', RRDebugPanelElement);
