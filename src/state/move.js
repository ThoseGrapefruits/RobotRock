const { scaleAxisToServo } = require('../util/index.js');

const SPEED = 0.1;
const DEAD_ZONE = 0.02;
const PI_HALF = Math.PI / 2;
const PI_QUARTER = Math.PI / 2;

let distance = 0;

// Tank-style driving. Left stick controls left legs, right controls right.

function move(context) {
  const {
    state,
    input: { axes }
   } = context;

  const shouldMove = !state.leaned &&
    [ axes.left.magnitude, axes.right.magnitude ]
      .some(magnitude => DEAD_ZONE <= magnitude);

  if (shouldMove) {
    distance += SPEED * axes.left.magnitude;

    const { servos } = state;

    [ 'left', 'right' ].forEach((side, sideIndex) => {
      const axis = axes.left;
      const legs = servos.legs[side] 
      // An angle in the top-right quadrant
      const normalizedMovementAngle = Math.abs(axis.direction % PI_HALF);
      // If it's less than about 45°, then we can do efficient sideways motion
      const sidewaysMotion = normalizedMovementAngle <= PI_QUARTER;
      const neutralAngle = sideIndex
        ? 0
        : Math.PI;

      if (sidewaysMotion) {
        legs.forEach(({ elbow, shoulder }, legIndex) => {
          // casting boolean to number, sorry
          const shift = (legIndex % 2 + sideIndex % 2) * Math.PI * 4 / 3;

          const sign = Math.sign((sideIndex % 2) - 0.5); // better way to write this

          elbow.position.goal
            = scaleAxisToServo(sign * Math.sin(distance + shift), elbow);
          shoulder.position.goal
            = scaleAngleToServo(axis.direction, shoulder, neutralAngle);
          
          if (sideIndex == 0 && legIndex === 0) {
            console.log(
              `${ shoulder.position.goal }`.padEnd(20, ' '),
              `${ elbow.position.goal }`.padEnd(20, ' ')
            );
          }
        });
      } else {
        // legs.forEach(({ elbow, shoulder }, legIndex) => {
        //   // casting boolean to number, sorry
        //   const shift = (legIndex % 2 === sideIndex % 2) * PI_HALF;

        //   elbow.position.goal
        //     = scaleAngleToServo(Math.sin(distance), elbow);
        //   shoulder.position.goal
        //     = scaleAxisToServo(Math.sin(distance + shift), shoulder);
        // });
      }
    })
  } else {
    distance = 0;
  }

  return {
    ...context,
    state: {
      ...state,
      moved: shouldMove
    }
  };
}

function scaleAngleToServo(angle, servo, neutralAngle = 0) {
  const relativeAngle = angle + neutralAngle;
  const { rangeAngle } = servo.position;

  return relativeAngle * rangeAngle / 3 + servo.position.mid;
}

module.exports = move;
