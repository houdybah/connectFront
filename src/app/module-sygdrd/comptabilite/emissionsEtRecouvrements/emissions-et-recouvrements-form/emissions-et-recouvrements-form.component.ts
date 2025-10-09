import {Component, Host, Input} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Quota} from "../../../models/Quota";
import {QuotaListComponent} from "../../../analyse-synthese/quota-list/quota-list.component";
import {Unite} from "../../../models/Unite";
import {Exercice} from "../../../models/Exercice";
import {QuotaService} from "../../../services/quota.service";
import {UniteService} from "../../../services/unite.service";
import {ExerciceService} from "../../../services/exercice.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-emissions-et-recouvrements-form',
  templateUrl: './emissions-et-recouvrements-form.component.html',
  styleUrl: './emissions-et-recouvrements-form.component.scss'
})
export class EmissionsEtRecouvrementsFormComponent {



}








