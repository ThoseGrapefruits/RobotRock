const { scaleAxisToServo } = require('../util/index.js');

const SPEED = 0.1;
const DEAD_ZONE = 0.05;
const { PI } = Math

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
      .some(magnitude => DEAD_ZONE <= magnitude);
  
  if (shouldMove) {
    const { servos } = state;

    [ 'left', 'right' ].forEach((side, sideIndex) => {
      const axis = axes[side];
      distances[side] += axis.y * SPEED;
      const distance = distances[side];
      const legs = servos.legs[side] 

      legs.forEach(({ elbow, shoulder }, legIndex) => {
        // casting boolean to number
        const shift = (legIndex % 2 === sideIndex % 2) * PI / 2;

        const elbowPosition
          = scaleAxisToServo(Math.sin(distance + shift) / 3, elbow);
        elbow.position.current = elbowPosition;
        elbow.position.goal = elbowPosition;

        const shoulderPosition = scaleAxisToServo(
          Math.sin(-distance + shift) / 3,
          shoulder
        );
        shoulder.position.current = shoulderPosition;
        shoulder.position.goal = shoulderPosition;
      });
    })
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

module.exports = move;
