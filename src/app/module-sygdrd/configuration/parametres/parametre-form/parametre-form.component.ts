import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-parametre-form',
  templateUrl: './parametre-form.component.html',
  styleUrl: './parametre-form.component.scss'
})
export class ParametreFormComponent {

  // Modal data pour afficher le message apres le chargement du fichier csv  
  data: any; 
  constructor(public activeModal: NgbActiveModal) {}


}








