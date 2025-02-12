import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreListComponent } from './parametre-list.component';

describe('ParametreListComponent', () => {
  let component: ParametreListComponent;
  let fixture: ComponentFixture<ParametreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametreListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
