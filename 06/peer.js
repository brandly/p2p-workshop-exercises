const topology = require('fully-connected-topology')
const streamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')

const username = process.argv[2]
const me = process.argv[3]
const peers = process.argv.slice(4)

const client = topology(me, peers)
const activeSockets = new streamSet()

client.on('connection', (socket, peer) => {
  console.log('connected to', peer)

  socket = jsonStream(socket)
  activeSockets.add(socket)

  socket.on('data', (data) => {
    process.stdout.write(`${data.username}> ${data.message}\n`)
  })
})

process.stdin.on('data', (data) => {
  data = data.toString().trim()

  activeSockets.forEach(socket => {
    socket.write({
      username,
      message: data
    })
  })
})
