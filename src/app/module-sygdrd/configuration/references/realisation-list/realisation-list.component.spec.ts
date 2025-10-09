import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationListComponent } from './realisation-list.component';

describe('RealisationListComponent', () => {
  let component: RealisationListComponent;
  let fixture: ComponentFixture<RealisationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealisationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








