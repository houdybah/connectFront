import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatScannerComponent } from './resultat-scanner.component';

describe('ResultatScannerComponent', () => {
  let component: ResultatScannerComponent;
  let fixture: ComponentFixture<ResultatScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultatScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
