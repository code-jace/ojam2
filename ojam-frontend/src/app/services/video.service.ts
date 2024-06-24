import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { CreateSessionResponse, VideoSkippedResponse } from '../models/socket-events';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private socketService: SocketService) { }

  createSession(sessionName: string) {
    this.socketService.emit('createSession', sessionName);
  }

  onSessionCreated(callback: (data: CreateSessionResponse) => void) {
    this.socketService.on('sessionCreated', callback);
  }

  getCurrentVideo(sessionId: string) {
    this.socketService.emit('getCurrentVideo', {sessionId});
  }

  onCurrentVideo(callback: (data: VideoSkippedResponse) => void) {
    this.socketService.on('currentVideo', callback);
  }

  onVideoSkipped(callback: (data: VideoSkippedResponse) => void) {
    this.socketService.on('videoSkipped', callback);
  }


}
