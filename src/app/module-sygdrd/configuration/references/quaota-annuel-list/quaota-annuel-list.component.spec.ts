import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaotaAnnuelListComponent } from './quaota-annuel-list.component';

describe('QuaotaAnnuelListComponent', () => {
  let component: QuaotaAnnuelListComponent;
  let fixture: ComponentFixture<QuaotaAnnuelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuaotaAnnuelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuaotaAnnuelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








