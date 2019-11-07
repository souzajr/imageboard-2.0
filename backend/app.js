'use strict'

const express = require('express')
const app = express()
const consign = require('consign')
const db = require('./src/config/db')
require('dotenv').config()
db.openConn()

app.use(express.static(__dirname))

consign()
  .include('./src/config/passport.js')
  .then('./src/config/middlewares.js')
  .then('./src/api/validation.js')
  .then('./src/api')
  .then('./src/config/routes.js')
  .into(app)

//const checkAdmin = require('./src/config/checkAdmin')
//checkAdmin.createAdmin()

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
  if (process.env.AMBIENT_MODE === 'DEV')
    console.log('\x1b[41m\x1b[37m', 'MODO DE DESENVOLVIMENTO', '\x1b[0m')
})
