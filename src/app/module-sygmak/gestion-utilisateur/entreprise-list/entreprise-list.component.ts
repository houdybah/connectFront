import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, throwError } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { Entreprise } from '../../../../../src/models/entreprise';
import { Page } from '../../../../../src/models/Page';
import { PagedData } from '../../../../../src/models/paged-data';
import { EntrepriseService } from '../../../../../src/services/entreprise.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entreprise-list',
 // standalone: true,
  //imports: [],
  templateUrl: './entreprise-list.component.html',
  styleUrl: './entreprise-list.component.scss'


})
export class EntrepriseListComponent implements OnInit {

 //rechercheNifControl = new FormControl('');
  //pageData: PagedData<Entreprise> = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };

  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
 rechercheNomEntrepriseControl = new FormControl('');

// page: any = {
//        pageNumber: 0,
//       size: this.nombreElementParPage,
//     };


page: Page = {
    pageNumber: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0
  };

  pageData: PagedData<Entreprise> = {
    content: [],
    pageNumber: 0,
    pageSize: 0,
    totalElements: 0
  };
 entrepriseParam: Entreprise | null = null;


  constructor(
     private authService: AuthenticationService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
      private toastService: ToastService,
    private modalService: NgbModal,
    private entrepriseService: EntrepriseService
  ) {}

 
// ngOnInit(): void {


// this.getAllEntreprise();

    
// }


 ngOnInit(): void {
    this.initRecherche();
    this.loadUtilisateursAvecFiltre();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.loadUtilisateursAvecFiltre());

    setInterval(() => {
      this.cdRef.detectChanges();
    }, 30000);
  }

  loadUtilisateurs(): void {
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    this.getAllEntreprise();
  }

  getAllEntreprise(): void {
    this.entrepriseService.getAll(this.page, "").subscribe({
      next: pagedData => {
        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
      },
      error: err => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      }
    });
  }

  // onPageChange(page: number): void {
  //   this.page.pageNumber = page - 1;
  //   this.getAllEntreprise();
  // }

  // onPageSizeChange(): void {
  //   this.page.size = this.nombreElementParPage;
  //   this.page.pageNumber = 0;
  //   this.pageSelectionne = 1;
  //   this.getAllEntreprise();
  // }

  openModal(modal: any, entreprise: Entreprise | null): void {
    this.entrepriseParam = entreprise;
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.getAllEntreprise();
  }

  deleteEntreprise(entreprise: Entreprise): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet enregistrement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.entrepriseService.delete(entreprise.uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'L\'enregistrement a été supprimé.', 'success');
            this.getAllEntreprise();
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
          }
        });
      }
    });
  }



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


  private updatePageData(result: PagedData<Entreprise>): void {
    const utilisateursTries = result.content.sort((a, b) => b.nomEntreprise.localeCompare(a.nomEntreprise));
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
    const filtre = this.rechercheNomEntrepriseControl.value?.trim() || '';
    this.page.pageNumber = this.pageSelectionne - 1;
    this.page.size = this.nombreElementParPage;
    this.loading = true;

    this.entrepriseService.getAll(this.page, filtre).subscribe({
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


  private initRecherche(): void {
      this.rechercheNomEntrepriseControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          const filtre = value ? value.trim() : '';
          this.pageSelectionne = 1;
          this.page.pageNumber = 0;
          this.page.size = this.nombreElementParPage;
          this.loading = true;
  
          return this.entrepriseService.getAll(this.page, filtre).pipe(
            catchError(error => {
              this.handleError(error);
              return throwError(() => error);
            })
          );
        })
      ).subscribe(result => {
        this.loading = false;
        this.updatePageData(result);
      });
    }

      loading = false;

       
}






