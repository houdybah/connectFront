import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuAffectationComponent } from './recu-affectation.component';

describe('RecuAffectationComponent', () => {
  let component: RecuAffectationComponent;
  let fixture: ComponentFixture<RecuAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuAffectationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
