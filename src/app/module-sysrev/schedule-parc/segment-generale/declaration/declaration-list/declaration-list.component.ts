import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import {ApiSearchResponse, DeclarationService, SearchCriteria} from "../../../../services/declaration.service";
import {Declaration_1} from "../../../../models/Declaration_1";

@Component({
  selector: 'app-Declaration-list',
  templateUrl: './declaration-list.component.html',
  styleUrl: './declaration-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationListComponent implements OnInit, OnDestroy {
  declarations: Declaration_1[] = [];
  loading = false;
  
  // Pagination
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  totalPages = 0;
  
  // Formulaire et recherche
  searchForm: FormGroup;
  parentProperty = new Declaration_1();
  isSearchMode = false;
  Math = Math;
  searchSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private DeclarationService: DeclarationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      refDeclarant: [''],
      dateDebut: [null],    
      dateFin: [null]       
    });
  }

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.onSearch();
     this.setupSearchDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setDefaultDateRange(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Convertir en format NgbDate
    const dateDebut = {
      year: firstDayOfMonth.getFullYear(),
      month: firstDayOfMonth.getMonth() + 1,
      day: firstDayOfMonth.getDate()
    };
    
    const dateFin = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
    
    this.searchForm.patchValue({
      dateDebut: dateDebut,
      dateFin: dateFin
    });
  }

  // Méthode utilitaire pour construire les critères de recherche
  private buildSearchCriteria(page: number = 0): SearchCriteria {
    const formValue = this.searchForm.value;
    const criteria: SearchCriteria = {
      page: page,
      size: this.pageSize
    };

    // Ajouter la référence si présente
    if (formValue.refDeclarant?.trim()) {
      criteria.key = formValue.refDeclarant.trim();
    }

    // Gestion des dates
    if (formValue.dateDebut) {
      const dateDebut = formValue.dateDebut;
      if (dateDebut.year && dateDebut.month && dateDebut.day) {
        criteria.dateDebut = `${dateDebut.year}-${String(dateDebut.month).padStart(2, '0')}-${String(dateDebut.day).padStart(2, '0')}`;
      }
    }

    if (formValue.dateFin) {
      const dateFin = formValue.dateFin;
      if (dateFin.year && dateFin.month && dateFin.day) {
        criteria.dateFin = `${dateFin.year}-${String(dateFin.month).padStart(2, '0')}-${String(dateFin.day).padStart(2, '0')}`;
      }
    }

    return criteria;
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(200), // Augmenté à 300ms pour éviter trop d'appels
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onSearch();
    });
  }

  onSearchInput(): void {
    // Vérifier si on a au moins un critère valide avant de déclencher la recherche
    const formValue = this.searchForm.value;
    const hasValidCriteria = 
      (formValue.refDeclarant?.trim()) ||
      (formValue.dateDebut && formValue.dateDebut.year && formValue.dateDebut.month && formValue.dateDebut.day) ||
      (formValue.dateFin && formValue.dateFin.year && formValue.dateFin.month && formValue.dateFin.day);
    
    if (hasValidCriteria) {
     // this.searchSubject.next();
    }
  }

  // Chargement initial (mode normal)
  // loadDeclarations(): void {
  //   this.loading = true;
  //   this.isSearchMode = false;
    
  //   this.DeclarationService.getDeclarations().subscribe({
  //     next: (data: Declaration_1[]) => {
  //       this.declarations = data;
  //       this.collectionSize = data.length;
  //       console.log('✅ Déclarations chargées:', this.declarations.length);
  //       this.loading = false;
  //       this.cdr.markForCheck();
  //     },
  //     error: (error) => {
  //       console.error('❌ Erreur chargement:', error);
  //       this.loading = false;
  //       this.cdr.markForCheck();
  //     }
  //   });
  // }

  // 🔥 RECHERCHE avec gestion de la vraie structure API
   onSearch(): void {
    const formValue = this.searchForm.value;
    console.log('🔍 Recherche déclenchée avec:', formValue);
    
    // Construire les critères selon votre API
    const criteria = this.buildSearchCriteria(0);

    // Vérification : au moins un critère doit être présent
    if (!criteria.key && !criteria.dateDebut && !criteria.dateFin) {
      console.log('⚠️ Aucun critère de recherche valide');
      this.declarations = [];
      this.collectionSize = 0;
      this.totalPages = 1;
      this.isSearchMode = false;
      this.cdr.markForCheck();
      return;
    }

    // Validation des dates
    if (criteria.dateDebut && criteria.dateFin) {
      const dateDebut = new Date(criteria.dateDebut);
      const dateFin = new Date(criteria.dateFin);
      if (dateDebut > dateFin) {
        console.log('⚠️ Date de début supérieure à la date de fin');
        alert('La date de début ne peut pas être supérieure à la date de fin');
        return;
      }
    }

    console.log('📤 Envoi des critères:', criteria);
    
    this.loading = true;
    this.isSearchMode = true;
    this.page = 1; // Reset page côté UI

    this.DeclarationService.searchDeclarations(criteria).subscribe({
      next: (response: ApiSearchResponse) => {
        console.log('✅ Réponse API:', response);
        
        // Traitement de la structure {page: {...}, data: [...]}
        if (response && response.data) {
          this.declarations = response.data;
          
          // Extraire les infos de pagination depuis response.page
          if (response.page) {
            this.collectionSize = response.page.totalElements || response.data.length;
            this.totalPages = response.page.totalPages || 1;
          } else {
            this.collectionSize = response.data.length;
            this.totalPages = 1;
          }
          
          console.log('📊 Données extraites:', {
            resultats: this.declarations.length,
            total: this.collectionSize,
            pages: this.totalPages,
            periode: criteria.dateDebut && criteria.dateFin 
              ? `du ${criteria.dateDebut} au ${criteria.dateFin}`
              : criteria.dateDebut 
                ? `à partir du ${criteria.dateDebut}`
                : criteria.dateFin 
                  ? `jusqu'au ${criteria.dateFin}`
                  : 'sans filtre de date'
          });
          
          // Log des UUIDs pour identifier les doublons
          console.log('🔍 UUIDs des déclarations trouvées:', this.declarations.map(d => d.uuid));
          
        } else {
          console.error('❌ Format de réponse non reconnu:', response);
          this.declarations = [];
          this.collectionSize = 0;
          this.totalPages = 1;
        }
        
        this.loading = false;
        console.log(`🎯 Résultat final: ${this.declarations.length} éléments sur ${this.collectionSize} total`);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('❌ Erreur recherche:', error);
        this.loading = false;
        this.declarations = [];
        this.collectionSize = 0;
        this.totalPages = 1;
        this.cdr.markForCheck();
        
        // Message d'erreur plus informatif
        const errorMessage = error?.error?.message || error?.message || 'Erreur inconnue';
        alert(`Erreur lors de la recherche: ${errorMessage}`);
      }
    });
  }

  // Réinitialisation
  resetSearch(): void {
    console.log('🔄 Réinitialisation de la recherche');
    this.searchForm.reset();
    this.page = 1;
    this.isSearchMode = false;
    this.declarations = [];
    this.collectionSize = 0;
    this.totalPages = 1;
    this.cdr.markForCheck();
    // Ne pas appeler onSearch() automatiquement pour éviter les appels inutiles
  }

  // Gestion de la pagination pour le mode recherche
  onPageChange(newPage: number): void {
    this.page = newPage;
    
    if (this.isSearchMode) {
      // Refaire la recherche avec la nouvelle page
      const criteria = this.buildSearchCriteria(newPage - 1); // Convertir en base 0

      this.loading = true;
      this.DeclarationService.searchDeclarations(criteria).subscribe({
        next: (response: ApiSearchResponse) => {
          if (response && response.data) {
            this.declarations = response.data;
            
            // Mettre à jour les informations de pagination
            if (response.page) {
              this.collectionSize = response.page.totalElements || response.data.length;
              this.totalPages = response.page.totalPages || 1;
            }
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('❌ Erreur pagination:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
    // En mode normal, pas besoin de recharger - la pagination est côté client
  }

  onPageSizeChange(): void {
    this.page = 1;
    if (this.isSearchMode) {
      // Refaire la recherche avec la nouvelle taille de page
      const criteria = this.buildSearchCriteria(0); // Reset à la page 0

      this.loading = true;
      this.DeclarationService.searchDeclarations(criteria).subscribe({
        next: (response: ApiSearchResponse) => {
          if (response && response.data) {
            this.declarations = response.data;
            
            if (response.page) {
              this.collectionSize = response.page.totalElements || response.data.length;
              this.totalPages = response.page.totalPages || 1;
            }
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('❌ Erreur changement taille page:', error);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
    // En mode normal, la pagination côté client se met à jour automatiquement
  }

  // Getter pour l'affichage des données
  get paginatedDeclarations(): Declaration_1[] {
    if (this.isSearchMode) {
      // En mode recherche, les données sont déjà paginées par le backend
      return this.declarations;
    } else {
      // En mode normal, pagination côté client
      const startItem = (this.page - 1) * this.pageSize;
      return this.declarations.slice(startItem, startItem + this.pageSize);
    }
  }


  // Méthodes pour les modals (inchangées)
  openDetailsModal(content: any, Declaration: Declaration_1): void {
    this.parentProperty = Declaration;
    console.log('Déclaration sélectionnée:', Declaration);
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  openConteneurModal(content: any, Declaration: Declaration_1): void {
    this.parentProperty = Declaration;
    console.log('Déclaration pour conteneurs:', Declaration);
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  trackByDeclaration(index: number, Declaration: Declaration_1): string {
    return Declaration.uuid || Declaration.refDeclarant || index.toString();
  }

  onDeleteDeclaration(Declaration: Declaration_1): void {
    if (!Declaration || !Declaration.uuid) return;
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer la déclaration ${Declaration.refDeclarant} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.DeclarationService.deleteDeclaration(Declaration.uuid).subscribe({
          next: () => {
            this.declarations = this.declarations.filter(d => d.uuid !== Declaration.uuid);
            this.collectionSize = this.declarations.length;
            // Ajuster la pagination si nécessaire
            const maxPage = Math.max(1, Math.ceil(this.collectionSize / this.pageSize));
            if (this.page > maxPage) this.page = maxPage;
            this.loading = false;
            this.cdr.markForCheck();
            
            Swal.fire({
              title: 'Supprimé !',
              text: 'La déclaration a été supprimée avec succès.',
              icon: 'success',
              confirmButtonColor: '#28a745',
              timer: 3000,
              timerProgressBar: true
            });
          },
          error: (error) => {
            console.error('Erreur suppression:', error);
            this.loading = false;
            this.cdr.markForCheck();
            
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la suppression.',
              icon: 'error',
              confirmButtonColor: '#dc3545'
            });
          }
        });
      }
    });
  }
}






