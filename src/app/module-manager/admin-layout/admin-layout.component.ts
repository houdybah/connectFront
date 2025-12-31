import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../core/services/token-storage.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  userName: string = '';
  activeRoute: string = '';

  constructor(
    private readonly router: Router,
    private readonly tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.activeRoute = this.router.url;
  }

  loadUserInfo(): void {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        this.userName = userData.nom || userData.email || 'Admin';
      } catch (error) {
        this.userName = 'Admin';
      }
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/modules/applications']);
  }
}
