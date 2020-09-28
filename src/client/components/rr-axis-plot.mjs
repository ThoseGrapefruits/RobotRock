import { css, html, LitElement } from 'https://unpkg.com/lit-element/lit-element.js?module';

const SCALE = 20;
const THETA = Math.PI * 2;

class RRAxisPlotElement extends LitElement {
  static get properties() {
    return {
      x: {
        type: Number
      },
      y: {
        type: Number
      }
    };
  }

  _canvas;

  get canvas() {
    return this._canvas ??
      (this._canvas = this.renderRoot.querySelector('canvas'));
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }
    `;
  }

  draw() {
    const { canvas } = this;

    if (!canvas) {
      return;
    }
    
    const { x, y } = this;
    const context = this.canvas.getContext('2d');
    window.context = window.context ?? context;
    context.clearRect(0, 0, SCALE, SCALE);
    context.strokeRect(0, 0, SCALE, SCALE)
    context.fillStyle = '#b00'
    context.beginPath();
    context.arc(scale(x), scale(y), 4, 0, THETA);
    context.fill();
  }

  render() {
    this.draw();
    return html`
      <canvas
        width="${ SCALE }px"
        height="${ SCALE }px">
      </canvas>
    `;
  }
}

customElements.define('rr-axis-plot', RRAxisPlotElement);

function scale(axisValue) {
  return (axisValue + 1.0) * (SCALE / 2);
}
