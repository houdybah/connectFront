import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationDelarationParCodeDecComponent } from './situation-delaration-par-code-dec.component';

describe('SituationDelarationParCodeDecComponent', () => {
  let component: SituationDelarationParCodeDecComponent;
  let fixture: ComponentFixture<SituationDelarationParCodeDecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationDelarationParCodeDecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationDelarationParCodeDecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





