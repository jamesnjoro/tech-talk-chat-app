const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const users = []

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'frontend/index.html'));
});

app.use(express.static('frontend'))

io.on('connection', (socket) => {

    socket.on('identify', (msg) => {
        users.push(msg)
        io.emit('identify', users);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

  });

server.listen(5000, () => {
  console.log('server running at http://localhost:3000');
});