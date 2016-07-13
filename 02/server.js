const net = require('net')
const config = require('./config')
const streamSet = require('stream-set')

const activeClients = new streamSet()

const server = net.createServer((client) => {
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
