import { Page } from "./Page";

  
export interface PagedData<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    page?: Page;  // Ajoutez cette propriété si nécessaire

       totalPages?: number; // optionnel si tu veux
  }
  