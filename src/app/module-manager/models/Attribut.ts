export class Attribut {
  uuid?: string;
  cle: string = '';
  valeur: string = '';
  uuidUtilisateur?: string;
  dateCreated?: Date;
  lastUpdated?: Date;

  constructor(data?: Partial<Attribut>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
