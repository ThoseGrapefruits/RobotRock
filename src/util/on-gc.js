const registry = new FinalizationRegistry(heldValue => heldValue());

// Trigger a function right before garbage collection starts (theoretically).
function onGC(callback) {
  let orphan = {};
  orphan.finalize = callback;
  registry.register(orphanable, orphanable.finalize);

  // Orphan drops out of scope and becomes a true orphan as soon as this
  // function returns. Callback should be called right before GC starts.
}

module.exports = onGC;
