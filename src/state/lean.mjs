const DEAD_ZONE = 0.01;

export default function lean(context) {
  const {
    input: {
      axes: {
        right: { x, y }
      },
      buttonsPressed
    },
    state
  } = context;

  const shouldLean = Math.abs(x) > DEAD_ZONE || Math.abs(y) > DEAD_ZONE;

  console.log(buttonsPressed);

  return {
    ...context,
    input: {
      ...context.input,
      leaned: shouldLean
    }
  };
}
