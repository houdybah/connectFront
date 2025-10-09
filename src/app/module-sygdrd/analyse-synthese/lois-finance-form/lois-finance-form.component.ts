import {Component, Host, Input} from '@angular/core';
import {LoisFinance} from "../../../models/LoisFinance";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {LoisFinanceListComponent} from "../lois-finance-list/lois-finance-list.component";
import {LoisFinanceService} from "../../../services/lois-finance.service";
import {EnumService} from "../../../services/enum.service";
import {ExerciceService} from "../../../services/exercice.service";
import {Exercice} from "../../../models/Exercice";

@Component({
  selector: 'app-lois-finance-form',
  templateUrl: './lois-finance-form.component.html',
  styleUrl: './lois-finance-form.component.scss'
})
export class LoisFinanceFormComponent {

  @Input() innerLoisFinance= new LoisFinance();

  loisFinanceForm: FormGroup = Object.create(null);
  loisFinanceList!: LoisFinanceListComponent;
  loisFinance!: LoisFinance;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  serviceloisFinance!: LoisFinanceListComponent;
  typesLoisFinances: string[] = [];
  exercices: Exercice[] = [];

  constructor(public loisFinanceService: LoisFinanceService,
              public enumService: EnumService,
              public exerciceService: ExerciceService,
              private fb: FormBuilder,
              @Host() loisFinanceList: LoisFinanceListComponent){
    this.loisFinanceList= loisFinanceList;
  }
  ngOnInit(): void
  {

    this.loisFinanceForm = this.fb.group({
      reference:["", Validators.required],
      qta:["", Validators.required],
      type:["", Validators.required],
      uuidEexercice:["", Validators.required]
    });

    this.getCombos();

    if(this.innerLoisFinance!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.loisFinanceForm.disable();
      this.loisFinance=this.innerLoisFinance
      this.display(this.loisFinance);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.loisFinanceForm.enable();
      this.loisFinance=new LoisFinance();
      this.display(this.loisFinance);
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
    const descriptionControl = this.loisFinanceForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.loisFinanceForm.enable();
  }

  display(loisFinanceDisplay: LoisFinance): void {
    this.loisFinance = loisFinanceDisplay;
    this.loisFinanceForm.patchValue({
      reference: this.loisFinance.reference,
      qta: this.loisFinance.qta,
      type: this.loisFinance.type,
      uuidEexercice: this.loisFinance.uuidEexercice,
    });
  }
  Onsave(){
    console.log(this.loisFinanceForm.value)
    this.submitted = true;
    if(this.loisFinanceForm.invalid){
      return;
    }else{
      console.log(this.loisFinanceForm.value)
      let loisFinanceAdd = {...this.loisFinance,...this.loisFinanceForm.value};
      //loisFinanceAdd.uuid=this.loisFinanceForm.controls['uuid'].value.uuid
      console.log(loisFinanceAdd)
      console.log(this.loisFinanceForm.value)
      if(this.loisFinanceForm.value!=''){
        //this.loisFinanceList?.closeModal();
        if(this.innerLoisFinance!=null){
          this.loisFinanceService.updateLoisFinance(loisFinanceAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.loisFinanceList?.closeModal();
                  this.loisFinanceList?.getLoisFinances();
                })
              })
        }else{
          this.loisFinanceService.newLoisFinance(loisFinanceAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.loisFinanceList?.closeModal();
                  this.loisFinanceList?.getLoisFinances();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.loisFinanceList?.closeModal();
                this.loisFinanceList?.getLoisFinances();
              })
                //this.loisFinanceList?.getLoisFinances();
              }
          )
        }
      }    }
  }

  delete(loisFinance :LoisFinance){
    // if(loisFinance.uuid!=this.serviceloisFinance.loisFinance_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.loisFinanceList?.closeModal();
      if (result.isConfirmed) {
        this.loisFinanceService.deleteLoisFinance(loisFinance.uuid).subscribe(
            (loisFinance: LoisFinance)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.loisFinanceList?.closeModal();
                this.loisFinanceList?.getLoisFinances();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.loisFinanceList?.closeModal();
              this.loisFinanceList?.getLoisFinances();
            })
              //this.loisFinanceList?.getLoisFinances(); 
            })

      }
    })

  }

  getCombos() {

    this.enumService.getTypesLoisFinance().subscribe((data) => {
      console.log(data)
      this.typesLoisFinances = data;
    });

    this.exerciceService.getAllExercice().subscribe((data) => {
      console.log(data)
      this.exercices = data.data;
    });

  }
}








