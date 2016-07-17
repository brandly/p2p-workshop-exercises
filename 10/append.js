const levelup = require('level')
const scuttleup = require('scuttleup')

const db = levelup('test.db')
const log = scuttleup(db)

log.append('hello world')
