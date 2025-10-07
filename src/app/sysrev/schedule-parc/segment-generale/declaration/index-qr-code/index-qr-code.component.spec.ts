import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexQrCodeComponent } from './index-qr-code.component';

describe('IndexQrCodeComponent', () => {
  let component: IndexQrCodeComponent;
  let fixture: ComponentFixture<IndexQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexQrCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
