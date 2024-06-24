import { Routes } from '@angular/router';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VoterControlsComponent } from './voter-controls/voter-controls.component';

export const routes: Routes = [
    { path: 'player', component: VideoPlayerComponent },
    { path: 'sesh', component: VoterControlsComponent },
    { path: 'sesh/:sessionId', component: VoterControlsComponent },
    // You can add more routes here for other components or features
    { path: '', redirectTo: '/sesh', pathMatch: 'full' }, // Default route to redirect to '/player'
    { path: '**', redirectTo: '/sesh' } // Handle unknown routes by redirecting to '/player'
];
