import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionResteArecouvrerComponent } from './edition-reste-arecouvrer.component';

describe('EditionResteArecouvrerComponent', () => {
  let component: EditionResteArecouvrerComponent;
  let fixture: ComponentFixture<EditionResteArecouvrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionResteArecouvrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionResteArecouvrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








