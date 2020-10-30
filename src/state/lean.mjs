export default function lean(context) {
  const {
    input: {
      axes: {
        right: { x, y }
      },
      buttonsPressed
    },
    state
  } = context;

  const shouldLean = buttonsPressed.has(4);

  if (shouldLean) {
    const { servos: { legs } } = state;

    legs.left.forEach(({ elbow, shoulder }, index) => {
      elbow.position.goal = scaleAxisToServo(-y, elbow);
    });

    legs.right.forEach(({ elbow, shoulder }, index) => {
      elbow.position.goal = scaleAxisToServo(y, elbow);
    });
  }

  return {
    ...context,
    state: {
      ...state,
      leaned: shouldLean
    }
  };
}

function scaleAxisToServo(input, servo) {
  return input * servo.range / 2;
}
