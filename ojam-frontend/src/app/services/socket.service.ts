import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private socket: Socket | null = null;

  constructor() {    
    if (typeof window !== 'undefined') {
      
      this.socket = io('http://localhost:3000/'); // Replace with your backend server URL
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
    }
  }

  listen(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket?.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

}