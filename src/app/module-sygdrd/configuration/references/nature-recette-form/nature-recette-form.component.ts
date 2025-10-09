import {Component, Host, Input} from '@angular/core';
import {NatureRecette} from "../../../models/NatureRecette";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {NatureRecetteListComponent} from "../nature-recette-list/nature-recette-list.component";
import {NatureRecetteService} from "../../../services/nature-recette.service";

@Component({
  selector: 'app-nature-recette-form',
  templateUrl: './nature-recette-form.component.html',
  styleUrl: './nature-recette-form.component.scss'
})
export class NatureRecetteFormComponent {

  @Input() innerNatureRecette= new NatureRecette();

  natureRecetteForm: FormGroup = Object.create(null);
  natureRecetteList!: NatureRecetteListComponent;
  natureRecette!: NatureRecette;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicenatureRecette!: NatureRecetteListComponent;

  constructor(public natureRecetteService: NatureRecetteService,
              private fb: FormBuilder,
              @Host() natureRecetteList: NatureRecetteListComponent){
    this.natureRecetteList= natureRecetteList;
  }
  ngOnInit(): void
  {

    this.natureRecetteForm = this.fb.group({
      codeProduit:["", Validators.required],
      typeProduit:["", Validators.required]
    });

    if(this.innerNatureRecette!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.natureRecetteForm.disable();
      this.natureRecette=this.innerNatureRecette
      this.display(this.natureRecette);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.natureRecetteForm.enable();
      this.natureRecette=new NatureRecette();
      this.display(this.natureRecette);
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
    const descriptionControl = this.natureRecetteForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.natureRecetteForm.enable();
  }

  display(natureRecettedisplay: NatureRecette): void {
    this.natureRecette = natureRecettedisplay;
    this.natureRecetteForm.patchValue({
      codeProduit: this.natureRecette.codeProduit,
      typeProduit: this.natureRecette.typeProduit
    });
  }

  Onsave(){
    this.submitted = true;
    if(this.natureRecetteForm.invalid){
      return;
    }else{
      console.log(this.natureRecetteForm.value)
      let natureRecetteAdd = {...this.natureRecette,...this.natureRecetteForm.value};
      //natureRecetteAdd.uuid=this.natureRecetteForm.controls['uuid'].value.uuid
      console.log(natureRecetteAdd)
      console.log(this.natureRecetteForm.value)
      if(this.natureRecetteForm.value!=''){
        //this.natureRecetteList?.closeModal();
        if(this.innerNatureRecette!=null){
          this.natureRecetteService.updateNatureRecette(natureRecetteAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.natureRecetteList?.closeModal();
                  this.natureRecetteList?.getNatureRecettes();
                })
              })
        }else{
          this.natureRecetteService.newNatureRecette(natureRecetteAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.natureRecetteList?.closeModal();
                  this.natureRecetteList?.getNatureRecettes();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.natureRecetteList?.closeModal();
                this.natureRecetteList?.getNatureRecettes();
              })
                //this.natureRecetteList?.getNatureRecettes();
              }
          )
        }
      }    }
  }

  delete(natureRecette :NatureRecette){
    // if(natureRecette.uuid!=this.servicenatureRecette.natureRecette_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.natureRecetteList?.closeModal();
      if (result.isConfirmed) {
        this.natureRecetteService.deleteNatureRecette(natureRecette.uuid).subscribe(
            (natureRecette: NatureRecette)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.natureRecetteList?.closeModal();
                this.natureRecetteList?.getNatureRecettes();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.natureRecetteList?.closeModal();
              this.natureRecetteList?.getNatureRecettes();
            })
              //this.natureRecetteList?.getNatureRecettes();
            })

      }
    })

  }

}








