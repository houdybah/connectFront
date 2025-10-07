import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {ChauffeurService} from "../../../../services/chauffeur.service";

@Component({
  selector: 'app-chauffeurs-sdt',
  templateUrl: './SysrevChauffeurs-sdt.component.html',
  styleUrls: ['./SysrevChauffeurs-sdt.component.scss']
})
export class ChauffeursSdtComponent implements OnInit {
  loading = false;

  constructor(
    private router: Router,
    private ChauffeurService: ChauffeurService
  ) {}

  ngOnInit(): void {
    // Initialisation du composant
    console.log('Composant Chauffeurs SDT initialisé');
  }

  // Navigation vers une page spécifique
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Créer un nouveau Chauffeur
  nouveauChauffeur(): void {
    this.router.navigate(['/douane/schedule-parc/sdt/SysrevChauffeurs/nouveau']);
  }

  // Actualiser les données
  refreshData(): void {
    this.loading = true;
    
    // Simuler un délai de chargement
    setTimeout(() => {
      this.loading = false;
      
      Swal.fire({
        icon: 'success',
        title: 'Données actualisées',
        text: 'Les informations des chauffeurs ont été mises à jour.',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1000);
  }

  // Exporter les données
  exportData(): void {
    Swal.fire({
      title: 'Exporter les données ?',
      text: 'Cette action va générer un fichier Excel avec toutes les données des chauffeurs.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, exporter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        
        // Simuler l'export
        setTimeout(() => {
          this.loading = false;
          
          Swal.fire({
            icon: 'success',
            title: 'Export réussi !',
            text: 'Le fichier Excel a été généré et téléchargé.',
            timer: 2000,
            showConfirmButton: false
          });
        }, 1500);
      }
    });
  }
}





