import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConteneurService } from '../../../../services/conteneur.service';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrl: './result-modal.component.scss'
})
export class ResultModalComponent {
  @Input() qrResult!: string;

  constructor(public activeModal: NgbActiveModal,private affectationService:ConteneurService) {}

  parseResult(): any {
    try {
      return JSON.parse(this.qrResult);
    } catch (e) {
     
      return this.qrResult;
    }

    
  }
  
  isJsonObject(): boolean {
    try {
      const result = JSON.parse(this.qrResult);
      //console.log(result.reference)
     // this.getAffectation(result[0].reference)
      //this.getAffectation(result.reference);
      return typeof result === 'object' && result !== null;
    } catch (e) {
      return false;
    }
  }

  getAffectation(reference:string){
    this.affectationService.getByScan(reference).subscribe((res: any) => {
      console.log(res)
    })
  }
}






