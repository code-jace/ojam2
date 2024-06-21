import cors, { CorsOptions } from 'cors';
import express from 'express';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { ActiveSession } from './models/session';

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

const activeSessions: { [sessionId: string]: ActiveSession } = {};


// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A new client connected');
  clients.push(socket);
  // Broadcast new connection to all clients
  io.emit('user-connected', socket.id);

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    // Remove client from the list
    clients = clients.filter(client => client !== socket);
    // Broadcast disconnection to all clients

    // Handle session cleanup on disconnect
    const activeSession = activeSessions[socket.id];
    if (activeSession) {
      delete activeSessions[socket.id];
      io.to(activeSession.sessionId).emit('userDisconnected', socket.id);
    }
  });

  // ---video player---

  // Handle video player creating a new session
  socket.on('createSession', () => {
    const sessionId = `${Math.random().toString(36).substring(7)}`; // Generate unique session ID

    const newSession: ActiveSession = {
      sessionId: sessionId,
      videoPlayerSocketId: socket.id, // Assuming the creator becomes the video player
      clients: new Set<string>()
    };

    activeSessions[sessionId] = newSession;
    socket.join(sessionId);

    console.log(`Video player created session ${sessionId}`);
    socket.emit('sessionCreated', sessionId);
  });

  // Handle control component joining a session
  socket.on('joinSessionControl', (sessionId: string) => {
    if (activeSessions[sessionId]) {
      socket.join(sessionId);
      activeSessions[sessionId].clients.add(socket.id);
      console.log(`A voter joined session ${sessionId}. Voters: ${activeSessions[sessionId].clients.size}`);
      io.to(activeSessions[sessionId].sessionId).emit('controlConnected');
    } else {
      socket.emit('sessionNotFound', 'Session does not exist');
    }
  });

  // ---sockets used for chat---
  // Listen for messages
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast message to all clients
    io.emit('message', { senderId: data.senderId, sender: data.sender, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    // Handle cleanup or session-related logic on disconnect
    closeVideoPlayer(socket.id);
    removeVoterFromSessions(socket.id);
  });


  const removeVoterFromSessions = (voterId: string): void => {
    console.log('removing ', voterId);
    
    // Iterate through activeSessions and remove the socket.id from connectedClients
    Object.keys(activeSessions).forEach(sessionId => {
      if (activeSessions[sessionId].clients.has(voterId)) {
        activeSessions[sessionId].clients.delete(voterId);
        console.log(`Removed ${voterId} from session ${sessionId}. Voters: ${activeSessions[sessionId].clients.size}`);

        // Optional: Emit event to all clients in the session to update UI about disconnected voter
        //io.to(sessionId).emit('controlDisconnected', activeSessions[sessionId].clients.size);
      }
    });
  };

  // TODO handle disconnect of video player, close session
  const closeVideoPlayer = (ownerId: string): void => {
    console.log('closing session owned by ', ownerId);
    
    let target: string|null = null;
    // Iterate through activeSessions and remove the socket.id from connectedClients
    Object.keys(activeSessions).forEach(sessionId => {
      if (activeSessions[sessionId].videoPlayerSocketId === ownerId) {
        target = activeSessions[sessionId].sessionId;

        // Optional: Emit event to all clients in the session to update UI about disconnected voter
        //io.to(sessionId).emit('controlDisconnected', activeSessions[sessionId].clients.size);
      }
    });

    if(target){
      delete activeSessions[target];
    }

    console.log(`Removed session with video socket: ${ownerId}}`);

  };

});


export { server };