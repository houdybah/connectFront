import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScannerTwoComponent } from './qrcode-scanner-two.component';

describe('QrcodeScannerTwoComponent', () => {
  let component: QrcodeScannerTwoComponent;
  let fixture: ComponentFixture<QrcodeScannerTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrcodeScannerTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeScannerTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
