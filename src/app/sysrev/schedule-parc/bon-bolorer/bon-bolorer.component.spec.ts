import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonBolorerComponent } from './bon-bolorer.component';

describe('BonBolorerComponent', () => {
  let component: BonBolorerComponent;
  let fixture: ComponentFixture<BonBolorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BonBolorerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonBolorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
