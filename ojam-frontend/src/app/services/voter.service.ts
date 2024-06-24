import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { JoinSessionRequest, ConnectedResponse, ErrorResponse, VetoCurrentVideoRequest } from '../models/socket-events';

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

  onError(callback: (data: ErrorResponse) => void) {
    this.socketService.on('sessionNotFound', callback);
  }

  onVoterJoined(callback: (username: string) => void) {
    this.socketService.on('voterJoined', callback);
  }

  onVoterLeft(callback: (username: string) => void) {
    this.socketService.on('voterLeft', callback);
  }

  vetoCurrentVideo(data: VetoCurrentVideoRequest) {
    this.socketService.emit('vetoVideo', data);
  }

  removeAllListeners() {
    this.socketService.removeListener('connected');
    this.socketService.removeListener('sessionNotFound');
    this.socketService.removeListener('voterJoined');
    this.socketService.removeListener('voterLeft');
  }
}