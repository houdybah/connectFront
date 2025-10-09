import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationDecadaireComponent } from './situation-decadaire.component';

describe('SituationDecadaireComponent', () => {
  let component: SituationDecadaireComponent;
  let fixture: ComponentFixture<SituationDecadaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationDecadaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationDecadaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





