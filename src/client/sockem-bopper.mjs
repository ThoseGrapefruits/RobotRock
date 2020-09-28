let bopper = null;

function isConnected() {
  return bopper?.readyState === 1;
}

function isConnecting() {
  return bopper?.readyState === 0;
}

function isDisconnected() {
  return !bopper || bopper.readyState === 3;
}

function isDisconnecting() {
  return bopper?.readyState === 2;
}

const handleMessage = event => {
  const { name, detail } = JSON.parse(event.data);

  dispatchEvent(new CustomEvent(name, { detail }))
};

export async function connect() {
  if (isConnected()) {
    return;
  }

  if (!isConnecting()) {
    const url = new URL(location.origin);
    url.protocol = 'wss:';
    bopper = new WebSocket(url);
    bopper.addEventListener('message', handleMessage);
  }

  await new Promise((resolve, reject) => {
    bopper.addEventListener('close', onClose);
    bopper.addEventListener('error', onError);
    bopper.addEventListener('open', onOpen);

    function cleanUp() {
      bopper.removeEventListener('close', onClose);
      bopper.removeEventListener('error', onError);
      bopper.removeEventListener('open', onOpen);
    }

    function onClose() {
      cleanUp();
      reject(new Error('WebSocket closed abruptly'));
    }

    function onError({ error }) {
      cleanUp();
      reject(error);
    }

    function onOpen() {
      cleanUp();
      resolve();
    }
  });
}

export async function disconnect() {
  if (isDisconnected()) {
    return;
  }

  if (!isDisconnecting()) {
    bopper.close(1000);
    bopper.removeEventListener('close', handleUnexpectedClose);
  }

  await new Promise((resolve, reject) => {
    bopper.addEventListener('close', onClose);
    bopper.addEventListener('error', onError);

    function cleanUp() {
      bopper.removeEventListener('close', onClose);
      bopper.removeEventListener('error', onError);
    }

    function onClose() {
      cleanUp();
      resolve();
    }

    function onError({ error }) {
      cleanUp();
      reject(error);
    }
  });
}

export async function sock(data) {
  await connect();
  bopper.send(data);
}

export async function sockJSON(data) {
  await sock(JSON.stringify(data));
}
