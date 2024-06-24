import { Session, Video, Voter } from '../models/session';

// In-memory sessions store
const sessions: { [key: string]: Session } = {};

export const createSession = (id: string, sessionName: string, videoPlayerId: string): Session => {
  const session: Session = {
    id,
    sessionName,
    videoPlayerId,
    videoQueue: [],
    currentVideoIndex: 0,
    playlistEnded: true,
    voters: [],
    vetoVotes: new Set()
  };
  sessions[id] = session;
  return session;
};

export const addVoterToSession = (sessionId: string, voter: Voter) => {
  if (sessions[sessionId]) {
    sessions[sessionId].voters.push(voter);
  }
};

export const removeVoterFromSession = (sessionId: string, voterId: string) => {
  if (sessions[sessionId]) {
    sessions[sessionId].voters = sessions[sessionId].voters.filter(
      (voter) => voter.id !== voterId
    );
  }
};

export const getSession = (sessionId: string): Session | undefined => {
  const s = sessions[sessionId];
  console.log(s);
  return s;
};

export const addVideoToQueue = (sessionId: string, videoId: string, videoName: string) => {
  if (sessions[sessionId]) {
    console.log(`Session: ${sessionId}: Adding Video: ${videoId}`);
    const vid: Video = {id: videoId, title: videoName, vetoed: false};
    sessions[sessionId].videoQueue.push(vid);
  }
};

export const progressVideo = (sessionId: string, veto?: boolean): Video|null => {
  if (sessions[sessionId]) {
    const session = sessions[sessionId];
    if(veto){
      const videoToVeto = session.videoQueue[session.currentVideoIndex];
      if(videoToVeto){
        videoToVeto.vetoed = true;
      }
    }
    if (session.currentVideoIndex < session.videoQueue.length - 1) {
      session.currentVideoIndex++;
      return session.videoQueue[session.currentVideoIndex];
    }
  }
  return null;
}

// Export sessions for external usage (if necessary)
export const getSessions = () => sessions;
