import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditComptantComponent } from './credit-comptant.component';

describe('CreditComptantComponent', () => {
  let component: CreditComptantComponent;
  let fixture: ComponentFixture<CreditComptantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditComptantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditComptantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








