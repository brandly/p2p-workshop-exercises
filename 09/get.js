'use strict'

const levelup = require('level')

const db = levelup('./test.db')

db.get('hello', (err, value) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('got value', value)
})
