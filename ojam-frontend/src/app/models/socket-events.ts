export interface AddVideoRequest {
    sessionId: string;
    videoId: string;
    videoName: string;
}

export interface SessionRequest {
    sessionId: string;
    //videoId: string;
}

export interface SessionResponse {
    sessionId: string;
}


export interface ConnectedResponse {
    sessionId: string;
    sessionName: string;
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

export interface VideoResponse {
    videoId: string;
    videoName: string;
}

export interface VideoUpdate {
    videoId: string;
    videoName: string;
    duration: number;
    currentTime: number;
}