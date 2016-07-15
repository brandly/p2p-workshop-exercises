const topology = require('fully-connected-topology')

const me = process.argv[2]
const peers = process.argv.slice(3)

const client = topology(me, peers)

client.on('connection', (connection, peer) => {
  console.log('connected to', peer)
})
