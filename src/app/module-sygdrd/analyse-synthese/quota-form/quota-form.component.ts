import {Component, Host, Input} from '@angular/core';
import {Quota} from "../../../models/Quota";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Exercice} from "../../../models/Exercice";
import {EnumService} from "../../../services/enum.service";
import {ExerciceService} from "../../../services/exercice.service";
import Swal from "sweetalert2";
import {QuotaListComponent} from "../quota-list/quota-list.component";
import {QuotaService} from "../../../services/quota.service";
import {Unite} from "../../../models/Unite";
import {UniteService} from "../../../services/unite.service";

@Component({
  selector: 'app-quota-form',
  templateUrl: './quota-form.component.html',
  styleUrl: './quota-form.component.scss'
})
export class QuotaFormComponent {

  @Input() innerQuota= new Quota();

  quotaForm: FormGroup = Object.create(null);
  quotaList!: QuotaListComponent;
  quota!: Quota;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicequota!: QuotaListComponent;
  unites: Unite[] = [];
  exercices: Exercice[] = [];

  constructor(public quotaService: QuotaService,
              public uniteService: UniteService,
              public exerciceService: ExerciceService,
              private fb: FormBuilder,
              @Host() quotaList: QuotaListComponent){
    this.quotaList= quotaList;
  }
  ngOnInit(): void
  {

    this.quotaForm = this.fb.group({
      montant:[0, Validators.required],
      ajustement:[0, Validators.required],
      uuidUnite:["", Validators.required],
      uuidExecice:["", Validators.required]
    });

    this.getCombos();

    if(this.innerQuota!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.quotaForm.disable();
      this.quota=this.innerQuota
      this.display(this.quota);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.quotaForm.enable();
      this.quota=new Quota();
      this.display(this.quota);
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
    const descriptionControl = this.quotaForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.quotaForm.enable();
  }

  display(quotaDisplay: Quota): void {
    this.quota = quotaDisplay;
    this.quotaForm.patchValue({
      montant: this.quota.montant,
      ajustement: this.quota.ajustement,
      uuidUnite: this.quota.uuidUnite,
      uuidExecice: this.quota.uuidExecice,
    });
  }
  Onsave(){
    console.log(this.quotaForm.value)
    this.submitted = true;
    if(this.quotaForm.invalid){
      return;
    }else{
      console.log(this.quotaForm.value)
      let quotaAdd = {...this.quota,...this.quotaForm.value};
      //quotaAdd.uuid=this.quotaForm.controls['uuid'].value.uuid
      console.log(quotaAdd)
      console.log(this.quotaForm.value)
      if(this.quotaForm.value!=''){
        //this.quotaList?.closeModal();
        if(this.innerQuota!=null){
          this.quotaService.updateQuota(quotaAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.quotaList?.closeModal();
                  this.quotaList?.getQuotas();
                })
              })
        }else{
          this.quotaService.newQuota(quotaAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.quotaList?.closeModal();
                  this.quotaList?.getQuotas();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.quotaList?.closeModal();
                this.quotaList?.getQuotas();
              })
                //this.quotaList?.getQuotas();
              }
          )
        }
      }    }
  }

  delete(quota :Quota){
    // if(quota.uuid!=this.servicequota.quota_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.quotaList?.closeModal();
      if (result.isConfirmed) {
        this.quotaService.deleteQuota(quota.uuid).subscribe(
            (quota: Quota)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.quotaList?.closeModal();
                this.quotaList?.getQuotas();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.quotaList?.closeModal();
              this.quotaList?.getQuotas();
            })
              //this.quotaList?.getQuotas();
            })

      }
    })

  }

  getCombos() {

    this.uniteService.getAllUnite().subscribe((data) => {
      console.log(data)
      this.unites = data.data;
    });

    this.exerciceService.getAllExercice().subscribe((data) => {
      console.log(data)
      this.exercices = data.data;
    });

  }

}








