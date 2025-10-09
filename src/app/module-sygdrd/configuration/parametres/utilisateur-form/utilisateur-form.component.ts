import {Component, Host, Input} from '@angular/core';
import {Utilisateur} from "../../../models/Utilisateur";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilisateurListComponent} from "../utilisateur-list/utilisateur-list.component";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {EnumService} from "../../../services/enum.service";
import Swal from "sweetalert2";
import {Profile} from "../../../models/Profile";
import {ProfileService} from "../../../services/profile.service";
import {Page} from "../../../models/Page";

@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.component.html',
  styleUrl: './utilisateur-form.component.scss'
})
export class UtilisateurFormComponent {
  @Input() innerUtilisateur= new Utilisateur();

  utilisateurForm: FormGroup = Object.create(null);
  utilisateurList!: UtilisateurListComponent;
  utilisateur!: Utilisateur;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  serviceutilisateur!: UtilisateurListComponent;
  roles: string[] = [];
  rolesSelected: string[] = [];
  dropdownSettings = {};
  singledropdownSettings = {};
  closeDropdownSelection = false;
  profiles: Profile[] = [];
  confirme : string = "";

  constructor(public utilisateurService: UtilisateurService,
              public profileService: ProfileService,
              public enumService: EnumService,
              private fb: FormBuilder,
              @Host() utilisateurList: UtilisateurListComponent){
    this.utilisateurList= utilisateurList;
  }

  ngOnInit(): void
  {

    this.dropdownSettings = {
      singleSelection: false,
      selectAllText: "Tout selectionner",
      unSelectAllText: "Tout deselectionner",
      itemsShowLimit: 5,
      allowSearchFilter: false,
    };

    this.utilisateurForm = this.fb.group({
      email:["", Validators.required],
      nom:["", Validators.required],
      prenom:["", Validators.required],
      photoUuid: [""],
      profileUuid: ["", Validators.required],
      password: [""],
      nonLocked: [true],
    });

    this.getCombos();

    if(this.innerUtilisateur!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.utilisateurForm.disable();
      this.utilisateur=this.innerUtilisateur
      this.display(this.utilisateur);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.utilisateurForm.enable();
      this.utilisateur=new Utilisateur();
      this.display(this.utilisateur);
    }


  }


  getCombos() {
    let page : Page = new Page();
    page.pageNumber = 0;
    page.size = 10000;
    this.profileService.getProfiless(page, "").subscribe((data) => {
      console.log(data)
      this.profiles = data.data;
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
    const descriptionControl = this.utilisateurForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.utilisateurForm.enable();
  }

  display(utilisateurdisplay: Utilisateur): void {
    this.utilisateur = utilisateurdisplay;
    this.utilisateurForm.patchValue({
      email: this.utilisateur.email,
      nom:this.utilisateur.nom,
      prenom:this.utilisateur.prenom,
      photoUuid: this.utilisateur.photoUuid,
      profileUuid: this.utilisateur.profileUuid,
      password: this.utilisateur.password,
      nonLocked: this.utilisateur.nonLocked
    });
  }

  Onsave(){
    this.submitted = true;
    if(this.utilisateurForm.invalid){
      Swal.fire({
        icon: 'error',
        text:'formulaire invalide verifier vos champs avant de valider'})
    }else{

      let utilisateurAdd = {...this.utilisateur,...this.utilisateurForm.value};
      console.log(utilisateurAdd)
      if(this.utilisateurForm.value!=''){
        //this.utilisateurList?.closeModal();
        if(this.innerUtilisateur!=null){
          this.utilisateurService.updateUtilisateur(utilisateurAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.utilisateurList?.closeModal();
                  this.utilisateurList?.getUtilisateurs();
                })
              })
        }else{
          this.utilisateurService.newUtilisateur(utilisateurAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.utilisateurList?.closeModal();
                  this.utilisateurList?.getUtilisateurs();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'Echec d\'enregistrement'})
              }
          )
        }
      }    }
  }

  delete(utilisateur :Utilisateur){
    // if(utilisateur.uuid!=this.serviceutilisateur.utilisateur_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.utilisateurList?.closeModal();
      if (result.isConfirmed) {
        this.utilisateurService.deleteUtilisateur(utilisateur.uuid).subscribe(
            (utilisateur: Utilisateur)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.utilisateurList?.closeModal();
                this.utilisateurList?.getUtilisateurs();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.utilisateurList?.closeModal();
              this.utilisateurList?.getUtilisateurs();
            })
              //this.utilisateurList?.getUtilisateurs();
            })

      }
    })

  }

}








