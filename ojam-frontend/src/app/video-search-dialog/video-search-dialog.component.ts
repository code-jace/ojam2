import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { VideoResponse } from '../models/socket-events';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatList, MatListItem } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { YoutubeSearchService } from '../services/youtube-search.service';
import {  MatInputModule } from '@angular/material/input';
import {  MatIconModule } from '@angular/material/icon';
import { Video } from '../models/video';
import { MatLine } from '@angular/material/core';


@Component({
  selector: 'app-video-search-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatList, MatListItem, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions, MatIconModule, MatLine],
  templateUrl: './video-search-dialog.component.html',
  styleUrl: './video-search-dialog.component.scss'
})
export class VideoSearchDialogComponent {

  query: string = '';
  searchResults: Video[] = [];
  selectedVideo: Video | null = null;

  constructor(
    public dialogRef: MatDialogRef<VideoSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private youtubeSearchService: YoutubeSearchService
  ) {

    if (data.query) {
      this.handleSearch(data.query);

    }

  }

  searchVideos(): void {
    this.handleSearch(this.query);

  }

  handleSearch(inputValue: string) {
    this.youtubeSearchService.getVideos(inputValue)
      .subscribe((items: any) => {
        this.searchResults = items.map((item: any) => {
          return {
            title: item.snippet.title,
            videoId: item.id.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelId: item.snippet.channelId,
            channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description,
            publishedAt: new Date(item.snippet.publishedAt),
            thumbnail: item.snippet.thumbnails.high.url
          };
        });

      });

  }

  selectVideo(video: Video): void {
    this.selectedVideo = video;
  }



  confirmSelection(): void {
    if (this.selectedVideo) {
      const vid: VideoResponse = { videoId: this.selectedVideo.videoId, videoName: this.selectedVideo.title };
      this.dialogRef.close(vid);
    }

  }

  quickSelect(video: Video): void {
    this.selectVideo(video);
    this.confirmSelection();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
