import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceTabsComponent } from './reference-tabs.component';

describe('ReferenceTabsComponent', () => {
  let component: ReferenceTabsComponent;
  let fixture: ComponentFixture<ReferenceTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








