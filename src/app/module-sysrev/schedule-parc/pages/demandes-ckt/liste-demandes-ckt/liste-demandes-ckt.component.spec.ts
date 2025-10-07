import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDemandesCktComponent } from './liste-demandes-ckt.component';

describe('ListeDemandesCktComponent', () => {
  let component: ListeDemandesCktComponent;
  let fixture: ComponentFixture<ListeDemandesCktComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeDemandesCktComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDemandesCktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
