function stand(context) {
  const { input, state } = context;
  
  const shouldStand = !state.leaned || input.buttonsPressed.has(3);

  if (shouldStand) {
    const { servos } = state;

    for (const servo of servos.legs.all()) {
      if (state.moved && state.moved.has(servo.index)) {
        continue;
      }

      servo.position.goal = servo.position.neutral;
    }
  }

  return context;
}

module.exports = stand;
