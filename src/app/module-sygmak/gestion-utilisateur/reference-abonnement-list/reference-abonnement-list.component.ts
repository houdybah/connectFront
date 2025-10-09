import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/paged-data';
import { ReferenceAbonnement } from '../../../../../src/models/reference-abonnement';
import { ReferenceAbonnementService } from '../../../../../src/services/reference-abonnement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reference-abonnement-list',
  //standalone: true,
  //imports: [],
  templateUrl: './reference-abonnement-list.component.html',
  styleUrl: './reference-abonnement-list.component.scss'
})
export class ReferenceAbonnementListComponent implements OnInit {

  private handleError(error: any): void {
    console.error('Erreur:', error);
    this.loading = false;
    this.pageData = {
      content: [],
      pageNumber: 0,
      pageSize: 0,
      totalElements: 0
    };
    this.nombreTotalEnregistrement = 0;
    console.error('Une erreur est survenue'); // this.toastService.error('Une erreur est survenue');
  }



  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
   referenceAbonnementParam: ReferenceAbonnement | null = null;
  rechercheEmailControl = new FormControl('');
  loading = false;
  page: Page = {
    pageNumber: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  };


   pageData: PagedData<ReferenceAbonnement> = {
      content: [],
      pageNumber: 0,
      pageSize: 0,
      totalElements: 0
    };


    
     private updatePageData(result: PagedData<ReferenceAbonnement>): void {
       const utilisateursTries = result.content.sort((a, b) => b.uuid.localeCompare(a.uuid));
       this.pageData = {
         ...result,
         content: utilisateursTries
       };
       this.nombreTotalEnregistrement = result.totalElements || 0;
       this.pageSelectionne = result.pageNumber + 1;
     }
   
      
    onPageChange(page: number): void {
    this.pageSelectionne = page;
    this.loadUtilisateursAvecFiltre();
  }

  onPageSizeChange(): void {
    this.pageSelectionne = 1;
    this.loadUtilisateursAvecFiltre();
  }


     loadUtilisateursAvecFiltre(): void {
    const filtre = this.rechercheEmailControl.value?.trim() || '';
    this.page.pageNumber = this.pageSelectionne - 1;
    this.page.size = this.nombreElementParPage;
    this.loading = true;

    this.referenceAbonnementService.getAll(this.page, filtre).subscribe({
      next: (result) => {
        this.loading = false;
        this.updatePageData(result);
      },
      error: (error: any) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  constructor(
    private modalService: NgbModal,
    private referenceAbonnementService: ReferenceAbonnementService,
        private toastService: ToastService
  ) {}

 
ngOnInit(): void {

    this.loadUtilisateursAvecFiltre();
//this.getAllReferenceAbonnement();

    
}


  getAllReferenceAbonnement(): void {
    this.referenceAbonnementService.getAll(this.page, "").subscribe({
      next: pagedData => {
        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
      },
      error: err => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      }
    });
  }



  openModal(modal: any, entreprise: ReferenceAbonnement | null): void {
    this.referenceAbonnementParam = entreprise;
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.getAllReferenceAbonnement();
  }

  deleteEntreprise(entreprise: ReferenceAbonnement): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet enregistrement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.referenceAbonnementService.delete(entreprise.uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'L\'enregistrement a été supprimé.', 'success');
            this.getAllReferenceAbonnement();
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
          }
        });
      }
    });
  }
}




