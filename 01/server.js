const net = require('net')
const config = require('./config')

const server = net.createServer((client) => {
  // Whatever we get, send it right back
  client.pipe(client)
})

server.listen(config.port)
