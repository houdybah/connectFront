import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {Camion, EnumTypeConteneur, TypeConteneurLabels} from "../../../../models/Camion";
import {CamionService} from "../../../../services/camion.service";
import {FormCamionComponent} from "../form-camion/form-camion.component";

@Component({
  selector: 'app-liste-camions',
  templateUrl: './liste-camions.component.html',
  styleUrls: ['./liste-camions.component.scss']
})
export class ListeCamionsComponent implements OnInit {
  camions: Camion[] = [];
  filteredCamions: Camion[] = [];
  loading = false;
  searchTerm = '';
EnumTypeConteneur = EnumTypeConteneur;
  TypeConteneurLabels = TypeConteneurLabels;
  stats = {
    total: 0,
    actifs: 0,
    maintenance: 0,
    inactifs: 0,
    tc20: 0,  // AJOUTEZ CECI
    tc40: 0   // AJOUTEZ CECI
  };
  constructor(
    private CamionService: CamionService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadCamions();
  }

  loadCamions(): void {
    this.loading = true;
    this.CamionService.getAllCamions().subscribe({
      next: (data) => {
        this.camions = data;
        this.filteredCamions = data;
        this.calculateStats();
          this.loading = false;
           
        console.log('✅ Camions chargés:', data.length);
        console.log('📦 Données:', data);
      },
      error: (error) => {
        console.error('❌ Erreur chargement camions:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les camions'
        });
      }
    });
  }

  nouveauCamion(): void {
    const modalRef = this.modalService.open(FormCamionComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          console.log('✅ Rechargement de la liste');
          this.loadCamions();
        }
      },
      (reason) => {
        console.log('❌ Modal annulé:', reason);
      }
    );
  }

  modifierCamion(Camion: Camion): void {
  console.log('🔧 Ouverture modal modification pour:', Camion);
  
  const modalRef = this.modalService.open(FormCamionComponent, {
    size: 'lg',
    backdrop: 'static',
    centered: true,
    scrollable: true
  });

  // ✅ IMPORTANT : Passer toutes ces informations
  modalRef.componentInstance.isEditMode = true;
  modalRef.componentInstance.Camion = Camion;
  modalRef.componentInstance.camionUuid = Camion.uuid;

  

  modalRef.result.then(
    (result) => {
      if (result === 'success') {
        console.log('✅ Rechargement après modification');
        this.loadCamions();
      }
    },
    (reason) => {
      console.log('❌ Modal annulé:', reason);
    }
  );
}

  supprimerCamion(uuid: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CamionService.deleteCamion(uuid).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le Camion a été supprimé.', 'success');
            this.loadCamions();
          },
          error: (error) => {
            console.error('Erreur suppression:', error);
            Swal.fire('Erreur', 'Impossible de supprimer le Camion', 'error');
          }
        });
      }
    });
  }
calculateStats(): void {
    this.stats.total = this.camions.length;
   this.stats.tc20 = this.camions.filter(
      c => c.typeConteneur === 'VINGT_PIEDS'
    ).length;
    
    this.stats.tc40 = this.camions.filter(
      c => c.typeConteneur === 'QUARANTE_PIEDS'
    ).length;
  }
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCamions = this.camions;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCamions = this.camions.filter(Camion =>
      Camion.numero?.toLowerCase().includes(term) ||
      Camion.immatriculation?.toLowerCase().includes(term) ||
      Camion.marque?.toLowerCase().includes(term) ||
      Camion.model?.toLowerCase().includes(term)
    );
  }

  getCamionsByType(type: string): number {
    return this.camions.filter(c => c.typeConteneur === type).length;
  }

  getTypeClass(type: string): string {
    switch(type) {
      case 'VINGT_PIEDS':
        return 'type-20';
      case 'QUARANTE_PIEDS':
        return 'type-40';
      default:
        return 'type-default';
    }
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'VINGT_PIEDS':
        return 'fa-box';
      case 'QUARANTE_PIEDS':
        return 'fa-boxes';
      default:
        return 'fa-question';
    }
  }
}





