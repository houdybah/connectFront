// src/app/models/user.model.ts
export interface User {
    id?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    blocked: boolean;
    createdAt?: Date;
  }
  
  export interface UserPage {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
