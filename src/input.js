const NANO = 1e9;

const inputListeners = [];
let lastInputTime = process.hrtime();

function addInputListener(callback) {
  inputListeners.push(callback);
}

function handleRawInput(rawInput) {
  const { input } = JSON.parse(rawInput);

  if (!input) {
    return;
  }

  const [ seconds, nanoseconds ] = process.hrtime(lastInputTime);
  lastInputTime = process.hrtime();
  const elapsed = seconds * NANO + nanoseconds;

  for (const listener of inputListeners) {
    listener(input, elapsed);
  }
}

module.exports = {
  addInputListener,
  handleRawInput
};
