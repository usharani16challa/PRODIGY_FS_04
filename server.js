const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userList', Object.values(users));
  });

  socket.on('send_message', (data) => {
    io.emit('receive_message', {
      sender: users[socket.id],
      message: data.message
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userList', Object.values(users));
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Chat Server is running');
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});