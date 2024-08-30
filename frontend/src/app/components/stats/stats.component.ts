import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Player } from 'src/app/models/player.model';
import { ApiService } from 'src/app/services/api.services';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'stat', 'cost', 'selected', 'points'];
  dataSource = new MatTableDataSource<Player>([]);
  selectedStat: string = 'goals_scored';
  loading: boolean = true;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  pageSizes = [5, 10, 20]; // Page size options

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  getData() {
    this.loading = true;
    this.apiService.getFPLData().subscribe((data) => {
      this.dataSource.data = data.elements;
      this.updateTableData(); // Apply filtering and sorting
      this.loading = false;
      window.scrollTo(0, 0);
    });
  }

  updateTableData() {
    // Apply filtering based on selectedStat
    this.dataSource.data = this.dataSource.data
      .filter(
        (p: Player) => (p[this.selectedStat as keyof Player] as number) >= 1
      )
      .sort(
        (a: Player, b: Player) =>
          (b[this.selectedStat as keyof Player] as number) -
          (a[this.selectedStat as keyof Player] as number)
      );
  }

  onStatChange() {
    this.getData();
  }
}
