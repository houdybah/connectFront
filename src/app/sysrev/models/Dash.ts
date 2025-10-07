// src/app/models/container.ts
export interface Container {
    id: string;
    type: '20ft' | '40ft'; // Type de conteneur (20 pieds ou 40 pieds)
    status: 'waiting' | 'processing' | 'departed'; // Statut du conteneur
    arrivalDate: Date; // Date d'arrivée
    departureDate?: Date; // Date de sortie (si applicable)
    contents: string; // Description du contenu
    weight: number; // Poids en tonnes
    destination: string; // Destination
    customsChecked: boolean; // Si le conteneur a été vérifié par la douane
    qrCode: string; // Code QR pour identification
  }
  
  // src/app/models/truck.ts
  export interface Truck {
    id: string;
    licensePlate: string;
    driver: string;
    capacity: '20ft' | '40ft' | '2x20ft'; // Capacité du camion
    containers: Container[]; // Conteneurs chargés
    status: 'loading' | 'ready' | 'departing' | 'departed'; // Statut du camion
  }
  
  // src/app/models/customs-check.ts
  export interface CustomsCheck {
    id: string;
    containerId: string;
    officerId: string;
    officerName: string;
    timestamp: Date;
    approved: boolean;
    notes?: string;
  }
