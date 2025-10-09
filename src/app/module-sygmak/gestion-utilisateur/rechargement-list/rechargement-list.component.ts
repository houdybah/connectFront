import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/paged-data';
import { RechargementSolde } from '../../../../../src/models/rechargement-solde';
import { EntrepriseService } from '../../../../../src/services/entreprise.service';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface BackendPagedData<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-rechargement-list',
  templateUrl: './rechargement-list.component.html',
  styleUrls: ['./rechargement-list.component.scss']
})
export class RechargementListComponent implements OnInit {

  rechercheParDateControl = new FormControl('');

  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
  rechargementParam: RechargementSolde | null = null;

  page: Page = { pageNumber: 0, size: 5, totalElements: 0, totalPages: 0 };

  pageData: PagedData<RechargementSolde> = {
    content: [],
    pageNumber: 0,
    pageSize: 5,
    totalElements: 0
  };

  constructor(
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private entrepriseService: EntrepriseService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getAllRechargementSolde();

    // Recherche par date ou NIF
    this.rechercheParDateControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.page.pageNumber = 0;
        this.pageSelectionne = 1;
        this.getAllRechargementSolde();
      });
  }

  getAllRechargementSolde(): void {
  const searchKey = this.rechercheParDateControl.value || '';
  this.entrepriseService.getAlls(this.page, searchKey).subscribe({
    next: (pagedData: PagedData<RechargementSolde>) => {
      // Tri par uuid décroissant
      this.pageData = {
        ...pagedData,
        content: pagedData.content.sort((a, b) => b.uuid.localeCompare(a.uuid))
      };
      this.nombreTotalEnregistrement = pagedData.totalElements;
      this.page.totalElements = pagedData.totalElements;
      // Si totalPages n'est pas fourni par le backend, on le calcule
      this.page.totalPages = pagedData.totalPages ?? Math.ceil(pagedData.totalElements / this.page.size);
      this.pageSelectionne = pagedData.pageNumber + 1;
    },
    error: () => this.toastService.error('Erreur lors de la récupération')
  });
}


  // Pagination
  onPageChange(newPage: number): void {
    this.pageSelectionne = newPage;
    this.page.pageNumber = newPage - 1;
    this.getAllRechargementSolde();
  }

  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;
    this.getAllRechargementSolde();
  }

  openModal(modal: any, rechargement: RechargementSolde | null): void {
    this.rechargementParam = rechargement;
    this.modalService.open(modal, { centered: true, size: 'md', backdrop: 'static' });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.getAllRechargementSolde();
  }

  deleteRechargement(rechargement: RechargementSolde): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet enregistrement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entrepriseService.delete(rechargement.uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'L\'enregistrement a été supprimé.', 'success');
            this.getAllRechargementSolde();
          },
          error: () => Swal.fire('Erreur', 'Échec de la suppression.', 'error')
        });
      }
    });
  }

  getCurrentUserRoles(): string[] {
    const currentUser = this.authService.currentUser();
    return currentUser?.roles || [];
  }

  isAdmin(): boolean { return this.getCurrentUserRoles().includes('admin'); }
  isMarketeur(): boolean { return this.getCurrentUserRoles().includes('marketeur'); }
  isConsultation(): boolean { return this.getCurrentUserRoles().includes('consultation'); }

}





