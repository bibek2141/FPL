import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameweekService {
  public lastGameweek: number = 0;
}
