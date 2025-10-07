import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPayementComponent } from './list-payement.component';

describe('ListPayementComponent', () => {
  let component: ListPayementComponent;
  let fixture: ComponentFixture<ListPayementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPayementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
