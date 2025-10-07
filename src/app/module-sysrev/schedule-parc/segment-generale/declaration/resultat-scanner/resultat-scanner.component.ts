import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AffectationConteneur } from '../../../../models/AffectationConteneur';
import { ConteneurService } from '../../../../services/conteneur.service';
import { DetailConteneurAffectationService } from '../../../../services/detail-conteneur-affectation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resultat-scanner',
  templateUrl: './resultat-scanner.component.html',
  styleUrl: './resultat-scanner.component.scss'
})
export class ResultatScannerComponent implements OnInit {
  reference:any;
  resultat = new AffectationConteneur();
  generating:boolean = false;
  detailAffectationConteneurDtos: any;
   
  constructor(private route: ActivatedRoute,private affectationService:ConteneurService,private detailConteneurService:DetailConteneurAffectationService){}
  ngOnInit(): void {
    this.reference = this.route.snapshot.paramMap.get('reference');
    console.log(this.reference)
    this.getResultat(this.reference);
  }

  getResultat(reference:string){
    this.affectationService.getByScan(reference).subscribe((res: any) => {
      console.log(res)
      this.resultat = res
      this.loadDetailConteneurAffectation(res.uuid);
    })

   
  }


  printDetails(): void {
    window.print();
  }

  exportToPDF(): void {
    // Implement PDF export functionality
    console.log('Exporting to PDF...');
  }

  constationDeSortie(){
    this.affectationService.constationDeSortie(this.resultat.numero).subscribe((res: any) => {
       let timerInterval: any;
          Swal.fire({
            title: `Constation de sortie approuve avec success`,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then(() => {
             this.getResultat(this.resultat.numero);
          })
    })
  }



  loadDetailConteneurAffectation(uuid: string): void {
    this.detailConteneurService.getDetailConteneurAffectation(uuid).subscribe((res: any) => {
      console.log(res.uuid);
      this.detailAffectationConteneurDtos = res;
      console.log(this.resultat.detailAffectationConteneurDtos);
    });
  }
}









