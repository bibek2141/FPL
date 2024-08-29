import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ManagerData } from 'src/app/models/manager-data.model';
import {
  AutomaticSubs,
  EntryHistory,
  ManagerPicks,
} from 'src/app/models/manager-picks.model';
import { Player } from 'src/app/models/player.model';
import { Team } from 'src/app/models/team.model';
import { ApiService } from 'src/app/services/api.services';

@Component({
  selector: 'app-my-fpl',
  templateUrl: './my-fpl.component.html',
  styleUrl: './my-fpl.component.css',
})
export class MyFplComponent implements OnInit {
  managerID: number = 0;
  playerData: ManagerData | null = null;
  errorMessage: string = '';
  teams: { [key: number]: string } = {};
  playerMap: { [key: number]: { name: string; logo: string } } = {};
  playerPointsMap: { [key: number]: number } = {};
  favoriteTeamName: string = '';
  current_event: number = 0;
  started_event: number = 0;
  events: number[] = [];
  selectedEvent: number = 0;
  selectedGameweek: number = 0;
  managerPicks: ManagerPicks | null = null;
  entryHistory: EntryHistory | null = null;
  playersPicked: AutomaticSubs[] = [];
  activeChip: string = '';
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = true;
      const savedManagerID = this.cookieService.get('id');
      if (savedManagerID) {
        this.managerID = JSON.parse(savedManagerID);

        this.searchManagerData();
        this.cdr.detectChanges();
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, 300);
  }

  searchManagerData() {
    this.apiService.getFPLManagerData(this.managerID).subscribe(
      (data) => {
        this.playerData = data;
        if (this.playerData !== null) {
          this.current_event = this.playerData.current_event;
          this.started_event = this.playerData.started_event;
          this.selectedGameweek = this.events[0];
          this.loadTeamData();
          this.generateEventDropdown(this.current_event, this.started_event);
          this.filterPointsByGameweek(this.events[0]);
          this.updateFavoriteTeamName();
        }
        this.cookieService.set('id', JSON.stringify(this.managerID));
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      (error) => {
        this.playerData = null;
        this.errorMessage = 'ID not found or error fetching data';
        this.cookieService.delete('id');
      }
    );
  }

  private generateEventDropdown(current_event: number, started_event: number) {
    for (let i = current_event; i >= started_event; i--) {
      this.events.push(i);
    }

    this.selectedEvent = this.events[0];
    this.events = [...new Set(this.events)]; //remove duplicates
    this.cdr.detectChanges();
  }

  private loadTeamData(): void {
    this.apiService.getFPLData().subscribe(
      (data) => {
        this.teams = this.extractTeams(data);
        this.searchManagerData(); // Load player data once teams are available
        //this.updateFavoriteTeamName();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching team data:', error);
        this.errorMessage = 'Error fetching team data';
      }
    );
  }

  // Extract team names and map team IDs to names
  extractTeams(data: any): { [key: number]: string } {
    const teams = data.teams || [];
    const teamMap: { [key: number]: string } = {};
    teams.forEach((team: Team) => {
      teamMap[team.id] = team.name;
    });
    this.cdr.detectChanges();
    return teamMap;
  }

  // Handle dropdown change event
  onGameweekChange(event: any): void {
    this.selectedGameweek = +event.target.value;
    this.filterPointsByGameweek(this.selectedGameweek);
    this.cdr.detectChanges();
  }

  filterPointsByGameweek(gameweek: number): void {
    var playersID: number[] = [];
    if (this.playerData !== null) {
      this.apiService
        .getFPLGameWeekData(this.playerData.id, gameweek)
        .subscribe((data) => {
          this.managerPicks = data;
          if (this.managerPicks !== null) {
            this.entryHistory = this.managerPicks?.entry_history;
            this.playersPicked = this.managerPicks?.picks;
            this.activeChip = this.managerPicks?.active_chip;
            playersID = this.playersPicked.map((item) => item.element);
            this.extractPlayers(playersID);
            this.extractPlayersGameweekPoints(playersID);
            this.selectedGameweek = gameweek;
            this.cdr.detectChanges();
          }
        });
    }
  }
  extractPlayersGameweekPoints(playersID: any) {
    if (this.selectedGameweek !== undefined) {
      this.apiService
        .getFPLGameWeekPlayerData(this.selectedGameweek)
        .subscribe((data) => {
          const playerPointsMap: { [key: number]: number } = {};
          playersID.forEach((id: number) => {
            const player = data.elements.find((el: any) => el.id === id);
            if (player) {
              playerPointsMap[id] = player.stats.total_points;
            }
          });
          this.playerPointsMap = playerPointsMap;
          this.cdr.detectChanges();
        });
    }
  }

  private updateFavoriteTeamName(): void {
    if (this.playerData && this.teams) {
      const playerFavoriteTeamId = this.playerData.favourite_team;
      this.favoriteTeamName =
        this.teams[playerFavoriteTeamId] || 'Unknown Team';
      this.cdr.detectChanges();
    }
  }

  extractPlayers(playersID: any) {
    this.apiService.getFPLData().subscribe((data) => {
      const playerMap: { [key: number]: { name: string; logo: string } } = {};
      playersID.forEach((id: number) => {
        const player = data.elements.find((el: any) => el.id === id);
        if (player) {
          playerMap[id] = {
            name: player.web_name,
            logo: player.code, // Example logo URL
          };
        }
      });
      this.playerMap = playerMap;
      this.cdr.detectChanges();
    });
  }
}
