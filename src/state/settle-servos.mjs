// Move servos towards their goal positions
export default function settleServos({
  input,
  state
}) {
  const { pwm, servos } = state;

  for (const servo of servos.all()) {
    const error = servo.position - servo.positionGoal;
    servo.position += servo.pid.step(error);
    pwm.setPwm(servo.index, 0, servo.position);
  }

  return { input, state };
}
