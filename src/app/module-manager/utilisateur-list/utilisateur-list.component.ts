import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Utilisateur } from '../models/Utilisateur';
import { UtilisateurFormComponent } from '../utilisateur-form/utilisateur-form.component';
import { UtilisateurService } from '../services/utilisateur.service';
import { Page } from '../../../models/Page';
import { Role, RoleLabels } from '../models/role.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-utilisateur-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UtilisateurFormComponent],
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.scss']
})
export class UtilisateurListComponent implements OnInit {
  users: Utilisateur[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';
  showModal: boolean = false;
  selectedUser: Utilisateur | null = null;
  page: Page = new Page();
  totalElements: number = 0;
  totalPages: number = 0;
  pageSizes: number[] = [5, 10, 20, 50, 100];

  constructor(
    private readonly utilisateurService: UtilisateurService
  ) {
    this.page.size = 10; // 10 éléments par page
    this.page.pageNumber = 0;
  }

  // Exposer Math pour l'utiliser dans le template
  Math = Math;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('=== CHARGEMENT DES UTILISATEURS (PAGINÉ) ===');
    console.log('Page:', this.page.pageNumber, 'Size:', this.page.size);
    console.log('Paramètre KEY envoyé au backend:', `"${this.searchTerm}"`);

    this.utilisateurService.getUtilisateurss(this.page, this.searchTerm).subscribe({
      next: (pagedData) => {
        console.log('✅ Données paginées reçues:', pagedData);
        console.log('Page info:', pagedData.page);
        console.log('Data:', pagedData.data);
        
        this.users = pagedData.data || [];
        
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
        console.error('❌ Erreur lors du chargement des utilisateurs:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
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
      this.searchUsers();
    } else {
      console.log('⏸️ Attente de 3 caractères minimum. Actuellement:', trimmedSearch.length);
    }
  }

  searchUsers(): void {
    // Recherche côté backend : réinitialiser la page et recharger
    console.log('🔍 === DÉBUT RECHERCHE ===');
    console.log('Terme de recherche:', `"${this.searchTerm}"`);
    console.log('Page réinitialisée à 0');
    this.page.pageNumber = 0;
    this.loadUsers();
  }

  onPageSizeChange(): void {
    // Réinitialiser à la première page lors du changement de taille
    this.page.pageNumber = 0;
    this.loadUsers();
  }

  get isSearchEnabled(): boolean {
    return this.searchTerm.trim().length >= 3 || this.searchTerm.trim().length === 0;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.page.pageNumber = pageNumber;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.page.pageNumber < this.totalPages - 1) {
      this.page.pageNumber++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.page.pageNumber > 0) {
      this.page.pageNumber--;
      this.loadUsers();
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

  editUser(user: Utilisateur): void {
    this.selectedUser = { ...user };
    this.showModal = true;
  }

  deleteUser(user: Utilisateur): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>"${user.nom} ${user.prenom}"</strong> ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c92a2a',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.utilisateurService.deleteUtilisateur(user.uuid).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé !',
              text: 'L\'utilisateur a été supprimé avec succès.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadUsers();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression de l\'utilisateur.',
              icon: 'error',
              confirmButtonColor: '#0d6846'
            });
          }
        });
      }
    });
  }

  toggleStatus(user: Utilisateur): void {
    const newStatus = !user.enabled;
    const statusText = newStatus ? 'activer' : 'désactiver';

    Swal.fire({
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} les droits d'accès`,
      html: `Voulez-vous ${statusText} les droits d'accès de <strong>"${user.nom} ${user.prenom}"</strong> aux applications ?<br><small>L'utilisateur pourra toujours se connecter mais n'aura pas accès aux applications.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6846',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Oui, ${statusText} l'accès`,
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        user.enabled = newStatus;
        this.utilisateurService.updateUtilisateur(user).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès !',
              text: `Les droits d'accès ont été ${newStatus ? 'activés' : 'désactivés'}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour des droits d\'accès:', error);
            user.enabled = !newStatus; // Rollback
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la mise à jour des droits d\'accès.',
              icon: 'error',
              confirmButtonColor: '#0d6846'
            });
          }
        });
      }
    });
  }

  toggleActiveStatus(user: Utilisateur): void {
    const newStatus = !user.active;
    const statusText = newStatus ? 'activer' : 'désactiver';

    Swal.fire({
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} l'utilisateur`,
      html: `Voulez-vous ${statusText} l'utilisateur <strong>"${user.nom} ${user.prenom}"</strong> ?<br><small>Cela ${newStatus ? 'permettra' : 'empêchera'} à l'utilisateur de se connecter au système.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus ? '#28a745' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Oui, ${statusText}`,
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        user.active = newStatus;
        this.utilisateurService.updateUtilisateur(user).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès !',
              text: `L'utilisateur a été ${newStatus ? 'activé' : 'désactivé'}.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour du statut actif:', error);
            user.active = !newStatus; // Rollback
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la mise à jour du statut actif.',
              icon: 'error',
              confirmButtonColor: '#0d6846'
            });
          }
        });
      }
    });
  }

  createNew(): void {
    this.selectedUser = null;
    this.showModal = true;
  }

  onModalClose(success: boolean): void {
    this.showModal = false;
    this.selectedUser = null;
    if (success) {
      this.loadUsers();
    }
  }

  getRoleLabel(role: Role | null): string {
    if (!role) return 'N/A';
    return RoleLabels[role] || 'N/A';
  }
}
