import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationEnUnComponent } from './situation-en-un.component';

describe('SituationEnUnComponent', () => {
  let component: SituationEnUnComponent;
  let fixture: ComponentFixture<SituationEnUnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SituationEnUnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationEnUnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








