import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaComponent } from './quota.component';

describe('QuotaComponent', () => {
  let component: QuotaComponent;
  let fixture: ComponentFixture<QuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
