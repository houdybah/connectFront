import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../services/audit.service';
import { LoginHistory, Page, LoginStats } from '../models/audit.model';

@Component({
  selector: 'app-login-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {
  loginHistory: LoginHistory[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 20;
  totalElements: number = 0;
  totalPages: number = 0;
  
  // Filtres
  filterEmail: string = '';
  filterApp: string = '';
  showFailedOnly: boolean = false;
  showSuccessOnly: boolean = false;

  // Statistiques
  loginStats: LoginStats | null = null;
  showStats: boolean = false;

  // Sélection pour voir les détails
  selectedHistory: LoginHistory | null = null;

  constructor(public auditService: AuditService) {}

  ngOnInit(): void {
    this.loadLoginHistory();
  }

  loadLoginHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.showFailedOnly) {
      this.loadFailedLogins();
    } else if (this.filterEmail) {
      this.loadLoginHistoryByUser();
    } else if (this.filterApp) {
      this.loadLoginHistoryByApp();
    } else {
      this.loadAllLogins();
    }
  }

  private loadAllLogins(): void {
    this.auditService.getLoginHistory(undefined, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<LoginHistory>) => {
        this.handlePage(page);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private loadLoginHistoryByUser(): void {
    this.auditService.getLoginHistory(this.filterEmail, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<LoginHistory>) => {
        this.handlePage(page);
        // Charger aussi les stats
        this.loadUserStats();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private loadLoginHistoryByApp(): void {
    this.auditService.getLoginHistoryByApp(this.filterApp, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<LoginHistory>) => {
        this.handlePage(page);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private loadFailedLogins(): void {
    this.auditService.getFailedLogins(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<LoginHistory>) => {
        this.handlePage(page);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private loadUserStats(): void {
    if (this.filterEmail) {
      this.auditService.getLoginStats(this.filterEmail).subscribe({
        next: (stats: LoginStats) => {
          this.loginStats = stats;
          this.showStats = true;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des statistiques:', error);
        }
      });
    }
  }

  private handlePage(page: Page<LoginHistory>): void {
    this.loginHistory = page.content;
    this.totalElements = page.totalElements;
    this.totalPages = page.totalPages;
    this.currentPage = page.number;
    this.isLoading = false;
  }

  private handleError(error: any): void {
    console.error('Erreur lors du chargement de l\'historique des connexions:', error);
    this.errorMessage = 'Erreur lors du chargement de l\'historique des connexions';
    this.isLoading = false;
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loginStats = null;
    this.showStats = false;
    this.loadLoginHistory();
  }

  clearFilters(): void {
    this.filterEmail = '';
    this.filterApp = '';
    this.showFailedOnly = false;
    this.showSuccessOnly = false;
    this.currentPage = 0;
    this.loginStats = null;
    this.showStats = false;
    this.loadLoginHistory();
  }

  toggleFailedOnly(): void {
    this.showFailedOnly = !this.showFailedOnly;
    if (this.showFailedOnly) {
      this.showSuccessOnly = false;
    }
    this.applyFilters();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadLoginHistory();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadLoginHistory();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadLoginHistory();
  }

  viewDetails(history: LoginHistory): void {
    this.selectedHistory = history;
  }

  closeDetails(): void {
    this.selectedHistory = null;
  }

  formatDate(dateString: string): string {
    return this.auditService.formatDate(dateString);
  }

  getStatusClass(success: boolean): string {
    return success ? 'badge bg-success' : 'badge bg-danger';
  }

  getStatusLabel(success: boolean): string {
    return success ? 'Réussie' : 'Échouée';
  }

  getStatusIcon(success: boolean): string {
    return success ? 'ri-checkbox-circle-line' : 'ri-close-circle-line';
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  get successRate(): number {
    if (!this.loginStats) return 0;
    const total = this.loginStats.successfulLogins + this.loginStats.failedLogins;
    if (total === 0) return 0;
    return Math.round((this.loginStats.successfulLogins / total) * 100);
  }
}

