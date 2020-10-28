
// Basic PID controller to smooth out servo movement

export class PID {
  cP = 0;
  cI = 0;
  cD = 0;

  kP = 0;
  kI = 0;
  kD = 0;

  time = process.hrtime.bigint();
  error = 0;

  constructor({ kP, kI, kD }) {
    if (!kP || !kI || !kD) {
      throw new Error('Missing PID input');
    }

    this.kP = kP;
    this.kI = kI;
    this.kD = kD;
  }

  step(error) {
    const time = process.hrtime.bigint();
    const dt = time - this.time;
    const de = error - this.error;

    this.cP = this.kP * error
    this.cI += error * dt

    this.cD = 0
    if (dt > 0) {
      this.cD = de / dt
    }

    this.time = time;
    this.error = error;

    return this.cP + (this.kI * this.cI) + (this.kD * this.cD)
  }
}