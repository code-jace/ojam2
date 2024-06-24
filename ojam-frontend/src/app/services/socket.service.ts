import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  AddVideoRequest,
  ConnectedResponse,
  CreateSessionResponse,
  JoinSessionRequest,
  ErrorResponse,
  VideoAddedResponse,
  VideoSkippedResponse
} from '../models/socket-events';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      
      this.socket = io(environment.backendUrl);

    }
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  removeListener(event: string) {
    this.socket?.off(event);
  }
}
