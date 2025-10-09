import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LfImportComponent } from './lf-import.component';

describe('LfImportComponent', () => {
  let component: LfImportComponent;
  let fixture: ComponentFixture<LfImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LfImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LfImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








