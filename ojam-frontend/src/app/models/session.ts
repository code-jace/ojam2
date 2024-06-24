export interface Session {
    id: string;
    sessionName: string;
    videoQueue: string[];
    currentVideoIndex: number;
    voters: Voter[];
  }
  
  export interface Voter {
    id: string;
    username: string;
  }