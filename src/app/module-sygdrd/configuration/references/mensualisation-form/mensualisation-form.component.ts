import {Component, Host, Input} from '@angular/core';
import {Mensualisation} from "../../../models/Mensualisation";
import {Unite} from "../../../models/Unite";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuotaAnnuel} from "../../../models/QuotaAnnuel";
import {EnumService} from "../../../services/enum.service";
import Swal from "sweetalert2";
import {MensualisationService} from "../../../services/mensualisation.service";
import {MensualisationListComponent} from "../mensualisation-list/mensualisation-list.component";
import {QuotaAnnuelService} from "../../../services/quota-annuel.service";
import { TypeProduitRubriqueService } from '../../../../../src/services/type-produit-rubrique.service';
import { TypeProduitRubrique } from '../../../../../src/models/TypeProduitRubrique';

@Component({
  selector: 'app-mensualisation-form',
  templateUrl: './mensualisation-form.component.html',
  styleUrl: './mensualisation-form.component.scss'
})
export class MensualisationFormComponent {

  @Input() innerMensualisation:Mensualisation | null | undefined;
  @Input() unite!:Unite|null;

  mensualisationForm: FormGroup = Object.create(null);
  mensualisationList!: MensualisationListComponent;
  mensualisation!: Mensualisation;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  quotaAnnuels: QuotaAnnuel[] = [];

  natureRecette!:TypeProduitRubrique[];

  constructor(public mensualisationService: MensualisationService,
              public quotaAnnuelService: QuotaAnnuelService,
              private fb: FormBuilder,
             public typeProduitRubriqueService:TypeProduitRubriqueService,
              @Host() mensualisationList: MensualisationListComponent){
    this.mensualisationList= mensualisationList;
  }

  ngOnInit(): void {
  //  this.getNatureRecette();
    this.getCombos()
    this.mensualisationForm = this.fb.group({
      montant:[0, Validators.required],
      mois:["", Validators.required],
      quotaAnnuelUuid:["", Validators.required],
      //uuidTypeProduitRubrique:[''],
      // montantVentiller:['']
    });


    if(this.innerMensualisation!= null){
      this.isEdit = true;
      this.isEnable = false;
      this.mensualisationForm.disable();
      this.mensualisation=this.innerMensualisation
      this.display(this.mensualisation);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.mensualisationForm.enable();
      this.mensualisation=new Mensualisation();
      this.display(this.mensualisation);
    }


  }

   getNatureRecette() {
    this.typeProduitRubriqueService.getAllRubrique().subscribe(data => {
      this.natureRecette = data;
    });

  }

  getCombos() {

    this.quotaAnnuelService.getAllQuotaAnnuel().subscribe((data:any) => {
      console.log(data)
      this.quotaAnnuels = data.data;
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
    const descriptionControl = this.mensualisationForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.mensualisationForm.enable();
  }

  display(mensualisationDisplay: Mensualisation): void {
    this.mensualisation = mensualisationDisplay;
    this.mensualisationForm.patchValue({
      montant: this.mensualisation.montant,
      mois: this.mensualisation.mois,
      quotaAnnuelUuid: this.mensualisation.quotaAnnuelUuid
    });
  }

  Onsave(){
    console.log(this.mensualisationForm.value)
    this.submitted = true;
    if(this.mensualisationForm.invalid){
      return;
    }else{
      console.log(this.mensualisationForm.value)
      this.mensualisation.uniteUuid=this.unite!.uuid
      let mensualisationAdd = {...this.mensualisation,...this.mensualisationForm.value};
      console.log(mensualisationAdd)
      if(this.mensualisationForm.value!=''){
        //this.mensualisationList?.closeModal();
        if(this.innerMensualisation!=null){
          this.mensualisationService.updateMensualisation(mensualisationAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.mensualisationList?.closeModal();
                  this.mensualisationList?.getMensualisations();
                })
              })
        }else{
          this.mensualisationService.newMensualisation(mensualisationAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.mensualisationList?.closeModal();
                  this.mensualisationList?.getMensualisations();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.mensualisationList?.closeModal();
                this.mensualisationList?.getMensualisations();
              })
                //this.mensualisationList?.getMensualisations();
              }
          )
        }
      }    }
  }

  delete(mensualisation :Mensualisation){
    // if(mensualisation.uuid!=this.servicemensualisation.mensualisation_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.mensualisationList?.closeModal();
      if (result.isConfirmed) {
        this.mensualisationService.deleteMensualisation(mensualisation.uuid).subscribe(
            (mensualisation: Mensualisation)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.mensualisationList?.closeModal();
                this.mensualisationList?.getMensualisations();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.mensualisationList?.closeModal();
              this.mensualisationList?.getMensualisations();
            })
              //this.mensualisationList?.getMensualisations();
            })

      }
    })

  }



  


}








