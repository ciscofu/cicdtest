const assert = require('assert');
const http = require('http');
const server = require('../server');

const testPort = 8081;
let devServer;

describe("Microservice tests", () => {
  // Initialization before any tests are run.
  before(function (done) {
    server.StartServer(testPort).then(server => {
      devServer = server;
      done();
    })
  });

  // After all tests have completed
  after(() => {
    server.StopServer(devServer);
  });

  describe("Web browser requests", () => {
    it("should respond to normal web requests", function (done) {
      DoHttpGet(`http://127.0.0.1:${testPort}/`)
        .then(result => {
          assert.equal(result, 'Hello World!');
        }).catch(e => {
          assert.fail(e);
        }).finally(() => {
          done();
        });
    });
  });

  describe("API tests", () => {
    it("it should handle invalid zip codes gracefully", function (done) {
      DoHttpGet(`http://127.0.0.1:${testPort}/api/weather/00000`)
        .then(result => {
          assert.equal(typeof result, 'object');
          assert.equal(result.cod, '404');
        }).catch(e => {
          assert.fail(e);
        }).finally(() => {
          done();
        });
    });

    it("should handle valid zip codes properly", function (done) {
      DoHttpGet(`http://127.0.0.1:${testPort}/api/weather/60515`)
        .then(result => {
          assert.equal(typeof result, 'object');
          assert.equal(result.cod, 200);
          assert.equal(result.name, 'Downers Grove');
        }).catch(e => {
          assert.fail(e);
        }).finally(() => {
          done();
        });
    });
  });
});

function DoHttpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      const chunks = [];
      res.on('data', chunk => { chunks.push(chunk); });
      res.on('end', () => {
        const data = Buffer.concat(chunks).toString();
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', e => {
      reject(e);
    });
  });
}