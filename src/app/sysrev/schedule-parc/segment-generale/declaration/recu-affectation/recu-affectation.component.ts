import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AffectationRecu } from '../../../../models/conteneur.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recu-affectation',
  templateUrl: './recu-affectation.component.html',
  styleUrl: './recu-affectation.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('qrCodeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class RecuAffectationComponent {
  @Input() recu!: AffectationRecu ;
  qrCodeData!: string;
  showQrCode = false;
  
  constructor(public activeModal: NgbActiveModal,private router: Router) {}

  ngOnInit() {
    // Préparer les données pour le QR code
    this.qrCodeData = JSON.stringify({
      reference: this.recu.reference,
      date: this.recu.date,
      chauffeur: this.recu.chauffeur.nom,
      permis: this.recu.chauffeur.numeroPermis,
      conteneurs: this.recu.chauffeur.conteneurs.map((c: any) => c.numeroConteneur)
    });
    
    // Montrer le QR code après un délai pour l'animation
    setTimeout(() => {
      this.showQrCode = true;
    }, 500);
  }

  // Méthode pour calculer le poids total (remplace la fonction reduce dans le template)
  calculerPoidsTotal(): number {
    let total = 0;
    if (this.recu && this.recu.chauffeur && this.recu.chauffeur.conteneurs) {
      for (const conteneur of this.recu.chauffeur.conteneurs) {
        total += conteneur.poidNet;
      }
    }
    return total;
  }




  

  imprimer() {
    window.print();
  }

  fermerEtReinitialiser() {
    this.activeModal.close('reset');
    this.router.navigate(['/douane/appurement']);
  }

  fermer() {
    this.activeModal.dismiss();
    this.router.navigate(['/douane/appurement']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}





