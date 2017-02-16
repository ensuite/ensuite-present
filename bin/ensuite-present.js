#!/usr/bin/env node

'use strict'

const path = require('path')
const http = require('http')
const nodeStatic = require('node-static')

const PORT = 4320

process.title = path.basename(__filename, '.js')

let webRoot
try {
  webRoot = path.dirname(path.dirname(require.resolve('ensuite-present')))
}
catch (e) {
  // used when running script out of project
  webRoot = path.dirname(__dirname)
}
const fileServer = new nodeStatic.Server(webRoot)

http
  .createServer((request, response) => {

    const matches = request.url.match(/^\/pages\/(.*?)\/$/)

    // This is a very very very simple router ;-)
    // /pages/foobar => /pages/foobar/foobar-page.html
    if (matches != null) {
      request.url += `${matches[1]}-page.html`
    }

    request
      .addListener('end', () => fileServer.serve(request, response))
      .resume()
  })
  .listen(PORT)

console.log(`ensuite-present available on http://localhost:${PORT}`)
