import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCamionsComponent } from './liste-camions.component';

describe('ListeCamionsComponent', () => {
  let component: ListeCamionsComponent;
  let fixture: ComponentFixture<ListeCamionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCamionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCamionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
