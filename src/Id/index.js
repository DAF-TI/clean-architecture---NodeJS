 import cuid from 'cuid'
//const cuid = require('cuid')

export default Id

const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid
})

