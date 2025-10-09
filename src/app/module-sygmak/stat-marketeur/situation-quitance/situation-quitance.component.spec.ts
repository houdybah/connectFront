import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationQuitanceComponent } from './situation-quitance.component';

describe('SituationQuitanceComponent', () => {
  let component: SituationQuitanceComponent;
  let fixture: ComponentFixture<SituationQuitanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SituationQuitanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituationQuitanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





