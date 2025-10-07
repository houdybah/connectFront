import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAppurementComponent } from './liste-appurement.component';

describe('ListeAppurementComponent', () => {
  let component: ListeAppurementComponent;
  let fixture: ComponentFixture<ListeAppurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeAppurementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeAppurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
