import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexPayementComponent } from './index-payement.component';

describe('IndexPayementComponent', () => {
  let component: IndexPayementComponent;
  let fixture: ComponentFixture<IndexPayementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexPayementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexPayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
