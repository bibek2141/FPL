import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  fplData: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getFPLData().subscribe(
      (data) => {
        console.log(this.fplData);
        this.fplData = data;
      },
      (error) => {
        console.error('Error fetching FPL data:', error);
      }
    );
  }
}
