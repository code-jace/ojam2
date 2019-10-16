import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css']
})
export class PlayerDashComponent implements OnInit {

  constructor() { }

  player1 = YouTubePlayer(document.getElementById('player-1'), {
    videoId: 'M7lc1UVf-VE'
  });

  ngOnInit() {
    this.player1.playVideo()
      .then(data => {
        console.log('playing', data);
      });
  }

}
