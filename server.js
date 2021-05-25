const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./utils/messages');
const { getCurrentUser, userJoin, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 5000;
const botName = 'ChatBot';

app.use(express.static(path.join(__dirname, 'public')));

// Wird ausgeführt wenn sich Client verbindet
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Willkommensnachricht für neuen User
    socket.emit('message', formatMessage(botName, 'Willkommen bei ChatBox!'));

    // Broadcast wenn User login an alle anderen User
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} ist dem Chat beigetreten`));

    // Sende User und Chatroom info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Eintreffende Chat Nachrichten
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);
    io.emit('message', formatMessage(user.username, message))
  });

  // Wenn User logout
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      // Nachricht an alle anderen User
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} hat den Chat verlassen.`));

      // Sende User und Chatroom info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    };
  });

});

server.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});