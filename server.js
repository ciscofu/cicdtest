const https = require('https');
const express = require('express');
const app = express();

function StartServer(port) {
  return new Promise((resolve, reject) => {
    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/api/weather/:zipcode', (request, response) => {
      let zip = request.params.zipcode;

      const api_url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&APPID=a78fc39258fce6d1d4adc2c02971cca7`;
      https.get(api_url, res => {
        const chunks = [];
        res.on('data', chunk => { chunks.push(chunk); });
        res.on('end', () => {
          const data = Buffer.concat(chunks).toString();
          try {
            const result = JSON.parse(data);
            response.set('Content-Type', 'application/json');
            response.send(JSON.stringify(result, null, 2));
          } catch (e) {
            console.log(new Date(), e);
            console.log(data);
            console.log('---');
            response.sendStatus(501);
          }
        });
      }).on('error', e => {
        console.log(new Date(), e);
        console.log('---');
        response.sendStatus(500);
      });
    });

    let activeServer = app.listen(port, () => {
      resolve(activeServer);
    });
  });
}

function StopServer(activeServer) {
  activeServer.close();
}

module.exports = { StartServer, StopServer }