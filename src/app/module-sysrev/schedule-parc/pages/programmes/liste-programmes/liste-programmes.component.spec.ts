import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeProgrammesComponent } from './liste-programmes.component';

describe('ListeProgrammesComponent', () => {
  let component: ListeProgrammesComponent;
  let fixture: ComponentFixture<ListeProgrammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeProgrammesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeProgrammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
