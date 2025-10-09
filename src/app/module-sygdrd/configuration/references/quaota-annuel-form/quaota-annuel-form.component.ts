import {Component, Host, Input} from '@angular/core';
import {QuotaAnnuel} from "../../../models/QuotaAnnuel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Exercice} from "../../../models/Exercice";
import {EnumService} from "../../../services/enum.service";
import {ExerciceService} from "../../../services/exercice.service";
import Swal from "sweetalert2";
import {QuotaAnnuelService} from "../../../services/quota-annuel.service";
import {QuotaListComponent} from "../../../analyse-synthese/quota-list/quota-list.component";
import {QuaotaAnnuelListComponent} from "../quaota-annuel-list/quaota-annuel-list.component";
import {Unite} from "../../../models/Unite";
import {LoisFinance} from "../../../models/LoisFinance";

@Component({
  selector: 'app-quaota-annuel-form',
  templateUrl: './quaota-annuel-form.component.html',
  styleUrl: './quaota-annuel-form.component.scss'
})
export class QuaotaAnnuelFormComponent {
  @Input() innerQuotaAnnuel:QuotaAnnuel | null | undefined;
  @Input() unite!:Unite|null;

  quotaAnnuelForm: FormGroup = Object.create(null);
  quotaAnnuelList!: QuaotaAnnuelListComponent;
  quotaAnnuel!: QuotaAnnuel;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicequotaAnnuel!: QuaotaAnnuelListComponent;
  typesQuotaAnnuels: string[] = [];
  exercices: Exercice[] = [];

  constructor(public quotaAnnuelService: QuotaAnnuelService,
              public enumService: EnumService,
              public exerciceService: ExerciceService,
              private fb: FormBuilder,
              @Host() quotaAnnuelList: QuaotaAnnuelListComponent){
    this.quotaAnnuelList= quotaAnnuelList;
  }

  ngOnInit(): void
  {

    this.getCombos()
    this.quotaAnnuelForm = this.fb.group({
      montantInitial:[0, Validators.required],
      montantRectificatif:[0],
      montantFinal:[0],
      exerciceUuid:["", Validators.required],
    });


    if(this.innerQuotaAnnuel!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.quotaAnnuelForm.disable();
      this.quotaAnnuel=this.innerQuotaAnnuel
      this.display(this.quotaAnnuel);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.quotaAnnuelForm.enable();
      this.quotaAnnuel=new QuotaAnnuel();
      this.display(this.quotaAnnuel);
    }


  }

  getCombos() {

    this.exerciceService.getAllExercice().subscribe((data) => {
      console.log(data)
      this.exercices = data.data;
    });

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
    const descriptionControl = this.quotaAnnuelForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.quotaAnnuelForm.enable();
  }

  display(quotaAnnuelDisplay: QuotaAnnuel): void {
    this.quotaAnnuel = quotaAnnuelDisplay;
    this.quotaAnnuelForm.patchValue({
      montantInitial: this.quotaAnnuel.montantInitial,
      montantRectificatif: this.quotaAnnuel.montantRectificatif,
      montantFinal: this.quotaAnnuel.montantFinal,
      exerciceUuid: this.quotaAnnuel.exerciceUuid
    });
  }
  Onsave(){
    console.log(this.quotaAnnuelForm.value)
    this.submitted = true;
    if(this.quotaAnnuelForm.invalid){
      return;
    }else{
      console.log(this.quotaAnnuelForm.value)
      this.quotaAnnuel.uniteUuid=this.unite!.uuid
      let quotaAnnuelAdd = {...this.quotaAnnuel,...this.quotaAnnuelForm.value};
      console.log(quotaAnnuelAdd)
      if(this.quotaAnnuelForm.value!=''){
        //this.quotaAnnuelList?.closeModal();
        if(this.innerQuotaAnnuel!=null){
          this.quotaAnnuelService.updateQuotaAnnuel(quotaAnnuelAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.quotaAnnuelList?.closeModal();
                  this.quotaAnnuelList?.getQuotaAnnuels();
                })
              })
        }else{
          this.quotaAnnuelService.newQuotaAnnuel(quotaAnnuelAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.quotaAnnuelList?.closeModal();
                  this.quotaAnnuelList?.getQuotaAnnuels();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.quotaAnnuelList?.closeModal();
                this.quotaAnnuelList?.getQuotaAnnuels();
              })
                //this.quotaAnnuelList?.getQuotaAnnuels();
              }
          )
        }
      }    }
  }

  delete(quotaAnnuel :QuotaAnnuel){
    // if(quotaAnnuel.uuid!=this.servicequotaAnnuel.quotaAnnuel_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.quotaAnnuelList?.closeModal();
      if (result.isConfirmed) {
        this.quotaAnnuelService.deleteQuotaAnnuel(quotaAnnuel.uuid).subscribe(
            (quotaAnnuel: QuotaAnnuel)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.quotaAnnuelList?.closeModal();
                this.quotaAnnuelList?.getQuotaAnnuels();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.quotaAnnuelList?.closeModal();
              this.quotaAnnuelList?.getQuotaAnnuels();
            })
              //this.quotaAnnuelList?.getQuotaAnnuels();
            })

      }
    })

  }
  
}








