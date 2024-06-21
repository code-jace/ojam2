import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';

interface Message {
  senderId?: string;
  sender: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnDestroy {

  messageToSend: string = '';
  messages: Message[] = [];
  userId: string = Math.random().toString(36).substr(2, 9);
  username: string = 'User'; // You can add a username input in the template for dynamic usernames

  constructor(private socketService: SocketService) {
    // Listen for incoming messages
    this.socketService.listen('message').subscribe((message: Message) => {
      if(message.senderId !== this.userId) {
        this.messages.push(message);
      }
    });

    // Listen for new user connections
    this.socketService.listen('user-connected').subscribe((userId: string) => {
      console.log(`User connected: ${userId}`);
      this.messages.push({ sender: 'System', message: `User ${userId} connected` });
    });

    // Listen for user disconnections
    this.socketService.listen('user-disconnected').subscribe((userId: string) => {
      console.log(`User disconnected: ${userId}`);
      this.messages.push({ sender: 'System', message: `User ${userId} disconnected` });
    });
  }

  sendMessage() {
    if (this.messageToSend.trim()) {
      this.socketService.emit('message', { senderId: this.userId, sender: this.username, message: this.messageToSend.trim() });
      this.messages.push({ sender: this.username, message: this.messageToSend.trim() });
      this.messageToSend = '';
    }
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

}
