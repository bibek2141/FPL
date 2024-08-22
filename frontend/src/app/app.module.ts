import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TeamFixturesComponent } from './components/team-fixtures/team-fixtures.component';
import { FormatIdentifierPipe } from './module/format-identifier.pipe';

@NgModule({
  declarations: [AppComponent, TeamFixturesComponent, FormatIdentifierPipe],
  bootstrap: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
