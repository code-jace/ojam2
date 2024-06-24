import { Session, Voter } from '../models/session';

// In-memory sessions store
const sessions: { [key: string]: Session } = {};

export const createSession = (id: string, sessionName: string): Session => {
  const session: Session = {
    id,
    sessionName,
    videoQueue: ['dtyOoaW6EyQ', '0kOTvMf2YuY'],
    currentVideoIndex: 0,
    voters: [],
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
  return sessions[sessionId];
};

export const addVideoToQueue = (sessionId: string, videoId: string) => {
  if (sessions[sessionId]) {
    sessions[sessionId].videoQueue.push(videoId);
  }
};

export const getCurrentVideo = (sessionId: string): string | null => {
  if (sessions[sessionId]) {
    const session = sessions[sessionId];
    return session.videoQueue[session.currentVideoIndex] || null;
  }
  return null;
};

export const skipCurrentVideo = (sessionId: string): string | null => {
  if (sessions[sessionId]) {
    const session = sessions[sessionId];
    if (session.currentVideoIndex < session.videoQueue.length - 1) {
      session.currentVideoIndex++;
      return session.videoQueue[session.currentVideoIndex];
    }
  }
  return null;
};

// Export sessions for external usage (if necessary)
export const getSessions = () => sessions;
