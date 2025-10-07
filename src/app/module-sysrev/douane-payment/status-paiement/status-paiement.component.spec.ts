import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPaiementComponent } from './status-paiement.component';

describe('StatusPaiementComponent', () => {
  let component: StatusPaiementComponent;
  let fixture: ComponentFixture<StatusPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusPaiementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
