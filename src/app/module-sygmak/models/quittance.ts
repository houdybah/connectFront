export class Quittance {
  
cmp_con_cod: string = "";  
  nif: string = "";  
    // ========== PROPRIÉTÉS PRINCIPALES (Base de données Oracle) ==========
    
    // Codes et identifiants principaux
    dec_cod: string = "";              // Code déclaration (Oracle format)
    dec_NAM: string = "";              // Nom déclaration
    ide_CUO_COD: string = "";          // Code bureau de douane (Oracle format)
    ide_reg_dat: string = "";          // Date d'enregistrement
    ide_rcp_dat: string = "";          // Date de réception
    ide_ast_dat: string = "";          // Date d'assiette
    
    // ========== PROPRIÉTÉS STANDARDISÉES (API Backend) ==========
    
    // Propriétés utilisées par le contrôleur Spring Boot
    bureau: string = "";               // Code bureau (paramètre API: bureau)
    annee: number | string = "";       // Année (paramètre API: annee)
    code: string = "";                 // Code déclaration (paramètre API: code)
    serie: string = "";                // Série liquidation (paramètre API: serie)
    numero: string = "";               // Numéro liquidation (paramètre API: numero)
    
    // ========== PROPRIÉTÉS DE COMPATIBILITÉ (Ancien système) ==========
    
    // Anciennes propriétés conservées pour rétrocompatibilité
    codDec: string = "";               // Ancien: code déclaration
    serliq: string = "";               // Ancien: série liquidation
    numliq: string = "";               // Ancien: numéro liquidation
    
    // Propriétés format Sydonia/Oracle
    ideCuoCod: string = "";            // Format Sydonia: IDE_CUO_COD
    decCod: string = "";               // Format Sydonia: DEC_COD
    ideAstSer: string = "";            // Format Sydonia: IDE_AST_SER
    ideAstNbr: string = "";            // Format Sydonia: IDE_AST_NBR
    decRefYer: string = "";            // Format Sydonia: DEC_REF_YER
    CMP_CON_COD: string = ""; 
    // ========== PROPRIÉTÉS MÉTIER ==========
    
    // Informations bureau et organisation
    ideCuoNam: string = "";            // Nom du bureau de douane
    
    // Informations déclaration et liquidation
    liquidation: string = "";          // Référence liquidation
    quittance: string = "";            // Référence quittance
    enregistrement: string = "";       // Référence enregistrement
    ideRcpDat: string = "";            // Date réception formatée
    
    // Informations entreprise et déclarant
    cmpConCod: string = "";            // Code entreprise/déclarant
    
    // Informations fiscales
    taxCod: string = "";               // Code taxe
    totalTaxAmt: string = "";          // Montant total taxes
    totalFinAmtTbp: string = "";       // Montant financier total
    typeCombination: string = "";      // Type de combinaison fiscale
    
    // Informations paiement
    modePayement: string = "";         // Mode de paiement
    bnk: string = "";                  // Banque
    ref: string = "";                  // Référence paiement
    cod: string = "";                  // Code paiement
    
    // Autres références
    codeDec: string = "";              // Code déclaration (autre format)
    ideYea: string = "";               // Année (format IDE)
    decRefNbr: string = "";            // Numéro référence déclaration
    
    // ========== MÉTHODES DE SYNCHRONISATION ==========
    
    /**
     * Synchronise toutes les propriétés entre les différents formats
     * Cette méthode assure la cohérence entre les anciens et nouveaux noms
     */
    syncProperties(): void {
      // 1. Synchronisation BUREAU
      this.synchronizeBureau();
      
      // 2. Synchronisation ANNÉE
      this.synchronizeAnnee();
      
      // 3. Synchronisation CODE DÉCLARATION
      this.synchronizeCode();
      
      // 4. Synchronisation SÉRIE
      this.synchronizeSerie();
      
      // 5. Synchronisation NUMÉRO
      this.synchronizeNumero();
    }
    
    /**
     * Synchronise les codes bureau entre tous les formats
     */
    private synchronizeBureau(): void {
      const values = [this.bureau, this.ideCuoCod, this.ide_CUO_COD].filter(v => v && v.toString().trim());
      const primaryValue = values[0] || "";
      
      if (primaryValue) {
        this.bureau = primaryValue;
        this.ideCuoCod = primaryValue;
        this.ide_CUO_COD = primaryValue;
      }
    }
    
    /**
     * Synchronise les années entre tous les formats
     */
    private synchronizeAnnee(): void {
      const values = [this.annee, this.decRefYer, this.ideYea].filter(v => v && v.toString().trim());
      const primaryValue = values[0] || "";
      
      if (primaryValue) {
        this.annee = primaryValue;
        this.decRefYer = primaryValue.toString();
        this.ideYea = primaryValue.toString();
      }
    }
    
    /**
     * Synchronise les codes déclaration entre tous les formats
     */
    private synchronizeCode(): void {
      const values = [this.code, this.decCod, this.dec_cod, this.codDec, this.codeDec].filter(v => v && v.toString().trim());
      const primaryValue = values[0] || "";
      
      if (primaryValue) {
        this.code = primaryValue;
        this.decCod = primaryValue;
        this.dec_cod = primaryValue;
        this.codDec = primaryValue;
        this.codeDec = primaryValue;
      }
    }
    
    /**
     * Synchronise les séries entre tous les formats
     */
    private synchronizeSerie(): void {
      const values = [this.serie, this.ideAstSer, this.serliq].filter(v => v && v.toString().trim());
      const primaryValue = values[0] || "";
      
      if (primaryValue) {
        this.serie = primaryValue;
        this.ideAstSer = primaryValue;
        this.serliq = primaryValue;
      }
    }
    
    /**
     * Synchronise les numéros entre tous les formats
     */
    private synchronizeNumero(): void {
      const values = [this.numero, this.ideAstNbr, this.numliq].filter(v => v && v.toString().trim());
      const primaryValue = values[0] || "";
      
      if (primaryValue) {
        this.numero = primaryValue;
        this.ideAstNbr = primaryValue;
        this.numliq = primaryValue;
      }
    }
    
    // ========== MÉTHODES UTILITAIRES ==========
    
    /**
     * Retourne les paramètres API standardisés pour le backend
     */
    getApiParams(): { bureau: string, annee: number, code: string, serie: string, numero: string } {
      this.syncProperties();
      
      return {
        
        bureau: this.bureau || this.ideCuoCod || this.ide_CUO_COD || "",
        annee: this.parseYear(),
        code: this.code || this.decCod || this.dec_cod || this.codDec || "",
        serie: this.serie || this.ideAstSer || this.serliq || "",
        numero: this.numero || this.ideAstNbr || this.numliq || ""
      };
    }
    
    /**
     * Parse l'année en tant que nombre
     */
    private parseYear(): number {
      const yearValue = this.annee || this.decRefYer || this.ideYea || new Date().getFullYear().toString();
      const parsed = parseInt(yearValue.toString());
      return isNaN(parsed) ? new Date().getFullYear() : parsed;
    }
    
    /**
     * Valide que tous les champs obligatoires sont présents
     */
    isValid(): boolean {
      const params = this.getApiParams();
      return !!(params.bureau && params.annee && params.code && params.serie && params.numero);
    }
    
    /**
     * Retourne les erreurs de validation
     */
    getValidationErrors(): string[] {
      const errors: string[] = [];
      const params = this.getApiParams();
      
      if (!params.bureau) errors.push("Bureau manquant");
      if (!params.annee || params.annee < 2000 || params.annee > 2050) errors.push("Année invalide");
      if (!params.code) errors.push("Code déclaration manquant");
      if (!params.serie) errors.push("Série manquante");
      if (!params.numero) errors.push("Numéro manquant");
      
      return errors;
    }
    
    /**
     * Retourne une représentation string unique de la quittance
     */
    getUniqueKey(): string {
      const params = this.getApiParams();
      return `${params.bureau}_${params.annee}_${params.code}_${params.serie}_${params.numero}`;
    }
    
    /**
     * Retourne un nom de fichier suggéré pour le PDF
     */
    getSuggestedFilename(): string {
      const params = this.getApiParams();
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      return `quittance_${params.bureau}_${params.annee}_${params.code}_${params.serie}_${params.numero}_${date}.pdf`;
    }
    
    /**
     * Retourne une description lisible de la quittance
     */
    getDisplayName(): string {
      const params = this.getApiParams();
      return `Quittance ${params.bureau} ${params.annee} - ${params.code}/${params.serie}/${params.numero}`;
    }
    
    /**
     * Clone la quittance avec toutes ses propriétés
     */
    clone(): Quittance {
      return new Quittance(JSON.parse(JSON.stringify(this)));
    }
    
    /**
     * Met à jour les propriétés à partir d'un objet partiel
     */
    updateFrom(data: Partial<Quittance>): void {
      Object.assign(this, data);
      this.syncProperties();
    }
    
    // ========== MÉTHODES DE FORMATAGE ==========
    
    /**
     * Formate le montant total pour affichage
     */
    getFormattedAmount(): string {
      const amount = parseFloat(this.totalFinAmtTbp || this.totalTaxAmt || "0");
      if (isNaN(amount)) return "N/A";
      
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'GNF',
        minimumFractionDigits: 0
      }).format(amount);
    }
    
    /**
     * Formate la date de réception pour affichage
     */
    getFormattedDate(): string {
      const dateStr = this.ide_rcp_dat || this.ideRcpDat;
      if (!dateStr) return "N/A";
      
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR');
      } catch {
        return dateStr;
      }
    }
    
    /**
     * Retourne le nom complet du bureau
     */
    getBureauFullName(): string {
      const code = this.bureau || this.ideCuoCod || this.ide_CUO_COD;
      const name = this.ideCuoNam;
      
      if (name) {
        return `${code} - ${name}`;
      }
      
      // Noms par défaut selon le code bureau
      const defaultNames: { [key: string]: string } = {
        'GNB02': 'Bureau de Conakry Port',
        'GNB04': 'Bureau de Conakry Aéroport',
        'GNB10': 'Bureau de Conakry Ville',
        'CNK': 'Bureau de Conakry',
        'KAN': 'Bureau de Kankan',
        'LAB': 'Bureau de Labé',
        'BOK': 'Bureau de Boké',
        'SIG': 'Bureau de Siguiri'
      };
      
      return defaultNames[code] || `Bureau ${code}`;
    }
    
    // ========== CONSTRUCTEUR ==========
    
    /**
     * Constructeur qui initialise et synchronise toutes les propriétés
     */
    constructor(data?: Partial<Quittance>) {
      if (data) {
        // Assigner toutes les propriétés
        Object.assign(this, data);
        
        // Synchroniser après assignation
        this.syncProperties();
      }
    }
    
    // ========== MÉTHODES STATIQUES ==========
    
    /**
     * Crée une quittance à partir des paramètres API
     */
    static fromApiParams(bureau: string, annee: number | string, code: string, serie: string, numero: string): Quittance {
      return new Quittance({
        bureau,
        annee,
        code,
        serie,
        numero
      });
    }
    
    /**
     * Valide les paramètres API
     */
    static validateApiParams(bureau: string, annee: number | string, code: string, serie: string, numero: string): string[] {
      const errors: string[] = [];
      
      if (!bureau?.trim()) errors.push("Bureau requis");
      if (!annee || isNaN(Number(annee))) errors.push("Année invalide");
      if (!code?.trim()) errors.push("Code requis");
      if (!serie?.trim()) errors.push("Série requise");
      if (!numero?.trim()) errors.push("Numéro requis");
      
      return errors;
    }
  }
/* export class Quittance {




  
    dec_cod: string = "";
    dec_NAM: string = "";
     ide_CUO_COD: string = "";
    ide_reg_dat: string = "";
    ide_rcp_dat: string = "";
    ide_ast_dat: string = "";
   


    // Propriétés originales conservées pour compatibilité avec le code existant
    bureau: string = "";
    codDec: string = "";
    serliq: string = "";
    numliq: string = "";
    annee: string = "";
    
    // Nouvelles propriétés correspondant au contrôleur
    ideCuoCod: string = "";    // Équivalent à bureau
    decCod: string = "";       // Équivalent à codDec
    ideAstSer: string = "";    // Équivalent à serliq
    ideAstNbr: string = "";    // Équivalent à numliq
    decRefYer: string = "";    // Équivalent à annee
    
    // Autres propriétés existantes
    ideCuoNam: string = "";
    liquidation: string = "";
    quittance: string = "";
    enregistrement: string = "";
    ideRcpDat: string = "";
    cmpConCod: string = "";
    taxCod: string = "";
    totalTaxAmt: string = "";
    modePayement: string = "";
    codeDec: string = "";
    bnk: string = "";
    ref: string = "";
    cod: string = "";
    ideYea: string = "";
    totalFinAmtTbp: string = "";
    typeCombination: string = "";
    decRefNbr: string = "";
    
    // Méthode pour synchroniser les anciennes et nouvelles propriétés
    syncProperties(): void {
        // Synchroniser les propriétés si une mise à jour est faite sur un ensemble
        if (this.bureau && !this.ideCuoCod) this.ideCuoCod = this.bureau;
        if (this.ideCuoCod && !this.bureau) this.bureau = this.ideCuoCod;
        
        if (this.codDec && !this.decCod) this.decCod = this.codDec;
        if (this.decCod && !this.codDec) this.codDec = this.decCod;
        
        if (this.serliq && !this.ideAstSer) this.ideAstSer = this.serliq;
        if (this.ideAstSer && !this.serliq) this.serliq = this.ideAstSer;
        
        if (this.numliq && !this.ideAstNbr) this.ideAstNbr = this.numliq;
        if (this.ideAstNbr && !this.numliq) this.numliq = this.ideAstNbr;
        
        if (this.annee && !this.decRefYer) this.decRefYer = this.annee;
        if (this.decRefYer && !this.annee) this.annee = this.decRefYer;
    }
    
    // Constructeur qui initialise les deux ensembles de propriétés
    constructor(data?: Partial<Quittance>) {
        if (data) {
            Object.assign(this, data);
            this.syncProperties();
        }
    }
}
/*export class Quittance {

    bureau: string ="";
    codDec: string ="";
    serliq: string ="";
    numliq: string ="";
    annee: string ="";

    ideCuoNam: string ="";
    liquidation: string ="";
    quittance: string ="";
    enregistrement: string ="";
    ideRcpDat: string ="";


    cmpConCod: string ="";
    taxCod: string ="";
    totalTaxAmt: string ="";
    modePayement: string ="";
    codeDec: string ="";



    bnk: string ="";
    ref: string ="";
    cod: string ="";
    ideYea: string ="";


    totalFinAmtTbp: string ="";
    typeCombination: string ="";
    decRefNbr: string ="";
    decRefYer: string ="";


}
*/

 
