import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsEtRecouvrementsFormComponent } from './emissions-et-recouvrements-form.component';

describe('EmissionsEtRecouvrementsFormComponent', () => {
  let component: EmissionsEtRecouvrementsFormComponent;
  let fixture: ComponentFixture<EmissionsEtRecouvrementsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsEtRecouvrementsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionsEtRecouvrementsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
