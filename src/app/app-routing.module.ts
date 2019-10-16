import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerDashComponent } from './player-dash/player-dash.component';


const routes: Routes = [
  {path: 'player', component: PlayerDashComponent},
  {path: '', redirectTo: '/player', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
