const server = require('./server');

process.on('SIGTERM', () => {
  console.log(new Date(), `Received sigterm. Shutting down gracefully.`);
  process.exit(0);
});

server.StartServer(8080);