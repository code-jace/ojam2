import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoterService } from '../services/voter.service';
import { JoinSessionRequest, ConnectedResponse, ErrorResponse } from '../models/socket-events';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QrCodeService } from '../services/qr-code.service';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-voter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatInput],
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
    });

    this.voterService.onError((data: ErrorResponse) => {
      alert(data.message);
    });

    this.voterService.onVoterJoined((username: string) => {
      console.log(`${username} joined the session`);
    });

    this.voterService.onVoterLeft((username: string) => {
      console.log(`${username} left the session`);
    });
  }

  skipSong():void {
    if(this.sessionId){
      const data = {sessionId: this.sessionId}
      this.voterService.vetoCurrentVideo(data);
    }
    
  }

  ngOnDestroy(): void {
    this.voterService.removeAllListeners();
  }

  joinSession(sessionId: string, username: string) {
    const data: JoinSessionRequest = { sessionId, username };
    this.voterService.joinSession(data);
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
