import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Container, DashboardStats, Program } from '../models/Container';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  private apiUrl = 'api/containers'; 
  
  
  

  
  // Données simulées pour la démonstration
  private mockContainers: Container[] = Array(100).fill(0).map((_, i) => ({
    id: `C${10000 + i}`,
    reference: `REF-${100000 + i}`,
    status: i % 3 === 0 ? 'completed' : 'pending',
    isPurged: i % 5 === 0,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    exitDate: i % 3 === 0 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : undefined,
    program: `PROG-${i % 20 + 1}`,
    destination: ['Port A', 'Port B', 'Port C', 'Port D'][i % 4],
    weight: 5000 + Math.round(Math.random() * 15000),
    type: ['20FT', '40FT', '40HC', '45HC'][i % 4]
  }));

  private mockPrograms: Program[] = Array(20).fill(0).map((_, i) => ({
    id: `P${i + 1}`,
    name: `Programme ${i + 1}`,
    code: `PROG-${i + 1}`,
    priority: Math.floor(Math.random() * 5) + 1,
    scheduledDate: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000),
    containersCount: Math.floor(Math.random() * 20) + 1
  }));

  constructor(private http: HttpClient) { }

  // Récupérer tous les conteneurs
  getContainers(): Observable<Container[]> {
    // return this.http.get<Container[]>(this.apiUrl);
    return of(this.mockContainers);
  }

  // Récupérer les conteneurs en attente
  getPendingContainers(): Observable<Container[]> {
    return this.getContainers().pipe(
      map(containers => containers.filter(c => c.status === 'pending'))
    );
  }

  // Récupérer les conteneurs sortis
  getCompletedContainers(): Observable<Container[]> {
    return this.getContainers().pipe(
      map(containers => containers.filter(c => c.status === 'completed'))
    );
  }

  // Récupérer les statistiques pour le tableau de bord
  getDashboardStats(): Observable<DashboardStats> {
    return this.getContainers().pipe(
      map(containers => {
        const totalContainers = containers.length;
        const pendingContainers = containers.filter(c => c.status === 'pending').length;
        const completedContainers = containers.filter(c => c.status === 'completed').length;
        const purgedContainers = containers.filter(c => c.isPurged).length;
        const notPurgedContainers = totalContainers - purgedContainers;
        
        return {
          pendingContainers,
          completedContainers,
          purgedContainers,
          notPurgedContainers,
          totalContainers
        };
      })
    );
  }

  // Récupérer les 50 premiers programmes pour la sortie par jour
  getTopPrograms(count: number = 50): Observable<Program[]> {
    // Tri par date prévue et priorité
    return of(this.mockPrograms.sort((a, b) => {
      if (a.scheduledDate.getTime() !== b.scheduledDate.getTime()) {
        return a.scheduledDate.getTime() - b.scheduledDate.getTime();
      }
      return a.priority - b.priority;
    }).slice(0, count));
  }

  // Grouper les conteneurs par programmes
  getContainersByProgram(): Observable<{ program: string; count: number }[]> {
    return this.getContainers().pipe(
      map((containers: any[]) => {
        const programCounts: { [key: string]: number } = {};
        containers.forEach(container => {
          if (!programCounts[container.program]) {
            programCounts[container.program] = 0;
          }
          programCounts[container.program]++;
        });
        
        return Object.keys(programCounts).map(program => ({
          program,
          count: programCounts[program]
        })).sort((a, b) => b.count - a.count);
      })
    );
  }


  

}




