import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargementListComponent } from './rechargement-list.component';

describe('RechargementListComponent', () => {
  let component: RechargementListComponent;
  let fixture: ComponentFixture<RechargementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





