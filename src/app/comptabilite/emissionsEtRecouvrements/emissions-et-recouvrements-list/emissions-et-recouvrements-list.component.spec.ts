import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsEtRecouvrementsListComponent } from './emissions-et-recouvrements-list.component';

describe('EmissionsEtRecouvrementsListComponent', () => {
  let component: EmissionsEtRecouvrementsListComponent;
  let fixture: ComponentFixture<EmissionsEtRecouvrementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionsEtRecouvrementsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmissionsEtRecouvrementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
