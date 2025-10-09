import {VentilationParRubrique} from "./VentilationParRubrique";

export class LF {
    uuid: string = '';
    reference: string = '';
    qta: number = 0;
    type: string = '';
    uuidEexercice: string = '';
    ventilations?: VentilationParRubrique[] = [];
    exerciceAnnee?: string;  // Used for display purposes only
}



