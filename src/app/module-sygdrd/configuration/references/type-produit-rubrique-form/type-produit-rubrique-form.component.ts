import { Component, Host, Input } from '@angular/core';
import { NatureRecette } from '../../../../../src/models/NatureRecette';
import { TypeProduitRubrique } from '../../../../../src/models/TypeProduitRubrique';
import { TypeProduitRubriqueListComponent } from '../type-produit-rubrique-list/type-produit-rubrique-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeProduitRubriqueService } from '../../../../../src/services/type-produit-rubrique.service';
import { RubriqueService } from '../../../../../src/services/rubrique.service';
import { Rubrique } from '../../../../../src/models/Rubrique';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-type-produit-rubrique-form',
  templateUrl: './type-produit-rubrique-form.component.html',
  styleUrl: './type-produit-rubrique-form.component.scss'
})
export class TypeProduitRubriqueFormComponent {

   @Input() innerTypeProduitRubrique:TypeProduitRubrique | null | undefined;
    @Input() natureRecette!:NatureRecette|null;
  
    typeProduitRubriqueForm: FormGroup = Object.create(null);
    typeProduitRubriqueList!: TypeProduitRubriqueListComponent
    typeProduitRubrique!: TypeProduitRubrique;
    isEnable: boolean = false;
    isEdit: boolean = false;
    submitted =false;
    activeSelected=1;
    disabled = true;
    currentJustify = 'start';
    active=1;
    activev= "top";
    activeKeep=1;
    
    rubriques!:Rubrique[];

    constructor(public typeProduitRubriqueService: TypeProduitRubriqueService,
                  public rubriqueService: RubriqueService,
                  private fb: FormBuilder,
                  @Host()  typeProduitRubriqueList:  TypeProduitRubriqueListComponent){
        this.typeProduitRubriqueList= typeProduitRubriqueList;
      }

         ngOnInit(): void {
            this.getRubrique()
            this.typeProduitRubriqueForm = this.fb.group({
              uuidRubrique:["", Validators.required]
            });
            if(this.innerTypeProduitRubrique!= null){
              this.isEdit = true;
              this.isEnable = false;
              this.typeProduitRubriqueForm.disable();
              this.typeProduitRubrique=this.innerTypeProduitRubrique
              this.display(this.typeProduitRubrique);
            }
            else
            {
              this.isEdit = false;
              this.isEnable = true;
              this.typeProduitRubriqueForm.enable();
              this.typeProduitRubrique=new TypeProduitRubrique();
              this.display(this.typeProduitRubrique);
            }
        
        
          }

            getRubrique() {
            this.rubriqueService.getAllRubriqueTypeProduit().subscribe(data => {
              this.rubriques = data;
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
              const descriptionControl = this.typeProduitRubriqueForm.get('description');
              if (descriptionControl) {
                descriptionControl.setErrors(null);
              }
            }
          
            activer(e:any): void {
              e.preventDefault();
              this.isEnable = true;
              this.typeProduitRubriqueForm.enable();
            }
          
            display(typeProduitRubriqueDisplay: TypeProduitRubrique): void {
              this.typeProduitRubrique = typeProduitRubriqueDisplay;
              this.typeProduitRubriqueForm.patchValue({
                uuidRubrique: this.typeProduitRubrique.uuidRubrique
                
              });
            }


              Onsave(){
                console.log(this.typeProduitRubriqueForm.value)
                this.submitted = true;
                if(this.typeProduitRubriqueForm.invalid){
                  return;
                }else{
                  console.log(this.typeProduitRubriqueForm.value)
                  this.typeProduitRubrique.uuidNatureRecette=this.natureRecette!.uuid
                  let typeProduitRubriqueAdd = {...this.typeProduitRubrique,...this.typeProduitRubriqueForm.value};
                  console.log(typeProduitRubriqueAdd)
                  if(this.typeProduitRubriqueForm.value!=''){
                    //this.mensualisationList?.closeModal();
                    if(this.innerTypeProduitRubrique!=null){
                      this.typeProduitRubriqueService.updateTypeProduitRubrique(typeProduitRubriqueAdd).subscribe(
                          ()=>{
                            Swal.fire({
                              icon: 'success',
                              title: 'Modification effectué avec success!',
                              showConfirmButton: false,
                              timer: 1000 }).then(()=>{
                             // this.typeProduitRubriqueList?.closeModal();
                              this.typeProduitRubriqueList?.getTypeProduitRubriques();
                            })
                          })
                    }else{
                      this.typeProduitRubriqueService.newTypeProduitRubrique(typeProduitRubriqueAdd).subscribe(
                          ()=>{
                            Swal.fire({
                              icon: 'success',
                              title: ' Enregistrement effectué avec success!',
                              showConfirmButton: false,
                              timer: 1000}).then(()=>{
                              //this.typeProduitRubriqueList?.closeModal();
                              this.typeProduitRubriqueList?.getTypeProduitRubriques();
                            })
                          },
            
                          ()=>{Swal.fire({
                            icon: 'error',
                            text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                            //this.getTypeProduitRubriques?.closeModal();
                            this.typeProduitRubriqueList?.getTypeProduitRubriques();
                          })
                            //this.mensualisationList?.getMensualisations();
                          }
                      )
                    }
                  }    }
              }
            
              delete(typeProduitRubrique :TypeProduitRubrique){
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
                    this.typeProduitRubriqueService.deleteRubrique(typeProduitRubrique.uuid).subscribe(
                        (typeProduitRubrique: TypeProduitRubrique)=>{
                          Swal.fire({
                            icon: 'success',
                            title: 'Suppression effectuée avec success.',
                            showConfirmButton: false,
                            timer: 1000
                          }).then(()=>{
                           // this.typeProduitRubriqueList?.closeModal();
                            this.typeProduitRubriqueList?.getTypeProduitRubriques();
                          })
            
                        },()=>{Swal.fire({
                          icon: 'error',
                          text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
                          //this.typeProduitRubriqueList?.closeModal();
                          this.typeProduitRubriqueList?.getTypeProduitRubriques();
                        })
                          //this.mensualisationList?.getMensualisations();
                        })
            
                  }
                })
            
              }



}








