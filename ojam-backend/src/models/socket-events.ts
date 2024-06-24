export interface CreateSessionResponse {
    sessionId: string;
    sessionName: string;
}

export interface JoinSessionRequest {
    sessionId: string;
    username: string;
}

export interface ConnectedResponse {
    sessionId: string;
    username: string;
}

export interface SessionRequest {
    sessionId: string;
}

export interface SessionResponse {
    sessionId: string;
}

export interface AddVideoRequest {
    sessionId: string;
    videoId: string;
}

export interface VideoAddedResponse {
    videoId: string;
}

export interface VetoCurrentVideoRequest {
    sessionId: string;
    //videoId: string;
}

export interface VideoResponse {
    videoId: string;
}

export interface ErrorResponse {
    message: string;
}