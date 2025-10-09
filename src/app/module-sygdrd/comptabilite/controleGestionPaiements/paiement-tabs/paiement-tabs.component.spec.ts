import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementTabsComponent } from './paiement-tabs.component';

describe('PaiementTabsComponent', () => {
  let component: PaiementTabsComponent;
  let fixture: ComponentFixture<PaiementTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








