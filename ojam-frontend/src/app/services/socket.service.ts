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
  
      this.socket.on('message', (data: any) => {
        console.log('Received message:', data);
      });
  
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });  }
  }

  listen(event: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket?.on(event, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

}