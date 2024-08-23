import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/fpl-data'; // Your backend API URL
  private apiUrl1 = 'http://localhost:3000/api/fixtures';

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
    return this.http.get<any>(`http://localhost:3000/api/entry/${id}`);
  }

  getFPLGameWeekData(id: number, gameweek: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:3000/api/entry/${id}/event/${gameweek}/picks`
    );
  }

  getFPLGameWeekPlayerData(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/entry/${id}/live`);
  }
}
