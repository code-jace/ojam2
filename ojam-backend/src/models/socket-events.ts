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

export interface GetCurrentVideoRequest {
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

export interface VideoSkippedResponse {
    nextVideo: string;
}

export interface ErrorResponse {
    message: string;
}