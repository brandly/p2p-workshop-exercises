'use strict'

require('lookup-multicast-dns/global')
const registerDns = require('register-multicast-dns')
const topology = require('fully-connected-topology')
const hashToPort = require('hash-to-port')
const levelup = require('level')
const scuttleup = require('scuttleup')

const username = process.argv[2]
const peers = process.argv.slice(3)

registerDns(username)
const swarm = topology(toAddress(username), peers.map(toAddress))
const db = levelup(username + '.db')
const logs = scuttleup(db, { valueEncoding: 'json' })

function toAddress (username) {
  return username + '.local:' + hashToPort(username)
}

swarm.on('connection', (socket, peer) => {
  console.log('info> connected to', peer)

  socket.pipe(logs.createReplicationStream({ live: true })).pipe(socket)
})

logs
  .createReadStream({live: true})
  .on('data', (data) => {
    console.log(`${data.entry.username}> ${data.entry.message}`)
  })

process.stdin.on('data', (data) => {
  logs.append({
    username,
    message: data.toString().trim()
  })
})
