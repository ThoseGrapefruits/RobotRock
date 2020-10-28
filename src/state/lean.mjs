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

  const shouldLean = buttonsPressed.has(4);



  return {
    ...context,
    state: {
      ...state,
      leaned: shouldLean
    }
  };
}
