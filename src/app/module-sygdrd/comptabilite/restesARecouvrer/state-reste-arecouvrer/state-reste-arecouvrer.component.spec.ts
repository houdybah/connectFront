import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateResteArecouvrerComponent } from './state-reste-arecouvrer.component';

describe('StateResteArecouvrerComponent', () => {
  let component: StateResteArecouvrerComponent;
  let fixture: ComponentFixture<StateResteArecouvrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateResteArecouvrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateResteArecouvrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








