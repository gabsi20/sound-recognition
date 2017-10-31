const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080


app.use(express.static('dist'));

io.on('connection', function(socket) {
  console.log('a user connected');


  socket.on('start', function(data) {
    io.sockets.emit('newPlatformStart');
  })

  socket.on('stop', function(data) {
    io.sockets.emit('newPlatformStop');
  })


});

http.listen(PORT, function() {
  console.log('listening on *: ' + PORT);
});
