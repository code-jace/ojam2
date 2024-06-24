import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {
  addVideoToQueue,
  addVoterToSession,
  createSession,
  getCurrentVideo,
  getSession,
  getSessions,
  removeVoterFromSession,
  skipCurrentVideo,
} from './services/session.service';
import {
  AddVideoRequest,
  ConnectedResponse,
  CreateSessionResponse,
  JoinSessionRequest,
  ErrorResponse,
  VideoAddedResponse,
  VideoSkippedResponse,
  GetCurrentVideoRequest,
  VetoCurrentVideoRequest,
} from './models/socket-events';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:4200', // Allow Angular app
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: 'http://localhost:4200' }));

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express and Socket.io! 1');
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('createSession', (sessionName: string) => {
    const sessionId = `${Math.random().toString(36).substring(2, 15)}`;
    createSession(sessionId, sessionName);
    socket.join(sessionId);
    const response: CreateSessionResponse = { sessionId, sessionName };
    socket.emit('sessionCreated', response);
    console.log(`Session created: ${sessionId}`);
  });

  socket.on('joinSession', (data: JoinSessionRequest) => {
    const { sessionId, username } = data;
    const session = getSession(sessionId);
    if (session) {
      addVoterToSession(sessionId, { id: socket.id, username });
      socket.join(sessionId);
      const response: ConnectedResponse = { sessionId, username };
      socket.emit('connected', response);
      io.to(sessionId).emit('voterJoined', username);
      console.log(`Voter ${username} joined session ${sessionId}`);
    } else {
      const response: ErrorResponse = { message: 'Session does not exist' };
      socket.emit('sessionNotFound', response);
    }
  });

  socket.on('addVideo', (data: AddVideoRequest) => {
    const { sessionId, videoId } = data;
    addVideoToQueue(sessionId, videoId);
    const response: VideoAddedResponse = { videoId };
    io.to(sessionId).emit('videoAdded', response);
  });
  
  socket.on('getCurrentVideo', (data: GetCurrentVideoRequest) => {
    const {sessionId} = data;
    const videoId = getCurrentVideo(data.sessionId);
    console.log(sessionId, videoId)
    if(videoId){
      const response: VideoSkippedResponse = { nextVideo: videoId}
      io.to(sessionId).emit('currentVideo', response);
    }

  });

  socket.on('vetoVideo', (data: VetoCurrentVideoRequest) => {
    const session = getSession(data.sessionId);
    if (session) {
      const nextVideo = skipCurrentVideo(session.id);
      if (nextVideo) {
        const response: VideoSkippedResponse = { nextVideo };
        io.to(session.id).emit('videoSkipped', response);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    const sessions = getSessions();
    Object.keys(sessions).forEach((sessionId) => {
      removeVoterFromSession(sessionId, socket.id);
      io.to(sessionId).emit('voterLeft', socket.id);
    });
  });
});

export { server };
