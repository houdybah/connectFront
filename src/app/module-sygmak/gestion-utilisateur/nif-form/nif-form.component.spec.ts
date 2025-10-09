import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NifFormComponent } from './nif-form.component';

describe('NifFormComponent', () => {
  let component: NifFormComponent;
  let fixture: ComponentFixture<NifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NifFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





