import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl + '/fpl-data'; // Your backend API URL
  private apiUrl1 = environment.apiUrl + '/fixtures';
  private otherApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFPLData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getFPLFixtures(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}`);
  }

  getTeamFixtures(data: any, teamId: number): any[] {
    return data.fixtures.filter(
      (fixture: { team_h: number; team_a: number }) =>
        fixture.team_h === teamId || fixture.team_a === teamId
    );
  }

  getFPLManagerData(id: number): Observable<any> {
    return this.http.get<any>(`${this.otherApi}/entry/${id}`);
  }

  getFPLGameWeekData(id: number, gameweek: number): Observable<any> {
    return this.http.get<any>(
      `${this.otherApi}/entry/${id}/event/${gameweek}/picks`
    );
  }

  getFPLGameWeekPlayerData(id: number): Observable<any> {
    return this.http.get<any>(`${this.otherApi}/entry/${id}/live`);
  }

  getFPLClassicLeaguesStandings(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.otherApi}/leagues-classic/${id}/standings`
    );
  }
}
