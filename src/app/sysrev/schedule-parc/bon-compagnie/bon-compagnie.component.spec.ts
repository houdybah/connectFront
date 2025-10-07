import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonCompagnieComponent } from './bon-compagnie.component';

describe('BonCompagnieComponent', () => {
  let component: BonCompagnieComponent;
  let fixture: ComponentFixture<BonCompagnieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BonCompagnieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonCompagnieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
