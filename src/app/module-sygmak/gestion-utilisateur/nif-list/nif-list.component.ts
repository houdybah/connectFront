import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

import { NifUtilisateur } from '../../models/nif-utilisateur';
import { NifUtilisateurService } from '../../services/nif-utilisateur.service';
import { PagedData } from '../../models/paged-data';

@Component({
  selector: 'app-nif-list',
  templateUrl: './nif-list.component.html',
  styleUrls: ['./nif-list.component.scss']
})
export class NifListComponent implements OnInit {

  rechercheNifControl = new FormControl('');
  pageData: PagedData<NifUtilisateur> = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };

  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;


page: any = {
      pageNumber: 0,
      size: this.nombreElementParPage,
    };
  nifUtilisateurParam: NifUtilisateur | null = null;

  constructor(
    private modalService: NgbModal,
    private nifUtilisateurService: NifUtilisateurService
  ) {}

 
ngOnInit(): void {
  this.loadUtilisateurs();

  this.rechercheNifControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe((nif: string | null) => {
      if (!nif?.trim()) {
        this.loadUtilisateurs(); // recharge tous les utilisateurs si champ vide
        return;
      }

      this.nifUtilisateurService.getByNif(nif).subscribe({
        next: utilisateurs => {
          this.pageData = {
            content: utilisateurs,
            pageNumber: 0,
            pageSize: utilisateurs.length,
            totalElements: utilisateurs.length
          };
          this.nombreTotalEnregistrement = utilisateurs.length;
        },
        error: () => {
          this.pageData = {
            content: [],
            pageNumber: 0,
            pageSize: 0,
            totalElements: 0
          };
          this.nombreTotalEnregistrement = 0;
        }
      });
    });
}

  loadUtilisateurs(): void {
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    this.getAllNifUtilisateur();
  }

  getAllNifUtilisateur(): void {
    this.nifUtilisateurService.getAll(this.page, "").subscribe({
      next: pagedData => {
        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
      },
      error: err => {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
      }
    });
  }

  onPageChange(page: number): void {
    this.page.pageNumber = page - 1;
    this.getAllNifUtilisateur();
  }

  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;
    this.getAllNifUtilisateur();
  }

  openModal(modal: any, nifUtilisateur: NifUtilisateur | null): void {
    this.nifUtilisateurParam = nifUtilisateur;
    this.modalService.open(modal, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.getAllNifUtilisateur();
  }

  deleteNifUtilisateur(nifUtilisateur: NifUtilisateur): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera définitivement cet enregistrement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.nifUtilisateurService.delete(nifUtilisateur.uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'L\'enregistrement a été supprimé.', 'success');
            this.getAllNifUtilisateur();
          },
          error: () => {
            Swal.fire('Erreur', 'Échec de la suppression.', 'error');
          }
        });
      }
    });
  }
}





