import { Component, OnInit } from '@angular/core';
import { QrCodeService } from '../services/qr-code.service';
import { CommonModule } from '@angular/common';
import { CreateSessionResponse, SessionRequest, VideoResponse, VideoUpdate } from '../models/socket-events';
import { VideoService } from '../services/video.service';
import { YoutubePlayerComponent } from 'ngx-youtube-player';
import { Subscription, interval, takeWhile } from 'rxjs';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, YoutubePlayerComponent, MatCardModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {

  sessionId: string = ''; // Store current session ID or room name
  sessionUrl: string = '';
  sessionName: string = '';

  qrCodeUrl: string | null = null;

  currentVideo: VideoResponse|null = null;

  player: YT.Player | null = null;
  playlistEnded: boolean = true;

  playerState = 0;
  intervalSubscription: Subscription | undefined;


  constructor(private videoService: VideoService, private qrCodeService: QrCodeService) { }

  ngOnInit(): void {

    this.videoService.onSessionCreated((data: CreateSessionResponse) => {
      this.sessionId = data.sessionId;
      this.sessionName = data.sessionName;
      this.generateSessionUrl();

    });

    this.videoService.onVideoSkipped((data: VideoResponse) => {
      this.loadAndPlayVideo(data);

    });

    this.videoService.onEndOfPlaylist(() => {
      this.player?.stopVideo();
      this.playlistEnded = true;
    });

    this.videoService.onNextVideo((data: VideoResponse) => {
      this.loadAndPlayVideo(data)      
    })

    // Create a session on component initialization

    const seshName = prompt('Enter Session Name') || 'Ojam Session';

    this.videoService.createSession(seshName);
  }

  savePlayer(player: YT.Player) {
    this.player = player;
    console.log("player instance", player);

    this.intervalSubscription = interval(1000) // Check every second
      .subscribe(() => {
        if(this.player && this.currentVideo){
          const duration = this.player?.getDuration();
          const time = this.player?.getCurrentTime();
          const req: VideoUpdate = {videoId: this.currentVideo.videoId, videoName: this.currentVideo.videoName, duration: duration, currentTime: time };
          this.videoService.updateVideoDetails(req)
        }

      });

  }

  onStateChange(event: any) {
    console.log("player state", event.data);

    this.playerState = event.data;

    if (this.playerState === YT.PlayerState.ENDED) {
      const req: SessionRequest = { sessionId: this.sessionId }
      this.videoService.videoEnd(req);
    }
  }

  loadAndPlayVideo(video: VideoResponse) {
    this.currentVideo = video;
    this.player?.loadVideoById(this.currentVideo);
    this.player?.playVideo();
  }

  generateSessionUrl() {
    if (this.sessionId && typeof window !== "undefined") {
      // this.sessionUrl = `${window.location.origin}/sesh/${this.sessionId}`;
      this.sessionUrl = `https://code-jace.github.io/ojam2/sesh/${this.sessionId}`;

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
