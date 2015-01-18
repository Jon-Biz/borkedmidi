'use strict';

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io')()
  , midi = require('midi')
  , input
  , system = {}

 , SegfaultHandler = require('segfault-handler');

SegfaultHandler.registerHandler();

// Get Midi Ports Info -----------------------------------
  function getPorts(midiInterface){
    var portCount = midiInterface.getPortCount()
      , ports = []

    for (var i = 0; i < portCount ; i++) {
      var port = {
        name : midiInterface.getPortName(i)
        , num : i
        }
      ports.push(port)
    }
    return ports
  }

  // Get Ports
  system.input = getPorts(new midi.input())
  system.output = getPorts(new midi.output())
  console.log(system)

// Open first port -----------------------------------

input = new midi.input()
input.openPort(0);
input.ignoreTypes(false, false, false);
// Configure a callback.
input.on('message', function(deltaTime, message) {
  console.log('m:' + message + ' d:' + deltaTime);
});

// Setup SocketIO -----------------------------------

io.listen(server)

io.on('connection', function(socket){
  console.log('a user connected');

  //send midi port info to client
  socket.emit('serverinfo',system)

  //receive client info
  socket.on('clientinfo', function(msg){
    console.log('clientinfo:',msg)
  })

  //log client heartbeat message
  socket.on('clientheartbeat', function(msg){
    console.log('clientbeat:',msg)
  })

  //send midi nots to client
  input.on('message', function(deltaTime, message) {
    socket.emit('midimsg',{'time':deltaTime, 'message': message})
  });

  //send heartbeat to client
  setInterval(function () {
   console.log('emiting')
    socket.emit('serverheartbeat',{'arg':'beep'})
  },5000)

});

// Set up web server -----------------------------------
app.use(express.static(__dirname + '/public'));

server.listen(3312, function(){
  console.log('listening on *:3312')
});

