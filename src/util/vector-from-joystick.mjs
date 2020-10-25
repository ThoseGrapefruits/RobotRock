const { abs, atan2, PI, sqrt, SQRT2 } = Math;

const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;

export default function vectorFromJoystick({ x, y }) {
  const direction = atan2(y, x);
  const rawMagnitude = sqrt(abs(x ** 2) + abs(y ** 2));
  const maxMagnitude = getMaxMagnitude(direction);
  const magnitude = rawMagnitude / maxMagnitude;

  return { direction, magnitude };
}

// This is a bit funky. The controller gives back axis coordinates that are in
// the range of [0, 1] on each axis. This means that the maximum possible
// magnitude in any direction is variable just based on the coordinates. In real
// life, most controllers are circular. However, pushing a joystick to the
// bottom-right at (7π/4 or 315°) would produce { x: 1, y: 1 }, which has a raw
// magnitude of Math.SQRT2. If we actually want to work off of a normalised
// magnitude ([0, 1]), we have to divide the raw magnitude by the
// theoretical maximum possible radius to the edge of the square enclosing the
// unit circle. That's where the function below comes in.

// Here's a terrible box drawing I might replace later.
// TODO(logan): replace this terrible box drawing.
// _________________________
// |     _---  |  ---_     |
// |   _/      |      \_   |
// |  /        |        \  |
// | /         |         \ |
// |/          |          \|
// |           |           |
// |-----------|-----------|
// |           |           |
// |\          |          /|
// | \         |         / |
// |  \_       |       _/  |
// |    \_     |     _/    |
// |      \___ | ___/      |
// |------------------------

// The circle is the unit circle, and the outer square is the boundary of
// possible {x,y} values.

// If you were to plot this function, it would look something like:

// 
// √2|      ^           ^           ^           ^
//   |     / \         / \         / \         / \
//   |    /   \       /   \       /   \       /   \
//   |   /     \     /     \     /     \     /     \
//   |  /       \   /       \   /       \   /       \
//   | /         \ /         \ /         \ /         \
//   |/___________v___________v___________v___________\
//  0      π/4   π/2   3π/4   π                       2π

// Ok I am now done making terrible ascii diagrams.

function getMaxMagnitude(direction) {
  const x = direction % PI;
  const y = SQRT2 - x * (SQRT2 / HALF_PI)

  return abs(y);
}

// First attempt at being smarter, not sure if this works either.

function getMaxMagnitude(direction) {
  direction = direction % HALF_PI;
  if (direction > QUARTER_PI) {
    direction = HALF_PI - direction;
  }

  // We are now in an eight of the unit circle and can be smarter.
  return tan(direction);
}
