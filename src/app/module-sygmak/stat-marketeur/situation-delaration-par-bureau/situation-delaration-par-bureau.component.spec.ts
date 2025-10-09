import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationDelarationParBureauComponent } from './situation-delaration-par-bureau.component';

describe('SituationDelarationParBureauComponent', () => {
  let component: SituationDelarationParBureauComponent;
  let fixture: ComponentFixture<SituationDelarationParBureauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationDelarationParBureauComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationDelarationParBureauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





