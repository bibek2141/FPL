import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./my-leagues.component.css'],
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
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef // Add this
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const savedManagerID = this.cookieService.get('id');

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentLeagueID = +params['id']; // Get league ID from route
      }
    });

    setTimeout(() => {
      if (savedManagerID) {
        this.managerID = JSON.parse(savedManagerID);
        if (this.managerID !== 0) {
          this.searchManagerData();
        }
      }
    }, 300);
  }

  searchManagerData() {
    this.apiService.getFPLManagerData(this.managerID).subscribe(
      (data) => {
        this.loading = true;
        this.playerData = data;
        if (this.playerData !== null) {
          this.classicLeague = this.playerData.leagues.classic;
          console.log(this.currentLeagueID);
          if (this.currentLeagueID === 0) {
            this.currentLeagueID = this.classicLeague[0].id; // Default to first league if no ID provided
          }
          this.getDefaultLeague(this.currentLeagueID);
        }
        this.errorMessage = '';
      },
      (error) => {
        this.playerData = null;
        this.errorMessage = 'ID not found or error fetching data';
        this.cookieService.delete('id');
      }
    );
  }

  onLeagueChange(event: any): void {
    this.currentLeagueID = +event.target.value; // Update the selected league ID
    this.getDefaultLeague(this.currentLeagueID);
  }

  getDefaultLeague(id: number) {
    console.log(id);
    this.apiService.getFPLClassicLeaguesStandings(id).subscribe((data) => {
      this.results = data.standings.results;
      this.leagueName = data.league.name;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}
