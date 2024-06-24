export interface AddVideoRequest {
    sessionId: string;
    videoId: string;
}

export interface VetoCurrentVideoRequest {
    sessionId: string;
    //videoId: string;
}


export interface ConnectedResponse {
    sessionId: string;
    username: string;
}

export interface CreateSessionResponse {
    sessionId: string;
    sessionName: string;
}

export interface JoinSessionRequest {
    sessionId: string;
    username: string;
}

export interface ErrorResponse {
    message: string;
}

export interface VideoAddedResponse {
    videoId: string;
}

export interface VideoSkippedResponse {
    nextVideo: string;
}