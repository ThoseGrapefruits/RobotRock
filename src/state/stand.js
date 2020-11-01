function stand(context) {
  const { input, state } = context;

  if (input.buttonsPressed.has(3)) {
    const { servos } = state;

    for (const servo of servos.legs.all()) {
      servo.position.goal = servo.POSITION_NEUTRAL;
    }
  }

  return context;
}

module.exports = stand;
