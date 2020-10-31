// Basic PID controller to smooth out servo movement

const NANO = 1e9;

class PID {
  constructor({ kP, kI, kD }) {
    if (kP == null || kI == null || kD == null) {
      throw new Error('Missing PID input');
    }

    this.kP = kP;
    this.kI = kI;
    this.kD = kD;

    this.cP = 0;
    this.cI = 0;
    this.cD = 0;

    this.error = 0;
  }

  step(error) {
    if (!this.time) {
      this.time = process.hrtime();
    }

    const [ seconds, nanoseconds ] = process.hrtime(this.time);
    this.time = process.hrtime();

    const secondsElapsed = seconds + nanoseconds / NANO;
    const de = error - this.error;
    this.error = error;

    this.cP = this.kP * error
    this.cI += error * secondsElapsed

    this.cD = 0
    if (secondsElapsed > 0) {
      this.cD = de / secondsElapsed
    }

    return this.cP + (this.kI * this.cI) + (this.kD * this.cD)
  }
}

module.exports = PID;