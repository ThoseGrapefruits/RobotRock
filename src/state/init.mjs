import MPU6050 from 'mpu6050-gyro';
import PWM from 'adafruit-pca9685';

import PID from './pid.mjs';

export default function initRobot({
  pid={ p: 5, i: 0.01, d: 0 },
  gyroFilter={ Q: 0.001, R: 0.1 }
} = {}) {
  return {
    // Active
    servos: {
      camera: {
        x: initServo(12),
        y: initServo(13)
      },
      legs: {
        left: initLegSide(0),
        right: initLegSide(6)
      }
    },
    pid: {
      x: new PID(pid),
      y: new PID(pid)
    },

    // Inputs and Controllers
    gyro: {
      controller: new MPU6050(1, 0x68),
      filter: {
        x: new KalmanFilter(...gyroFilter),
        y: new KalmanFilter(...gyroFilter),
      },
    },
    pwm: PWM({
      debug: true
    }),
  };
}

function initLegSide(start) {
  return [ start, start + 2, start + 4 ].map(initLeg);
}

function initLeg(start) {
  return {
    elbow: initServo(start + 1),
    shoulder: initServo(start)
  };
}

function initServo(index) {
  return {
    index,
    positionGoal: 300,
    position: 300,
  };
}
