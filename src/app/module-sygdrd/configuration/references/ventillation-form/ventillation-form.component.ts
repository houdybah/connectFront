import { Component, Host, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mensualisation } from '../../../../../src/models/Mensualisation';
import { Unite } from '../../../../../src/models/Unite';
import { MensualisationListComponent } from '../mensualisation-list/mensualisation-list.component';
import { QuotaAnnuel } from '../../../../../src/models/QuotaAnnuel';
import { TypeProduitRubrique } from '../../../../../src/models/TypeProduitRubrique';
import { MensualisationService } from '../../../../../src/services/mensualisation.service';
import { QuotaAnnuelService } from '../../../../../src/services/quota-annuel.service';
import { TypeProduitRubriqueService } from '../../../../../src/services/type-produit-rubrique.service';
import Swal from 'sweetalert2';
import { VentilationService } from '../../../../../src/services/ventilation.service';
import { VentilationParRubrique } from '../../../../../src/models/VentilationParRubrique';
import { PagedData } from '../../../../../src/models/PageData';
import { Page } from '../../../../../src/models/Page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentillationListComponent } from '../ventillation-list/ventillation-list.component';

@Component({
  selector: 'app-ventillation-form',
  templateUrl: './ventillation-form.component.html',
  styleUrl: './ventillation-form.component.scss'
})
export class VentillationFormComponent {

    @Input() innerVentillationParRubrique:VentilationParRubrique | null | undefined;
    @Input() mensualisation!:Mensualisation|null;
    
   
     ventillationParRubriqueForm: FormGroup = Object.create(null);
     ventillationParRubriqueList!: VentillationListComponent;
     ventillationParRubrique!: VentilationParRubrique;
     isEnable: boolean = false;
     isEdit: boolean = false;
     submitted =false;
     activeSelected=1;
     disabled = true;
     currentJustify = 'start';
     active=1;
     activev= "top";
     activeKeep=1;
     ventillationParRubriques: VentilationParRubrique[] = [];
   
     natureRecette!:TypeProduitRubrique[];
   
     constructor(public ventillationService: VentilationService,
                 public quotaAnnuelService: QuotaAnnuelService,
                 private fb: FormBuilder,
                public typeProduitRubriqueService:TypeProduitRubriqueService,
                 @Host() ventillationList: VentillationListComponent){
       this.ventillationParRubriqueList= ventillationList;
     }
   
     ngOnInit(): void {
       this.getNatureRecette();
       //this.getCombos()
       this.ventillationParRubriqueForm = this.fb.group({
        typeProduitRubriqueUuid:["", Validators.required],
        montantInitial:["", Validators.required]
       });
   
   
       if(this.innerVentillationParRubrique!= null){
         this.isEdit = true;
         this.isEnable = false;
         this.ventillationParRubriqueForm.disable();
         this.ventillationParRubrique=this.innerVentillationParRubrique
         this.display(this.ventillationParRubrique);
       }
       else
       {
         this.isEdit = false;
         this.isEnable = true;
         this.ventillationParRubriqueForm.enable();
         this.ventillationParRubrique=new VentilationParRubrique();
         this.display(this.ventillationParRubrique);
       }
   
   
     }
   
      getNatureRecette() {
       this.typeProduitRubriqueService.getAllRubrique().subscribe(data => {
         this.natureRecette = data;
         console.log(this.natureRecette);
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
       const descriptionControl = this.ventillationParRubriqueForm.get('description');
       if (descriptionControl) {
         descriptionControl.setErrors(null);
       }
     }
   
     activer(e:any): void {
       e.preventDefault();
       this.isEnable = true;
       this.ventillationParRubriqueForm.enable();
     }
   
     display(ventillationParRubriqueDisplay: VentilationParRubrique): void {
       this.ventillationParRubrique = ventillationParRubriqueDisplay;
       this.ventillationParRubriqueForm.patchValue({
        typeProduitRubriqueUuid: this.ventillationParRubrique.typeProduitRubriqueUuid,
        montantInitial: this.ventillationParRubrique.montantInitial,

       });
     }
   
     Onsave(){
       console.log(this.ventillationParRubriqueForm.value)
       this.submitted = true;
       if(this.ventillationParRubriqueForm.invalid){
         return;
       }else{
         console.log(this.ventillationParRubriqueForm.value)
         this.ventillationParRubrique.mensualisationUuid=this.mensualisation!.uuid
         let ventilationAdd = {...this.ventillationParRubrique,...this.ventillationParRubriqueForm.value};
        // ventilationAdd.mensualisationUuid = this.innerVentillationParRubrique!.uuid;
         console.log(ventilationAdd)
         if(this.ventillationParRubriqueForm.value!=''){
           //this.mensualisationList?.closeModal();
           if(this.innerVentillationParRubrique!=null){
             this.ventillationService.updateVentilation(ventilationAdd).subscribe(
                 ()=>{
                   Swal.fire({
                     icon: 'success',
                     title: 'Modification effectué avec success!',
                     showConfirmButton: false,
                     timer: 1000 }).then(()=>{
                     this.ventillationParRubriqueList?.closeModal();
                     this.ventillationParRubriqueList?.getVentilationRubrique();
                   })
                 })
           }else{
             this.ventillationService.newVentilation(ventilationAdd).subscribe(
                 ()=>{
                   Swal.fire({
                     icon: 'success',
                     title: ' Enregistrement effectué avec success!',
                     showConfirmButton: false,
                     timer: 1000}).then(()=>{
                     this.ventillationParRubriqueList?.closeModal();
                     this.ventillationParRubriqueList?.getVentilationRubrique();
                   })
                 },
   
                 ()=>{Swal.fire({
                   icon: 'error',
                   text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                   this.ventillationParRubriqueList?.closeModal();
                   this.ventillationParRubriqueList?.getVentilationRubrique();
                 })
                   //this.mensualisationList?.getMensualisations();
                 }
             )
           }
         }    }
     }
   
     delete(ventilationParRubrique :VentilationParRubrique){
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
           this.ventillationService.deleteVentilation(ventilationParRubrique.uuid).subscribe(
               (ventilationParRubrique: VentilationParRubrique)=>{
                 Swal.fire({
                   icon: 'success',
                   title: 'Suppression effectuée avec success.',
                   showConfirmButton: false,
                   timer: 1000
                 }).then(()=>{
                   this.ventillationParRubriqueList?.closeModal();
                   this.ventillationParRubriqueList?.getVentilationRubrique();
                 })
   
               },()=>{Swal.fire({
                 icon: 'error',
                 text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
                 this.ventillationParRubriqueList?.closeModal();
                 this.ventillationParRubriqueList?.getVentilationRubrique();
               })
                 //this.mensualisationList?.getMensualisations();
               })
         }
       })
   
     }
   

}








