import { Injectable } from '@angular/core';
import { ApiService } from './api.services';
import { Fixture } from '../models/fixture.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FixturesService {
  constructor(private apiService: ApiService) {}
  loadFixtures(): Observable<Fixture[]> {
    return this.apiService.getFPLFixtures();
  }
}
