import { Component, OnInit } from '@angular/core';
import YTPlayer from 'yt-player';

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css']
})
export class PlayerDashComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const player = new YTPlayer('#player');

    player.load('KxGRhd_iWuE');
    player.setVolume(100);

    player.on('playing', () => {
      console.log(player.getDuration());
    });
  }

}
