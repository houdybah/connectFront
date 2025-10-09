import { Component } from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse, SituationService } from '../../../../../src/services/situation.service';
import Swal from 'sweetalert2';
import { ParametreFormComponent } from '../parametre-form/parametre-form.component';


@Component({
  selector: 'app-parametre-list',
  templateUrl: './parametre-list.component.html',
  styleUrl: './parametre-list.component.scss'
})
export class ParametreListComponent {


selectedFile: File | null = null;
message: string = '';
isError: boolean = false;

constructor(private fileUploadService: SituationService,private modalService: NgbModal) {}
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  upload(): void {
    if (!this.selectedFile) {
      Swal.fire("ERROR"," AUCUN FICHIER SELECTIONNER ", "error")
      return;
    } 
    if (this.selectedFile) {
      this.fileUploadService.uploadFileF(this.selectedFile).subscribe({
        next: (response: ApiResponse) => {
          Swal.fire("success","CHARGEMENT DU FICHIER EFFETUÉ AVEC SUCCES", "success").then(() => {
            // Ouvrir le modal avec la réponse
          const modalRef = this.modalService.open(ParametreFormComponent);
          modalRef.componentInstance.data = response; // Pass response to modal
          })
          
        },
        error: (error) => {
          console.error('Error:', error);
          // Ouvrir le modal d'erreur
          //const modalRef = this.modalService.open(ParametreFormComponent);
          //modalRef.componentInstance.data = { message: "ERREUR DE CHARGEMENT DU FICHIER : Veuillez selectionner un fichier CSV", error };
          Swal.fire("ERROR","CHARGEMENT DU FICHIER : Veuillez selectionner un fichier CSV", "error")
        }
      });
      
    }
  }


   onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileUploadService.uploadExcelFile(file).subscribe({
        next: (response: any) => {
          this.message = response;
        },
        error: (error) => {
          this.message = 'Error uploading file: ' + error.message;
        }
      });
    }
  }



  onFileChange2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
      this.isError = false;
    }
  }


  onUpload(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file first';
      this.isError = true;
      return;
    }

    if (!this.selectedFile.name.endsWith('.xlsx')) {
      this.message = 'Please upload a valid .xlsx file';
      this.isError = true;
      return;
    }

    this.fileUploadService.uploadExcelFile(this.selectedFile).subscribe({
      next: (response: any) => {
        this.message = response;
        this.isError = false;
        this.selectedFile = null;
        // Réinitialiser l'input file
        const input = document.getElementById('fileInput') as HTMLInputElement;
        if (input) input.value = '';
      },
      error: (error) => {
        this.message = error.message;
        this.isError = true;
      }
    });
  }



}








