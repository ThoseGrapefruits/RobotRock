import MPU6050 from 'mpu6050-gyro';
import PWM from 'adafruit-pca9685';

import PID from './pid.mjs';

export default function initRobot({
  pid={ p: 5, i: 0.01, d: 0 },
  filter={ Q: 0.001, R: 0.1 }
} = {}) {
  return {
    // Active
    filter: {
      x: new KalmanFilter(...filter),
      y: new KalmanFilter(...filter),
    },
    legs: {
      left: initLegSide(),
      right: initLegSide()
    },
    pid: {
      x: new PID(pid),
      y: new PID(pid)
    },

    // Inputs and Controllers
    gyro: new MPU6050(1, 0x68),
    pwm: PWM({
      debug: true
    }),
  };
}

function initLegSide() {
  return [ 0, 1, 2 ].map(initLeg);
}

function initLeg() {
  return {
    elbom: initServo(),
    shoulder: initServo()
  };
}

function initServo() {
  return {
    positionGoal: 300,
    positionCurrent: 300,
    position,
  };
}
