import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementListComponent } from './abonnement-list.component';

describe('AbonnementListComponent', () => {
  let component: AbonnementListComponent;
  let fixture: ComponentFixture<AbonnementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbonnementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbonnementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





