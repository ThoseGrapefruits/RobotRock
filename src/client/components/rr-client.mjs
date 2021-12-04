import { css, html, LitElement } from 'https://unpkg.com/lit-element@2/lit-element.js?module';

import { connect, disconnect } from '/sockem-bopper.mjs';

import '/components/rr-debug-panel.mjs';
import '/components/rr-control.mjs';

class RRClientElement extends LitElement {
  static get properties() {
    return {
      stats: { attribute: false, type: Object }
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%
      }
    `;
  }

  render() {
    return html`
      <rr-control>
      </rr-control>

      <rr-debug-panel
        .stats="${ this.stats }">
      </rr-debug-panel>
    `;
  }

  handleBop = event => {
    switch (event.name) {
      case 'rr-stats':
        this.stats = event.detail;
    }
  };

  async connectedCallback() {
    super.connectedCallback();
    addEventListener('rr-stats', this.handleBop);
    await connect();
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener('rr-stats', this.handleBop);
    await disconnect();
  }
}

customElements.define('rr-client', RRClientElement);
