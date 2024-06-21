import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { QrCodeService } from '../services/qr-code.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'


@Component({
  selector: 'app-voter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './voter-controls.component.html',
  styleUrl: './voter-controls.component.scss'
})
export class VoterControlsComponent implements OnInit {
  sessionId: string|null = null;
  sessionUrl: string = '';
  qrCodeUrl: string|null = null;

  connected: boolean = false;

  manualSessionId: string = '';

  constructor(private route: ActivatedRoute, private socketService: SocketService, private qrCodeService: QrCodeService, private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      if(this.sessionId && this.sessionId !== '') {
        this.joinSession();
      }
    });

    this.socketService.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      // Handle error if needed
    });

    this.socketService.on('disconnect', () => {
      console.log('Disconnected from socket.');
      // Handle disconnect if needed
      this.connected = false;
    });
  }

  joinSession = (): void => {
    console.log(`Joined session with ID: ${this.sessionId}`);
    this.socketService.emit('joinSessionControl', this.sessionId);
    this.connected = true;
    this.generateSessionUrl();


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

  navigateToVoterPage() {
    if (this.manualSessionId) {
      this.router.navigate(['/sesh', this.manualSessionId], {onSameUrlNavigation: 'reload'}); // Navigate to voter page with manualSessionId
    } else {
      console.error('No session ID entered.');
    }
  }

}
