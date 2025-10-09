import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametresTabsComponent } from './parametres-tabs.component';

describe('ParametresTabsComponent', () => {
  let component: ParametresTabsComponent;
  let fixture: ComponentFixture<ParametresTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametresTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametresTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








