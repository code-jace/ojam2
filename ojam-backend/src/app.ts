import cors, { CorsOptions } from 'cors';
import express from 'express';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:4200', // Allow Angular app
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:4200' }));


// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express and Socket.io! 1');
});

// Store connected clients
let clients: Socket[] = [];

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A new client connected');

  // Add client to the list
  clients.push(socket);

  // Broadcast new connection to all clients
  io.emit('user-connected', socket.id);

  // Listen for messages
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast message to all clients
    io.emit('message', {senderId: data.senderId, sender: data.sender, message: data.message });
  });

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    // Remove client from the list
    clients = clients.filter(client => client !== socket);
    // Broadcast disconnection to all clients
    io.emit('user-disconnected', socket.id);
  });
});

export { server };