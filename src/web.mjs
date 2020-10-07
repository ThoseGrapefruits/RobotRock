import express from 'express';

import path from 'path';
import process from 'process';

import { handleRawInput } from './input.mjs';

const cwd = process.cwd();

express.static.mime.define({'application/javascript': ['md']});

export async function startServer() {
  const app = express();
  const { default: expressWS } = await import('express-ws');
  expressWS(app);

  app.use('/', express.static(path.join(cwd, 'src/client')));

  app.get('/', function(request, response){
    response.sendFile(path.join(cwd + 'src/client/index.html'));
  });
  
  app.ws('/', function(ws, request) {
    ws.on('message', function(message) {
      handleRawInput(message)
    });

    ws.on('close', () => {
      console.log('WebSocket was closed')
    })
  });
  
  app.listen(8080);
}