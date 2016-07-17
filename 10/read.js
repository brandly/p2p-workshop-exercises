const levelup = require('level')
const scuttleup = require('scuttleup')

const db = levelup('test.db')
const log = scuttleup(db)

var changes = log.createReadStream({
  live: true
})

changes.on('data', function (data) {
  console.log(data.entry.toString(), data)
})
