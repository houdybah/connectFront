import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { Application } from '../models/application';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { PrivilegeManagementComponent } from '../privilege-management/privilege-management.component';
import { ProfileManagementComponent } from '../profile-management/profile-management.component';
import { Page } from '../../../models/Page';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ApplicationFormComponent, PrivilegeManagementComponent, ProfileManagementComponent],
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  showModal: boolean = false;
  showPrivilegeModal: boolean = false;
  showProfileModal: boolean = false;
  selectedApplication: Application | null = null;
  page: Page = new Page();
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 20, 50, 100];

  constructor(
    private readonly applicationService: ApplicationService
  ) {
    this.page.size = 10; // 10 éléments par page
    this.page.pageNumber = 0;
  }

  // Exposer Math pour l'utiliser dans le template
  Math = Math;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('=== CHARGEMENT DES APPLICATIONS (PAGINÉ) ===');
    console.log('Page:', this.page.pageNumber, 'Size:', this.page.size);
    console.log('Paramètre KEY envoyé au backend:', `"${this.searchTerm}"`);

    this.applicationService.getApplicationss(this.page, this.searchTerm).subscribe({
      next: (pagedData) => {
        console.log('✅ Données paginées reçues:', pagedData);
        console.log('Page info:', pagedData.page);
        console.log('Data:', pagedData.data);
        
        this.applications = pagedData.data || [];
        
        // Extraire les infos de pagination
        if (pagedData.page) {
          this.totalElements = pagedData.page.totalElements || 0;
          this.totalPages = pagedData.page.totalPages || 0;
          this.page.pageNumber = pagedData.page.number || 0;
        }
        
        console.log('Pagination:', {
          current: this.page.pageNumber + 1,
          total: this.totalPages,
          elements: this.totalElements
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des applications:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        this.errorMessage = 'Erreur lors du chargement des applications';
        this.isLoading = false;
      }
    });
  }

  onSearchInput(): void {
    // Recherche automatique si le terme a au moins 3 caractères ou est vide (réinitialisation)
    const trimmedSearch = this.searchTerm.trim();
    console.log('📝 Saisie dans champ recherche. Terme actuel:', `"${this.searchTerm}"`, 'Longueur trimmed:', trimmedSearch.length);
    
    if (trimmedSearch.length >= 3 || trimmedSearch.length === 0) {
      console.log('✅ Critères remplis, lancement de la recherche');
      this.searchApplications();
    } else {
      console.log('⏸️ Attente de 3 caractères minimum. Actuellement:', trimmedSearch.length);
    }
  }

  searchApplications(): void {
    // Recherche côté backend : réinitialiser la page et recharger
    console.log('🔍 === DÉBUT RECHERCHE ===');
    console.log('Terme de recherche:', `"${this.searchTerm}"`);
    console.log('Page réinitialisée à 0');
    this.page.pageNumber = 0;
    this.loadApplications();
  }

  onPageSizeChange(): void {
    // Réinitialiser à la première page lors du changement de taille
    this.page.pageNumber = 0;
    this.loadApplications();
  }

  get isSearchEnabled(): boolean {
    return this.searchTerm.trim().length >= 3 || this.searchTerm.trim().length === 0;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.page.pageNumber = pageNumber;
      this.loadApplications();
    }
  }

  nextPage(): void {
    if (this.page.pageNumber < this.totalPages - 1) {
      this.page.pageNumber++;
      this.loadApplications();
    }
  }

  previousPage(): void {
    if (this.page.pageNumber > 0) {
      this.page.pageNumber--;
      this.loadApplications();
    }
  }

  get currentPage(): number {
    return this.page.pageNumber + 1;
  }

  get hasNextPage(): boolean {
    return this.page.pageNumber < this.totalPages - 1;
  }

  get hasPreviousPage(): boolean {
    return this.page.pageNumber > 0;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.page.pageNumber - 2);
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  editApplication(app: Application): void {
    this.selectedApplication = { ...app };
    this.showModal = true;
  }

  deleteApplication(app: Application): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer l'application <strong>"${app.nom}"</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c92a2a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.applicationService.deleteApplication(app.uuid).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimée !',
              text: 'L\'application a été supprimée avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadApplications();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression de l\'application.',
              icon: 'error',
              confirmButtonColor: '#0d6846'
            });
          }
        });
      }
    });
  }

  toggleStatus(app: Application): void {
    const newStatus = !app.enabled;
    const statusText = newStatus ? 'activer' : 'désactiver';
    
    Swal.fire({
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} l'application`,
      html: `Voulez-vous ${statusText} l'application <strong>"${app.nom}"</strong> ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6846',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Oui, ${statusText}`,
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        app.enabled = newStatus;
        this.applicationService.updateApplication(app).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès !',
              text: `L'application a été ${newStatus ? 'activée' : 'désactivée'}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du statut:', error);
            app.enabled = !newStatus; // Rollback
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la mise à jour du statut.',
              icon: 'error',
              confirmButtonColor: '#0d6846'
            });
          }
        });
      }
    });
  }

  createNew(): void {
    this.selectedApplication = null;
    this.showModal = true;
  }

  onModalClose(success: boolean): void {
    this.showModal = false;
    this.selectedApplication = null;
    if (success) {
      this.loadApplications();
    }
  }

  openPrivilegeManagement(app: Application): void {
    this.selectedApplication = app;
    this.showPrivilegeModal = true;
  }

  closePrivilegeModal(): void {
    this.showPrivilegeModal = false;
    this.selectedApplication = null;
  }

  onPrivilegeUpdated(): void {
    // Recharger les applications si nécessaire
    this.loadApplications();
  }

  openProfileManagement(app: Application): void {
    this.selectedApplication = app;
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedApplication = null;
  }

  onProfileUpdated(): void {
    // Recharger les applications si nécessaire
    this.loadApplications();
  }
}
