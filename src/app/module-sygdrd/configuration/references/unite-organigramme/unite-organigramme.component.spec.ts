import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteOrganigrammeComponent } from './unite-organigramme.component';

describe('UniteOrganigrammeComponent', () => {
  let component: UniteOrganigrammeComponent;
  let fixture: ComponentFixture<UniteOrganigrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UniteOrganigrammeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniteOrganigrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








