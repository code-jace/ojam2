import { Routes } from '@angular/router';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VoterControlsComponent } from './voter-controls/voter-controls.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'home', component: LandingPageComponent },
    { path: 'player', component: VideoPlayerComponent },
    { path: 'sesh', component: VoterControlsComponent },
    { path: 'sesh/:sessionId', component: VoterControlsComponent },
    // You can add more routes here for other components or features
    { path: '', redirectTo: 'home', pathMatch: 'full' }, 
    { path: '**', redirectTo: 'home' }
];
