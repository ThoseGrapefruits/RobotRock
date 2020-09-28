import express from 'express';
import expressWS from 'express-ws';
expressWS(app);

import path from 'path';
import process from 'process';

import { handleRawInput } from './input.mjs';

const cwd = process.cwd();

express.static.mime.define({'application/javascript': ['md']});

export async function startServer() {
  const app = express();

  app.use('/', express.static(path.join(cwd, 'src/client')));

  app.get('/', function(req, res){
    res.sendFile(path.join(cwd + 'src/client/index.html'));
  });
  
  app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
      console.log(`websocket received: ${ message }`);
      handleRawInput(message)
    });

    ws.on('close', () => {
      console.log('WebSocket was closed')
    })
  });
  
  app.listen(8080);
}