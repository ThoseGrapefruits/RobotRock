const makePWM = require('adafruit-pca9685');
const KalmanFilter = require('kalmanjs');
const MPU6050 = require('mpu6050-gyro');

const { PID } = require('../util/index.js');

function initRobot({
  pid={ kP: 5, kI: 0.01, kD: 0 },
  gyroFilter={ Q: 0.001, R: 0.1 }
} = {}) {
  return {
    gyro: {
      controller: new MPU6050(1, 0x68),
      filter: {
        x: new KalmanFilter(gyroFilter),
        y: new KalmanFilter(gyroFilter),
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
      * all() {
        yield * this.legs.all();
        yield * this.camera.all();
      },
      camera: {
        * all() {
          yield this.x;
          yield this.y;
        },
        x: initServo(12, {
          position: {
            max: 500,
            min: 100,
          }
        }),
        y: initServo(13, {
          position: {
            max: 500,
            min: 270,
          }
        })
      },
      legs: {
        * all() {
          for (const leg of this.left) {
            yield * leg.all();
          }
          for (const leg of this.right) {
            yield * leg.all();
          }
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

function initServo(index, { position={} }={}) {
  return {
    index,
    pid: new PID({
      kP: 0.06,
      kI: 0.005,
      kD: 0.001,
    }),

    position: {
      // NOTE: Any "soft" updates to servo position (want to use PID) should
      // only update `goal`. Any "hard" updates should update both `current` and
      // `goal` as well as call `pwm.setPwm` directly.
      _current: 300,
      get current() {
        return this._current;
      },
      set current(value) {
        this._current = minmax(assertNonNaN(value), this.min, this.max);
      },

      _goal: 300,
      get goal() {
        return this._goal;
      },
      set goal(value) {
        this._goal = minmax(assertNonNaN(value), this.min, this.max);
      },

      _max: 520,
      get max() {
        return this._max;
      },
      set max(value) {
        this._max = assertNonNaN(value);
      },

      _min: 140,
      get min() {
        return this._min;
      },
      set min(value) {
        this._min = assertNonNaN(value);
      },

      _neutral: 300,
      get neutral() {
        return this._neutral;
      },
      set neutral(value) {
        this._neutral = assertNonNaN(value);
      },

      ...position,

      get mid() {
        return this.min + this.range / 2;
      },

      get range() {
        return this.max - this.min;
      },

      get rangeAngle() {
        // TODO I don't actually know what the position-to-radians ratio is.
        // Based on the ranges the original program had, and the physical
        // limitations of servo movement, 600 seems reasonable.
        return this.range / 600;
      }
    }
  };
}

// UTIL ////////////////////////////////////////////////////////////////////////

function assertNonNaN(x) {
  if (isNaN(x)) {
    throw new Error('NaN');
  }

  return x;
}

function minmax(x, min, max) {
  return Math.min(
    max,
    Math.max(
      min,
      x
    )
  );
}

module.exports = initRobot;