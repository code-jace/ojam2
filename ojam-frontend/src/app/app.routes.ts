import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    { path: 'chat', component: ChatComponent },
    // You can add more routes here for other components or features
    { path: '', redirectTo: '/chat', pathMatch: 'full' }, // Default route to redirect to '/chat'
    { path: '**', redirectTo: '/chat' } // Handle unknown routes by redirecting to '/chat'
];
