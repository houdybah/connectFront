import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Unite } from "../../../models/Unite";
import { UniteService } from "../../../services/unite.service";
import { Page } from "../../../models/Page";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-organigramme',
  templateUrl: './organigramme.component.html',
  styleUrl: './organigramme.component.scss'
})
export class OrganigrammeComponent implements OnInit {
  douanesData: Unite[] = [];
  hierarchyData: Unite | null = null;
  outerUnite: any;

  // Variables pour le zoom et le panoramique
  currentZoom: number = 1;
  minZoom: number = 0.5;
  maxZoom: number = 2;
  zoomStep: number = 0.1;

  // Variables pour le panoramique
  isPanning: boolean = false;
  startX: number = 0;
  startY: number = 0;
  panX: number = 0;
  panY: number = 0;

  // Variables pour la recherche
  searchText: string = '';
  highlightedNodeId: string | null = null;



  // Variables pour les notifications
  showToast: boolean = false;
  toastMessage: string = '';

  @ViewChild('orgChartContainer') orgChartContainer!: ElementRef;


  constructor(private uniteService: UniteService,private modalService: NgbModal) {}

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      event.preventDefault();
      const zoom = event.deltaY > 0 ? -this.zoomStep : this.zoomStep;
      this.adjustZoom(zoom);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let pageSelected: Page = new Page();
    pageSelected.pageNumber = 0;
    pageSelected.size = 10000;

    this.uniteService.getUnitess(pageSelected, "").subscribe((pagedData: any) => {
      this.douanesData = pagedData.data;
      console.log(this.douanesData);
      // Initialiser les propriétés collapsed pour chaque nœud
      this.douanesData.forEach(unit => {
        unit.collapsed = false;
      });

      this.hierarchyData = this.buildHierarchy(this.douanesData);
      this.calculateChildCounts(this.hierarchyData);

      // Centrer l'organigramme après le chargement
      setTimeout(() => {
        this.centerOrgChart();
      }, 100);
    });
  }

  // Calculer le nombre d'enfants pour chaque nœud (enfants directs + sous-enfants)
  calculateChildCounts(node: Unite | null): number {
    if (!node || !node.children || node.children.length === 0) {
      return 0;
    }

    let count = node.children.length;

    node.children.forEach(child => {
      count += this.calculateChildCounts(child);
    });

    node.childCount = count;
    return count;
  }

  // Construire la hiérarchie à partir des données
  buildHierarchy(data: Unite[]): Unite | null {
    const units: { [key: string]: Unite } = {};
    const root: { children?: Unite[] } = {};

    // Créer un dictionnaire des unités par UUID
    data.forEach(unit => {
      units[unit.uuid] = { ...unit, children: [], collapsed: false };
    });

    // Construire la hiérarchie
    data.forEach(unit => {
      if (!unit.uuidUnitePere) {
        root.children = [units[unit.uuid]];
      } else if (units[unit.uuidUnitePere]) {
        if (!units[unit.uuidUnitePere].children) {
          units[unit.uuidUnitePere].children = [];
        }
        units[unit.uuidUnitePere].children!.push(units[unit.uuid]);
      }
    });

    // Trier les enfants par ordre alphabétique pour chaque niveau
    this.sortHierarchyByName(root.children ? root.children[0] : null);

    return root.children ? root.children[0] : null;
  }

  // Trier les enfants par ordre alphabétique dans toute la hiérarchie
  sortHierarchyByName(node: Unite | null): void {
    if (!node || !node.children || node.children.length === 0) {
      return;
    }

    // Trier les enfants directs par nomUnite
    node.children.sort((a, b) => a.nomUnite.localeCompare(b.nomUnite));

    // Récursivement trier les sous-niveaux
    node.children.forEach(child => {
      this.sortHierarchyByName(child);
    });
  }

  // Fonctions de zoom
  zoomIn(): void {
    this.adjustZoom(this.zoomStep);
  }

  zoomOut(): void {
    this.adjustZoom(-this.zoomStep);
  }

  adjustZoom(delta: number): void {
    let newZoom = this.currentZoom + delta;
    newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    this.currentZoom = newZoom;
  }

  // Fonctions de panoramique
  startPan(event: MouseEvent): void {
    if (event.button === 0) { // Bouton gauche uniquement
      this.isPanning = true;
      this.startX = event.clientX - this.panX;
      this.startY = event.clientY - this.panY;
      event.preventDefault();
    }
  }

  pan(event: MouseEvent): void {
    if (this.isPanning) {
      this.panX = event.clientX - this.startX;
      this.panY = event.clientY - this.startY;
      event.preventDefault();
    }
  }

  endPan(): void {
    this.isPanning = false;
  }

  // Réinitialiser la vue
  resetView(): void {
    this.currentZoom = 1;
    this.centerOrgChart();
  }

  // Centrer l'organigramme
  centerOrgChart(): void {
    if (this.orgChartContainer) {
      const containerRect = this.orgChartContainer.nativeElement.parentElement.getBoundingClientRect();
      this.panX = (containerRect.width / 2) - (this.orgChartContainer.nativeElement.offsetWidth / 2);
      this.panY = 0;
    }
  }

  // Fonction pour afficher/masquer les enfants d'un nœud
  toggleNode(node: Unite): void {
    if (node.children && node.children.length > 0) {
      node.collapsed = !node.collapsed;
    }
  }

  // Développer tous les nœuds
  expandAll(): void {
    this.setCollapsedStateRecursively(this.hierarchyData, false);
  }

  // Réduire tous les nœuds
  collapseAll(): void {
    this.setCollapsedStateRecursively(this.hierarchyData, true);
  }

  // Définir l'état de pliage pour un nœud et ses enfants
  setCollapsedStateRecursively(node: Unite | null, collapsed: boolean): void {
    if (!node) return;

    if (node.children && node.children.length > 0) {
      node.collapsed = collapsed;

      node.children.forEach(child => {
        this.setCollapsedStateRecursively(child, collapsed);
      });
    }
  }

  // Rechercher une unité
  searchUnite(): void {
    if (!this.searchText.trim() || !this.hierarchyData) {
      this.highlightedNodeId = null;
      return;
    }

    const searchTerm = this.searchText.trim().toLowerCase();
    const foundNode = this.findNodeByText(this.hierarchyData, searchTerm);

    if (foundNode) {
      this.highlightedNodeId = foundNode.uuid;

      // Développer les parents du nœud trouvé
      this.expandParents(this.hierarchyData, foundNode.uuid);

      // Faire défiler jusqu'au nœud trouvé (après le rendu)
      setTimeout(() => {
        const element = document.querySelector(`.org-node.highlighted .node-box`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    } else {
      this.highlightedNodeId = null;
      alert('Aucune unité trouvée avec ce terme de recherche.');
    }
  }

  // Trouver un nœud par texte (nom, code ou type)
  findNodeByText(node: Unite | null, searchTerm: string): Unite | null {
    if (!node) return null;

    if (
        node.nomUnite.toLowerCase().includes(searchTerm) ||
        node.codeUnite.toLowerCase().includes(searchTerm) ||
        node.typeUnite.toLowerCase().includes(searchTerm)
    ) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = this.findNodeByText(child, searchTerm);
        if (found) return found;
      }
    }

    return null;
  }

  // Développer les parents d'un nœud spécifique
  expandParents(rootNode: Unite | null, targetNodeId: string, path: Unite[] = []): boolean {
    if (!rootNode) return false;

    if (rootNode.uuid === targetNodeId) {
      // Développer tous les nœuds dans le chemin
      path.forEach(node => {
        node.collapsed = false;
      });
      return true;
    }

    if (rootNode.children) {
      for (const child of rootNode.children) {
        if (this.expandParents(child, targetNodeId, [...path, rootNode])) {
          rootNode.collapsed = false;
          return true;
        }
      }
    }

    return false;
  }


  openNodeDetails(event: MouseEvent, node: Unite): void {
    this.toggleNode(node);
  }

  protected readonly alert = alert;
}







