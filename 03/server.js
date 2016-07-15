const net = require('net')
const config = require('./config')
const StreamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')

const activeClients = new StreamSet()

const server = net.createServer((client) => {
  client = jsonStream(client)

  console.log('new connection')
  activeClients.add(client)

  client.on('data', (data) => {
    activeClients.forEach(otherClient => {
      if (otherClient !== client) {
        otherClient.write(data)
      }
    })
  })
})

server.listen(config.port)
