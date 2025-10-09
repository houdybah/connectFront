import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NifUtilisateur } from '../../models/nif-utilisateur';
import { PagedData } from '../../models/paged-data';
import { SituationDecadaire } from '../../models/situation-decadaire';
import { NifUtilisateurService } from '../../services/nif-utilisateur.service';
import { SituationDecadaireService } from '../../services/situation-decadaire.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Utilisateur } from '../../models/Utilisateur';

@Component({
  selector: 'app-situation-decadaire',
  templateUrl: './situation-decadaire.component.html',
  styleUrls: ['./situation-decadaire.component.scss']
})
export class SituationDecadaireComponent implements OnInit {
  imprimerContenuQuittance() {
    throw new Error('Method not implemented.');
  }
  transactionSelectionnee: any;
  imprimerContenuDeclaration() {
    throw new Error('Method not implemented.');
  }
  imprimerDeclaration(_t116: SituationDecadaire) {
    throw new Error('Method not implemented.');
  }
  imprimerQuittance(_t116: SituationDecadaire) {
    throw new Error('Method not implemented.');
  }

  pageData: PagedData<SituationDecadaire> = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };

  decadaireForm: FormGroup;
  isAuthorized: boolean = true;
  errorMessage: string = '';
  formSubmitted = false;
  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
  nifList: Utilisateur[] = [];
    nomenclatureList: Utilisateur[] = [];
  isAdmin: boolean = false;
  //Consultation
  isConsultation : boolean = false;

  filterednif!: Observable<Utilisateur[]>;
    filterednomenclature!: Observable<Utilisateur[]>;
  nifControl = new FormControl('', Validators.required);
    nomenclatureControl = new FormControl('', Validators.required);
  showUserList = false;
    showUserListnomenclature = false;
  isLoading: boolean = false;

  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  page: any = {
    pageNumber: 0,
    size: this.nombreElementParPage,
  };
  totalPages: number = 0;
  constructor(
    private fb: FormBuilder,
    private situationDecadaireService: SituationDecadaireService,
    private nifUtilisateurService: NifUtilisateurService,
    private datePipe: DatePipe,
  ) {
    this.decadaireForm = this.fb.group({
      nif: ['', Validators.required],
      nomenclature: ['', Validators.required],  // Rendus optionnels pour correspondre au service
      regime: [''],        // Rendus optionnels pour correspondre au service
      bureau: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    }, { validators: this.dateRangeValidator });
  

  }

  // dateRangeValidator(group: FormGroup) {
  //   const start = group.get('dateDebut')?.value;
  //   const end = group.get('dateFin')?.value;
  //   if (start && end && new Date(start) > new Date(end)) {
  //     return { dateRangeInvalid: true };
  //   }
  //   return null;
  // }




dateRangeValidator(group: FormGroup) {
  const start = group.get('dateDebut')?.value;
  const end = group.get('dateFin')?.value;
  const today = new Date();
  
  // Réinitialiser l'heure à 00:00:00 pour comparer uniquement les dates
  today.setHours(0, 0, 0, 0);
  
  const errors: any = {};
  
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Réinitialiser l'heure des dates à comparer
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Vérifier si la date de début est postérieure à la date de fin
    if (startDate > endDate) {
      errors.dateRangeInvalid = true;
    }
    
    // Vérifier si les dates sont dans le futur
    if (startDate > today) {
      errors.startDateFuture = true;
    }
    
    if (endDate > today) {
      errors.endDateFuture = true;
    }
  } else {
    // Vérifier individuellement si une seule date est fournie
    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate > today) {
        errors.startDateFuture = true;
      }
    }
    
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate > today) {
        errors.endDateFuture = true;
      }
    }
  }
  
  // Retourner null si aucune erreur, sinon retourner l'objet d'erreurs
  return Object.keys(errors).length > 0 ? errors : null;
}


  // Méthode pour récupérer les déclarations par NIF
  getAllDecadaire(nif: string, bureau: string, nomenclature: string | null, regime: string | null, dateDebut: string, dateFin: string): void {
    console.log("🔹 Données envoyées à l'API :", { nif, bureau, nomenclature, regime, dateDebut, dateFin });
    this.isLoading = true;
    // Conversion des dates au format attendu par le service
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy/MM/dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy/MM/dd');
  
    if (!formattedDateDebut || !formattedDateFin) {
      console.error("Erreur de format de date");
       this.isLoading = false;
      return;
    }

    this.situationDecadaireService.getDecadaire(
      this.page, 
      '', // key (paramètre vide comme dans votre code original)
      nif, 
      bureau, 
      nomenclature, // Maintenant correctement traité comme optionnel
      regime,       // Maintenant correctement traité comme optionnel
      formattedDateDebut,
      formattedDateFin
    )
  //   .subscribe(
  //     (pagedData: PagedData<SituationDecadaire>) => {
  //       console.log("✅ Données reçues de l'API :", pagedData);
  //       if (!pagedData?.content?.length) {
  //         console.warn("⚠️ Aucune donnée reçue !");
  //        this.errorMessage = "Aucune Situation Decadaire trouvée avec ces critères.";
  //       }else {
  //         this.errorMessage = "";
  //       }

  //       this.pageData = pagedData;
  //       this.nombreTotalEnregistrement = pagedData.totalElements;
  //        this.isLoading = false;
  //     },
  //     (error: any) => {
  //       console.error("❌ Erreur API :", error);
  //       this.errorMessage = "Erreur lors de la récupération des données.";
  //         this.isLoading = false;
  //     }
  //   );

  // }
.subscribe({
      next: (pagedData: PagedData<SituationDecadaire>) => {
        console.log("✅ Données reçues de l'API :", pagedData);
        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
        
        // Calculer le nombre total de pages
        this.totalPages = Math.ceil(this.nombreTotalEnregistrement / this.nombreElementParPage);
        
        // Générer la pagination
      //  this.generatePagination();
        
        if (!pagedData?.content?.length) {
          console.warn("⚠️ Aucune donnée reçue !");
           this.errorMessage = "Aucune declaration trouvée avec ces critères.";
        }else {
          this.errorMessage = "";
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
  console.error("❌ Erreur API :", error);

  if (error?.error?.message) {
    this.errorMessage = error.error.message;
  } else {
    this.errorMessage = "Erreur lors de la récupération des données.";
  }

  this.isLoading = false;
}
    });
  }






  // Méthode pour soumettre le formulaire
  onSubmit(): void {

    this.formSubmitted = true; 
    if (this.decadaireForm.invalid) {
      console.log("Formulaire invalide");
          this.isLoading = false;
      return;
    }
  this.isLoading = true;
    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    console.log("Valeur sélectionnée pour le NIF:", nif);
    
    // Initialiser la page à 1 lors de la soumission du formulaire
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;
      this.isLoading = true;
    // Appeler la méthode pour récupérer les données filtrées
    this.getAllDecadaire(nif, bureau, nomenclature, regime, dateDebut, dateFin);
  }

  // Méthode pour gérer la pagination
  onPageChange(page: number): void {
    this.page.pageNumber = page - 1;

    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    
    this.getAllDecadaire(nif || '', bureau || '', nomenclature, regime, dateDebut || '', dateFin || '');
  }

  // Méthode pour changer la taille de la page
  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;

    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    
    this.getAllDecadaire(nif || '', bureau || '', nomenclature, regime, dateDebut || '', dateFin || '');
  }

  // Exportation au format Excel depuis les données locales
  exportToExcel(): void {
    if (!this.pageData.content || this.pageData.content.length === 0) {
      console.warn("⚠️ Aucune donnée à exporter !");
      return;
    }
                                                            
    const worksheet = XLSX.utils.json_to_sheet(this.pageData.content);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Situation_Decadaire");

    // Générer et télécharger le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, "Situation_Decadaire.xlsx");
  }

  // Fonction pour imprimer le tableau
  printTable() {
    const printSection = document.getElementById('printable-section');
    const originalBody = document.body.innerHTML;
    
    // Cacher tout sauf la section imprimable
    document.body.innerHTML = printSection?.outerHTML || '';
  
    // Imprimer la section
    window.print();
  
    // Restauration du contenu original après l'impression
    document.body.innerHTML = originalBody;
  }

  // Fonctions de calcul des totaux
  getTotalValeur(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.valeur) || 0), 0) || 0;
  }
  
  getTotalLitrage(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.litrage15) || 0), 0) || 0;
  }
  
  getTotalDroitsTaxes(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.droitstaxes) || 0), 0) || 0;
  }
  
  // Export PDF via le service backend
  // 1. Corrigez le format des dates dans la méthode exportToPdf()
exportToPdf(): void {
  const formValues = this.decadaireForm.value;
  
  // Vérifier si le formulaire est valide
  if (this.decadaireForm.invalid) {
    console.error('Formulaire invalide');
    return;
  }
  
  this.isLoading = true;
  
  // Utiliser un format de date standard uniforme "yyyy-MM-dd"
  const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
  const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
  
  console.log(`Envoi des dates: début=${dateDebut}, fin=${dateFin}`);
  
  // Vérifier que les dates ne sont pas nulles
  if (!dateDebut || !dateFin) {
    console.error('Erreur lors du formatage des dates');
    this.isLoading = false;
    return;
  }
  
  // Appel du service avec gestion d'erreur améliorée
  this.situationDecadaireService.exportToPdf(
    dateDebut,
    dateFin,
    formValues.nif || '',
    formValues.nomenclature || '',
    formValues.bureau || '',
    formValues.regime || ''
  ).subscribe({
    next: (blob: Blob) => {
      // Vérifier que le blob est valide
      if (blob.size === 0) {
        console.error('Le PDF généré est vide');
        this.isLoading = false;
        alert('Le rapport généré est vide. Veuillez vérifier les paramètres et réessayer.');
        return;
      }
      
      console.log('PDF généré avec succès, taille:', blob.size);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RapportDouanier_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    },
    error: (error: any) => {
      console.error('Erreur lors de l\'export PDF:', error);
      // Détails supplémentaires sur l'erreur
      if (error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Réponse erreur:', reader.result);
        };
        reader.readAsText(error.error);
      }
      this.isLoading = false;
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  });
}

// 2. Appliquez la même logique à la méthode exportToExcel1()
exportToExcel1(): void {
  const formValues = this.decadaireForm.value;
  
  // Vérifier si le formulaire est valide
  if (this.decadaireForm.invalid) {
    console.error('Formulaire invalide');
    return;
  }
  
  this.isLoading = true;
  
  // Utiliser le même format de date que pour le PDF
  const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
  const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
  
  console.log(`Envoi des dates Excel: début=${dateDebut}, fin=${dateFin}`);
  
  if (!dateDebut || !dateFin) {
    console.error('Erreur lors du formatage des dates');
    this.isLoading = false;
    return;
  }
  
  this.situationDecadaireService.exportToExcel(
    dateDebut,
    dateFin,
    formValues.nif || '',
    formValues.nomenclature || '',
    formValues.bureau || '',
    formValues.regime || ''
  ).subscribe({
    next: (blob: Blob) => {
      console.log("Blob Excel reçu, type:", blob.type, "taille:", blob.size);
      if (blob.size === 0) {
        console.error('Le fichier Excel généré est vide');
        this.isLoading = false;
        alert('Le rapport Excel généré est vide. Veuillez vérifier les paramètres et réessayer.');
        return;
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RapportDouanier_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    },
    error: (error: any) => {
      console.error('Erreur lors de l\'export Excel:', error);
      if (error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Réponse erreur Excel:', reader.result);
        };
        reader.readAsText(error.error);
      }
      this.isLoading = false;
      alert('Erreur lors de la génération du fichier Excel. Veuillez réessayer.');
    }
  });
}

  ngOnInit(): void {
    // Initialisation de la pagination
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    this.pageData.page = this.page;
    
    // Récupérer le rôle
    const role = sessionStorage.getItem("role");
    this.isAdmin = role?.includes("admin") ?? false;

    //Récupérer le Consultant Ak
    const roleC = sessionStorage.getItem("role");
    this.isConsultation = roleC?.includes("consultation") ?? false;
    
    // Charger la première page de NIF au démarrage
    this.getAllnif(0, 10);  // page 0, taille 10 (ajustez selon vos besoins)
  
    // Configuration de la recherche auto NIF dynamique
    this.filterednif = this.nifControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.length >= 2) {
          return this.nifUtilisateurService.getAlle(value);
        } else {
          return of([]);
        }
      })
    );

     this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.length >= 2) {
          return this.nifUtilisateurService.getAllnomclature(value);
        } else {
          return of([]);
        }
      })
    );
  }

  getAllnif(page: number, size: number): void {
    this.isLoading = true;
    this.nifUtilisateurService.getAlle('nif', page, size).subscribe({
      next: (list: Utilisateur[]) => {
        this.nifList = list;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des NIFs', error);
        this.errorMessage = "Erreur lors du chargement des NIFs.";
        this.isLoading = false;
      }
    });
  }




  
  getAllnomenclature(page: number, size: number): void {
    this.isLoading = true;
    this.nifUtilisateurService.getAllnomclature('nomenclature', page, size).subscribe({
      next: (list: Utilisateur[]) => {
        this.nomenclatureList = list;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des nomenclature', error);
        this.errorMessage = "Erreur lors du chargement des nomenclature.";
        this.isLoading = false;
      }
    });
  }

  initFilter(): void {
    this.filterednif = this.nifControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this.filterUsers(value);
        }
        return this.filterUsers('');
      })
    );
this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return this.nifUtilisateurService.getAllnomclature(value, 0, 10); // recherche dynamique
      } else {
        return of([]); // vide si pas de valeur
      }
    })
  );

  }

  private filterUsers(value: string): Utilisateur[] {
    const filterValue = value.toLowerCase();
    return this.nifList.filter(user => user.nif.toLowerCase().includes(filterValue));
  }

   private filterUserse(value: string): Utilisateur[] {
    const filterValue = value.toLowerCase();
    return this.nomenclatureList.filter(user => user.nif.toLowerCase().includes(filterValue));
  }


  // Renseigner le champ NIF à partir de la sélection
  setSelectedUser(nifUtilisateur: Utilisateur): void {
    this.decadaireForm.patchValue({ nif: nifUtilisateur.nif });
    this.nifControl.setValue(nifUtilisateur.nif);
    this.showUserList = false;
  }

    setSelectednomenclature(nomenclatureUtilisateur: Utilisateur): void {
    this.decadaireForm.patchValue({ nomenclature: nomenclatureUtilisateur.nomenclature });
    this.nomenclatureControl.setValue(nomenclatureUtilisateur.nomenclature);
    this.showUserListnomenclature = false;
  }


  // Affiche la liste des suggestions au focus
  showUsersList(): void {
    this.showUserList = true;
  }

    //Affiche la liste des suggestions au focus
  showUsersListnomenclature(): void {
    this.showUserListnomenclature = true;
  }

  // Cache la liste si on clique en dehors
  closeUserList(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
    else if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserListnomenclature = false;
    }
  }

  

  // Méthode d'exportation PDF locale
  generatePDF() {
    this.isLoading = true;
    
    const printSection = document.getElementById('printable-section');
    
    if (printSection) {
      printSection.classList.remove('d-none');
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      };
      
      html2canvas(printSection, options).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Générer le nom de fichier avec la date
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `Rapport_Douanier_${dateStr}.pdf`;
        
        pdf.save(fileName);
        
        printSection.classList.add('d-none');
        this.isLoading = false;
      });
    }
  }

  // Version améliorée avec pagination automatique pour longs rapports
  generatePDFWithPagination() {
    this.isLoading = true;
    
    const printSection = document.getElementById('printable-section');
    
    if (printSection) {
      printSection.classList.remove('d-none');
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true
      };
      
      html2canvas(printSection, options).then(canvas => {
        const imgWidth = 190; // Marge de 10mm sur chaque côté
        const pageHeight = 287;  // A4 height in mm (297mm) moins marges
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Titre du document
        pdf.setFontSize(16);
        pdf.text('Bulletin Global Décadaire', 105, 15, { align: 'center' });
        
        // Informations du formulaire
        pdf.setFontSize(10);
        pdf.text(`Bureau: ${this.decadaireForm.value.bureau || '-'}`, 15, 25);
        pdf.text(`NIF: ${this.decadaireForm.value.nif || '-'}`, 105, 25);
        pdf.text(`Période: du ${this.datePipe.transform(this.decadaireForm.value.dateDebut, 'dd/MM/yyyy') || '-'} au ${this.datePipe.transform(this.decadaireForm.value.dateFin, 'dd/MM/yyyy') || '-'}`, 15, 30);
        
        // Ajout de l'image avec pagination
        let position = 40; // Position après l'en-tête
        
        // Première page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        
        // Pages suivantes si nécessaire
        let heightLeft = imgHeight - (pageHeight - position);
        let page = 1;
        
        while (heightLeft > 0) {
          position = 10; // Nouvelle page commence plus haut
          page++;
          
          // Ajouter une nouvelle page
          pdf.addPage();
          pdf.setFontSize(8);
          pdf.text(`Page ${page}`, 190, 5, { align: 'right' });
          
          // Continuer l'image
          pdf.addImage(
            imgData, 
            'PNG', 
            10, 
            -(pageHeight * (page - 1)) + position + 30, 
            imgWidth, 
            imgHeight
          );
          
          heightLeft -= pageHeight;
        }
        
        // Numéroter la première page aussi
        pdf.setPage(1);
        pdf.setFontSize(8);
        pdf.text(`Page 1`, 190, 5, { align: 'right' });
        
        // Ajouter pied de page avec date
        const dateStr = new Date().toLocaleDateString();
        pdf.setPage(page);
        pdf.setFontSize(8);
        pdf.text(`Généré le ${dateStr}`, 105, 287, { align: 'center' });
        
        // Sauvegarder le PDF
        pdf.save(`Rapport_Douanier_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        printSection.classList.add('d-none');
        this.isLoading = false;
      });
    }
  }

  // Méthode pour exporter avec des signatures
  exportToPdfWithSignatures() {
    this.isLoading = true;
    
    const formValues = this.decadaireForm.value;
    
    if (this.decadaireForm.invalid) {
      this.isLoading = false;
      return;
    }
    
    // Formater les dates au format attendu par l'API (yyyy/MM/dd)
    const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
    const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
    
    if (!dateDebut || !dateFin) {
      console.error("Erreur de format de date");
      this.isLoading = false;
      return;
    }
    
    this.situationDecadaireService.exportToPdf(
      dateDebut,
      dateFin,
      formValues.nif || '',
      formValues.nomenclature || '',
      formValues.bureau || '',
      formValues.regime || ''
    ).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rapport_Douanier_${new Date().toISOString().slice(0, 10)}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'export PDF:', error);
        // Repli sur la génération locale en cas d'erreur du backend
        this.generatePDFWithPagination();
        this.isLoading = false;
      }
    });
  }
}


/*import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NifUtilisateur } from '../../models/nif-utilisateur';
import { PagedData } from '../../models/paged-data';
import { SituationDecadaire } from '../../models/situation-decadaire';
import { NifUtilisateurService } from '../../services/nif-utilisateur.service';
import { SituationDecadaireService } from '../../services/situation-decadaire.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Utilisateur } from '../../models/Utilisateur';

@Component({
  selector: 'app-situation-decadaire',
  templateUrl: './situation-decadaire.component.html',
  styleUrls: ['./situation-decadaire.component.scss']
})
export class SituationDecadaireComponent implements OnInit {
  imprimerContenuQuittance() {
    throw new Error('Method not implemented.');
  }
  transactionSelectionnee: any;
  imprimerContenuDeclaration() {
    throw new Error('Method not implemented.');
  }
  imprimerDeclaration(_t116: SituationDecadaire) {
    throw new Error('Method not implemented.');
  }
  imprimerQuittance(_t116: SituationDecadaire) {
    throw new Error('Method not implemented.');
  }

  pageData: PagedData<SituationDecadaire> = { content: [], pageNumber: 0, pageSize: 0, totalElements: 0 };

  decadaireForm: FormGroup;
  isAuthorized: boolean = true;
  errorMessage: string = '';
  formSubmitted = false;
  pageSelectionne: number = 1;
  nombreElementParPage: number = 5;
  nombreTotalEnregistrement: number = 0;
  nifList: Utilisateur[] = [];
    nomenclatureList: Utilisateur[] = [];
  isAdmin: boolean = false;
  //Consultation
  isConsultation : boolean = false;

  filterednif!: Observable<Utilisateur[]>;
    filterednomenclature!: Observable<Utilisateur[]>;
  nifControl = new FormControl('', Validators.required);
    nomenclatureControl = new FormControl('', Validators.required);
  showUserList = false;
    showUserListnomenclature = false;
  isLoading: boolean = false;

  @ViewChild('userDropdown', { static: false }) userDropdown!: ElementRef;

  page: any = {
    pageNumber: 0,
    size: this.nombreElementParPage,
  };

  constructor(
    private fb: FormBuilder,
    private situationDecadaireService: SituationDecadaireService,
    private nifUtilisateurService: NifUtilisateurService,
    private datePipe: DatePipe,
  ) {
    this.decadaireForm = this.fb.group({
      nif: ['', Validators.required],
      nomenclature: ['', Validators.required],  // Rendus optionnels pour correspondre au service
      regime: [''],        // Rendus optionnels pour correspondre au service
      bureau: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    }, { validators: this.dateRangeValidator });
  

  }


dateRangeValidator(group: FormGroup) {
  const start = group.get('dateDebut')?.value;
  const end = group.get('dateFin')?.value;
  const today = new Date();
  
  // Réinitialiser l'heure à 00:00:00 pour comparer uniquement les dates
  today.setHours(0, 0, 0, 0);
  
  const errors: any = {};
  
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Réinitialiser l'heure des dates à comparer
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Vérifier si la date de début est postérieure à la date de fin
    if (startDate > endDate) {
      errors.dateRangeInvalid = true;
    }
    
    // Vérifier si les dates sont dans le futur
    if (startDate > today) {
      errors.startDateFuture = true;
    }
    
    if (endDate > today) {
      errors.endDateFuture = true;
    }
  } else {
    // Vérifier individuellement si une seule date est fournie
    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate > today) {
        errors.startDateFuture = true;
      }
    }
    
    if (end) {
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
      
      if (endDate > today) {
        errors.endDateFuture = true;
      }
    }
  }
  
  // Retourner null si aucune erreur, sinon retourner l'objet d'erreurs
  return Object.keys(errors).length > 0 ? errors : null;
}


  // Méthode pour récupérer les déclarations par NIF
  getAllDecadaire(nif: string, bureau: string, nomenclature: string | null, regime: string | null, dateDebut: string, dateFin: string): void {
    console.log("🔹 Données envoyées à l'API :", { nif, bureau, nomenclature, regime, dateDebut, dateFin });
    this.isLoading = true;
    // Conversion des dates au format attendu par le service
    const formattedDateDebut = this.datePipe.transform(dateDebut, 'yyyy/MM/dd');
    const formattedDateFin = this.datePipe.transform(dateFin, 'yyyy/MM/dd');
  
    if (!formattedDateDebut || !formattedDateFin) {
      console.error("Erreur de format de date");
       this.isLoading = false;
      return;
    }

    this.situationDecadaireService.getDecadaire(
      this.page, 
      '', // key (paramètre vide comme dans votre code original)
      nif, 
      bureau, 
      nomenclature, // Maintenant correctement traité comme optionnel
      regime,       // Maintenant correctement traité comme optionnel
      formattedDateDebut,
      formattedDateFin
    ).subscribe(
      (pagedData: PagedData<SituationDecadaire>) => {
        console.log("✅ Données reçues de l'API :", pagedData);
        if (!pagedData?.content?.length) {
          console.warn("⚠️ Aucune donnée reçue !");
         this.errorMessage = "Aucune Situation Decadaire trouvée avec ces critères.";
        }else {
          this.errorMessage = "";
        }

        this.pageData = pagedData;
        this.nombreTotalEnregistrement = pagedData.totalElements;
         this.isLoading = false;
      },

(error: any) => {
  console.error("❌ Erreur API :", error);

  if (error?.error?.message) {
    this.errorMessage = error.error.message;
  } else {
    this.errorMessage = "Erreur lors de la récupération des données.";
  }

  this.isLoading = false;
}

    );
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {

    this.formSubmitted = true; 
    if (this.decadaireForm.invalid) {
      console.log("Formulaire invalide");
          this.isLoading = false;
      return;
    }
  this.isLoading = true;
    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    console.log("Valeur sélectionnée pour le NIF:", nif);
    
    // Initialiser la page à 1 lors de la soumission du formulaire
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;
      this.isLoading = true;
    // Appeler la méthode pour récupérer les données filtrées
    this.getAllDecadaire(nif, bureau, nomenclature, regime, dateDebut, dateFin);
  }

  // Méthode pour gérer la pagination
  onPageChange(page: number): void {
    this.page.pageNumber = page - 1;

    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    
    this.getAllDecadaire(nif || '', bureau || '', nomenclature, regime, dateDebut || '', dateFin || '');
  }

  // Méthode pour changer la taille de la page
  onPageSizeChange(): void {
    this.page.size = this.nombreElementParPage;
    this.page.pageNumber = 0;
    this.pageSelectionne = 1;

    const { nif, bureau, nomenclature, regime, dateDebut, dateFin } = this.decadaireForm.value;
    
    this.getAllDecadaire(nif || '', bureau || '', nomenclature, regime, dateDebut || '', dateFin || '');
  }

  // Exportation au format Excel depuis les données locales
  exportToExcel(): void {
    if (!this.pageData.content || this.pageData.content.length === 0) {
      console.warn("⚠️ Aucune donnée à exporter !");
      return;
    }
                                                            
    const worksheet = XLSX.utils.json_to_sheet(this.pageData.content);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Situation_Decadaire");

    // Générer et télécharger le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, "Situation_Decadaire.xlsx");
  }

  // Fonction pour imprimer le tableau
  printTable() {
    const printSection = document.getElementById('printable-section');
    const originalBody = document.body.innerHTML;
    
    // Cacher tout sauf la section imprimable
    document.body.innerHTML = printSection?.outerHTML || '';
  
    // Imprimer la section
    window.print();
  
    // Restauration du contenu original après l'impression
    document.body.innerHTML = originalBody;
  }

  // Fonctions de calcul des totaux
  getTotalValeur(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.valeur) || 0), 0) || 0;
  }
  
  getTotalLitrage(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.litrage15) || 0), 0) || 0;
  }
  
  getTotalDroitsTaxes(): number {
    return this.pageData?.content?.reduce((sum, transaction) => sum + (Number(transaction?.droitstaxes) || 0), 0) || 0;
  }
  
  // Export PDF via le service backend
  // 1. Corrigez le format des dates dans la méthode exportToPdf()
exportToPdf(): void {
  const formValues = this.decadaireForm.value;
  
  // Vérifier si le formulaire est valide
  if (this.decadaireForm.invalid) {
    console.error('Formulaire invalide');
    return;
  }
  
  this.isLoading = true;
  
  // Utiliser un format de date standard uniforme "yyyy-MM-dd"
  const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
  const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
  
  console.log(`Envoi des dates: début=${dateDebut}, fin=${dateFin}`);
  
  // Vérifier que les dates ne sont pas nulles
  if (!dateDebut || !dateFin) {
    console.error('Erreur lors du formatage des dates');
    this.isLoading = false;
    return;
  }
  
  // Appel du service avec gestion d'erreur améliorée
  this.situationDecadaireService.exportToPdf(
    dateDebut,
    dateFin,
    formValues.nif || '',
    formValues.nomenclature || '',
    formValues.bureau || '',
    formValues.regime || ''
  ).subscribe({
    next: (blob: Blob) => {
      // Vérifier que le blob est valide
      if (blob.size === 0) {
        console.error('Le PDF généré est vide');
        this.isLoading = false;
        alert('Le rapport généré est vide. Veuillez vérifier les paramètres et réessayer.');
        return;
      }
      
      console.log('PDF généré avec succès, taille:', blob.size);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RapportDouanier_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    },
    error: (error: any) => {
      console.error('Erreur lors de l\'export PDF:', error);
      // Détails supplémentaires sur l'erreur
      if (error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Réponse erreur:', reader.result);
        };
        reader.readAsText(error.error);
      }
      this.isLoading = false;
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
  });
}

// 2. Appliquez la même logique à la méthode exportToExcel1()
exportToExcel1(): void {
  const formValues = this.decadaireForm.value;
  
  // Vérifier si le formulaire est valide
  if (this.decadaireForm.invalid) {
    console.error('Formulaire invalide');
    return;
  }
  
  this.isLoading = true;
  
  // Utiliser le même format de date que pour le PDF
  const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
  const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
  
  console.log(`Envoi des dates Excel: début=${dateDebut}, fin=${dateFin}`);
  
  if (!dateDebut || !dateFin) {
    console.error('Erreur lors du formatage des dates');
    this.isLoading = false;
    return;
  }
  
  this.situationDecadaireService.exportToExcel(
    dateDebut,
    dateFin,
    formValues.nif || '',
    formValues.nomenclature || '',
    formValues.bureau || '',
    formValues.regime || ''
  ).subscribe({
    next: (blob: Blob) => {
      console.log("Blob Excel reçu, type:", blob.type, "taille:", blob.size);
      if (blob.size === 0) {
        console.error('Le fichier Excel généré est vide');
        this.isLoading = false;
        alert('Le rapport Excel généré est vide. Veuillez vérifier les paramètres et réessayer.');
        return;
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RapportDouanier_${new Date().toISOString().slice(0, 10)}.lsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    },
    error: (error: any) => {
      console.error('Erreur lors de l\'export Excel:', error);
      if (error.error instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Réponse erreur Excel:', reader.result);
        };
        reader.readAsText(error.error);
      }
      this.isLoading = false;
      alert('Erreur lors de la génération du fichier Excel. Veuillez réessayer.');
    }
  });
}

  ngOnInit(): void {
    // Initialisation de la pagination
    this.page.pageNumber = 0;
    this.page.size = this.nombreElementParPage;
    this.pageData.page = this.page;
    
    // Récupérer le rôle
    const role = sessionStorage.getItem("role");
    this.isAdmin = role?.includes("admin") ?? false;

    //Récupérer le Consultant Ak
    const roleC = sessionStorage.getItem("role");
    this.isConsultation = roleC?.includes("consultation") ?? false;
    
    // Charger la première page de NIF au démarrage
    this.getAllnif(0, 10);  // page 0, taille 10 (ajustez selon vos besoins)
  
    // Configuration de la recherche auto NIF dynamique
    this.filterednif = this.nifControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.length >= 2) {
          return this.nifUtilisateurService.getAlle(value);
        } else {
          return of([]);
        }
      })
    );

     this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'string' && value.length >= 2) {
          return this.nifUtilisateurService.getAllnomclature(value);
        } else {
          return of([]);
        }
      })
    );
  }

  getAllnif(page: number, size: number): void {
    this.isLoading = true;
    this.nifUtilisateurService.getAlle('nif', page, size).subscribe({
      next: (list: Utilisateur[]) => {
        this.nifList = list;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des NIFs', error);
        this.errorMessage = "Erreur lors du chargement des NIFs.";
        this.isLoading = false;
      }
    });
  }




  
  getAllnomenclature(page: number, size: number): void {
    this.isLoading = true;
    this.nifUtilisateurService.getAllnomclature('nomenclature', page, size).subscribe({
      next: (list: Utilisateur[]) => {
        this.nomenclatureList = list;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des nomenclature', error);
        this.errorMessage = "Erreur lors du chargement des nomenclature.";
        this.isLoading = false;
      }
    });
  }

  initFilter(): void {
    this.filterednif = this.nifControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this.filterUsers(value);
        }
        return this.filterUsers('');
      })
    );
this.filterednomenclature = this.nomenclatureControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => {
      if (typeof value === 'string' && value.trim().length > 0) {
        return this.nifUtilisateurService.getAllnomclature(value, 0, 10); // recherche dynamique
      } else {
        return of([]); // vide si pas de valeur
      }
    })
  );

  }

  private filterUsers(value: string): Utilisateur[] {
    const filterValue = value.toLowerCase();
    return this.nifList.filter(user => user.nif.toLowerCase().includes(filterValue));
  }

   private filterUserse(value: string): Utilisateur[] {
    const filterValue = value.toLowerCase();
    return this.nomenclatureList.filter(user => user.nif.toLowerCase().includes(filterValue));
  }


  // Renseigner le champ NIF à partir de la sélection
  setSelectedUser(nifUtilisateur: Utilisateur): void {
    this.decadaireForm.patchValue({ nif: nifUtilisateur.nif });
    this.nifControl.setValue(nifUtilisateur.nif);
    this.showUserList = false;
  }

    setSelectednomenclature(nomenclatureUtilisateur: Utilisateur): void {
    this.decadaireForm.patchValue({ nomenclature: nomenclatureUtilisateur.nomenclature });
    this.nomenclatureControl.setValue(nomenclatureUtilisateur.nomenclature);
    this.showUserListnomenclature = false;
  }


  // Affiche la liste des suggestions au focus
  showUsersList(): void {
    this.showUserList = true;
  }

    //Affiche la liste des suggestions au focus
  showUsersListnomenclature(): void {
    this.showUserListnomenclature = true;
  }

  // Cache la liste si on clique en dehors
  closeUserList(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
    else if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserListnomenclature = false;
    }
  }

  

  // Méthode d'exportation PDF locale
  generatePDF() {
    this.isLoading = true;
    
    const printSection = document.getElementById('printable-section');
    
    if (printSection) {
      printSection.classList.remove('d-none');
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      };
      
      html2canvas(printSection, options).then(canvas => {
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Générer le nom de fichier avec la date
        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `Rapport_Douanier_${dateStr}.pdf`;
        
        pdf.save(fileName);
        
        printSection.classList.add('d-none');
        this.isLoading = false;
      });
    }
  }

  // Version améliorée avec pagination automatique pour longs rapports
  generatePDFWithPagination() {
    this.isLoading = true;
    
    const printSection = document.getElementById('printable-section');
    
    if (printSection) {
      printSection.classList.remove('d-none');
      
      const options = {
        scale: 2,
        useCORS: true,
        allowTaint: true
      };
      
      html2canvas(printSection, options).then(canvas => {
        const imgWidth = 190; // Marge de 10mm sur chaque côté
        const pageHeight = 287;  // A4 height in mm (297mm) moins marges
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        
        // Titre du document
        pdf.setFontSize(16);
        pdf.text('Bulletin Global Décadaire', 105, 15, { align: 'center' });
        
        // Informations du formulaire
        pdf.setFontSize(10);
        pdf.text(`Bureau: ${this.decadaireForm.value.bureau || '-'}`, 15, 25);
        pdf.text(`NIF: ${this.decadaireForm.value.nif || '-'}`, 105, 25);
        pdf.text(`Période: du ${this.datePipe.transform(this.decadaireForm.value.dateDebut, 'dd/MM/yyyy') || '-'} au ${this.datePipe.transform(this.decadaireForm.value.dateFin, 'dd/MM/yyyy') || '-'}`, 15, 30);
        
        // Ajout de l'image avec pagination
        let position = 40; // Position après l'en-tête
        
        // Première page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        
        // Pages suivantes si nécessaire
        let heightLeft = imgHeight - (pageHeight - position);
        let page = 1;
        
        while (heightLeft > 0) {
          position = 10; // Nouvelle page commence plus haut
          page++;
          
          // Ajouter une nouvelle page
          pdf.addPage();
          pdf.setFontSize(8);
          pdf.text(`Page ${page}`, 190, 5, { align: 'right' });
          
          // Continuer l'image
          pdf.addImage(
            imgData, 
            'PNG', 
            10, 
            -(pageHeight * (page - 1)) + position + 30, 
            imgWidth, 
            imgHeight
          );
          
          heightLeft -= pageHeight;
        }
        
        // Numéroter la première page aussi
        pdf.setPage(1);
        pdf.setFontSize(8);
        pdf.text(`Page 1`, 190, 5, { align: 'right' });
        
        // Ajouter pied de page avec date
        const dateStr = new Date().toLocaleDateString();
        pdf.setPage(page);
        pdf.setFontSize(8);
        pdf.text(`Généré le ${dateStr}`, 105, 287, { align: 'center' });
        
        // Sauvegarder le PDF
        pdf.save(`Rapport_Douanier_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        printSection.classList.add('d-none');
        this.isLoading = false;
      });
    }
  }

  // Méthode pour exporter avec des signatures
  exportToPdfWithSignatures() {
    this.isLoading = true;
    
    const formValues = this.decadaireForm.value;
    
    if (this.decadaireForm.invalid) {
      this.isLoading = false;
      return;
    }
    
    // Formater les dates au format attendu par l'API (yyyy/MM/dd)
    const dateDebut = this.datePipe.transform(formValues.dateDebut, 'yyyy/MM/dd');
    const dateFin = this.datePipe.transform(formValues.dateFin, 'yyyy/MM/dd');
    
    if (!dateDebut || !dateFin) {
      console.error("Erreur de format de date");
      this.isLoading = false;
      return;
    }
    
    this.situationDecadaireService.exportToPdf(
      dateDebut,
      dateFin,
      formValues.nif || '',
      formValues.nomenclature || '',
      formValues.bureau || '',
      formValues.regime || ''
    ).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rapport_Douanier_${new Date().toISOString().slice(0, 10)}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'export PDF:', error);
        // Repli sur la génération locale en cas d'erreur du backend
        this.generatePDFWithPagination();
        this.isLoading = false;
      }
    });
  }
}
*/




