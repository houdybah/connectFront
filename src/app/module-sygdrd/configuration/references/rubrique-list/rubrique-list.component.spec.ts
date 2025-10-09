import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubriqueListComponent } from './rubrique-list.component';

describe('RubriqueListComponent', () => {
  let component: RubriqueListComponent;
  let fixture: ComponentFixture<RubriqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubriqueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubriqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








