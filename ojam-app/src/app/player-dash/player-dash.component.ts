import { Component, OnInit } from '@angular/core';
import YTPlayer from 'yt-player';

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css']
})
export class PlayerDashComponent implements OnInit {

  constructor() { }

  videoIds = ['KxGRhd_iWuE', 'Awf45u6zrP0'];
  position = 0;

  player: YTPlayer;

  ngOnInit() {
    this.player = new YTPlayer('#player');
    this.player.load(this.videoIds[0], true);
    this.player.on('ended', () => {
      this.playNext();
    });
  }

  playNext() {
    if (this.position === this.videoIds.length - 1){
      this.position = 0;
    } else {
      this.position ++;
    }

    this.player.load(this.videoIds[this.position], true);
  }

}
