import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  ClassicLeagueStandings,
  Results,
  Standings,
} from 'src/app/models/classic-league.model';
import { Classic, ManagerData } from 'src/app/models/manager-data.model';
import { ApiService } from 'src/app/services/api.services';

@Component({
  selector: 'app-my-leagues',
  templateUrl: './my-leagues.component.html',
  styleUrl: './my-leagues.component.css',
})
export class MyLeaguesComponent implements OnInit {
  managerID: number = 0;
  leagueID: number = 0;
  selectedGameweek: number = 0;
  playerData: ManagerData | null = null;
  errorMessage: string = '';
  classicLeague: Classic[] = [];
  currentLeagueID: number = 0;
  results: Results[] = [];
  leagueName: string = '';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const savedManagerID = this.cookieService.get('id');
    setTimeout(() => {
      if (savedManagerID) {
        this.managerID = JSON.parse(savedManagerID);
        if (this.managerID !== 0) {
          this.searchManagerData();
          this.loading = false;
        }
      }
    }, 300);
  }

  searchManagerData() {
    this.apiService.getFPLManagerData(this.managerID).subscribe(
      (data) => {
        this.playerData = data;
        if (this.playerData !== null) {
          this.classicLeague = this.playerData.leagues.classic;
          this.currentLeagueID = this.classicLeague[0].id;
          this.getDefaultLeague(this.currentLeagueID);
        }

        this.errorMessage = '';
        this.loading = false;
      },
      (error) => {
        this.playerData = null;
        this.errorMessage = 'ID not found or error fetching data';
        this.cookieService.delete('id');
      }
    );
  }

  onGameweekChange(event: any): void {
    this.selectedGameweek = +event.target.value;
    console.log(this.selectedGameweek);
  }

  getDefaultLeague(id: number) {
    this.apiService
      .getFPLClassicLeaguesStandings(this.currentLeagueID)
      .subscribe((data) => {
        this.results = data.standings.results;
        this.leagueName = data.league.name;
      });
  }
}
