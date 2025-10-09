// Corrections et améliorations pour le modèle Signature

import { SignatureHistory } from "src/services/signature.service";

export class Signature {
  uuid!: string;  // ⬅️ Changé de uuid à UUID
  signatory_name: string;
  position: string;
  customs_office_code!: string;
  validFrom: Date | null;
  validTo: Date | null;
  signatureImage: Uint8Array | null;
  
  // Propriétés calculées
  private _imageUrl: string | null = null;

  /* constructor(
    uuid: string,
    signatoryName: string,
    position: string,
    ideCuoCod: string,
    validFrom: Date | null = null,
    validTo: Date | null = null,
    signatureImage: Uint8Array | null = null
  ) {
    this.uuid = uuid;
    this.signatoryName = signatoryName;
    this.position = position;
    this.ideCuoCod = ideCuoCod;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.signatureImage = signatureImage;
  }
*/
constructor(
  uuid: string,
  signatoryName: string,
  position: string,
  ideCuoCod: string,
  validFrom: Date | null = null,
  validTo: Date | null = null,
  signatureImage: Uint8Array | null = null
) {
  console.log('🔧 CONSTRUCTEUR - uuid reçu:', uuid, 'type:', typeof uuid);
  console.log('🔧 CONSTRUCTEUR - signatoryName reçu:', signatoryName);
  
  this.uuid = uuid;
  this.signatory_name = signatoryName;
  this.position = position;
  this.customs_office_code = ideCuoCod;
  this.validFrom = validFrom;
  this.validTo = validTo;
  this.signatureImage = signatureImage;
  
  console.log('🔧 CONSTRUCTEUR - this.uuid après assignation:', this.uuid);
  console.log('🔧 CONSTRUCTEUR - signature complète:', this);
}
  /**
   * Crée une instance Signature depuis un objet SignatureHistory
   */
  /* static fromSignatureHistory(history: SignatureHistory): Signature {
    const validFrom = history.validFrom ? new Date(history.validFrom) : null;
    const validTo = history.validTo ? new Date(history.validTo) : null;
    
    // Convertir le tableau de bytes en Uint8Array si nécessaire
    let imageArray: Uint8Array | null = null;
    if (history.signatureImage) {
      if (history.signatureImage instanceof Uint8Array) {
        imageArray = history.signatureImage;
      } else if (Array.isArray(history.signatureImage)) {
        imageArray = new Uint8Array(history.signatureImage);
      }
    }
    
    return new Signature(
      history.uuid,
      history.signatoryName,
      history.position,
      history.ideCuoCod,
      validFrom,
      validTo,
      imageArray
    );
  }
*/
/*static fromSignatureHistory(history: SignatureHistory): Signature {
  console.log('🔧 fromSignatureHistory - ENTRÉE:', history);
  console.log('🔧 fromSignatureHistory - history.uuid:', history.uuid);
  console.log('🔧 fromSignatureHistory - typeof history.uuid:', typeof history.uuid);
  
  const validFrom = history.validFrom ? new Date(history.validFrom) : null;
  const validTo = history.validTo ? new Date(history.validTo) : null;
  
  // Convertir le tableau de bytes en Uint8Array si nécessaire
  let imageArray: Uint8Array | null = null;
  if (history.signatureImage) {
    if (history.signatureImage instanceof Uint8Array) {
      imageArray = history.signatureImage;
    } else if (Array.isArray(history.signatureImage)) {
      imageArray = new Uint8Array(history.signatureImage);
    }
  }
  
  console.log('🔧 fromSignatureHistory - AVANT new Signature, uuid=', history.uuid);
  
  const signature = new Signature(
    history.uuid,
    history.signatoryName,
    history.position,
    history.ideCuoCod,
    validFrom,
    validTo,
    imageArray
  );
  
  console.log('🔧 fromSignatureHistory - APRÈS new Signature:', signature);
  console.log('🔧 fromSignatureHistory - signature.uuid final:', signature.uuid);
  
  return signature;
}
  */

static fromSignatureHistory(history: SignatureHistory | any): Signature {
  console.log('========== DEBUG fromSignatureHistory ==========');
  console.log('🔧 history reçu:', history);
  console.log('🔧 typeof history:', typeof history);
  console.log('🔧 history.uuid:', history.uuid);
  console.log('🔧 history.UUID:', (history as any).UUID);
  console.log('🔧 Object.keys(history):', Object.keys(history || {}));
  console.log('🔧 JSON.stringify(history):', JSON.stringify(history, null, 2));
  
  const validFrom = history.validFrom ? new Date(history.validFrom) : null;
  const validTo = history.validTo ? new Date(history.validTo) : null;
  
  let imageArray: Uint8Array | null = null;
  if (history.signatureImage) {
    if (history.signatureImage instanceof Uint8Array) {
      imageArray = history.signatureImage;
    } else if (Array.isArray(history.signatureImage)) {
      imageArray = new Uint8Array(history.signatureImage);
    }
  }
  
  // Test toutes les possibilités d'UUID
  const possibleUuids = [
    history.uuid,
    (history as any).UUID,
    (history as any).id,
    (history as any).Id,
    (history as any).ID
  ];
  
  console.log('🔧 UUIDs possibles:', possibleUuids);
  
  const uuid = possibleUuids.find(u => u && u.trim() !== '') || '';
  console.log('🔧 UUID final choisi:', uuid);
  
  if (!uuid) {
    console.error('❌ AUCUN UUID TROUVÉ !');
    console.error('❌ Données disponibles:', history);
  }
  
  const signature = new Signature(
    uuid,
    history.signatoryName || '',
    history.position || '',
    history.ideCuoCod || '',
    validFrom,
    validTo,
    imageArray
  );
  
  console.log('🔧 Signature créée avec UUID:', signature.uuid);
  console.log('========== FIN DEBUG fromSignatureHistory ==========');
  
  return signature;
}
  /**
   * Crée une instance Signature depuis un objet JSON générique
   */
  static fromJson(json: any): Signature {
    const validFrom = json.validFrom ? new Date(json.validFrom) : null;
    const validTo = json.validTo ? new Date(json.validTo) : null;
    
    let imageArray: Uint8Array | null = null;
    if (json.signatureImage) {
      if (json.signatureImage instanceof Uint8Array) {
        imageArray = json.signatureImage;
      } else if (Array.isArray(json.signatureImage)) {
        imageArray = new Uint8Array(json.signatureImage);
      }
    }
    
    return new Signature(
      json.uuid,
      json.signatoryName,
      json.position,
      json.ideCuoCod,
      validFrom,
      validTo,
      imageArray
    );
  }

  /**
   * Vérifie si la signature est actuellement valide
   */
  isCurrentlyValid(): boolean {
    const now = new Date();
    return this.isValidAtDate(now);
  }

  /**
   * Vérifie si la signature est valide à une date donnée
   */
  isValidAtDate(date: Date): boolean {
    const testDate = new Date(date);
    
    // Vérifier si la date est après le début de validité (si défini)
    if (this.validFrom && testDate < this.validFrom) {
      return false;
    }
    
    // Vérifier si la date est avant la fin de validité (si défini)
    if (this.validTo && testDate > this.validTo) {
      return false;
    }
    
    return true;
  }

  /**
   * Vérifie si la signature expire dans un certain nombre de jours
   */
  isExpiringWithin(days: number): boolean {
    if (!this.validTo) {
      return false; // Pas de date d'expiration
    }
    
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return this.validTo <= futureDate && this.validTo > now;
  }

  /**
   * Vérifie si la signature est spécifique à un bureau
   */
  isBureauSpecific(): boolean {
    return this.customs_office_code !== 'ALL';
  }

  /**
   * Obtient l'URL de l'image de signature
   */
  getImageUrl(): string {
    if (!this.signatureImage || this.signatureImage.length === 0) {
      return '';
    }
    
    // Réutiliser l'URL existante si elle existe
    if (this._imageUrl) {
      return this._imageUrl;
    }
    
    // Créer une nouvelle URL blob
    try {
      const blob = new Blob([this.signatureImage], { type: 'image/png' });
      this._imageUrl = URL.createObjectURL(blob);
      return this._imageUrl;
    } catch (error) {
      console.error('Erreur lors de la création de l\'URL image:', error);
      return '';
    }
  }

  /**
   * Libère l'URL de l'image pour éviter les fuites mémoire
   */
  revokeImageUrl(): void {
    if (this._imageUrl) {
      URL.revokeObjectURL(this._imageUrl);
      this._imageUrl = null;
    }
  }

  /**
   * Obtient une description de la période de validité
   */
  getValidityPeriodDescription(): string {
    if (!this.validFrom && !this.validTo) {
      return 'Validité indéfinie';
    }
    
    const formatDate = (date: Date) => date.toLocaleDateString('fr-FR');
    
    if (this.validFrom && !this.validTo) {
      return `Valide à partir du ${formatDate(this.validFrom)}`;
    }
    
    if (!this.validFrom && this.validTo) {
      return `Valide jusqu'au ${formatDate(this.validTo)}`;
    }
    
    return `Valide du ${formatDate(this.validFrom!)} au ${formatDate(this.validTo!)}`;
  }

  /**
   * Obtient le statut de validité sous forme de texte
   */
  getValidityStatus(): string {
    const now = new Date();
    
    // Vérifier si la signature est en attente (date de début future)
    if (this.validFrom && now < this.validFrom) {
      return 'En attente';
    }
    
    // Vérifier si la signature est expirée
    if (this.validTo && now > this.validTo) {
      return 'Expirée';
    }
    
    // Vérifier si la signature expire bientôt
    if (this.isExpiringWithin(30)) {
      return 'Expire bientôt';
    }
    
    // Vérifier si la signature est actuellement valide
    if (this.isCurrentlyValid()) {
      return 'Valide';
    }
    
    return 'Invalide';
  }

  /**
   * Obtient la priorité de la signature pour le tri
   * Plus le nombre est bas, plus la priorité est haute
   */
  getPriority(): number {
    if (!this.isCurrentlyValid()) {
      return 999; // Priorité la plus basse pour les signatures invalides
    }
    
    if (this.isExpiringWithin(7)) {
      return 3; // Expire dans une semaine
    }
    
    if (this.isExpiringWithin(30)) {
      return 2; // Expire dans un mois
    }
    
    if (!this.validTo) {
      return 0; // Priorité la plus haute pour les signatures sans fin
    }
    
    return 1; // Priorité normale
  }

  /**
   * Compare cette signature avec une autre pour le tri
   */
  compareTo(other: Signature): number {
    // D'abord par priorité
    const priorityDiff = this.getPriority() - other.getPriority();
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Ensuite par date de création (plus récent en premier)
    // Note: Nous n'avons pas de date de création, donc on utilise validFrom
    if (this.validFrom && other.validFrom) {
      return other.validFrom.getTime() - this.validFrom.getTime();
    }
    
    // Finalement par nom
    return this.signatory_name.localeCompare(other.signatory_name);
  }

  /**
   * Obtient les jours restants avant expiration
   */
  getDaysUntilExpiration(): number | null {
    if (!this.validTo) {
      return null; // Pas d'expiration
    }
    
    const now = new Date();
    const diffTime = this.validTo.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Vérifie si la signature correspond à un terme de recherche
   */
  matchesSearchTerm(searchTerm: string): boolean {
    if (!searchTerm || searchTerm.trim() === '') {
      return true;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return this.signatory_name.toLowerCase().includes(term) ||
           this.position.toLowerCase().includes(term) ||
           this.customs_office_code.toLowerCase().includes(term) ||
           this.uuid.toLowerCase().includes(term);
  }

  /**
   * Convertit la signature en objet pour l'export
   */
  toExportObject(): any {
    return {
      uuid: this.uuid,
      signatoryName: this.signatory_name,
      position: this.position,
      bureau: this.customs_office_code,
      validFrom: this.validFrom ? this.validFrom.toISOString().split('T')[0] : '',
      validTo: this.validTo ? this.validTo.toISOString().split('T')[0] : '',
      status: this.getValidityStatus(),
      validityDescription: this.getValidityPeriodDescription(),
      daysUntilExpiration: this.getDaysUntilExpiration(),
      isBureauSpecific: this.isBureauSpecific()
    };
  }

  /**
   * Clone la signature
   */
  clone(): Signature {
    return new Signature(
      this.uuid,
      this.signatory_name,
      this.position,
      this.customs_office_code,
      this.validFrom ? new Date(this.validFrom) : null,
      this.validTo ? new Date(this.validTo) : null,
      this.signatureImage ? new Uint8Array(this.signatureImage) : null
    );
  }

  /**
   * Nettoie les ressources (à appeler lors de la destruction)
   */
  dispose(): void {
    this.revokeImageUrl();
  }
}
