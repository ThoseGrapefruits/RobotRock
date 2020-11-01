const scaleAxisToServo = require('../util/scale-axis-to-servo.js');

const SPEED = 0.1;
const DEAD_ZONE = 0.01;
const PI_HALF = Math.PI / 2;
const PI_QUARTER = Math.PI / 2;

const distances = {
  left: 0,
  right: 0
};

// Tank-style driving. Left stick controls left legs, right controls right.

function move(context) {
  const {
    state,
    input: { axes }
   } = context;

  const shouldMove = !state.leaned &&
    [ axes.left.magnitude, axes.right.magnitude ]
      .some(magnitude => DEAD_ZONE >= magnitude);

  if (shouldMove) {
    distances.left  += SPEED * left.magnitude;
    distances.right += SPEED * right.magnitude;

    const { servos } = state;

    [ 'left', 'right' ].forEach((side, sideIndex) => {
      const axis = axes[side];
      const legs = servos.legs[side] 
      const distance = distances[side];

      // An angle in the top-right quadrant
      const normalizedMovementAngle = Math.abs(axis.direction % PI_HALF);
      // If it's less than about 45°, then we can do efficient sideways motion
      const sidewaysMotion = normalizedMovementAngle <= PI_QUARTER;

      if (sidewaysMotion) {
        legs.forEach(({ elbow, shoulder }, legIndex) => {
          // casting boolean to number, sorry
          const shift = (legIndex % 2 === sideIndex % 2) * PI_HALF;

          elbow.goal    = scaleAxisToServo(Math.sin(distance + shift));
          shoulder.goal = scaleAngleToServo(axis.direction);
        });
      } else {
        legs.forEach(({ elbow, shoulder }, legIndex) => {
          // casting boolean to number, sorry
          const shift = (legIndex % 2 === sideIndex % 2) * PI_HALF;

          elbow.goal    = Math.sin(distance);
          shoulder.goal = scaleAxisToServo(Math.sin(distance + shift));
        });
      }
    })

    legs.left.forEach((leg, index) => {
      const wave = index % 2 === 0 ? Math.sin : Math.cos;

      leg.position.goal = wave()
    });
  } else {
    distances.left = 0;
    distances.right = 0;
  }

  return {
    ...context,
    state: {
      ...state,
      moved: shouldMove
    }
  };
}

function scaleAngleToServo(angle, servo) {
  // TODO
}

module.exports = move;
