import makePWM from 'adafruit-pca9685';
import KalmanFilter from 'kalmanjs';
import MPU6050 from 'mpu6050-gyro';

import PID from './pid.mjs';

export default function initRobot({
  pid={ p: 5, i: 0.01, d: 0 },
  gyroFilter={ Q: 0.001, R: 0.1 }
} = {}) {
  return {
    gyro: {
      controller: new MPU6050(1, 0x68),
      filter: {
        x: new KalmanFilter(...gyroFilter),
        y: new KalmanFilter(...gyroFilter),
      },
    },
    pid: {
      x: new PID(pid),
      y: new PID(pid)
    },

    pwm: makePWM({
      debug: true
    }),
    servos: {
      camera: {
        x: initServo(12),
        y: initServo(13)
      },
      legs: {
        * all() {
          yield * this.left.map(leg => leg.all());
          yield * this.right.map(leg => leg.all());
        },
        left: initLegSide(0),
        right: initLegSide(6)
      }
    },
  };
}

function initLegSide(start) {
  return [ start, start + 2, start + 4 ].map(initLeg);
}

function initLeg(start) {
  return {
    * all() {
      yield this.shoulder;
      yield this.elbow;
    },
    elbow: initServo(start + 1),
    shoulder: initServo(start)
  };
}

function initServo(index) {
  return {
    index,
    pid: new PID({
      kP: 2,
      kI: 0.01,
      kD: 0,
    }),
    positionGoal: 300,
    position: 300,
    POSITION_NEUTRAL: 300,

    // NOTE: Any "soft" updates to servo position (want to use PID) should only
    // update `position`. Any "hard" updates should update both `position` and
    // `positionGoal` as well as call `pwm.setPwm` directly.
  };
}
