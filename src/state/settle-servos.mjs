// Move servos towards their goal positions
export default function settleServos(context) {
  const { state } = context;
  const { pwm, servos } = state;

  for (const servo of servos.all()) {
    const { index, position } = servo;
    const error = position.current - position.goal;
    position.current += pid.step(error);
    pwm.setPwm(index, 0, position.current);
  }

  return context;
}
