export default function stand({
  input,
  state
}) {
  const { leaned, moved } = state;

  if (leaned || moved) {
    return;
  }

  const { servos } = state;

  for (const servo of servos.all()) {
    servo.position = servo.POSITION_NEUTRAL;
  }

  return { input, state };
}
