const TAU = Math.PI * 2;

function vectorFromJoystick({ x, y }) {
  const direction = Math.atan2(y, x);
  const directionAbsolute = direction < 0
    ? TAU + direction
    : direction;

  const rawMagnitude = Math.sqrt(x ** 2 + y ** 2);
  const maxMagnitude = Math.abs(x) > Math.abs(y)
    ? 1 / Math.sin(direction)
    : 1 / Math.cos(direction);
  const magnitude = rawMagnitude / Math.abs(maxMagnitude);

  return { direction, directionAbsolute, magnitude };
}

// Getting a normalised magnitude is a bit funky. The controller gives back axis
// coordinates that are in the range of [0, 1] on each axis. This means that the
// maximum possible magnitude in any direction is variable just based on the
// coordinates. In real life, most controllers are circular. However, pushing a
// joystick to the bottom-right at (7π/4 or 315°) would produce { x: 1, y: 1 },
// which has a raw magnitude of Math.SQRT2. If we actually want to work off of a
// normalised magnitude ([0, 1]), we have to divide the raw magnitude by the
// theoretical maximum possible radius to the edge of the square enclosing the
// unit circle.

// https://storage.googleapis.com/grapefruits-share/axes.png

// The circle is the unit circle, and the outer square is the boundary of
// possible {x,y} values.

module.exports = vectorFromJoystick
