import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfFormComponent } from './lf-form.component';

describe('LfFormComponent', () => {
  let component: LfFormComponent;
  let fixture: ComponentFixture<LfFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LfFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








