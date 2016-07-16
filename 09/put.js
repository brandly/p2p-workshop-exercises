'use strict'

const levelup = require('level')

const db = levelup('./test.db')

db.put('hello', 'world', (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('did it')
})
