import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteTabsComponent } from './unite-tabs.component';

describe('UniteTabsComponent', () => {
  let component: UniteTabsComponent;
  let fixture: ComponentFixture<UniteTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniteTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniteTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








