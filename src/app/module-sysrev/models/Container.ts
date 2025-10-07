export interface Container {
    id: string;
    reference: string;
    status: 'pending' | 'completed';
    isPurged: boolean;
    createdAt: Date;
    exitDate?: Date;
    program: string;
    destination: string;
    weight: number;
    type: string;
  }
  
  // src/app/models/program.model.ts
  export interface Program {
    id: string;
    name: string;
    code: string;
    priority: number;
    scheduledDate: Date;
    containersCount: number;
  }
  
  // src/app/models/dashboard-stats.model.ts
  export interface DashboardStats {
    pendingContainers: number;
    completedContainers: number;
    purgedContainers: number;
    notPurgedContainers: number;
    totalContainers: number;
  }
