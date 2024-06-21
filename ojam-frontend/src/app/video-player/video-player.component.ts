import { Component } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { QrCodeService } from '../services/qr-code.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {

  sessionId: string = ''; // Store current session ID or room name
  sessionUrl: string ='';
  qrCodeUrl: string|null = null;


  constructor(private socketService: SocketService, private qrCodeService: QrCodeService) {
    this.createSession();
  }

  createSession() {
    this.socketService.emit('createSession');

    this.socketService.on('sessionCreated', (sessionId: string) => {
      this.sessionId = sessionId;
      console.log(`Session created with ID: ${this.sessionId}`);
      this.generateSessionUrl();

    });
  }

  generateSessionUrl() {
    if (this.sessionId && typeof window !== "undefined") {
      this.sessionUrl = `${window.location.origin}/sesh/${this.sessionId}`;
      this.generateQRCode();

    } else {
      console.error('No session ID available.');
    }
  }

  async generateQRCode() {
    try {
      this.qrCodeUrl = await this.qrCodeService.generateQRCode(this.sessionUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  }


}
