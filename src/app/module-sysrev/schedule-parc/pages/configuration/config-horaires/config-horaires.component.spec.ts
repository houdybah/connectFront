import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigHorairesComponent } from './config-horaires.component';

describe('ConfigHorairesComponent', () => {
  let component: ConfigHorairesComponent;
  let fixture: ComponentFixture<ConfigHorairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigHorairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigHorairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
