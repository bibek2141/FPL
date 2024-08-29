import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TeamFixturesComponent } from './components/team-fixtures/team-fixtures.component';
import { FormatIdentifierPipe } from './module/format-identifier.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MyFplComponent } from './components/my-fpl/my-fpl.component';
import { MyLeaguesComponent } from './components/my-leagues/my-leagues.component';
import { FormsModule } from '@angular/forms';
import { StatsComponent } from './components/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamFixturesComponent,
    MyFplComponent,
    StatsComponent,
    MyLeaguesComponent,
    FormatIdentifierPipe,
    FooterComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule, // Include routing module
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
