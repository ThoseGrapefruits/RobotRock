const express = require('express');

const path = require('path');
const process = require('process');

const cwd = process.cwd();

express.static.mime.define({ 'application/javascript': [ 'md' ] } );

async function startServer({
  handleRawInput
}) {
  const app = express();
  const expressWS = require('express-ws');
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

  console.log('Web server listening on http://raspberrypi.local:8080')
  
  return app.listen(8080);
}

module.exports = {
  startServer
};
