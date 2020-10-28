import { vectorFromJoystick } from '../util/index.mjs';

export default function normalizeInput({ input, state }) {
  return {
    input: {
      ...input,
      axes: {
        left: vectorizeJoystick(input.axes.left),
        right: vectorizeJoystick(input.axes.right),
      },
      buttonsPressed: new Set(input.buttonsPressed)
    }
  };
}

function vectorizeJoystick(joystick) {
  return {
    ...joystick,
    ...vectorFromJoystick(joystick)
  };
}
