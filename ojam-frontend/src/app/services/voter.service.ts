import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { JoinSessionRequest, ConnectedResponse, ErrorResponse, SessionRequest, AddVideoRequest, SessionResponse } from '../models/socket-events';

@Injectable({
  providedIn: 'root'
})
export class VoterService {
  constructor(private socketService: SocketService) {}

  joinSession(data: JoinSessionRequest) {
    this.socketService.emit('joinSession', data);
  }

  onConnected(callback: (data: ConnectedResponse) => void) {
    this.socketService.on('connected', callback);
  }

  onSessionNotFound(callback: (data: ErrorResponse) => void) {
    this.socketService.on('sessionNotFound', callback);
  }

  onVoterJoined(callback: (username: string) => void) {
    this.socketService.on('voterJoined', callback);
  }

  onVoterLeft(callback: (username: string) => void) {
    this.socketService.on('voterLeft', callback);
  }

  vetoCurrentVideo(data: SessionRequest) {
    this.socketService.emit('vetoVideo', data);
  }

  addVideo(data: AddVideoRequest) {
    this.socketService.emit('addVideo', data);
  }

  onSessionClosed(callback: (data: SessionResponse) => void){
    this.socketService.on('sessionClosed', callback);
  }

  removeAllListeners() {
    this.socketService.removeListener('connected');
    this.socketService.removeListener('sessionNotFound');
    this.socketService.removeListener('voterJoined');
    this.socketService.removeListener('voterLeft');
    this.socketService.removeListener('sessionClosed');
  }
}