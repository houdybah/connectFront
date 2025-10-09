import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceAbonnementListComponent } from './reference-abonnement-list.component';

describe('ReferenceAbonnementListComponent', () => {
  let component: ReferenceAbonnementListComponent;
  let fixture: ComponentFixture<ReferenceAbonnementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceAbonnementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceAbonnementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





