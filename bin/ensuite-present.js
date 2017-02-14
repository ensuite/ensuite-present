#! /usr/bin/env node

'use strict'

const path = require('path')
const http = require('http')
const nodeStatic = require('node-static')

const PORT = 4320

process.title = path.basename(__filename, '.js')

const webRoot = path.resolve(__dirname, '..')
const fileServer = new nodeStatic.Server(webRoot)

http
  .createServer((request, response) => {
    request
      .addListener('end', () => fileServer.serve(request, response))
      .resume()
  })
  .listen(PORT)

console.log(`ensuite-present available on http://localhost:${PORT}`)
