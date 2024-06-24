import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoterService } from '../services/voter.service';
import { JoinSessionRequest, ConnectedResponse, ErrorResponse, AddVideoRequest, SessionResponse, VideoResponse, VideoUpdate } from '../models/socket-events';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QrCodeService } from '../services/qr-code.service';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VideoSearchDialogComponent } from '../video-search-dialog/video-search-dialog.component';

@Component({
  selector: 'app-voter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormField, MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatInput, MatButton, VideoSearchDialogComponent, MatProgressBarModule],
  templateUrl: './voter-controls.component.html',
  styleUrls: ['./voter-controls.component.scss']
})
export class VoterControlsComponent implements OnInit, OnDestroy {
  sessionId: string | null = null;
  sessionName: string | null = null;
  username: string = '';

  sessionUrl: string = '';
  qrCodeUrl: string | null = null;
  showQr: boolean = false;

  manualSessionId: string = '';
  connected: boolean = false;

  videoId: string = '';
  currentVideoName: string = '';
  currentDuration: number = 0;
  currentTime: number = 0;
  currentVideoProgress: number = 0;

  query: string = '';


  constructor(private voterService: VoterService, private qrCodeService: QrCodeService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.sessionId = params['sessionId'];
      if (this.sessionId && this.sessionId !== '') {
        const userName = prompt('Enter Username') || 'Anon';
        this.joinSession(this.sessionId, userName);
      }
    });


    this.voterService.onConnected((data: ConnectedResponse) => {
      this.sessionId = data.sessionId;
      this.sessionName = data.sessionName
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

    this.voterService.onUpdateVideoDetails((data: VideoUpdate) => {
      this.currentVideoName = data.videoName;
      this.currentDuration = data.duration;
      this.currentTime = data.currentTime;
      const progress = this.currentTime/this.currentDuration;
      this.currentVideoProgress = (Math.round(progress * 100) / 100)*100;

    });
  }

  vetoVideo() {
    if (this.sessionId) {
      this.voterService.vetoCurrentVideo({ sessionId: this.sessionId });
    }
  }

  ngOnDestroy(): void {
    this.voterService.removeAllListeners();
  }

  joinSession(sessionId: string, username: string) {
    const data: JoinSessionRequest = { sessionId, username };
    this.voterService.joinSession(data);
  }

  openVideoSearchDialog(): void {
    const dialogRef = this.dialog.open(VideoSearchDialogComponent, {
      width: '600px',
      height: 'auto',
      data: {query: this.query}
    });

    dialogRef.afterClosed().subscribe((result: VideoResponse) => { // TODO type
      if (result && this.sessionId) {
        console.log('Selected video:', result);
        // Handle the selected video

        const req: AddVideoRequest = { sessionId: this.sessionId, videoId: result.videoId, videoName: result.videoName }
        this.voterService.addVideo(req);
      }
    });
  }


  toggleShowQr() {
    this.showQr = !this.showQr;
  }

  generateSessionUrl() {
    if (this.sessionId && typeof window !== "undefined") {
      this.sessionUrl = `${window.location.href}`;
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
      this.router.navigate(['/sesh', this.manualSessionId], { onSameUrlNavigation: 'reload' }); // Navigate to voter page with manualSessionId
    } else {
      console.error('No session ID entered.');
    }
  }

}
