import { Component, OnInit } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { CommonModule } from '@angular/common';
import { CreateSessionResponse, VideoSkippedResponse } from '../models/socket-events';
import { VideoService } from '../services/video.service';
import { YoutubePlayerComponent } from 'ngx-youtube-player';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, YoutubePlayerComponent],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {

  sessionId: string = ''; // Store current session ID or room name
  sessionUrl: string = '';
  sessionName: string = '';

  qrCodeUrl: string | null = null;

  currentVideo: string = '';

  player: YT.Player|null = null;


  constructor(private videoService: VideoService, private qrCodeService: QrCodeService) { }

  ngOnInit(): void {

    this.videoService.onSessionCreated((data: CreateSessionResponse) => {
      this.sessionId = data.sessionId;
      this.sessionName = data.sessionName;
      this.generateSessionUrl();

      this.videoService.getCurrentVideo(this.sessionId);
    });

    this.videoService.onCurrentVideo((data: VideoSkippedResponse) => {

      this.currentVideo = data.nextVideo;
      this.player?.loadVideoById(this.currentVideo);
      this.player?.playVideo();

    });

    this.videoService.onVideoSkipped((data: VideoSkippedResponse) => {

      this.currentVideo = data.nextVideo;
      this.player?.loadVideoById(this.currentVideo);
      this.player?.playVideo();

    });

    // Create a session on component initialization
    this.videoService.createSession('Default Session Name');
  }

  savePlayer(player: YT.Player) {
    this.player = player;
    this.player?.playVideo();
    
    console.log("player instance", player);
  }

  onStateChange(event: any) {
    console.log("player state", event.data);
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
