import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }
}
