'use strict'

var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(9999)

const sockets = []

io.on('connection', function (socket) {
  sockets.push(socket)
  console.log(sockets.length);
  socket.on('ONE', function (data) {
    console.log(data)
    sockets.forEach((s) => {
      s.emit('TWO', data)
    })
  })
  socket.on('THREE', function (data) {
    console.log(data)
    sockets.forEach((s) => {
      s.emit('FOUR', data)
    })
  })
});
