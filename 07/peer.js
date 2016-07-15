'use strict'

const topology = require('fully-connected-topology')
const streamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')
const uuid = require('node-uuid')

const username = process.argv[2]
const me = process.argv[3]
const peers = process.argv.slice(4)

const swarm = topology(me, peers)
const activeSockets = new streamSet()

const clientId = uuid.v4()
let messageCount = 0

const clientToCount = {}

function hasntSeen (data) {
  return typeof clientToCount[data.clientId] === 'undefined' || clientToCount[data.clientId] < data.count
}

function isUndefined (val) {
  return typeof val === 'undefined'
}

swarm.on('connection', (socket, peer) => {
  console.log('connected to', peer)

  socket = jsonStream(socket)
  activeSockets.add(socket)

  socket.on('data', (data) => {
    if (hasntSeen(data) && data.clientId !== clientId) {
      process.stdout.write(`${data.username}> ${data.message}\n`)

      // Store the most recent message we've seen from `clientId`
      clientToCount[data.clientId] = data.count

      // Forward thru to everyone
      activeSockets.forEach(socket => socket.write(data))
    }
  })
})

process.stdin.on('data', (data) => {
  const message = data.toString().trim()

  activeSockets.forEach(socket => {
    socket.write({
      username,
      message,
      clientId,
      count: messageCount
    })
  })

  messageCount += 1
})
