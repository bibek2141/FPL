import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Fixture, FixturesByMatchday } from 'src/app/models/fixture.model';
import { Player } from 'src/app/models/player.model';
import { Stats } from 'src/app/models/stats.model';
import { Team } from 'src/app/models/team.model';
import { ApiService } from 'src/app/services/api.services';
import { FixturesService } from 'src/app/services/fixture.services';
import { GameweekService } from 'src/app/services/gameweek.services';

@Component({
  selector: 'app-team-fixtures',
  templateUrl: './team-fixtures.component.html',
  styleUrls: ['./team-fixtures.component.css'],
})
export class TeamFixturesComponent {
  fixtures: Fixture[] = [];
  teams: { [key: number]: { name: string; logo: string } } = {}; // Maps team IDs to names
  fixturesByMatchday: FixturesByMatchday = {}; // Grouped fixtures by Matchday
  selectedGameweek: number = 0; // Default selected gameweek
  hasHappened: boolean = false; // Stats for previous gameweek
  id: string = '';
  players: { [key: number]: string } = {};
  stats: Stats[] = [];
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private fixtureService: FixturesService
  ) {}

  ngOnInit(): void {
    // Fetch both fixtures and team data
    setTimeout(() => {
      this.apiService.getFPLData().subscribe(
        (data) => {
          this.teams = this.extractTeams(data);
          this.players = this.extractPlayers(data);
          this.loadFixtures();
          this.setDefaultGameweek();
          console.log(this.setDefaultGameweek());
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching FPL data:', error);
          this.loading = false;
        }
      );
    }, 700);
  }

  // Extract team names and map team IDs to names
  extractTeams(data: any): { [key: number]: { name: string; logo: string } } {
    const teams = data.teams || [];
    const teamMap: { [key: number]: { name: string; logo: string } } = {};
    teams.forEach((team: Team) => {
      teamMap[team.id] = {
        name: team.name,
        logo: `https://resources.premierleague.com/premierleague/badges/70/t${team.code}.png`, // Example logo URL
      };
    });
    return teamMap;
  }

  // Convert GMT time to local time
  convertToLocalTime(gmtTime: string): string {
    const date = new Date(gmtTime);
    return date.toLocaleString(); // Adjust the format as needed
  }

  // Fetch fixtures and map team IDs to names
  public loadFixtures(): void {
    this.fixtureService.loadFixtures().subscribe(
      (data: Fixture[]) => {
        const groupedFixtures: FixturesByMatchday = data.reduce(
          (acc: FixturesByMatchday, fixture: Fixture) => {
            const matchday = fixture.event;
            const date = this.convertToLocalTime(fixture.kickoff_time).split(
              ','
            )[0]; // Get date part only

            if (!acc[matchday]) {
              acc[matchday] = {};
            }
            if (!acc[matchday][date]) {
              acc[matchday][date] = [];
            }

            acc[matchday][date].push({
              ...fixture,
              team_h_name: this.teams[fixture.team_h]?.name || 'Unknown Team', // Access name
              team_a_name: this.teams[fixture.team_a]?.name || 'Unknown Team', // Access name
              local_kickoff_time: this.convertToLocalTime(fixture.kickoff_time), // Convert GMT to local time
            });

            return acc;
          },
          {}
        );

        this.fixturesByMatchday = groupedFixtures;
        this.setDefaultGameweek(); // Ensure default gameweek is set after fixtures are loaded
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching fixtures data:', error);
      }
    );
  }

  // Handle dropdown change event
  onGameweekChange(event: any): void {
    this.selectedGameweek = +event.target.value;
    this.filterFixturesByGameweek(this.selectedGameweek);
  }

  // Set default gameweek to the current or upcoming gameweek
  setDefaultGameweek(): void {
    var gameweek = [];
    this.apiService.getFPLData().subscribe((data) => {
      data.events.find((event: any) => {
        const deadlineDate = new Date(event.deadline_time);
        gameweek.push(deadlineDate);
        return deadlineDate >= new Date();
      });

      if (
        new Date() >= gameweek[gameweek.length - 2] &&
        new Date() <= gameweek[gameweek.length - 1]
      ) {
        this.selectedGameweek = gameweek.length - 1;
        this.filterFixturesByGameweek(this.selectedGameweek);
      } else if (new Date() >= gameweek[gameweek.length - 1]) {
        this.selectedGameweek = gameweek.length;
      } else {
        this.selectedGameweek = 1;
        this.filterFixturesByGameweek(this.selectedGameweek);
      }

      this.loading = false;
    });
  }

  // Filter fixtures based on the selected gameweek
  filterFixturesByGameweek(gameweek: number): void {
    this.fixtures =
      Object.values(this.fixturesByMatchday[gameweek] || {}).flat() || [];
    this.cdr.detectChanges();
  }

  // Example method to get gameweek for a given date
  getGameweekForDate(date: Date): number {
    const gameweeks = this.getGameweeks();

    for (const gameweek of gameweeks) {
      if (this.fixturesByMatchday[gameweek]) {
        const fixtureDates = Object.keys(this.fixturesByMatchday[gameweek])
          .flatMap((d) => Object.keys(this.fixturesByMatchday[gameweek][d]))
          .map((d) => new Date(d).getTime()); // Convert to timestamp

        // Check if any fixture date is greater than or equal to the current date
        const hasUpcomingFixture = fixtureDates.some(
          (fixtureDateTime) => fixtureDateTime >= date.getTime()
        );

        if (hasUpcomingFixture) {
          return gameweek;
        }
      }
    }

    return 1; // Default to gameweek 1 if no match is found
  }

  getGameweeks(): number[] {
    return Array.from({ length: 38 }, (_, i) => i + 1); // Returns [1, 2, ..., 38]
  }

  getMatchdays(): number[] {
    return Object.keys(this.fixturesByMatchday)
      .map(Number)
      .sort((a, b) => a - b);
  }

  getDates(matchday: number): string[] {
    if (this.fixturesByMatchday[matchday]) {
      return Object.keys(this.fixturesByMatchday[matchday]).sort();
    }
    return [];
  }

  extractPlayers(data: any): { [key: number]: string } {
    const players: { [key: number]: string } = {};
    data.elements.forEach((player: Player) => {
      players[player.id] = player.web_name;
    });
    return players;
  }

  getPlayerName(playerId: number): string {
    return this.players[playerId] || 'Unknown Player';
  }

  //get fixture details
  getFixtureDetails(id: string, fixture: Fixture) {
    if (fixture.stats.length > 0 && fixture.id === id) {
      if (this.id === fixture.id) {
        this.id = '';
      } else {
        this.id = fixture.id;
        this.stats = fixture.stats;
      }
    }
  }
}
