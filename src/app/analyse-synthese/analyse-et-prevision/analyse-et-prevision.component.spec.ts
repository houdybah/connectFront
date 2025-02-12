import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseEtPrevisionComponent } from './analyse-et-prevision.component';

describe('AnalyseEtPrevisionComponent', () => {
  let component: AnalyseEtPrevisionComponent;
  let fixture: ComponentFixture<AnalyseEtPrevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyseEtPrevisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyseEtPrevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
