
import {Component, Host, Input} from '@angular/core';
import {Exercice} from "../../../models/Exercice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExerciceListComponent} from "../exercice-list/exercice-list.component";
import {ExerciceService} from "../../../services/exercice.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.component.html',
  styleUrl: './exercice-form.component.scss'
})
export class ExerciceFormComponent {

  @Input() innerExercice= new Exercice();

  exerciceForm: FormGroup = Object.create(null);
  exerciceList!: ExerciceListComponent;
  exercice!: Exercice;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  serviceexercice!: ExerciceListComponent;

  constructor(public exerciceService: ExerciceService,
              private fb: FormBuilder,
              @Host() exerciceList: ExerciceListComponent){
    this.exerciceList= exerciceList;
  }

  ngOnInit(): void
  {

    this.exerciceForm = this.fb.group({
      annee:["", Validators.required],
      objectif:[0, Validators.required],
      ajustement:[0, Validators.required],
    });

    if(this.innerExercice!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.exerciceForm.disable();
      this.exercice=this.innerExercice
      this.display(this.exercice);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.exerciceForm.enable();
      this.exercice=new Exercice();
      this.display(this.exercice);
    }

  }

  myValue: string = '';

  myValue2: string = '';
  onInputChange() {
    this.myValue = this.myValue.toUpperCase();
  }

  onInputChanges() {
    this.myValue2 = this.myValue2.toUpperCase();
  }

  clearError() {
    const descriptionControl = this.exerciceForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.exerciceForm.enable();

    // Maintenir le champ objectif en lecture seule même après activation
    if(this.isEdit) {
      this.exerciceForm.get('objectif')?.disable();
    }
  }

  display(exercicedisplay: Exercice): void {
    this.exercice = exercicedisplay;
    this.exerciceForm.patchValue({
      annee: this.exercice.annee,
      objectif: this.exercice.objectif,
      ajustement: this.exercice.ajustement
    });
  }

  Onsave(){
    this.submitted = true;

    // Temporairement activer le champ objectif pour la validation et l'envoi
    if(this.isEdit) {
      this.exerciceForm.get('objectif')?.enable();
    }

    if(this.exerciceForm.invalid){
      // Remettre le champ objectif en disabled si validation échoue
      if(this.isEdit) {
        this.exerciceForm.get('objectif')?.disable();
      }
      return;
    }else{
      console.log(this.exerciceForm.value)
      let exerciceAdd = {...this.exercice,...this.exerciceForm.value};
      console.log(exerciceAdd)
      console.log(this.exerciceForm.value)

      if(this.exerciceForm.value!=''){
        if(this.innerExercice!=null){
          this.exerciceService.updateExercice(exerciceAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.exerciceList?.closeModal();
                  this.exerciceList?.getExercices();
                })
              })
        }else{
          this.exerciceService.newExercice(exerciceAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.exerciceList?.closeModal();
                  this.exerciceList?.getExercices();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.exerciceList?.closeModal();
                this.exerciceList?.getExercices();
              })
              }
          )
        }
      }
    }
  }

  delete(exercice :Exercice){
    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.exerciceService.deleteExercice(exercice.uuid).subscribe(
            (exercice: Exercice)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.exerciceList?.closeModal();
                this.exerciceList?.getExercices();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.exerciceList?.closeModal();
              this.exerciceList?.getExercices();
            })
            })

      }
    })

  }

}







