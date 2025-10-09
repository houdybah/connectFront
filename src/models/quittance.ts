export class Quittance {
    ideCuoCod:string = "";
    ideTypSad:string = "";
    rlsCuoCod:string = "";
    cmpConNam:string = "";
    cmpConCod:string = "";
    cmpExpCod:string = "";
    decCod:string = "";
    decNam:string = "";
    decRep:string = "";
    ideRcpTyp:string = "";
    tptTodPlc:string = "";
    tptCuoCod:string = "";
    finMpn:string = "";
    ideRegSer:string = "";
    ideRegDat:string = "";
    ideAstSer:string = "";
    ideAstDat:string = "";
    ideRcpSer:string = "";
    ideRcpDat:string = "";
    finAmtDty:string = "";
    
    // Propriétés additionnelles
    decRefYer?: string;
    ideAstNbr?: string;
    dec_NAM?: string;
    liquidation?: string;
    ide_ast_dat?: string;
    enregistrement?: string;
    ide_reg_dat?: string;
    quittance?: string;
    ide_rcp_dat?: string;
    ref?: string;
    totalFinAmtTbp?: string;
    totalTaxAmt?: string;
    ide_CUO_COD?: string;
    dec_cod?: string;
    cmp_con_cod?: string;

    constructor(data?: Partial<Quittance>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    getValidationErrors(): string[] {
        const errors: string[] = [];
        if (!this.ideCuoCod) errors.push('Bureau requis');
        if (!this.decRefYer) errors.push('Année requise');
        if (!this.decCod) errors.push('Code déclaration requis');
        if (!this.ideAstSer) errors.push('Série requise');
        if (!this.ideAstNbr) errors.push('Numéro requis');
        return errors;
    }

    getApiParams(): any {
        return {
            bureau: this.ideCuoCod || '',
            annee: this.decRefYer || '',
            code: this.decCod || '',
            serie: this.ideAstSer || '',
            numero: this.ideAstNbr || ''
        };
    }

    isValid(): boolean {
        return !!(this.ideCuoCod && this.decRefYer && this.decCod && this.ideAstSer && this.ideAstNbr);
    }

    syncProperties(): void {
        // Synchroniser les propriétés avec différentes notations
        if (this.ide_CUO_COD && !this.ideCuoCod) this.ideCuoCod = this.ide_CUO_COD;
        if (this.dec_cod && !this.decCod) this.decCod = this.dec_cod;
        if (this.ide_rcp_dat && !this.ideRcpDat) this.ideRcpDat = this.ide_rcp_dat;
        if (this.ide_ast_dat && !this.ideAstDat) this.ideAstDat = this.ide_ast_dat;
        if (this.ide_reg_dat && !this.ideRegDat) this.ideRegDat = this.ide_reg_dat;
        if (this.cmp_con_cod && !this.cmpConCod) this.cmpConCod = this.cmp_con_cod;
    }

    getUniqueKey(): string {
        return `${this.ideCuoCod}-${this.decRefYer}-${this.decCod}-${this.ideAstSer}-${this.ideAstNbr}`;
    }

    getSuggestedFilename(): string {
        return `quittance_${this.ideCuoCod}_${this.decRefYer}_${this.decCod}_${this.ideAstSer}_${this.ideAstNbr}.pdf`;
    }
}
