import {Component, Input} from '@angular/core';
import {Unite} from "../../../models/Unite";
import {Realisation} from "../../../models/Realisation";
import {PrintService} from "../../../services/print.service";
import {ReportResultDto} from "../../../models/reportResultDto";

@Component({
  selector: 'app-realisation-print',
  templateUrl: './realisation-print.component.html',
  styleUrl: './realisation-print.component.scss'
})
export class RealisationPrintComponent {
  @Input() realisations: Realisation[] |undefined = [];
  @Input() unite: Unite | null = new Unite();
  @Input() periodicite : string ="";
  @Input() dateDebut : string ="";
  @Input() dateFin : string ="";

  reportResult : ReportResultDto = new ReportResultDto();

  constructor(
      private printService: PrintService
  )
  {
  }

  ngOnInit(): void {

  }

  print()
  {
    this.reportResult = new ReportResultDto();
    this.reportResult.name=""
    this.printService.printRealisationUnite(this.unite!.uuid,this.periodicite,this.dateDebut,this.dateFin).subscribe(
        (result)=>
        {
          this.reportResult.name=result.name;
        }
    )
  }


}








