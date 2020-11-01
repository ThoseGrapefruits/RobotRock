const scaleAxisToServo = require('../util/scale-axis-to-servo.js');

let justLeaned = false;

function lean(context) {
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
    justLeaned = true;
    const { servos: { legs } } = state;

    legs.left.forEach(({ elbow, shoulder }, index) => {
      elbow.position.goal = scaleAxisToServo(-x, elbow);
      shoulder.position.goal = scaleAxisToServo(y, elbow);
    });

    legs.right.forEach(({ elbow, shoulder }, index) => {
      elbow.position.goal = scaleAxisToServo(-x, elbow);
      shoulder.position.goal = scaleAxisToServo(-y, elbow);
    });
  } else if (justLeaned) {
    justLeaned = false;
    const { servos: { legs } } = state;
    for (const servo of legs.all()) {
      servo.position.goal = servo.position.neutral;
    }
  }

  return {
    ...context,
    state: {
      ...state,
      leaned: shouldLean
    }
  };
}

module.exports = lean;
