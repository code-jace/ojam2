import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoterService } from '../services/voter.service';
import { JoinSessionRequest, ConnectedResponse, ErrorResponse, AddVideoRequest, SessionResponse } from '../models/socket-events';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QrCodeService } from '../services/qr-code.service';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-voter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatInput, MatButton],
  templateUrl: './voter-controls.component.html',
  styleUrls: ['./voter-controls.component.scss']
})
export class VoterControlsComponent implements OnInit, OnDestroy {
  sessionId: string|null = null;
  username: string = '';

  sessionUrl: string = '';
  qrCodeUrl: string|null = null;

  manualSessionId: string = '';
  connected: boolean = false;

  videoId: string = '';


  constructor(private voterService: VoterService, private qrCodeService: QrCodeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      if(this.sessionId && this.sessionId !== '') {
        const userName = prompt('Enter Username') || 'Anon';
        this.joinSession(this.sessionId, userName);
      }
    });


    this.voterService.onConnected((data: ConnectedResponse) => {
      this.sessionId = data.sessionId;
      this.username = data.username;
      this.connected = true;

      this.voterService.onSessionClosed((data: SessionResponse) => {
        if (data.sessionId === this.sessionId) {
          alert('The session has been closed.');
          this.router.navigate(['/']);
        }
      });
    });

    this.voterService.onSessionNotFound((data: ErrorResponse) => {
      console.log(data);
      alert(data.message);
      this.router.navigate(['/']);

    });

    this.voterService.onVoterJoined((username: string) => {
      console.log(`${username} joined the session`);
    });

    this.voterService.onVoterLeft((username: string) => {
      console.log(`${username} left the session`);
    });
  }

  vetoVideo() {
    if (this.sessionId) {
      this.voterService.vetoCurrentVideo({sessionId: this.sessionId});
    }
  }

  ngOnDestroy(): void {
    this.voterService.removeAllListeners();
  }

  joinSession(sessionId: string, username: string) {
    const data: JoinSessionRequest = { sessionId, username };
    this.voterService.joinSession(data);
  }

  addVideo(): void {
    if (this.sessionId && this.videoId) {
      const req: AddVideoRequest = {sessionId: this.sessionId, videoId: this.videoId}
      this.voterService.addVideo(req);
      this.videoId = ''; // Clear the input field
    }


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
