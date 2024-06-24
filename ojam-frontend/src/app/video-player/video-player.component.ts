import { Component, OnInit } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { CommonModule } from '@angular/common';
import { CreateSessionResponse, SessionRequest, VideoResponse } from '../models/socket-events';
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

  player: YT.Player | null = null;
  playlistEnded: boolean = true;

  playerState = 0;

  constructor(private videoService: VideoService, private qrCodeService: QrCodeService) { }

  ngOnInit(): void {

    this.videoService.onSessionCreated((data: CreateSessionResponse) => {
      this.sessionId = data.sessionId;
      this.sessionName = data.sessionName;
      this.generateSessionUrl();

    });

    this.videoService.onVideoSkipped((data: VideoResponse) => {
      this.loadAndPlayVideo(data.videoId);

    });

    this.videoService.onEndOfPlaylist(() => {
      this.player?.stopVideo();
      this.playlistEnded = true;
    });

    this.videoService.onNextVideo((data: VideoResponse) => {
      this.loadAndPlayVideo(data.videoId)      
    })

    // Create a session on component initialization
    this.videoService.createSession('Default Session Name');
  }

  savePlayer(player: YT.Player) {
    this.player = player;
    console.log("player instance", player);
  }

  onStateChange(event: any) {
    console.log("player state", event.data);

    this.playerState = event.data;

    if (this.playerState === YT.PlayerState.ENDED) {
      const req: SessionRequest = { sessionId: this.sessionId }
      this.videoService.videoEnd(req);
    }
  }

  loadAndPlayVideo(videoId: string) {
    this.currentVideo = videoId;
    this.player?.loadVideoById(this.currentVideo);
    this.player?.playVideo();
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
