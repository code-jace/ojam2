import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {
  addVideoToQueue,
  addVoterToSession,
  createSession,
  getSession,
  getSessions,
  progressVideo
} from './services/session.service';
import {
  AddVideoRequest,
  ConnectedResponse,
  CreateSessionResponse,
  JoinSessionRequest,
  ErrorResponse,
  VideoResponse,
  SessionRequest,
  VetoCurrentVideoRequest,
  VideoUpdate,
} from './models/socket-events';
import { Session } from './models/session';

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    // origin: 'http://localhost:4200', // Allow Angular app
    origin: 'https://code-jace.github.io/ojam2/', // Allow Angular app
    methods: ['GET', 'POST'],
  },
});

// app.use(cors({ origin: 'http://localhost:4200' }));
app.use(cors({ origin: 'https://code-jace.github.io/ojam2/' }));


// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express and Socket.io! 1');
});

const checkAndHandleVeto = (session: Session) => {
  const vetoCount = session.vetoVotes.size;
  const voterCount = session.voters.length;

  console.log(`Recalculating veto count. Veto count: ${vetoCount}/${voterCount}`);

  if (vetoCount >= Math.ceil(voterCount / 2)) {    

    const nextVideo = progressVideo(session.id, true);
    if (nextVideo) {
      const response: VideoResponse = { videoId: nextVideo.id, videoName: nextVideo.title };
      io.to(session.id).emit('nextVideo', response);
      session.vetoVotes.clear();
    }
  }
};

const removeVoterFromSession = (sessionId: string, voterId: string) => {
  const session = getSession(sessionId);
  if (session) {
    const voterIndex = session.voters.findIndex(voter => voter.id === voterId);
    if (voterIndex !== -1) {
      session.voters.splice(voterIndex, 1);
      session.vetoVotes.delete(voterId);
    }
  }
};


io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('createSession', (sessionName: string) => {
    const sessionId = generateSessionId();
    createSession(sessionId, sessionName, socket.id);
    socket.join(sessionId);
    const response: CreateSessionResponse = { sessionId, sessionName };
    socket.emit('sessionCreated', response);
    console.log(`Session created: ${sessionId}`);

    socket.on('videoEnd', (data: SessionRequest) => {
      const vid = progressVideo(data.sessionId);
      if (vid) {
        const response: VideoResponse = { videoId: vid.id, videoName: vid.title}
        socket.emit('nextVideo', response);
      } else {
        const sesh = getSession(sessionId);
        if (sesh) {
          sesh.playlistEnded = true;
        }
        socket.emit('endOfPlaylist');
      }

    });

    socket.on('updateVideoDetails', (data: VideoUpdate) => {
      socket.to(sessionId).emit('updateVideoDetails', data);
    })

  });

  socket.on('joinSession', (data: JoinSessionRequest) => {
    const { sessionId, username } = data;
    const session = getSession(sessionId);
    if (session) {
      addVoterToSession(sessionId, { id: socket.id, username });
      socket.join(sessionId);
      const response: ConnectedResponse = { sessionId, sessionName: session.sessionName, username };
      socket.emit('connected', response);
      io.to(sessionId).emit('voterJoined', username);
      console.log(`Voter ${username} joined session ${sessionId}`);
    } else {
      const response: ErrorResponse = { message: 'Session does not exist' };
      socket.emit('sessionNotFound', response);
    }
  });

  socket.on('addVideo', (data: AddVideoRequest) => {
    const { sessionId, videoId, videoName } = data;
    addVideoToQueue(sessionId, videoId, videoName);
    const response: VideoResponse = { videoId, videoName };
    socket.emit('videoAdded', response);
    const sesh = getSession(sessionId)
    if (sesh) {
      if (sesh.playlistEnded) {
        // jumpstart index 0
        let vid = sesh.videoQueue[0];
        if (sesh.videoQueue.length > 1) {
          // after 1st video progress as normal
          vid = progressVideo(data.sessionId)!;
        }
        if (videoId) {
          const response: VideoResponse = { videoId: vid.id, videoName: vid.title }
          sesh.playlistEnded = false;
          io.to(sessionId).emit('nextVideo', response);
        }
      }
    } else {
      // TODO message, no player found
    }
  });

  socket.on('videoEnded', (data: SessionRequest) => {
    const { sessionId } = data;
    const vid = progressVideo(data.sessionId);
    if (vid) {
      const response: VideoResponse = { videoId: vid.id, videoName: vid.title }
      io.to(sessionId).emit('nextVideo', response);
    }

  });

  socket.on('vetoVideo', (data: VetoCurrentVideoRequest) => {
    const session = getSession(data.sessionId);
    if (session) {
      session.vetoVotes.add(socket.id);
      console.log(`Voter ${socket.id} voted to veto.`);
      checkAndHandleVeto(session);
    }
});

 socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    const sessions = getSessions();
    Object.keys(sessions).forEach((sessionId) => {
      const session = sessions[sessionId];
      const voterIndex = session.voters.findIndex(voter => voter.id === socket.id);

      if (voterIndex !== -1) {
        removeVoterFromSession(sessionId, socket.id);
        console.log(`Voter ${socket.id} left session ${sessionId}. Voters left: ${session.voters.length}`);
        io.to(sessionId).emit('voterLeft', socket.id);
        checkAndHandleVeto(session);        
        
      }

      // If the video player disconnects, close the session
      if (session.videoPlayerId === socket.id) {
        delete sessions[sessionId];
        io.to(sessionId).emit('sessionClosed', sessionId); // Notify all clients that the session is closed
        console.log(`Session ${sessionId} closed as the video player disconnected`);
      } 
    });
    
  });
});

function generateSessionId(): string {
  return `${Math.random().toString(36).substring(7)}`;
}

export { server };
