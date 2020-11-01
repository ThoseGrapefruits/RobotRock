// Smoothly move servos towards their goal positions
function settleServos(context) {
  const {
    state: { pwm, servos, servoSettleFilter }
  } = context;

  for (const servo of servos.all()) {
    if (servoSettleFilter && !servoSettleFilter(servo)) {
      continue;
    }

    const { index, pid, position } = servo;
    const error = position.goal - position.current;
    position.current += pid.step(error);
    if (servoSettleFilter) {
      console.log(
        'C',
        `${ index }`.padStart(2, ' '),
        `${ error }`.padEnd(10, ' '),
        position.current
      );
    }
    pwm.setPwm(index, 0, position.current);
  }

  return context;
}

module.exports = settleServos;
