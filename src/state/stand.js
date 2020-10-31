function stand(context) {
  const { state } = context;
  const { leaned, moved } = state;

  if (!leaned && !moved) {
    const { servos } = state;

    for (const servo of servos.legs.all()) {
      servo.position.goal = servo.POSITION_NEUTRAL;
    }
  }

  return context;
}

module.exports = stand;
