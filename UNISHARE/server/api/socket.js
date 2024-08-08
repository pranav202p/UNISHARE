import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new SocketIOServer(server);

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('A user connected!');
  socket.on('join-room', (productId) => {
    socket.join(productId);
    connectedUsers[socket.id] = productId;
    console.log(`User ${socket.id} joined room ${productId}`);
  });
  socket.on('send-message', async (data) => {
    try {
      const newMessage = new Chat(data);
      await newMessage.save();
      io.to(connectedUsers[socket.id]).emit('receive-message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
  socket.on('disconnect', () => {
    const roomId = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    console.log(`User ${socket.id} disconnected from room ${roomId}`);
  });
});

export default server;
