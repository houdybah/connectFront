import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionFt } from '../../../../../src/models/transactionFt';
import { ApiResponse, SituationService } from '../../../../../src/services/situation.service';
import Swal from 'sweetalert2';
import { ParametreFormComponent } from '../../parametres/parametre-form/parametre-form.component';

@Component({
  selector: 'app-search-ft',
  templateUrl: './search-ft.component.html',
  styleUrl: './search-ft.component.scss'
})
export class SearchFtComponent {

   t : any
  isSI : boolean = false

   constructor(private situationService : SituationService,private modalService: NgbModal){
    this.isSI = true
   }

    /** import fichier FT */
    selectedFile: File | null = null;
    message: string = '';
    isError: boolean = false;
     onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if(input.files && input.files.length > 0) {
          this.selectedFile = input.files[0];
        }
      }

  upload(): void {
      if (!this.selectedFile) {
        Swal.fire("ERROR"," AUCUN FICHIER SELECTIONNER ", "error")
        return;
      } 
      if (this.selectedFile) {
        this.situationService.uploadFileF(this.selectedFile).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire("success","CHARGEMENT DU FICHIER EFFETUÉ AVEC SUCCES", "success").then(() => {
              // Ouvrir le modal avec la réponse
            const modalRef = this.modalService.open(ParametreFormComponent);
            modalRef.componentInstance.data = response; // Pass response to modal
            })
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire("ERROR","CHARGEMENT DU FICHIER : Veuillez selectionner un fichier CSV", "error")
          }
        }); 
      }
    }

    /** end */

   activeSelected=2;
  disabled = true;

  periodSelect: Boolean= false;

  recherche: Boolean= false;

  currentJustify = 'start';

  active=2;
  activev= "top";

  activeKeep=2;

  dateDebut : string ="";
  dateFin : string="";

  situations : TransactionFt[] = [];


 
 


  ngOnInit(): void {

    this.periodSelect = false
    const jour = new Date();
    console.log(jour.getMonth().valueOf())
    if(jour.getMonth().valueOf()<=9)
    {
      if(jour.getDate().valueOf() < 10)
      {
        this.dateFin=jour.getFullYear()+'-0'+(jour.getMonth().valueOf()+1)+'-0'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-0'+(jour.getMonth().valueOf()+1)+'-01';
      }
      else
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
    }
    else
    {
      if(jour.getDate().valueOf() < 10)
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-0'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
      else
      {
        this.dateFin=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-'+jour.getDate();
        this.dateDebut=jour.getFullYear()+'-'+(jour.getMonth().valueOf()+1)+'-01';
      }
    }


  }

  masquer(){
    this.periodSelect = false
    this.recherche = false
  }

  selectPeriod(){
    this.recherche = true

    if(this.dateDebut.valueOf() > this.dateFin.valueOf())
    {
      let tmp = this.dateDebut;
      this.dateDebut = this.dateFin;
      this.dateFin = tmp;
    }
    this.situationService.getFtBCRG(this.dateDebut,this.dateFin).subscribe(
        (situation : TransactionFt[])=>
        {
          console.log(situation)
          if(situation == null)
          {
            this.situations = []
            this.periodSelect = false

          }
          else{
            this.situations = situation
            this.periodSelect = true
          }
          this.recherche = false
        }
    );

  }
}








