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
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';

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
    MatButtonModule,
    MatTableModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
