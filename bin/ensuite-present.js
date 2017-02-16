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

http.createServer((request, response) => {
    // A quick and dirty router ;-)
    // /pages/viewer/ => /pages/viewer/viewer-page.html
    // /pages/console/?slide-deck-url=... => /pages/console/console-page.html?slide-deck-url=...
    request.url = request.url.replace(/^(\/pages\/)([^\/]+)\/(\?.*)?$/, '$1$2/$2-page.html$3')
    request
      .addListener('end', () => fileServer.serve(request, response))
      .resume()
  }).listen(PORT)

console.log(`ensuite-present available on http://localhost:${PORT}`)
