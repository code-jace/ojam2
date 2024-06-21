export interface ActiveSession {
    sessionId: string;
    videoPlayerSocketId: string;
    clients: Set<string>;
}