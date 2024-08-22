import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ManagerData } from 'src/app/models/manager-data.model';
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
        console.log(this.playerData);
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

  private updateFavoriteTeamName(): void {
    if (this.playerData && this.teams) {
      const playerFavoriteTeamId = this.playerData.favourite_team;
      this.favoriteTeamName =
        this.teams[playerFavoriteTeamId] || 'Unknown Team';
    }
  }
}
