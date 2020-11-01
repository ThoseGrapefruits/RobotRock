// Move servos towards their goal positions
function settleServos(context) {
  const { state } = context;
  const { pwm, servos } = state;

  for (const servo of servos.all()) {
    const { index, pid, position } = servo;
    const error = position.goal - position.current;
    position.current += pid.step(error);
    // console.log(
    //   'C',
    //   `${ index }`.padStart(2, ' '),
    //   `${ error }`.padEnd(10, ' '),
    //   position.current
    // );
    pwm.setPwm(index, 0, position.current);
  }

  return context;
}

module.exports = settleServos;
