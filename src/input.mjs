const inputListeners = [];
let lastInputTime = undefined;

export function handleRawInput(rawInput) {
  const { input } = JSON.parse(rawInput);

  if (!input) {
    return;
  }

  const now = process.hrtime.bigint();
  const elapsed = lastInputTime && now - lastInputTime;
  lastInputTime = now;

  for (const listener of inputListeners) {
    listener(input, elapsed);
  }
}

export function addInputListener(callback) {
  inputListeners.push(callback);
}
