import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { CreateSessionResponse, SessionRequest, VideoResponse } from '../models/socket-events';

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

  onCurrentVideo(callback: (data: VideoResponse) => void) {
    this.socketService.on('currentVideo', callback);
  }

  onVideoSkipped(callback: (data: VideoResponse) => void) {
    this.socketService.on('videoSkipped', callback);
  }

  onEndOfPlaylist(callback: () => void) {
    this.socketService.on('endOfPlaylist', callback);
  }

  onVideoAdded(callback: (data: VideoResponse) => void) {
    this.socketService.on('videoAdded', callback);
  }

  videoEnd(data: SessionRequest) {
    this.socketService.emit('videoEnd', data)
  }

  onNextVideo(callback: (data: VideoResponse) => void) {
    this.socketService.on('nextVideo', callback);
  }

}
