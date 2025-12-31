import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../services/audit.service';
import { AuditLog, ActionType, Page } from '../models/audit.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss']
})
export class AuditLogsComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 20;
  totalElements: number = 0;
  totalPages: number = 0;
  
  // Filtres
  filterEmail: string = '';
  filterEntity: string = '';
  filterActionType: string = '';
  actionTypes = Object.values(ActionType);

  // Sélection pour voir les détails
  selectedLog: AuditLog | null = null;

  constructor(public auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.auditService.getAuditLogs(this.currentPage, this.pageSize).subscribe({
      next: (page: Page<AuditLog>) => {
        this.auditLogs = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.currentPage = page.number;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des logs d\'audit:', error);
        this.errorMessage = 'Erreur lors du chargement des logs d\'audit';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.filterEmail) {
      this.loadAuditByUser();
    } else if (this.filterEntity) {
      this.loadAuditByEntity();
    } else if (this.filterActionType) {
      this.loadAuditByActionType();
    } else {
      this.loadAuditLogs();
    }
  }

  private loadAuditByUser(): void {
    this.isLoading = true;
    this.auditService.getAuditByUser(this.filterEmail, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<AuditLog>) => {
        this.auditLogs = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du filtrage';
        this.isLoading = false;
      }
    });
  }

  private loadAuditByEntity(): void {
    this.isLoading = true;
    this.auditService.getAuditByEntity(this.filterEntity, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<AuditLog>) => {
        this.auditLogs = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du filtrage';
        this.isLoading = false;
      }
    });
  }

  private loadAuditByActionType(): void {
    this.isLoading = true;
    this.auditService.getAuditByActionType(this.filterActionType as ActionType, this.currentPage, this.pageSize).subscribe({
      next: (page: Page<AuditLog>) => {
        this.auditLogs = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du filtrage';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filterEmail = '';
    this.filterEntity = '';
    this.filterActionType = '';
    this.currentPage = 0;
    this.loadAuditLogs();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  viewDetails(log: AuditLog): void {
    this.selectedLog = log;
  }

  closeDetails(): void {
    this.selectedLog = null;
  }

  getActionClass(actionType: ActionType): string {
    return this.auditService.getActionTypeClass(actionType);
  }

  getActionLabel(actionType: ActionType): string {
    return this.auditService.getActionTypeLabel(actionType);
  }

  formatDate(dateString: string): string {
    return this.auditService.formatDate(dateString);
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
}

