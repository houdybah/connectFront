import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../services/application.service';
import { Application } from '../models/application';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {
  @Input() applicationToEdit: Application | null = null;
  @Output() onClose = new EventEmitter<boolean>();
  
  applicationForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    if (this.applicationToEdit) {
      this.isEditMode = true;
      this.applicationForm.patchValue(this.applicationToEdit);
    }
  }

  initForm(): void {
    this.applicationForm = this.fb.group({
      code: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      version: ['', [Validators.required]],
      environnement: ['', [Validators.required]],
      description: [''],
      url: ['', [Validators.required]],
      icon: ['ri-apps-line'],
      color: ['#0d6846'],
      enabled: [true]
    });
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.applicationForm.value;

    if (this.isEditMode && this.applicationToEdit) {
      const app: Application = { uuid: this.applicationToEdit.uuid, ...formData };
      this.applicationService.updateApplication(app).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès !',
            text: 'L\'application a été mise à jour avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.onClose.emit(true);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur !',
            text: 'Une erreur est survenue lors de la mise à jour de l\'application.',
            icon: 'error',
            confirmButtonColor: '#0d6846'
          });
        }
      });
    } else {
      const app: Application = { uuid: '', ...formData };
      this.applicationService.newApplication(app).subscribe({
        next: () => {
          Swal.fire({
            title: 'Succès !',
            text: 'L\'application a été créée avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.onClose.emit(true);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.isLoading = false;
          Swal.fire({
            title: 'Erreur !',
            text: 'Une erreur est survenue lors de la création de l\'application.',
            icon: 'error',
            confirmButtonColor: '#0d6846'
          });
        }
      });
    }
  }

  cancel(): void {
    this.onClose.emit(false);
  }
}
