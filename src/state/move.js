const { scaleAxisToServo } = require('../util/index.js');

const ELBOW_RIGIDITY = 1.5;
const SHOULDER_RIGIDITY = 1;

const SPEED = 0.5;
const DEAD_ZONE = 0.02;

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

  let { moved=new Set } = state;

  moved.clear();

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
        // casting boolean to number, fite me
        const shift = (legIndex % 2 === sideIndex % 2) * PI / 2;

        if (Math.abs(axis.y) >= DEAD_ZONE) {
          moved.add(elbow.index);
          moved.add(shoulder.index);
        }

        const elbowPosition = scaleAxisToServo(
          Math.sin(distance + shift) / ELBOW_RIGIDITY,
          elbow
        );
        elbow.position.goal = elbowPosition;

        const shoulderPosition = scaleAxisToServo(
          Math.sin(-distance + shift) / SHOULDER_RIGIDITY,
          shoulder
        );
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
      moved
    }
  };
}

module.exports = move;
