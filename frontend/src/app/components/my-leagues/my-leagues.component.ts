import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Classic, ManagerData } from 'src/app/models/manager-data.model';
import { ApiService } from 'src/app/services/api.services';
import { GameweekService } from 'src/app/services/gameweek.services';
import { Results } from 'src/app/models/classic-league.model';
import {
  AutomaticSubs,
  ManagerPicks,
} from 'src/app/models/manager-picks.model';
import { forkJoin } from 'rxjs';

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
  leaguePlayerID: number = 0;
  playersPicked: AutomaticSubs[] = [];
  playerPointsMap: { [key: number]: number } = {};
  playerMap: { [key: number]: { name: string; logo: string } } = {};
  combinedPlayerData: {
    [key: number]: {
      playerID: number;
      name: string;
      logo: string;
      points: number;
    };
  } = {};
  playerIDs: number[] = [];
  isTriple: boolean = false;
  captainedPlayerID: number = 0;
  tripleCaptainPlayerID: number = 0;
  isCaptain: boolean = false;
  isViceCaptain: boolean = false;
  viceCaptainPlayerID: number = 0;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
          this.getCurrentGameweek();
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
    this.apiService.getFPLClassicLeaguesStandings(id).subscribe((data) => {
      this.results = data.standings.results;
      this.leagueName = data.league.name;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  getCurrentGameweek() {
    this.apiService.getFPLData().subscribe((data) => {
      for (var i = 0; i <= data.events.length; i++) {
        var currentDate = new Date();
        var newDate = new Date(data.events[i].deadline_time);
        if (currentDate < newDate) {
          break;
        }

        this.selectedGameweek = data.events[i].id;
      }
    });
  }

  getPlayersDetail(id: number) {
    if (this.leaguePlayerID === id) {
      this.leaguePlayerID = 0;
    } else {
      this.leaguePlayerID = id;

      this.apiService
        .getFPLGameWeekData(this.leaguePlayerID, this.selectedGameweek)
        .subscribe((data) => {
          this.playersPicked = data.picks;

          const captainPick = this.playersPicked.find(
            (pick) => pick.is_captain
          );

          const viceCaptainPick = this.playersPicked.find(
            (pick) => pick.is_vice_captain
          );

          if (captainPick) {
            this.isCaptain == true;
            this.captainedPlayerID = captainPick.element;
          }

          if (viceCaptainPick) {
            this.isViceCaptain == true;
            this.viceCaptainPlayerID = viceCaptainPick.element;
          }

          if (data.active_chip === '3xc') {
            this.isTriple = true;
          }

          if (this.isTriple && captainPick) {
            this.tripleCaptainPlayerID = captainPick.element;
          }
          this.playerIDs = this.playersPicked.map((item) => item.element);
          this.fetchAndCombinePlayerData(this.playerIDs);
        });
    }
  }

  fetchAndCombinePlayerData(playersID: number[]) {
    if (this.selectedGameweek !== undefined) {
      // Fetch both APIs in parallel
      forkJoin([
        this.apiService.getFPLGameWeekPlayerData(this.selectedGameweek),
        this.apiService.getFPLData(),
      ]).subscribe(([gameweekData, playerData]) => {
        const combinedData: {
          [key: number]: {
            playerID: number;
            name: string;
            logo: string;
            points: number;
          };
        } = {};

        playersID.forEach((id: number) => {
          const gameweekPlayer = gameweekData.elements.find(
            (el: any) => el.id === id
          );
          const playerInfo = playerData.elements.find(
            (el: any) => el.id === id
          );

          if (gameweekPlayer && playerInfo) {
            combinedData[id] = {
              playerID: playerInfo.id,
              name: playerInfo.web_name,
              logo: playerInfo.code, // Replace with the actual logo URL if needed
              points: gameweekPlayer.stats.total_points,
            };
          }
        });

        this.combinedPlayerData = combinedData;
      });
    }
  }
}
