import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, throwError } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { Abonnement } from '../../models/abonnement';
import { Page } from '../../models/Page';
import { PagedData } from '../../models/paged-data';
import { AbonnementService } from '../../services/abonnement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonnement-list',
  templateUrl: './abonnement-list.component.html',
  styleUrl: './abonnement-list.component.scss'
})
export class AbonnementListComponent implements OnInit {
  rechercheEmailControl = new FormControl('');
  rechercheParDateControl = new FormControl('');

  // Exposer Math pour le template
  Math = Math;

  page: Page = {
    pageNumber: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  };

  pageData: PagedData<Abonnement> = {
    content: [],
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0
  };

  abonnementParam: Abonnement | null = null;

  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService,
    private abonnementService: AbonnementService
  ) {}

ngOnInit(): void {
  this.getAllAbonnement();

  this.rechercheParDateControl.valueChanges
    .pipe(
      debounceTime(500),          // attendre 500ms après la frappe
      distinctUntilChanged()      // ne recharge que si la valeur change
    )
    .subscribe(() => {
      this.page.pageNumber = 0;   // revenir à la première page
      this.pageSelectionne = 1;
      this.getAllAbonnement();
    });
}

  getAllAbonnement(): void {
  const searchKey = this.rechercheParDateControl.value || "";
  this.abonnementService.getAll(this.page, searchKey).subscribe({
    next: pagedData => {
      this.pageData = pagedData;
      this.nombreTotalEnregistrement = pagedData.totalElements;
      this.page.totalElements = pagedData.totalElements;
      this.page.totalPages = Math.ceil(pagedData.totalElements / this.page.size);
    },
    error: err => {
      console.error('Erreur lors de la récupération des abonnements :', err);
    }
  });
}


  // Gestion du changement de page
  onPageChange(newPage: number): void {
    this.pageSelectionne = newPage;
    // NgBootstrap utilise des pages basées sur 1, l'API utilise des pages basées sur 0
    this.page.pageNumber = newPage - 1;
    this.getAllAbonnement();
  }

  // Gestion du changement de taille de page
  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    // Remettre à la première page
    this.pageSelectionne = 1;
    this.page.pageNumber = 0;
    this.getAllAbonnement();
  }

  openModal(modal: any, abonnement: Abonnement | null): void {
    this.abonnementParam = abonnement;
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  deleteEntreprise(abonnement: Abonnement): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet enregistrement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.abonnementService.delete(abonnement.uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'L\'enregistrement a été supprimé.', 'success');
            this.getAllAbonnement();
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
          }
        });
      }
    });
  }
}




