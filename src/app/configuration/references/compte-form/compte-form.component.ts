import {Component, Host, Input} from '@angular/core';
import {Compte} from "../../../../models/Compte";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CompteListComponent } from '../compte-list/compte-list.component';
import {CompteService} from "../../../../services/compte.service";

@Component({
  selector: 'app-compte-form',
  templateUrl: './compte-form.component.html',
  styleUrl: './compte-form.component.scss'
})
export class CompteFormComponent {

  @Input() innerCompte= new Compte();

  compteForm: FormGroup = Object.create(null);
  compteList!: CompteListComponent;
  compte!: Compte;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicecompte!: CompteListComponent;

  constructor(public compteService: CompteService,
              private fb: FormBuilder,
              @Host() compteList: CompteListComponent){
    this.compteList= compteList;
  }
  ngOnInit(): void
  {

    this.compteForm = this.fb.group({

      codeCompte:["", Validators.required],
      descrptionCompte:["", Validators.required],


    });

    if(this.innerCompte!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.compteForm.disable();
      this.compte=this.innerCompte
      this.display(this.compte);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.compteForm.enable();
      this.compte=new Compte();
      this.display(this.compte);
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
    const descriptionControl = this.compteForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.compteForm.enable();
  }

  display(comptedisplay: Compte): void {
    this.compte = comptedisplay;
    this.compteForm.patchValue({
      codeCompte: this.compte.codeCompte,
      descrptionCompte: this.compte.descrptionCompte,


    });
  }
  Onsave(){
    this.submitted = true;
    if(this.compteForm.invalid){
      return;
    }else{
      console.log(this.compteForm.value)
      let compteAdd = {...this.compte,...this.compteForm.value};
      //compteAdd.uuid=this.compteForm.controls['uuid'].value.uuid
      console.log(compteAdd)
      console.log(this.compteForm.value)
      if(this.compteForm.value!=''){
        //this.compteList?.closeModal();
        if(this.innerCompte!=null){
          this.compteService.updateCompte(compteAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.compteList?.closeModal();
                  this.compteList?.getComptes();
                })
              })
        }else{
          this.compteService.newCompte(compteAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.compteList?.closeModal();
                  this.compteList?.getComptes();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.compteList?.closeModal();
                this.compteList?.getComptes();
              })
                //this.compteList?.getComptes();
              }
          )
        }
      }    }
  }

  delete(compte :Compte){
    // if(compte.uuid!=this.servicecompte.compte_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result) => {
      //this.compteList?.closeModal();
      if (result.isConfirmed) {
        this.compteService.deleteCompte(compte.uuid).subscribe(
            (compte: Compte)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.compteList?.closeModal();
                this.compteList?.getComptes();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.compteList?.closeModal();
              this.compteList?.getComptes();
            })
              //this.compteList?.getComptes(); 
            })

      }
    })

  }
  
}
