const net = require('net')
const config = require('./config')

const connection = net.connect(config.port, () => {
  process.stdin.pipe(connection)
})

connection.on('data', (data) => {
  process.stdout.write(data)
})
