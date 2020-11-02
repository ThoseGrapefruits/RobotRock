import { css, html, LitElement } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { sockJSON } from '/sockem-bopper.mjs';

import '/components/rr-axis-plot.mjs';

const rrGamepads = Symbol();
const rrRAFHandle = Symbol();

class RRControlElement extends LitElement {
  static get properties() {
    return {
      [rrGamepads]: { attribute: false, type: Object },
      axesHash: { attribute: false, type: Array },
      buttonsHash: { attribute: false, type: Array }
    };
  }

  [rrRAFHandle];

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  get gamepads() {
    return this[rrGamepads];
  }

  set gamepads(gamepads) {
    this.stopRAF();

    this[rrGamepads] = gamepads;

    if (countKeys(gamepads)) {
      this.startRAF();
    }
  }

  startRAF() {
    this[rrRAFHandle] = requestAnimationFrame(this.lööp);
  }

  stopRAF() {
    if (this[rrRAFHandle]) {
      cancelAnimationFrame(this[rrRAFHandle]);
    }
  }

  handleGamepadConnected = event => {
    const { gamepad } = event;
    this.gamepads = {
      ...this.gamepads,
      [gamepad.index]: gamepad
    }
  };

  handleGamepadDisconnected = event => {
    delete this.gamepads[event.gamepad.index];
  };

  lööp = () => {
    const { axes, buttons } = this.gamepads[0];
    const change = true;

    const buttonsHash = buttons
      .filter(button => buttonPressed(button))
      .join(',');

    if (buttonsHash !== this.buttonsHash) {
      // change = true;
      this.buttonsHash = buttonsHash;
    }

    const axesHash = axes.reduce((a, b) => a + b, 0);

    if (axesHash !== this.axesHash) {
      // change = true;
      this.axesHash = axesHash;
    }

    if (change) {
      sockJSON({
        input: {
          buttonsPressed: buttons.flatMap((button, index) =>
            buttonPressed(button) ? [ index ] : []),
          axes: {
            left: {
              x: axes[0],
              y: axes[1]
            },
            right: {
              x: axes[2],
              y: axes[3]
            }
          }
        }
      });
    }

    requestAnimationFrame(this.lööp);
  };

  connectedCallback() {
    super.connectedCallback();
    addEventListener('gamepadconnected', this.handleGamepadConnected);
    addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
  }

  async disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener('gamepadconnected', this.handleGamepadConnected);
    removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
    await sockJSON({ input: null });
  }

  render() {
    const controllerCount = countKeys(this.gamepads)
    if (controllerCount === 0) {
      return html`
        <p>Connect a controller and press any button.</p>
      `;
    }

    return html`
      <p>${ controllerCount } controllers connected.</p>
      <ul>
      ${ Object.values(this.gamepads).map(({
        axes, buttons, id, index
      }) => html`
        <h2>${ id }</h2>
        <dl>
          <dt>Axes
          <dd>
            <rr-axis-plot .x="${ axes[0] }" .y="${ axes[1] }"></rr-axis-plot>
            <rr-axis-plot .x="${ axes[2] }" .y="${ axes[3] }"></rr-axis-plot>

          <dt>Buttons
          <dd>${ buttons.length }

          <dt>Index
          <dd>${ index }
        </dl>
        <h4>Pressed buttons</h4>
        <ul>
          ${ buttons.flatMap((button, index) => buttonPressed(button)
            ? [ html`<li>${ index }` ]
            : [])
          }
        </ul>
      `) }
      </ul>
    `;
  }
}

customElements.define('rr-control', RRControlElement);

function countKeys(object) {
  return object
    ? Object.getOwnPropertyNames(object).length
    : 0;
}

function buttonPressed(b) {
  if (typeof(b) == "object") {
    return b.pressed;
  }
  return b == 1.0;
}