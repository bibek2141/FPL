import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamFixturesComponent } from './components/team-fixtures/team-fixtures.component';
import { MyFplComponent } from './components/my-fpl/my-fpl.component';
import { MyLeaguesComponent } from './components/my-leagues/my-leagues.component';

const routes: Routes = [
  { path: 'home', component: TeamFixturesComponent },
  { path: 'fpl', component: MyFplComponent },
  { path: 'leagues', component: MyLeaguesComponent },
  { path: 'leagues/:id', component: MyLeaguesComponent }, // New route with league ID parameter
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
