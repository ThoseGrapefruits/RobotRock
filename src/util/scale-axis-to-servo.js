function scaleAxisToServo(input, servo) {
  const { min, max, neutral } = servo.position;

  let result;

  if (input > 0) {
    result = input * Math.abs(neutral - max) + neutral;
  } else {
    result = input * Math.abs(neutral - min) + neutral;
  }

  return result;
}

module.exports = scaleAxisToServo;
