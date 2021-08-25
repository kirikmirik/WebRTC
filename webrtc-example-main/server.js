const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// Сервер
const app = express();
const server = http.Server(app);

// Map HTML and Javascript files as static
app.use(express.static('public'));

// Инициализация Socket IO Сервера
const io = socketio(server);


'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

var ip = '<%=request.getRemoteHost();%>'; // для получения локального IP
// Network interfaces
var ifaces = require('os').networkInterfaces();

// Iterate over interfaces ...
var adresses = Object.keys(ifaces).reduce(function (result, dev) {
  return result.concat(ifaces[dev].reduce(function (result, details) {
    return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
  }, []));
});
// Print the result
console.log(adresses)


// Array to map all clients connected in socket
let connectedUsers = [];

// Called whend a client start a socket connection
io.on('connection', (socket) => {
  // It's necessary to socket knows all clients connected
  connectedUsers.push(socket.id);
  console.log('\n connectedUsers', connectedUsers)

  // Emit to myself the other users connected array to start a connection with each them
  const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);
    socket.emit('other-users', otherUsers);

  // Send Offer To Start Connection
  socket.on('offer', (socketId, description) => {
    console.log('\n send offer')
    socket.to(socketId).emit('offer', socket.id, description);
  });

  // Send Answer From Offer Request
  socket.on('answer', (socketId, description) => {
    console.log('\n send answer')
    socket.to(socketId).emit('answer', description);
  });

  // Send Signals to Establish the Communication Channel
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  // Remove client when socket is disconnected
  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  });
});

// Return Index HTML when access root route
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start server in port 3000 or the port passed at "PORT" env variable
server.listen(process.env.PORT || 3000,
  function onListen() {
  var address = server.address();
  console.log('Server listening on: http://localhost:%d', address.port);
 });
