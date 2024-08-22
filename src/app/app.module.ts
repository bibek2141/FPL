import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TeamFixturesComponent } from './components/team-fixtures/team-fixtures.component';

@NgModule({ declarations: [AppComponent, TeamFixturesComponent],
    bootstrap: [AppComponent], imports: [BrowserModule, AppRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
