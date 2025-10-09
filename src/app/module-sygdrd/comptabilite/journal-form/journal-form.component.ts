import {Component, Host, Input} from '@angular/core';
import {Journal} from "../../../models/Journal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Unite} from "../../../models/Unite";
import {Exercice} from "../../../models/Exercice";
import {JournalService} from "../../../services/journal.service";
import {UniteService} from "../../../services/unite.service";
import {ExerciceService} from "../../../services/exercice.service";
import Swal from "sweetalert2";
import {JournalListComponent} from "../journal-list/journal-list.component";

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrl: './journal-form.component.scss'
})
export class JournalFormComponent {

  @Input() innerJournal= new Journal();

  journalForm: FormGroup = Object.create(null);
  journalList!: JournalListComponent;
  journal!: Journal;
  isEnable: boolean = false;
  isEdit: boolean = false;
  submitted =false;
  activeSelected=1;
  disabled = true;
  currentJustify = 'start';
  active=1;
  activev= "top";
  activeKeep=1;
  servicejournal!: JournalListComponent;
  unites: Unite[] = [];
  exercices: Exercice[] = [];

  constructor(public journalService: JournalService,
              public uniteService: UniteService,
              public exerciceService: ExerciceService,
              private fb: FormBuilder,
              @Host() journalList: JournalListComponent){
    this.journalList= journalList;
  }
  ngOnInit(): void
  {

    this.journalForm = this.fb.group({
      dateJournal:["", Validators.required],
      emission:[0, Validators.required],
      recouvrement:[0, Validators.required],
      totalEmission:[0, Validators.required],
      totalRecouvrement:[0, Validators.required],
      uuidUnite:["", Validators.required],
    });

    this.getCombos();

    if(this.innerJournal!= null)
    {
      this.isEdit = true;
      this.isEnable = false;
      this.journalForm.disable();
      this.journal=this.innerJournal
      this.display(this.journal);
    }
    else
    {
      this.isEdit = false;
      this.isEnable = true;
      this.journalForm.enable();
      this.journal=new Journal();
      this.display(this.journal);
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
    const descriptionControl = this.journalForm.get('description');
    if (descriptionControl) {
      descriptionControl.setErrors(null);
    }
  }

  activer(e:any): void {
    e.preventDefault();
    this.isEnable = true;
    this.journalForm.enable();
  }

  display(journalDisplay: Journal): void {
    this.journal = journalDisplay;
    this.journalForm.patchValue({
      dateJournal:this.journal.dateJournal,
      emission:this.journal.emission,
      recouvrement:this.journal.recouvrement,
      totalEmission:this.journal.totalEmission,
      totalRecouvrement:this.journal.totalRecouvrement,
      uuidUnite:this.journal.uuidUnite,
    });
  }
  Onsave(){
    console.log(this.journalForm.value)
    this.submitted = true;
    if(this.journalForm.invalid){
      return;
    }else{
      console.log(this.journalForm.value)
      let journalAdd = {...this.journal,...this.journalForm.value};
      //journalAdd.uuid=this.journalForm.controls['uuid'].value.uuid
      console.log(journalAdd)
      console.log(this.journalForm.value)
      if(this.journalForm.value!=''){
        //this.journalList?.closeModal();
        if(this.innerJournal!=null){
          this.journalService.updateJournal(journalAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: 'Modification effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000 }).then(()=>{
                  this.journalList?.closeModal();
                  this.journalList?.getJournals();
                })
              })
        }else{
          this.journalService.newJournal(journalAdd).subscribe(
              ()=>{
                Swal.fire({
                  icon: 'success',
                  title: ' Enregistrement effectué avec success!',
                  showConfirmButton: false,
                  timer: 1000}).then(()=>{
                  this.journalList?.closeModal();
                  this.journalList?.getJournals();
                })
              },

              ()=>{Swal.fire({
                icon: 'error',
                text:'veuiller verifier vos champs avant de valider'}).then(()=>{
                this.journalList?.closeModal();
                this.journalList?.getJournals();
              })
                //this.journalList?.getJournals();
              }
          )
        }
      }    }
  }

  delete(journal :Journal){
    // if(journal.uuid!=this.servicejournal.journal_uuid){}

    Swal.fire({
      title:'etes vous sure ?',
      text: "De vouloir supprimer ce element!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'oui, supprimer!'
    }).then((result: any) => {
      //this.journalList?.closeModal();
      if (result.isConfirmed) {
        this.journalService.deleteJournal(journal.uuid).subscribe(
            (journal: Journal)=>{
              Swal.fire({
                icon: 'success',
                title: 'Suppression effectuée avec success.',
                showConfirmButton: false,
                timer: 1000
              }).then(()=>{
                this.journalList?.closeModal();
                this.journalList?.getJournals();
              })

            },()=>{Swal.fire({
              icon: 'error',
              text:'vous ne pouvez pas supprimer ce element'}).then(()=>{
              this.journalList?.closeModal();
              this.journalList?.getJournals();
            })
              //this.journalList?.getJournals();
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








