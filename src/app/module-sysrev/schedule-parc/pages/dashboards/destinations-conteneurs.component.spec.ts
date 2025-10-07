import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsConteneursComponent } from './destinations-conteneurs.component';

describe('DestinationsConteneursComponent', () => {
  let component: DestinationsConteneursComponent;
  let fixture: ComponentFixture<DestinationsConteneursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationsConteneursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationsConteneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
