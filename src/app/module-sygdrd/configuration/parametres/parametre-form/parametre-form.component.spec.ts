import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreFormComponent } from './parametre-form.component';

describe('ParametreFormComponent', () => {
  let component: ParametreFormComponent;
  let fixture: ComponentFixture<ParametreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








