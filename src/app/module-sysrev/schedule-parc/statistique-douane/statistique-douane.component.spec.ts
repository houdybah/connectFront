import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueDouaneComponent } from './statistique-douane.component';

describe('StatistiqueDouaneComponent', () => {
  let component: StatistiqueDouaneComponent;
  let fixture: ComponentFixture<StatistiqueDouaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiqueDouaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueDouaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
