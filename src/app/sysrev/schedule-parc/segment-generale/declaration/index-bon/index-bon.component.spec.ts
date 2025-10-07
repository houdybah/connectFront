import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexBonComponent } from './index-bon.component';

describe('IndexBonComponent', () => {
  let component: IndexBonComponent;
  let fixture: ComponentFixture<IndexBonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexBonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexBonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
