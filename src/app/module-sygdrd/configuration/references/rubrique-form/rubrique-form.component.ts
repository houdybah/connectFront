import {Component, Host, Input} from '@angular/core';
import {Rubrique} from "../../../models/Rubrique";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RubriqueListComponent} from "../rubrique-list/rubrique-list.component";
import {RubriqueService} from "../../../services/rubrique.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-rubrique-form',
  templateUrl: './rubrique-form.component.html',
  styleUrl: './rubrique-form.component.scss'
})
export class RubriqueFormComponent {

  @Input() innerRubrique= new Rubrique();

  rubriqueForm: FormGroup = Object.create(null);
  rubriqueList!: RubriqueListComponent;
  rubrique!: Rubrique;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicerubrique!: RubriqueListComponent;

  constructor(public rubriqueService: RubriqueService,
              private fb: FormBuilder,
              @Host() rubriqueList: RubriqueListComponent){
    this.rubriqueList= rubriqueList;
  }
  ngOnInit(): void
  {

    this.rubriqueForm = this.fb.group({
      codeRubrique:["", Validators.required],
      descriptionRubrique:["", Validators.required]
    });

    if(this.innerRubrique!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.rubriqueForm.disable();
      this.rubrique=this.innerRubrique
      this.display(this.rubrique);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.rubriqueForm.enable();
      this.rubrique=new Rubrique();
      this.display(this.rubrique);
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
    const descriptionControl = this.rubriqueForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.rubriqueForm.enable();
  }

  display(rubriquedisplay: Rubrique): void {
    this.rubrique = rubriquedisplay;
    this.rubriqueForm.patchValue({
      codeRubrique: this.rubrique.codeRubrique,
      descriptionRubrique: this.rubrique.descriptionRubrique
    });
  }

  Onsave(){
    this.submitted = true;
    if(this.rubriqueForm.invalid){
      return;
    }else{
      console.log(this.rubriqueForm.value)
      let rubriqueAdd = {...this.rubrique,...this.rubriqueForm.value};
      //rubriqueAdd.uuid=this.rubriqueForm.controls['uuid'].value.uuid
      console.log(rubriqueAdd)
      console.log(this.rubriqueForm.value)
      if(this.rubriqueForm.value!=''){
        //this.rubriqueList?.closeModal();
        if(this.innerRubrique!=null){
          this.rubriqueService.updateRubrique(rubriqueAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.rubriqueList?.closeModal();
                  this.rubriqueList?.getRubriques();
                })
              })
        }else{
          this.rubriqueService.newRubrique(rubriqueAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.rubriqueList?.closeModal();
                  this.rubriqueList?.getRubriques();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.rubriqueList?.closeModal();
                this.rubriqueList?.getRubriques();
              })
                //this.rubriqueList?.getRubriques();
              }
          )
        }
      }    }
  }

  delete(rubrique :Rubrique){
    // if(rubrique.uuid!=this.servicerubrique.rubrique_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.rubriqueList?.closeModal();
      if (result.isConfirmed) {
        this.rubriqueService.deleteRubrique(rubrique.uuid).subscribe(
            (rubrique: Rubrique)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.rubriqueList?.closeModal();
                this.rubriqueList?.getRubriques();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.rubriqueList?.closeModal();
              this.rubriqueList?.getRubriques();
            })
              //this.rubriqueList?.getRubriques();
            })

      }
    })

  }

}








