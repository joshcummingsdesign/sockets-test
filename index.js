const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.port || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clear');
  });
});

http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
