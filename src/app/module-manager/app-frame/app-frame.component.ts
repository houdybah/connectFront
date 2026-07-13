import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { UserApplicationAcces } from '../models/UserApplicationAcces';

const CURRENT_APP_DATA_KEY = 'currentAppData';

@Component({
  selector: 'app-app-frame',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-frame.component.html',
  styleUrls: ['./app-frame.component.scss']
})
export class AppFrameComponent implements OnInit {

  app: UserApplicationAcces | null = null;
  frameUrl: SafeResourceUrl | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    const rawApp = sessionStorage.getItem(CURRENT_APP_DATA_KEY);

    if (!rawApp) {
      this.router.navigate(['/modules/applications']);
      return;
    }

    this.app = JSON.parse(rawApp) as UserApplicationAcces;

    const token = this.tokenStorageService.getToken();
    if (!token || !this.app.urlApplication) {
      this.errorMessage = 'Session expirée ou URL applicative non configurée.';
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    const url = new URL(this.app.urlApplication);
    url.searchParams.append('token', token);
    url.searchParams.append('codeApp', this.app.codeApplication);
    url.searchParams.append('url', globalThis.location.origin + '/modules/applications');

    this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
  }

  onIframeLoad(): void {
    console.log(this.frameUrl)
    this.isLoading = false;
    this.hasError = false;
  }

  onIframeError(): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = `Impossible de charger l'application ${this.app?.nomApplication ?? ''}.`;
  }

  retour(): void {
    sessionStorage.removeItem(CURRENT_APP_DATA_KEY);
    this.router.navigate(['/modules/applications']);
  }
}
