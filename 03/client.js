'use strict'

const net = require('net')
const config = require('./config')
const jsonStream = require('duplex-json-stream')

let username
const connection = jsonStream(net.connect(config.port, () => {
  process.stdin.on('data', (data) => {
    data = data.toString().trim()

    if (username) {
      connection.write({
        username,
        message: data
      })
    } else {
      username = data
    }
  })

  process.stdout.write('your name: ')
}))

connection.on('data', (data) => {
  process.stdout.write(`${data.username}> ${data.message}\n`)
})
