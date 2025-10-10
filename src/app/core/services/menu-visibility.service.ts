import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuVisibilityService {
  private menuVisibleSubject = new BehaviorSubject<boolean>(true);
  public menuVisible$: Observable<boolean> = this.menuVisibleSubject.asObservable();

  private selectedAppSubject = new BehaviorSubject<string | null>(null);
  public selectedApp$: Observable<string | null> = this.selectedAppSubject.asObservable();

  constructor() {
    // Charger l'application sélectionnée depuis sessionStorage si elle existe
    const savedApp = sessionStorage.getItem('selectedApp');
    if (savedApp) {
      this.selectedAppSubject.next(savedApp);
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  showMenu(): void {
    this.menuVisibleSubject.next(true);
    document.documentElement.setAttribute('data-sidebar-visibility', 'show');
    document.body.classList.remove('no-sidebar');
  }

  hideMenu(): void {
    this.menuVisibleSubject.next(false);
    document.documentElement.setAttribute('data-sidebar-visibility', 'hidden');
    document.body.classList.add('no-sidebar');
  }

  setSelectedApp(appId: string): void {
    this.selectedAppSubject.next(appId);
    sessionStorage.setItem('selectedApp', appId);
    this.showMenu();
  }

  clearSelectedApp(): void {
    this.selectedAppSubject.next(null);
    sessionStorage.removeItem('selectedApp');
    this.hideMenu();
  }

  getSelectedApp(): string | null {
    return this.selectedAppSubject.value;
  }

  isMenuVisible(): boolean {
    return this.menuVisibleSubject.value;
  }
}

