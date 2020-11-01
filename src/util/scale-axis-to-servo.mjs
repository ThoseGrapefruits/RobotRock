function scaleAxisToServo(input, servo) {
  const { neutral, range } = servo.position;
  // TODO deal with asymmetrical range
  const result = input * range / 2 + neutral;

  return result;
}

module.exports = scaleAxisToServo;
