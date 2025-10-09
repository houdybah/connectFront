import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaotaAnnuelFormComponent } from './quaota-annuel-form.component';

describe('QuaotaAnnuelFormComponent', () => {
  let component: QuaotaAnnuelFormComponent;
  let fixture: ComponentFixture<QuaotaAnnuelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuaotaAnnuelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuaotaAnnuelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








