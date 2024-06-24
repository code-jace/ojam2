export interface Session {
    id: string;
    sessionName: string;
    videoPlayerId: string;
    videoQueue: Video[];
    currentVideoIndex: number;
    playlistEnded: boolean;
    voters: Voter[];
    vetoVotes: Set<string>; // voterIds
}

export interface Voter {
    id: string;
    username: string;
}

export interface Video {
    id: string;
    title: string;
    vetoed: boolean;
}