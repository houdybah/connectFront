import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-module',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-module.component.html',
  styleUrls: ['./form-module.component.scss']
})
export class FormModuleComponent implements OnInit {

  moduleForm: FormGroup;
  isEditMode = false;
  moduleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.moduleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      version: ['1.0.0', [Validators.required]],
      status: ['Actif', [Validators.required]],
      category: ['', [Validators.required]],
      dependencies: [''],
      configuration: ['']
    });
  }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.moduleId;

    if (this.isEditMode) {
      this.loadModuleData();
    }
  }

  loadModuleData(): void {
    // Simuler le chargement des données du module
    const mockModuleData = {
      name: 'Module Exemple',
      description: 'Description du module exemple pour démonstration',
      version: '1.0.0',
      status: 'Actif',
      category: 'Gestion',
      dependencies: 'Aucune',
      configuration: 'Configuration par défaut'
    };

    this.moduleForm.patchValue(mockModuleData);
  }

  onSubmit(): void {
    if (this.moduleForm.valid) {
      const moduleData = this.moduleForm.value;
      
      if (this.isEditMode) {
        console.log('Mise à jour du module:', moduleData);
        // Logique de mise à jour
      } else {
        console.log('Création du module:', moduleData);
        // Logique de création
      }

      // Redirection vers la liste
      this.router.navigate(['/modules/list']);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.moduleForm.controls).forEach(key => {
        this.moduleForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/modules/list']);
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get name() { return this.moduleForm.get('name'); }
  get description() { return this.moduleForm.get('description'); }
  get version() { return this.moduleForm.get('version'); }
  get status() { return this.moduleForm.get('status'); }
  get category() { return this.moduleForm.get('category'); }
}
