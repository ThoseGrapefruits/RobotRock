let latestInput = null;

export function handleRawInput(rawInput) {
  const { input } = JSON.parse(rawInput);

  if (!input) {
    return;
  }

  latestInput = input;
}

export function getLatestInput() {
  return latestInput;
}
