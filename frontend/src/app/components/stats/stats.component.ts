import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { ApiService } from 'src/app/services/api.services';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  players: Player[] = [];
  paginatedPlayers: Player[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;
  selectedStat: keyof Player = 'goals_scored';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.apiService.getFPLData().subscribe((data) => {
      this.players = data.elements;
      this.updatePaginatedPlayers();
    });
  }

  updatePaginatedPlayers() {
    const filteredPlayers = this.players
      .filter((p: Player) => {
        const value = p[this.selectedStat];
        return typeof value === 'number' && value >= 1;
      })
      .sort((a: Player, b: Player) => {
        const aValue = a[this.selectedStat] as number;
        const bValue = b[this.selectedStat] as number;
        return bValue - aValue;
      });

    this.totalPages = Math.ceil(filteredPlayers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);
    window.scroll(0, 0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPlayers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPlayers();
    }
  }

  onStatChange() {
    this.currentPage = 1; // Reset to the first page when stat changes
    this.updatePaginatedPlayers();
  }
}
