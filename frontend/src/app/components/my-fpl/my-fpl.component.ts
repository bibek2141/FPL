import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ManagerData } from 'src/app/models/manager-data.model';
import { EntryHistory, ManagerPicks } from 'src/app/models/manager-picks.model';
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
  favoriteTeamName: string = '';
  current_event: number = 0;
  started_event: number = 0;
  events: number[] = [];
  selectedEvent: number = 0;
  selectedGameweek: number = 0;
  managerPicks: ManagerPicks | null = null;
  entryHistory: EntryHistory | null = null;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const savedManagerID = this.cookieService.get('id');
    if (savedManagerID) {
      this.managerID = JSON.parse(savedManagerID);
      this.searchManagerData();
      this.loadTeamData();
    }
  }

  searchManagerData() {
    this.apiService.getFPLManagerData(this.managerID).subscribe(
      (data) => {
        this.playerData = data;
        if (this.playerData !== null) {
          this.current_event = this.playerData.current_event;
          this.started_event = this.playerData.started_event;
          this.generateEventDropdown(this.current_event, this.started_event);
          this.setDefaultGameweek();
        }

        this.cookieService.set('id', JSON.stringify(this.managerID));
        this.errorMessage = '';
        this.updateFavoriteTeamName();
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
  }

  private loadTeamData(): void {
    this.apiService.getFPLData().subscribe(
      (data) => {
        this.teams = this.extractTeams(data);
        this.searchManagerData(); // Load player data once teams are available
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
    return teamMap;
  }

  // Handle dropdown change event
  onGameweekChange(event: any): void {
    this.selectedGameweek = +event.target.value;
    this.filterPointsByGameweek(this.selectedGameweek);
  }

  filterPointsByGameweek(gameweek: number): void {}

  private setDefaultGameweek() {
    if (this.playerData !== null) {
      this.apiService
        .getFPLGameWeekData(this.playerData.id, this.events[0])
        .subscribe((data) => {
          this.managerPicks = data;
          if (this.managerPicks !== null) {
            this.entryHistory = this.managerPicks?.entry_history;
          }
        });
    }
  }

  private updateFavoriteTeamName(): void {
    if (this.playerData && this.teams) {
      const playerFavoriteTeamId = this.playerData.favourite_team;
      this.favoriteTeamName =
        this.teams[playerFavoriteTeamId] || 'Unknown Team';
    }
  }
}
